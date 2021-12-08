import React from 'react'
import Seat1 from '../seats/seat1'

const Table1 = ({ data, ...rest }) => {
    return (
        <div {...rest}>
            <div className='bg-blue-200 relative group' style={{ minWidth: '100px' }}>
                <div className='absolute z-50 text-white text-shadow'>{data?.name}</div>
                <Seat1 className='z-10 relative' user={data?.users[0]} />
                <div className='z-10 relative'>
                    <div className='inline-block relative h-28'>
                        <div className='bg-white rounded-full w-24 h-24 relative z-30' />
                        <div className='bg-gray-200 top-4 rounded-full w-24 h-24 z-0 absolute' />
                    </div>
                </div>
                <div className='border-4 border-gray-100 w-1/2 h-1/2 absolute z-0 top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2'></div>
            </div>
        </div>
    )
}

export default Table1
