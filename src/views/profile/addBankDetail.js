import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { UPDATE_USER } from 'src/graphql/mutation/user'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ME } from 'src/graphql/query/user'
import { useEffect, useState } from 'react'


const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

// const schema = yup.object().shape({
//   bankName: yup
//     .string()
//     .required(),
//   accNumber: yup
//     .string()
//     .required(),
//   ifscCode: yup
//     .string()
//     .required(),
//   swiftCode: yup
//     .string()
//     .required(),
// })

const schema = yup.object().shape({
  userName: yup
    .string()
    .required(),
  email: yup
    .string()
    .required(),
  contact: yup
    .number(),
  companyName: yup
    .string()
    .required(),
  fName: yup
    .string()
    .required(),
  fName: yup
    .string()
    .required(),
  companyAddress: yup
    .string()
    .required(),
  pincode: yup
    .number()
    .required(),
})

const AddBankDetail = props => {

  // ** Props
  const { user, toggle, userRefetch } = props


  // const { user } = useAuth()

  // const defaultValues = {
  //   bankName: '',
  //   accNumber: '',
  //   ifscCode: '',
  //   swiftCode: '',
  // }

  const defaultValues = {
    companyName: user?.companyName,
    userName: user?.userName,
    email: user?.email,
    fName: user?.fName,
    lName: user?.lName,
    contact: user?.contact,
    companyAddress: user?.companyAddress,
    pincode: user?.pincode,
  }

  // ** Graphql
  // const [addBankDetail] = useMutation(ADD_BANKDETAIL);
  const [updateUser] = useMutation(UPDATE_USER);

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


    user.id && (data.id = user?.id)

    updateUser({
      variables: {
        input: data
      }
    }).then((result) => {
      toast.success('Successfully Added!')

      // reset()
      userRefetch();
    }).catch((error) => {
      reset()
      toast.error(error?.message)
    })

  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <>
      <Header>
        <Typography variant='h6'>Update Profile</Typography>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }} >
        {/* <form onSubmit={handleSubmit(onSubmit)}>
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
              submit
            </Button>
          </Box>
        </form> */}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='companyName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Company Name'
                  onChange={onChange}
                  placeholder='Company Name'
                  error={Boolean(errors.companyName)}
                />
              )}
            />
            {errors.companyName && <FormHelperText sx={{ color: 'error.main' }}>{errors.companyName.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='userName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='User Name'
                  onChange={onChange}
                  placeholder='User Name'
                  error={Boolean(errors.userName)}
                />
              )}
            />
            {errors.userName && <FormHelperText sx={{ color: 'error.main' }}>{errors.userName.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='fName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='First Name'
                  onChange={onChange}
                  placeholder='First Name'
                  error={Boolean(errors.fName)}
                />
              )}
            />
            {errors.fName && <FormHelperText sx={{ color: 'error.main' }}>{errors.fName.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='lName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Last Name'
                  onChange={onChange}
                  placeholder='Last Name'
                  error={Boolean(errors.lName)}
                />
              )}
            />
            {errors.lName && <FormHelperText sx={{ color: 'error.main' }}>{errors.lName.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Email'
                  onChange={onChange}
                  placeholder='Email'
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='contact'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Contact'
                  onChange={onChange}
                  placeholder='Contact'
                  error={Boolean(errors.contact)}
                />
              )}
            />
            {errors.contact && <FormHelperText sx={{ color: 'error.main' }}>{errors.contact.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='companyAddress'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  multiline
                  rows={4}
                  label='Company Address'
                  onChange={onChange}
                  placeholder='Flat No. ,   Apartment  , Street Name   ,   City   ,  State'
                  error={Boolean(errors.companyAddress)}
                />
              )}
            />
            {errors.companyAddress && <FormHelperText sx={{ color: 'error.main' }}>{errors.companyAddress.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='pincode'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Pincode'
                  onChange={onChange}
                  placeholder='Pincode'
                  error={Boolean(errors.pincode)}
                />
              )}
            />
            {errors.pincode && <FormHelperText sx={{ color: 'error.main' }}>{errors.pincode.message}</FormHelperText>}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              submit
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>



      </Box>
    </>
  )
}

export default AddBankDetail
