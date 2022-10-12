import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { addMemberTableByFileAPI, downloadMemberTableCSVAPI, getMemberTablesAPI, removeMemberTableAPI, saveTableMembersAPI } from '../../api/table.api';
import Remove from '@mui/icons-material/Remove'
import PersonAddAlt from '@mui/icons-material/PersonAddAlt'
import { AboutFormatGroupFileSwal, confirmSwal } from '../../services/swalServier';
import Swal from "sweetalert2";
import AddUserDialog from './addUserDialog';
import { getRoomAPI } from '../../api/room.api';
import { Button } from '@mui/material';

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

    useEffect(() => {
        if (!roomId) return;
        getMemberTables();
    }, [roomId, pageData])

    const getRoom = async () => {
        try {
            const res = await getRoomAPI(roomId);
            setRoom(res.data);
        } catch (err) {
            console.log(err)
        }
    };


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

    const onFileChange = async (e) => {
        const files = e.target.files;
        if (!files[0]) return;

        const fd = new FormData();
        fd.append("importFile", files[0]);
        setLoading(true);
        await addMemberTableByFileAPI(roomId, fd);
        getMemberTables();
        e.target.value = null;
    };

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
            <div className='py-4 px-6 xl:px-16 border-b-2'>
                <p className='text-left text-xl font-bold mb-3'>Groups Management</p>
                <div className='flex flex-col gap-3 items-start'>
                    <div>
                        <Button variant="contained" onClick={onSaveTableMember} color='info'>
                            Save the sitting person as a member
                        </Button>
                    </div>
                    <div className='flex gap-3'>
                        <Button variant="contained" color='info'>
                            <a href={`${process.env.REACT_APP_HOST_BASE}/api/table/members/download-csv/${roomId}`} download='user-list.xlsx'>
                                Export
                            </a>
                        </Button>
                        <Button variant="outlined" color='info'>
                            <label>
                                <input type='file' hidden
                                    onChange={(e) => {
                                        onFileChange(e);
                                    }}
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                />
                                Import by xlsx file
                            </label>
                        </Button>
                    </div>
                    <div className='text-left font-thin text-sm'>
                        <p><span className='font-bold mx-1'>note:</span>
                            Only files in our
                            <span
                                className="font-bold cursor-pointer hover:text-gray-500 mx-1"
                                onClick={AboutFormatGroupFileSwal}
                            >
                                format
                            </span>
                        </p>
                        <p>tables <b>always</b> on the <b>first floor</b> when you import by file</p>
                    </div>
                </div>
            </div>

            <div className='px-6 xl:px-16 mt-2 text-left overflow-x-auto'>
                <div className='w-full min-w-max'>
                    <div className='flex shadow-md p-4 rounded-md tracking-wider font-semibold'>
                        <div className='w-60 border-r-2 px-4 min-w-max'>
                            <p>Groups / Tables</p>
                        </div>
                        <div className=' grow px-4 min-w-max'>
                            <p>Members</p>
                        </div>
                    </div>
                    {tables.data.map(t => {
                        return (
                            <div className='text-sm mt-3 shadow-md p-4 tracking-wider flex relative w-full min-w-max'>
                                <div className='w-60 border-r-2 px-4'>
                                    <p>name: <span className='font-bold'>{t.name}</span></p>
                                    <p>number of seats: {t.numberOfSeat}</p>
                                </div>
                                <div className=' grow text-left px-4 flex flex-col gap-2'>
                                    {t.members.map((u, index) => {
                                        return (
                                            <div className='flex gap-4 items-center'>
                                                <p className=' whitespace-nowrap overflow-hidden'>{index + 1}. {u.name} - {u.email}</p>
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
        </div>
    )
}

export default GroupManagement
