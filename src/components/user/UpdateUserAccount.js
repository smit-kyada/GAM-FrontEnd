// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'


import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_USER, UPDATE_USER_ACCOUNT } from 'src/graphql/mutation/user'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import { FormControlLabel, InputLabel, MenuItem, Select, Switch } from '@mui/material'
import toast from 'react-hot-toast'
import Loader from 'src/components/loader/loader'
import { GET_USER_LIST } from 'src/graphql/query/user'
import Compressor from 'compressorjs'



const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const ProfilePicture = styled('img')(({ theme }) => ({
  width: 108,
  height: 108,
  borderRadius: theme.shape.borderRadius,
  border: `4px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  }
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(2)
  }
}))




const schema = yup.object().shape({
  bankName: yup
    .string()
    .required(),
  accountNumber: yup
    .string()
    .required(),
  IFSC: yup
    .string()
    .required(),
  accountHolderName: yup
    .string()
    .required(),
  GstNumber: yup
    .string()
    .matches(/^([0-9]{2}[a-zA-Z]{4}([a-zA-Z]{1}|[0-9]{1})[0-9]{4}[a-zA-Z]{1}([a-zA-Z]|[0-9]){3}){0,15}$/, { message: "GST Number format is invalid" })

})

const UpdateUserAccount = props => {

  // ** Props
  const { open, toggle, userAccRes, userData } = props

  const defaultIcon = `${process.env.NEXT_PUBLIC_BASE_URL}/${userData?.GstCertificate}`

  const [disable, setDisable] = useState(false);
  const [iconSrc, setIconSrc] = useState(defaultIcon)
  const [iconinputValue, setIconInputValue] = useState('')
  const [iconbase64, setIconBase64] = useState("")
  const [accountType, setAccountType] = useState(userData?.accountType);


  const [isGST, setIsGST] = useState(userData?.GstNumber ? true : false)
  const [gstNum, setGstNum] = useState(userData?.GstNumber)

  const defaultValues = {
    bankName: userData?.bankName || "",
    accountNumber: userData?.accountNumber || "",
    IFSC: userData?.IFSC || "",
    accountHolderName: userData?.accountHolderName || "",
    GstNumber: userData?.GstNumber || "",
  }



  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleInputIconChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      new Compressor(files[0], {
        quality: 0.4,
        success: (compressedResult) => {
          convertToBase64(compressedResult).then((result) => setIconBase64(result)).catch(error => console.log(error))
        }
      });
      reader.onload = () => {
        setIconSrc(reader.result)
      }
      reader.readAsDataURL(files[0])
      if (reader.result !== null) {
        setIconInputValue(reader.result)
      }
    }
  }

  // ** Graphql
  const [updateUserAccount] = useMutation(UPDATE_USER_ACCOUNT);

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })




  const onSubmit = data => {

    setDisable(true);

    if (iconbase64) {
      data.GstCertificate = iconbase64;
      data.OldGstCertificate = userData?.GstCertificate
    }

    data.id = userData?.id
    data.accountType = accountType

    updateUserAccount({
      variables: {
        input: data
      }
    }).then((result) => {
      setDisable(false);
      toast.success('Successfully Updated!')
      userAccRes();
      toggle()
      reset()
    }).catch((error) => {
      console.log("🚀 ~ onSubmit ~ error:", error)
      setDisable(false);
      toast.error('Something Went Wrong!')
    })
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const handleInputIconReset = () => {
    setIconInputValue('')
    setIconSrc('')
    setIconBase64('')
  }


  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      transitionDuration={{ enter: 500, exit: 500 }}
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 450 } } }}
    >
      <Header>
        <Typography variant='h6'>Add Bank Account</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='bankName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Bank Name'
                  onChange={onChange}
                  placeholder='Bank Name'
                  error={Boolean(errors.bankName)}
                />
              )}
            />
            {errors.bankName && <FormHelperText sx={{ color: 'error.main' }}>{errors.bankName.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='accountHolderName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Account holder Name'
                  onChange={onChange}
                  placeholder='Account holder Name'
                  error={Boolean(errors.accountHolderName)}
                />
              )}
            />
            {errors.accountHolderName && <FormHelperText sx={{ color: 'error.main' }}>{errors.accountHolderName.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='IFSC'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='IFSC Code'
                  onChange={onChange}
                  placeholder='IFSC Code'
                  error={Boolean(errors.IFSC)}
                />
              )}
            />
            {errors.IFSC && <FormHelperText sx={{ color: 'error.main' }}>{errors.IFSC.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='accountNumber'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  type='text'
                  value={value}
                  label='Account No.'
                  onChange={onChange}
                  placeholder='Account No.'
                  error={Boolean(errors.accountNumber)}
                />
              )}
            />
            {errors.accountNumber && <FormHelperText sx={{ color: 'error.main' }}>{errors.accountNumber.message}</FormHelperText>}
          </FormControl>



          <FormControl fullWidth sx={{ mb: 4, }}>
            <InputLabel id='type-select'>Account Type </InputLabel>
            <Select
              fullWidth
              value={accountType}
              id='selectType'
              label='Account Type'
              labelId='type-select'
              onChange={e => setAccountType(e.target.value)}
              inputProps={{ placeholder: 'Account Type' }}
            >
              <MenuItem value='saving'>Saving Account</MenuItem>
              <MenuItem value='current'>Current Account</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel control={<Switch checked={isGST} onChange={(e) => setIsGST(e.target.checked)} />} label='Add GST Number and Certificate' />


          {isGST && <div>
            <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>

              <Controller
                name='GstNumber'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => {

                  setGstNum(value)

                  return <TextField
                    value={value}
                    label='Gst Number'
                    onChange={onChange}
                    placeholder='Gst Number'
                    error={Boolean(errors.GstNumber)}
                  />
                }}
              />



              {errors.GstNumber && <FormHelperText sx={{ color: 'error.main' }}>{errors.GstNumber.message}</FormHelperText>}
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 7 }}>
              {iconSrc && <ProfilePicture src={iconSrc} sx={{ mr: 5 }} />}
              <div>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-img-2' sx={{ mb: 2, ml: 4 }}>
                  Add GST Certificate
                  <input
                    hidden
                    type='file'
                    value={iconinputValue}
                    onChange={handleInputIconChange}
                    id='account-settings-upload-img-2'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputIconReset} sx={{ mb: 2 }}>
                  Reset
                </ResetButtonStyled>

                {!gstNum || !iconbase64 && <FormHelperText sx={{ color: 'error.main' }}>GST Number and Certificate is required</FormHelperText>}
              </div>

            </Box>
          </div>}



          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }} disabled={isGST ? iconbase64 ? false : true : disable}>
              submit
            </Button>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>

      {disable && <Loader disable={disable} />}
    </Drawer>
  )
}

export default UpdateUserAccount
