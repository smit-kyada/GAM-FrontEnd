import { useMutation } from '@apollo/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormHelperText, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LOGIN_WITH_MOBILE } from 'src/graphql/mutation/user'
import * as yup from 'yup'

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))



const LoginOtp = () => {


  const router = useRouter()

  // ** State
  const [rememberMe, setRememberMe] = useState(true)
  const [checked, setChecked] = useState(false);

  const defaultValues = {
    email: '',
  }

  const schema = yup.object().shape({
    email: yup.string().required("Email is Required"),
  })

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



  const [loginWithMobile] = useMutation(LOGIN_WITH_MOBILE)

  const onSubmit = data => {

    loginWithMobile({
      variables: data
    }).then((result) => {
      toast.success("OTP sent sucessfully")
      router.push(result?.data?.loginWithMobile)


    }).catch((error) => {
      toast.error(error?.message)
    })

  }

  return (
    <div>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <Controller
            name='email'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                type='email'
                value={value}
                label='Email Id'
                onBlur={onBlur}
                onChange={onChange}
                error={Boolean(errors.email)}
                placeholder='Email Id'
              />
            )}
          />
          {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
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
    </div>
  )
}

export default LoginOtp
