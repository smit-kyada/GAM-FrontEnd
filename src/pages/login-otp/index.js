// ** React Imports
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import FormHelperText from '@mui/material/FormHelperText'
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import AuthIllustrationV1Wrapper from 'src/views/pages/auth/AuthIllustrationV1Wrapper'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import 'cleave.js/dist/addons/cleave-phone.us'
import { RESEND_OTP, VARIFY_LOGIN_OTP, VARIFY_REGISTER_OTP } from 'src/graphql/mutation/user'
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { GET_REGISTER_OTP } from 'src/graphql/query/user'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import Otpexpired from 'src/components/Otpexpired/Otpexpired'
import toast from 'react-hot-toast'
import Loader from 'src/components/loader/loader'

// ** Config
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '1rem',
  textDecoration: 'none',
  marginLeft: theme.spacing(2),
  color: theme.palette.primary.main
}))

const CleaveInput = styled(Cleave)(({ theme }) => ({
  maxWidth: 48,
  textAlign: 'center',
  height: '48px !important',
  fontSize: '150% !important',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '&:not(:last-child)': {
    marginRight: theme.spacing(2)
  },
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    margin: 0,
    WebkitAppearance: 'none'
  }
}))

const VerifyOtp = () => {

  const router = useRouter()


  const { setUser } = useAuth()

  // state
  const [otpError, setOtpError] = useState(null)
  const [isBackspace, setIsBackspace] = useState(false)

  // Graphql query
  const { loading: messageLoading, error: messageError, data: messageData, refetch: messageRefetch } = useQuery(GET_REGISTER_OTP, {
    variables: { token: router?.query?.token },
    fetchPolicy: "cache-and-network",
  });


  useEffect(() => {
    messageError && setOtpError(messageError?.message)
  }, [messageError])

  const defaultValues = {
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
    otp5: '',
    otp6: ''
  }

  const schema = yup.object().shape({
    otp1: yup.string().required("Please valid enter OTP"),
    otp2: yup.string().required("Please valid enter OTP"),
    otp3: yup.string().required("Please valid enter OTP"),
    otp4: yup.string().required("Please valid enter OTP"),
    otp5: yup.string().required("Please valid enter OTP"),
    otp6: yup.string().required("Please valid enter OTP"),
  });


  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })


  // OTP verification
  const [varifyOtp] = useMutation(VARIFY_LOGIN_OTP)
  const [reSendOtp] = useMutation(RESEND_OTP)

  const onSubmit = (data) => {

    const otp = Object.values(data)?.join("")

    varifyOtp({
      variables: {
        input: {
          phoneOtp: otp,
          userId: messageData?.getJWTUserId?.id
        }
      }
    }).then((result) => {

      window.localStorage.setItem(authConfig.storageTokenKeyName, result?.data?.verifyLoginOtp?.token)
      setUser({ ...result?.data?.verifyLoginOtp?.user })
      let userData = result?.data?.verifyLoginOtp?.user;
      window.localStorage.setItem('userData', JSON.stringify(userData))

      toast.success("login Successfully")

      const redirectURL = '/'

      // router.push(redirectURL)

      router.push(redirectURL)
        .then(() => {
          window.location.reload();
        });

    }).catch((error) => {
      toast.error(error?.message)
    })

  }

  const handleResendOTP = async () => {
    await reSendOtp({
      variables:
      {
        reSendOtpId: messageData?.getJWTUserId?.id,
        otpType: "Login"
      }
    })
      .then((res) => {

        toast.success(res?.data?.reSendOTP?.message)
        router?.push(res?.data?.reSendOTP?.link)

      })
      .catch((err) => {
        console.log("🚀 ~ file: index.js:149 ~ handleResendOTP ~ err:", err)
        toast.error(err?.message)

      })

  }

  // ** Hooks
  const theme = useTheme()

  // ** Vars
  const errorsArray = Object.keys(errors)

  const handleChange = (event, onChange) => {
    if (!isBackspace) {
      onChange(event)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (form[index].value && form[index].value.length) {
        form.elements[index + 1].focus()
      }
      event.preventDefault()
    }
  }

  const handleKeyDown = event => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => (
      <Controller
        key={val}
        name={val}
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <Box
            type='tel'
            maxLength={1}
            value={value}
            autoFocus={index === 0}
            component={CleaveInput}
            onKeyDown={handleKeyDown}
            onChange={event => handleChange(event, onChange)}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            sx={{ [theme.breakpoints.down('sm')]: { px: `${theme.spacing(2)} !important` } }}
          />
        )}
      />
    ))
  }

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        {
          messageLoading
            ?
            <Loader disable={messageLoading} />
            :
            otpError
              ?
              <Grid item xs={11} sm={11} md={6}>
                <Otpexpired otpError={otpError} messageData={messageData} />
              </Grid >
              :
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
                      OTP Verification 💬
                    </Typography>
                    <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                      We sent a verification code to your mobile. Enter the code from the mobile in the field below.
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>{messageData?.getJWTUserId?.email?.toString().slice(0, 5)}****{messageData?.getJWTUserId?.email?.toString().slice(-9)}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>Type your 6 digit security code</Typography>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <CleaveWrapper
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        ...(errorsArray.length && {
                          '& .invalid:focus': {
                            borderColor: theme => `${theme.palette.error.main} !important`,
                            boxShadow: theme => `0 1px 3px 0 ${hexToRGBA(theme.palette.error.main, 0.4)}`
                          }
                        })
                      }}
                    >
                      {renderInputs()}
                    </CleaveWrapper>
                    {errorsArray.length ? (
                      <FormHelperText sx={{ color: 'error.main' }}>Please enter a valid OTP</FormHelperText>
                    ) : null}
                    <Button fullWidth type='submit' variant='contained' sx={{ mt: 2 }}>
                      Verify OTP
                    </Button>
                  </form>
                  <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'text.secondary' }}>Didn't get the code?</Typography>
                    <Button sx={{ ml: 2 }} onClick={handleResendOTP}>
                      Resend
                    </Button>
                  </Box>
                </CardContent>
              </Card>
        }
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}


VerifyOtp.getLayout = page => <BlankLayout>{page}</BlankLayout>
VerifyOtp.guestGuard = true

VerifyOtp.acl = {
  action: 'read',
  subject: 'verifyOtp'
}


export default VerifyOtp
