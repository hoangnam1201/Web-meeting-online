import openSocket from 'socket.io-client';
import { Cookies } from 'react-cookie';
import { store } from '../store'
import Peer from 'peerjs';
import { roomAccessMediaAction } from '../store/actions/roomCallAction';
import { tableUserJoinAction, tableUserLeaveAction, TABLE_CHANGEMEDIA } from '../store/actions/tableCallAction';
import { ROOMTABLE_SET } from '../store/reducers/roomTablesReducer';
import { ROOMMESSAGES_SET } from '../store/reducers/roomMessagesReducer';
import { TABLEMESSAGES_SET } from '../store/reducers/tableMessagesReducer';
const peerEndPoint = {
    host: "ec2-54-161-198-205.compute-1.amazonaws.com",
    path: "/peerjs/meeting",
    port: 3002,
}
const socketRoomEndPoint = 'http://ec2-54-161-198-205.compute-1.amazonaws.com:3002/socket/rooms';

const initializePeerConnection = () => {
    return new Peer('', peerEndPoint);
}

const initializeSocketConnection = () => {
    const auth = new Cookies().get('u_auth');
    return openSocket(socketRoomEndPoint, {
        forceNew: true,
        auth: {
            token: 'Bearer ' + auth.accessToken,
        },
    })
}

class Connection {
    streaming = false;
    myPeer;
    socket;
    myID = '';
    //unit
    peers = [];
    //room
    info = null;
    roomMessages = [];
    joiner = [];

    constructor() {
        this.myPeer = initializePeerConnection();
        this.socket = initializeSocketConnection();
        this.initializeSocketEvents();
        this.initializePeersEvents();
    }

    initializeSocketEvents = () => {
        console.log('listen socket')
        this.socket.on('connect', () => {
            console.log('socket connected');
        });

        this.socket.on('room:user-request', (user) => {
            console.log('user request', user);
        });

        this.socket.on('room:user-joined', (users) => {
            this.joiner = users;
        });

        this.socket.on('room:joined', (room) => {
            this.info = room;
            store.dispatch(roomAccessMediaAction(true));
        });

        this.socket.on('room:tables', (tables) => {
            console.log(tables)
            store.dispatch({ type: ROOMTABLE_SET, payload: tables });
        });

        this.socket.on('room:messages', (messages) => {
            const roomMessages = store.getState().roomMessages;
            const temp = [...messages, ...roomMessages.items]
            store.dispatch({ type: ROOMMESSAGES_SET, payload: temp });
        });

        this.socket.on('room:message', (message) => {
            const roomMessages = store.getState().roomMessages;
            const temp = [message, ...roomMessages.items]
            store.dispatch({ type: ROOMMESSAGES_SET, payload: temp });
            console.log('message', message);
        });

        this.socket.on('room:join-err', (str) => {
            console.log('join error', str);
        });

        this.socket.on('table:user-leave', (data) => {
            console.log('table:user-leave', data)
            const { userId, peerId } = data;
            this.peers[userId] && this.peers[userId].close();
            store.dispatch(tableUserLeaveAction(userId));
        })

        this.socket.on('table:user-joined', (data) => {
            console.log('user joined')
            const myStream = store.getState().myStream;
            const userCurrent = store.getState().userReducer;
            const { peerId, user } = data
            const call = this.myPeer.call(peerId, myStream.stream, { metadata: { name: userCurrent.user.name, _id: userCurrent.user._id } });
            call.on('stream', (userStream) => {
                store.dispatch(tableUserJoinAction({ user: user, stream: userStream }));
            })
            call.on('close', () => {
                console.log('closing new user', peerId);
            });
            call.on('error', () => {
                console.log('peer error ------')
            })
            this.peers[user._id] = call;
        })

        this.socket.on('table:join-success', (user) => {
            store.dispatch({ type: TABLEMESSAGES_SET, payload: [] });
        })

        this.socket.on('table:media', () => {
            console.log('change media')
            store.dispatch({ type: TABLE_CHANGEMEDIA });
        })

        this.socket.on('table:message', (msg) => {
            console.log('table:message', msg)
            const tableMessages = store.getState().tableMessages;
            const temp = [...tableMessages.items, msg]
            store.dispatch({ type: TABLEMESSAGES_SET, payload: temp });
        })

        this.socket.on('disconnect', () => {
            console.log('socket disconnected --');
        });

        this.socket.on('error', (err) => {
            console.log('socket error --', err);
        });
    }

    initializePeersEvents = () => {
        this.myPeer.on('open', (id) => {
            console.log('peerjs open')
            this.myID = id;
        });
        this.myPeer.on('error', (err) => {
            console.log('peer connection error', err);
            this.myPeer.reconnect();
        })
    }

    setPeersListeners = (stream) => {
        console.log('listent call')
        this.myPeer.on('call', (call) => {
            console.count('call event')
            call.answer(stream);
            call.on('stream', (userVideoStream) => {
                console.log('user stream data', userVideoStream)
                store.dispatch(tableUserJoinAction({ user: call.metadata, stream: userVideoStream }));
            });
            call.on('close', () => {
                console.log('closing peers listeners', call.metadata.id);
            });
            call.on('error', () => {
                console.log('peer error ------');
            });
            this.peers[call.metadata._id] = call;
        });
    }

    static getVideoAudioStream = (video = true, audio = true, quality = 12) => {
        const myNavigator = navigator.mediaDevices.getUserMedia ||
            navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia ||
            navigator.mediaDevices.msGetUserMedia;
        return myNavigator({
            video: video ? {
                frameRate: quality,
            } : false,
            audio: audio,
        });
    }

    replaceStream = () => {
        const myStream = store.getState().myStream;
        Object.values(this.peers).forEach((peer) => {
            peer.peerConnection?.getSenders().forEach((sender) => {
                if (sender.track.kind === "audio") {
                    if (myStream.stream.getAudioTracks().length > 0) {
                        sender.replaceTrack(myStream.stream.getAudioTracks()[0]);
                    }
                }
                if (sender.track.kind === "video") {
                    if (myStream.stream.getVideoTracks().length > 0) {
                        sender.replaceTrack(myStream.stream.getVideoTracks()[0]);
                    }
                }
            });
        })
    }

    clearPeers = () => {
        Object.values(this.peers).forEach((peer) => {
            peer.close();
        });
    }

    destructor = () => {
        this.socket?.offAny();
        this.socket?.disconnect();
        Object.values(this.peers).forEach((peer) => {
            peer.close();
        });
        this.myPeer?.disconnect()
        const myStream = store.getState().myStream;
        // console.log(myStream)
        // myStream.stream.stop();
        myStream?.stream.getTracks().forEach(tr => {
            console.log(tr)
            tr.stop();
            // myStream.removeTrack(tr)
        });

    }
}

export default Connection;