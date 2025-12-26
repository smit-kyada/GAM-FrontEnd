// ** MUI Imports
import { Badge, Button, Typography, Divider } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import VerticalNavItems from 'src/navigation/vertical'

// ** Helper function to get page title from route
const getPageTitle = (pathname, navItems) => {
  // Flatten navigation items to find matching route
  const flattenNavItems = (items) => {
    let flatItems = []
    items.forEach(item => {
      if (item.path) {
        flatItems.push(item)
      }
      if (item.children) {
        flatItems = flatItems.concat(flattenNavItems(item.children))
      }
    })
    return flatItems
  }

  const flatNav = flattenNavItems(navItems)
  const matchedItem = flatNav.find(item => item.path === pathname)
  
  if (matchedItem) {
    return matchedItem.title
  }
  
  // Fallback: capitalize and format pathname
  if (pathname === '/') return 'Home'
  const pathParts = pathname.split('/').filter(Boolean)
  return pathParts.map(part => part.charAt(0).toUpperCase() + part.slice(1).replace(/([A-Z])/g, ' $1')).join(' ')
}

const AppBarContent = props => {
  const router = useRouter()
  const theme = useTheme()

  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  // Get navigation items
  const navItems = VerticalNavItems()
  const pageTitle = getPageTitle(router?.pathname, navItems)

  // Toggle sidebar width (collapse/expand)
  const handleToggleSidebar = () => {
    if (saveSettings && settings) {
      saveSettings({ ...settings, navCollapsed: !settings.navCollapsed })
    }
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Left Section: Hamburger Menu, Logo, and Page Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {/* Hamburger Menu Icon */}
        <IconButton 
          color='inherit' 
          onClick={handleToggleSidebar}
          sx={{ 
            mr: 2,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <Icon fontSize='1.5rem' icon='tabler:menu-2' />
        </IconButton>

        {/* Logo */}
        <Link href='/' passHref>
          <Box
            component='a'
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              mr: 2
            }}
          >
            <img
              src="/images/vasuki-logo.svg"
              alt="logo"
              style={{
                height: 32,
                width: 'auto',
                filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                transition: 'filter 0.3s ease-in-out'
              }}
            />
          </Box>
        </Link>

        {/* Divider */}
        <Divider 
          orientation="vertical" 
          flexItem 
          sx={{ 
            mx: 2,
            borderColor: theme.palette.divider
          }} 
        />
        {/* Page Title */}
        <Typography
          variant='h6'
          sx={{
            fontWeight: 500,
            fontSize: '1.125rem',
            color: theme.palette.text.primary,
            ml: 1
          }}
        >
          {pageTitle}
        </Typography>
      </Box>

      {/* Right Section: Help, Notifications, User Dropdown */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Real-Time Data Indicator (if applicable) */}
        {(router?.pathname === "/sitereport" || router?.pathname === "/livereport") && (
          <Box sx={{ mr: 2 }}>
            <div className='animation-text'>
              <Typography color={"primary"} sx={{ fontWeight: "bold" }} className='realtimetext'>
                Real - Time Data
              </Typography>
            </div>
            <div className="circle-animation" />
          </Box>
        )}

        {/* Help Icon */}
        <IconButton
          color='inherit'
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
          onClick={() => {
            // Add help functionality here
            console.log('Help clicked')
          }}
        >
          <Icon fontSize='1.5rem' icon='tabler:help' />
        </IconButton>

        {/* Notifications Icon */}
        <IconButton
          color='inherit'
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
          onClick={() => {
            // Add notifications functionality here
            console.log('Notifications clicked')
          }}
        >
          <Badge badgeContent={0} color='error'>
            <Icon fontSize='1.5rem' icon='tabler:bell' />
          </Badge>
        </IconButton>

        {/* Dark/Light Mode Toggle */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />

        {/* User Dropdown */}
        <Box sx={{ ml: 1 }}>
          <UserDropdown settings={settings} />
        </Box>
      </Box>
    </Box>
  )
}

export default AppBarContent

