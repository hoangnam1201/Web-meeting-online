import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MicOffIcon from "@mui/icons-material/MicOff";
import PushPinIcon from '@mui/icons-material/PushPin';
import Avatar from 'react-avatar';
import { IconButton } from '@mui/material';
import { SET_SELECTEDVIDEO } from '../../store/reducers/selectVideoReducer';
import Connection from '../../services/connection';

const VideoTableContainer = ({ myStream, streamDatas, ...rest }) => {

    return (
        <div {...rest}>
            <div className='flex gap-4 justify-center'>
                <MyVideo className='w-44 h-32 bg-gray-600 rounded-md overflow-hidden' myStream={myStream} />
                {streamDatas && Object.values(streamDatas).map((s, index) => {
                    return <Video className='w-44 h-32 bg-gray-600 rounded-md overflow-hidden'
                        user={s.user}
                        stream={s.stream}
                        media={s.media}
                        key={index} />
                })}
            </div>
        </div>
    )
}



export const MyVideo = React.memo(({ myStream, ...rest }) => {
    const videoRef = useRef(null)
    const [media, setMedia] = useState({ video: false, audio: false })
    const dispatch = useDispatch();

    useEffect(() => {

        if (!myStream) return;
        const stream = myStream.stream;
        if (!stream) return;

        setMedia(Connection.getMediaStatus(stream));
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;

    }, [myStream])

    return (
        <div {...rest}>
            <div className='h-full w-full relative' >
                <video ref={videoRef} autoPlay className='h-full w-full' muted hidden={!media.video} />
                <div className='absolute top-1 left-1 z-10 w-full px-2 flex justify-between items-center'>
                    <div className='flex gap-2'>
                        <div className='text-shadow text-white'> You </div>
                        <div hidden={media.audio}>
                            <MicOffIcon className='text-red-500' />
                        </div>
                    </div>
                    <div>
                        <IconButton onClick={() => {
                            dispatch({
                                type: SET_SELECTEDVIDEO,
                                payload: {
                                    user: null, stream: myStream.stream, media
                                }
                            });
                        }}>
                            <PushPinIcon className=' text-white' fontSize='small' />
                        </IconButton>
                    </div>
                </div>
                {!media.video && <Avatar
                    value='You'
                    color='purple'
                    round
                    className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                />}
            </div>
        </div >
    )
})

export const Video = ({ user, stream, media, ...rest }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!stream) return;
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        audioRef.current.srcObject = stream;
    }, [stream])

    const onPin = () => {
        console.log('pin')
        dispatch({
            type: SET_SELECTEDVIDEO,
            payload: { user, stream, media }
        });
    };

    console.log('media')

    return (
        <div {...rest}>
            <div className='h-full w-full relative' >
                <video ref={videoRef} className='h-full w-full' autoPlay muted={true} hidden={!media.video} />
                <audio ref={audioRef} autoPlay />
                <div className='w-full absolute top-1 left-1 z-10 flex justify-between px-3'>
                    <div className='flex gap-2'>
                        <div className='text-shadow text-white'> {user.name} </div>
                        <div hidden={media.audio}>
                            <MicOffIcon className='text-red-500' />
                        </div>
                    </div>
                    <div>
                        <IconButton onClick={onPin}>
                            <PushPinIcon className=' text-gray-100' fontSize='small' />
                        </IconButton>
                    </div>
                </div>
                {!media.video && <Avatar
                    name={user.name}
                    round
                    className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                />}
            </div>
        </div>
    )
}

export default React.memo(VideoTableContainer)
