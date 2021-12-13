import openSocket from 'socket.io-client';
import { Cookies } from 'react-cookie';
import { store } from '../store'
import Peer from 'peerjs';
import { roomAccessMediaAction, ROOM_CHANGE } from '../store/actions/roomCallAction';
import { tableUserJoinAction, tableUserLeaveAction, TABLE_CHANGEMEDIA } from '../store/actions/tableCallAction';
import { ROOMTABLE_SET } from '../store/reducers/roomTablesReducer';
import { ROOMMESSAGES_SET } from '../store/reducers/roomMessagesReducer';
import { TABLEMESSAGES_SET } from '../store/reducers/tableMessagesReducer';
const peerEndPoint = {
    host: "54.161.198.205",
    path: "/peerjs/meeting",
    port: 3002
}
const socketRoomEndPoint = 'http://localhost:3002/socket/rooms';

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
    myPeer;
    socket;
    myID = '';
    //unit
    peers = {};
    //room
    info = null;

    constructor(setting) {
        this.setting = setting;
        this.myPeer = initializePeerConnection();
        this.socket = initializeSocketConnection();
        this.initializeSocketEvents();
        this.initializePeersEvents();
    }

    initializeSocketEvents = () => {
        console.log('listen socket')
        this.socket.on('connect', () => {
            console.log('socket connected');
            store.dispatch({ type: ROOM_CHANGE });
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
            const messagesTemp = [...messages, ...roomMessages.items];
            store.dispatch({ type: ROOMMESSAGES_SET, payload: messagesTemp });
            console.log('message room')
        });

        this.socket.on('room:message', (message) => {
            const roomMessage = store.getState().roomMessages;
            const messages = [message, ...roomMessage.items];
            store.dispatch({ type: ROOMMESSAGES_SET, payload: messages });
        });

        this.socket.on('room:join-err', (str) => {
            console.log('join error', str);
        });

        this.socket.on('table:user-leave', (data) => {
            console.log('table:user-leave', data)
            this.peers[data] && this.peers[data].close();
            store.dispatch(tableUserLeaveAction(data));
        })

        this.socket.on('table:user-joined', (data) => {
            const myStream = store.getState().myStream;
            const userCurrent = store.getState().userReducer;
            const { peerId, user, media } = data
            console.log(media)

            let myMedia = { video: false, audio: false };
            myStream.stream.getTracks().forEach(track => {
                if (track.kind === 'audio' && track.readyState === 'live') {
                    myMedia = { ...myMedia, audio: true };
                }
                if (track.kind === 'video' && track.readyState === 'live') {
                    myMedia = { ...myMedia, video: true };
                }
            })

            const options = {
                metadata: {
                    user: {
                        name: userCurrent.user.name,
                        _id: userCurrent.user._id,
                    },
                    media: myMedia
                },
            };

            const call = this.myPeer.call(peerId, myStream.stream, options);
            call.on('stream', (userStream) => {
                store.dispatch(tableUserJoinAction({ user, stream: userStream, media }));
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

        this.socket.on('table:media', ({ userId, media }) => {
            console.log(userId, media)
            store.dispatch({ type: TABLE_CHANGEMEDIA, payload: { userId, media } });
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
            this.myID = id;
            store.dispatch({ type: ROOM_CHANGE });
        });
        this.myPeer.on('error', (err) => {
            console.log('peer connection error', err);
            this.myPeer.reconnect();
        })
    }

    setPeersListeners = (stream) => {
        console.log('listent call')
        this.myPeer.on('call', (call) => {
            call.answer(stream);
            call.on('stream', (userVideoStream) => {
                store.dispatch(tableUserJoinAction({
                    user: call.metadata.user,
                    stream: userVideoStream,
                    media: call.metadata.media
                }));
            });
            call.on('close', () => {
                console.log('closing peers listeners', call.metadata.id);
            });
            call.on('error', () => {
                console.log('peer error ------');
            });
            this.peers[call.metadata.user._id] = call;
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

    static getDisplayMediaStream = () => {
        const myNavigator = navigator.mediaDevices.getDisplayMedia();
        return myNavigator;
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
        myStream?.stream.getTracks().forEach(tr => {
            console.log(tr)
            tr.stop();
        });

    }
}

export default Connection;