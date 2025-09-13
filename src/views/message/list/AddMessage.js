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
    description: yup
        .string(),
    url: yup
        .string(),
    burl: yup
        .string(),
    iurl: yup
        .string(),

})

const AddMessage = props => {

    // ** Props
    const { open, toggle, messageRefetch } = props

    const [disable, setDisable] = useState(false);

    //**state */
    const [btype, setBtype] = useState("")
    const [imgSrc, setImgSrc] = useState("")
    const [imginputValue, setImgInputValue] = useState('')
    const [imgbase64, setImgBase64] = useState("")
    const [itype, setItype] = useState("")
    const [iconSrc, setIconSrc] = useState("")
    const [iconinputValue, setIconInputValue] = useState('')
    const [iconbase64, setIconBase64] = useState("")



    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleInputImgChange = file => {
        const reader = new FileReader()
        const { files } = file.target
        if (files && files.length !== 0) {
            new Compressor(files[0], {
                quality: 0.4,
                success: (compressedResult) => {
                    convertToBase64(compressedResult).then((result) => setImgBase64(result)).catch(error => console.log(error))
                }
            });
            reader.onload = () => {
                setImgSrc(reader.result)
            }
            reader.readAsDataURL(files[0])
            if (reader.result !== null) {
                setImgInputValue(reader.result)
            }
        }
    }

    const handleInputImgReset = () => {
        setImgInputValue('')
        setImgSrc('')
    }

    const handleInputIconChange = file => {
        const reader = new FileReader()
        const { files } = file.target
        if (files && files.length !== 0) {
            new Compressor(files[0], {
                quality: 0.4,
                success: (compressedResult) => {
                    convertToBase64(compressedResult).then((result) => setIconBase64(result)).catch(error => console.log(error))
                }
            });
            reader.onload = () => {
                setIconSrc(reader.result)
            }
            reader.readAsDataURL(files[0])
            if (reader.result !== null) {
                setIconInputValue(reader.result)
            }
        }
    }

    const handleInputIconReset = () => {
        setIconInputValue('')
        setIconSrc('')
    }

    const defaultValues = {
        description: "",
        title: "",
        url: "",
        burl: "",
        iurl: ""
    }

    // ** Graphql
    const [createMessage] = useMutation(CREATE_MESSAGE);

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

        // imgbase64 && (data.image = imgbase64)
        // iconbase64 && (data.icon = iconbase64)

        let Obj ={
            title:data?.title,
            description:data?.description,
            url:data?.url
        }

        if (itype === "Base64" && iconbase64) {
            Obj.icon = iconbase64
        }
        if (itype === "Url") {
            Obj.icon = data?.iurl
        }
        if (btype === "Base64" && imgbase64) {
            Obj.image = imgbase64
        }
        if (btype === "Url") {
            Obj.image = data?.burl
        }


        createMessage({
            variables: {
                input: Obj
            }
        }).then((result) => {
            setDisable(false);
            toast.success('Successfully Added!')
            messageRefetch();
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

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='description'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='Description '
                                    onChange={onChange}
                                    error={Boolean(errors.description)}
                                />
                            )}
                        />
                        {errors.description && <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='url'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='URL'
                                    onChange={onChange}
                                    error={Boolean(errors.url)}
                                />
                            )}
                        />
                        {errors.url && <FormHelperText sx={{ color: 'error.main' }}>{errors.url.message}</FormHelperText>}
                    </FormControl>

                    <Divider sx={{ m: '0 !important' }} />

                    <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>
                        <InputLabel id='type-select'>Select Message Image Type</InputLabel>
                        <Select
                            fullWidth
                            value={btype}
                            id='selectType'
                            label='Select Message Image Type'
                            labelId='type-select'
                            onChange={e => setBtype(e.target.value)}
                            inputProps={{ placeholder: 'Select Message Image Type' }}
                        >
                            <MenuItem value="Base64">Base64</MenuItem>
                            <MenuItem value="Url">Url</MenuItem>
                        </Select>
                    </FormControl>

                    {btype === "Url" && <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='burl'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='messageUrl'
                                    onChange={onChange}
                                    placeholder='messageUrl'
                                    error={Boolean(errors.burl)}
                                />
                            )}
                        />
                        {errors.burl && <FormHelperText sx={{ color: 'error.main' }}>{errors.burl.message}</FormHelperText>}
                    </FormControl>}

                    {btype === "Base64" && <Box sx={{ display: 'flex', alignItems: 'center', mb: 7 }}>
                        {imgSrc && <ProfilePicture src={imgSrc} sx={{ mr: 5 }} />}
                        <div>
                            <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-img' sx={{ mb: 2, ml: 4 }}>
                                Choose Message Image
                                <input
                                    hidden
                                    type='file'
                                    value={imginputValue}
                                    onChange={handleInputImgChange}
                                    id='account-settings-upload-img'
                                />
                            </ButtonStyled>
                            <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputImgReset} sx={{ mb: 2 }}>
                                Reset
                            </ResetButtonStyled>
                        </div>
                    </Box>}

                    <Divider sx={{ m: '0 !important' }} />

                    <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>
                        <InputLabel id='type-select'>Select Icon Type</InputLabel>
                        <Select
                            fullWidth
                            value={itype}
                            id='selectType'
                            label='Select Icon Type'
                            labelId='type-select'
                            onChange={e => setItype(e.target.value)}
                            inputProps={{ placeholder: 'Select Icon Type' }}
                        >
                            <MenuItem value="Base64">Base64</MenuItem>
                            <MenuItem value="Url">Url</MenuItem>
                        </Select>
                    </FormControl>
                    {itype === "Url" && <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='iurl'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='IconUrl'
                                    onChange={onChange}
                                    placeholder='IconUrl'
                                    error={Boolean(errors.iurl)}
                                />
                            )}
                        />
                        {errors.iurl && <FormHelperText sx={{ color: 'error.main' }}>{errors.iurl.message}</FormHelperText>}
                    </FormControl>}

                    {itype === "Base64" && <Box sx={{ display: 'flex', alignItems: 'center', mb: 7 }}>
                        {iconSrc && <ProfilePicture src={iconSrc} sx={{ mr: 5 }} />}
                        <div>
                            <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-img-2' sx={{ mb: 2, ml: 4 }}>
                                Choose Message Icon
                                <input
                                    hidden
                                    type='file'
                                    value={iconinputValue}
                                    onChange={handleInputIconChange}
                                    id='account-settings-upload-img-2'
                                />
                            </ButtonStyled>
                            <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputIconReset} sx={{ mb: 2 }}>
                                Reset
                            </ResetButtonStyled>
                        </div>
                    </Box>}

                    {/* <Divider sx={{ m: '0 !important' }} /> */}

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

            {disable && <Loader disable={disable}/>}

        </Drawer>
    )
}

export default AddMessage
