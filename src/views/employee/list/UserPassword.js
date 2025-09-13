// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { useMutation } from '@apollo/client'
import { UPDATE_PASSWORD } from "src/graphql/mutation/user"

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'


const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const schema = yup.object().shape({
    newPassword: yup
        .string()
        .required(),
    confirmPassword: yup
        .string()
        .required(),

})


const SidebarUpdatedUser = ({ userData, open, toggle, userRes }) => {

    // ** Graphql
    const [updatePassword] = useMutation(UPDATE_PASSWORD);

    const defaultValues = {
        newPassword: "",
        confirmPassword: ""
    }

    const {
        reset,
        control,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })

    const onSubmit = data => {

        if (data?.newPassword === data?.confirmPassword) {
            updatePassword({ variables: {updatePasswordId:userData?.id , password: data?.newPassword } }).then((result) => {
                toast.success('Successfully Updated!')
                userRes();
                toggle()
                reset()
            }).catch((error) => {
                toast.error('Something Went Wrong!')
                toggle()
            })
        } else {
            toggle()
            toast.error('Confirm Password And Password does not match!')
        }

    }

    const handleClose = () => {
        toggle()
        reset()
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 450 } } }}
        >
            <Header>
                <Typography variant='h6'>Change Password</Typography>
                <IconButton
                    size='small'
                    onClick={handleClose}
                    sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
                >
                    <Icon icon='tabler:x' fontSize='1.125rem' />
                </IconButton>
            </Header>
            <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='newPassword'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    type='password'
                                    value={value}
                                    label='New Password'
                                    onChange={onChange}
                                    placeholder='New Password'
                                    error={Boolean(errors.newPassword)}
                                />
                            )}
                        />
                        {errors.newPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='confirmPassword'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    type='password'
                                    value={value}
                                    label='Confirm New Password'
                                    onChange={onChange}
                                    placeholder='Confirm New Password'
                                    error={Boolean(errors.confirmPassword)}
                                />
                            )}
                        />
                        {errors.confirmPassword && <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmPassword.message}</FormHelperText>}
                    </FormControl>


                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                            Update
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    )
}

export default SidebarUpdatedUser
