import { useEffect, useState } from 'react'
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
import { useMutation, useQuery } from '@apollo/client'
import { RAISE_UNBLOCK_QUERY } from 'src/graphql/mutation/user'
import { Dialog, DialogActions, DialogContent } from '@mui/material'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { GET_BLOCKUSER_QUERY } from 'src/graphql/query/user'
import { Icon } from '@iconify/react'
import Loader from '../loader/loader'

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  message: yup
    .string()
    .required(),
})

const BlockUserModel = ({ }) => {

  const auth = useAuth()

  const [raised, setRaised] = useState(false)

  // Graphql query
  const { loading: messageLoading, error: messageError, data: messageData, refetch: messageRefetch } = useQuery(GET_BLOCKUSER_QUERY, {
    variables: { getQueriesByUserIdId: auth?.user?.id },
    fetchPolicy: "cache-and-network",
  });


  useEffect(() => {
    messageData?.getQueriesByUserId && setRaised(messageData?.getQueriesByUserId?.isRaised)
  }, [messageData])

  const defaultValues = {
    message: '',
  }

  // ** Graphql
  const [raisedUnblockQuery] = useMutation(RAISE_UNBLOCK_QUERY);

  const {
    reset,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  const onSubmit = data => {

    data.userId = auth?.user?.id
    data.isRaised = true


    raisedUnblockQuery({
      variables: {
        "input": data
      }
    }).then((result) => {

      messageRefetch()
      reset()
      toast.success('Account Successfully Added!')


    }).catch((error) => {
      messageRefetch()
      toast.error('Something Went Wrong!')
    })

  }

  const handleClose = () => {
    reset()
  }

  return (
    <>
      <Dialog
        open={auth?.user?.block || !auth?.user?.isActive}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}

      // fullWidth
      // maxWidth="sm"
      >
        <DialogContent>

          <Header>

          </Header>

          <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                '& svg': {
                  mb: 4,
                }
              }}
            >
              <Icon fontSize='5.5rem' icon={'material-symbols:block'} color="error" />
              <Typography variant='h4' sx={{ mb: 4 }}>
                Your Account is {auth?.user?.block ? `block` : "In Active"}
              </Typography>

              <Typography sx={{ marginBottom: "15px" }}>
                Hi <strong>{auth?.user?.userName ? auth?.user?.userName : auth?.user?.fName + " " + auth?.user?.lName}</strong>, Your Account has been  {auth?.user?.block ? `block` : "In Active"} <br />
              </Typography>

            </Box>


            {raised == false && <Typography sx={{ mb: 5 }}>
              If Your Want to {auth?.user?.block ? `Unblock` : " Active"} Your Account, Give reason why we  {auth?.user?.block ? `Unblock` : " Active"}  Your Account

            </Typography>}

            {raised == false && <form onSubmit={handleSubmit(onSubmit)}>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='message'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      multiline
                      rows={4}
                      label='Message'
                      onChange={onChange}
                      placeholder='Message'
                      error={Boolean(errors.message)}
                    />
                  )}
                />
                {errors.message && <FormHelperText sx={{ color: 'error.main' }}>{errors.message.message}</FormHelperText>}
              </FormControl>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button type='submit' variant='contained' sx={{ mr: 3 }}>
                  submit
                </Button>
                <Button variant='outlined' color='secondary' onClick={handleClose}>
                  Cancel
                </Button>
              </Box>
            </form>}

          </Box>

        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
        </DialogActions>
      </Dialog>


      <Loader disable={messageLoading} />
    </>

  )
}

export default BlockUserModel




