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
import { GET_USER_LIST } from "src/graphql/query/user"
import { UPDATE_SITE } from 'src/graphql/mutation/site'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import Loader from 'src/components/loader/loader'


const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const schema = yup.object().shape({
    site: yup
        .string()
        .required(),
    description: yup
        .string(),
})

const UpdateSite = props => {

    // ** Props
    const { open, toggle, userData, siteRes } = props

    const [disable, setDisable] = useState(false);

    const defaultValues = {
        site: userData?.site,
        description: userData?.description
    }

    // ** Graphql
    const [updateSite] = useMutation(UPDATE_SITE);

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

        userId && (data.userId = userId)
        data.id = userData?.id
        updateSite({
            variables: {
                input: data
            }
        }).then((result) => {
            setDisable(false);
            toast.success('Successfully Update!')
            siteRes();
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

    const handleUserChange = (event, newValue) => {
        setUser(newValue)
        setUserId(newValue?.id)
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
                <Typography variant='h6'>Update Site</Typography>
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
                            name='site'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='site'
                                    onChange={onChange}
                                    placeholder='site'
                                    error={Boolean(errors.site)}
                                />
                            )}
                        />
                        {errors.site && <FormHelperText sx={{ color: 'error.main' }}>{errors.site.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='description'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    multiline
                                    rows={4}
                                    value={value}
                                    label='description'
                                    onChange={onChange}
                                    placeholder='description'
                                    error={Boolean(errors.description)}
                                />
                            )}
                        />
                        {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
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

            {disable && <Loader disable={disable} />}

        </Drawer>
    )
}

export default UpdateSite
