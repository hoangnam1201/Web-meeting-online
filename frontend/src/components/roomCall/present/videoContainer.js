import React from 'react'
import { MyVideo, Video } from '../videoTableContainer'
import { useSelector } from 'react-redux';

const VideoContainer = ({ connection, myStream, streamDatas }) => {
    const selectedVideo = useSelector(state => state.selectedVideo);

    const getCols = () => {
        if (selectedVideo) return '';
        switch (Object.values(streamDatas).length) {
            case 0:
                return '';
            case 1:
                return 'grid-cols-2 grid gap-2  ';
            case 2:
                return 'grid-cols-3 grid gap-2 ';
            case 3:
                return 'grid-cols-2 grid gap-2 ';
            default:
                return 'grid-cols-4 grid gap-2 ';
        }
    }

    return (
        <div className={`p-3 w-full h-full overflow-auto scroll-sm ${getCols()}`}>
            {!selectedVideo ?
                <>
                    <MyVideo myStream={myStream} className="h-full" connection={connection} />
                    {streamDatas && Object.values(streamDatas).map((s, index) => {
                        return <Video className='bg-black rounded-md overflow-hidden'
                            isPin={false}
                            streamData={s}
                            key={index} />
                    })}
                </> :
                <Video className='bg-black rounded-md overflow-hidden h-full relative'
                    isPin={true}
                    streamData={selectedVideo} />
            }
        </div>
    )
}

export default VideoContainer
