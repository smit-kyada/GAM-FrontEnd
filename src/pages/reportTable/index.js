import { useQuery } from '@apollo/client'
import { Box, Button, Typography, Select, MenuItem, FormControl } from '@mui/material'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { DataGrid, GridFooterContainer, GridPagination } from '@mui/x-data-grid'
import { useEffect, useState, useCallback } from 'react'
import Moment from 'react-moment'
import format from 'date-fns/format'
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

var siteTableRes

function CustomFooter({ totals, filteredData, selectedAdExchange }) {
  return (
    <>
      <GridFooterContainer
        sx={{
          fontWeight: 'bold',
          overflow: 'hidden',
          width: '100%',
          minWidth: 'max-content' // Ensure footer content doesn't shrink
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            minWidth: 'max-content' // Match the table content width
          }}
        >
          <Box sx={{ minWidth: 250, flexShrink: 0 }}>
            <Typography
              noWrap
              sx={{ color: 'text.secondary', fontSize: '16px', paddingLeft: '20px' }}
            >
              TOTAL
            </Typography>
          </Box>

          {/* Country column (if enabled) */}

          {filteredData?.selectedCountries?.length > 0 && filteredData?.byCountry && (
            <Box sx={{ minWidth: 180, px: 4, flexShrink: 0 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}
          {filteredData?.byHours && (
            <Box sx={{ minWidth: 200, px: 4, flexShrink: 0 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}
          {filteredData?.byAdUnit && (
            <Box sx={{ minWidth: 300, px: 4, flexShrink: 0 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}
          {filteredData?.byDated && (
            <Box sx={{ minWidth: 120, px: 4, flexShrink: 0 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}

          {/* Render filtered Ad-Exchange columns */}
          {(() => {
            const allAdExchangeFooterColumns = [
              {
                name: 'Impressions',
                minWidth: 150,
                value: totals?.impressions ?? 0,
                format: (val) => val
              },
              {
                name: 'CTR',
                minWidth: 130,
                value: totals?.ctr ?? 0,
                format: (val) => `${val.toFixed(2)}%`
              },
              {
                name: 'ECPM',
                minWidth: 150,
                value: totals?.ecpm ?? 0,
                format: (val) => `US$${val.toFixed(2)}`
              },
              {
                name: 'Revenue',
                minWidth: 150,
                value: totals?.revenue ?? 0,
                format: (val) => `US$${val.toFixed(2)}`
              },
              {
                name: 'Clicks',
                minWidth: 100,
                value: totals?.clicks ?? 0,
                format: (val) => val
              },
              {
                name: 'Match Rate',
                minWidth: 100,
                value: totals?.matchRate ?? 0,
                format: (val) => `${val.toFixed(2)}%`
              }
            ]

            const getAdExchangeFooterColumns = () => {
              if (!selectedAdExchange || selectedAdExchange.length === 0) {
                return allAdExchangeFooterColumns // Show all if none selected
              }

              return allAdExchangeFooterColumns.filter(column => {
                return selectedAdExchange.includes(column.name)
              })
            }

            return getAdExchangeFooterColumns().map((column, index) => (
              <Box key={index} sx={{ minWidth: column.minWidth, textAlign: 'right', px: 4, flexShrink: 0 }}>
                <Typography noWrap>{column.format(column.value)}</Typography>
              </Box>
            ))
          })()}
          <Box sx={{ minWidth: 100, px: 4, flexShrink: 0 }}>
            <Typography noWrap>—</Typography>
          </Box>
        </Box>
      </GridFooterContainer>
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '400px' }}>
          <GridPagination />
        </div>
      </Box> */}
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
  const [tempSelections, setTempSelections] = useState({
    'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate']
  });

  // Applied selections state - only updates when Apply button is clicked
  const [appliedSelections, setAppliedSelections] = useState({
    'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate']
  });

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

    // Reset tempSelections to default (all Ad-Exchange values selected)
    setTempSelections({
      'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate']
    })

    // Reset appliedSelections to default (all Ad-Exchange values selected)
    setAppliedSelections({
      'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate']
    })

    // Apply reset filters
    setAppliedFilters(resetFilters)
  }, [today])

  // console.log(appliedSelections, "appliedSelections") asdkfk

  const hasCountryData = data.some(row => row.country)
  const hasHoursData = data.some(row => row.hour)

  // Get selected Ad-Exchange values from tempSelections
  const selectedAdExchange = appliedSelections?.['Ad-Exchange'] || []

  // Define all possible Ad-Exchange columns
  const allAdExchangeColumns = [
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
      minWidth: 150,
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
      minWidth: 100,
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

  // Filter Ad-Exchange columns based on selection
  const getAdExchangeColumns = () => {
    if (selectedAdExchange.length === 0) {
      return allAdExchangeColumns // Show all if none selected
    }

    return allAdExchangeColumns.filter(column => {
      const columnName = column.headerName
      return selectedAdExchange.includes(columnName)
    })
  }

  // Define columns
  let SiteTableColumn = [
    {
      minWidth: 250,
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
          minWidth: 180,
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
    ...(appliedFilters.byAdUnit
      ? [
        {
          minWidth: 300,
          field: 'adUnit',
          headerName: 'Ad Unit',
          renderCell: ({ row }) => (
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.id
                ? row.id.split('-').slice(4).join('-')
                : '--'}
            </Typography>
          )
        }
      ]
      : []),
    ...(appliedFilters.byDated
      ? [
          {
          minWidth: 120,
            field: 'date',
            headerName: 'Date',
            renderCell: ({ row }) => (
              <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                {row?.date ? (
                  isNaN(Date.parse(row.date)) ? (
                    row.date
                  ) : (
                      <Moment format='MM/DD/yyyy'>{row.date}</Moment>
                  )
                ) : (
                  '--'
                )}
              </Typography>
            )
          }
        ]
      : []),
    // Add filtered Ad-Exchange columns
    ...getAdExchangeColumns()
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
                          backgroundColor: 'secondary.paper',
                          border: '1px solid',
                          borderColor: 'secondary.main',
                          borderRadius: '16px',
                          padding: '6px 12px 6px 12px', 
                          fontSize: '13px',
                          color: 'secondary.light',
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
                          }}
                        >
                          {filter.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ m: '0 !important' }} />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                width: '100%'
              }}
            >
              {/* Table Content with Custom Footer */}
              <Box
                sx={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  width: '100%',
                  '&::-webkit-scrollbar': {
                    height: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.5)'
                    }
                  }
                }}
              >
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
                    Footer: () => <CustomFooter totals={totals} filteredData={appliedFilters} selectedAdExchange={selectedAdExchange} />
                  }}
                  sx={{
                    minWidth: 'max-content', // Ensure DataGrid doesn't shrink below content width
                    '& .MuiDataGrid-main': {
                      overflow: 'visible !important'
                    },
                    '& .MuiDataGrid-virtualScroller': {
                      overflow: 'visible !important'
                    },
                    '& .MuiDataGrid-footerContainer': {
                      overflow: 'visible !important',
                      borderTop: '1px solid',
                      borderColor: 'divider'
                    },
                    '& .MuiDataGrid-pagination': {
                      display: 'none !important' // Hide default pagination
                    }
                  }}
                />
              </Box>

              {/* Separate Pagination - Matching MUI DataGrid Design */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  padding: '8px 16px',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  minHeight: '52px' // Match DataGrid pagination height
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 400
                      }}
                    >
                      Rows per page:
                    </Typography>
                    <FormControl size="small" sx={{ maxWidth: 70 }}>
                      <Select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(e.target.value)}
                        variant="standard"
                        disableUnderline
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 400,
                          color: 'text.secondary',
                          '& .MuiSelect-select': {
                            padding: '0 8px !important',
                            paddingRight: '24px !important',
                            minWidth: 'auto !important'
                          },
                          '& .MuiSelect-select.MuiInputBase-input': {
                            minWidth: 'auto !important'
                          },
                          '& .MuiSelect-select.MuiInputBase-input.MuiInput-input': {
                            minWidth: 'auto !important'
                          },
                          '& .MuiSelect-select.MuiInputBase-input.MuiInput-input:focus': {
                            backgroundColor: 'transparent !important',
                            borderRadius: '0 !important'
                          },
                          '& .MuiSelect-icon': {
                            color: 'text.secondary',
                            fontSize: '1rem'
                          }
                        }}
                      >
                        {[10, 25, 50, 100].map((size) => (
                          <MenuItem key={size} value={size} sx={{ fontSize: '0.875rem' }}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      fontWeight: 400
                    }}
                  >
                    {`${(pageNumber - 1) * pageSize + 1}-${Math.min(pageNumber * pageSize, totalRow)} of ${totalRow}`}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      size="small"
                      onClick={() => handlePageChange(pageNumber - 2)}
                      disabled={pageNumber <= 1}
                      sx={{
                        minWidth: 'auto',
                        padding: '8px',
                        color: pageNumber <= 1 ? 'action.disabled' : 'action.active',
                        '&:hover': {
                          backgroundColor: pageNumber <= 1 ? 'transparent' : 'action.hover'
                        },
                        '&:disabled': {
                          color: 'action.disabled'
                        }
                      }}
                    >
                      <Icon icon="icon-park-outline:left" width="20" height="20" />
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={pageNumber * pageSize >= totalRow}
                      sx={{
                        minWidth: 'auto',
                        padding: '8px',
                        color: pageNumber * pageSize >= totalRow ? 'action.disabled' : 'action.active',
                        '&:hover': {
                          backgroundColor: pageNumber * pageSize >= totalRow ? 'transparent' : 'action.hover'
                        },
                        '&:disabled': {
                          color: 'action.disabled'
                        }
                      }}
                    >
                      <Icon icon="icon-park-outline:right" width="20" height="20" />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
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
            tempSelections={tempSelections}
            setTempSelections={setTempSelections}
            appliedSelections={appliedSelections}
            setAppliedSelections={setAppliedSelections}
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
