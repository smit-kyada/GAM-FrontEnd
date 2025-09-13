import { useMutation } from '@apollo/client'
import { Icon } from '@iconify/react'
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import { RESEND_VERIFICATION_EMAIL } from 'src/graphql/mutation/user'
import { useAuth } from 'src/hooks/useAuth'

const EmailVerifiedModel = ({ }) => {

  const auth = useAuth()

  // ** Graphql
  const [raisedUnblockQuery] = useMutation(RESEND_VERIFICATION_EMAIL);

  const onSubmit = () => {


    raisedUnblockQuery({
      variables: { "email": auth?.user?.email }
    })
      .then((result) => {

        toast.success('Email semt Successfully !')

      }).catch((error) => {

        toast.error(error?.message)

      })

  }

  return (
    <>
      <Dialog
        fullScreen
        open={!auth?.user?.isEmailVerified}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible'} }}>
        <DialogContent>

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
                Your Email is Not Verify
              </Typography>
              <Typography sx={{ marginBottom: "15px" }}>
                Hi <strong>{auth?.user?.userName ? auth?.user?.userName : auth?.user?.fName + " " + auth?.user?.lName}</strong>, Your Email is not Verify  <br />

                <Button fullWidth sx={{ mt: 5 }} onClick={onSubmit}>
                  Send Verification Email
                </Button>
              </Typography>
            </Box>
          </Box>

        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
        </DialogActions>
      </Dialog>


      {/* <Loader disable={messageLoading} /> */}
    </>

  )
}

export default EmailVerifiedModel




