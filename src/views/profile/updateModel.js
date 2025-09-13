import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'

// ** hooks
import { useSocket } from 'src/hooks/userSocket'

import { useQuery } from '@apollo/client'
import { MenuItem } from '@mui/material'
import UserSuspendDialog from 'src/components/commonComponent/UserSuspendDialog'
import { GET_SITE } from 'src/graphql/query/site'
import UpdateBankDetail from './updateBankDetail'

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

const UpdateModel = ({ userData, refetch, For }) => {

  // ** hooks
  const { Socket } = useSocket();

  const [allSite, setAllSite] = useState([])

  const [open, setOpen] = useState(false);

  const [openDelete, setOpenDelete] = useState()


  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleDeleteOPen = () => setOpenDelete(true)

  const handleDeleteClose = () => setOpenDelete(false)

  const { loading: siteLoading, error: siteError, data: siteData, refetch: siteRefetch } = useQuery(GET_SITE, {
    variables: { getSiteId: userData?.id },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    siteData?.getSite && setAllSite(siteData?.getSite)
  }, [siteData])



  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {/* <Button
                variant='outlined' color='error' sx={{ ml: 3 }} endIcon={<Icon icon='tabler:send' />}
                component="label" onClick={handleClickOpen}>
            </Button> */}

      <MenuItem onClick={handleClickOpen} sx={{ '& svg': { mr: 2 } }}>
        <Icon icon='tabler:edit' fontSize={20} />
        Edit
      </MenuItem>

      <MenuItem onClick={handleDeleteOPen} sx={{ '& svg': { mr: 2 } }}>
        <Icon icon='tabler:trash' fontSize={20} />
        Delete
      </MenuItem>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        fullWidth
        maxWidth="sm"
        className='card'
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' align="center">
            Update Bank Details
          </Typography>
          <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important` }}>

          {open && <UpdateBankDetail userData={userData} bankDetailRefetch={refetch} handleClose={handleClose} />}

        </DialogContent>
        {/* <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions> */}
      </Dialog>

      <UserSuspendDialog id={userData?.id} open={openDelete} setOpen={setOpenDelete} Refetch={refetch} DeleteFor={"BankDetail"} />

    </Box>
  )
}

export default UpdateModel
