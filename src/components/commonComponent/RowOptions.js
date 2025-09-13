import React from 'react'
import { useState, useEffect } from 'react'

// ** MUI Imports
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'

import UpdateSiteTableDrawer from 'src/views/siteTable/list/UpdateSiteTable'
import UpdateSite from 'src/views/site/list/UpdateSite'

import UserSuspendDialog from 'src/components/commonComponent/UserSuspendDialog'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import UpdateAffRequest from 'src/views/affRequest/UpdateAffRequest'
import UpdateMessage from 'src/views/message/list/UpdateMessage'
import UpdateMessageLog from 'src/views/messageLog/list/UpdateMessageLog'
import UpdateNotificationMessage from '../notificationMessage/updateNotificationMessage'
import UpdateSubAdmin from 'src/views/subadmin/UpdateSubAdmin'
import UpdateUserAccount from '../user/UpdateUserAccount'
import CreatePassword from 'src/views/site/list/CreatePassword'
import UpdateAdsenseToken from 'src/views/adsense/UpdateAdsenseToken'

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
  const toggleCreatePasswordDrawer = () => setPasswordOpen(!passwordOpen)

  const handleDelete = () => {
    setSuspendDialogOpen(true)
    setAnchorEl(null)
  }

  const [passwordOpen, setPasswordOpen] = useState(false);

  const handlePassword = () => {
    setPasswordOpen(true);
    setAnchorEl(null)
  }

  const Drawer = () => {
    if (updateUserOpen) {
      if (For === "SiteTable") {
        return <UpdateSiteTableDrawer userData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} siteTableRes={refetch} />
      } else if (For === "Site") {
        return <UpdateSite userData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} siteRes={refetch} />
      } else if (For == "AffiliateRequest") {
        return <UpdateAffRequest userData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} affRequestRes={refetch} />
      } else if (For === "Message") {
        return <UpdateMessage userData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} messageRes={refetch} />
      } else if (For === "messageLog") {
        return <UpdateMessageLog userData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} sitesRes={refetch} />
      } else if (For === "NotificationMessage") {
        return <UpdateNotificationMessage userData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} notificationMessageRes={refetch} />
      } else if (For === "SubAdmin") {
        return <UpdateSubAdmin subAdminData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} subadminRes={refetch} />
      }
      else if (For === "UserAccount") {
        return <UpdateUserAccount userData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} userAccRes={refetch} />
      }
      else if (For === "AdsenseToken") {
        return <UpdateAdsenseToken userData={userData} open={updateUserOpen} toggle={toggleUpdateUserDrawer} AdstokenRes={refetch} />
      }

    }
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
        {For == "Site" && <div>
          <MenuItem onClick={handlePassword} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='solar:lock-password-unlocked-broken' fontSize={20} />
            Credential
          </MenuItem>
          {passwordOpen && <CreatePassword open={passwordOpen} toggle={toggleCreatePasswordDrawer} userData={userData} userRes={refetch} />}
        </div>
        }
        <MenuItem onClick={handleUpdate} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        {Drawer()}
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
      <UserSuspendDialog id={userData?.id} open={suspendDialogOpen} setOpen={setSuspendDialogOpen} Refetch={refetch} DeleteFor={For} />
    </>
  )
}

export default RowOptions
