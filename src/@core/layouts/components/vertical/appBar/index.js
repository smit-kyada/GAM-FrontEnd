// ** MUI Imports
import { styled } from '@mui/material/styles'
import MuiAppBar from '@mui/material/AppBar'
import MuiToolbar from '@mui/material/Toolbar'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  transition: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  minHeight: theme.mixins.toolbar.minHeight,
  width: '100%',
  left: 0,
  right: 0,
  zIndex: theme.zIndex.drawer + 1, // Ensure it's above the sidebar
  paddingLeft: 0,
  paddingRight: 0
}))

const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  width: '100%',
  marginTop: '0px',
  borderRadius: theme.shape.borderRadius,
  padding: `${theme.spacing(0)} !important`,
  paddingLeft: '14px !important',
  paddingRight: '16px !important',
  maxWidth: '100%'
}))

const LayoutAppBar = props => {
  // ** Props
  const { settings, appBarProps, appBarContent: userAppBarContent } = props

  // ** Vars
  const { skin, appBar, appBarBlur, contentWidth, mode } = settings

  const appBarBlurEffect = appBarBlur && {
    '&:after': {
      top: 0,
      left: 0,
      zIndex: -1,
      width: '100%',
      content: '""',
      position: 'absolute',
      backdropFilter: 'blur(10px)',
      height: theme => `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(4)})`,
      mask: theme =>
        `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default} 18%, transparent 100%)`,
      background: theme =>
        `linear-gradient(180deg,${hexToRGBA(theme.palette.background.default, 0.7)} 44%, ${hexToRGBA(
          theme.palette.background.default,
          0.43
        )} 73%, ${hexToRGBA(theme.palette.background.default, 0)})`
    }
  }
  if (appBar === 'hidden') {
    return null
  }
  let userAppBarStyle = {}
  if (appBarProps && appBarProps.sx) {
    userAppBarStyle = appBarProps.sx
  }
  const userAppBarProps = Object.assign({}, appBarProps)
  delete userAppBarProps.sx

  return (
    <AppBar
      elevation={0}
      color='default'
      className='layout-navbar'
      sx={{ ...appBarBlurEffect, ...userAppBarStyle }}
      position={appBar === 'fixed' ? 'sticky' : 'static'}
      {...userAppBarProps}
    >
      <Toolbar
        className='navbar-content-container'
        sx={theme => ({
          // Glass effect (glassmorphism)
          ...(appBarBlur && { 
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)'
          }),
          minHeight: `${theme.mixins.toolbar.minHeight}px !important`,
          // Enhanced transparency for glass effect
          backgroundColor: appBarBlur 
            ? (mode === 'dark' || mode === 'semi-dark' 
                ? hexToRGBA(theme.palette.background.paper, 0.7)
                : hexToRGBA(theme.palette.background.paper, 0.8))
            : theme.palette.background.paper,
          // Border: always show in dark mode, or if skin is bordered
          ...((mode === 'dark' || mode === 'semi-dark' || skin === 'bordered') && {
            border: `1px solid ${theme.palette.divider}`
          }),
          // Shadow only if not bordered and not dark mode
          ...(skin !== 'bordered' && mode !== 'dark' && mode !== 'semi-dark' && { 
            boxShadow: 4 
          })
        })}
      >
        {(userAppBarContent && userAppBarContent(props)) || null}
      </Toolbar>
    </AppBar>
  )
}

export default LayoutAppBar
