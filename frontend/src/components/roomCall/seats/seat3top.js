import React from 'react'
import Avatar from 'react-avatar'

const Seat3top = ({ users = [] }) => {
    return (
        <div>
            <div className='relative inline-block'>
                <div className=' bg-red-200 w-96 h-4 absolute z-20 top-0' />
                <div className=' bg-red-200 w-4 h-12 absolute z-20 -left-3 rounded-lg top-0' />
                <div className=' bg-red-200 w-4 h-12 absolute z-20 left-96 rounded-lg top-0' />
                <div className='grid grid-cols-3 w-96 h-20 bg-red-300 relative z-10' >
                    <div className='flex justify-center items-center'>
                        {users[0] && <Avatar
                            name={users[0]?.name}
                            size="60"
                            round={true}
                            className='shadow-md absolute'
                        />}
                    </div>
                    <div className='border-red-400 border-l-4 flex justify-center items-center'>
                        {users[1] && <Avatar
                            name={users[1]?.name}
                            size="60"
                            round={true}
                            className='shadow-md'
                        />}
                    </div>
                    <div className='border-red-400 border-l-4 flex justify-center items-center'>
                        {users[2] && <Avatar
                            name={users[2]?.name}
                            size="60"
                            round={true}
                            className='shadow-md'
                        />}
                    </div>
                </div>
                <div className='grid w-96 h-20 bg-red-400 absolute top-2 z-0' />
            </div>
        </div>
    )
}

export default Seat3top
