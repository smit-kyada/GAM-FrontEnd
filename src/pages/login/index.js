import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import Icon from 'src/@core/components/icon'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import { useAuth } from 'src/hooks/useAuth'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import LoginOtp from 'src/components/LoginOtp/LoginOtp'
import { useMutation } from '@apollo/client'
import { RESEND_VERIFICATION_EMAIL } from 'src/graphql/mutation/user'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const defaultValues = {
  password: '',
  email: ''
}

const schema = yup.object().shape({
  email: yup.string().required(),
  password: yup.string().required()
})

const LoginPage = () => {
  // ** State
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [checked, setChecked] = useState(false);

  const [value, setValue] = useState('password')

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Hook

  const auth = useAuth();

  const onSubmit = data => {

    const { email, password, site } = data

    auth.login({ email: email, password, isSideLogin: checked, rememberMe }, () => {
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }

  const [stringStr, setStringStr] = useState("")

  const handleEmailOrSite = (i, e) => { setStringStr(i?.target?.value) }
  const handleChange = (event, newValue) => { setValue(newValue) }


  const [sendVerficationEmail] = useMutation(RESEND_VERIFICATION_EMAIL)

  useEffect(() => {
    setChecked(!stringStr?.includes("@"))
  }, [stringStr])

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* <svg width={34} height={23.375} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                />
                <path
                  fill='#161616'
                  opacity={0.06}
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                />
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  fill={theme.palette.primary.main}
                  d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                />
              </svg> */}
              <img src="/images/Funcliq.png" width="70%" alt="logo" />
              <Typography sx={{ ml: 2.5, fontWeight: 600, fontSize: '1.625rem', lineHeight: 1.385 }}>
                {/* {themeConfig.templateName} */}
              </Typography>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography variant='h6' sx={{ mb: 1.5 }}>
                {`Welcome to ${themeConfig.templateName}! 👋🏻`}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>

            <TabContext value={value}>
              <TabList centered onChange={handleChange} aria-label='centered tabs example'>

                <Tab value='password' label='password' />

                <Tab value='OTP' label='OTP' />

              </TabList>

              <TabPanel value='password'>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label='Email or Site'
                          value={value}
                          onBlur={onBlur}
                          onChange={(i, e) => { onChange(i, e), handleEmailOrSite(i, e) }}
                          error={Boolean(errors.email)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message && "email or site is a required field"}</FormHelperText>}
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 1.5 }}>
                    <InputLabel htmlFor='auth-login-password' error={Boolean(errors.password)}>
                      Password
                    </InputLabel>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <OutlinedInput
                          value={value}
                          onBlur={onBlur}
                          label='Password'
                          onChange={onChange}
                          id='auth-login-v2-password'
                          error={Boolean(errors.password)}
                          type={showPassword ? 'text' : 'password'}
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      )}
                    />
                    {errors.password && (
                      <FormHelperText sx={{ color: 'error.main' }} id=''>
                        {errors.password.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <Box
                    sx={{
                      mb: 1.75,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <FormControlLabel
                      label='Remember Me'
                      control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                    />
                    <LinkStyled href='/forgot-password'>Forgot Password?</LinkStyled>
                  </Box>
                  <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4 }}>
                    Login
                  </Button>

                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>

                    <Typography sx={{ color: 'text.secondary', mr: 2 }}>New on our platform?</Typography>
                    <Typography>
                      <LinkStyled href='register' sx={{ fontSize: '1rem' }}>
                        Create an account
                      </LinkStyled>
                    </Typography>
                  </Box>
                </form>
              </TabPanel>

              <TabPanel value='OTP'>
                {/* <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='contact'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          autoFocus
                          label='Mobile No.'
                          value={value}
                          onBlur={onBlur}
                          onChange={(i, e) => { onChange(i, e), handleEmailOrSite(i, e) }}
                          error={Boolean(errors.email)}
                          placeholder=''
                        />
                      )}
                    />
                    {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message && "email or site is a required field"}</FormHelperText>}
                  </FormControl>
                  <Box
                    sx={{
                      mb: 1.75,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <FormControlLabel
                      label='Remember Me'
                      control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                    />
                    <LinkStyled href='/forgot-password'>Forgot Password?</LinkStyled>
                  </Box>
                  <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 4 }}>
                    Login
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'text.secondary', mr: 2 }}>New on our platform?</Typography>
                    <Typography>
                      <LinkStyled href='register' sx={{ fontSize: '1rem' }}>
                        Create an account
                      </LinkStyled>
                    </Typography>
                  </Box>
                </form> */}

                <LoginOtp />

              </TabPanel>




            </TabContext>





          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
