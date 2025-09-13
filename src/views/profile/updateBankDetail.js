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
import { ADD_BANKDETAIL, UPDATE_BANKDETAIL } from 'src/graphql/mutation/bankDetail'


const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
}))

const schema = yup.object().shape({
    bankName: yup
        .string()
        .required(),
    accNumber: yup
        .string()
        .required(),
    ifscCode: yup
        .string()
        .required(),
    swiftCode: yup
        .string()
        .required(),
})

const UpdateBankDetail = props => {

    // ** Props
    const { open, toggle, bankDetailRefetch, userData ,handleClose } = props


    const defaultValues = {
        bankName: userData?.bankName,
        accNumber: userData?.accNumber,
        ifscCode: userData?.ifscCode,
        swiftCode: userData?.swiftCode,
    }

    // ** Graphql
    const [updateBankDetail] = useMutation(UPDATE_BANKDETAIL);

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
        data.id = userData?.id
        updateBankDetail({
            variables: {
                input: data
            }
        }).then((result) => {
            toast.success('Successfully Added!')
            bankDetailRefetch();
            handleClose()
            reset()
        }).catch((error) => {
            toast.error('Something Went Wrong!')
        })
    }

    // const handleClose = () => {
    //     toggle()
    //     reset()
    // }

    return (
        <>
            {/* <Header>
                <Typography variant='h6'>Update Bank Details</Typography>
            </Header> */}
            <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='bankName'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='bank Name'
                                    onChange={onChange}
                                    placeholder='bank Name'
                                    error={Boolean(errors.bankName)}
                                />
                            )}
                        />
                        {errors.bankName && <FormHelperText sx={{ color: 'error.main' }}>{errors.bankName.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='accNumber'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='Account Number'
                                    onChange={onChange}
                                    placeholder='Account Number'
                                    error={Boolean(errors.accNumber)}
                                />
                            )}
                        />
                        {errors.accNumber && <FormHelperText sx={{ color: 'error.main' }}>{errors.accNumber.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='ifscCode'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='IFSC Code'
                                    onChange={onChange}
                                    placeholder='IFSC Code'
                                    error={Boolean(errors.ifscCode)}
                                />
                            )}
                        />
                        {errors.ifscCode && <FormHelperText sx={{ color: 'error.main' }}>{errors.ifscCode.message}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                            name='swiftCode'
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { value, onChange } }) => (
                                <TextField
                                    value={value}
                                    label='Swift Code'
                                    onChange={onChange}
                                    placeholder='Swift Code'
                                    error={Boolean(errors.swiftCode)}
                                />
                            )}
                        />
                        {errors.swiftCode && <FormHelperText sx={{ color: 'error.main' }}>{errors.swiftCode.message}</FormHelperText>}
                    </FormControl>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                            Update
                        </Button>
                        {/* <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button> */}
                    </Box>
                </form>
            </Box>
        </>
    )
}

export default UpdateBankDetail
