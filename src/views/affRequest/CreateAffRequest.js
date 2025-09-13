// ** React Imports
import { useState, useEffect } from 'react'

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
import Autocomplete from '@mui/material/Autocomplete'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { useMutation, useQuery } from '@apollo/client'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import { CREATE_AFFREQUEST } from 'src/graphql/mutation/affRequest'
import Loader from 'src/components/loader/loader'


const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const schema = yup.object().shape({
    name: yup
        .string(),
    email: yup
        .string(),
    message: yup
        .string(),
    mobile: yup
        .number(),
})

const CreateAffRequest = props => {

    // ** Props
    const { open, toggle, affRequestRefetch } = props

    const [disable, setDisable] = useState(false);


    const defaultValues = {
        name: '',
        email: '',
        message: '',
        mobile: 0,
    }

    // ** Graphql
    const [addUser] = useMutation(CREATE_AFFREQUEST);

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
        setDisable(true);
        addUser({
            variables: {
                input: data
            }
        }).then((result) => {
            setDisable(false);
            toast.success('Successfully Added!')
            affRequestRefetch();
            toggle()
            reset()
        }).catch((error) => {
            setDisable(false);
            toast.error('Something Went Wrong!')
        })
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
            transitionDuration={{ enter: 500, exit: 500 }}
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 450 } } }}
        >
            <Header>
                <Typography variant='h6'>Create Affiliate Request</Typography>
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
                            name='name'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='name'
                                    onChange={onChange}
                                    placeholder='name'
                                    error={Boolean(errors.name)}
                                />
                            )}
                        />
                        {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='email'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='email'
                                    onChange={onChange}
                                    placeholder='email'
                                    error={Boolean(errors.email)}
                                />
                            )}
                        />
                        {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='message'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    type='message'
                                    label='message'
                                    onChange={onChange}
                                    placeholder='message'
                                    error={Boolean(errors.message)}
                                />
                            )}
                        />
                        {errors.message && <FormHelperText sx={{ color: 'error.main' }}>{errors.message.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='mobile'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='mobile'
                                    onChange={onChange}
                                    placeholder='mobile'
                                    error={Boolean(errors.mobile)}
                                />
                            )}
                        />
                        {errors.mobile && <FormHelperText sx={{ color: 'error.main' }}>{errors.mobile.message}</FormHelperText>}
                    </FormControl>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button type='submit' variant='contained' sx={{ mr: 3 }} disabled={disable}>
                            submit
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>

            {disable && <Loader disable={disable}/>}
        </Drawer>
    )
}

export default CreateAffRequest
