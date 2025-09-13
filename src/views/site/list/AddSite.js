// ** React Imports
import { useState, useEffect, useCallback } from 'react'

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
import { CREATE_SITE } from 'src/graphql/mutation/site'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import Loader from 'src/components/loader/loader'
import { generateRandomPassword } from 'src/configs/passwordGenerator'


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

const AddSite = props => {

  // ** Props
  const { open, toggle, siteRefetch } = props

  const [disable, setDisable] = useState(false);

  const [user, setUser] = useState('')
  const [userId, setUserId] = useState('')
  const [userData, setUserData] = useState([])

  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [search, setSearch] = useState("")

  // Graphql query
  const { loading: userLoading, error: userError, data: users, refetch: userRefetch } = useQuery(GET_USER_LIST, {
    variables: { search, page: pageNumber, limit: pageSize },
    fetchPolicy: "cache-and-network",
  });


  useEffect(() => {
    users?.getUserList?.data && setUserData(users?.getUserList?.data)
  }, [users])

  const defaultValues = {
    site: "",
    description: ""
  }

  // ** Graphql
  const [createSite] = useMutation(CREATE_SITE);

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
    const genRanPasscode = generateRandomPassword(8)
    data.password = genRanPasscode
    createSite({
      variables: {
        input: data
      }
    }).then((result) => {
      setDisable(false);
      toast.success('Successfully Added!')
      siteRefetch();
      toggle()
      reset()
    }).catch((error) => {
      setDisable(false);
      toast.error(error?.message)
      toggle()
      reset()
    })
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const handleUserChange = (event, newValue) => {
    setUser(newValue)
    setUserId(newValue?.id)
    setSearch("");
  }

  const debounce = (func) => {
    let timer;

    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 600);
    };
  };

  const optimizedFn = useCallback(debounce((e) => setSearch(e)), []);



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
        <Typography variant='h6'>Add Site</Typography>
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
            <Autocomplete
              fullWidth
              value={user}
              options={userData}
              onChange={handleUserChange}
              id='autocomplete-controlled'
              renderOption={(props, option) => {
                if (option?.userName) {
                  return (
                    <li {...props} key={option.id}>
                      {option?.userName}
                    </li>
                  );
                }
              }}
              getOptionLabel={option => option.userName || ""}
              renderInput={params => <TextField  {...params} label='Select User' onChange={e => optimizedFn(e.target.value)} />}
            />
          </FormControl>

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

export default AddSite
