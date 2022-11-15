import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import React from 'react'
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTablesAction } from '../../store/actions/tableActions';
import { LoadingButton } from '@mui/lab';

const AutoAddTablesDialog = ({ data, open, onClose }) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
    handleSubmit,
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: { from: 0, count: 1, to: 1 }
  })
  const countField = watch(['count', 'from']);
  const dispatch = useDispatch();
  const tables = useSelector(state => state.tables)

  useEffect(() => {
    if (countField[0] !== '' && countField[1] !== '') {
      return setValue('to', countField[0] * 1 + countField[1] * 1 - 1, { shouldValidate: true })
    }
    setValue('to', '')
  }, [countField[0], countField[1]])

  useEffect(() => {
    if (open)
      reset({ from: 0, count: 1, to: 1 })
  }, [open])

  const addHandler = (formData) => {
    const tables = Array.from({ length: formData.count }, (_, index) => index + formData.from * 1).map(i => {
      return {
        ...data,
        name: formData.basename + ' ' + i,
        numberOfSeat: formData.numberOfSeat,
      }
    });
    dispatch(addTablesAction(tables, data.room, data.floor, onClose))
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        Auto add tables
      </DialogTitle>
      <DialogContent sx={{ padding: '1rem' }}>
        <DialogContentText>
          it will auto create table with auto name and same number of seats
        </DialogContentText>
        <Grid2 container columnSpacing={2}>
          <Grid2 md={12}>
            <TextField label='Count' margin="dense"
              type='number'
              {...register('count', {
                required: { value: true, message: 'required' },
                min: { value: 1, message: 'min count is 1' },
                max: {value: 20, message: 'max count is 20'}
              })}
              error={!!errors.count}
              helperText={errors?.count?.message}
            />
          </Grid2>
          <Grid2 md={8}>
            <TextField fullWidth label='Base name' margin='dense'
              {...register('basename', {
                required: true,
                minLength: { value: 3, message: 'minlength count is 3' }
              })}
              error={!!errors.basename}
              helperText={errors?.basename?.message}
            />
          </Grid2>
          <Grid2 md={4}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField fullWidth label='from' margin='dense'
                type='number'
                {...register('from', {
                  required: true,
                })}
                error={!!errors.from}
                helperText={errors?.from?.message}
              />
              <ArrowRightIcon />
              <TextField fullWidth label='to' margin='dense'
                disabled
                type='number'
                {...register('to', {
                  required: true,
                })}
                error={!!errors.to}
                helperText={errors?.to?.message}
              />
            </div>
          </Grid2>
          <Grid2 md={12}>
            <TextField fullWidth label='number of seats' type="number" margin='dense'
              {...register('numberOfSeat', {
                required: true,
                min: { value: 1, message: 'min number of seats is 1' },
                max: { value: 8, message: 'max number of seats is 8' }
              })}
              error={!!errors.numberOfSeat}
              helperText={errors?.numberOfSeat?.message}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button style={{ color: 'gray' }} onClick={() => onClose()} disabled={tables?.loading}>Cacel</Button>
        <LoadingButton variant="outlined" onClick={handleSubmit(addHandler)} loading={tables?.loading}>Add</LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default AutoAddTablesDialog