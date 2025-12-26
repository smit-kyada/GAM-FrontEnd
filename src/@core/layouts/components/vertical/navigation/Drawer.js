// ** MUI Imports
import { styled, useTheme } from '@mui/material/styles'
import MuiSwipeableDrawer from '@mui/material/SwipeableDrawer'

const SwipeableDrawer = styled(MuiSwipeableDrawer)({
  overflowX: 'hidden',
  transition: 'width .5s cubic-bezier(0.4, 0, 0.2, 1)',
  '& ul': {
    listStyle: 'none'
  },
  '& .MuiListItem-gutters': {
    paddingLeft: 4,
    paddingRight: 4
  },
  '& .MuiDrawer-paper': {
    left: 'unset',
    right: 'unset',
    overflowX: 'hidden',
    transition: 'width .5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow .5s cubic-bezier(0.4, 0, 0.2, 1)'
  }
})

const Drawer = props => {
  // ** Props
  const {
    hidden,
    children,
    navHover,
    navWidth,
    settings,
    navVisible,
    setNavHover,
    navMenuProps,
    setNavVisible,
    collapsedNavWidth,
    navigationBorderWidth
  } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const { mode, skin, navCollapsed } = settings
  let flag = true

  const drawerColors = () => {
    if (mode === 'dark' || mode === 'semi-dark') {
      return {
        backgroundColor: '#111111'
      }
    } else
      return {
        backgroundColor: 'background.paper'
      }
  }

  // Drawer Props for Mobile & Tablet screens
  const MobileDrawerProps = {
    open: navVisible,
    onOpen: () => setNavVisible(true),
    onClose: () => setNavVisible(false),
    ModalProps: {
      keepMounted: true // Better open performance on mobile.
    }
  }

  // Drawer Props for Laptop & Desktop screens
  const DesktopDrawerProps = {
    open: true,
    onOpen: () => null,
    onClose: () => null,
    onMouseEnter: () => {
      // Always allow hover expansion when collapsed
      if (navCollapsed) {
        setNavHover(true)
        flag = false
      }
    },
    onMouseLeave: () => {
      if (navCollapsed) {
        setNavHover(false)
      }
    }
  }
  let userNavMenuStyle = {}
  let userNavMenuPaperStyle = {}
  if (navMenuProps && navMenuProps.sx) {
    userNavMenuStyle = navMenuProps.sx
  }
  if (navMenuProps && navMenuProps.PaperProps && navMenuProps.PaperProps.sx) {
    userNavMenuPaperStyle = navMenuProps.PaperProps.sx
  }
  const userNavMenuProps = Object.assign({}, navMenuProps)
  delete userNavMenuProps.sx
  delete userNavMenuProps.PaperProps

  return (
    <SwipeableDrawer
      className='layout-vertical-nav'
      variant={hidden ? 'temporary' : 'permanent'}
      {...(hidden ? { ...MobileDrawerProps } : { ...DesktopDrawerProps })}
      PaperProps={{
        sx: {
          ...drawerColors(),
          ...(!hidden && skin !== 'bordered' && { boxShadow: 6 }),
          width: navCollapsed && !navHover ? collapsedNavWidth : navWidth,
          borderRight: (mode === 'dark' || mode === 'semi-dark') 
            ? `1px solid ${theme.palette.divider}` 
            : (navigationBorderWidth === 0 ? 0 : `${navigationBorderWidth}px solid ${theme.palette.divider}`),
          top: 0,
          height: '100%',
          ...userNavMenuPaperStyle
        },
        ...navMenuProps?.PaperProps
      }}
      sx={{
        width: navCollapsed ? collapsedNavWidth : navWidth,
        ...userNavMenuStyle
      }}
      {...userNavMenuProps}
    >
      {children}
    </SwipeableDrawer>
  )
}

export default Drawer
