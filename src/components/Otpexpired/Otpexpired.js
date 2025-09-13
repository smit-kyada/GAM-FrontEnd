// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import Link from 'next/link'
import toast from 'react-hot-toast'

const Otpexpired = ({ otpError, messageData }) => {


  const ResendRegisterOTP = async () => {

    toast.success("OTP sent sucessfully !")
  }

  return (
    <Card>
      <CardContent
        sx={{
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          p: theme => `${theme.spacing(9.75, 5, 9.25)} !important`
        }}
      >
        <CustomAvatar skin='light' sx={{ width: 50, height: 50, mb: 2.25 }}>
          {/* <Icon icon='tabler:help' fontSize='2rem' /> */}
          <Icon icon={"mynaui:danger-hexagon-solid"} fontSize='2rem' />
        </CustomAvatar>
        <Typography variant='h6' sx={{ mb: 2.75 }}>
          {otpError}
        </Typography>
        <Typography variant='body2' sx={{ mb: 6 }}>
          Your OTP is expire please resend OTP and try again.
        </Typography>
        <Button variant='contained' sx={{ p: theme => theme.spacing(1.75, 5.5) }} onClick={ResendRegisterOTP}>
          Resend Otp
        </Button>
      </CardContent>
    </Card>
  )
}

export default Otpexpired
