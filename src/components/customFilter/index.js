import {
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Stack
} from '@mui/material'
import React, { useState, useMemo, forwardRef } from 'react'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTheme } from '@emotion/react'
import { format } from 'date-fns'

const dimensionData = {
  matrix: {
    name: 'Matrix',
    type: 'matrix'
  },
  country: {
    name: 'Country',
    type: 'list'
  },
  date: {
    name: 'Date',
    type: 'datePicker'
  },
  site: {
    name: 'Site',
    type: 'list'
  },
  adexchange: {
    name: 'Ad-Exchange',
    type: 'list'
  }
}

const countryValues = [
  'Afghanistan',
  'land Islands',
  'Albania',
  'Algeria',
  'American Samoa',
  'AndorrA',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Bouvet Island',
  'Brazil',
  'British Indian Ocean Territory',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Christmas Island',
  'Cocos (Keeling) Islands',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo, The Democratic Republic of the',
  'Cook Islands',
  'Costa Rica',
  'Cote D"Ivoire',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Falkland Islands (Malvinas)',
  'Faroe Islands',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'French Southern Territories',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Heard Island and Mcdonald Islands',
  'Holy See (Vatican City State)',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran, Islamic Republic Of',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, Democratic People"S Republic of',
  'Korea, Republic of',
  'Kuwait',
  'Kyrgyzstan',
  'Lao People"S Democratic Republic',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libyan Arab Jamahiriya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Macedonia, The Former Yugoslav Republic of',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mayotte',
  'Mexico',
  'Micronesia, Federated States of',
  'Moldova, Republic of',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'Netherlands Antilles',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Niue',
  'Norfolk Island',
  'Northern Mariana Islands',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestinian Territory, Occupied',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Pitcairn',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Reunion',
  'Romania',
  'Russian Federation',
  'RWANDA',
  'Saint Helena',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Pierre and Miquelon',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Georgia and the South Sandwich Islands',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Svalbard and Jan Mayen',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syrian Arab Republic',
  'Taiwan, Province of China',
  'Tajikistan',
  'Tanzania, United Republic of',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tokelau',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Turks and Caicos Islands',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'United States Minor Outlying Islands',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Viet Nam',
  'Virgin Islands, British',
  'Virgin Islands, U.S.',
  'Wallis and Futuna',
  'Western Sahara',
  'Yemen',
  'Zambia',
  'Zimbabwe'
]

const dateValues = [
  '2024-01-01',
  '2024-01-02',
  '2024-01-03',
  '2024-01-04',
  '2024-01-05',
  '2024-01-06',
  '2024-01-07',
  '2024-01-08',
  '2024-01-09',
  '2024-01-10',
  '2024-01-11',
  '2024-01-12',
  '2024-01-13',
  '2024-01-14',
  '2024-01-15',
  '2024-01-16',
  '2024-01-17',
  '2024-01-18',
  '2024-01-19',
  '2024-01-20'
]

const CustomInput = forwardRef((props, ref) => {
  const startDate = props?.start ? `${format(props?.start, 'MM/dd/yyyy')}` : null
  const endDate = props?.end ? ` - ${format(props?.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate ? startDate : ''}${endDate ? endDate : ''}`

  return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
})

export default function AdvancedMUIStyleFilter({
  siteList,
  setSelectedCountries,
  setSelectedSites,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setAppliedFiltersText,
  handleFilter,
  siteTableLoading,
  handleResetFilter,
  open,
  setOpen,
  setByDated,
  setByCountry,
  setByAdUnit,
  setByHours,
  tempSelections,
  setTempSelections,
  appliedSelections,
  setAppliedSelections
}) {
  const [selectedDimension, setSelectedDimension] = useState('matrix')
  const [searchText, setSearchText] = useState('')

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const currentDimensionData = dimensionData[selectedDimension]

  // Update the getCurrentSelectionKey function
  const getCurrentSelectionKey = () => {
    if (!selectedDimension || !currentDimensionData) {
      return ''
    }

    return currentDimensionData.name || ''
  }

  const selectedValues = tempSelections[getCurrentSelectionKey()] || []

  const getTotalSelectedCount = () => {
    return Object.values(tempSelections).reduce((total, values) => total + values.length, 0)
  }

  // Helper function to update countries when Geography > Country is selected
  const updateCountrySelection = countries => {
    if (countries) {
      setSelectedCountries(countries)
    }
  }

  const updateSiteSelection = sites => {
    if (sites) {
      setSelectedSites(sites)
    }
  }

  const matrixValues = matrix => {
    const hasDate = matrix.includes('Date')
    setByDated(hasDate)
    const hasCountry = matrix.includes('Country')
    setByCountry(hasCountry)
    const hasAdUnit = matrix.includes('adUnits')
    setByAdUnit(hasAdUnit)
    const hasHours = matrix.includes('hours')
    setByHours(hasHours)
  }

  const getCurrentValues = () => {
    const dimensionName = currentDimensionData?.name

    switch (dimensionName) {
      case 'Site':
        return siteList || []

      case 'Country':
        return countryValues

      case 'Date':
        return dateValues

      case 'Ad-Exchange':
        return ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate']

      case 'Matrix':
        return [
          'Date-True',
          'Date-False',
          'Country-True',
          'Country-False',
          'adUnits-True',
          'adUnits-False',
          'hours-True',
          'hours-False'
        ]

      default:
        return []
    }
  }

  const currentValues = getCurrentValues()

  const filteredValues = useMemo(() => {
    if (!searchText) {
      return currentValues
    }

    return currentValues.filter(value => value.toLowerCase().includes(searchText.toLowerCase()))
  }, [currentValues, searchText])

  const isAllSelected = filteredValues.length > 0 && filteredValues.every(value => selectedValues.includes(value))

  const isIndeterminate = selectedValues.some(v => filteredValues.includes(v)) && !isAllSelected

  // Event handlers
  const handleDateRangeChange = (start, end) => {
    if (!start || !end) return

    // Format dates to MM/dd/yyyy format
    const formattedStart = format(start, 'MM/dd/yyyy')
    const formattedEnd = format(end, 'MM/dd/yyyy')

    const selectionKey = getCurrentSelectionKey()
    if (selectionKey) {
      const dateRange = `${formattedStart} to ${formattedEnd}`
      setTempSelections(prev => ({
        ...prev,
        [selectionKey]: [dateRange]
      }))
    }
  }

  // Update handleDimensionSelect to auto-select the dimension as the "sub-dimension"
  const handleDimensionSelect = dimensionKey => {
    setSelectedDimension(dimensionKey)
    setSearchText('')
  }

  const handleValueToggle = value => {
    const selectionKey = getCurrentSelectionKey()
    if (!selectionKey) return

    setTempSelections(prev => {
      const currentSelections = prev[selectionKey] || []
      let newSelections

      if (currentSelections.includes(value)) {
        newSelections = currentSelections.filter(v => v !== value)
      } else {
        // For Matrix dimension, implement mutual exclusion logic
        if (selectionKey === 'Matrix') {
          // Define mutually exclusive groups
          const mutuallyExclusiveGroups = {
            hours: ['Country', 'adUnits'],
            Country: ['hours'],
            adUnits: ['hours']
          }

          // If the value being selected is in a mutually exclusive group
          if (mutuallyExclusiveGroups[value]) {
            // Remove all values from the mutually exclusive group
            newSelections = currentSelections.filter(v => !mutuallyExclusiveGroups[value].includes(v))
            // Add the new value
            newSelections.push(value)
          } else {
            // For Date, just add it normally (no mutual exclusion)
            newSelections = [...currentSelections, value]
          }
        } else {
          newSelections = [...currentSelections, value]
        }
      }

      // Update parent components based on dimension name directly
      const dimensionName = selectionKey // Now selectionKey is just the dimension name
      if (dimensionName === 'Country') {
        const allCountriesSelected = filteredValues.every(country => newSelections.includes(country))
        if (allCountriesSelected && filteredValues.length > 0) {
          updateCountrySelection(['ALL'])
        } else {
          updateCountrySelection(newSelections)
        }
      }
      if (dimensionName === 'Site') {
        updateSiteSelection(newSelections)
      }
      if (dimensionName === 'Matrix') {
        matrixValues(newSelections)
      }

      return {
        ...prev,
        [selectionKey]: newSelections
      }
    })
  }

  const handleSelectAll = () => {
    const selectionKey = getCurrentSelectionKey()
    if (!selectionKey) return

    setTempSelections(prev => {
      const currentSelections = prev[selectionKey] || []
      let newSelections

      if (isAllSelected) {
        newSelections = currentSelections.filter(v => !filteredValues.includes(v))
      } else {
        newSelections = [...currentSelections]
        filteredValues.forEach(value => {
          if (!newSelections.includes(value)) {
            newSelections.push(value)
          }
        })
      }

      // Update parent components based on dimension name directly
      const dimensionName = selectionKey // Now selectionKey is just the dimension name
      if (dimensionName === 'Country') {
        const allCountriesSelected = filteredValues.every(country => newSelections.includes(country))
        if (allCountriesSelected && filteredValues.length > 0) {
          updateCountrySelection(['ALL'])
        } else {
          updateCountrySelection(newSelections)
        }
      }
      if (dimensionName === 'Site') {
        updateSiteSelection(newSelections)
      }
      if (dimensionName === 'Matrix') {
        matrixValues(newSelections)
      }

      return {
        ...prev,
        [selectionKey]: newSelections
      }
    })
  }
  const handleClose = () => {
    setOpen(false)
    setSelectedDimension('matrix')
    setSearchText('')
  }

  const handleApply = () => {
    const newFilters = []

    Object.entries(tempSelections).forEach(([key, values]) => {
      if (values.length > 0) {
        // Since key is now just the dimension name, we don't need to split
        const dimension = key
        const newFilter = {
          id: Date.now() + Math.random(),
          dimension,
          values: [...values],
          label: `${dimension} is any of "${values.slice(0, 3).join(', ')}${values.length > 3 ? '...' : ''}"`
        }
        newFilters.push(newFilter)

        // Update parent components based on dimension name
        if (dimension === 'Country') {
          const allCountriesSelected = filteredValues.every(country => values.includes(country))
          if (allCountriesSelected && filteredValues.length > 0) {
            updateCountrySelection(['ALL'])
          } else {
            updateCountrySelection(values)
          }
        }
        if (dimension === 'Site') {
          updateSiteSelection(values)
        }
        if (dimension === 'Matrix') {
          matrixValues(values)
        }
      }
    })

    if (newFilters.length > 0) {
      setAppliedFiltersText(prev => {
        let filtered = [...prev]

        newFilters.forEach(newFilter => {
          filtered = filtered.filter(filter => filter.dimension !== newFilter.dimension)
        })

        return [...newFilters]
      })
    }

    // Update applied selections when Apply button is clicked
    setAppliedSelections({ ...tempSelections })

    handleClose()
  }

  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    handleDateRangeChange(start, end)
  }

  // Rest of your component code...

  return (
    <Box sx={{ padding: 3, maxWidth: '700px', margin: '0 auto' }}>
      {/* Applied Filters Section */}

      {/* Filter Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='lg'
        fullWidth
        PaperProps={{
          sx: {
            height: '600px',
            maxWidth: '900px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant='h6' component='h2'>
            Add Dimension Filter
          </Typography>
          <IconButton
            size='small'
            onClick={handleClose}
            sx={{
              borderRadius: 1,
              color: 'text.primary',
              backgroundColor: 'action.selected',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Icon icon='tabler:x' fontSize='1.125rem' />
          </IconButton>
        </DialogTitle>

        <DialogContent
          disableGutters
          sx={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
            padding: '0 !important',
            '&.MuiDialogContent-root': {
              padding: '0 !important'
            },
            '&.css-5q0aih-MuiDialogContent-root': {
              padding: '0 !important'
            },
            '&[class*="MuiDialogContent-root"]': {
              padding: '0 !important'
            }
          }}
        >
          {/* Dimensions Panel */}
          <Box
            sx={{
              width: '180px',
              borderRight: '1px solid',
              borderColor: 'divider',
              overflowY: 'auto'
            }}
          >
            <List sx={{ padding: 0 }}>
              {Object.entries(dimensionData).map(([key, data]) => (
                <ListItem key={key} sx={{ padding: 0 }}>
                  <ListItemButton
                    onClick={() => handleDimensionSelect(key)}
                    sx={{
                      padding: '12px 16px',
                      borderBottom: '1px solid',
                      borderBottomColor: 'divider',
                      color: selectedDimension === key ? 'primary.main' : 'text.primary',
                      borderRight: selectedDimension === key ? '3px solid' : '3px solid transparent',
                      borderRightColor: selectedDimension === key ? 'primary.main' : 'transparent',
                      borderRadius: 0
                    }}
                  >
                    <ListItemText
                      primary={data.name}
                      primaryTypographyProps={{
                        fontSize: '14px',
                        fontWeight: selectedDimension === key ? 500 : 400
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Values Panel */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '16px'
            }}
          >
            {selectedDimension && currentDimensionData && (
              <>
                {/* Special handling for Matrix dimension */}
                {currentDimensionData.type === 'matrix' ? (
                  <Paper variant='outlined' sx={{}}>
                    {/* Matrix Header */}
                    <Box
                      sx={{
                        padding: '12px 16px',
                        borderBottom: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Typography variant='h6' sx={{ color: 'primary.main', fontWeight: 500 }}>
                        Matrix
                      </Typography>
                    </Box>

                    {/* Two Column Layout for Matrix */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1px'
                      }}
                    >
                      {/* Column 1 */}
                      <Box
                        sx={{
                          padding: '12px 16px'
                        }}
                      >
                        <FormControl component='fieldset' sx={{ width: '100%' }}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedValues.includes('Date')}
                                  onChange={() => handleValueToggle('Date')}
                                  sx={{
                                    '& .MuiSvgIcon-root': {
                                      width: '16px',
                                      height: '16px'
                                    }
                                  }}
                                />
                              }
                              label={<Typography variant='body2'>Date</Typography>}
                              sx={{ marginBottom: '8px' }}
                            />
                          </FormGroup>
                        </FormControl>
                      </Box>

                      {/* Column 2 */}
                      <Box
                        sx={{
                          padding: '12px 16px'
                        }}
                      >
                        <FormControl component='fieldset' sx={{ width: '100%' }}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedValues.includes('Country')}
                                  onChange={() => handleValueToggle('Country')}
                                  sx={{
                                    '& .MuiSvgIcon-root': {
                                      width: '16px',
                                      height: '16px'
                                    }
                                  }}
                                />
                              }
                              label={<Typography variant='body2'>Country</Typography>}
                              sx={{ marginBottom: '8px' }}
                            />
                          </FormGroup>
                        </FormControl>
                      </Box>
                      {/* Column 3 */}
                      <Box
                        sx={{
                          padding: '12px 16px'
                        }}
                      >
                        <FormControl component='fieldset' sx={{ width: '100%' }}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedValues.includes('adUnits')}
                                  onChange={() => handleValueToggle('adUnits')}
                                  sx={{
                                    '& .MuiSvgIcon-root': {
                                      width: '16px',
                                      height: '16px'
                                    }
                                  }}
                                />
                              }
                              label={<Typography variant='body2'>Ad Units</Typography>}
                              sx={{ marginBottom: '8px' }}
                            />
                          </FormGroup>
                        </FormControl>
                      </Box>
                      {/* Column 4 */}
                      <Box
                        sx={{
                          padding: '12px 16px'
                        }}
                      >
                        <FormControl component='fieldset' sx={{ width: '100%' }}>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedValues.includes('hours')}
                                  onChange={() => handleValueToggle('hours')}
                                  sx={{
                                    '& .MuiSvgIcon-root': {
                                      width: '16px',
                                      height: '16px'
                                    }
                                  }}
                                />
                              }
                              label={<Typography variant='body2'>Hours</Typography>}
                              sx={{ marginBottom: '8px' }}
                            />
                          </FormGroup>
                        </FormControl>
                      </Box>
                    </Box>
                  </Paper>
                ) : currentDimensionData.type === 'datePicker' ? (
                  /* Date Picker for Date dimension */
                    <Box sx={{ marginBottom: 2 }}>
                      <Paper
                        variant='outlined'
                        sx={{
                          padding: 2
                        }}
                      >
                        {/* Date Range Input */}
                        <Grid item xs={12} display='flex' gap={3} alignItems='center'>
                          <DatePickerWrapper fullwidth>
                            <DatePicker
                              selectsRange
                              showIcon={true}
                              endDate={endDate}
                              selected={startDate}
                              startDate={startDate}
                              id='date-range-picker'
                              onChange={handleOnChange}
                              shouldCloseOnSelect={false}
                              popperPlacement={popperPlacement}
                              customInput={<CustomInput label='Date Range' start={startDate} end={endDate} />}
                            />
                          </DatePickerWrapper>
                        </Grid>

                        {/* Selected Range Display */}
                        {startDate && endDate && (
                          <Box
                            sx={{
                              border: '1px solid',
                              borderColor: 'primary.main',
                              borderRadius: 1,
                              padding: '8px 12px',
                              marginTop: 2
                            }}
                          >
                            <Typography variant='body2'>
                              <strong>Selected Range:</strong> {startDate.toLocaleDateString()} to{' '}
                              {endDate.toLocaleDateString()}
                              <Typography component='span' sx={{ marginLeft: 1 }}>
                                ({Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} days)
                              </Typography>
                            </Typography>
                          </Box>
                        )}

                        {/* Quick Date Range Buttons */}
                        <Box sx={{ marginTop: 2 }}>
                          <Typography variant='body2' sx={{ marginBottom: 1, fontWeight: 500 }}>
                            Quick Selection:
                          </Typography>
                          <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
                            {[
                              { label: 'Last 7 days', days: 7 },
                              { label: 'Last 30 days', days: 30 },
                              { label: 'Last 90 days', days: 90 },
                              { label: 'This Month', days: 'month' }
                            ].map(preset => (
                              <Button
                                variant='outlined'
                                color='secondary'
                                key={preset.label}
                                size='small'
                                sx={{
                                  fontSize: '12px',
                                  textTransform: 'none',
                                  borderRadius: 2,
                                  '&:hover': {
                                    borderColor: 'secondary.main',
                                    color: 'secondary.light'
                                  }
                                }}
                                onClick={() => {
                                  const today = new Date()
                                  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                                  let start
                                  if (preset.days === 'month') {
                                    start = new Date(end.getFullYear(), end.getMonth(), 1)
                                  } else {
                                    start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - preset.days + 1)
                                  }
                                  setStartDate(start)
                                  setEndDate(end)
                                  handleDateRangeChange(start, end)
                                }}
                              >
                                {preset.label}
                              </Button>
                            ))}
                          </Stack>
                        </Box>
                      </Paper>
                    </Box>
                  ) : (
                    /* Regular list for other dimensions */
                    <>
                      {/* Search Input */}
                        <TextField
                          fullWidth
                          placeholder='Search'
                          value={searchText}
                          onChange={e => setSearchText(e.target.value)}
                          size='small'
                          sx={{ marginBottom: 2 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Icon icon='tabler:search' fontSize='1.25rem' />
                              </InputAdornment>
                            )
                          }}
                        />

                        {/* Values List */}
                        <Paper
                          variant='outlined'
                          sx={{
                            flex: 1,
                            overflowY: 'auto',
                            maxHeight: '300px',
                            padding: 0
                          }}
                        >
                          <FormControl component='fieldset' sx={{ width: '100%' }}>
                            <FormGroup>
                              {/* Select All */}
                              <Box
                                onClick={handleSelectAll}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '8px 12px',
                                  cursor: 'pointer',
                                  borderBottom: '2px solid',
                                  borderBottomColor: 'divider',
                                  fontWeight: '500',
                                  '&:hover': {
                                    backgroundColor: 'action.hover'
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={isAllSelected}
                                  indeterminate={isIndeterminate}
                                  sx={{
                                    marginRight: '12px',
                                    padding: 0,
                                    '& .MuiSvgIcon-root': {
                                      width: '16px',
                                      height: '16px'
                                    }
                                  }}
                                />
                                <Typography variant='body2'>Select All ({filteredValues.length})</Typography>
                              </Box>

                              {/* Individual Values */}
                              {filteredValues.map(value => (
                                <Box
                                  key={value}
                                  onClick={() => handleValueToggle(value)}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    borderBottom: '1px solid',
                                    borderBottomColor: 'divider',
                                    '&:hover': {
                                      backgroundColor: 'action.hover'
                                    },
                                    '&:last-child': {
                                      borderBottom: 'none'
                                    }
                                  }}
                                >
                                  <Checkbox
                                    checked={selectedValues.includes(value)}
                                    sx={{
                                      marginRight: '12px',
                                      padding: 0,
                                      '& .MuiSvgIcon-root': {
                                        width: '16px',
                                        height: '16px'
                                      }
                                    }}
                                  />
                                  <Typography variant='body2'>{value}</Typography>
                                </Box>
                              ))}
                        </FormGroup>
                      </FormControl>
                    </Paper>
                  </>
                )}
              </>
            )}
          </div>

          {/* Selected Values Panel - Show ALL selections from ALL dimensions */}
          <Box
            sx={{
              width: '220px',
              borderLeft: '1px solid',
              borderLeftColor: 'divider',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                borderBottom: '1px solid',
                borderBottomColor: 'divider'
              }}
            >
              <Typography variant='body2' sx={{ color: 'primary.main', fontWeight: 500 }}>
                {getTotalSelectedCount()} total selected
              </Typography>
              <Button
                onClick={() => {
                  // handleResetFilter()
                  setTempSelections({})
                  setAppliedFiltersText([])
                }}
                disabled={getTotalSelectedCount() === 0}
                size='small'
                variant='text'
                color='primary'
                sx={{
                  fontSize: '14px',
                  textTransform: 'none',
                  minWidth: 'auto',
                  padding: '4px 8px',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                Clear all
              </Button>
            </Box>

            <Paper
              sx={{
                flex: 1,
                overflowY: 'auto',
                margin: '8px',
                borderRadius: '4px',
                maxHeight: '300px'
              }}
              elevation={0}
            >
              {getTotalSelectedCount() === 0 ? (
                <Box
                  sx={{
                    padding: 3,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    No items selected
                  </Typography>
                </Box>
              ) : (
                <List sx={{ padding: 0 }}>
                  {Object.entries(tempSelections).map(([key, values]) => {
                    if (values.length === 0) return null

                    return (
                      <Box key={key}>
                        {/* Dimension Group Header */}
                        <Box
                          sx={{
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            position: 'sticky',
                            backgroundColor: 'background.paper',
                            top: 0,
                            zIndex: 1
                          }}
                        >
                          <Typography
                            variant='caption'
                            sx={{
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            {key} ({values.length})
                          </Typography>
                        </Box>

                        {/* Values in this dimension */}
                        {values.map(value => (
                          <ListItem
                            key={`${key}-${value}`}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '4px 12px',
                              borderBottom: '1px solid',
                              borderBottomColor: 'divider',
                              fontSize: '12px',
                              backgroundColor: key === getCurrentSelectionKey() ? 'action.selected' : 'transparent',
                              minHeight: 'auto',
                              '&:last-child': {
                                borderBottom: 'none'
                              }
                            }}
                            secondaryAction={
                              <IconButton
                                edge='end'
                                size='small'
                                onClick={() => {
                                  setTempSelections(prev => ({
                                    ...prev,
                                    [key]: prev[key].filter(v => v !== value)
                                  }))

                                  // Update parent components when removing items
                                  const updatedValues = tempSelections[key]?.filter(v => v !== value) || []
                                  if (key === 'Country') {
                                    updateCountrySelection(updatedValues)
                                  }
                                  if (key === 'Site') {
                                    updateSiteSelection(updatedValues)
                                  }
                                }}
                                sx={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  marginLeft: '8px',
                                  padding: 0,
                                  '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.1)'
                                  },
                                  '& .MuiSvgIcon-root': {
                                    fontSize: '14px',
                                    color: '#666'
                                  }
                                }}
                              >
                                <Icon icon='tabler:x' fontSize={20} />
                              </IconButton>
                            }
                          >
                            <ListItemText
                              primary={value}
                              primaryTypographyProps={{
                                sx: {
                                  fontSize: '12px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  paddingRight: '8px'
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </Box>
                    )
                  })}
                </List>
              )}
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions sx={{ padding: '16px 24px', gap: 1, borderTop: '1px solid', borderTopColor: 'divider' }}>
          <Button variant='outlined' color='secondary' onClick={handleClose} sx={{ minWidth: 80 }}>
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              handleApply()
              handleFilter()
            }}
            disabled={siteTableLoading || getTotalSelectedCount() === 0}
            sx={{ minWidth: 80 }}
          >
            {siteTableLoading ? 'Applying...' : 'Apply'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
