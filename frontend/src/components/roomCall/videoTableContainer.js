import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import MicOffIcon from "@mui/icons-material/MicOff";
import Avatar from 'react-avatar';

const VideoTableContainer = ({ ...rest }) => {
    const tableCall = useSelector(state => state.tableCall);

    return (
        <div {...rest}>
            <div className='flex gap-4 justify-center'>
                <MyVideo className='w-44 h-32 bg-gray-600 rounded-md overflow-hidden' />
                {tableCall?.streams.map(s => {
                    return <Video className='w-44 h-32 bg-gray-600 rounded-md overflow-hidden' name={s.user.name} stream={s.stream} key={s.user._id} />
                })}
            </div>
        </div>
    )
}



const MyVideo = React.memo(({ ...rest }) => {
    const myStream = useSelector(state => state.myStream);
    const currentUser = useSelector((state) => state.userReducer);
    const videoRef = useRef(null)
    const [media, setMedia] = useState({ video: false, audio: false })

    useEffect(() => {
        if (!myStream) return;
        const stream = myStream.stream;
        if (!stream) return;

        let temp = {}
        stream.getTracks().forEach(track => {
            if (track.kind === 'audio' && track.readyState === 'live') {
                temp = { ...temp, audio: true };
            }
            if (track.kind === 'video' && track.readyState === 'live') {
                temp = { ...temp, video: true };
            }
        })
        setMedia(temp)
        videoRef.current.srcObject = stream;
        videoRef.current.muted = stream;
    }, [myStream])

    return (
        <div {...rest}>
            <div className='h-full w-full relative' >
                <video ref={videoRef} autoPlay className='h-full w-full' />
                <div className='absolute top-1 left-1 z-10 flex gap-2'>
                    <div className='text-shadow text-white'> {currentUser?.user?.name} </div>
                    <div hidden={media.audio}>
                        <MicOffIcon className='text-red-500' />
                    </div>
                </div>
                {!media.video && <Avatar
                    name={currentUser?.user?.name}
                    round
                    className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                />}
            </div>
        </div>
    )
})

const Video = ({ name, stream, ...rest }) => {
    const videoRef = useRef(null)
    const [media, setMedia] = useState({ video: false, audio: false })

    console.log(stream.getTracks())

    useEffect(() => {
        if (!stream) return;
        let temp = {}
        stream.getTracks().forEach(track => {
            if (track.kind === 'audio' && track.readyState === 'live') {
                temp = { ...temp, audio: true };
            }
            if (track.kind === 'video' && track.readyState === 'live') {
                temp = { ...temp, video: true };
            }
        })
        console.log('video', stream.getTracks())
        setMedia(temp)
        videoRef.current.defaultMuted = true;
        videoRef.current.muted = true;
        videoRef.current.srcObject = stream;
        // videoRef.current.muted = stream;

        console.log('video render')
    }, [stream])

    return (
        <div {...rest}>
            <div className='h-full w-full relative' >
                <video ref={videoRef} className='h-full w-full' muted autoPlay />
                <div className='absolute top-1 left-1 z-10 flex gap-2'>
                    <div className='text-shadow text-white'> {name} </div>
                    <div hidden={media.audio}>
                        <MicOffIcon className='text-red-500' />
                    </div>
                </div>
                {!media.video && <Avatar
                    name={name}
                    round
                    className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                />}
            </div>
        </div>
    )
}

export default VideoTableContainer
