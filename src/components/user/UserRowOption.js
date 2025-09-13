
import React from 'react'
import { useState, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports

import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'

import UpdateUser from 'src/views/employee/list/UpdateUser'
import ChangePassword from 'src/views/employee/list/UserPassword'


import UserSuspendDialog from 'src/components/commonComponent/UserSuspendDialog'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import ViewAlotSite from './ViewSitesModal'

const UserRowOptions = ({ userData, refetch, For }) => {

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [updateUserOpen, setUpdateUserOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

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

  const handlePassword = () => {
    setAnchorEl(null)
    setPasswordOpen(!passwordOpen)
  }

  const handleAlotSite = () => {
    setAnchorEl(null)
    setViewOpen(!passwordOpen)
  }

  const toggleUpdateUserDrawer = () => setUpdateUserOpen(!updateUserOpen)

  const togglePasswordDrawer = () => setPasswordOpen(!passwordOpen)



  const handleDelete = () => {
    setSuspendDialogOpen(true)
    setAnchorEl(null)
  }


  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem onClick={handleAlotSite} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='material-symbols:task-outline' fontSize={20} />
          Alotted Site
        </MenuItem>

        <MenuItem component={Link} href={`/user/userAccount/${userData?.id}`} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:bank' fontSize={20} />
           Accounts
        </MenuItem>

        {viewOpen && <ViewAlotSite open={viewOpen} setOpen={setViewOpen} userData={userData} />}

        <MenuItem onClick={handlePassword} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='solar:lock-password-unlocked-broken' fontSize={20} />
          Password
        </MenuItem>
        {passwordOpen && <ChangePassword open={passwordOpen} toggle={togglePasswordDrawer} userRes={refetch} userData={userData} />}

        <MenuItem onClick={handleUpdate} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        {updateUserOpen && <UpdateUser userData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} userRes={refetch} />}
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
      <UserSuspendDialog id={userData?.id} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} Refetch={refetch} DeleteFor={For} />
    </>
  )
}

export default UserRowOptions
