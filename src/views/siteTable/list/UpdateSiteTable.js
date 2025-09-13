// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Autocomplete from '@mui/material/Autocomplete'
import { useTheme } from '@mui/material/styles'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'


// ** Third Party Imports
import DatePicker from 'react-datepicker';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'


import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_SITETABLE } from 'src/graphql/mutation/siteTable'
import { GET_ALL_SITES } from 'src/graphql/query/site'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Components
import toast from 'react-hot-toast'
import Loader from 'src/components/loader/loader'


const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({

  site: yup
    .string(),
  estimatedEarning: yup
    .string(),
  pageViews: yup
    .string(),
  pageRpm: yup
    .number(),
  impressions: yup
    .string(),
  impressionsRpm: yup
    .number(),
  activeViewViewable: yup
    .string(),
  clicks: yup
    .number(),

})

const AddSiteTable = props => {

  // ** Props
  const { open, toggle, userData, siteTableRes } = props

  const [disable, setDisable] = useState(false);

  const [date, setDate] = useState(new Date())

  const [site, setSite] = useState(userData?.siteId)
  const [siteId, setSiteId] = useState(userData?.siteId?.id)
  const [siteData, setSiteData] = useState([])

  const [pageSize, setPageSize] = useState(100)
  const [pageNumber, setPageNumber] = useState(1)

  // Graphql query
  const { loading: userLoading, error: userError, data: sites, refetch: userRefetch } = useQuery(GET_ALL_SITES, {
    variables: { page: pageNumber, limit: pageSize, isSearch: false },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    sites?.getAllSites?.data && setSiteData(sites?.getAllSites?.data)
  }, [sites])


  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const defaultValues = {
    site: userData?.site,
    estimatedEarning: userData?.estimatedEarning,
    pageViews: userData?.pageViews,
    pageRpm: userData?.pageRpm,
    impressions: userData?.impressions,
    impressionsRpm: userData?.impressionsRpm,
    activeViewViewable: userData?.activeViewViewable,
    clicks: userData?.clicks,

  }

  // ** Graphql
  const [updateSiteTable] = useMutation(UPDATE_SITETABLE);

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
    data.id = userData?.id
    data.date = date
    siteId && (data.siteId = siteId)

    updateSiteTable({
      variables: {
        input: data
      }
    }).then((result) => {
      setDisable(false);
      toast.success('Successfully Updated!')
      siteTableRes();
      toggle()
      reset()
    }).catch((error) => {
      setDisable(false);
      toast.error('Something Went Wrong!')
    })
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const handleSiteChange = (event, newValue) => {
    setSite(newValue)
    setSiteId(newValue?.id)
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 350, sm: 450 } } }}
    >
      <Header>
        <Typography variant='h6'>Update SiteTable</Typography>
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
              name='site'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Site'
                  onChange={onChange}
                  placeholder='site'
                  error={Boolean(errors.site)}
                />
              )}
            />
            {errors.site && <FormHelperText sx={{ color: 'error.main' }}>{errors.site.message}</FormHelperText>}
          </FormControl>

          <Box sx={{ mb: 4 }}>
            <DatePickerWrapper>
              <DatePicker

                // showTimeSelect
                // timeFormat='HH:mm'
                timeIntervals={15}
                selected={date}
                id='date-time-picker'
                dateFormat='MM/dd/yyyy'
                popperPlacement={popperPlacement}
                onChange={date => setDate(date)}
                customInput={<CustomInput label='Select Date' />}
              />
            </DatePickerWrapper>
          </Box>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='estimatedEarning'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='estimatedEarning'
                  onChange={onChange}
                  placeholder='estimatedEarning'
                  error={Boolean(errors.estimatedEarning)}
                />
              )}
            />
            {errors.estimatedEarning && <FormHelperText sx={{ color: 'error.main' }}>{errors.estimatedEarning.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='pageViews'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='pageViews'
                  onChange={onChange}
                  placeholder='pageViews'
                  error={Boolean(errors.pageViews)}
                />
              )}
            />
            {errors.pageViews && <FormHelperText sx={{ color: 'error.main' }}>{errors.pageViews.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='pageRpm'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='pageRpm'
                  onChange={onChange}
                  placeholder='pageRpm'
                  error={Boolean(errors.pageRpm)}
                />
              )}
            />
            {errors.pageRpm && <FormHelperText sx={{ color: 'error.main' }}>{errors.pageRpm.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='impressions'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='impressions'
                  onChange={onChange}
                  placeholder='impressions'
                  error={Boolean(errors.impressions)}
                />
              )}
            />
            {errors.impressions && <FormHelperText sx={{ color: 'error.main' }}>{errors.impressions.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='impressionsRpm'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='impressionsRpm'
                  onChange={onChange}
                  placeholder='impressionsRpm'
                  error={Boolean(errors.impressionsRpm)}
                />
              )}
            />
            {errors.impressionsRpm && <FormHelperText sx={{ color: 'error.main' }}>{errors.impressionsRpm.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='activeViewViewable'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='activeViewViewable'
                  onChange={onChange}
                  placeholder='activeViewViewable'
                  error={Boolean(errors.activeViewViewable)}
                />
              )}
            />
            {errors.activeViewViewable && <FormHelperText sx={{ color: 'error.main' }}>{errors.activeViewViewable.message}</FormHelperText>}
          </FormControl>


          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='clicks'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Clicks'
                  onChange={onChange}
                  placeholder='Clicks'
                  error={Boolean(errors.clicks)}
                />
              )}
            />
            {errors.clicks && <FormHelperText sx={{ color: 'error.main' }}>{errors.clicks.message}</FormHelperText>}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }} disabled={disable}>
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

export default AddSiteTable
