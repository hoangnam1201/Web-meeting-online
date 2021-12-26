import React from 'react'
import Seat1Bottom from '../seats/seat1bottom'
import Seat3top from '../seats/seat3top'

const Table5 = ({ data, ...rest }) => {
    return (
        <div {...rest}>
            <div className='bg-blue-200 h-full relative hover:border-blue-300 border-4' style={{ minWidth: '100px' }}>
                <div className='absolute z-50 text-white text-shadow'>{data?.name}</div>
                <div className='z-10 relative'>
                    <Seat3top users={data?.users.slice(0, 3)} />
                    <div className='inline-block relative h-28'>
                        <div className='bg-white rounded-full w-24 h-24 relative z-30' />
                        <div className='bg-gray-200 top-4 rounded-full w-24 h-24 z-0 absolute' />
                    </div>
                    <div className='flex justify-center gap-8'>
                        <Seat1Bottom user={data?.users[3]} />
                        <Seat1Bottom user={data?.users[4]} />
                    </div>
                </div>
                <div className='border-4 border-gray-100 w-1/2 h-1/2 absolute z-0 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'></div>
            </div>
        </div>
    )
}

export default Table5