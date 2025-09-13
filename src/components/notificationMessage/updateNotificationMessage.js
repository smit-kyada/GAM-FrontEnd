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
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from 'src/graphql/mutation/message'

// ** Compressor
import Compressor from 'compressorjs';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import Loader from 'src/components/loader/loader'
import { CREATE_NOTIFICATIONMESSAGE, UPDATE_NOTIFICATIONMESSAGE } from 'src/graphql/mutation/notificationMessage'

import { useTheme } from '@mui/material/styles'

const showErrors = (field, valueLen, min) => {
    if (valueLen === 0) {
        return `${field} field is required`
    } else if (valueLen > 0 && valueLen < min) {
        return `${field} must be at least ${min} characters`
    } else {
        return ''
    }
}

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const ProfilePicture = styled('img')(({ theme }) => ({
    width: 108,
    height: 108,
    borderRadius: theme.shape.borderRadius,
    border: `4px solid ${theme.palette.common.white}`,
    [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(4)
    }
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        textAlign: 'center'
    }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
    marginLeft: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginLeft: 0,
        textAlign: 'center',
        marginTop: theme.spacing(2)
    }
}))

const schema = yup.object().shape({
    title: yup
        .string()
        .required(),

})

const UpdateNotificationMessage = props => {

    // ** Props
    const { open, toggle, messageRefetch, userData ,notificationMessageRes} = props

    const [disable, setDisable] = useState(false);

    //**state */
    const [btype, setBtype] = useState(userData?.color)

    const defaultValues = {
        title: userData?.title
    }

    const theme = useTheme()

    // ** Graphql
    const [updateMessage] = useMutation(UPDATE_NOTIFICATIONMESSAGE);

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

        let Obj = {
            id: userData?.id,
            title: data?.title,
            color: btype,
        }

        updateMessage({
            variables: {
                input: Obj
            }
        }).then((result) => {
            setDisable(false);
            toast.success('Successfully Updated!')
            notificationMessageRes();
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
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
        >
            <Header>
                <Typography variant='h6'>Create Message</Typography>
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
                            name='title'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='Title'
                                    onChange={onChange}
                                    error={Boolean(errors.title)}
                                />
                            )}
                        />
                        {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>
                        <InputLabel id='type-select'>Select Color</InputLabel>
                        <Select
                            fullWidth
                            value={btype}
                            id='selectType'
                            label='Select Color'
                            labelId='type-select'
                            onChange={e => setBtype(e.target.value)}
                            inputProps={{ placeholder: 'Select Color' }}
                        >
                            <MenuItem value="primary" sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}>primary</MenuItem>
                            <MenuItem value="secondary" sx={{ backgroundColor: theme.palette.secondary.main, color: "white" }}>secondary</MenuItem>
                            <MenuItem value="success" sx={{ backgroundColor: theme.palette.success.main, color: "white" }}>success</MenuItem>
                            <MenuItem value="error" sx={{ backgroundColor: theme.palette.error.main, color: "white" }}>error</MenuItem>
                            <MenuItem value="info" sx={{ backgroundColor: theme.palette.info.main, color: "white" }}>info</MenuItem>
                            <MenuItem value="warning" sx={{ backgroundColor: theme.palette.warning.main, color: "white" }}>warning</MenuItem>
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button type='submit' variant='contained' sx={{ mr: 3 }} disabled={disable} >
                            submit
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>

            {disable && <Loader disable={disable} />}

        </Drawer>
    )
}

export default UpdateNotificationMessage
