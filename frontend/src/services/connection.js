import openSocket from "socket.io-client";
import { Cookies } from "react-cookie";
import { store } from "../store";
import Peer from "peerjs";
import { useSelector } from "react-redux";
import { receiveMessageAction } from "../store/actions/messageAction";

const peerEndPoint = {
  host: "localhost",
  path: "/peerjs/meeting",
  port: 3002,
};
const socketRoomEndPoint = "http://localhost:3002/socket/rooms";

const initializePeerConnection = () => {
  return new Peer("", peerEndPoint);
};

const initializeSocketConnection = () => {
  const auth = new Cookies().get("u_auth");
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
  requests = [];
  //stateMessage
  messageState;

  constructor(setting) {
    console.log(setting);
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

    this.socket.on("room:user-request", (user) => {
      console.log("user request", user);
    });

    this.socket.on("room:user-joined", (users) => {
      this.joiners = users;
      this.setting.updateInstance("joiners", users);
    });

    this.socket.on("room:joined", (room) => {
      this.info = room;
      this.access = true;
      this.setting.updateInstance("access", this.access);
    });

    this.socket.on("room:tables", (tables) => {
      this.tables = tables;
      console.log(tables);
      this.setting.updateInstance("tables", [...this.tables]);
    });

    this.socket.on("room:messages", (messages) => {
      this.roomMessages = [...messages, ...this.roomMessages];
      this.setting.updateInstance("room:messages", [...this.roomMessages]);
      console.log("message room");
    });

    this.socket.on("room:message", (message) => {
      this.roomMessages = [message, ...this.roomMessages];
      this.setting.updateInstance("room:messages", this.roomMessages);
      console.log("message room");
      store.dispatch(receiveMessageAction());
    });

    this.socket.on("room:join-err", (str) => {
      console.log("join error", str);
    });

    this.socket.on("table:user-leave", (data) => {
      this.peers[data.peerId]?.close();
      delete this.streamDatas[data.peerId];
      this.setting.updateInstance("table:streamDatas", { ...this.streamDatas });
    });

    this.socket.on("table:user-joined", (data) => {
      const userCurrent = store.getState().userReducer;
      const { peerId, user, media } = data;

      const options = {
        metadata: {
          user: {
            name: userCurrent.user.name,
            _id: userCurrent.user._id,
          },
          media: Connection.getMediaStatus(this.myStream.stream),
        },
      };

      const call = this.myPeer.call(peerId, this.myStream.stream, options);

      call.on("stream", (userStream) => {
        this.streamDatas[call.peer] = { user, stream: userStream, media };
        this.setting.updateInstance("table:streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("close", () => {
        console.log("close");
        this.peers[call.peer]?.close();
        delete this.streamDatas[call.peer];
        this.setting.updateInstance("table:streamDatas", {
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
      console.log(peerId, media);
      if (this.streamDatas[peerId]) this.streamDatas[peerId].media = media;
      this.setting.updateInstance("table:streamDatas", { ...this.streamDatas });
    });

    this.socket.on("table:message", (msg) => {
      console.log("table:message", msg);
      this.tableMessages = [msg, ...this.tableMessages];
      this.setting.updateInstance("table:messages", [...this.tableMessages]);
      store.dispatch(receiveMessageAction());
    });

    this.socket.on("disconnect", () => {
      console.log("socket disconnected --");
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
      console.log("peer connection error", err);
      this.myPeer.reconnect();
    });
  };

  setPeersListeners = (stream) => {
    this.myPeer.on("call", (call) => {
      console.log("peerId", call.peer);

      call.answer(stream);

      call.on("stream", (userStream) => {
        const { user, media } = call.metadata;
        this.streamDatas[call.peer] = { user, stream: userStream, media };
        this.setting.updateInstance("table:streamDatas", {
          ...this.streamDatas,
        });
      });

      call.on("close", () => {
        console.log("close");
        this.peers[call.peer]?.close();
        delete this.streamDatas[call.peer];
        this.setting.updateInstance("table:streamDatas", this.streamDatas);
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
    console.log("call close");
    Object.values(this.peers).forEach((peer) => {
      peer.close();
    });
  };

  destoryDisconnect = () => {
    this.socket?.offAny();
    this.socket?.disconnect();
    this.myPeer?.destroy();
    this.myStream.stream.getTracks().forEach((tr) => {
      console.log(tr);
      tr.stop();
    });
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
          }
        : false,
      audio: audio,
    });
  };

  static getMediaStatus = (stream) => {
    let media = { video: false, audio: false };
    stream.getTracks().forEach((track) => {
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
