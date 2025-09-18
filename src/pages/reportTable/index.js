import { useQuery } from '@apollo/client'
import { Autocomplete, Box, Button, TextField, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { DataGrid, GridFooterContainer, GridPagination } from '@mui/x-data-grid'
import { forwardRef, useEffect, useState, useCallback } from 'react'
import Moment from 'react-moment'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import RowOptions from 'src/components/commonComponent/RowOptions'
import { GET_ADUNIT_REPORTTABLES, GET_ALL_REPORTTABLES, GET_HOURS_REPORTTABLES } from 'src/graphql/query/reportTable'
import { GET_ALL_SITES } from 'src/graphql/query/site'
import { useAuth } from 'src/hooks/useAuth'
import AddSiteTable from 'src/views/siteTable/list/AddSiteTable'
import TableHeader from 'src/views/siteTable/list/TableHeader'
import { useTheme } from '@emotion/react'
import { Icon } from '@iconify/react'
import AdvancedMUIStyleFilter from 'src/components/customFilter'
import toast from 'react-hot-toast'


const CustomInput = forwardRef((props, ref) => {
  const startDate = props?.start ? `${format(props?.start, 'MM/dd/yyyy')}` : null
  const endDate = props?.end ? ` - ${format(props?.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate ? startDate : ''}${endDate ? endDate : ''}`

  return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
})

var siteTableRes

function CustomFooter({ totals, filteredData }) {
  return (
    <>
      <GridFooterContainer
        sx={{
          backgroundColor: '#f5f5f5',
          fontWeight: 'bold',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%'
          }}
        >
          <Box sx={{ minWidth: 300 }}>
            <Typography
              noWrap
              sx={{ color: 'text.secondary', fontWeight: 'bold', fontSize: '16px', paddingLeft: '20px' }}
            >
              TOTAL
            </Typography>
          </Box>

          {/* Country column (if enabled) */}

          {filteredData?.selectedCountries?.length > 0 && filteredData?.byCountry && (
            <Box sx={{ minWidth: 200, px: 4 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}
          {filteredData?.byHours && (
            <Box sx={{ minWidth: 200, px: 4 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}
          {filteredData?.byDated && (
            <Box sx={{ minWidth: 180, px: 4 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}

          {/* Impressions */}
          <Box sx={{ minWidth: 150, textAlign: 'right', px: 4 }}>
            <Typography noWrap>{totals?.impressions}</Typography>
          </Box>

          {/* CTR */}
          <Box sx={{ minWidth: 130, textAlign: 'right', px: 4 }}>
            <Typography noWrap>{(totals?.ctr ?? 0).toFixed(2)}%</Typography>
          </Box>

          {/* ECPM */}
          <Box sx={{ minWidth: 150, textAlign: 'right', px: 4 }}>
            <Typography noWrap>US${(totals?.ecpm ? totals?.ecpm : 0).toFixed(2)}</Typography>
          </Box>

          {/* Revenue */}
          <Box sx={{ minWidth: 220, textAlign: 'right', px: 4 }}>
            <Typography noWrap>US${(totals?.revenue ?? 0).toFixed(2)}</Typography>
          </Box>

          {/* Clicks */}
          <Box sx={{ minWidth: 100, textAlign: 'right', px: 4 }}>
            <Typography noWrap>{totals?.clicks ?? 0}</Typography>
          </Box>

          {/* Match Rate */}
          <Box sx={{ minWidth: 100, textAlign: 'right', px: 4 }}>
            <Typography noWrap>{(totals?.matchRate ?? 0).toFixed(2)}%</Typography>
          </Box>
        </Box>
      </GridFooterContainer>
      <GridPagination />
    </>
  )
}

const SiteTable = () => {
  const { user } = useAuth()
  const today = new Date()

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([])
  const [totals, setTotals] = useState({})
  const [totalRow, setTotalRow] = useState(0)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [siteSearchText, setSiteSearchText] = useState('')

  // Filter states
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [selectedSites, setSelectedSites] = useState([])
  const [siteList, setSiteList] = useState([])
  const [selectedCountries, setSelectedCountries] = useState([])
  const [byDated, setByDated] = useState(false)
  const [byCountry, setByCountry] = useState(false)
  const [byAdUnit, setByAdUnit] = useState(false)
  const [byHours, setByHours] = useState(false)

  const [appliedFiltersText, setAppliedFiltersText] = useState([]);

  const [open, setOpen] = useState(false);

  // Applied filters state to track when to make API calls
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: today,
    endDate: today,
    selectedSites: [],
    selectedCountries: [],
    pageNumber: 1,
    pageSize: 10,
    byDated: false,
    byCountry: false,
    byDate: false,
    byAdUnit: false,
    byHours: false,
  })

  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // Graphql query for report tables - conditionally calls based on byHours and byAdUnit flags
  const {
    loading: siteTableLoading,
    error: siteTableError,
    data: siteTableData,
    refetch: reportTableRefetch
  } = useQuery(GET_ALL_REPORTTABLES, {
    variables: {
      page: appliedFilters.pageNumber,
      limit: appliedFilters.pageSize,
      site: appliedFilters.selectedSites.length ? appliedFilters.selectedSites : null,
      byDated: appliedFilters.byDated,
      country:
        appliedFilters.selectedCountries.length && appliedFilters.byCountry ? appliedFilters.selectedCountries : null,
      startDate: appliedFilters.startDate ? format(appliedFilters.startDate, 'yyyy-MM-dd') : null,
      endDate: appliedFilters.endDate ? format(appliedFilters.endDate, 'yyyy-MM-dd') : null
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: appliedFilters.byAdUnit || appliedFilters.byHours // Skip when byAdUnit OR byHours is true
  })

  const {
    loading: adunitTableLoading,
    error: adunitTableError,
    data: adunitTableData,
    refetch: adunitReportTableRefetch
  } = useQuery(GET_ADUNIT_REPORTTABLES, {
    variables: {
      page: appliedFilters.pageNumber,
      limit: appliedFilters.pageSize,
      site: appliedFilters.selectedSites.length ? appliedFilters.selectedSites : null,
      byDated: appliedFilters.byDated,
      country:
        appliedFilters.selectedCountries.length && appliedFilters.byCountry ? appliedFilters.selectedCountries : null,
      startDate: appliedFilters.startDate ? format(appliedFilters.startDate, 'yyyy-MM-dd') : null,
      endDate: appliedFilters.endDate ? format(appliedFilters.endDate, 'yyyy-MM-dd') : null
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !appliedFilters.byAdUnit || appliedFilters.byHours // Skip when byAdUnit is false OR byHours is true
  })

  const {
    loading: hoursTableLoading,
    error: hoursTableError,
    data: hoursTableData,
    refetch: hoursReportTableRefetch
  } = useQuery(GET_HOURS_REPORTTABLES, {
    variables: {
      page: appliedFilters.pageNumber,
      limit: appliedFilters.pageSize,
      site: appliedFilters.selectedSites.length ? appliedFilters.selectedSites : null,
      startDate: appliedFilters.startDate ? format(appliedFilters.startDate, 'yyyy-MM-dd') : null,
      endDate: appliedFilters.endDate ? format(appliedFilters.endDate, 'yyyy-MM-dd') : null
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !appliedFilters.byHours // Skip when byHours is false
  })

  // Graphql query for sites with debounced search
  const {
    loading: siteLoading,
    error: siteError,
    data: siteDatas,
    refetch: siteRefetch
  } = useQuery(GET_ALL_SITES, {
    variables: {
      page: 1,
      limit: 100,
      search: siteSearchText
    },
    fetchPolicy: 'cache-and-network'
  })

  // Set the appropriate refetch function based on byHours and byAdUnit flags
  siteTableRes = appliedFilters.byHours
    ? hoursReportTableRefetch
    : appliedFilters.byAdUnit
      ? adunitReportTableRefetch
      : reportTableRefetch

  useEffect(() => {
    if (appliedFilters.pageNumber) {
      if (siteTableData?.getReports) {
        const { docs, totalDocs, totals } = siteTableData.getReports

        setData(docs)
        setTotalRow(totalDocs)
        setTotals(totals)
      }
    }
  }, [siteTableData, appliedFilters.pageNumber])

  useEffect(() => {
    if (appliedFilters.pageNumber) {
      if (adunitTableData?.getAdUnitReports) {
        const { docs, totalDocs, totals } = adunitTableData.getAdUnitReports;

        setData(docs)
        setTotalRow(totalDocs)
        setTotals(totals)
      }
    }
  }, [adunitTableData, appliedFilters.pageNumber])

  useEffect(() => {
    if (appliedFilters.pageNumber) {
      if (hoursTableData?.getHoursWiseReports) {
        const { docs, totalDocs, totals } = hoursTableData.getHoursWiseReports;

        setData(docs)
        setTotalRow(totalDocs)
        setTotals(totals)
      }
    }
  }, [hoursTableData, appliedFilters.pageNumber])

  // Update site list when siteDatas changes
  useEffect(() => {
    if (siteDatas?.getAllSites?.data) {
      setSiteList(
        [...new Set(siteDatas.getAllSites.data.map(item => item.site?.trim() ?? ""))]
      );     
    }
  }, [siteDatas])


  console.log(siteList, "siteList")

  // Debounce site search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (siteSearchText !== undefined) {
        siteRefetch({
          page: 1,
          limit: 100,
          search: siteSearchText
        })
      }
    }, 500) // 500ms delay

    return () => clearTimeout(timeoutId)
  }, [siteSearchText, siteRefetch])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const handleSiteChange = (event, newValue) => {
    setSelectedSites(newValue)
  }

  const handleSiteSearchInput = (event, newInputValue) => {
    setSiteSearchText(newInputValue)
  }

  // Handle filter application - now includes selectedCountries, selectedSites, byAdUnit, and byHours
  const handleFilter = useCallback(() => {
    const newFilters = {
      startDate: startDate,
      endDate: endDate,
      selectedSites: selectedSites,
      byDated: byDated,
      byCountry: byCountry,
      byAdUnit: byAdUnit,
      byHours: byHours,
      selectedCountries: selectedCountries, // Include selected countries in applied filters
      pageNumber: 1,
      pageSize: pageSize
    }

    if(selectedSites.length === 0) {
      toast.error("Please select at least one site");

      return;
    }

    setPageNumber(1)
    setAppliedFilters(newFilters)
  }, [startDate, endDate, selectedSites, selectedCountries, pageSize, byDated, byCountry, byAdUnit, byHours]) // Add byHours to dependency array

  // Handle pagination changes
  const handlePageChange = useCallback(newPage => {
    const newPageNumber = newPage + 1
    setPageNumber(newPageNumber)
    setAppliedFilters(prev => ({
      ...prev,
      pageNumber: newPageNumber
    }))
  }, [])

  // Handle page size changes
  const handlePageSizeChange = useCallback(newPageSize => {
    setPageSize(newPageSize)
    setPageNumber(1) // Reset to first page
    setAppliedFilters(prev => ({
      ...prev,
      pageSize: newPageSize,
      pageNumber: 1
    }))
  }, [])

  // Handle date range change
  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  // Handle reset filter - now resets countries, sites, byAdUnit, and byHours too
  const handleResetFilter = useCallback(() => {
    const resetFilters = {
      startDate: today,
      endDate: today,
      selectedSites: [],
      byDated: false,
      byCountry: false,
      byAdUnit: false,
      byHours: false,
      selectedCountries: [],
      pageNumber: 1,
      pageSize: 10
    }

    // Reset local state
    setStartDate(today)
    setEndDate(today)
    setSelectedSites([])
    setByDated(false)
    setByCountry(false)
    setByAdUnit(false)
    setByHours(false)
    setSelectedCountries([])
    setPageNumber(1)
    setPageSize(10)

    // Apply reset filters
    setAppliedFilters(resetFilters)
  }, [today])

  const hasCountryData = data.some(row => row.country)
  const hasHoursData = data.some(row => row.hour)

  // Define columns
  let SiteTableColumn = [
    {
      minWidth: 300,
      field: 'site',
      headerName: 'Site',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.site}
          </Typography>
        </Box>
      )
    },
    ...(hasCountryData
      ? [
          {
            minWidth: 200,
            field: 'country',
            headerName: 'Country',
            renderCell: ({ row }) => (
              <Typography noWrap sx={{ color: 'text.secondary' }}>
                {row?.country || '--'}
              </Typography>
            )
          }
        ]
      : []),
    ...(hasHoursData
      ? [
        {
          minWidth: 200,
          field: 'hour',
          headerName: 'Hour',
          renderCell: ({ row }) => (
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.hour || '--'}
            </Typography>
          )
        }
      ]
      : []),
    ...(appliedFilters.byDated
      ? [
          {
          minWidth: 180,
            field: 'date',
            headerName: 'Date',
            renderCell: ({ row }) => (
              <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                {row?.date ? (
                  isNaN(Date.parse(row.date)) ? (
                    row.date
                  ) : (
                    <Moment format='MMMM Do YYYY'>{row.date}</Moment>
                  )
                ) : (
                  '--'
                )}
              </Typography>
            )
          }
        ]
      : []),
    {
      minWidth: 150,
      field: 'impressions',
      headerName: 'Impressions',
      align: 'right',
      renderCell: ({ row }) => (
        <Typography noWrap align='right' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.impressions}
        </Typography>
      )
    },
    {
      minWidth: 130,
      field: 'ctr',
      headerName: 'CTR',
      align: 'right',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.ctr ? row.ctr.toFixed(2) : '0.00'}%
        </Typography>
      )
    },
    {
      minWidth: 150,
      field: 'ecpm',
      headerName: 'ECPM',
      align: 'right',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          US${row?.ecpm ? row.ecpm.toFixed(2) : '0.00'}
        </Typography>
      )
    },
    {
      minWidth: 220,
      field: 'revenue',
      headerName: 'Revenue',
      align: 'right',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          US${row?.revenue.toFixed(2)}
        </Typography>
      )
    },
    {
      minWidth: 90,
      field: 'clicks',
      headerName: 'Clicks',
      align: 'right',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.clicks}
        </Typography>
      )
    },
    {
      minWidth: 100,
      field: 'matchRate',
      headerName: 'Match Rate',
      align: 'right',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {(row?.matchRate).toFixed(2)}%
        </Typography>
      )
    }
  ]

  // Add actions column for admin users
  if (user?.role === 'admin') {
    SiteTableColumn.push({
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <RowOptions
          userData={row}
          refetch={() => setAppliedFilters(prev => ({ ...prev }))} // Trigger refetch
          For='SiteTable'
        />
      )
    })
  }

  const updateSiteSelection = sites => {
    if (sites) {
      setSelectedSites(sites)
    }
  }

  const updateCountrySelection = countries => {
    if (countries) {
      setSelectedCountries(countries)
    }
  }

  const matrixValues = matrix => {
    const hasDate = matrix.includes('Date')
    setByDated(hasDate)
    const hasCountry = matrix.includes('Country')
    setByCountry(hasCountry)
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

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />

            <TableHeader
              toggle={toggleAddUserDrawer}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              siteTableRefetch={reportTableRefetch}
              For='SiteTable'
            />

            <Divider sx={{ m: '0 !important' }} />

            <Grid container spacing={3} alignItems='center' xs={12}>
              {/* Date Picker */}
              {/* <Grid item xs={4} display="flex" gap={3} alignItems="center" >
                <DatePickerWrapper fullWidth>
                  <DatePicker
                    selectsRange
                    endDate={endDate}
                    selected={startDate}
                    startDate={startDate}
                    id="date-range-picker"
                    onChange={handleOnChange}
                    shouldCloseOnSelect={false}
                    popperPlacement={popperPlacement}
                    customInput={<CustomInput label="Date Range" start={startDate} end={endDate} />}
                  />
                </DatePickerWrapper>
                <FormControlLabel
                  control={<Checkbox checked={byDated} onChange={(e) => setByDated(e.target.checked)} />}
                  label="By Date"
                />
                <FormControlLabel
                  control={<Checkbox checked={byCountry} onChange={(e) => setByCountry(e.target.checked)} />}
                  label="By Country"
                />
              </Grid> */}
              <Grid container alignItems='center' spacing={2} sx={{ margin: '16px', width: 'calc(100% - 32px)' }}>
                <Grid item>
                  <Button
                    onClick={() => setOpen(true)}
                    variant='outlined'
                    startIcon={<Icon icon='tabler:filter' />}
                    size='small'
                  >
                    Add filter
                  </Button>
                </Grid>

                <Grid item xs>
                  <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {appliedFiltersText.map(filter => (
                      <Box
                        key={filter.id}
                        sx={{
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: '#e3f2fd',
                          border: '1px solid #1976d2',
                          borderRadius: '16px',
                          padding: '6px 32px 6px 12px', // Extra padding on right for close button
                          fontSize: '13px',
                          color: '#1976d2',
                          maxWidth: '400px'
                        }}
                      >
                        <Typography
                          variant='body2'
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '13px',
                            color: '#1976d2'
                          }}
                        >
                          {filter.label}
                        </Typography>
                        <IconButton
                          onClick={() => handleRemoveFilter(filter.id)}
                          size='small'
                          sx={{
                            position: 'absolute',
                            right: '4px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#1976d2',
                            padding: '2px',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.1)'
                            }
                          }}
                        >
                          <Icon icon='tabler:x' fontSize={16} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>

              {/* Site Multi Select */}
              {/* <Grid item xs={3}>
                <Autocomplete
                  multiple
                  fullWidth
                  value={selectedSites}
                  options={siteList || []}
                  onChange={handleSiteChange}
                  onInputChange={handleSiteSearchInput}
                  id="site-autocomplete"
                  loading={siteLoading}
                  renderOption={(props, option) =>
                      <li {...props} key={option.id || option}>
                        {option}
                      </li>
                  }
                  getOptionLabel={option => option || ""}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Select Sites"
                      placeholder="Choose sites..."
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {siteLoading ? (
                              <Typography variant="caption">Loading...</Typography>
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid> */}

              {/* Countries Multi Select */}
              {/* <Grid item xs={3}>
                <Autocomplete
                  multiple
                  fullWidth
                  disabled={!byCountry}
                  value={selectedCountries}
                  options={["ALL", "Azerbaijan", "Argentina", "Brazil", "India", "USA"]}
                  onChange={(event, newValue) => {
                    if (newValue.includes("ALL")) {
                      setSelectedCountries(["ALL"]);
                    } else {
                      setSelectedCountries(newValue.filter(v => v !== "ALL"));
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Select Countries"
                      placeholder="Choose..."
                    />
                  )}
                />
              </Grid> */}

              {/* Buttons */}
              {/* <Grid item xs={2} sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleFilter}
                  disabled={siteTableLoading}
                >
                  {siteTableLoading ? "Filtering..." : "Filter"}
                </Button>
                <Button
                  variant="text" 
                  color="primary"
                  startIcon={<Icon icon="system-uicons:reset-alt" />}
                  onClick={handleResetFilter}
                  disabled={siteTableLoading}
                >
                  Reset
                </Button>
              </Grid> */}
            </Grid>

            <Divider sx={{ m: '0 !important' }} />

            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={handlePageChange}
              loading={appliedFilters.byHours ? hoursTableLoading : appliedFilters.byAdUnit ? adunitTableLoading : siteTableLoading}
              rowHeight={62}
              rows={data}
              columns={SiteTableColumn}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={handlePageSizeChange}
              page={pageNumber - 1}
              components={{
                Footer: () => <CustomFooter totals={totals} filteredData={appliedFilters} />
              }}
            />
          </Card>
          <AdvancedMUIStyleFilter
            siteList={siteList}
            setSelectedCountries={setSelectedCountries}
            setSelectedSites={setSelectedSites}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setAppliedFiltersText={setAppliedFiltersText}
            handleFilter={handleFilter}
            siteTableLoading={appliedFilters.byHours ? hoursTableLoading : appliedFilters.byAdUnit ? adunitTableLoading : siteTableLoading}
            handleResetFilter={handleResetFilter}
            open={open}
            setOpen={setOpen}
            setByDated={setByDated}
            setByCountry={setByCountry}
            setByAdUnit={setByAdUnit}
            setByHours={setByHours}
          />
          {addUserOpen && (
            <AddSiteTable
              open={addUserOpen}
              toggle={toggleAddUserDrawer}
              siteTableRefetch={() => setAppliedFilters(prev => ({ ...prev }))} // Trigger refetch
            />
          )}
        </Grid>
      </Grid>
    </>
  )
}

export { siteTableRes }

SiteTable.acl = {
  action: 'read',
  subject: 'reporttable-p'
}

export default SiteTable
