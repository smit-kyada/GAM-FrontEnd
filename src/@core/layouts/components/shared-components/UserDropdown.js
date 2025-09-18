// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Context
import { useAuth } from 'src/hooks/useAuth'
import { useMutation } from '@apollo/client'
import { DOWNLOAD_AGREEMENT } from 'src/graphql/mutation/user'
import { DownloadImage } from 'src/components/commonComponent/DownloadImage'
import toast from 'react-hot-toast'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

// ** renders client column
const renderClient = row => {

  if (row?.profileImg) {
    return <CustomAvatar src={`${process.env.NEXT_PUBLIC_BASE_URL}/${row?.profileImg}`} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else if (row.userName) {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
      >
        {getInitials(row.userName ? row.userName : 'Funcliq')}
      </CustomAvatar>
    )
  } else {
    return <CustomAvatar src={`/images/apple-touch-icon.png`} sx={{ mr: 2.5, width: 38, height: 38 }} />
  }
}

const UserDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const router = useRouter()
  const { logout, user } = useAuth()

  // ** Vars
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  const [DownloadAgreement] = useMutation(DOWNLOAD_AGREEMENT)


  const handleDownloadAgreement = async () => {

    handleDropdownClose()

    await DownloadAgreement({
      variables: {
        input: ""
      }
    })
      .then(async (res) => {
        await DownloadImage(`Agreements/${res?.data?.DownloadAgreement}`)
          .then((result) => {
            toast.success("Agreement Download Sucessfully")
          })
          .catch((error) => {
            toast.error(error?.message)
          })
      })
      .catch((err) => {
        console.log("🚀 ~ file: UserDropdown.js:124 ~ handleDownloadAgreement ~ err:", err)
      })
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        {renderClient(user)}
        {/* <Avatar
          alt='John Doe'
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src='/images/avatars/1.jpg'
        /> */}
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.5 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              {/* <Avatar alt='John Doe' src='/images/avatars/2.jpg' sx={{ width: '2.5rem', height: '2.5rem' }} /> */}
              {renderClient(user)}
            </Badge>
            <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500, overflowWrap: "anywhere" }}>{user?.userName || user?.site}</Typography>
              <Typography variant='body2'>{user.role}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled onClick={handleDownloadAgreement} sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem' } }}>
          <Icon icon='ic:round-download' />
          Agreement
        </MenuItemStyled>
        <MenuItemStyled onClick={handleLogout} sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem' } }}>
          <Icon icon='tabler:logout' />
          Logout
        </MenuItemStyled>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
