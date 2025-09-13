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
import { Checkbox } from '@mui/material'
import { GET_USER_LIST } from 'src/graphql/query/user'


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
})

const UpdateSubAdmin = props => {

  // ** Props
  const { open, toggle, subadminRes, subAdminData } = props

  const [disable, setDisable] = useState(false);

  const [user, setUser] = useState(subAdminData?.users)
  const [userId, setUserId] = useState(subAdminData?.users?.map(data => data?.id))
  const [userdata, setUserdata] = useState([])
  const [pageSize, setPageSize] = useState(100)
  const [pageNumber, setPageNumber] = useState(1)

  const allRole = [
    { id: 1, role: "client" },
    { id: 2, role: "subadmin" }
  ];

  let roleIndex;
  if (subAdminData?.role == "client") {
    roleIndex = 0;
  } else {
    roleIndex = 1;
  }

  const [role, setRole] = useState(allRole[roleIndex])

  // Graphql query
  const { loading: userLoading, error: userError, data: users, refetch: userListRefetch } = useQuery(GET_USER_LIST, {
    variables: { page: pageNumber, limit: pageSize, isSearch: false },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    users?.getUserList?.data && setUserdata(users?.getUserList?.data)
  }, [users])



  const defaultValues = {
    userName: subAdminData?.userName,
    email: subAdminData?.email,
    contact: subAdminData?.contact,
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



  const handleUserChange = (event, newValue) => {
    const userArr = newValue?.map(data => data?.id)
    userArr && setUserId(userArr)
    setUser(newValue)
  }


  const onSubmit = data => {
    setDisable(true);

    data.id = subAdminData?.id
    data.users = userId
    data.role = role?.role

    updateUser({
      variables: {
        input: data
      }
    }).then((result) => {
      setDisable(false);
      toast.success('Successfully Updated!')
      subadminRes();
      toggle()
      reset()
    }).catch((error) => {
      console.log("🚀 ~ onSubmit ~ error:", error)
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
        <Typography variant='h6'>Update Subadmin</Typography>
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
            <Autocomplete
              fullWidth
              multiple={true}
              disableCloseOnSelect
              defaultValue={user}
              options={userdata}
              isOptionEqualToValue={(option, value) => {
                return option.id === value.id
              }}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    style={{ marginRight: 8, }}
                    checked={selected}
                  />
                  {option?.userName}
                </li>
              )}
              onChange={handleUserChange}
              id='autocomplete-controlled'
              getOptionLabel={option => option.userName || ''}
              renderInput={params => <TextField  {...params} label='Select User' />}
            />
          </FormControl>


          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='contact'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='contact'
                  onChange={onChange}
                  placeholder='contact'
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

export default UpdateSubAdmin
