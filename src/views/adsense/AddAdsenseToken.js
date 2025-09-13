// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'


import { useMutation } from '@apollo/client'
import { ADD_USER } from 'src/graphql/mutation/user'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import Loader from 'src/components/loader/loader'
import { CREATE_ADSENSE_TOKEN } from 'src/graphql/mutation/adsense'
import toast from 'react-hot-toast'


const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  access_token: yup
    .string()
    .required(),
  refresh_token: yup
    .string()
    .required(),
  scope: yup
    .string()
    .required(),
  token_type: yup
    .string()
    .required(),
  expiry_date: yup
    .number(),
})

const AddAdsenseToken = props => {

  // ** Props
  const { open, toggle, tokenRefetch } = props

  const [disable, setDisable] = useState(false);

  const defaultValues = {
    access_token: '',
    refresh_token: '',
    token_type: '',
    expiry_date: 0,
    scope: '',
  }

  // ** Graphql
  const [createAdsenseToken] = useMutation(CREATE_ADSENSE_TOKEN);

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
    createAdsenseToken({
      variables: {
        "input": data
      }
    }).then((result) => {
      setDisable(false);
      toast.success('Successfully Added!')
      tokenRefetch();
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
        <Typography variant='h6'>Create Adsense Token</Typography>
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
              name='access_token'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Access Token'
                  onChange={onChange}
                  placeholder='Access Token'
                  error={Boolean(errors.access_token)}
                />
              )}
            />
            {errors.access_token && <FormHelperText sx={{ color: 'error.main' }}>{errors.access_token.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='refresh_token'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Refresh Token'
                  onChange={onChange}
                  placeholder='Refresh Token'
                  error={Boolean(errors.refresh_token)}
                />
              )}
            />
            {errors.refresh_token && <FormHelperText sx={{ color: 'error.main' }}>{errors.refresh_token.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='token_type'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Token type'
                  onChange={onChange}
                  placeholder='Token type'
                  error={Boolean(errors.token_type)}
                />
              )}
            />
            {errors.token_type && <FormHelperText sx={{ color: 'error.main' }}>{errors.token_type.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='expiry_date'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Expiry Date'
                  onChange={onChange}
                  placeholder='Expiry Date'
                  error={Boolean(errors.expiry_date)}
                />
              )}
            />
            {errors.expiry_date && <FormHelperText sx={{ color: 'error.main' }}>{errors.expiry_date.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='scope'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Scope'
                  onChange={onChange}
                  placeholder='Scope'
                  error={Boolean(errors.scope)}
                />
              )}
            />
            {errors.scope && <FormHelperText sx={{ color: 'error.main' }}>{errors.scope.message}</FormHelperText>}
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

export default AddAdsenseToken
