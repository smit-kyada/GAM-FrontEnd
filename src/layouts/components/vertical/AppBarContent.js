// ** MUI Imports
import { Badge, Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'


// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

const AppBarContent = props => {


  const router = useRouter()

  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props

  return (
    <>

      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          {hidden ? (
            <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
              <Icon fontSize='1.5rem' icon='tabler:menu-2' />
            </IconButton>
          ) : null}

          <ModeToggler settings={settings} saveSettings={saveSettings} />
        </Box>

        <Box className='actions-right'>

          {(router?.pathname == "/sitereport" || router?.pathname == "/livereport") && <div>
            <div className='animation-text'>
              <Typography color={"primary"} sx={{ fontWeight: "bold" }} className='realtimetext'>Real - Time Data</Typography>
            </div>
            <div className="circle-animation" /></div>
          }
        </Box>
        <Box className='actions-right'>
          <Button className='first-step'>
            start tour
          </Button>

        </Box>

        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
          <UserDropdown settings={settings} />
        </Box>
      </Box>

    </>
  )
}

export default AppBarContent
