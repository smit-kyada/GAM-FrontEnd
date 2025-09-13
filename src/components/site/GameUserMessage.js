import React, { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** hooks
import { useSocket } from 'src/hooks/userSocket'

import { GET_ALL_MESSAGES } from 'src/graphql/query/message'
import { useQuery } from '@apollo/client'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[6],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translate(7px, -5px)'
  }
}))

const SiteMessage = ({ row }) => {

  // ** hooks
  const { Socket } = useSocket();

  const [allMessage, setAllMessage] = useState([])
  const [messageId, setMessageId] = useState("")
  const [messageName, setMessageName] = useState("")
  const [open, setOpen] = useState(false);


  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { loading: messageLoading, error: msgError, data: messageData, refetch: messageRefetch } = useQuery(GET_ALL_MESSAGES, {
    variables: { page: 1, limit: 10 },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    messageData?.getAllMessages?.data && setAllMessage(messageData?.getAllMessages?.data)
  }, [messageData])

  const handleMessageChange = (event, newValue) => {
    setMessageId(newValue?.id)
    setMessageName(newValue)
  }

  const sendMessage = () => {
    Socket.emit("siteMessage", {
      userId: row?.userId,
      title: messageName?.title,
      description: messageName?.description,
      url: messageName?.url,
      image: messageName?.image,
      icon: messageName?.icon,
      mId: messageName?.id,
    })
    handleClose()
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Button
        variant='outlined' color='error' sx={{ ml: 3 }} endIcon={<Icon icon='tabler:send' />}
        component="label" onClick={handleClickOpen}>
        Send
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' align="center">
            Send Message
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important` }}>
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
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button variant='text' color='warning' onClick={sendMessage}>Send</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SiteMessage
