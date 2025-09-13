/*usersuspend dialogue*/

import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** graphQl
import { useMutation } from '@apollo/client'
import { DELETE_USER, DELETE_USER_ACCOUNT } from 'src/graphql/mutation/user'
import { DELETE_SITETABLE } from 'src/graphql/mutation/siteTable'
import { DELETE_SITE } from 'src/graphql/mutation/site'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import toast from 'react-hot-toast'
import { DELETE_AFFREQUEST } from 'src/graphql/mutation/affRequest'
import { DELETE_MESSAGE } from 'src/graphql/mutation/message'
import { DELETE_GAMEUSER } from 'src/graphql/mutation/gameUser'
import { DELETE_MESSAGELOG } from 'src/graphql/mutation/messageLog'
import { DELETE_BANKDETAIL } from 'src/graphql/mutation/bankDetail'
import { DELETE_NOTIFICATIONMESSAGE } from 'src/graphql/mutation/notificationMessage'
import { DELETE_ADSENSE_TOKEN } from 'src/graphql/mutation/adsense'

const UserSuspendDialog = props => {

  // ** Props
  const { open, setOpen, id, Refetch, DeleteFor } = props

  // ** States
  const [userInput, setUserInput] = useState('yes')
  const [secondDialogOpen, setSecondDialogOpen] = useState(false)
  const handleClose = () => setOpen(false)

  const handleSecondDialogClose = () => {
    Refetch();
    setSecondDialogOpen(false)
  }

  var Mutation;
  let inputVariable = {}

  switch (DeleteFor) {
    case "User":
      Mutation = DELETE_USER
      inputVariable.deleteUserId = id
      break;
    case "SiteTable":
      Mutation = DELETE_SITETABLE
      inputVariable.deleteSiteTableId = id
      break;
    case "Site":
      Mutation = DELETE_SITE
      inputVariable.deleteSiteId = id
      break;
    case "AffiliateRequest":
      Mutation = DELETE_AFFREQUEST
      inputVariable.deleteAffRequestId = id
      break;

    case "Message":
      Mutation = DELETE_MESSAGE
      inputVariable.deleteMessageId = id
      break;

    case "GameUser":
      Mutation = DELETE_GAMEUSER
      inputVariable.deleteGameUserId = id
      break;

    case "messageLog":
      Mutation = DELETE_MESSAGELOG
      inputVariable.deleteMessageLogId = id
      break;

    case "BankDetail":
      Mutation = DELETE_BANKDETAIL
      inputVariable.deleteBankDetailId = id
      break;

    case "NotificationMessage":
      Mutation = DELETE_NOTIFICATIONMESSAGE
      inputVariable.deleteNotificationMessageId = id
      break;

    case "SubAdmin":
      Mutation = DELETE_USER
      inputVariable.deleteUserId = id
      break;
    case "UserAccount":
      Mutation = DELETE_USER_ACCOUNT
      inputVariable.deleteAccountId = id
      break;
    case "AdsenseToken":
      Mutation = DELETE_ADSENSE_TOKEN
      inputVariable.deleteAdsenseId = id
      break;
  }

  // Graphql mutation
  const [deleteById] = useMutation(Mutation);

  const handleConfirmation = value => {
    if (value === "yes") {
      deleteById({
        variables: inputVariable
      }).then((result) => {
        toast.success('Successfully Deleted!')
      }).catch((error) => {
        toast.error('Something Went Wrong!')
      })
    }
    handleClose()
    setUserInput(value)
    setSecondDialogOpen(true)
  }

  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent
          sx={{
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Box
            sx={{
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              '& svg': { mb: 8, color: 'warning.main' }
            }}
          >
            <Icon icon='tabler:alert-circle' fontSize='5.5rem' />
            <Typography variant='h4' sx={{ mb: 5, color: 'text.secondary' }}>
              Are you sure?
            </Typography>
            <Typography>You won't be able to revert {DeleteFor}!</Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 2 }} onClick={() => handleConfirmation('yes')}>
            Yes
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => handleConfirmation('cancel')}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={secondDialogOpen}
        onClose={handleSecondDialogClose}
        sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              '& svg': {
                mb: 14,
                color: userInput === 'yes' ? 'success.main' : 'error.main'
              }
            }}
          >
            <Icon fontSize='5.5rem' icon={userInput === 'yes' ? 'tabler:circle-check' : 'tabler:circle-x'} />
            <Typography variant='h4' sx={{ mb: 8 }}>
              {userInput === 'yes' ? 'Deleted!' : 'Cancelled'}
            </Typography>
            <Typography>{userInput === 'yes' ? `${DeleteFor} has been Deleted.` : ''}</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button variant='contained' color='success' onClick={handleSecondDialogClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserSuspendDialog
