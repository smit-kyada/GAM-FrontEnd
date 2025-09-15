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
  ListItemButton
} from '@mui/material'
import React, { useState, useMemo, forwardRef } from 'react'
import Icon from 'src/@core/components/icon'
import Grid from '@mui/material/Grid'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTheme } from '@emotion/react'
import { format } from 'date-fns'

// Sample data structure
// const dimensionData = {
//   matrix: {
//     name: 'Matrix',
//     values: ['Date', 'Country']
//   },
//   country: {
//     name: 'Country',
//     values: ['Country']
//   },
//   date: {
//     name: 'Date',
//     values: ['Date']
//   },
//   site: {
//     name: 'Site',
//     values: ['Site']
//   },
//   adexchange: {
//     name: 'Ad Exchange',
//     values: ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate', 'Bid Rate', 'Win Rate', 'Fill Rate']
//   },
// };

const dimensionData = {
  matrix: {
    name: 'Matrix',
    type: 'matrix' // Special type for two-column checkbox layout
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
    name: 'Ad Exchange',
    type: 'list'
  }
}

const countryValues = [
  "Afghanistan",
  "land Islands",
  "Albania",
  "Algeria",
  "American Samoa",
  "AndorrA",
  "Angola",
  "Anguilla",
  "Antarctica",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Bouvet Island",
  "Brazil",
  "British Indian Ocean Territory",
  "Brunei Darussalam",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Christmas Island",
  "Cocos (Keeling) Islands",
  "Colombia",
  "Comoros",
  "Congo",
  "Congo, The Democratic Republic of the",
  "Cook Islands",
  "Costa Rica",
  "Cote D\"Ivoire",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands (Malvinas)",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "French Polynesia",
  "French Southern Territories",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Heard Island and Mcdonald Islands",
  "Holy See (Vatican City State)",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran, Islamic Republic Of",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, Democratic People\"S Republic of",
  "Korea, Republic of",
  "Kuwait",
  "Kyrgyzstan",
  "Lao People\"S Democratic Republic",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libyan Arab Jamahiriya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Macedonia, The Former Yugoslav Republic of",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mayotte",
  "Mexico",
  "Micronesia, Federated States of",
  "Moldova, Republic of",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Niue",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestinian Territory, Occupied",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Pitcairn",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russian Federation",
  "RWANDA",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Pierre and Miquelon",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Georgia and the South Sandwich Islands",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Svalbard and Jan Mayen",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syrian Arab Republic",
  "Taiwan, Province of China",
  "Tajikistan",
  "Tanzania, United Republic of",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tokelau",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks and Caicos Islands",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "United States Minor Outlying Islands",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Viet Nam",
  "Virgin Islands, British",
  "Virgin Islands, U.S.",
  "Wallis and Futuna",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe"
];


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
  setByCountry
}) {
  // const [open, setOpen] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState('matrix')
  const [searchText, setSearchText] = useState('')
  const [tempSelections, setTempSelections] = useState({});

  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const currentDimensionData = dimensionData[selectedDimension]

  // const getCurrentSelectionKey = () => {
  //   if (!selectedSubDimension) return '';
  //   return `${currentDimensionData.name}-${selectedSubDimension}`;
  // };

  // Update the getCurrentSelectionKey function
  const getCurrentSelectionKey = () => {
    if (!selectedDimension || !currentDimensionData) {

      return '';
    }

    return currentDimensionData.name || '';
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

  const matrixValues = (matrix) => {
    const hasDate = matrix.includes("Date");
    setByDated(hasDate);
    const hasCountry = matrix.includes("Country");
    setByCountry(hasCountry);
};

  // Updated function to get values based on dimension and sub-dimension
  // const getCurrentValues = () => {
  //   const dimensionName = currentDimensionData?.name;

  //   // Handle Platform sub-dimensions
  //   if (dimensionName === 'Platform') {
  //     switch (selectedSubDimension) {
  //       case 'Site':
  //         return siteList || []; // Extract the site URL
  //       case 'Domain':
  //         return ['Domain 1', 'Domain 2', 'Domain 3'];
  //       case 'Mobile App':
  //         return ['App 1', 'App 2', 'App 3'];
  //       case 'Video':
  //         return ['Video 1', 'Video 2', 'Video 3'];
  //       default:
  //         return [];
  //     }
  //   }

  //   // Handle Geography
  //   if (dimensionName === 'Geography') {
  //     switch (selectedSubDimension) {
  //       case 'Country':
  //         return countryValues;
  //       case 'Region':
  //         return ['Region 1', 'Region 2', 'Region 3'];
  //       case 'City':
  //         return ['City 1', 'City 2', 'City 3'];
  //       default:
  //         return [];
  //     }
  //   }

  //   // Handle Time unit
  //   if (dimensionName === 'Time unit') {
  //     switch (selectedSubDimension) {
  //       case 'Date':
  //         return dateValues;
  //       case 'Week':
  //         return ['Week 1', 'Week 2', 'Week 3'];
  //       case 'Month':
  //         return ['January', 'February', 'March'];
  //       default:
  //         return [];
  //     }
  //   }

  //   // Handle other dimensions with generic values
  //   if (selectedSubDimension) {
  //     return Array.from({ length: 10 }, (_, i) => `${selectedSubDimension} ${i + 1}`);
  //   }

  //   return [];
  // };

  const getCurrentValues = () => {
    const dimensionName = currentDimensionData?.name

    switch (dimensionName) {
      case 'Site':
        return siteList || []

      case 'Country':
        return countryValues

      case 'Date':
        return dateValues

      case 'Ad Exchange':
        return ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate', 'Bid Rate', 'Win Rate', 'Fill Rate']

      case 'Matrix':
        return ['Date-True', 'Date-False', 'Country-True', 'Country-False', 'adUnits-True', 'adUnits-False', 'hours-True', 'hours-False'];

      default:
        return []
    }  
  }

  const currentValues = getCurrentValues()

  const filteredValues = useMemo(() => {
    if (!searchText) {

      return currentValues;
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

  // const handleDimensionSelect = (dimensionKey) => {
  //   setSelectedDimension(dimensionKey);
  //   setSelectedSubDimension('');
  //   setSearchText('');
  // };

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
        newSelections = [...currentSelections, value]
      }

      // Update parent components based on dimension name directly
      const dimensionName = selectionKey // Now selectionKey is just the dimension name
      if (dimensionName === 'Country') {
        const allCountriesSelected = filteredValues.every(country => newSelections.includes(country))
        if (allCountriesSelected && filteredValues.length > 0) {
          updateCountrySelection(["ALL"])
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
          updateCountrySelection(["ALL"])
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
            updateCountrySelection(["ALL"])
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

    handleClose()
  }

  const handleRemoveFilter = filterId => {
    setAppliedFiltersText(prev => {
      const updatedFilters = prev.filter(filter => filter.id !== filterId)

      // Check if we're removing a specific filter type
      const removedFilter = prev.find(filter => filter.id === filterId)
      if (removedFilter) {
        if (removedFilter.dimension === 'Country') {
          updateCountrySelection([])
        }
        if (removedFilter.dimension === 'Site') {
          updateSiteSelection([])
        }
        if (removedFilter.dimension === 'Matrix') {
          matrixValues([])
        }
      }

      return updatedFilters
    })
  }



  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    handleDateRangeChange(start, end)
  }

  // Rest of your component code...

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Roboto, sans-serif' }}>
      {/* Applied Filters Section */}

      {/* Filter Dialog */}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              width: '900px',
              maxWidth: '95vw',
              height: '600px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow:
                '0 11px 15px -7px rgba(0,0,0,0.2), 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12)'
            }}
          >
            {/* Dialog Header */}
            <div
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: '500', margin: 0 }}>Add Dimension Filter</h2>
              <IconButton
                size='small'
                onClick={handleClose}
                sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
              >
                <Icon icon='tabler:x' fontSize='1.125rem' />
              </IconButton>
            </div>

            {/* Dialog Content */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Dimensions Panel */}
              <Box
                sx={{
                  width: '180px',
                  borderRight: '1px solid #eee',
                  backgroundColor: '#fafafa',
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
                          borderBottom: '1px solid #eee',
                          backgroundColor: selectedDimension === key ? '#e3f2fd' : 'transparent',
                          color: selectedDimension === key ? '#1976d2' : '#333',
                          borderRight: selectedDimension === key ? '3px solid #1976d2' : '3px solid transparent',
                          '&:hover': {
                            backgroundColor: selectedDimension === key ? '#e3f2fd' : '#f0f0f0'
                          },
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

              {/* Sub-dimensions Panel */}
              {/* <Box
                sx={{
                  width: '180px',
                  borderRight: '1px solid #eee',
                  padding: '16px',
                  overflowY: 'auto',
                  backgroundColor: '#fff'
                }}
              >
                {selectedDimension && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: '16px',
                        fontWeight: '500',
                        marginBottom: '12px',
                        color: '#333'
                      }}
                    >
                      {currentDimensionData.name}
                    </Typography>

                    <List sx={{ padding: 0 }}>
                      {currentDimensionData.values.map((subDim) => (
                        <ListItem key={subDim} sx={{ padding: 0, marginBottom: '4px' }}>
                          <ListItemButton
                            onClick={() => handleSubDimensionSelect(subDim)}
                            sx={{
                              padding: '8px 12px',
                              borderRadius: '4px',
                              fontSize: '14px',
                              backgroundColor: selectedSubDimension === subDim ? '#e3f2fd' : 'transparent',
                              color: selectedSubDimension === subDim ? '#1976d2' : '#333',
                              '&:hover': {
                                backgroundColor: selectedSubDimension === subDim ? '#e3f2fd' : '#f5f5f5'
                              },
                              minHeight: 'auto'
                            }}
                            variant="body2"
                          >
                            <ListItemText
                              primary={subDim}
                              primaryTypographyProps={{
                                fontSize: '14px',
                                fontWeight: selectedSubDimension === subDim ? 500 : 400
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </Box> */}

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
                      <div
                        style={{
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          backgroundColor: '#fafafa'
                        }}
                      >
                        {/* Matrix Header */}
                        <div
                          style={{
                            backgroundColor: '#e3f2fd',
                            padding: '12px 16px',
                            fontSize: '16px',
                            fontWeight: '500',
                            color: '#1976d2',
                            borderBottom: '1px solid #ccc'
                          }}
                        >
                          Matrix
                        </div>

                        {/* Two Column Layout for Matrix */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1px',
                            backgroundColor: '#ccc'
                          }}
                        >
                          {/* Column 1 */}
                          <div
                            style={{
                              backgroundColor: 'white',
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
                          </div>

                          {/* Column 2 */}
                          <div
                            style={{
                              backgroundColor: 'white',
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
                          </div>
                          {/* Column 3 */}
                          <div
                            style={{
                              backgroundColor: 'white',
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
                          </div>
                          {/* Column 4 */}
                          <div
                            style={{
                              backgroundColor: 'white',
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
                          </div>
                        </div>
                      </div>
                    ) : currentDimensionData.type === 'datePicker' ? (
                      /* Date Picker for Date dimension */
                      <div style={{ marginBottom: '12px' }}>
                        <div
                          style={{
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '16px',
                            backgroundColor: '#fafafa'
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
                            <div
                              style={{
                                backgroundColor: '#e3f2fd',
                                border: '1px solid #1976d2',
                                borderRadius: '4px',
                                padding: '8px 12px',
                                fontSize: '14px',
                                color: '#1976d2',
                                marginTop: '12px'
                              }}
                            >
                              <strong>Selected Range:</strong> {startDate.toLocaleDateString()} to{' '}
                              {endDate.toLocaleDateString()}
                              <span style={{ marginLeft: '8px', color: '#666' }}>
                                ({Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} days)
                              </span>
                            </div>
                          )}

                          {/* Quick Date Range Buttons */}
                          <div style={{ marginTop: '12px' }}>
                            <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                              Quick Selection:
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                                  sx={{
                                    fontSize: '12px'
                                  }}
                                  size='small'
                                  onClick={() => {
                                    const today = new Date()
                                    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                                    let start
                                    if (preset.days === 'month') {
                                      start = new Date(end.getFullYear(), end.getMonth(), 1)
                                    } else {
                                      start = new Date(
                                        end.getFullYear(),
                                        end.getMonth(),
                                        end.getDate() - preset.days + 1
                                      )
                                    }
                                    setStartDate(start)
                                    setEndDate(end)
                                    handleDateRangeChange(start, end)
                                  }}

                                >
                                  {preset.label}
                                </Button>
                              ))}

                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Regular list for other dimensions */
                      <>
                        {/* Search Input */}
                        <div style={{ marginBottom: '12px', position: 'relative' }}>
                          <input
                            type='text'
                            placeholder='Search'
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '12px 12px 12px 40px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              fontSize: '14px',
                              outline: 'none'
                            }}
                            onFocus={e => {
                              e.target.style.borderColor = '#1976d2'
                              e.target.style.boxShadow = '0 0 0 2px rgba(25, 118, 210, 0.2)'
                            }}
                            onBlur={e => {
                              e.target.style.borderColor = '#ccc'
                              e.target.style.boxShadow = 'none'
                            }}
                          />
                          <svg
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '16px',
                              height: '16px',
                              color: '#666'
                            }}
                            viewBox='0 0 24 24'
                            fill='currentColor'
                          >
                            <path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' />
                          </svg>
                        </div>

                        {/* Values List */}
                        <Paper
                          variant='outlined'
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: '4px',
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
                                  backgroundColor: '#f9f9f9',
                                  borderBottom: '2px solid #ddd',
                                  fontWeight: '500',
                                  '&:hover': {
                                    backgroundColor: '#f0f0f0'
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
                                    borderBottom: '1px solid #f0f0f0',
                                    '&:hover': {
                                      backgroundColor: '#f5f5f5'
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
              <div
                style={{
                  width: '220px',
                  borderLeft: '1px solid #eee',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#1976d2',
                      fontWeight: '500'
                    }}
                  >
                    {getTotalSelectedCount()} total selected
                  </span>
                  <button
                    onClick={() => {
                      // handleResetFilter()
                      setTempSelections({})
                      setAppliedFiltersText([])
                    }}
                    disabled={getTotalSelectedCount() === 0}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: getTotalSelectedCount() === 0 ? '#ccc' : '#1976d2',
                      cursor: getTotalSelectedCount() === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      textDecoration: 'underline'
                    }}
                    onMouseOver={e => {
                      if (getTotalSelectedCount() > 0) {
                        e.target.style.textDecoration = 'none'
                      }
                    }}
                    onMouseOut={e => {
                      if (getTotalSelectedCount() > 0) {
                        e.target.style.textDecoration = 'underline'
                      }
                    }}
                  >
                    Clear all
                  </button>
                </div>

                <Paper
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    backgroundColor: '#fafafa',
                    margin: '8px',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    maxHeight: '300px'
                  }}
                  elevation={0}
                >
                  {getTotalSelectedCount() === 0 ? (
                    <Box
                      sx={{
                        padding: '16px',
                        textAlign: 'center',
                        color: '#666',
                        fontSize: '14px'
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
                                backgroundColor: '#e3f2fd',
                                padding: '8px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#1976d2',
                                borderBottom: '1px solid #ccc',
                                position: 'sticky',
                                top: 0,
                                zIndex: 1
                              }}
                            >
                              <Typography
                                variant='caption'
                                sx={{
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color: '#1976d2'
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
                                  borderBottom: '1px solid #f0f0f0',
                                  fontSize: '12px',
                                  backgroundColor: key === getCurrentSelectionKey() ? '#fff3e0' : 'transparent',
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
              </div>
            </div>

            {/* Dialog Actions */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid #eee',
                display: 'flex',
                gap: '8px',
                justifyContent: 'flex-end'
              }}
            >
              <Button variant='outlined' color='secondary' onClick={handleClose}>
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
              >
                {siteTableLoading ? 'Applying...' : 'Apply'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
