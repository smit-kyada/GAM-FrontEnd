// ** React Imports
import { useEffect, useState } from 'react'

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
import { UPDATE_MESSAGELOG } from 'src/graphql/mutation/messageLog'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import { GET_ALL_MESSAGES } from 'src/graphql/query/message'
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

const schema = yup.object().shape({

  click: yup
    .string(),
  site: yup.string()
})

const UpdateMessageLog = ({ userData, open, toggle, sitesRes }) => {

  const [disable, setDisable] = useState(false);

  // ** Graphql
  const [updateSites] = useMutation(UPDATE_MESSAGELOG);

  const [allMessage, setAllMessage] = useState([])
  const [messageId, setMessageId] = useState(userData?.messageId?.id)
  const [messageName, setMessageName] = useState(userData?.messageId)


  // Graphql query
  const { loading: messageLoading, error: messageError, data: messageData, refetch: messageRefetch } = useQuery(GET_ALL_MESSAGES, {
    variables: { page: 1, limit: [] },
    fetchPolicy: "cache-and-network",
  });


  useEffect(() => {
    messageData?.getAllMessages?.data && setAllMessage(messageData?.getAllMessages?.data)
  }, [messageData])

  const defaultValues = {
    click: userData?.click,
    site: userData?.site
  }

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

    // data.id = userData?.id;
    updateSites({
      variables: {
        input: {
          messageId: messageId,
          click: data?.click,
          site: data.site,
          id: userData?.id
        }
      }
    }).then((result) => {
      setDisable(false);
      toast.success('Successfully Updated!')
      sitesRes();
      toggle()
      reset()
    }).catch((error) => {
      setDisable(false);
      toast.error('Something Went Wrong!')
      toggle()
    })
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const handleMessageChange = (event, newValue) => {
    setMessageId(newValue?.id)
    setMessageName(newValue)
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
        <Typography variant='h6'>Update Sites</Typography>
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
              value={messageName}
              options={allMessage}
              onChange={handleMessageChange}
              id='autocomplete-controlled'
              renderOption={(props, option) => {
                if (option.title) {
                  return (
                    <li {...props} key={option.id}>
                      {option.title}
                    </li>
                  );
                }
              }}
              getOptionLabel={option => option.title || ""}
              renderInput={params => <TextField  {...params} label='Select Message' />}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='click'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='number'
                  value={value}
                  label='click '
                  onChange={onChange}
                  error={Boolean(errors.click)}
                />
              )}
            />
            {errors.click && <FormHelperText sx={{ color: 'error.main' }}>{errors.click.message}</FormHelperText>}
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
                  error={Boolean(errors.site)}
                />
              )}
            />
            {errors.site && <FormHelperText sx={{ color: 'error.main' }}>{errors.site.message}</FormHelperText>}
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

export default UpdateMessageLog
