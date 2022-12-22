import openSocket from "socket.io-client";
import { Cookies } from "react-cookie";
import { store } from "../store";
import Peer from "peerjs";
import { receiveMessageAction } from "../store/actions/messageAction";
import { buzzSwal, confirmSwal, countTime, textSwal } from "./swalServier";
import sound from "../sounds/join-permission.mp3";
import sound1 from "../sounds/meet-message-sound-1.mp3";
import { renewToken } from "../api/user.api";
import {
  roomAddRequestAction,
  roomCallSetPeerId,
  roomCallSetRequestsAction,
  roomSetRoomInfoAction,
  roomSetSocketAction,
} from "../store/actions/roomCallAction";
import { toastError, toastJoinLeaveRoom, toastJoinTable, toastRequest, toastText } from "./toastService";
import { removeSelectedVideoAction, setSelectedVideoAction } from "../store/actions/selectedVideoAction";
import { callAllSetHostShareStream, callAllSetHostStream, callAllSetIsCallAll } from "../store/actions/callAllAction";
import { shareScreenSetState } from "../store/actions/shareScreenAction";

var soundJoin = new Audio(sound);
var soundMessage = new Audio(sound1);

const peerEndPoint = {
  host: process.env.REACT_APP_HOST_NAME,
  path: "/peerjs/meeting",
  port: process.env.REACT_APP_HOST_PORT,
};
const socketRoomEndPoint = process.env.REACT_APP_SOCKET_HOST + "/rooms";
const cookies = new Cookies();

const initializePeerConnection = () => {
  return new Peer("", peerEndPoint);
};

const initializeSocketConnection = () => {
  const auth = cookies.get("u_auth");
  return openSocket(socketRoomEndPoint, {
    transports: ["websocket", "polling"],
    forceNew: true,
    auth: {
      token: "Bearer " + auth.accessToken,
    },
  });
};

class Connection {
  static myPeer;
  static sharePeer;
  static socket;
  static myID = null;
  static sharePeerId = null;
  static isMeetting = true;
  static canAccess = false;
  static access = false;
  //floor
  static currentFloor = null;
  //peers
  static peers = {};
  static sharePeers = {};
  static callAllPeers = {};
  //call all
  static hostPeer = null;
  static hostSharePeer = null;
  //messages
  static roomMessages = [];
  static tableMessages = [];
  //stream
  static myStream = {
    stream: null,
    media: { video: true, audio: true }
  };
  static shareStream = null;
  static isShare = false;
  static streamDatas = {};
  //joiner
  static joiners = [];
  //tables
  static tables = [];
  //join err
  static joinErr;
  //setting
  static setting;

  static staticContructor(setting) {
    this.setting = setting;
    this.myPeer = initializePeerConnection();
    this.socket = initializeSocketConnection();
    this.initializeSocketEvents();
    this.initializePeersEvents();
  }

  static accessRoom() {
    this.access = false;
    this.setting.updateInstance("access", true);
  };

  static initializeSocketEvents() {
    this.socket.on("connect", () => {
      store.dispatch(roomSetSocketAction(this.socket));
      this.setting.updateInstance(
        "canAccess",
        this.socket.connected && this.myID && this.myStream.stream
      );
    });

    this.socket.on("connect_error", async (err) => {
      if (err?.message !== "not authoried") return;
      const res = await renewToken();
      const accessToken = res.data;
      cookies.set(
        "u_auth",
        { ...cookies.get("u_auth"), accessToken },
        { path: "/" }
      );
      this.socket.auth = {
        token: "Bearer " + accessToken,
      };
      this.socket.connect();
    });

    this.socket.on("floor:tables", ({ tables, floor }) => {
      this.tables = tables;
      this.currentFloor = floor;
      this.setting.updateInstance("tables", [...this.tables]);
      this.setting.updateInstance("currentFloor", floor);
    });

    this.socket.on("room:user-request", (request) => {
      store.dispatch(roomAddRequestAction(request))
      toastRequest(request.user.name)
      soundJoin.play();
    });

    this.socket.on("room:requests", (requests) => {
      store.dispatch(roomCallSetRequestsAction(requests))
    });

    this.socket.on("room:user-joined", (users, { userDatas, state }) => {
      toastJoinLeaveRoom(userDatas, state);
      this.joiners = users;
      this.setting.updateInstance("joiners", users);
    });

    this.socket.on("room:info", (room) => {
      this.access = true;
      this.setting.updateInstance("access", this.access);
      store.dispatch(roomSetRoomInfoAction(room));
    });

    this.socket.on("room:messages", (messages) => {
      this.roomMessages = [...messages, ...this.roomMessages];
      this.setting.updateInstance("room:messages", [...this.roomMessages]);
    });

    this.socket.on("room:message", (message) => {
      this.roomMessages = [message, ...this.roomMessages];
      this.setting.updateInstance("room:messages", this.roomMessages);
      store.dispatch(receiveMessageAction());
      const showChat = store.getState().roomCall.showChat;
      if (!showChat) {
        soundMessage.play();
      }
    });

    this.socket.on("room:join-err", (err) => {
      this.joinErr = err;
      this.setting.updateInstance("join-err", { ...this.joinErr });
    });

    this.socket.on("room:divide-tables", (tables) => {
      this.clearPeers();
      store.dispatch(setSelectedVideoAction(null));

      this.myStream.stream?.getTracks().forEach((tr) => {
        tr.stop();
      });

      this.setting.updateInstance("myStream", { ...this.myStream });

      const currentUser = store.getState().userReducer?.user;

      const table = tables.find((t) => {
        return t.members.find((m) => m._id === currentUser._id);
      });
      if (!table) {
        return confirmSwal(
          "Error to join table",
          "You are not a member of any tables"
        );
      }

      countTime(
        "Divide into tables",
        "You will join your table <b></b> seconds",
        5,
        () => {
          this.socket.emit(
            "table:join",
            { tableId: table._id, floor: table.floor },
            this.myID,
            {
              audio: false,
              video: false,
            }
          );
        }
      );
    });

    this.socket.on("room:disconnect-reason", (reason) => {
      textSwal(reason, () => {
        window.location.reload();
      });
    })

    this.socket.on("room:buzz", (text) => {
      buzzSwal(text);
    });

    this.socket.on("room:present", ({ time, tables }) => {
      // this.tables = tables;
      this.clearPeers();
      this.streamDatas = {};
      store.dispatch(setSelectedVideoAction(null));
      this.setting.updateInstance("tables", [...this.tables]);
      //turn off video and audio
      this.myStream.stream.getTracks().forEach((tr) => {
        tr.stop();
      });
      this.setting.updateInstance("myStream", { ...this.myStream });
      //stop share screen
      if (this.shareStream) {
        const track = this.shareStream.getVideoTracks()[0];
        track?.stop();
        track.dispatchEvent(new Event('ended'))
      }
      //stop call all
      this.clearCallAllPeers();
      store.dispatch(callAllSetIsCallAll(false))


      countTime(
        "Participate Presentation",
        "You will participate in presentation <b></b> seconds",
        time,
        () => {
          this.socket.emit("present:join", this.myID, {
            audio: false,
            video: false,
          });
        }
      );
    });

    this.socket.on('room:host-close-call-all', (peerId) => {
      console.log('close call all')
      if (this.hostSharePeer) {
        this.hostSharePeer?.close();
        this.hostSharePeer = null;
        store.dispatch(callAllSetHostShareStream(null))
      }
      this.hostPeer.close();
      this.hostPeer = null;
      toastText('host just closed call all', 'dark');
      store.dispatch(callAllSetHostStream(null))
    })

    this.socket.on('room:user-stop-share-screen', ({ user, peerId }) => {
      toastText(`host stop share screen`);
      store.dispatch(removeSelectedVideoAction(peerId));
      this.hostSharePeer?.close();
      this.hostSharePeer = null;
      store.dispatch(callAllSetHostShareStream(null))
    })

    this.socket.on('room:user-share-screen', (data) => {
      const userCurrent = store.getState().userReducer;
      const { peerId, user } = data;

      toastText(`Host share screen`);

      const options = {
        metadata: {
          user: {
            name: userCurrent.user.name,
            _id: userCurrent.user._id,
            picture: userCurrent.user.picture,
          },
          media: Connection.getMediaStatus(this.myStream.stream),
          peerId: this.myID,
        },
      };

      const call = this.myPeer.call(peerId, this.myStream.stream, options);
      call.on("stream", (userStream) => {
        store.dispatch(callAllSetHostShareStream({
          user,
          stream: userStream,
          media: { video: true, audio: false },
          peerId,
        }))
        store.dispatch(setSelectedVideoAction(peerId))
      });

      call.on("close", () => {
        store.dispatch(callAllSetHostShareStream(null))
        this.hostSharePeer?.close();
        this.hostSharePeer = null;
      });

      call.on("error", () => {
        store.dispatch(callAllSetHostShareStream(null))
        console.log("peer error ------");
        this.hostSharePeer?.close();
        this.hostSharePeer = null;
      });

      this.hostSharePeer = call;
    })

    this.socket.on('room:host-call-all', (data) => {
      const { peerId, user, media } = data;
      toastText('host just called all');

      const options = {
        metadata: {
          type: 'callall'
        },
      };

      const call = this.myPeer.call(peerId, this.myStream.stream, options);

      call.on("stream", (userStream) => {
        store.dispatch(callAllSetHostStream({
          user,
          stream: userStream,
          media,
          peerId,
        }))
      });

      call.on("close", () => {
        this.peers[call.peer]?.close();
        store.dispatch(callAllSetHostStream(null))
      });

      call.on("error", () => {
        console.log("peer error ------")
        store.dispatch(callAllSetHostStream(null))
      })

      if (this.peers[call.peer]) {
        this.peers[call.peer].close();
        delete this.peers[call.peer]
      }
      if (this.hostPeer) {
        this.hostPeer.close();
        this.hostPeer = null
      }

      this.hostPeer = call;
    })

    this.socket.on('present:user-stop-share-screen', ({ user, peerId }) => {
      if (user) toastText(`${user.name} stop share screen`);
      store.dispatch(removeSelectedVideoAction(peerId));
      this.peers[peerId]?.close();
      delete this.streamDatas[peerId];
      this.setting.updateInstance("streamDatas", {
        ...this.streamDatas,
      });
    })

    this.socket.on("present:user-share-screen", (data) => {
      const userCurrent = store.getState().userReducer;
      const { peerId, user, subPeerId } = data;
      toastText(`${user.name} share screen`);

      const options = {
        metadata: {
          user: {
            name: userCurrent.user.name,
            _id: userCurrent.user._id,
            picture: userCurrent.user.picture,
          },
          media: Connection.getMediaStatus(this.myStream.stream),
          peerId: this.myID,
        },
      };

      const call = this.myPeer.call(peerId, this.myStream.stream, options);
      call.on("stream", (userStream) => {
        this.streamDatas[call.peer] = {
          user,
          stream: userStream,
          media: { video: true, audio: false },
          peerId,
          subPeerId
        };
        this.setting.updateInstance("streamDatas", {
          ...this.streamDatas,
        });
        store.dispatch(setSelectedVideoAction(peerId))
      });

      call.on("close", () => {
        this.peers[call.peer]?.close();
        delete this.streamDatas[call.peer];
        this.setting.updateInstance("streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("error", () => {
        console.log("peer error ------");
      });

      this.peers[call.peer] = call;
    });

    this.socket.on('table:user-stop-share-screen', ({ user, peerId }) => {
      if (user) toastText(`${user.name} stop share screen`);
      this.peers[peerId]?.close();
      delete this.streamDatas[peerId];
      this.setting.updateInstance("streamDatas", {
        ...this.streamDatas,
      });
    })

    this.socket.on("table:user-leave", (data) => {
      const { peerId } = data;
      this.peers[peerId]?.close();
      delete this.streamDatas[peerId];
      this.setting.updateInstance("streamDatas", { ...this.streamDatas });

      const videoSelected = store.getState().selectedVideo;
      if (videoSelected) {
        if (videoSelected.peerId === peerId)
          return store.dispatch(setSelectedVideoAction(null));
      }
    });

    this.socket.on("table:user-share-screen", (data) => {
      const userCurrent = store.getState().userReducer;
      const { peerId, user } = data;
      toastText(`${user.name} share screen`);

      const options = {
        metadata: {
          user: {
            name: userCurrent.user.name,
            _id: userCurrent.user._id,
            picture: userCurrent.user.picture,
          },
          media: Connection.getMediaStatus(this.myStream.stream),
          peerId: this.myID,
        },
      };

      const call = this.myPeer.call(peerId, this.myStream.stream, options);
      call.on("stream", (userStream) => {
        this.streamDatas[call.peer] = {
          user,
          stream: userStream,
          media: { video: true, audio: false },
          peerId,
        };
        this.setting.updateInstance("streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("close", () => {
        this.peers[call.peer]?.close();
        delete this.streamDatas[call.peer];
        this.setting.updateInstance("streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("error", () => {
        console.log("peer error ------");
      });

      this.peers[call.peer] = call;
    });

    this.socket.on("table:user-joined", (data) => {
      const { peerId, user, media } = data;
      toastJoinTable(user.name);
      const userCurrent = store.getState().userReducer;
      const options = {
        metadata: {
          user: {
            name: userCurrent.user.name,
            _id: userCurrent.user._id,
            picture: userCurrent.user.picture,
          },
          media: Connection.getMediaStatus(this.myStream.stream),
          peerId: this.myID,
        },
      };

      const call = this.myPeer.call(peerId, this.myStream.stream, options);

      call.on("stream", (userStream) => {
        if (this.hostPeer?.peer === peerId)
          return;

        this.streamDatas[call.peer] = {
          user,
          stream: userStream,
          media,
          peerId,
        };
        this.setting.updateInstance("streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("close", () => {
        this.peers[call.peer]?.close();
        delete this.streamDatas[call.peer];
        this.setting.updateInstance("streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("error", () => {
        console.log("peer error ------")
      })
      this.peers[call.peer] = call;

      // share screen
      if (!this.shareStream) return;
      const options2 = {
        metadata: {
          user: {
            name: userCurrent.user.name,
            _id: userCurrent.user._id,
            picture: userCurrent.user.picture,
          },
          media: { video: true, audio: false },
          peerId: this.sharePeerId,
        },
      };

      const shareCall = this.sharePeer.call(peerId, this.shareStream, options2);

      shareCall.on("close", () => {
        this.sharePeers[shareCall.peer]?.close();
        delete this.sharePeers[shareCall.peer];
      });

      shareCall.on("error", () => {
        this.sharePeers[shareCall.peer]?.close();
        delete this.sharePeers[shareCall.peer];
        console.log("peer error ------")
      })

      this.sharePeers[shareCall.peer] = shareCall
    });

    this.socket.on("table:join-success", (user) => {
      this.tableMessages = [];
      this.setting.updateInstance("table:messages", [...this.tableMessages]);
    });

    this.socket.on("table:media", ({ media, peerId }) => {
      if (this.streamDatas[peerId]) this.streamDatas[peerId].media = media;
      this.setting.updateInstance("streamDatas", { ...this.streamDatas });
    });

    this.socket.on("room:media", ({ media }) => {
      const roomCall = store.getState().roomCall;
      if (roomCall && roomCall.hostStream) {
        store.dispatch(callAllSetHostStream({ ...roomCall.hostStream, media }))
      }
    });

    this.socket.on("present:media", ({ media, peerId }) => {
      if (this.streamDatas[peerId]) this.streamDatas[peerId].media = media;
      this.setting.updateInstance("streamDatas", { ...this.streamDatas });
    });

    this.socket.on("table:message", (msg) => {
      this.tableMessages = [msg, ...this.tableMessages];
      this.setting.updateInstance("table:messages", [...this.tableMessages]);
      store.dispatch(receiveMessageAction());
      const showChat = store.getState().roomCall.showChat;
      if (!showChat) {
        soundMessage.play();
      }
    });

    this.socket.on("present:close", () => {
      this.clearPeers();
      store.dispatch(setSelectedVideoAction(null));
      this.streamDatas = []
      this.setting.updateInstance("streamDatas", { ...this.streamDatas });
      this.socket.emit("table:join-previous", this.myID, {
        audio: false,
        video: false,
      });
    });

    this.socket.on("present:user-leave", (data) => {
      const { peerId } = data;
      const videoSelected = store.getState().selectedVideo;
      if (videoSelected === peerId)
        store.dispatch(setSelectedVideoAction(null));
      this.peers[peerId]?.close();
      delete this.streamDatas[peerId];
      this.setting.updateInstance("streamDatas", { ...this.streamDatas });
    });

    this.socket.on("present:pin", (data) => {
      store.dispatch(setSelectedVideoAction(data.peerId));
    });

    this.socket.on("present:user-joined", (data) => {
      const userCurrent = store.getState().userReducer;
      const { peerId, user, media } = data;
      if (user._id === userCurrent.user._id) return;

      const options = {
        metadata: {
          user: {
            name: userCurrent.user.name,
            _id: userCurrent.user._id,
            picture: userCurrent.user.picture,
          },
          media: Connection.getMediaStatus(this.myStream.stream),
          peerId: this.myID,
        },
      };

      const call = this.myPeer.call(peerId, this.myStream.stream, options);

      call.on("stream", (userStream) => {
        console.log('call')
        this.streamDatas[call.peer] = {
          user,
          stream: userStream,
          media,
          peerId,
        };
        this.setting.updateInstance("streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("close", () => {
        this.peers[call.peer]?.close();
        delete this.streamDatas[call.peer];
        this.setting.updateInstance("streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("error", () => {
        console.log("peer error ------");
      });

      this.peers[call.peer] = call;

      // share screen
      if (!this.shareStream) return;
      const options2 = {
        metadata: {
          user: {
            name: userCurrent.user.name,
            _id: userCurrent.user._id,
            picture: userCurrent.user.picture,
          },
          media: { video: true, audio: false },
          peerId: this.sharePeerId,
        },
      };

      const shareCall = this.sharePeer.call(peerId, this.shareStream, options2);

      shareCall.on("close", () => {
        this.sharePeers[shareCall.peer]?.close();
        delete this.sharePeers[shareCall.peer];
      });

      shareCall.on("error", () => {
        this.sharePeers[shareCall.peer]?.close();
        delete this.sharePeers[shareCall.peer];
        console.log("peer error ------")
      })

      this.sharePeers[shareCall.peer] = shareCall
    });

    this.socket.on("disconnect", (reason) => {
      // if (reason === "io server disconnect")
      //   textSwal("You are kicked out of room", () => {
      //     window.location.reload();
      //   });
    });

    this.socket.on("error", (err) => {
      console.log("socket error --", err);
    });
  };

  static initializePeersEvents() {
    this.myPeer.on("open", (id) => {
      this.myID = id;
      this.myStream.peerId = id;
      store.dispatch(roomCallSetPeerId(id));
      this.setting.updateInstance(
        "canAccess",
        this.socket.connected && this.myID && this.myStream.stream
      );
    });

    this.myPeer.on("error", (err) => {
      this.myPeer.reconnect();
    });

    this.myPeer.on("disconnected", () => {
      if (this.isMeetting)
        textSwal("You are disconnected", () => {
          window.location.reload();
        });
    });
  };

  static setPeersListeners(stream) {
    this.myPeer.on("call", (call) => {
      call.answer(stream);

      const { user, media, peerId, type = 'table' } = call.metadata;
      call.on("stream", (userStream) => {
        if (type === 'callall') return;
        if (call.peer === this.hostPeer?.peer)
          return
        this.streamDatas[call.peer] = {
          user,
          stream: userStream,
          media,
          peerId,
        };
        this.setting.updateInstance("streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("close", () => {
        if (type === 'callall') {
          this.callAllPeers[call.peer]?.close();
          return
        }
        this.peers[call.peer]?.close();
        delete this.streamDatas[call.peer];
        this.setting.updateInstance("streamDatas", this.streamDatas);
      });

      call.on("error", () => {
        console.log("peer error ------");
        if (type === 'callall') {
          this.callAllPeers[call.peer]?.close();
          return
        }
      });

      if (type === 'callall') {
        this.callAllPeers[call.peer] = call
        return;
      }
      this.peers[call.peer] = call;
    });
  };

  static replaceStream() {
    Object.values(this.callAllPeers).forEach((peer) => {
      peer.peerConnection?.getSenders().forEach((sender) => {
        if (sender.track?.kind === "audio") {
          if (this.myStream.stream.getAudioTracks().length > 0) {
            sender.replaceTrack(this.myStream.stream.getAudioTracks()[0]);
          }
        }
        if (sender.track?.kind === "video") {
          if (this.myStream.stream.getVideoTracks().length > 0) {
            sender.replaceTrack(this.myStream.stream.getVideoTracks()[0]);
          }
        }
      });
    });
    Object.values(this.peers).forEach((peer) => {
      peer.peerConnection?.getSenders().forEach((sender) => {
        if (sender.track?.kind === "audio") {
          if (this.myStream.stream.getAudioTracks().length > 0) {
            sender.replaceTrack(this.myStream.stream.getAudioTracks()[0]);
          }
        }
        if (sender.track?.kind === "video") {
          if (this.myStream.stream.getVideoTracks().length > 0) {
            sender.replaceTrack(this.myStream.stream.getVideoTracks()[0]);
          }
        }
      });
    });
  };

  static clearPeers() {
    Object.values(this.peers).forEach((peer) => {
      peer.close();
    });
    this.peers = {};
  };

  static clearCallAllPeers() {
    if (this.hostPeer) {
      this.hostPeer?.close();
      this.hostPeer = null
      return;
    }
    Object.values(this.callAllPeers).forEach((peer) => {
      peer.close();
    });
    this.callAllPeers = [];
  };

  static clearTableMessages() {
    this.tableMessages = [];
    this.setting.updateInstance("table:messages", [...this.tableMessages]);
  }


  static disconnect() {
    this.clearCallAllPeers();
    this.clearPeers();
    this.tableMessages = [];
    this.roomMessages = [];
    this.isMeetting = false;
    this.socket?.offAny();
    this.socket?.disconnect();
    this.myStream?.stream?.getTracks()?.forEach((tr) => {
      tr.stop();
    });
    this.myPeer?.destroy();
  };

  static leaveTable() {
    this.clearPeers();
    store.dispatch(setSelectedVideoAction(null));
    this.tableMessages = [];
    this.setting.updateInstance("table:messages", [...this.tableMessages]);
    this.socket.emit("table:leave", this.myID);
  };

  static stopShareTrack() {
    if (this.shareStream) {
      const track = this.shareStream.getVideoTracks()[0];
      track?.stop();
      track.dispatchEvent(new Event('ended'))
      store.dispatch(shareScreenSetState(false))
      return;
    }
  }

  static async shareScreen(scope) {
    if (this.shareStream) {
      const track = this.shareStream.getVideoTracks()[0];
      track?.stop();
      track.dispatchEvent(new Event('ended'))
      return;
    }
    try {
      this.shareStream = await this.getDisplayMediaStream();
      this.sharePeer = initializePeerConnection()

      this.sharePeer.once('open', (id) => {
        if (scope === 'table')
          this.socket.emit('table:share-screen', id);
        else {
          if (scope === 'room')
            this.socket.emit('room:share-screen', id, scope);
          else
            this.socket.emit('room:share-screen', id, scope, this.myID);
        }
        this.sharePeerId = id;
        store.dispatch(shareScreenSetState(true))
        const videoTrack = this.shareStream.getVideoTracks()[0];
        videoTrack.addEventListener("ended", () => {
          this.shareStream = null;
          store.dispatch(shareScreenSetState(false))

          if (scope === 'table')
            this.socket.emit('table:stop-share-screen', id);
          else
            this.socket.emit('room:stop-share-screen', id, scope);
          Object.values(this.sharePeers).forEach(peer => {
            peer.close()
          })
          this.sharePeers = []
          this.sharePeer.off('call')
          this.sharePeer.destroy();
          this.sharePeer = null;
        });
      })

      this.sharePeer.on("error", (err) => {
        this.myPeer.reconnect();
      });

      this.sharePeer.on("disconnected", () => {
        //stop share
      });

      this.sharePeer.on("call", (call) => {
        call.answer(this.shareStream);

        call.on("close", () => {
          console.log('close -- lisent')
          this.sharePeers[call.peer]?.close();
        });

        call.on("error", () => {
          console.log("peer error ------");
        });

        this.sharePeers[call.peer] = call;
      });
    } catch (e) {
      console.log(e);
      toastError('Browser version does not support screen sharing')
    }

  }

  static async getDisplayMediaStream() {
    return navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
  };

  static async turnOffAudio() {
    const track = this.myStream.stream.getAudioTracks()[0];
    track?.stop();
    this.myStream.media = { ...this.myStream.media, audio: false }
    this.setting.updateInstance("myStream", { ...this.myStream });
  };

  static setUserSpeaking(peerId) {
    console.log(this.streamDatas[peerId])
    console.log(this.streamDatas)
    if (!this.streamDatas[peerId]) return;
    const temp = { ...this.streamDatas[peerId] };
    delete this.streamDatas[peerId];
    this.streamDatas = { [peerId]: temp, ...this.streamDatas };
    console.log(this.streamDatas)
    this.setting.updateInstance("streamDatas", this.streamDatas);
  }

  static async turnOnAudio() {
    try {
      const track = this.myStream.stream.getAudioTracks()[0];
      if (track) {
        track?.stop();
        this.myStream.stream.removeTrack(track);
      }
      const streamTemp = await this.getVideoAudioStream(false, true, 12);
      this.myStream.stream.addTrack(streamTemp.getTracks()[0]);
      this.myStream.media = { ...this.myStream.media, audio: true }
      this.setting.updateInstance("myStream", { ...this.myStream });
    } catch (err) {
      toastError('Error to turn on audio');
      console.log(err);
    }
  };

  static async turnOffVideo() {
    const track = this.myStream.stream.getVideoTracks()[0];
    track?.stop();
    this.myStream.media = { ...this.myStream.media, video: false }
    this.setting.updateInstance("myStream", { ...this.myStream });
  };

  static async turnOnVideo() {
    try {
      const track = this.myStream.stream.getVideoTracks()[0];
      if (track) {
        track?.stop();
        this.myStream.stream.removeTrack(track);
      }

      const streamTemp = await this.getVideoAudioStream(true, false, 12);
      this.myStream.stream.addTrack(streamTemp.getTracks()[0]);
      this.myStream.media = { ...this.myStream.media, video: true }
      this.setting.updateInstance("myStream", { ...this.myStream });
    } catch (err) {
      console.log(err);
      toastError('Error to turn on video');
    }
  };

  static async initMyStream() {
    try {
      this.myStream.stream = await this.getVideoAudioStream(true, true, 12);
      this.myStream.media = { video: true, audio: true };
      this.myStream.peerId = this.myID;
      this.setting.updateInstance("myStream", this.myStream);
      this.setting.updateInstance(
        "canAccess",
        this.socket.connected && this.myID && this.myStream.stream
      );
      this.setPeersListeners(this.myStream.stream);
    } catch (e) {
      try {
        this.myStream.stream = await this.getVideoAudioStream(false, true, 12);
        this.myStream.media = { video: false, audio: true };
        this.myStream.peerId = this.myID;
        this.setting.updateInstance("myStream", this.myStream);
        this.setting.updateInstance(
          "canAccess",
          this.socket.connected && this.myID && this.myStream.stream
        );
        this.setPeersListeners(this.myStream.stream);
      } catch (e) {
        toastError('error to open audio')
      }
    }
  };

  static getVideoAudioStream(video = true, audio = true, quality = 12) {
    navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia;
    return navigator.mediaDevices.getUserMedia({
      video: video
        ? {
          frameRate: quality,
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
        }
        : false,
      audio: audio,
    });
  };

  static getMediaStatus(stream) {
    let media = { video: false, audio: false };
    stream?.getTracks().forEach((track) => {
      if (track?.kind === "audio" && track.readyState === 'live') {
        media = { ...media, audio: true };
      }
      if (track?.kind === "video" && track.readyState === 'live') {
        media = { ...media, video: true };
      }
    });
    return media;
  };

}

export default Connection;
