import React from 'react'
import Seat1Bottom from '../seats/seat1bottom'
import Seat1Left from '../seats/seat1left'
import Seat1Right from '../seats/seat1right'
import Seat3Bottom from '../seats/seat3bottom'
import Seat3top from '../seats/seat3top'

const Table8 = ({ data, ...rest }) => {
    return (
        <div {...rest}>
            <div className='h-full bg-blue-200 relative' style={{ minWidth: '100px' }}>
                <div className='absolute z-50 text-white text-shadow'>{data?.name}</div>
                <div className='z-10 relative'>
                    <Seat3top users={data?.users.slice(5, 7)} />
                    <div className='flex justify-around'>
                        <Seat1Left user={data?.users[3]} />
                        <div className='inline-block relative h-28'>
                            <div className='bg-white rounded-full w-24 h-24 relative z-30' />
                            <div className='bg-gray-200 top-4 rounded-full w-24 h-24 z-0 absolute' />
                        </div>
                        <Seat1Right user={data?.users[4]} />
                    </div>
                    <Seat3Bottom users={data?.users.slice(0, 2)} />
                </div>
                <div className='border-4 border-gray-100 w-1/2 h-1/2 absolute z-0 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'></div>
            </div>
        </div>
    )
}

export default Table8