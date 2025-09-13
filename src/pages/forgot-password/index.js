// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useState } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Config
import authConfig from 'src/configs/auth'

// ** Demo Imports
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import Error404 from '../404'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

//**graphql */
import { FORGOT_PASSWORD } from 'src/graphql/mutation/user'
import { useMutation } from '@apollo/client'

// ** Third Party Components
import toast from 'react-hot-toast'

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  fontSize: '1rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
})

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const router = useRouter();

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const [email, setEmail] = useState("")

  // ** Graphql
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  // const defaultValues = {
  //   email: ''
  // }



  // const {
  //   control,
  //   setError,
  //   handleSubmit,
  //   formState: { errors }
  // } = useForm({
  //   defaultValues,
  //   mode: 'onBlur',
  //   resolver: yupResolver(schema)
  // })


  const onSubmit = (e) => {
    e.preventDefault();

    forgotPassword({
      variables: {
        email
      }
    }).then((result) => {
      toast.success('Successfully Send!')
      router.push('/login');
    }).catch((error) => {
      toast.error('Something Went Wrong!')
    })
  }


  if (window.localStorage.getItem(authConfig.storageTokenKeyName)) {
    return <Error404 />
  } else {
    return (
      <Box className='content-center'>
        <AuthIllustrationV1Wrapper>
          <Card>
            <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
              <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/images/Funcliq.png" width="70%" alt="logo" />
                <Typography sx={{ ml: 2.5, fontWeight: 600, fontSize: '1.625rem', lineHeight: 1.385 }}>
                  {/* {themeConfig.templateName} */}
                </Typography>
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography variant='h6' sx={{ mb: 1.5 }}>
                  Forgot Password? 🔒
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>
                  Enter your email and we&prime;ll send you instructions to reset your password
                </Typography>
              </Box>
              <form noValidate autoComplete='off' onSubmit={onSubmit}>
                <TextField autoFocus type='email' label='Email' sx={{ display: 'flex', mb: 4 }} onChange={(e) => setEmail(e.target.value)} />
                <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4 }}>
                  Send reset link
                </Button>
                <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                  <LinkStyled href='/pages/auth/login-v1'>
                    <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                    <span>Back to login</span>
                  </LinkStyled>
                </Typography>
              </form>
            </CardContent>
          </Card>
        </AuthIllustrationV1Wrapper>
      </Box>
    )
  }
}
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
