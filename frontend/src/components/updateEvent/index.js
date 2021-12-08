import { yupResolver } from '@hookform/resolvers/yup'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import RemoveIcon from '@mui/icons-material/Remove';
import { Link, useParams } from 'react-router-dom'
import TextField from "@material-ui/core/TextField";
import * as yup from 'yup'
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addTableAction, getTabelsAction, removeTableAction } from '../../store/actions/tableActions';
import LinearProgress from '@mui/material/LinearProgress';
import AsyncSelect from 'react-select/async';
import Swal from "sweetalert2";
import { searchUserAPI } from '../../api/user.api';
import { addMembersAPI, getRoomAPI, removeMemberAPI } from '../../api/room.api';

const roomSchema = yup.object().shape({
    name: yup.string().min(5).required(),
    numberOfSeat: yup.number().min(1).max(8).required()
})

function UpdateEvent() {
    const { id } = useParams();
    const tables = useSelector(state => state.tables);
    const formRef = useRef(null);
    const dispatch = useDispatch();
    const [room, setRoom] = useState(null);
    const [notFound, setNotFound] = useState(false);
    //members
    const [selected, setSelected] = useState([]);
    const { register, handleSubmit, errors, reset } = useForm({
        mode: "onBlur",
        resolver: yupResolver(roomSchema),
    })

    useEffect(() => {
        dispatch(getTabelsAction(id));
        getRoom();
    }, [])

    const getRoom = async () => {
        try {
            const res = await getRoomAPI(id);
            setRoom(res.data);
        } catch (err) {
            setNotFound(true);
        }
    }

    const createTable = (data) => {
        const table = { ...data, room: id }
        dispatch(addTableAction(table))
        reset();
    }

    const onDelete = (tableId) => {
        Swal.fire({
            icon: "question",
            title: "remove table",
            text: "confirm",
            showCancelButton: true,
            confirmButtonText: "confirm",
            cancelButtonText: "cancel",
        }).then(({ isConfirmed }) => {
            if (isConfirmed)
                dispatch(removeTableAction(tableId, id))
        })
    }

    const searchUser = (str, callback) => {
        searchUserAPI(str).then(res => {
            const options = res.data.map(u => {
                return { label: `${u.username} (${u.email})`, value: u._id };
            })
            callback(options);
        })
    }

    const onSelectChange = (e) => {
        setSelected(e);
    }

    const onAddMember = async () => {
        try {
            const userIds = selected.map(s => s.value)
            await addMembersAPI(id, userIds);
            setSelected(null)
            await getRoom();
        } catch (err) {
            console.log(err);
        }
    }

    const onRemoveMember = async (userId) => {
        try {
            const { isConfirmed } = await Swal.fire({
                icon: "question",
                title: "remove member",
                text: "confirm",
                showCancelButton: true,
                confirmButtonText: "confirm",
                cancelButtonText: "cancel",
            })
            if (!isConfirmed) return;
            const res = await removeMemberAPI(id, userId);
            console.log(res)
            await getRoom();
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <div>
            <div className='text-xl text-left p-4 font-semibold text-gray-500 flex items-center gap-4'>
                <Link to='/user/my-event'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                Update Event
            </div>
            {tables?.loading && <LinearProgress />}
            <div className='grid grid-cols-3 p-4 border-b-2' hidden={notFound}>
                <div className='text-xl font-semibold col-span-3 text-left p-4'>Tables</div>
                <div className='col-span-2 p-4 shadow-md' style={{ height: '700px' }}>
                    <div className='grid grid-cols-3 px-4 py-2 bg-gray-200 rounded-full'>
                        <div className='col-span-2 text-left border-r-2 border-gray-500'>name</div>
                        <div className='text-left pl-3'>number of seats</div>
                    </div>
                    {tables?.items?.map(s => (
                        <div className='grid grid-cols-3 px-4 py-2 bg-gray-100 rounded-full mt-4'
                            key={s._id}>
                            <div className='col-span-2 text-left border-r-2 border-gray-500'>{s.name}</div>
                            <div className='text-left pl-3 flex justify-between'>
                                {s.numberOfSeat}
                                <Button onClick={() => onDelete(s._id)}>
                                    <RemoveIcon fontSize='small' />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='p-4'>
                    <div className='text-left text-md text-gray-500 font-semibold'>Table</div>
                    <form
                        ref={formRef}
                        className='flex flex-col gap-4'
                        onSubmit={handleSubmit(createTable)}
                        noValidate>
                        <TextField
                            fullWidth
                            variant="outlined"
                            type='text'
                            name='name'
                            label='name'
                            inputRef={register}
                            error={!!errors.name}
                            helperText={errors?.name?.message}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            type='number'
                            name='numberOfSeat'
                            label='number of seats'
                            inputRef={register}
                            error={!!errors.numberOfSeat}
                            helperText={errors?.numberOfSeat?.message}
                        />
                        <Button
                            variant='contained'
                            type='submit'
                        >Add</Button>
                    </form>
                </div>
            </div >

            <div className='grid grid-cols-3 p-4 border-b-2' hidden={notFound}>
                <div className='text-xl font-semibold col-span-3 text-left p-4'>Members</div>
                <div className='col-span-2 p-4 shadow-md' style={{ height: '700px' }}>
                    <div className='grid grid-cols-2 px-4 py-2 bg-gray-200 rounded-full'>
                        <div className='text-left border-r-2 border-gray-500'>username</div>
                        <div className='text-left pl-3'>email</div>
                    </div>

                    {room && room.members.map(u => {
                        return (
                            < div className='grid grid-cols-2 px-4 py-2 bg-gray-100 rounded-full mt-4'>
                                <div className='text-left border-r-2 border-gray-500'>{u.username}</div>
                                <div className='text-left pl-3 flex justify-between'>
                                    {u.email}
                                    <Button onClick={() => onRemoveMember(u._id)}>
                                        <RemoveIcon fontSize='small' />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className='p-4'>
                    <div className='text-left text-md text-gray-500 font-semibold'>Table</div>
                    <div className=' flex flex-col gap-4'>
                        <AsyncSelect
                            isMulti={true}
                            loadOptions={searchUser}
                            value={selected}
                            onChange={onSelectChange}
                        />
                        <Button
                            variant='contained'
                            onClick={onAddMember}
                        >Add</Button>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default UpdateEvent
