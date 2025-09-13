import React from 'react'
import { useState, useEffect } from 'react'

// ** MUI Imports
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'


import UserSuspendDialog from 'src/components/commonComponent/UserSuspendDialog'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import UpdateBankDetail from './updateBankDetail'

const RowOptions = ({ userData, refetch, For }) => {

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [updateUserOpen, setUpdateUserOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleUpdate = () => {
    setUpdateUserOpen(!updateUserOpen)
    setAnchorEl(null)
  }

  const toggleUpdateUserDrawer = () => setUpdateUserOpen(!updateUserOpen)

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    setAnchorEl(null)
  }

  const Drawer = () => {

  }

  return (
    <>
      {/* <IconButton size='small' onClick={handleRowOptionsClick}>
      <Icon icon='tabler:edit' fontSize={20}  />
          Edit
      </IconButton> */}

      <MenuItem onClick={handleRowOptionsClick} sx={{ '& svg': { mr: 2 } }}>
        <Icon icon='tabler:edit' fontSize={20} />
        Edit
      </MenuItem>

      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        {/* <MenuItem onClick={handleUpdate} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem> */}
        {userData && <UpdateBankDetail userData={userData} bankDetailRefetch={refetch} />}
        {/* <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem> */}
      </Menu>
      <UserSuspendDialog id={userData?.id} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} Refetch={refetch} DeleteFor={For} />
    </>
  )
}

export default RowOptions 
