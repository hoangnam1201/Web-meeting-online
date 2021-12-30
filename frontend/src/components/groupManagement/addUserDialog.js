import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import CancelIcon from '@mui/icons-material/Cancel';
import { addMemberTableAPI, searchMemberAPI } from '../../api/table.api';

const AddUserDialog = ({ roomId, onSuccess, tableId, onClose, open, ...rest }) => {
    const [option, setOption] = useState(null);
    const [options, setOptions] = useState([]);

    const handlerClose = () => {
        onClose && onClose();
    }

    useEffect(() => {
        if (!open) return;
        searchMemberAPI(roomId)
            .then(res => {
                setOptions(res.data.map(u => {
                    return {
                        label: `${u.username}-${u.name}-${u.email}`,
                        value: u._id
                    }
                }))
            })
        return () => {
            setOption(null)
            setOptions([])
        }
    }, [open])

    const addMemberHandler = async () => {
        try {
            await addMemberTableAPI(tableId, option.value);
            onSuccess && onSuccess();
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            {open && <div className='fixed w-full h-full z-40 top-0 left-0 transition-all'>
                <div className='w-full h-full absolute bg-gray-600 opacity-40 top-0 left-0'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 shadow-xl rounded-md' >
                    <div className='w-96 p-4 flex flex-col gap-4 relative'>
                        <p className=' font-semibold text-gray-500'>
                            Enter username of member
                        </p>
                        <Select
                            options={options}
                            value={option}
                            onChange={(e) => setOption(e)}
                        />
                        <Button fullWidth variant='contained' onClick={addMemberHandler}>Add member</Button>
                    </div>
                    <div className='absolute top-0 left-full transform -translate-x-full'>
                        <IconButton onClick={handlerClose}>
                            <CancelIcon />
                        </IconButton>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default AddUserDialog
