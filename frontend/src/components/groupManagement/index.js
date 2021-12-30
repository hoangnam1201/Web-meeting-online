import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getMemberTablesAPI, removeMemberTableAPI, saveTableMembersAPI } from '../../api/table.api';
import Remove from '@mui/icons-material/Remove'
import PersonAddAlt from '@mui/icons-material/PersonAddAlt'
import { confirmSwal } from '../../services/swalServier';
import Swal from "sweetalert2";
import AddUserDialog from './addUserDialog';
import { getRoomAPI } from '../../api/room.api';

const GroupManagement = () => {
    const { roomId } = useParams();
    const [tables, setTables] = useState({ count: 0, data: [] });
    const [room, setRoom] = useState(null);
    const [pageData, setPageData] = useState({ page: 0, pageSize: 10 });
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState({ tableId: null, user: null });

    useEffect(() => {
        getRoom()
    }, [])

    const getRoom = async () => {
        try {
            const res = await getRoomAPI(roomId);
            setRoom(res.data);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        if (!roomId) return;
        getMemberTables();
    }, [roomId, pageData])

    const getMemberTables = () => {
        const { page, pageSize } = pageData;
        setLoading(true);
        getMemberTablesAPI(roomId, page, pageSize).then(res => {
            const { count, results } = res.data;
            setTables({ count, data: results });
            setLoading(false);
        })
    }

    const onPageChange = (e, value) => {
        setPageData({ ...pageData, page: value - 1 })
    }

    const onSaveTableMember = () => {
        confirmSwal('save table members'
            , 'save the people sitting at the tables as members of that table',
            () => {
                saveTableMembersAPI(roomId)
                    .then(() => {
                        Swal.fire({
                            icon: 'success',
                            title: 'save success'
                        }).then(() => {
                            getMemberTables();
                        })
                    });
            })
    }

    return (
        <div className='text-gray-500 py-4'>
            <AddUserDialog
                roomId={roomId}
                tableId={selected.tableId}
                open={selected.tableId && !selected.user}
                onSuccess={() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success'
                    }).then(() => {
                        setSelected({ tableId: null, user: null })
                        getMemberTables();
                    })
                }}
                onClose={() => {
                    setSelected({ tableId: null, user: null })
                }} />
            <div className='py-4 px-6 xl:px-16 border-b-2 flex justify-between'>
                <p className='text-left text-xl font-bold'>Groups Management</p>
                <button className='bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-md font-semibold'
                    onClick={onSaveTableMember}>
                    Save the sitting person as a member
                </button>
            </div>

            <div className='px-6 xl:px-16 mt-2 text-left'>
                <div className='flex shadow-md p-4 rounded-md tracking-wider font-semibold'>
                    <div className='w-1/3 border-r-2 px-4'>
                        <p>Groups / Tables</p>
                    </div>
                    <div className='w-2/3 px-4'>
                        <p>Members</p>
                    </div>
                </div>
                {tables.data.map(t => {
                    return (
                        <div className='text-sm mt-3 shadow-md p-4 tracking-wider flex relative'>
                            <div className='w-1/3 border-r-2 px-4'>
                                <p>name: <span className='font-bold'>{t.name}</span></p>
                                <p>number of seats: {t.numberOfSeat}</p>
                            </div>
                            <div className='w-2/3 text-left px-4 flex flex-col gap-2'>
                                {t.members.map((u, index) => {
                                    return (
                                        <div className='flex gap-4 items-center'>
                                            <p>{index + 1}. {u.name} - {u.email}</p>
                                            <button
                                                onClick={() => {
                                                    confirmSwal('Remove Member',
                                                        'Are you sure?', () => {
                                                            removeMemberTableAPI(t._id, u._id).then(() => {
                                                                Swal.fire({
                                                                    icon: 'success',
                                                                    title: 'Success'
                                                                }).then(() => {
                                                                    getMemberTables();
                                                                })
                                                            })
                                                        })
                                                }}>
                                                <Remove />
                                            </button>
                                        </div>
                                    )

                                })}
                            </div>
                            {t.members.length < t.numberOfSeat && (
                                <IconButton onClick={() => setSelected({ tableId: t._id, user: null })}>
                                    <PersonAddAlt />
                                </IconButton>)}
                        </div>
                    )
                })}
                <div className='py-2'>
                    {loading && <LinearProgress />}
                </div>
                <div className='flex justify-center py-4'>
                    <Pagination count={Math.ceil(tables.count / pageData.pageSize)}
                        size='large' onChange={onPageChange} defaultValue={pageData.page} />
                </div>
            </div>
        </div>
    )
}

export default GroupManagement
