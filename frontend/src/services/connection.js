import openSocket from "socket.io-client";
import { Cookies } from "react-cookie";
import { store } from "../store";
import Peer from "peerjs";
import { receiveMessageAction } from "../store/actions/messageAction";
import { confirmSwal, countTime, disconnectSwal } from "./swalServier";
import { SET_SELECTEDVIDEO } from "../store/reducers/selectVideoReducer";
import sound from "../sounds/join-permission.mp3";
import sound1 from "../sounds/meet-message-sound-1.mp3";
import { renewToken } from "../api/user.api";

var soundJoin = new Audio(sound);
var soundMessage = new Audio(sound1);

const peerEndPoint = {
  host: "localhost",
  path: "/peerjs/meeting",
  port: 3002,
};
const socketRoomEndPoint = "http://localhost:3002/socket/rooms";
const cookies = new Cookies();

const initializePeerConnection = () => {
  return new Peer("", peerEndPoint);
};

const initializeSocketConnection = () => {
  const auth = cookies.get("u_auth");
  return openSocket(socketRoomEndPoint, {
    forceNew: true,
    auth: {
      token: "Bearer " + auth.accessToken,
    },
  });
};

class Connection {
  myPeer;
  socket;
  myID = null;
  canAccess = false;
  access = false;
  isMeetting = true;
  //floor
  currentFloor = null;
  //peers
  peers = {};
  //room
  info = null;
  //messages
  roomMessages = [];
  tableMessages = [];
  //stream
  myStream = {
    stream: null,
  };
  streamDatas = [];
  isShare = false;
  //joiner
  joiners = [];
  //tables
  tables = [];
  //requests
  requests = {};
  //stateMessage
  messageState;
  //join err
  joinErr;

  constructor(setting) {
    this.setting = setting;
    this.myPeer = initializePeerConnection();
    this.socket = initializeSocketConnection();
    this.initializeSocketEvents();
    this.initializePeersEvents();
  }

  accessRoom = () => {
    this.access = false;
    this.setting.updateInstance("access", true);
  };

  initializeSocketEvents = () => {
    this.socket.on("connect", () => {
      this.setting.updateInstance(
        "canAccess",
        this.socket.connected && this.myID && this.myStream.stream
      );
    });

    this.socket.on("connect_error", async (err) => {
      console.log(err.message);
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
      console.log(tables, floor);
      this.tables = tables;
      this.currentFloor = floor;
      this.setting.updateInstance("tables", [...this.tables]);
      this.setting.updateInstance("currentFloor", floor);
    });

    this.socket.on("room:user-request", (request) => {
      this.requests[request.user._id] = request;
      this.setting.updateInstance("requests", { ...this.requests });
      soundJoin.play();
    });

    this.socket.on("room:user-joined", (users) => {
      this.joiners = users;
      this.setting.updateInstance("joiners", users);
    });

    this.socket.on("room:info", (room) => {
      console.log(room);
      this.info = room;
      this.access = true;
      this.setting.updateInstance("access", this.access);
      this.setting.updateInstance("info", this.info);
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
      this.tables = tables;
      this.clearPeers();
      store.dispatch({ type: SET_SELECTEDVIDEO, layload: null });
      this.setting.updateInstance("tables", [...this.tables]);

      this.myStream.stream?.getTracks().forEach((tr) => {
        tr.stop();
      });

      this.setting.updateInstance("myStream", { ...this.myStream });

      const currentUser = store.getState().userReducer?.user;

      const table = tables.find((t) => {
        return t.members.find((m) => m === currentUser._id);
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
          this.socket.emit("table:join", table._id, this.myID, {
            audio: false,
            video: false,
          });
        }
      );
    });

    this.socket.on("table:user-leave", (data) => {
      const { peerId } = data;
      this.peers[peerId]?.close();
      delete this.streamDatas[peerId];
      this.setting.updateInstance("streamDatas", { ...this.streamDatas });

      const videoSelected = store.getState().selectedVideo;
      if (videoSelected) {
        if (videoSelected.peerId === peerId)
          return store.dispatch({
            type: SET_SELECTEDVIDEO,
            payload: null,
          });
      }
    });

    this.socket.on("table:user-joined", (data) => {
      const userCurrent = store.getState().userReducer;
      const { peerId, user, media } = data;

      const options = {
        metadata: {
          user: {
            name: userCurrent.user.name,
            _id: userCurrent.user._id,
            picture: userCurrent.user.picture,
          },
          media: Connection.getMediaStatus(this.myStream.stream),
          peerId: peerId,
        },
      };

      const call = this.myPeer.call(peerId, this.myStream.stream, options);

      call.on("stream", (userStream) => {
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
        console.log("close");
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

    this.socket.on("table:join-success", (user) => {
      this.tableMessages = [];
      this.setting.updateInstance("table:messages", [...this.tableMessages]);
    });

    this.socket.on("table:media", ({ userId, media, peerId }) => {
      if (this.streamDatas[peerId]) this.streamDatas[peerId].media = media;
      this.setting.updateInstance("streamDatas", { ...this.streamDatas });

      const videoSelected = store.getState().selectedVideo;
      if (videoSelected && videoSelected.peerId === peerId) {
        if (this.myID === peerId) {
          return store.dispatch({
            type: SET_SELECTEDVIDEO,
            payload: { ...videoSelected, media: media },
          });
        }

        return store.dispatch({
          type: SET_SELECTEDVIDEO,
          payload: { ...this.streamDatas[peerId] },
        });
      }
    });

    this.socket.on("present:media", ({ userId, media, peerId }) => {
      if (this.streamDatas[peerId]) this.streamDatas[peerId].media = media;
      this.setting.updateInstance("streamDatas", { ...this.streamDatas });

      const videoSelected = store.getState().selectedVideo;
      if (videoSelected) {
        if (this.streamDatas[peerId] && videoSelected.peerId === peerId)
          return store.dispatch({
            type: SET_SELECTEDVIDEO,
            payload: { ...this.streamDatas[peerId] },
          });

        if (this.myID === peerId && videoSelected.peerId === peerId) {
          return store.dispatch({
            type: SET_SELECTEDVIDEO,
            payload: { ...videoSelected, media: media },
          });
        }
      }
    });

    this.socket.on("table:message", (msg) => {
      console.log(msg);
      this.tableMessages = [msg, ...this.tableMessages];
      this.setting.updateInstance("table:messages", [...this.tableMessages]);
      store.dispatch(receiveMessageAction());
      const showChat = store.getState().roomCall.showChat;
      if (!showChat) {
        soundMessage.play();
      }
    });

    this.socket.on("room:present", ({ time, tables }) => {
      console.log("present");
      // this.tables = tables;
      this.clearPeers();
      this.streamDatas = {};
      store.dispatch({ type: SET_SELECTEDVIDEO, layload: null });
      this.setting.updateInstance("tables", [...this.tables]);

      this.myStream.stream.getTracks().forEach((tr) => {
        tr.stop();
      });
      this.setting.updateInstance("myStream", { ...this.myStream });

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

    this.socket.on("present:close", () => {
      this.clearPeers();
      this.peers = {};
      store.dispatch({ type: SET_SELECTEDVIDEO, layload: null });
      this.socket.emit("table:join-previous", this.myID, {
        audio: false,
        video: false,
      });
    });

    this.socket.on("present:user-leave", (data) => {
      const { peerId } = data;
      this.peers[peerId]?.close();
      delete this.streamDatas[peerId];
      this.setting.updateInstance("streamDatas", { ...this.streamDatas });

      const videoSelected = store.getState().selectedVideo;
      if (videoSelected) {
        if (videoSelected.peerId === peerId)
          return store.dispatch({
            type: SET_SELECTEDVIDEO,
            payload: null,
          });
      }
    });
    this.socket.on("present:pin", (data) => {
      store.dispatch({
        type: SET_SELECTEDVIDEO,
        payload: this.streamDatas[data.peerId],
      });
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
          peerId: peerId,
        },
      };

      const call = this.myPeer.call(peerId, this.myStream.stream, options);

      call.on("stream", (userStream) => {
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
    });

    this.socket.on("disconnect", () => {
      // if (this.isMeetting)
      // disconnectSwal(() => {
      //   window.location.reload();
      // });
      this.socket.connect();
    });

    this.socket.on("error", (err) => {
      console.log("socket error --", err);
    });
  };

  initializePeersEvents = () => {
    this.myPeer.on("open", (id) => {
      this.myID = id;
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
        disconnectSwal(() => {
          window.location.reload();
        });
    });
  };

  setPeersListeners = (stream) => {
    this.myPeer.on("call", (call) => {
      call.answer(stream);

      call.on("stream", (userStream) => {
        const { user, media, peerId } = call.metadata;
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
        this.setting.updateInstance("streamDatas", this.streamDatas);
      });

      call.on("error", () => {
        console.log("peer error ------");
      });
      this.peers[call.peer] = call;
    });
  };

  replaceStream = () => {
    Object.values(this.peers).forEach((peer) => {
      peer.peerConnection?.getSenders().forEach((sender) => {
        if (sender.track.kind === "audio") {
          if (this.myStream.stream.getAudioTracks().length > 0) {
            sender.replaceTrack(this.myStream.stream.getAudioTracks()[0]);
          }
        }
        if (sender.track.kind === "video") {
          if (this.myStream.stream.getVideoTracks().length > 0) {
            sender.replaceTrack(this.myStream.stream.getVideoTracks()[0]);
          }
        }
      });
    });
  };

  clearPeers = () => {
    Object.values(this.peers).forEach((peer) => {
      peer.close();
    });
  };

  destoryDisconnect = () => {
    this.isMeetting = false;
    this.socket?.offAny();
    this.socket?.disconnect();
    this.myPeer?.destroy();
    this.myStream?.stream?.getTracks()?.forEach((tr) => {
      tr.stop();
    });
  };

  leaveTable = () => {
    this.clearPeers();
    store.dispatch({ type: SET_SELECTEDVIDEO, layload: null });
    this.tableMessages = [];
    this.setting.updateInstance("table:messages", [...this.tableMessages]);
    this.socket.emit("table:leave", this.myID);
  };

  getDisplayMediaStream = () => {
    if (this.isShare) {
      this.turnOffVideo();
      this.isShare = false;
      return;
    }
    const myNavigator = navigator.mediaDevices.getDisplayMedia();
    myNavigator
      .then((stream) => {
        const track = this.myStream.stream.getVideoTracks()[0];
        if (track) {
          track?.stop();
          this.myStream.stream.removeTrack(track);
        }
        const displayTrack = stream.getVideoTracks()[0];
        displayTrack.addEventListener("ended", () => {
          this.turnOffVideo();
          this.isShare = false;
        });
        this.myStream.stream.addTrack(displayTrack);
        this.isShare = true;
        this.socket.emit("present:pin");
        this.setting.updateInstance("myStream", { ...this.myStream });
      })
      .catch(() => {
        return;
      });
  };

  turnOffAudio = async () => {
    const track = this.myStream.stream.getAudioTracks()[0];
    track?.stop();
    this.setting.updateInstance("myStream", { ...this.myStream });
  };

  turnOnAudio = async () => {
    try {
      const track = this.myStream.stream.getAudioTracks()[0];
      if (track) {
        track?.stop();
        this.myStream.stream.removeTrack(track);
      }
      const streamTemp = await this.getVideoAudioStream(false, true, 12);
      this.myStream.stream.addTrack(streamTemp.getTracks()[0]);
      this.setting.updateInstance("myStream", { ...this.myStream });
    } catch (err) {
      console.log(err);
    }
  };

  turnOffVideo = async () => {
    const track = this.myStream.stream.getVideoTracks()[0];
    track?.stop();
    this.setting.updateInstance("myStream", { ...this.myStream });
  };

  turnOnVideo = async () => {
    try {
      const track = this.myStream.stream.getVideoTracks()[0];
      if (track) {
        track?.stop();
        this.myStream.stream.removeTrack(track);
      }
      const streamTemp = await this.getVideoAudioStream(true, false, 12);
      this.myStream.stream.addTrack(streamTemp.getTracks()[0]);
      this.setting.updateInstance("myStream", { ...this.myStream });
    } catch (err) {
      console.log(err);
    }
  };

  initMyStream = async () => {
    try {
      this.myStream.stream = await this.getVideoAudioStream(true, true, 12);
      this.setting.updateInstance("myStream", this.myStream);
      this.setting.updateInstance(
        "canAccess",
        this.socket.connected && this.myID && this.myStream.stream
      );
      this.setPeersListeners(this.myStream.stream);
    } catch {
      console.log("err to get media");
    }
  };

  getVideoAudioStream = (video = true, audio = true, quality = 12) => {
    const myNavigator =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia;
    return myNavigator({
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

  replyRequest = (request, isAccess) => {
    this.socket.emit(
      "room:access-request",
      request.socketId,
      request.user._id,
      isAccess
    );
    delete this.requests[request.user._id];
    this.setting.updateInstance("requests", { ...this.requests });
  };

  static getMediaStatus = (stream) => {
    let media = { video: false, audio: false };
    stream?.getTracks().forEach((track) => {
      if (track.kind === "audio" && track.readyState === "live") {
        media = { ...media, audio: true };
      }
      if (track.kind === "video" && track.readyState === "live") {
        media = { ...media, video: true };
      }
    });
    return media;
  };
}

export default Connection;
