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
import { UPDATE_USER } from 'src/graphql/mutation/user'

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
  pincode: yup
    .number(),

  // .required(),
  companyAddress: yup
    .string()
    .required(),
  Designation: yup
    .string()
    .required(),

})

const UpdateUser = props => {

  // ** Props
  const { open, toggle, userRes, userData } = props

  const [disable, setDisable] = useState(false);

  const allRole = [
    { id: 1, role: "client" },
    { id: 2, role: "subadmin" }
  ];

  let roleIndex;
  if (userData?.role == "client") {
    roleIndex = 0;
  } else {
    roleIndex = 1;
  }

  const [role, setRole] = useState(allRole[roleIndex])

  const defaultValues = {
    companyName: userData?.companyName || " ",
    userName: userData?.userName || " ",
    email: userData?.email || " ",
    fName: userData?.fName || " ",
    lName: userData?.lName || " ",
    contact: userData?.contact || " ",
    companyAddress: userData?.companyAddress || " ",
    pincode: userData?.pincode || 0,
    Designation: userData?.Designation || " ",
  }

  // ** Graphql
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
    setDisable(true);
    data.id = userData?.id
    data.role = role?.role
    updateUser({
      variables: {
        input: data
      }
    }).then((result) => {
      setDisable(false);
      toast.success('Successfully Updated!')
      userRes();
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


  const handleRoleChange = (event, newValue) => {
    setRole(newValue);
  };

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
        <Typography variant='h6'>Update User</Typography>
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
            <Autocomplete
              fullWidth
              value={role}
              options={allRole}
              onChange={handleRoleChange}
              id='autocomplete-controlled'
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {option.role}
                </li>
              )}
              getOptionLabel={option => option.role || ""}
              renderInput={params => <TextField {...params} label='Select Role' />}
            />
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

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='Designation'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Designation'
                  onChange={onChange}
                  placeholder='Designation'
                  error={Boolean(errors.Designation)}
                />
              )}
            />
            {errors.Designation && <FormHelperText sx={{ color: 'error.main' }}>{errors.Designation.message}</FormHelperText>}
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

export default UpdateUser
