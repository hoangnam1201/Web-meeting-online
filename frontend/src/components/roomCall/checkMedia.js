import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import Connection from '../../services/connection';
import { IconButton } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import VideoIcon from "@mui/icons-material/PhotoCameraFront";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { MYSTREAM_SET } from '../../store/reducers/myStreamReducer';
import CircularProgress from '@mui/material/CircularProgress';

const CheckMedia = ({ connection }) => {
    const myVideo = useRef(null);
    const myStream = useSelector(state => state.myStream);
    const [media, setMedia] = useState({ audio: false, video: false });
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        if (connection)
            openMedia();
    }, [connection])

    const openMedia = async () => {
        try {
            console.count('get tracks')
            const stream = await Connection.getVideoAudioStream(true, true, 12)
            dispatch({ type: MYSTREAM_SET, payload: stream })
            connection.setPeersListeners(stream);
        } catch {
            console.log('err')
        }
    }


    const turnOffAudio = async () => {
        try {
            const track = myStream.stream.getTracks().find(track => track.kind === 'audio');
            track?.stop();
            dispatch({ type: MYSTREAM_SET, payload: myStream.stream })
        } catch (err) {
            console.log(err)
        }
    }

    const turnOnAudio = async () => {
        try {
            const track = myStream.stream.getTracks().find(track => track.kind === 'audio');
            if (track) {
                myStream.stream.removeTrack(track)
                track?.stop();
            }
            const streamTemp = await Connection.getVideoAudioStream(false, true, 12);
            myStream.stream.addTrack(streamTemp.getTracks()[0]);
            dispatch({ type: MYSTREAM_SET, payload: myStream.stream })
        } catch (err) {
            console.log(err)
        }
    }

    const turnOffVideo = async () => {
        try {
            const track = myStream.stream.getTracks().find(track => track.kind === 'video');
            track.stop();
            dispatch({ type: MYSTREAM_SET, payload: myStream.stream })
        } catch (err) {
            console.log(err)
        }
    }

    const turnOnVideo = async () => {
        try {
            const track = myStream.stream.getTracks().find(track => track.kind === 'video');
            if (track) {
                track?.stop();
                myStream.stream.removeTrack(track)
            }
            const streamTemp = await Connection.getVideoAudioStream(true, false, 12);
            myStream.stream.addTrack(streamTemp.getTracks()[0]);
            dispatch({ type: MYSTREAM_SET, payload: myStream.stream })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        myVideo.current.srcObject = myStream.stream;
        myVideo.current.muted = myStream.stream;

        if (!myStream.stream) return;
        let temp = {}
        console.log(myStream.stream.getTracks())
        myStream.stream.getTracks().forEach(track => {
            if (track.kind === 'audio' && track.readyState === 'live') {
                temp = { ...temp, audio: true };
            }
            if (track.kind === 'video' && track.readyState === 'live') {
                temp = { ...temp, video: true };
            }
        })
        setMedia(temp)
        connection?.replaceStream();
    }, [myStream])

    const joinRoomHandler = () => {
        connection.socket.emit('room:join', id);
    }

    return (
        <div className='min-h-screen flex justify-center items-center gap-8'>
            <div className='relative bg-black border-2 overflow-hidden rounded-md' style={{ width: '500px', height: '376px' }}>
                <video
                    ref={myVideo}
                    muted
                    autoPlay
                    style={{ width: '500px', height: '376px' }} />
                {!media.video && <div className='absolute z-20 top-1/2 left-1/2 text-white transform -translate-x-1/2
                -translate-y-1/2 text-xl font-semibold'>The camera is off</div>}
            </div>
            <div>
                <div className='text-2xl text-gray-500 font-semibold my-4'>{id}</div>
                {(connection?.socket.connected && connection?.myPeer) ?
                    <><div className='flex justify-center gap-4 my-4 '>
                        {media.audio ? (
                            <IconButton
                                variant="contained"
                                color='primary'
                                onClick={turnOffAudio}>
                                <MicIcon fontSize='large' />
                            </IconButton>) : (
                            <IconButton
                                variant="contained"
                                color='primary'
                                onClick={turnOnAudio}>
                                <MicOffIcon fontSize='large' className='text-red-500' />
                            </IconButton>
                        )}
                        {media.video ? (
                            <IconButton
                                variant="contained"
                                color='primary'
                                onClick={turnOffVideo}>
                                <VideoIcon fontSize='large' />
                            </IconButton>
                        ) : (
                            <IconButton
                                variant="contained"
                                color='primary'
                                onClick={turnOnVideo}>
                                <VideocamOffIcon fontSize='large' className='text-red-500' />
                            </IconButton>
                        )}
                    </div>
                        <Button
                            onClick={joinRoomHandler}
                            variant="contained"
                            className='bg-blue-500'>
                            Tham gia ngay
                        </Button>
                    </> : <CircularProgress />}
            </div>
        </div >
    )
}

export default CheckMedia
