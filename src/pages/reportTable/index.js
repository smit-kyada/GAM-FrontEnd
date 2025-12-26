import { useQuery, useMutation } from '@apollo/client'
import { Box, Button, Typography, Select, MenuItem, FormControl, TextField, InputAdornment, IconButton, Popover, List, ListItem, ListItemButton, ListItemText, Tooltip, Dialog, DialogTitle, DialogContent, Checkbox, Menu } from '@mui/material'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { DataGrid, GridFooterContainer } from '@mui/x-data-grid'
import { useEffect, useState, useCallback, useMemo, useRef, forwardRef } from 'react'
import Moment from 'react-moment'
import format from 'date-fns/format'
import { startOfDay, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import RowOptions from 'src/components/commonComponent/RowOptions'
import { GET_ADUNIT_REPORTTABLES, GET_ALL_REPORTTABLES, GET_HOURS_REPORTTABLES } from 'src/graphql/query/reportTable'
import { DOWNLOAD_HOURS_WISE_CSV, DOWNLOAD_AD_UNIT_REPORT_CSV, DOWNLOAD_DAILY_REPORT_CSV } from 'src/graphql/mutation/reportTable'
import { GET_ALL_SITES } from 'src/graphql/query/site'
import { useAuth } from 'src/hooks/useAuth'
import AddSiteTable from 'src/views/siteTable/list/AddSiteTable'
import TableHeader from 'src/views/siteTable/list/TableHeader'
import { useTheme } from '@emotion/react'
import { Icon } from '@iconify/react'
import AdvancedMUIStyleFilter from 'src/components/customFilter'
import toast from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend } from 'recharts'
import { AppsIcon, CloseIcon, DragIndicatorIcon, EditIcon, FilterAltIcon, InfoIcon, MoreVertIcon, PlusIcon, QuickReportIcon, SearchIcon } from 'src/components/icons/Icons'

var siteTableRes

function CustomFooter({ totals, filteredData, selectedAdExchange }) {
  const theme = useTheme()

  const footerCellSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '52px',
    padding: '12px 16px',
    borderRight: `1px solid ${theme.palette.divider}`,
    flexShrink: 0
  }

  return (
    <>
      <GridFooterContainer
        sx={{
          fontWeight: 'bold',
          overflow: 'hidden',
          width: '100%',
          minWidth: 'max-content',
          borderTop: `1px solid ${theme.palette.divider} !important`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme?.palette?.mode === 'dark' ? '#111111' : '#FFFFFF'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            minWidth: 'max-content'
          }}
        >
          <Box
            sx={{
              ...footerCellSx,
              minWidth: 250,
              // borderLeft: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography
              noWrap
              sx={{ color: 'text.secondary', fontSize: '16px' }}
            >
              TOTAL
            </Typography>
          </Box>

          {/* Country column (if enabled) */}

          {filteredData?.selectedCountries?.length > 0 && filteredData?.byCountry && (
            <Box sx={{ ...footerCellSx, minWidth: 180 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}
          {filteredData?.byHours && (
            <Box sx={{ ...footerCellSx, minWidth: 200 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}
          {filteredData?.byAdUnit && (
            <Box sx={{ ...footerCellSx, minWidth: 300 }}>
              <Typography noWrap>—</Typography>
            </Box>
          )}
          {filteredData?.byDated && (
            <Box sx={{ ...footerCellSx, minWidth: 125, borderRight: `none` }}>
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
                format: (val) => val?.toLocaleString() || '0'
              },
              {
                name: 'CTR',
                minWidth: 130,
                value: (() => {
                  const totalImpressions = totals?.impressions || 0
                  const totalClicks = totals?.clicks || 0
                  return totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
                })(),
                format: (val) => `${(val || 0).toFixed(2)}%`
              },
              {
                name: 'ECPM',
                minWidth: 150,
                value: totals?.ecpm ?? 0,
                format: (val) => `US$${(val || 0).toFixed(2)}`
              },
              {
                name: 'Revenue',
                minWidth: 150,
                value: totals?.revenue ?? 0,
                format: (val) => `US$${(val || 0).toFixed(2)}`
              },
              {
                name: 'Clicks',
                minWidth: 120,
                value: totals?.clicks ?? 0,
                format: (val) => val?.toLocaleString() || '0'
              },
              {
                name: 'Match Rate',
                minWidth: 120,
                value: totals?.matchRate ?? 0,
                format: (val) => `${(val || 0).toFixed(2)}%`
              },
              {
                name: 'Cost Per Click',
                minWidth: 170,
                value: totals?.costPerClick ?? 0,
                format: (val) => `US$${(val || 0).toFixed(2)}`
              },
              {
                name: 'Total Requests',
                minWidth: 170,
                value: totals?.totalRequests ?? 0,
                format: (val) => val
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
              <Box
                key={index}
                sx={{
                  ...footerCellSx,
                  minWidth: column.minWidth,
                  justifyContent: 'flex-end'
                }}
              >
                <Typography noWrap sx={{ fontWeight: 'bold', width: '100%', textAlign: 'right' }}>
                  {column.format(column.value)}
                </Typography>
              </Box>
            ))
          })()}
          <Box sx={{ ...footerCellSx, minWidth: 100, borderRight: `none !important` }}>
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
  const today = useMemo(() => new Date(), [])

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
  const [byDated, setByDated] = useState(true)
  const [byCountry, setByCountry] = useState(false)
  const [byAdUnit, setByAdUnit] = useState(false)
  const [byHours, setByHours] = useState(false)
  const [tempSelections, setTempSelections] = useState({
    'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate', 'Cost Per Click', 'Total Requests']
  });

  // Applied selections state - only updates when Apply button is clicked
  const [appliedSelections, setAppliedSelections] = useState({
    'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate', 'Cost Per Click', 'Total Requests']
  });

  const [appliedFiltersText, setAppliedFiltersText] = useState([]);

  const [open, setOpen] = useState(false);
  const [metricsModalOpen, setMetricsModalOpen] = useState(false);
  const [metricsSearchText, setMetricsSearchText] = useState('');
  const [tempSelectedMetrics, setTempSelectedMetrics] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Ad Exchange metric selection state - now synced with appliedSelections
  // const [selectedMetrics, setSelectedMetrics] = useState(['Clicks', 'Impressions', 'Page views', 'Impression RPM']);

  // Date filter selection state
  const [selectedDateRange, setSelectedDateRange] = useState('today');

  // Custom date picker popover state
  const [customDatePickerOpen, setCustomDatePickerOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState('custom');
  const [tempStartDate, setTempStartDate] = useState(today);
  const [tempEndDate, setTempEndDate] = useState(today);

  // Breakdowns dropdown state
  const [breakdownsDropdownOpen, setBreakdownsDropdownOpen] = useState(false);
  const [breakdownsAnchorEl, setBreakdownsAnchorEl] = useState(null);
  const [breakdownsSearchText, setBreakdownsSearchText] = useState('');
  const [selectedBreakdowns, setSelectedBreakdowns] = useState(['Date']);

  // Search/Filter state
  const [searchFilterText, setSearchFilterText] = useState('');
  const [searchFilterDropdownOpen, setSearchFilterDropdownOpen] = useState(false);
  const [searchFilterAnchorEl, setSearchFilterAnchorEl] = useState(null);
  const searchFieldRef = useRef(null);

  // Site selection popup state
  const [siteSelectionOpen, setSiteSelectionOpen] = useState(false);
  const [siteSelectionSearchText, setSiteSelectionSearchText] = useState('');
  const [siteSelectionAnchorEl, setSiteSelectionAnchorEl] = useState(null);

  // Country selection popup state
  const [countrySelectionOpen, setCountrySelectionOpen] = useState(false);
  const [countrySelectionSearchText, setCountrySelectionSearchText] = useState('');
  const [countrySelectionAnchorEl, setCountrySelectionAnchorEl] = useState(null);

  // Header menu state
  const [headerMenuAnchorEl, setHeaderMenuAnchorEl] = useState(null);
  const headerMenuOpen = Boolean(headerMenuAnchorEl);

  // Sidebar state
  const [reportSearchText, setReportSearchText] = useState('');
  const [selectedReportId, setSelectedReportId] = useState('top-pages');
  const [reportMenuAnchorEl, setReportMenuAnchorEl] = useState(null);
  const reportMenuOpen = Boolean(reportMenuAnchorEl);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Report list data
  const reportsList = [
    { id: 'top-pages', title: 'Top pages', description: 'Earnings for your popular pages', icon: 'grid', isUnsaved: true },
    { id: 'entire-account-day', title: 'Entire account by day', description: 'Estimated earnings by Date', icon: 'lightning' },
    { id: 'demo', title: 'demo', description: 'Clicks by Platform and Conte...', icon: 'lightning' },
    // { id: 'sites', title: 'Sites', description: 'Performance of each site', icon: 'lightning' },
    // { id: 'content-platform', title: 'Content platform', description: 'Estimated earnings by Platfo...', icon: 'lightning' },
    // { id: 'countries', title: 'Countries', description: 'How ads perform by country', icon: 'lightning' },
    // { id: 'ad-units', title: 'Ad units', description: 'Estimated earnings by Ad unit', icon: 'lightning' },
    // { id: 'platforms', title: 'Platforms', description: 'Estimated earnings by Platfo...', icon: 'lightning' },
    // { id: 'entire-account-week', title: 'Entire account by w...', description: 'Estimated earnings by Week', icon: 'lightning' },
    // { id: 'entire-account-month', title: 'Entire account by m...', description: 'Estimated earnings by Month', icon: 'lightning' },
  ];

  // Applied filters state to track when to make API calls
  const [appliedFilters, setAppliedFilters] = useState({
    startDate: today,
    endDate: today,
    selectedSites: [],
    selectedCountries: [],
    pageNumber: 1,
    pageSize: 10,
    byDated: true,
    byCountry: false,
    byDate: false,
    byAdUnit: false,
    byHours: false,
  })

  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // Breakdown chip colors - reusable variables
  const breakdownChipColors = {
    backgroundColor: theme.palette.mode === 'light' ? '#E8F0FE' : 'rgba(26, 115, 232, 0.15)',
    textColor: theme.palette.mode === 'light' ? '#1A73E8' : '#8AB4F8',
    hoverBackgroundColor: theme.palette.mode === 'light' ? 'rgba(26, 115, 232, 0.1)' : 'rgba(138, 180, 248, 0.2)'
  }

  // Custom Tooltip Component for Recharts with theme support
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '10px',
            padding: theme.spacing(1.5),
            boxShadow: theme.shadows[3]
          }}
        >
          <Typography variant='body2' sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography
              key={index}
              component="div"
              variant='body2'
              sx={{
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  borderRadius: '2px'
                }}
              />
              {`${entry.name}: ${entry.value?.toLocaleString()}`}
            </Typography>
          ))}
        </Box>
      )
    }
    return null
  }

  // GraphQL mutations for CSV download
  const [downloadHoursWiseCSV] = useMutation(DOWNLOAD_HOURS_WISE_CSV)
  const [downloadAdUnitReportCSV] = useMutation(DOWNLOAD_AD_UNIT_REPORT_CSV)
  const [downloadDailyReportCSV] = useMutation(DOWNLOAD_DAILY_REPORT_CSV)

  // Helper function to check if error is an abort error
  const isAbortError = (error) => {
    if (!error) return false
    return (
      error.name === 'AbortError' ||
      (error.message && (
        error.message.includes('aborted') ||
        error.message.includes('signal is aborted') ||
        error.message.includes('The user aborted a request')
      )) ||
      (error.networkError && (
        error.networkError.name === 'AbortError' ||
        (error.networkError.message && error.networkError.message.includes('aborted'))
      ))
    )
  }

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
      site: appliedFilters.selectedSites.length ? appliedFilters.selectedSites : siteList,
      byDated: appliedFilters.byDated,
      country: appliedFilters.selectedCountries.length > 0 ? appliedFilters.selectedCountries : null,
      startDate: appliedFilters.startDate ? format(appliedFilters.startDate, 'yyyy-MM-dd') : null,
      endDate: appliedFilters.endDate ? format(appliedFilters.endDate, 'yyyy-MM-dd') : null
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: appliedFilters.byAdUnit || appliedFilters.byHours, // Skip when byAdUnit OR byHours is true
    onError: (error) => {
      // Suppress abort errors - they're expected when queries are cancelled
      if (!isAbortError(error)) {
        console.error('GraphQL Error:', error)
      }
    }
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
      site: appliedFilters.selectedSites.length ? appliedFilters.selectedSites : siteList,
      byDated: appliedFilters.byDated,
      country: appliedFilters.selectedCountries.length > 0 ? appliedFilters.selectedCountries : null,
      startDate: appliedFilters.startDate ? format(appliedFilters.startDate, 'yyyy-MM-dd') : null,
      endDate: appliedFilters.endDate ? format(appliedFilters.endDate, 'yyyy-MM-dd') : null
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !appliedFilters.byAdUnit || appliedFilters.byHours, // Skip when byAdUnit is false OR byHours is true
    onError: (error) => {
      // Suppress abort errors - they're expected when queries are cancelled
      if (!isAbortError(error)) {
        console.error('GraphQL Error:', error)
      }
    }
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
      site: appliedFilters.selectedSites.length ? appliedFilters.selectedSites : siteList,
      startDate: appliedFilters.startDate ? format(appliedFilters.startDate, 'yyyy-MM-dd') : null,
      endDate: appliedFilters.endDate ? format(appliedFilters.endDate, 'yyyy-MM-dd') : null
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: !appliedFilters.byHours, // Skip when byHours is false
    onError: (error) => {
      // Suppress abort errors - they're expected when queries are cancelled
      if (!isAbortError(error)) {
        console.error('GraphQL Error:', error)
      }
    }
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
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      // Suppress abort errors - they're expected when queries are cancelled
      if (!isAbortError(error)) {
        console.error('GraphQL Error:', error)
      }
    }
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

        // Add unique IDs to prevent duplicate key warnings
        const dataWithUniqueIds = docs.map((item, index) => ({
          ...item,
          id: `${index}-${item.id}`
        }))

        setData(dataWithUniqueIds)
        setTotalRow(totalDocs)
        setTotals(totals)
      }
    }
  }, [siteTableData, appliedFilters.pageNumber])

  useEffect(() => {
    if (appliedFilters.pageNumber) {
      if (adunitTableData?.getAdUnitReports) {
        const { docs, totalDocs, totals } = adunitTableData.getAdUnitReports;

        // Add unique IDs to prevent duplicate key warnings
        const dataWithUniqueIds = docs.map((item, index) => ({
          ...item,
          id: `${index}-${item.id}`
        }))

        setData(dataWithUniqueIds)
        setTotalRow(totalDocs)
        setTotals(totals)
      }
    }
  }, [adunitTableData, appliedFilters.pageNumber])

  useEffect(() => {
    if (appliedFilters.pageNumber) {
      if (hoursTableData?.getHoursWiseReports) {
        const { docs, totalDocs, totals } = hoursTableData.getHoursWiseReports;

        // Add unique IDs to prevent duplicate key warnings
        const dataWithUniqueIds = docs.map((item, index) => ({
          ...item,
          id: `${index}-${item.id}`
        }))

        setData(dataWithUniqueIds)
        setTotalRow(totalDocs)
        setTotals(totals)
      }
    }
  }, [hoursTableData, appliedFilters.pageNumber])

  // Update site list when siteDatas changes
  useEffect(() => {
    if (siteDatas?.getAllSites?.data) {
      const newSiteList = [...new Set(siteDatas.getAllSites.data.map(item => item.site?.trim() ?? ""))];
      setSiteList(newSiteList);

      // Set all sites as selected by default if no sites are currently selected
      if (selectedSites.length === 0) {
        setSelectedSites(newSiteList);
      }
    }
  }, [siteDatas]) // Removed selectedSites.length dependency to prevent infinite loop

  // Filter out abort errors from error states
  useEffect(() => {
    if (siteTableError && isAbortError(siteTableError)) {
      // Abort errors are expected and can be ignored
    }
  }, [siteTableError])

  useEffect(() => {
    if (adunitTableError && isAbortError(adunitTableError)) {
      // Abort errors are expected and can be ignored
    }
  }, [adunitTableError])

  useEffect(() => {
    if (hoursTableError && isAbortError(hoursTableError)) {
      // Abort errors are expected and can be ignored
    }
  }, [hoursTableError])

  useEffect(() => {
    if (siteError && isAbortError(siteError)) {
      // Abort errors are expected and can be ignored
    }
  }, [siteError])

  // Note: appliedFilters.selectedSites is now only updated when Apply button is clicked
  // This prevents automatic filtering when sites are just selected in the popover

  // Clear country selection when byHours is true
  useEffect(() => {
    if (byHours) {
      setSelectedCountries([]);
      setAppliedFilters(prev => ({
        ...prev,
        selectedCountries: []
      }));
      // Remove country filters from appliedFiltersText
      setAppliedFiltersText(prev => prev.filter(filter =>
        !filter.label?.toLowerCase().includes('country')
      ));
    }
  }, [byHours])

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

    // Only show error if this is not the initial render and no sites are selected
    // Check if appliedFilters already has selectedSites (meaning this is not initial render)
    const isInitialRender = !appliedFilters.selectedSites || appliedFilters.selectedSites.length === 0;

    if (selectedSites.length === 0 && !isInitialRender) {
      toast.error("Please select at least one site");
      return;
    }

    setPageNumber(1)
    setAppliedFilters(newFilters)
  }, [startDate, endDate, pageSize, byDated, byCountry, byAdUnit, byHours, appliedFilters.selectedSites]) // Added appliedFilters.selectedSites to check initial state

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
    setTempStartDate(start)
    setTempEndDate(end)
  }

  // Handle date range selection from filter buttons
  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    let start, end;

    switch (range) {
      case 'today':
        start = today;
        end = today;
        break;
      case 'last7days':
        start = subDays(yesterday, 6);
        end = yesterday;
        break;
      case 'last30days':
        start = subDays(yesterday, 29);
        end = yesterday;
        break;
      case 'thismonth':
        start = startOfMonth(today);
        end = today;
        break;
      case 'lastmonth':
        const lastMonth = subMonths(today, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      case 'custom':
        // Open custom date picker popover
        setTempStartDate(startDate);
        setTempEndDate(endDate);
        setCustomDatePickerOpen(true);
        return;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);

    // Update tempSelections to sync with custom filter
    const formattedStart = format(start, 'MM/dd/yyyy');
    const formattedEnd = format(end, 'MM/dd/yyyy');
    const dateRange = `${formattedStart} to ${formattedEnd}`;

    setTempSelections(prev => ({
      ...prev,
      'Date': [dateRange]
      // Preserve existing Dimension selections - don't override them
    }));

    // Ensure breakdown states are preserved when date changes
    // This prevents the country column from disappearing
    if (appliedFilters.byCountry) {
      setAppliedFilters(prev => ({
        ...prev,
        startDate: start,
        endDate: end,
        byCountry: true // Explicitly preserve byCountry state
      }));
    }
  }

  // Handle custom date picker preset selection
  const handleCustomPresetSelection = (preset) => {
    const today = new Date();
    let start, end;

    switch (preset) {
      case 'today':
        start = new Date(today);
        end = new Date(today);
        break;
      case 'yesterday':
        start = new Date(today);
        start.setDate(today.getDate() - 1);
        end = new Date(today);
        end.setDate(today.getDate() - 1);
        break;
      case 'last7days':
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        end = new Date(today);
        break;
      case 'last30days':
        start = new Date(today);
        start.setDate(today.getDate() - 29);
        end = new Date(today);
        break;
      case 'thismonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today);
        break;
      case 'lastmonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'last3years':
        start = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
        end = new Date(today);
        break;
      default:
        return;
    }

    setTempStartDate(start);
    setTempEndDate(end);
    setSelectedPreset(preset);
  }

  // Handle custom date picker apply
  const handleCustomDateApply = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setSelectedDateRange('custom');
      setCustomDatePickerOpen(false);
      setPopoverAnchorEl(null);

      // Update tempSelections to sync with custom filter
      const formattedStart = format(tempStartDate, 'MM/dd/yyyy');
      const formattedEnd = format(tempEndDate, 'MM/dd/yyyy');
      const dateRange = `${formattedStart} to ${formattedEnd}`;

      setTempSelections(prev => ({
        ...prev,
        'Date': [dateRange]
      }));

      // Ensure breakdown states are preserved when custom date is applied
      if (appliedFilters.byCountry) {
        setAppliedFilters(prev => ({
          ...prev,
          startDate: tempStartDate,
          endDate: tempEndDate,
          byCountry: true // Explicitly preserve byCountry state
        }));
      }
    }
  }

  // Handle custom date picker cancel
  const handleCustomDateCancel = () => {
    setCustomDatePickerOpen(false);
    setPopoverAnchorEl(null);
    setSelectedPreset('custom'); // Reset to custom when canceling
  }

  // Handle breakdowns dropdown
  const handleBreakdownsDropdownOpen = (event) => {
    setBreakdownsAnchorEl(event.currentTarget);
    setBreakdownsDropdownOpen(true);
  };

  const handleBreakdownsDropdownClose = () => {
    setBreakdownsDropdownOpen(false);
    setBreakdownsAnchorEl(null);
    setBreakdownsSearchText('');
  };

  // Handle header menu
  const handleHeaderMenuOpen = (event) => {
    setHeaderMenuAnchorEl(event.currentTarget);
  };

  const handleHeaderMenuClose = () => {
    setHeaderMenuAnchorEl(null);
  };

  // Handle save button
  const handleSave = () => {
    // Add save functionality here
    toast.success('Report saved successfully');
  };

  // Handle report menu
  const handleReportMenuOpen = (event, reportId) => {
    event.stopPropagation();
    setReportMenuAnchorEl(event.currentTarget);
  };

  const handleReportMenuClose = () => {
    setReportMenuAnchorEl(null);
  };

  // Filter reports based on search
  const filteredReports = reportsList.filter(report =>
    report.title.toLowerCase().includes(reportSearchText.toLowerCase()) ||
    report.description.toLowerCase().includes(reportSearchText.toLowerCase())
  );

  // Breakdowns filter options
  const breakdownsOptions = [
    'Date',
    'Country',
    'Ad Units',
    'Hours'
  ];

  // Filter breakdowns options based on search
  const filteredBreakdownsOptions = breakdownsOptions.filter(option =>
    option.toLowerCase().includes(breakdownsSearchText.toLowerCase())
  );

  // Handle breakdown option selection
  const handleBreakdownOptionSelect = (option) => {
    setSelectedBreakdowns(prev => {
      let newBreakdowns;
      if (prev.includes(option)) {
        // Prevent deselecting Date if it's the last remaining breakdown
        if (option === 'Date' && prev.length <= 1) {
          return prev; // Don't allow deselecting the last breakdown (Date)
        }
        // Remove from selection
        newBreakdowns = prev.filter(item => item !== option);
      } else {
        // Add to selection with mutual exclusion logic
        newBreakdowns = [...prev];

        // Define mutually exclusive groups
        const mutuallyExclusiveGroups = {
          'Hours': ['Ad Units', 'Country'],
          'Ad Units': ['Hours'],
          'Country': ['Hours']
        };

        // If the option being selected is in a mutually exclusive group
        if (mutuallyExclusiveGroups[option]) {
          // Remove all values from the mutually exclusive group
          newBreakdowns = newBreakdowns.filter(item => !mutuallyExclusiveGroups[option].includes(item));
        }

        // Add the new option
        newBreakdowns.push(option);
      }

      // Update the corresponding breakdown states
      setByDated(newBreakdowns.includes('Date'));
      setByCountry(newBreakdowns.includes('Country'));
      setByAdUnit(newBreakdowns.includes('Ad Units'));
      setByHours(newBreakdowns.includes('Hours'));

      // Update appliedFilters with breakdown states immediately
      setAppliedFilters(prevFilters => ({
        ...prevFilters,
        byDated: newBreakdowns.includes('Date'),
        byCountry: newBreakdowns.includes('Country'),
        byAdUnit: newBreakdowns.includes('Ad Units'),
        byHours: newBreakdowns.includes('Hours')
      }));

      // If Country is selected, add all countries to the search bar filter
      if (newBreakdowns.includes('Country') && !prev.includes('Country')) {
        // Add all countries to the applied filters
        setAppliedFilters(prevFilters => ({
          ...prevFilters,
          selectedCountries: countryValues,
          byCountry: true
        }));
      } else if (!newBreakdowns.includes('Country') && prev.includes('Country')) {
        // Remove all countries from the applied filters when Country breakdown is deselected
        setAppliedFilters(prevFilters => ({
          ...prevFilters,
          selectedCountries: [],
          byCountry: false
        }));
      }

      // Update tempSelections to sync with custom filter
      const dimensionSelections = [];
      if (newBreakdowns.includes('Date')) dimensionSelections.push('Date');
      if (newBreakdowns.includes('Country')) dimensionSelections.push('Country');
      if (newBreakdowns.includes('Ad Units')) dimensionSelections.push('adUnits');
      if (newBreakdowns.includes('Hours')) dimensionSelections.push('hours');

      setTempSelections(prev => ({
        ...prev,
        'Dimension': dimensionSelections
      }));

      // Also update appliedSelections to preserve Ad-Exchange selections
      setAppliedSelections(prev => ({
        ...prev, // Keep existing selections (like Ad-Exchange from buttons)
        'Dimension': dimensionSelections
      }));

      handleBreakdownsDropdownClose();

      return newBreakdowns;
    });
  };

  // Sync selectedBreakdowns with breakdown states (for custom filter integration)
  useEffect(() => {
    const breakdowns = [];
    if (byDated) breakdowns.push('Date');
    if (byCountry) breakdowns.push('Country');
    if (byAdUnit) breakdowns.push('Ad Units');
    if (byHours) breakdowns.push('Hours');

    setSelectedBreakdowns(breakdowns);
  }, [byDated, byCountry, byAdUnit, byHours]);

  // Sync breakdown states with appliedSelections Dimension data
  useEffect(() => {
    const dimensionSelections = appliedSelections['Dimension'] || [];

    // Apply mutual exclusion logic when syncing from custom filter
    let processedSelections = [...dimensionSelections];

    // If Hours is selected, remove adUnits and Country
    if (processedSelections.includes('hours')) {
      processedSelections = processedSelections.filter(item => item !== 'adUnits' && item !== 'Country');
    }
    // If adUnits or Country is selected, remove hours
    else if (processedSelections.includes('adUnits') || processedSelections.includes('Country')) {
      processedSelections = processedSelections.filter(item => item !== 'hours');
    }

    setByDated(processedSelections.includes('Date'));
    setByCountry(processedSelections.includes('Country'));
    setByAdUnit(processedSelections.includes('adUnits'));
    setByHours(processedSelections.includes('hours'));
  }, [appliedSelections]);

  // Auto-update data when date range changes (interactive dashboard)
  useEffect(() => {
    // Only call handleFilter if dates are valid and different from applied filters
    // Also check if we have selected sites (not initial render)
    if (startDate && endDate && selectedSites.length > 0) {
      const currentStartDate = appliedFilters.startDate;
      const currentEndDate = appliedFilters.endDate;

      // Check if dates have actually changed
      const startDateChanged = !currentStartDate ||
        startDate.getTime() !== currentStartDate.getTime();
      const endDateChanged = !currentEndDate ||
        endDate.getTime() !== currentEndDate.getTime();

      if (startDateChanged || endDateChanged) {
        handleFilter();
      }
    }
  }, [startDate, endDate, handleFilter, selectedSites.length]);

  // Auto-update data when breakdown states change (interactive dashboard)
  useEffect(() => {
    // Check if breakdown states have actually changed
    // Also check if we have selected sites (not initial render)
    if (selectedSites.length > 0) {
      const byDatedChanged = byDated !== appliedFilters.byDated;
      const byCountryChanged = byCountry !== appliedFilters.byCountry;
      const byAdUnitChanged = byAdUnit !== appliedFilters.byAdUnit;
      const byHoursChanged = byHours !== appliedFilters.byHours;

      if (byDatedChanged || byCountryChanged || byAdUnitChanged || byHoursChanged) {
        handleFilter();
      }
    }
  }, [byDated, byCountry, byAdUnit, byHours, handleFilter, selectedSites.length]);

  // Handle search/filter dropdown
  const handleSearchFilterDropdownOpen = (event) => {
    setSearchFilterAnchorEl(event.currentTarget);
    setSearchFilterDropdownOpen(true);
  };

  const handleSearchFilterDropdownClose = () => {
    setSearchFilterDropdownOpen(false);
    setSearchFilterAnchorEl(null);
  };

  // Search/Filter options - you can customize these based on your data
  const searchFilterOptions = [
    'Site Name',
    'Country',
  ];

  // Site selection options - using the sites from siteList
  const siteSelectionOptions = siteList || [];

  // Check if site data is still loading
  const isSiteDataLoading = siteLoading || siteSelectionOptions.length === 0;

  // Filter sites based on search
  const filteredSiteOptions = siteSelectionOptions.filter(site =>
    site.toLowerCase().includes(siteSelectionSearchText.toLowerCase())
  );


  // Country selection options
  const countryValues = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
    'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
    'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Chad', 'Chile',
    'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus',
    'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland',
    'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala',
    'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India',
    'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
    'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
    'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
    'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
    'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
    'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
    'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay',
    'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
    'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
    'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
    'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
    'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
    'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // Filter countries based on search
  const filteredCountryOptions = countryValues.filter(country =>
    country.toLowerCase().includes(countrySelectionSearchText.toLowerCase())
  );

  // Filter search options based on input
  const filteredSearchOptions = searchFilterOptions
    .filter(option => {
      // Hide Country option when byHours is true
      if (byHours && option === 'Country') {
        return false;
      }
      return true;
    })
    .filter(option =>
      option.toLowerCase().includes(searchFilterText.toLowerCase())
    );

  // Handle site selection
  const handleSiteSelection = (event) => {
    // Anchor to the search field using ref
    if (searchFieldRef.current) {
      setSiteSelectionAnchorEl(searchFieldRef.current);
    } else {
      setSiteSelectionAnchorEl(event.currentTarget);
    }
    // Set the current applied sites as selected sites for the popover
    setSelectedSites(appliedFilters.selectedSites || []);
    setSiteSelectionOpen(true);
    setSearchFilterDropdownOpen(false);
  };

  const handleSiteSelectionClose = () => {
    setSiteSelectionOpen(false);
    setSiteSelectionAnchorEl(null);
    setSiteSelectionSearchText('');
  };

  const handleSiteToggle = (site) => {
    setSelectedSites(prev => {
      if (prev.includes(site)) {
        return prev.filter(s => s !== site);
      } else {
        return [...prev, site];
      }
    });
  };

  const handleSelectAllSites = () => {
    // Safety check: Don't proceed if no sites are available
    if (filteredSiteOptions.length === 0) {
      return;
    }

    // Check if all filtered sites are currently selected
    const allFilteredSitesSelected = filteredSiteOptions.every(site => selectedSites.includes(site));

    if (allFilteredSitesSelected) {
    // If all filtered sites are selected, deselect all filtered sites
      setSelectedSites(prev => prev.filter(site => !filteredSiteOptions.includes(site)));
    } else {
      // If not all filtered sites are selected, select all filtered sites
      setSelectedSites(prev => {
        const newSelection = [...prev];
        filteredSiteOptions.forEach(site => {
          if (!newSelection.includes(site)) {
            newSelection.push(site);
          }
        });
        return newSelection;
      });
    }
  };

  const handleApplySiteSelection = () => {
    // Update applied filters with selected sites
    setAppliedFilters(prev => ({
      ...prev,
      selectedSites: selectedSites
    }));

    // Trigger data refetch to apply the site filter
    if (appliedFilters.byHours) {
      hoursReportTableRefetch();
    } else if (appliedFilters.byAdUnit) {
      adunitReportTableRefetch();
    } else {
      reportTableRefetch();
    }

    // Close the popover
    setSiteSelectionOpen(false);
    setSiteSelectionSearchText('');
    setSiteSelectionAnchorEl(null);
  };

  // Handle country selection popup
  const handleCountrySelection = (event) => {
    // Anchor to the search field using ref for consistent positioning
    if (searchFieldRef.current) {
      setCountrySelectionAnchorEl(searchFieldRef.current);
    } else {
      setCountrySelectionAnchorEl(event.currentTarget);
    }
    setSelectedCountries(appliedFilters.selectedCountries || []);
    setCountrySelectionOpen(true);
    setSearchFilterDropdownOpen(false);
  };

  const handleCountrySelectionClose = () => {
    setCountrySelectionOpen(false);
    setCountrySelectionAnchorEl(null);
    setCountrySelectionSearchText('');
  };

  const handleCountryToggle = (country) => {
    setSelectedCountries(prev => {
      if (prev.includes(country)) {
        return prev.filter(c => c !== country);
      } else {
        return [...prev, country];
      }
    });
  };

  const handleSelectAllCountries = () => {
    const allSelected = filteredCountryOptions.length > 0 &&
      filteredCountryOptions.every(country => selectedCountries.includes(country));

    if (allSelected) {
      setSelectedCountries(prev => prev.filter(country => !filteredCountryOptions.includes(country)));
    } else {
      setSelectedCountries(prev => {
        const newSelection = [...prev];
        filteredCountryOptions.forEach(country => {
          if (!newSelection.includes(country)) {
            newSelection.push(country);
          }
        });
        return newSelection;
      });
    }
  };

  const handleApplyCountrySelection = () => {
    // Update applied filters with selected countries
    setAppliedFilters(prev => ({
      ...prev,
      selectedCountries: selectedCountries
    }));

    // Trigger data refetch to apply the country filter
    if (appliedFilters.byHours) {
      hoursReportTableRefetch();
    } else if (appliedFilters.byAdUnit) {
      adunitReportTableRefetch();
    } else {
      reportTableRefetch();
    }

    // Close the popover
    setCountrySelectionOpen(false);
    setCountrySelectionSearchText('');
    setCountrySelectionAnchorEl(null);
  };

  // Handle removing individual filters
  const handleRemoveFilter = (filterId) => {
    setAppliedFiltersText(prev => prev.filter(filter => filter.id !== filterId));
  };

  // Custom input component for displaying filter chips inside TextField
  const CustomInput = forwardRef((props, ref) => {
    const hasFilters = (appliedFilters.selectedSites?.length > 0) || (appliedFilters.selectedCountries?.length > 0);

    return (
      <Box
        ref={ref}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.5,
          minHeight: '32px',
          padding: '4px 0',
          width: '100%'
        }}
      >
        {/* Site Chip */}
        {appliedFilters.selectedSites?.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
              border: '1px solid',
              borderColor: theme.palette.divider,
              borderRadius: 1,
              px: 1,
              py: 0.25,
              fontSize: '12px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.700'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSiteSelection(e);
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '12px' }}>
              Site: {appliedFilters.selectedSites[0]}
              {appliedFilters.selectedSites.length > 1 && ` +${appliedFilters.selectedSites.length - 1}`}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setAppliedFilters(prev => ({ ...prev, selectedSites: [] }));
              }}
              sx={{
                width: 14,
                height: 14,
                p: 0,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }
              }}
            >
              <Icon icon="tabler:x" sx={{ fontSize: '10px', color: 'text.secondary' }} />
            </IconButton>
          </Box>
        )}

        {/* Country Chip */}
        {appliedFilters.selectedCountries?.length > 0 && !byHours && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.800',
              border: '1px solid',
              borderColor: theme.palette.divider,
              borderRadius: 1,
              px: 1,
              py: 0.25,
              fontSize: '12px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.700'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCountrySelection(e);
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '12px' }}>
              Country: {appliedFilters.selectedCountries[0]}
              {appliedFilters.selectedCountries.length > 1 && ` +${appliedFilters.selectedCountries.length - 1}`}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setAppliedFilters(prev => ({ ...prev, selectedCountries: [] }));
              }}
              sx={{
                width: 14,
                height: 14,
                p: 0,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <Icon icon="tabler:x" sx={{ fontSize: '10px', color: 'text.secondary' }} />
            </IconButton>
          </Box>
        )}

        {/* Placeholder or input */}
        {!hasFilters ? (
          <Typography
            variant="body2"
            sx={{
              color: 'text.disabled',
              fontSize: '14px',
              flex: 1
            }}
          >
            Search or filter your data
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: 'text.disabled',
              fontSize: '14px',
              flex: 1
            }}
          >
            Add more filters...
          </Typography>
        )}
      </Box>
    );
  });


  // Handle reset filter - now resets countries, sites, byAdUnit, and byHours too
  const handleResetFilter = useCallback(() => {
    const resetFilters = {
      startDate: today,
      endDate: today,
      selectedSites: [],
      byDated: true,
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
    setByDated(true)
    setByCountry(false)
    setByAdUnit(false)
    setByHours(false)
    setSelectedCountries([])
    setPageNumber(1)
    setPageSize(10)
    setSelectedDateRange('last30days')

    // Reset tempSelections to default (all Ad-Exchange values selected)
    setTempSelections({
      'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate', 'Cost Per Click', 'Total Requests']
    })

    // Reset appliedSelections to default (all Ad-Exchange values selected)
    setAppliedSelections({
      'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate', 'Cost Per Click', 'Total Requests']
    })

    // Reset selected breakdowns to default (Date only)
    setSelectedBreakdowns(['Date'])

    // Reset site selection
    setSelectedSites([])

    // Apply reset filters
    setAppliedFilters(resetFilters)
  }, [today])

  const hasCountryData = data.some(row => row.country)
  const hasHoursData = data.some(row => row.hour)


  // Get selected Ad-Exchange values from tempSelections
  const selectedAdExchange = useMemo(() => appliedSelections?.['Ad-Exchange'] || [], [appliedSelections])

  // Helper function to append totals to CSV data
  const appendTotalsToCSV = useCallback((csvData, totals, appliedFilters, selectedAdExchange) => {
    if (!totals || !csvData) return csvData


    // Convert CSV string to array of rows
    const csvRows = csvData.split('\n').filter(row => row.trim() !== '')

    if (csvRows.length === 0) return csvData

    // Get the header row to understand column structure
    const headerRow = csvRows[0]
    const headers = headerRow.split(',').map(h => h.trim().replace(/"/g, ''))

    // Create totals row with same structure as headers
    const totalsRow = []

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]

      if (header === 'Site') {
        totalsRow.push('TOTAL')
      } else if (header === 'Country') {
        totalsRow.push('--')
      } else if (header === 'Hour') {
        totalsRow.push('--')
      } else if (header === 'Ad Unit') {
        totalsRow.push('--')
      } else if (header === 'Date') {
        totalsRow.push('--')
      } else if (header === 'Impressions') {
        totalsRow.push(totals.impressions || 0)
      } else if (header === 'CTR' || header === 'CTR (%)') {
        // Calculate CTR as (total clicks / total impressions) * 100
        const totalImpressions = totals.impressions || 0
        const totalClicks = totals.clicks || 0
        const calculatedCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
        totalsRow.push(calculatedCTR.toFixed(2))
      } else if (header === 'ECPM') {
        totalsRow.push(totals.ecpm ? totals.ecpm.toFixed(2) : '0.00')
      } else if (header === 'Revenue') {
        totalsRow.push(totals.revenue ? totals.revenue.toFixed(2) : '0.00')
      } else if (header === 'Clicks') {
        totalsRow.push(totals.clicks || 0)
      } else if (header === 'Match Rate') {
        totalsRow.push(totals.matchRate ? totals.matchRate.toFixed(2) : '0.00')
      } else if (header === 'Cost Per Click') {
        totalsRow.push(totals.costPerClick ? totals.costPerClick.toFixed(2) : '0.00')
      } else if (header === 'Total Requests') {
        totalsRow.push(totals.totalRequests || 0)
      } else {
        // For any other columns, add empty value
        totalsRow.push('--')
      }
    }

    // Add totals row
    csvRows.push(totalsRow.join(','))

    // Return updated CSV data
    return csvRows.join('\n')
  }, [])

  // CSV Download function
  const handleDownloadCSV = useCallback(async () => {
    if (!data || data.length === 0) {
      toast.error("No data available to download")
      return
    }

    // If byHours is true, call the API for CSV download
    if (appliedFilters.byHours) {
      try {
        // Validate required parameters
        if (!appliedFilters.selectedSites || appliedFilters.selectedSites.length === 0) {
          toast.error("Please select at least one site for hours-wise CSV download")
          return
        }

        if (!appliedFilters.startDate || !appliedFilters.endDate) {
          toast.error("Please select start and end dates for hours-wise CSV download")
          return
        }

        toast.loading("Preparing CSV download...", { id: 'csv-download' })

        // Ensure we have valid non-null values as required by the backend schema
        const variables = {
          site: appliedFilters.selectedSites, // [String!] - non-nullable array
          startDate: format(appliedFilters.startDate, 'yyyy-MM-dd'), // String! - non-nullable
          endDate: format(appliedFilters.endDate, 'yyyy-MM-dd') // String! - non-nullable
        }

        const result = await downloadHoursWiseCSV({
          variables
        })

        const csvResponse = result.data?.downloadHoursWiseCSV

        if (csvResponse?.csvData) {
          // Append totals to CSV data if available
          let finalCSVData = csvResponse.csvData
          if (csvResponse.totals) {
            finalCSVData = appendTotalsToCSV(csvResponse.csvData, csvResponse.totals, appliedFilters, selectedAdExchange)
          }

          // Create blob from CSV data
          const blob = new Blob([finalCSVData], { type: 'text/csv' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url

          // Generate filename
          const currentDate = format(new Date(), 'yyyy-MM-dd')
          const filterInfo = []
          if (appliedFilters.selectedSites.length > 0) {
            filterInfo.push(`${appliedFilters.selectedSites.length} sites`)
          }
          filterInfo.push('by-hours')
          const filterSuffix = filterInfo.length > 0 ? `_${filterInfo.join('-')}` : ''
          const filename = `HoursWiseReport_${currentDate}${filterSuffix}.csv`

          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          toast.success(`Hours-wise CSV downloaded successfully! (${csvResponse.totalRecords} records)`, { id: 'csv-download' })
        } else {
          console.error("Invalid response structure:", result.data)
        }
      } catch (error) {
        console.error("Error downloading hours-wise CSV:", error)
      }
      return
    }

    // If byAdUnit is true, call the API for Ad Unit CSV download
    if (appliedFilters.byAdUnit) {
      try {
        // Validate required parameters
        if (!appliedFilters.selectedSites || appliedFilters.selectedSites.length === 0) {
          toast.error("Please select at least one site for ad unit CSV download")
          return
        }

        if (!appliedFilters.startDate || !appliedFilters.endDate) {
          toast.error("Please select start and end dates for ad unit CSV download")
          return
        }

        toast.loading("Preparing Ad Unit CSV download...", { id: 'csv-download' })

        // Prepare variables for Ad Unit CSV download
        const variables = {
          site: appliedFilters.selectedSites,
          country: appliedFilters.selectedCountries.length > 0 && appliedFilters.byCountry ? appliedFilters.selectedCountries : [],
          startDate: format(appliedFilters.startDate, 'yyyy-MM-dd'),
          endDate: format(appliedFilters.endDate, 'yyyy-MM-dd'),
          byDated: appliedFilters.byDated
        }

        const result = await downloadAdUnitReportCSV({
          variables
        })

        const csvResponse = result.data?.downloadAdUnitReportCSV

        if (csvResponse?.csvData) {
          // Append totals to CSV data if available
          let finalCSVData = csvResponse.csvData
          if (csvResponse.totals) {
            finalCSVData = appendTotalsToCSV(csvResponse.csvData, csvResponse.totals, appliedFilters, selectedAdExchange)
          }

          // Create blob from CSV data
          const blob = new Blob([finalCSVData], { type: 'text/csv' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url

          // Generate filename
          const currentDate = format(new Date(), 'yyyy-MM-dd')
          const filterInfo = []
          if (appliedFilters.selectedSites.length > 0) {
            filterInfo.push(`${appliedFilters.selectedSites.length} sites`)
          }
          if (appliedFilters.selectedCountries.length > 0) {
            filterInfo.push(`${appliedFilters.selectedCountries.length} countries`)
          }
          filterInfo.push('by-adunit')
          if (appliedFilters.byDated) {
            filterInfo.push('by-date')
          }
          const filterSuffix = filterInfo.length > 0 ? `_${filterInfo.join('-')}` : ''
          const filename = `AdUnitReport_${currentDate}${filterSuffix}.csv`

          link.download = filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          toast.success(`Ad Unit CSV downloaded successfully! (${csvResponse.totalRecords} records)`, { id: 'csv-download' })
        } else {
          console.error("Invalid response structure for Ad Unit CSV:", result.data)
          toast.error("Invalid response from server - missing CSV data", { id: 'csv-download' })
        }
      } catch (error) {
        console.error("Error downloading ad unit CSV:", error)
        toast.error("Failed to download Ad Unit CSV: " + (error.message || "Unknown error"), { id: 'csv-download' })
      }
      return
    }

    // If both byAdUnit and byHours are false, call the API for Daily Report CSV download
    if (!appliedFilters.byAdUnit && !appliedFilters.byHours) {
      try {
        // Validate required parameters
        if (!appliedFilters.selectedSites || appliedFilters.selectedSites.length === 0) {
          toast.error("Please select at least one site for daily report CSV download")
          return
        }

        if (!appliedFilters.startDate || !appliedFilters.endDate) {
          toast.error("Please select start and end dates for daily report CSV download")
          return
        }

        toast.loading("Preparing Daily Report CSV download...", { id: 'csv-download' })

        // Prepare variables for Daily Report CSV download
        const variables = {
          site: appliedFilters.selectedSites, // [String!] - non-nullable array
          country: appliedFilters.selectedCountries.length > 0 && appliedFilters.byCountry ? appliedFilters.selectedCountries : [],
          startDate: format(appliedFilters.startDate, 'yyyy-MM-dd'), // String! - non-nullable
          endDate: format(appliedFilters.endDate, 'yyyy-MM-dd'), // String! - non-nullable
          byDated: appliedFilters.byDated // Boolean! - non-nullable
        }

        const result = await downloadDailyReportCSV({
          variables
        })

        const csvResponse = result.data?.downloadDailyReportCSV

        if (csvResponse?.csvData) {
          // Append totals to CSV data if available
          let finalCSVData = csvResponse.csvData
          if (csvResponse.totals) {
            finalCSVData = appendTotalsToCSV(csvResponse.csvData, csvResponse.totals, appliedFilters, selectedAdExchange)
          }

          // Create blob from CSV data
          const blob = new Blob([finalCSVData], { type: 'text/csv' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url

          // Generate filename
          const currentDate = format(new Date(), 'yyyy-MM-dd')
          const filterInfo = []
          if (appliedFilters.selectedSites.length > 0) {
            filterInfo.push(`${appliedFilters.selectedSites.length} sites`)
          }
          if (appliedFilters.selectedCountries.length > 0 && appliedFilters.byCountry) {
            filterInfo.push(`${appliedFilters.selectedCountries.length} countries`)
          }
          filterInfo.push('daily-report')
          if (appliedFilters.byDated) {
            filterInfo.push('by-date')
          }
          const filterSuffix = filterInfo.length > 0 ? `_${filterInfo.join('-')}` : ''
          const filename = `DailyReport_${currentDate}${filterSuffix}.csv`

          link.download = filename;
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          toast.success(`Daily Report CSV downloaded successfully! (${csvResponse.totalRecords} records)`, { id: 'csv-download' })
        } else {
          console.error("Invalid response structure for Daily Report CSV:", result.data)
          console.error("Expected csvData field in downloadDailyReportCSV response")
          toast.error("Invalid response from server - missing CSV data", { id: 'csv-download' })
        }
      } catch (error) {
        console.error("Error downloading daily report CSV:", error)
        toast.error("Failed to download Daily Report CSV: " + (error.message || "Unknown error"), { id: 'csv-download' })
      }
      return
    }

    // For any other cases, use the existing client-side CSV generation
    // Create CSV data based on current filters and selected columns
    const csvData = data.map(item => {
      const csvRow = {}

      // Always include Site
      csvRow['Site'] = item?.site || ''

      // Include Country if byCountry is enabled
      if (appliedFilters.byCountry && hasCountryData) {
        csvRow['Country'] = item?.country || '--'
      }

      // Include Hour if byHours is enabled
      if (appliedFilters.byHours && hasHoursData) {
        csvRow['Hour'] = item?.hour || '--'
      }

      // Include Ad Unit if byAdUnit is enabled
      if (appliedFilters.byAdUnit) {
        csvRow['Ad Unit'] = item?.id ? item.id.split('-').slice(4).join('-') : '--'
      }

      // Include Date if byDated is enabled
      if (appliedFilters.byDated) {
        csvRow['Date'] = item?.date ? (
          isNaN(Date.parse(item.date)) ? item.date : format(new Date(item.date), 'MM/dd/yyyy')
        ) : '--'
      }

      // Include selected Ad-Exchange columns in the same order as table
      if (selectedAdExchange.includes('Impressions')) {
        csvRow['Impressions'] = item?.impressions || 0
      }
      if (selectedAdExchange.includes('CTR')) {
        csvRow['CTR'] = item?.ctr ? item.ctr.toFixed(2) : '0.00'
      }
      if (selectedAdExchange.includes('ECPM')) {
        csvRow['ECPM'] = item?.ecpm ? item.ecpm.toFixed(2) : '0.00'
      }
      if (selectedAdExchange.includes('Revenue')) {
        csvRow['Revenue'] = item?.revenue ? item.revenue.toFixed(2) : '0.00'
      }
      if (selectedAdExchange.includes('Clicks')) {
        csvRow['Clicks'] = item?.clicks || 0
      }
      if (selectedAdExchange.includes('Match Rate')) {
        csvRow['Match Rate'] = item?.matchRate ? item.matchRate.toFixed(2) : '0.00'
      }
      if (selectedAdExchange.includes('Cost Per Click')) {
        csvRow['Cost Per Click'] = item?.costPerClick ? item.costPerClick.toFixed(2) : '0.00'
      }
      if (selectedAdExchange.includes('Total Requests')) {
        csvRow['Total Requests'] = item?.totalRequests || 0
      }

      return csvRow
    })

    // Add totals row if available
    if (totals && Object.keys(totals).length > 0) {
      const totalsRow = {}
      totalsRow['Site'] = 'TOTAL'

      if (appliedFilters.byCountry && hasCountryData) {
        totalsRow['Country'] = '--'
      }
      if (appliedFilters.byHours && hasHoursData) {
        totalsRow['Hour'] = '--'
      }
      if (appliedFilters.byAdUnit) {
        totalsRow['Ad Unit'] = '--'
      }
      if (appliedFilters.byDated) {
        totalsRow['Date'] = '--'
      }

      if (selectedAdExchange.includes('Impressions')) {
        totalsRow['Impressions'] = totals?.impressions || 0
      }
      if (selectedAdExchange.includes('CTR')) {
        // Calculate CTR as (total clicks / total impressions) * 100
        const totalImpressions = totals?.impressions || 0
        const totalClicks = totals?.clicks || 0
        const calculatedCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
        totalsRow['CTR'] = calculatedCTR.toFixed(2)
      }
      if (selectedAdExchange.includes('ECPM')) {
        totalsRow['ECPM'] = totals?.ecpm ? totals.ecpm.toFixed(2) : '0.00'
      }
      if (selectedAdExchange.includes('Revenue')) {
        totalsRow['Revenue'] = totals?.revenue ? totals.revenue.toFixed(2) : '0.00'
      }
      if (selectedAdExchange.includes('Clicks')) {
        totalsRow['Clicks'] = totals?.clicks || 0
      }
      if (selectedAdExchange.includes('Match Rate')) {
        totalsRow['Match Rate'] = totals?.matchRate ? totals.matchRate.toFixed(2) : '0.00'
      }
      if (selectedAdExchange.includes('Cost Per Click')) {
        totalsRow['Cost Per Click'] = totals?.costPerClick ? totals.costPerClick.toFixed(2) : '0.00'
      }
      if (selectedAdExchange.includes('Total Requests')) {
        totalsRow['Total Requests'] = totals?.totalRequests || 0
      }

      csvData.push(totalsRow)
    }

    // Create Excel file
    const sheet = XLSX.utils.json_to_sheet(csvData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, sheet, 'Report Data')

    // Generate filename with current date and filter info
    const currentDate = format(new Date(), 'yyyy-MM-dd')
    const filterInfo = []
    if (appliedFilters.selectedSites.length > 0) {
      filterInfo.push(`${appliedFilters.selectedSites.length} sites`)
    }
    if (appliedFilters.selectedCountries.length > 0) {
      filterInfo.push(`${appliedFilters.selectedCountries.length} countries`)
    }
    if (appliedFilters.byAdUnit) filterInfo.push('by-adunit')
    if (appliedFilters.byHours) filterInfo.push('by-hours')
    if (appliedFilters.byCountry) filterInfo.push('by-country')
    if (appliedFilters.byDated) filterInfo.push('by-date')

    const filterSuffix = filterInfo.length > 0 ? `_${filterInfo.join('-')}` : ''
    const filename = `Report_${currentDate}${filterSuffix}.xlsx`

    XLSX.writeFile(workbook, filename)
    toast.success("Report downloaded successfully!")
  }, [data, appliedFilters, selectedAdExchange, totals, hasCountryData, hasHoursData, downloadHoursWiseCSV, downloadAdUnitReportCSV, downloadDailyReportCSV, appendTotalsToCSV])

  // Define all possible Ad-Exchange columns
  const allAdExchangeColumns = [
    {
      minWidth: 150,
      field: 'impressions',
      headerName: 'Impressions',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography noWrap align='center' sx={{ color: 'text.secondary', width: '100%' }}>
          {row?.impressions}
        </Typography>
      )
    },
    {
      minWidth: 130,
      field: 'ctr',
      headerName: 'CTR',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography noWrap align='center' sx={{ color: 'text.secondary', width: '100%' }}>
          {row?.ctr ? row.ctr.toFixed(2) : '0.00'}%
        </Typography>
      )
    },
    {
      minWidth: 150,
      field: 'ecpm',
      headerName: 'ECPM',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography noWrap align='center' sx={{ color: 'text.secondary', width: '100%' }}>
          US${row?.ecpm ? row.ecpm.toFixed(2) : '0.00'}
        </Typography>
      )
    },
    {
      minWidth: 150,
      field: 'revenue',
      headerName: 'Revenue',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography noWrap align='center' sx={{ color: 'text.secondary', width: '100%' }}>
          US${row?.revenue.toFixed(2)}
        </Typography>
      )
    },
    {
      minWidth: 120,
      field: 'clicks',
      headerName: 'Clicks',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography noWrap align='center' sx={{ color: 'text.secondary', width: '100%' }}>
          {row?.clicks}
        </Typography>
      )
    },
    {
      minWidth: 120,
      field: 'matchRate',
      headerName: 'Match Rate',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography noWrap align='center' sx={{ color: 'text.secondary', width: '100%' }}>
          {(row?.matchRate).toFixed(2)}%
        </Typography>
      )
    },
    {
      minWidth: 170,
      field: 'costPerClick',
      headerName: 'Cost Per Click',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography noWrap align='center' sx={{ color: 'text.secondary', width: '100%' }}>
          US${row?.costPerClick ? row.costPerClick.toFixed(2) : '0.00'}
        </Typography>
      )
    },
    {
      minWidth: 170,
      field: 'totalRequests',
      headerName: 'Total Requests',
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Typography noWrap align='center' sx={{ color: 'text.secondary', width: '100%' }}>
          {row?.totalRequests || 0}
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
    ...(appliedFilters.byCountry && hasCountryData
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>  
              <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.hour || '--'}
            </Typography>
            </Box>
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
                ? row.id.split('-').slice(5).join('-')
                : '--'}
            </Typography>
          )
        }
      ]
      : []),
    ...(appliedFilters.byDated
      ? [
          {
          minWidth: 125,
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
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Main Content Area */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            // height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}>
          <Card sx={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Date Filter Bar */}
            <Grid container spacing={3} alignItems='center' sx={{ margin: '16px', width: 'calc(100% - 32px)', '& > .MuiGrid-item': { paddingTop: 0, paddingLeft: 0 } }}>
              <Grid item xs={12} sm={9}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  {[
                    { label: 'Today', value: 'today' },
                    { label: 'Last 7 days', value: 'last7days' },
                    { label: 'Last 30 days', value: 'last30days' },
                    { label: 'This month', value: 'thismonth' },
                    { label: 'Last month', value: 'lastmonth' },
                    { label: 'Custom', value: 'custom', hasDropdown: true }
                  ].map((option) => {
                    const isSelected = selectedDateRange === option.value;
                    return (
                      <Button
                        key={option.value}
                        variant='text'
                        startIcon={
                          isSelected ? (
                            <Icon 
                              icon='tabler:check' 
                              style={{ color: breakdownChipColors.textColor }}
                            />
                          ) : null
                        }
                        endIcon={option.hasDropdown ? <Icon icon='tabler:chevron-down' /> : null}
                        size='small'
                        onClick={(event) => {
                          if (option.value === 'custom') {
                            setPopoverAnchorEl(event.currentTarget);
                          }
                          handleDateRangeChange(option.value);
                        }}
                        sx={{
                          minWidth: 'auto',
                          px: 2,
                          py: 1,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: isSelected ? 600 : 400,
                          backgroundColor: isSelected ? breakdownChipColors.backgroundColor : 'transparent',
                          color: isSelected ? breakdownChipColors.textColor : theme.palette.text.primary,
                          border: isSelected ? 'none' : `1px solid ${theme.palette.divider}`,
                          boxShadow: 'none',
                          '&:hover:not(.Mui-disabled)': {
                            backgroundColor: isSelected ? breakdownChipColors.backgroundColor : '#E7E8E8 !important',
                            border: isSelected ? 'none' : `1px solid ${theme.palette.divider}`,
                            boxShadow: isSelected ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
                          },
                          '& .MuiButton-startIcon': {
                            color: isSelected ? breakdownChipColors.textColor : 'inherit'
                          },
                          '& .MuiButton-endIcon': {
                            color: 'inherit'
                          }
                        }}
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                </Box>
              </Grid>
              <Grid item xs={12} sm={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, mt: { xs: 2, sm: 0 } }}>
                <Button onClick={handleDownloadCSV} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Icon fontSize='1.125rem' icon='tabler:download' />
                  Download Excel
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ m: '0 !important' }} />
            <Grid container spacing={0} sx={{ height: 'calc(100vh - 136px)', position: 'relative', overflow: 'hidden', display: 'flex', flexWrap: 'nowrap' }}>
              <Grid 
                item 
                xs={sidebarOpen ? 12 : 0} 
                sm={sidebarOpen ? 4 : 0} 
                md={sidebarOpen ? 3 : 0} 
                lg={sidebarOpen ? 2.5 : 0}
                sx={{
                  // borderRight: sidebarOpen ? `1px solid ${theme.palette.divider}` : 'none',
                  height: '100%',
                  overflowY: sidebarOpen ? 'auto' : 'hidden',
                  overflowX: 'hidden',
                  backgroundColor: theme.palette.mode === 'dark' ? '#1F1F1F' : '#FAFAFA',
                  transition: 'all 0.3s ease-in-out',
                  transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                  opacity: sidebarOpen ? 1 : 0,
                  visibility: sidebarOpen ? 'visible' : 'hidden',
                  position: 'relative',
                  zIndex: 1,
                  minWidth: sidebarOpen ? { xs: '100%', sm: '200px', md: '240px', lg: '280px' } : 0,
                  maxWidth: sidebarOpen ? { xs: '100%', sm: '25%', md: '25%', lg: '280px' } : 0,
                      '&::-webkit-scrollbar': {
                        width: '8px'
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent'
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                        }
                      }
                    }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      {/* Search Bar */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderBottom: `1px solid ${theme.palette.divider}`, p: 2 }}>
                        <TextField
                          size='small'
                          placeholder="Search reports"
                          value={reportSearchText}
                          onChange={(e) => setReportSearchText(e.target.value)}
                          sx={{
                            flex: 1,
                            boxShadow: 'none',
                            '& .MuiOutlinedInput-root': {
                              boxShadow: 'none',
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                boxShadow: 'none'
                              },
                              '&:hover': {
                                boxShadow: 'none',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                boxShadow: 'none'
                              },
                              '&.Mui-focused': {
                                boxShadow: 'none',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                                boxShadow: 'none'
                              },
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon width={24} height={24} fill="#3c4043" />
                              </InputAdornment>
                            )
                          }}
                        />
                        <IconButton>
                            <PlusIcon width={24} height={24} fill={`${theme.palette.mode === 'dark' ? '#FFFFFF' : '#3c4043'}`} />
                        </IconButton>
                      </Box>

                      {/* Report List */}
                      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                        {/* Unsaved Report */}
                        {filteredReports.filter(r => r.isUnsaved).map((report) => (
                          <Box
                            key={report.id}
                            onClick={() => setSelectedReportId(report.id)}
                            sx={{
                              position: 'relative',
                              py:4,
                              px:4,
                              backgroundColor: selectedReportId === report.id 
                                ? breakdownChipColors.backgroundColor 
                                : 'transparent',
                              cursor: 'pointer',
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                  backgroundColor: selectedReportId === report.id 
                                    ? breakdownChipColors.backgroundColor 
                                    : 'action.hover'
                              }
                            }}
                              >
                              {selectedReportId === report.id && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    left: 0,
                                    zIndex: 1,
                                    top: '-1px',
                                    bottom: 0,
                                    height: 'calc(100% + 2px)',
                                    width: '6px',
                                    backgroundColor: breakdownChipColors.textColor
                                  }}
                                />
                              )}
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                                  <QuickReportIcon fill={selectedReportId === report.id ? breakdownChipColors.textColor : '#5F6368'} />
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography 
                                      variant='body2' 
                                      sx={{ 
                                        fontWeight: selectedReportId === report.id ? 600 : 400,
                                        color: selectedReportId === report.id ? breakdownChipColors.textColor : 'text.primary',
                                        mb: 0.5
                                      }}
                                    >
                                      {report.title}
                                    </Typography>
                                    <Typography 
                                      variant='caption' 
                                      sx={{ 
                                        color: selectedReportId === report.id ? breakdownChipColors.textColor : 'text.secondary',
                                        fontSize: '0.75rem',
                                        display: 'block',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        width: '150px'
                                      }}
                                    >
                                      {report.description}
                                    </Typography>
                                </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <IconButton
                                    size='small'
                                    onClick={(e) => handleReportMenuOpen(e, report.id)}
                                    sx={{
                                      p: 3,
                                      color: selectedReportId === report.id ? breakdownChipColors.textColor : 'text.secondary',
                                      '&:hover': {
                                        backgroundColor: 'action.hover'
                                      }
                                    }}
                                  >
                                    <MoreVertIcon width={24} height={24} fill={selectedReportId === report.id ? breakdownChipColors.textColor : '#5F6368'} />
                                  </IconButton>
                                </Box>
                              </Box>
                          </Box>
                        ))}

                        {/* Saved Reports */}
                        {filteredReports.filter(r => !r.isUnsaved).map((report) => (
                        <Box
                            key={report.id}
                            onClick={() => setSelectedReportId(report.id)}
                            sx={{
                              position: 'relative',
                              p: 4,
                              backgroundColor: selectedReportId === report.id 
                                ? breakdownChipColors.backgroundColor 
                                : 'transparent',
                              cursor: 'pointer',
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              '&:hover': {
                                backgroundColor: selectedReportId === report.id 
                                  ? breakdownChipColors.backgroundColor 
                                  : 'action.hover'
                              }
                            }}
                          >
                            {selectedReportId === report.id && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  left: 0,
                                  top: '-1px',
                                  height: 'calc(100% + 2px)',
                                  width: '6px',
                                  backgroundColor: breakdownChipColors.textColor
                                }}
                              />
                            )}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                              <QuickReportIcon fill={selectedReportId === report.id ? breakdownChipColors.textColor : '#5F6368'} />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography 
                                    variant='body2' 
                                    sx={{ 
                                      fontWeight: selectedReportId === report.id ? 600 : 400,
                                      color: selectedReportId === report.id ? breakdownChipColors.textColor : 'text.primary',
                                      mb: 0.5
                                    }}
                                  >
                                    {report.title}
                                  </Typography>
                                  <Typography 
                                    variant='caption' 
                                    sx={{ 
                                      color: selectedReportId === report.id ? breakdownChipColors.textColor : 'text.secondary',
                                      fontSize: '0.75rem',
                                      display: 'block',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      width: '150px'
                                    }}
                                  >
                                    {report.description}
                                  </Typography>
                                </Box>
                              </Box>
                          <IconButton
                                size='small'
                                onClick={(e) => handleReportMenuOpen(e, report.id)}
                                sx={{
                                  p: 3,
                                  color: selectedReportId === report.id ? breakdownChipColors.textColor : '#5F6368',
                                  '&:hover': {
                                        backgroundColor: 'action.hover'
                                  }
                                }}
                          >
                                <MoreVertIcon width={24} height={24} fill={selectedReportId === report.id ? breakdownChipColors.textColor : '#5F6368'} />
                          </IconButton>
                        </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
              </Grid>
              <Grid item 
                xs={12} 
                sm={sidebarOpen ? 8 : 12} 
                md={sidebarOpen ? 9 : 12} 
                lg={sidebarOpen ? 9 : 12} 
                sx={{ 
                  flex: '1 1 0% !important',
                  flexGrow: '1 !important',
                  flexShrink: '1 !important',
                  flexBasis: '0% !important',
                  minWidth: 0, 
                  width: 'auto !important',
                  maxWidth: 'none !important',
                  transition: 'all 0.3s ease-in-out', 
                  borderLeft: sidebarOpen ? `1px solid ${theme.palette.divider}` : 'none',  
                  height: '100%',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  // backgroundColor: '#F8F9FA',
                  display: 'flex',
                  flexDirection: 'column',
                  // Override Material-UI Grid breakpoint styles
                  '&.MuiGrid-item': {
                    flexGrow: '1 !important',
                    flexBasis: '0% !important',
                    maxWidth: 'none !important',
                    width: 'auto !important'
                  },
                  // Override at all breakpoints
                  [theme.breakpoints.up('xs')]: {
                    flexBasis: '0% !important',
                    maxWidth: 'none !important',
                    flexGrow: '1 !important',
                    width: 'auto !important'
                  },
                  [theme.breakpoints.up('sm')]: {
                    flexBasis: '0% !important',
                    maxWidth: 'none !important',
                    flexGrow: '1 !important',
                    width: 'auto !important'
                  },
                  [theme.breakpoints.up('md')]: {
                    flexBasis: '0% !important',
                    maxWidth: 'none !important',
                    flexGrow: '1 !important',
                    width: 'auto !important'
                  },
                  [theme.breakpoints.up('lg')]: {
                    flexBasis: '0% !important',
                    maxWidth: 'none !important',
                    flexGrow: '1 !important',
                    width: 'auto !important'
                  },
                  [theme.breakpoints.up('xl')]: {
                    flexBasis: '0% !important',
                    maxWidth: 'none !important',
                    flexGrow: '1 !important',
                    width: 'auto !important'
                  }
                }}>
              {/* Report Header Section */}
              <Grid container spacing={3} alignItems='center' sx={{ margin: 0, '& > .MuiGrid-item': { paddingTop: 0, paddingLeft: 0 } }}>
                <Grid container alignItems='center' spacing={2} sx={{ margin: 0, width: 'calc(100% - 32px)', '& > .MuiGrid-item': { paddingTop: 0, paddingLeft: 0 }}}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2.5 }}>
                      {/* Left side - Title with Grid Icon */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <IconButton
                          onClick={() => setSidebarOpen(!sidebarOpen)}
                          sx={{
                            color: 'text.primary',
                            p: 1.5,
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          <AppsIcon width={24} height={24} fill="#3c4043" />
                        </IconButton>
                        <Typography variant='h6' sx={{ fontWeight: 500, color: 'text.primary' }}>
                          Top pages
                        </Typography>
                      </Box>

                      {/* Right side - Save Button and Menu */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                          variant='outlined'
                          onClick={handleSave}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 400,
                            borderColor: 'divider',
                            color: 'text.primary',
                            backgroundColor: 'background.paper',
                            borderRadius: '8px',
                            px: 2,
                            py: 0.75,
                            '&:hover': {
                              borderColor: 'divider',
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          Save
                        </Button>
                        <IconButton
                          onClick={handleHeaderMenuOpen}
                          sx={{
                            color: 'text.primary',
                            p: 1,
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          <Icon icon='tabler:dots-vertical' sx={{ fontSize: '1.25rem' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Divider sx={{ m: '0 !important' }} />

              {/* Breakdowns Section */}
              <Grid container spacing={3} alignItems='center' sx={{ margin: 0, marginTop: 0, marginLeft: 0, width: '100%', '& > .MuiGrid-item': { paddingTop: 0, paddingLeft: 0 } }}>
                <Grid container alignItems='center' spacing={2} sx={{ margin: 0, marginTop: 0, marginLeft: 0, width: '100%', '& > .MuiGrid-item': { paddingTop: 0, paddingLeft: 0 } }}>
                  <Grid item xs={12}> 
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {/* Left side - Breakdowns */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '50%', px: 4, py: 3, flexWrap: 'wrap' }}>
                        <Typography variant='body1' sx={{ fontWeight: 500, color: 'text.primary' }}>
                          Breakdowns:
                        </Typography>

                        {/* Show all selected breakdowns as chips */}
                        {selectedBreakdowns.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            {selectedBreakdowns.map((breakdown, index) => (
                              <Box
                                key={breakdown}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            backgroundColor: breakdownChipColors.backgroundColor,
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.5,
                            fontSize: '14px'
                          }}
                        >
                          <Icon 
                            icon="tabler:check" 
                            style={{ 
                              fontSize: '16px', 
                              color: breakdownChipColors.textColor
                            }} 
                          />
                                <Typography variant="body2" sx={{ color: breakdownChipColors.textColor }}>
                                  {breakdown}
                          </Typography>
                          <IconButton
                            size="small"
                                      onClick={() => handleBreakdownOptionSelect(breakdown)}
                                      disabled={breakdown === 'Date' && selectedBreakdowns.length <= 1}
                            sx={{
                              width: 16,
                              height: 16,
                              p: 0,
                              ml: 0.5,
                              '&:hover': {
                                backgroundColor: breakdownChipColors.hoverBackgroundColor
                                  },
                                        '&.Mui-disabled': {
                                          opacity: 0.5
                              }
                            }}
                          >
                            <Icon icon="tabler:x" sx={{ fontSize: '12px', color: breakdownChipColors.textColor }} />
                          </IconButton>
                                  </Box>
                                ))}
                        </Box>
                      )}

                        <Button
                          variant='text'
                          startIcon={<Icon icon='tabler:plus' />}
                          onClick={handleBreakdownsDropdownOpen}
                          sx={{
                            color: 'primary.main',
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 'auto',
                            px: 1,
                            '&:hover': {
                              backgroundColor: 'transparent'
                            },
                            '& .MuiButton-startIcon': {
                              marginRight: 0.5
                            }
                          }}
                        >
                          Add
                        </Button>
                      </Box>

                      {/* Vertical Divider */}
                      <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                      {/* Right side - Search/Filter */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '50%', pl: 2 }}>
                        {/* Filter Icon Button */}
                        <IconButton
                          onClick={(e) => {
                            setSearchFilterAnchorEl(e.currentTarget);
                            handleSearchFilterDropdownOpen(e);
                          }}
                          sx={{
                            color: 'text.secondary',
                            p: 1,
                            '&:hover': {
                              backgroundColor: 'action.hover'
                            }
                          }}
                        >
                          <FilterAltIcon fill="#5F6368" width={24} height={24} />
                        </IconButton>

                      {/* Search Input Field */}
                      <TextField
                        ref={searchFieldRef}
                        onClick={handleSearchFilterDropdownOpen}
                        size='small'
                        placeholder="Search or filter your data"
                        value={searchFilterText}
                        onChange={(e) => setSearchFilterText(e.target.value)}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'background.paper',
                            borderRadius: 2,
                            cursor: 'pointer',
                            boxShadow: 'none',
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              border: 'none'
                            },
                            '&:hover': {
                              boxShadow: 'none'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              border: 'none'
                            },
                            '&.Mui-focused': {
                              boxShadow: 'none'
                            }
                          }
                        }}
                        InputProps={{
                          endAdornment: searchFilterText && (
                            <InputAdornment position='end'>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchFilterText('');
                                }}
                                sx={{
                                  width: 20,
                                  height: 20,
                                  p: 0,
                                  '&:hover': {
                                    backgroundColor: 'action.hover'
                                  }
                                }}
                              >
                                <Icon icon='tabler:x' sx={{ fontSize: '14px', color: 'text.secondary' }} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Divider sx={{ m: '0 !important' }} />
            {/* Ad Exchange Metric Buttons */}
            <Grid container spacing={3} alignItems='center'>
              <Grid container alignItems='center' spacing={2} sx={{ width: 'calc(100% - 32px)', margin: 0, paddingLeft: "16px", paddingTop: "16px" }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      {/* All metric buttons with interactive selection */}
                      {[
                        { label: 'Impressions', icon: 'tabler:presentation' },
                        { label: 'CTR', icon: 'tabler:click' },
                        { label: 'ECPM', icon: 'cil:chart-line' },
                        { label: 'Clicks', icon: 'ic:baseline-ads-click' },
                        { label: 'Revenue', icon: 'tabler:coin' },
                        { label: 'Match Rate', icon: 'tabler:a-b' },
                        { label: 'Total Requests', icon: 'tabler:location-check' },
                        { label: 'Cost Per Click', icon: 'streamline-freehand:e-commerce-click-buy' },
                      ].map((metric) => {
                        const isSelected = appliedSelections['Ad-Exchange']?.includes(metric.label) || false;
                        const isLastSelected = isSelected && (appliedSelections['Ad-Exchange']?.length || 0) <= 1;
                        return (
                          <Button
                            key={metric.label}
                            variant='text'
                            startIcon={
                              <Icon 
                                icon={isSelected ? 'tabler:check' : ""} 
                                style={isSelected ? { color: breakdownChipColors.textColor } : {}}
                              />
                            }
                            size='small'
                            disabled={isLastSelected}
                            onClick={() => {
                              setAppliedSelections(prev => {
                                const currentAdExchange = prev['Ad-Exchange'] || [];
                                let newAdExchange;

                                if (currentAdExchange.includes(metric.label)) {
                                  // Prevent deselecting if this is the last remaining column
                                  if (currentAdExchange.length <= 1) {
                                    return prev; // Don't allow deselecting the last column
                                  }
                                  // Remove from selection
                                  newAdExchange = currentAdExchange.filter(m => m !== metric.label);
                                } else {
                                  // Add to selection
                                  newAdExchange = [...currentAdExchange, metric.label];
                                }

                                return {
                                  ...prev,
                                  'Ad-Exchange': newAdExchange
                                };
                              });
                            }}
                            sx={{
                              minWidth: 'auto',
                              px: 2,
                              py: 1,
                              borderRadius: '8px',
                              textTransform: 'none',
                              fontWeight: isSelected ? 600 : 400,
                              backgroundColor: isSelected ? breakdownChipColors.backgroundColor : 'transparent',
                              color: isSelected ? breakdownChipColors.textColor : theme.palette.text.primary,
                              border: isSelected ? 'none' : `1px solid ${theme.palette.divider}`,
                              boxShadow: 'none',
                              '&:hover:not(.Mui-disabled)': {
                                backgroundColor: isSelected ? breakdownChipColors.backgroundColor : '#E7E8E8 !important',
                                border: isSelected ? 'none' : `1px solid ${theme.palette.divider}`,
                                boxShadow: isSelected ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
                              },
                              '&:hover.Mui-disabled': {
                                backgroundColor: isSelected ? breakdownChipColors.backgroundColor : 'transparent'
                              },
                              '&.Mui-disabled': {
                                backgroundColor: isSelected ? breakdownChipColors.backgroundColor : 'transparent',
                                opacity: 0.6,
                                '&:hover': {
                                  backgroundColor: isSelected ? breakdownChipColors.backgroundColor : 'transparent',
                                  boxShadow: 'none'
                                }
                              },
                              '& .MuiButton-startIcon': {
                                color: isSelected ? breakdownChipColors.textColor : 'inherit'
                              }
                            }}
                          >
                            {metric.label}
                          </Button>
                        );
                      })}
                    </Box>

                    {/* Edit icon */}
                    <IconButton 
                      size='small' 
                      sx={{ ml: 2, color: 'text.secondary' }}
                      onClick={() => {
                        setTempSelectedMetrics([...appliedSelections['Ad-Exchange']]);
                        setMetricsModalOpen(true);
                      }}
                    >
                      <EditIcon fill="#3c4043" />
                    </IconButton>
                  </Box>

                </Grid>
              </Grid>
            </Grid>

            {/* Metrics Selection Modal */}
            <Dialog
              open={metricsModalOpen}
              onClose={() => setMetricsModalOpen(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.25rem' }}>
                  Pick your metrics
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ padding: '0 !important' }}>

                {/* Two Panel Layout */}
                <Box sx={{ display: 'flex', height: 400, borderTop: `1px solid ${theme.palette.divider}` }}>
                  {/* Left Panel - Recommended Metrics */}
                  <Box sx={{ flex: 1, borderRight: `1px solid ${theme.palette.divider}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}> 
                    {/* Sticky Search Bar Header */} 
                    <Box sx={{ 
                      position: 'sticky', 
                      top: 0, 
                      zIndex: 1, 
                      backgroundColor: 'background.paper', 
                      borderBottom: `1px solid ${theme.palette.divider}`, 
                      boxShadow: 'none' 
                    }}>
                      <TextField
                        size="small"
                        value={metricsSearchText}
                        onChange={(e) => setMetricsSearchText(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fill="#3C4043" width={20} height={20} />
                            </InputAdornment>
                          )
                        }}
                        sx={{
                          flex: 1,
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            border: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                              boxShadow: 'none'
                            },
                            '&.Mui-focused': {
                              boxShadow: 'none'
                            }
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: 'none'
                          }
                        }}
                      />
                    </Box>
                    {/* Scrollable Metrics List */}
                    <List sx={{ p: 0, overflowY: 'auto', flex: 1 }}>
                      {[
                        { label: 'Impressions', icon: 'tabler:presentation' },
                        { label: 'CTR', icon: 'tabler:click' },
                        { label: 'ECPM', icon: 'cil:chart-line' },
                        { label: 'Revenue', icon: 'tabler:coin' },
                        { label: 'Clicks', icon: 'ic:baseline-ads-click' },
                        { label: 'Match Rate', icon: 'tabler:a-b' },
                        { label: 'Cost Per Click', icon: 'streamline-freehand:e-commerce-click-buy' },
                        { label: 'Total Requests', icon: 'tabler:location-check' }
                      ]
                        .filter(metric => 
                          metric.label.toLowerCase().includes(metricsSearchText.toLowerCase())
                        )
                        .map((metric) => { 
                          const isSelected = tempSelectedMetrics.includes(metric.label);
                          return ( 
                            <ListItem
                              key={metric.label} 
                              sx={{
                                px: 2,
                                py: 2.5,
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: theme.palette.action.hover
                                },
                              }}
                              onClick={() => {
                                if (isSelected) {
                                  if (tempSelectedMetrics.length > 1) {
                                    setTempSelectedMetrics(tempSelectedMetrics.filter(m => m !== metric.label));
                                  }
                                } else {
                                  setTempSelectedMetrics([...tempSelectedMetrics, metric.label]);
                                }
                              }}
                            >
                              <Checkbox
                                checked={isSelected}
                                sx={{ mr: 1.5, p: 0.5 }}
                              />
                              <Typography variant="body2" color="#000000">
                                {metric.label}
                              </Typography>
                              <Tooltip title={`Learn more about ${metric.label}`} arrow>
                                <IconButton
                                  size="small"
                                  sx={{ p: 0.5, color: 'text.secondary', ml: 'auto' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Info tooltip or action
                                  }}
                                >
                                  <InfoIcon fill="#0000008A" width={18} height={18} />
                                </IconButton>
                              </Tooltip>
                            </ListItem>
                          );
                        })}
                    </List>
                  </Box>

                  {/* Right Panel - Selected Metrics */}
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Sticky Header with Selected Count and Clear All */}
                    <Box sx={{ 
                    position: 'sticky', 
                      top: 0, 
                      zIndex: 1, 
                      backgroundColor: 'background.paper',
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, p: "6.5px" }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {tempSelectedMetrics.length} selected
                        </Typography>
                        {tempSelectedMetrics.length > 0 && (
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                              if (tempSelectedMetrics.length > 1) {
                                setTempSelectedMetrics(['Impressions']); // Keep at least one
                              }
                            }}
                            sx={{
                              textTransform: 'none',
                              color: '#1976d2',
                              minWidth: 'auto',
                              px: 0.5,
                              backgroundColor: 'transparent !important',
                              '&:hover': {
                                backgroundColor: 'transparent !important'
                              },
                              '&.MuiButton-root:hover': {
                                backgroundColor: 'transparent !important'
                              },
                              '&.MuiButton-text:hover': {
                                backgroundColor: 'transparent !important'
                              },
                              '&.MuiButton-textPrimary:hover': {
                                backgroundColor: 'transparent !important'
                              }
                            }}
                          >
                            Clear all
                          </Button>
                        )}
                      </Box>
                    </Box>  
                    {/* Scrollable Selected Metrics List */}
                    <List sx={{ p: 0, overflowY: 'auto', flex: 1 }}>
                      {tempSelectedMetrics.length === 0 ? (
                        <ListItem>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            No metrics selected
                          </Typography>
                        </ListItem>
                      ) : (
                        tempSelectedMetrics.map((metric, index) => (
                          <ListItem
                            key={`${metric}-${index}`}
                            draggable
                            onDragStart={(e) => {
                              setDraggedIndex(index);
                              e.dataTransfer.effectAllowed = 'move';
                              e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
                              e.currentTarget.style.opacity = '0.5';
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                              const draggedOver = e.currentTarget;
                              const rect = draggedOver.getBoundingClientRect();
                              const midpoint = rect.top + rect.height / 2;
                              if (e.clientY < midpoint) {
                                draggedOver.style.borderTop = `2px solid ${theme.palette.primary.main}`;
                                draggedOver.style.borderBottom = 'none';
                              } else {
                                draggedOver.style.borderBottom = `2px solid ${theme.palette.primary.main}`;
                                draggedOver.style.borderTop = 'none';
                              }
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.style.borderTop = 'none';
                              e.currentTarget.style.borderBottom = `1px solid ${theme.palette.divider}`;
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.style.borderTop = 'none';
                              e.currentTarget.style.borderBottom = `1px solid ${theme.palette.divider}`;
                              
                              if (draggedIndex === null || draggedIndex === index) return;
                              
                              const newMetrics = [...tempSelectedMetrics];
                              const draggedItem = newMetrics[draggedIndex];
                              newMetrics.splice(draggedIndex, 1);
                              
                              const rect = e.currentTarget.getBoundingClientRect();
                              const midpoint = rect.top + rect.height / 2;
                              const insertIndex = e.clientY < midpoint ? index : index + 1;
                              
                              newMetrics.splice(insertIndex, 0, draggedItem);
                              setTempSelectedMetrics(newMetrics);
                              setDraggedIndex(null);
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.style.opacity = '1';
                              e.currentTarget.style.borderTop = 'none';
                              e.currentTarget.style.borderBottom = `1px solid ${theme.palette.divider}`;
                              setDraggedIndex(null);
                            }}
                            sx={{
                              px: 2,
                              py: 1.5,
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              cursor: 'move',
                              transition: 'background-color 0.2s',
                              '&:hover': {
                                backgroundColor: theme.palette.action.hover
                              },
                              '&.dragging': {
                                opacity: 0.5
                              }
                            }}
                          >
                            <DragIndicatorIcon fill="#959899" width={24} height={24} style={{ marginRight: 12 }} />
                            <Typography variant="body2" color="#000000" sx={{ flex: 1 }}>
                              {metric}
                            </Typography>
                            <IconButton
                              size="small"
                              sx={{ p: 3, color: 'text.secondary' }}
                              onClick={() => {
                                if (tempSelectedMetrics.length > 1) {
                                  setTempSelectedMetrics(tempSelectedMetrics.filter((_, i) => i !== index));
                                }
                              }}
                            >
                              <CloseIcon fill="#3C4043" width={24} height={24} />
                            </IconButton>
                          </ListItem>
                        ))
                      )}
                    </List>
                  </Box>
                </Box>

                {/* Footer Buttons */}
                <Box sx={{ py: 3, px: 4, borderTop: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Button
                    onClick={() => {
                      setMetricsModalOpen(false);
                      setMetricsSearchText('');
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (tempSelectedMetrics.length > 0) {
                        setAppliedSelections(prev => ({
                          ...prev,
                          'Ad-Exchange': tempSelectedMetrics
                        }));
                        setMetricsModalOpen(false);
                        setMetricsSearchText('');
                      }
                    }}
                    disabled={tempSelectedMetrics.length === 0}
                    sx={{ textTransform: 'none' }}
                  >
                    Apply
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>

            {/* <Divider sx={{ m: '0 !important' }} /> */}

            <Box sx={{ width: '100%', p:4 }}> 
              {/* Demo Recharts Chart */}
              <Box sx={{ width: '100%', p:4, border: `1px solid ${theme.palette.divider}`, borderRadius: '8px' }}>
                <Card sx={{ p: 3, boxShadow: 'none' }}>
                  <Typography variant='h6' sx={{ mb: 3, fontWeight: 600 }}>Demo Chart - Ad Exchange Performance</Typography>
                  <Box sx={{ width: '100%', height: 300, minHeight: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { name: 'Mon', Impressions: 4000, Clicks: 2400, Revenue: 2400 },
                          { name: 'Tue', Impressions: 3000, Clicks: 1398, Revenue: 2210 },
                          { name: 'Wed', Impressions: 2000, Clicks: 9800, Revenue: 2290 },
                          { name: 'Thu', Impressions: 2780, Clicks: 3908, Revenue: 2000 },
                          { name: 'Fri', Impressions: 1890, Clicks: 4800, Revenue: 2181 },
                          { name: 'Sat', Impressions: 2390, Clicks: 3800, Revenue: 2500 },
                          { name: 'Sun', Impressions: 3490, Clicks: 4300, Revenue: 2100 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <RechartsLegend />
                        <Area type="monotone" dataKey="Impressions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                        <Area type="monotone" dataKey="Clicks" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                        <Area type="monotone" dataKey="Revenue" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </Box>
            </Box>

            {/* <Divider sx={{ m: '0 !important' }} /> */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
                width: '100%',
                padding: '16px',
              }}
              >
              {/* Table Content with Custom Footer */}
              <Box
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  width: '100%',
                  '&::-webkit-scrollbar': {
                    height: '4px'
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: theme?.palette?.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme?.palette?.mode === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.22)',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: theme?.palette?.mode === 'dark' ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.32)'
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
                    Footer: () => <CustomFooter
                      totals={totals}
                      filteredData={appliedFilters} selectedAdExchange={selectedAdExchange}
                      key={`footer-${JSON.stringify(totals)}-${JSON.stringify(appliedFilters)}-${JSON.stringify(selectedAdExchange)}`}
                    />
                  }}
                  sx={{
                    minWidth: 'max-content',
                    border: 'none',
                    '& .MuiDataGrid-main': {
                      overflow: 'visible !important'
                    },
                    '& .MuiDataGrid-virtualScroller': {
                      overflow: 'visible !important'
                    },
                    '& .MuiDataGrid-iconSeparator': {
                      display: 'none'
                    },
                    '& .MuiDataGrid-footerContainer': {
                      borderTop: `none`,
                      borderBottom: `1px solid ${theme.palette.divider} !important`
                    },
                    '& .MuiDataGrid-pagination': {
                      display: 'none !important' // Hide default pagination
                    },
                    // Cell borders and styling
                    '& .MuiDataGrid-cell': {
                      borderRight: `1px solid ${theme.palette.divider}`,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      justifyContent: 'flex-end',
                      textAlign: 'right'
                    },
                    '& .MuiDataGrid-cellContent': {
                      width: '100%',
                      textAlign: 'right'
                    },
                    '& .MuiDataGrid-cell .MuiTypography-root': {
                      width: '100%',
                      textAlign: 'right'
                    },
                    '& .MuiDataGrid-cell .MuiBox-root': {
                      width: '100%',
                      justifyContent: 'flex-end'
                    },
                    // Keep Site column left-aligned
                    '& .MuiDataGrid-cell[data-field="site"]': {
                      justifyContent: 'flex-start',
                      textAlign: 'left'
                    },
                    '& .MuiDataGrid-cell[data-field="site"] .MuiDataGrid-cellContent': {
                      textAlign: 'left'
                    },
                    '& .MuiDataGrid-cell[data-field="site"] .MuiTypography-root': {
                      textAlign: 'left'
                    },
                    '& .MuiDataGrid-cell[data-field="site"] .MuiBox-root': {
                      justifyContent: 'flex-start'
                    },
                    '& .MuiDataGrid-cell:first-of-type': {
                      borderLeft: 'none'
                    },
                    '& .MuiDataGrid-cell:last-of-type': {
                      borderRight: 'none'
                    },
                    // Header styling
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: theme?.palette?.mode === 'dark' ? '#1F1F1F' : '#f5f5f5',
                      borderTop: 'none',
                      borderLeft: 'none',
                      borderRight: `none`,
                    },
                    '& .MuiDataGrid-columnHeaders .MuiDataGrid-columnHeader:last-of-type': {
                      borderRight: 'none'
                    },
                    '& .MuiDataGrid-columnHeader': {
                      borderRight: `1px solid ${theme.palette.divider}`,
                      padding: '12px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: 'text.secondary'
                    },
                    '& .MuiDataGrid-columnHeaderTitleContainer': {
                      justifyContent: 'flex-end !important'
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      width: '100%',
                      textAlign: 'right'
                    },
                    '& .MuiDataGrid-columnHeader[data-field="site"] .MuiDataGrid-columnHeaderTitleContainer': {
                      justifyContent: 'flex-start'
                    },
                    '& .MuiDataGrid-columnHeader[data-field="site"] .MuiDataGrid-columnHeaderTitle': {
                      textAlign: 'left'
                    },
                    '& .MuiDataGrid-columnHeader[data-field="actions"]': {
                      borderRight: `none`
                    },
                    '& .MuiDataGrid-columnHeader:focus': {
                      outline: 'none'
                    },
                    '& .MuiDataGrid-columnHeader:focus-within': {
                      outline: 'none'
                    },
                    // Row styling
                    '& .MuiDataGrid-row': {
                      borderLeft: 'none',
                      borderRight: `none`
                    },
                    '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
                      borderBottom: `none`
                    },
                    // Remove default borders
                    '& .MuiDataGrid-root': {
                      border: 'none'
                    },
                    '& .MuiDataGrid-withBorder': {
                      borderRight: 'none'
                    }
                  }}
                />
              </Box>

              {/* Separate Pagination - Matching Screenshot Design */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  padding: '8px 16px',
                  backgroundColor: theme?.palette?.mode === 'dark' ? '#111111' : '#FFFFFF',
                  minHeight: '52px',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  borderLeft: `1px solid ${theme.palette.divider}`,
                  borderRight: `1px solid ${theme.palette.divider}`
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
                      Show rows
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 70 }}>
                      <Select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(e.target.value)}
                        variant="outlined"
                        sx={{
                          fontSize: '0.875rem',
                          fontWeight: 400,
                          color: 'text.secondary',
                          height: '32px',
                          maxWidth: '70px !important',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#E6E6E7'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2D5BC7'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2D5BC7'
                          },
                          '&& .MuiSelect-select': {
                            padding: '6px 32px 6px 12px !important',
                            minWidth: '25px !important'
                          },
                          '& .MuiSelect-icon': {
                            color: 'text.secondary',
                            fontSize: '1rem',
                            right: '8px'
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
                    {`${(pageNumber - 1) * pageSize + 1} - ${Math.min(pageNumber * pageSize, totalRow)} of ${totalRow}`}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {/* First page button */}
                    <Button
                      size="small"
                      onClick={() => handlePageChange(0)}
                      disabled={pageNumber <= 1}
                      sx={{
                        minWidth: 'auto',
                        padding: '5px',
                        borderRadius: '4px',
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor:
                          pageNumber <= 1
                            ? (theme.palette.mode === 'dark' ? '#111111' : '#EBEBEB')
                            : (theme.palette.mode === 'dark' ? '#111111' : '#FFFFFF'),
                        color: pageNumber <= 1 ? theme.palette.text.disabled : theme.palette.text.secondary,
                        '&&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#111111 !important' : '#ffffff !important',
                          borderColor:'#2D5BC7',
                          color: '#2D5BC7'
                        },
                        '&&.Mui-disabled': {
                          color: theme.palette.text.disabled,
                          backgroundColor:
                            pageNumber <= 1
                              ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06) !important' : '#EBEBEB !important')
                              : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.14) !important' : 'rgba(0,0,0,0.10) !important')
                        }
                      }}
                    >
                      <Icon icon="tabler:chevrons-left" width="20" height="20" />
                    </Button>
                    {/* Previous page button */}
                    <Button
                      size="small"
                      onClick={() => handlePageChange(pageNumber - 2)}
                      disabled={pageNumber <= 1}
                      sx={{
                        minWidth: 'auto',
                        padding: '5px',
                        borderRadius: '4px',
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor:
                          pageNumber <= 1
                            ? (theme.palette.mode === 'dark' ? '#111111' : '#EBEBEB') 
                            : (theme.palette.mode === 'dark' ? '#111111' : '#FFFFFF'),
                        color: pageNumber <= 1 ? theme.palette.text.disabled : theme.palette.text.secondary,
                        '&&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#111111 !important' : '#ffffff !important',
                          borderColor:'#2D5BC7',
                          color: '#2D5BC7'
                        },
                        '&&.Mui-disabled': {
                          color: theme.palette.text.disabled,
                          backgroundColor:
                            pageNumber <= 1
                              ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06) !important' : '#EBEBEB !important')
                              : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.14) !important' : 'rgba(0,0,0,0.10) !important')
                        }
                      }}
                    >
                      <Icon icon="tabler:chevron-left" width="20" height="20" />
                    </Button>
                    {/* Next page button */}
                    <Button
                      size="small"
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={pageNumber * pageSize >= totalRow}
                      sx={{
                        minWidth: 'auto',
                        padding: '5px',
                        borderRadius: '4px',
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor:
                          pageNumber * pageSize >= totalRow
                            ? (theme.palette.mode === 'dark' ? '#111111' : '#EBEBEB')
                            : (theme.palette.mode === 'dark' ? '#111111' : '#FFFFFF'),
                        color:
                          pageNumber * pageSize >= totalRow
                            ? theme.palette.text.disabled
                            : theme.palette.text.secondary,
                        '&&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#111111 !important' : '#ffffff !important',
                          borderColor:'#2D5BC7',
                          color: '#2D5BC7'
                        },
                        '&&.Mui-disabled': {
                          color: theme.palette.text.disabled,
                          backgroundColor:
                            pageNumber * pageSize >= totalRow
                              ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06) !important' : '#EBEBEB !important')
                              : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.14) !important' : 'rgba(0,0,0,0.10) !important')
                        }
                      }}
                    >
                      <Icon icon="tabler:chevron-right" width="20" height="20" />
                    </Button>
                    {/* Last page button */}
                    <Button
                      size="small"
                      onClick={() => handlePageChange(Math.ceil(totalRow / pageSize) - 1)}
                      disabled={pageNumber * pageSize >= totalRow}
                      sx={{
                        minWidth: 'auto',
                        padding: '5px',
                        borderRadius: '4px',
                        border: `1px solid ${theme.palette.divider}`,
                        backgroundColor:
                          pageNumber * pageSize >= totalRow
                            ? (theme.palette.mode === 'dark' ? '#111111' : '#EBEBEB')
                            : (theme.palette.mode === 'dark' ? '#111111' : '#FFFFFF'),
                        color:
                          pageNumber * pageSize >= totalRow
                            ? theme.palette.text.disabled
                            : theme.palette.text.secondary,
                        '&&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? '#111111 !important' : '#ffffff !important',
                          borderColor:'#2D5BC7',
                          color: '#2D5BC7'
                        },
                        '&&.Mui-disabled': {
                          color: theme.palette.text.disabled,
                          backgroundColor:
                            pageNumber * pageSize >= totalRow
                              ? (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06) !important' : '#EBEBEB !important')
                              : (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.14) !important' : 'rgba(0,0,0,0.10) !important')
                        }
                      }}
                    >
                      <Icon icon="tabler:chevrons-right" width="20" height="20" />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
              </Grid>
            </Grid>
          </Card>
          {
            open && (<>
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
            </>)
          }
          
          {addUserOpen && (
            <AddSiteTable
              open={addUserOpen}
              toggle={toggleAddUserDrawer}
              siteTableRefetch={() => setAppliedFilters(prev => ({ ...prev }))} // Trigger refetch
            />
          )}
        </Box>
      </Box>

      {/* Custom Date Picker Popover */}
      <Popover
        open={customDatePickerOpen}
        anchorEl={popoverAnchorEl}
        onClose={handleCustomDateCancel}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '500px',
            maxWidth: '500px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Select Date Range
          </Typography>
          <Box sx={{ display: 'flex', height: '400px' }}>
            {/* Left Sidebar - Preset Options */}
            <Box sx={{
              width: '200px',
              borderRight: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              mr: 2
            }}>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ p: 0 }}>
                  <ListItemButton
                    selected={selectedPreset === 'custom'}
                    onClick={() => setSelectedPreset('custom')}
                    sx={{
                      backgroundColor: selectedPreset === 'custom' ? 'primary.light' : 'transparent',
                      color: selectedPreset === 'custom' ? 'primary.main' : 'text.secondary',
                      position: 'relative',
                      borderRight: selectedPreset === 'custom' ? '3px solid' : '3px solid transparent',
                      borderRightColor: selectedPreset === 'custom' ? 'primary.main' : 'transparent',
                      borderRadius: 0,
                      '&:hover': {
                        backgroundColor: selectedPreset === 'custom' ? 'primary.light' : 'action.hover'
                      }
                    }}
                  >
                    <ListItemText
                      primary="Custom"
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: selectedPreset === 'custom' ? 600 : 500,
                          fontSize: '14px',
                          color: selectedPreset === 'custom' ? 'primary.main' : 'text.secondary'
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
                {[
                  { label: 'Today', value: 'today' },
                  { label: 'Yesterday', value: 'yesterday' },
                  { label: 'Last 7 days', value: 'last7days' },
                  // { label: 'Last 30 days', value: 'last30days' },
                  { label: 'This month', value: 'thismonth' },
                  { label: 'Last month', value: 'lastmonth' },
                  // { label: 'Last 3 years', value: 'last3years' }
                ].map((preset) => (
                  <ListItem key={preset.value} sx={{ p: 0 }}>
                    <ListItemButton
                      selected={selectedPreset === preset.value}
                      onClick={() => handleCustomPresetSelection(preset.value)}
                      sx={{
                        backgroundColor: selectedPreset === preset.value ? 'primary.light' : 'transparent',
                        color: selectedPreset === preset.value ? 'primary.main' : 'text.secondary',
                        position: 'relative',
                        borderRight: selectedPreset === preset.value ? '3px solid' : '3px solid transparent',
                        borderRightColor: selectedPreset === preset.value ? 'primary.main' : 'transparent',
                        borderRadius: 0,
                        '&:hover': {
                          backgroundColor: selectedPreset === preset.value ? 'primary.light' : 'action.hover'
                        }
                      }}
                    >
                      <ListItemText
                        primary={preset.label}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: '14px',
                            color: selectedPreset === preset.value ? 'primary.main' : 'text.secondary',
                            fontWeight: selectedPreset === preset.value ? 600 : 500
                          }
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Right Main Area - Date Picker */}
            <Box sx={{ flex: 1 }}>
              {/* Date Input Fields */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <TextField
                  label="Start date"
                  type="date"
                  value={tempStartDate ? format(tempStartDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setTempStartDate(new Date(e.target.value))}
                  size="small"
                  sx={{ minWidth: '150px', maxWidth: '150px' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  -
                </Typography>
                <TextField
                  label="End date"
                  type="date"
                  value={tempEndDate ? format(tempEndDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setTempEndDate(new Date(e.target.value))}
                  size="small"
                  sx={{ minWidth: '150px', maxWidth: '150px' }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>

              {/* Calendar View */}
              <Box sx={{
                p: 2,
                backgroundColor: 'background.paper',
                maxWidth: '500px'
              }}>
                <DatePickerWrapper>
                  <DatePicker
                    selectsRange
                    showIcon={true}
                    endDate={tempEndDate}
                    selected={tempStartDate}
                    startDate={tempStartDate}
                    id='date-range-picker'
                    onChange={handleOnChange}
                    shouldCloseOnSelect={false}
                    popperPlacement={popperPlacement}
                    inline
                    monthsShown={1}
                    dropdownMode="select"
                    dateFormat="MM/dd/yyyy"
                    className="react-datepicker-custom"
                    calendarClassName="react-datepicker-custom-calendar"
                  />
                </DatePickerWrapper>
              </Box>
            </Box>


          </Box>
          {/* Action Buttons */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 2,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              onClick={handleCustomDateCancel}
              sx={{ color: 'primary.main' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCustomDateApply}
              variant="contained"
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Breakdowns Dropdown */}
      <Popover
        open={breakdownsDropdownOpen}
        anchorEl={breakdownsAnchorEl}
        onClose={handleBreakdownsDropdownClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '280px',
            maxWidth: '320px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 0 }}>
          {/* Search Bar */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search"
              value={breakdownsSearchText}
              onChange={(e) => setBreakdownsSearchText(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="tabler:search" sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  }
                }
              }}
            />
          </Box>

          {/* Filter Options List */}
          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredBreakdownsOptions.map((option, index) => {
              const isSelected = selectedBreakdowns.includes(option);
              return (
              <Box
                key={option}
                onClick={() => handleBreakdownOptionSelect(option)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  cursor: 'pointer',
                  borderBottom: index < filteredBreakdownsOptions.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                    backgroundColor: isSelected ? breakdownChipColors.backgroundColor : 'transparent',
                  '&:hover': {
                      backgroundColor: isSelected ? breakdownChipColors.backgroundColor : 'action.hover'
                  }
                }}
              >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isSelected && (
                      <Icon
                        icon="tabler:check"
                        sx={{
                          color: breakdownChipColors.textColor,
                          fontSize: '1rem'
                        }}
                      />
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: isSelected ? breakdownChipColors.textColor : 'text.primary',
                        fontWeight: isSelected ? 500 : 400
                      }}
                    >
                  {option}
                </Typography>
                  </Box>
                <Icon
                  icon="tabler:info-circle"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '1rem',
                    opacity: 0.7
                  }}
                />
              </Box>
              );
            })}
          </Box>
        </Box>
      </Popover>

      {/* Search/Filter Dropdown */}
      <Popover
        open={searchFilterDropdownOpen}
        anchorEl={searchFilterAnchorEl}
        onClose={handleSearchFilterDropdownClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '300px',
            maxWidth: '320px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 0 }}>
          {/* Search Bar */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search"
              value={searchFilterText}
              onChange={(e) => setSearchFilterText(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="tabler:search" sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'divider'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                    borderWidth: '2px'
                  }
                }
              }}
            />
          </Box>

          {/* Filter Options List */}
          <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
            {filteredSearchOptions.map((option, index) => (
              <Box
                key={option}
                onClick={(event) => {
                  if (option === 'Site Name') {
                    handleSiteSelection(event);
                  } else if (option === 'Country') {
                    handleCountrySelection(event);
                  } else {
                    setSearchFilterText(option);
                    handleSearchFilterDropdownClose();
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  cursor: 'pointer',
                  borderBottom: index < filteredSearchOptions.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  {option}
                </Typography>
                <Icon
                  icon="tabler:info-circle"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '1rem',
                    opacity: 0.7
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Popover>

      {/* Site Selection Popup */}
      <Popover
        open={siteSelectionOpen}
        anchorEl={siteSelectionAnchorEl}
        onClose={handleSiteSelectionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '500px',
            maxWidth: '500px',
            height: '400px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            mt: 1
          }
        }}
      >
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', height: '325px' }}>
          {/* Left Panel - Selection List */}
          <Box
            sx={{
              flex: 1,
              borderRight: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Search Bar */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Search"
                value={siteSelectionSearchText}
                onChange={(e) => setSiteSelectionSearchText(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="tabler:search" sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Box>

            {/* Select All */}
            <Box
              onClick={isSiteDataLoading ? undefined : handleSelectAllSites}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                cursor: isSiteDataLoading ? 'not-allowed' : 'pointer',
                borderBottom: '1px solid',
                borderBottomColor: 'divider',
                fontWeight: '500',
                opacity: isSiteDataLoading ? 0.5 : 1,
                '&:hover': {
                  backgroundColor: isSiteDataLoading ? 'transparent' : 'action.hover'
                }
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  border: '1px solid',
                  borderColor: filteredSiteOptions.length > 0 && 
                    filteredSiteOptions.every(site => selectedSites.includes(site))
                    ? 'primary.main' : 'divider',
                  borderRadius: '2px',
                  backgroundColor: filteredSiteOptions.length > 0 && 
                    filteredSiteOptions.every(site => selectedSites.includes(site))
                    ? 'primary.main' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}
              >
                {filteredSiteOptions.length > 0 && 
                  filteredSiteOptions.every(site => selectedSites.includes(site)) && (
                    <Icon
                      icon="tabler:check"
                      sx={{
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
              </Box>
              <Typography variant='body2'>
                {isSiteDataLoading
                  ? 'Loading...'
                  : `${filteredSiteOptions.length > 0 &&
                    filteredSiteOptions.every(site => selectedSites.includes(site))
                    ? 'Deselect All' : 'Select All'} (${filteredSiteOptions.length})`
                }
              </Typography>
            </Box>

            {/* Sites List */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {filteredSiteOptions.map((site, index) => {
                const isSelected = selectedSites.includes(site);
                return (
                  <Box
                    key={site}
                    onClick={() => handleSiteToggle(site)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      borderBottom: index < filteredSiteOptions.length - 1 ? '1px solid' : 'none',
                      borderBottomColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        border: '1px solid',
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        borderRadius: '2px',
                        backgroundColor: isSelected ? 'primary.main' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                      }}
                    >
                      {isSelected && (
                        <Icon
                          icon="tabler:check"
                          sx={{
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {site}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Right Panel - Selected Items */}
          <Box
            sx={{
              width: '300px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid',
                borderBottomColor: 'divider'
              }}
            >
              <Typography variant='body2' sx={{ color: 'primary.main', fontWeight: 500 }}>
                {selectedSites.length} total selected
              </Typography>
              <Button
                onClick={() => setSelectedSites([])}
                disabled={selectedSites.length === 0}
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

            {/* Selected Sites List */}
            <Box sx={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {selectedSites.length === 0 ? (
                <Box
                  sx={{
                    padding: 3,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    No sites selected
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* Category Header */}
                  <Box
                    sx={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: 'background.paper',
                      borderBottom: '1px solid',
                      borderBottomColor: 'divider'
                    }}
                  >
                    <Typography
                      variant='caption'
                      sx={{
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Sites ({selectedSites.length})
                    </Typography>
                  </Box>

                  {/* Selected Sites */}
                  {selectedSites.map(site => (
                    <Box
                      key={site}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderBottom: '1px solid',
                        borderBottomColor: 'divider',
                        fontSize: '12px'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          paddingRight: '8px'
                        }}
                      >
                        {site}
                      </Typography>
                      <IconButton
                        edge='end'
                        size='small'
                        onClick={() => handleSiteToggle(site)}
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
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Apply Button */}
        <Box sx={{
          padding: '16px',
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1
        }}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleSiteSelectionClose}
            sx={{ minWidth: 80 }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleApplySiteSelection}
            sx={{ minWidth: 80 }}
          >
            Apply
          </Button>
        </Box>
      </Popover>

      {/* Country Selection Popup */}
      <Popover
        open={countrySelectionOpen}
        anchorEl={countrySelectionAnchorEl}
        onClose={handleCountrySelectionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '500px',
            maxWidth: '500px',
            height: '400px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            mt: 1
          }
        }}
      >
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', height: '325px' }}>
          {/* Left Panel - Selection List */}
          <Box
            sx={{
              flex: 1,
              borderRight: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Search Bar */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <TextField
                fullWidth
                placeholder="Search countries"
                value={countrySelectionSearchText}
                onChange={(e) => setCountrySelectionSearchText(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="tabler:search" sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'divider'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Box>

            {/* Select All */}
            <Box
              onClick={handleSelectAllCountries}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid',
                borderBottomColor: 'divider',
                fontWeight: '500',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  border: '1px solid',
                  borderColor: filteredCountryOptions.length > 0 &&
                    filteredCountryOptions.every(country => selectedCountries.includes(country))
                    ? 'primary.main' : 'divider',
                  borderRadius: '2px',
                  backgroundColor: filteredCountryOptions.length > 0 &&
                    filteredCountryOptions.every(country => selectedCountries.includes(country))
                    ? 'primary.main' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}
              >
                {filteredCountryOptions.length > 0 &&
                  filteredCountryOptions.every(country => selectedCountries.includes(country)) && (
                    <Icon
                      icon="tabler:check"
                      sx={{
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    />
                  )}
              </Box>
              <Typography variant='body2'>
                Select All ({filteredCountryOptions.length})
              </Typography>
            </Box>

            {/* Countries List */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {filteredCountryOptions.map((country, index) => {
                const isSelected = selectedCountries.includes(country);
                return (
                  <Box
                    key={country}
                    onClick={() => handleCountryToggle(country)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      borderBottom: index < filteredCountryOptions.length - 1 ? '1px solid' : 'none',
                      borderBottomColor: 'divider',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        border: '1px solid',
                        borderColor: isSelected ? 'primary.main' : 'divider',
                        borderRadius: '2px',
                        backgroundColor: isSelected ? 'primary.main' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '12px'
                      }}
                    >
                      {isSelected && (
                        <Icon
                          icon="tabler:check"
                          sx={{
                            color: 'white',
                            fontSize: '0.75rem'
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      {country}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Right Panel - Selected Items */}
          <Box
            sx={{
              width: '300px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid',
                borderBottomColor: 'divider'
              }}
            >
              <Typography variant='body2' sx={{ color: 'primary.main', fontWeight: 500 }}>
                {selectedCountries.length} total selected
              </Typography>
              <Button
                onClick={() => setSelectedCountries([])}
                disabled={selectedCountries.length === 0}
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

            {/* Selected Countries List */}
            <Box sx={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {selectedCountries.length === 0 ? (
                <Box
                  sx={{
                    padding: 3,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    No countries selected
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {/* Category Header */}
                  <Box
                    sx={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: 'background.paper',
                      borderBottom: '1px solid',
                      borderBottomColor: 'divider'
                    }}
                  >
                    <Typography
                      variant='caption'
                      sx={{
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      Countries ({selectedCountries.length})
                    </Typography>
                  </Box>

                  {/* Selected Countries */}
                  {selectedCountries.map(country => (
                    <Box
                      key={country}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderBottom: '1px solid',
                        borderBottomColor: 'divider',
                        fontSize: '12px'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '12px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          paddingRight: '8px'
                        }}
                      >
                        {country}
                      </Typography>
                      <IconButton
                        edge='end'
                        size='small'
                        onClick={() => handleCountryToggle(country)}
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
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Apply Button */}
        <Box sx={{
          padding: '16px',
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1
        }}>
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleCountrySelectionClose}
            sx={{ minWidth: 80 }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleApplyCountrySelection}
            sx={{ minWidth: 80 }}
          >
            Apply
          </Button>
        </Box>
      </Popover>

      {/* Header Menu */}
      <Menu
        anchorEl={headerMenuAnchorEl}
        open={headerMenuOpen}
        onClose={handleHeaderMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '180px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            mt: 1
          }
        }}
      >
        <MenuItem onClick={handleHeaderMenuClose}>
          <Typography variant='body2'>Duplicate</Typography>
        </MenuItem>
        <MenuItem onClick={handleHeaderMenuClose}>
          <Typography variant='body2'>Rename</Typography>
        </MenuItem>
        <MenuItem onClick={handleHeaderMenuClose}>
          <Typography variant='body2' color='error'>Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Report Menu */}
      <Menu
        anchorEl={reportMenuAnchorEl}
        open={reportMenuOpen}
        onClose={handleReportMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '180px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider',
            mt: 1
          }
        }}
      >
        <MenuItem onClick={handleReportMenuClose}>
          <Typography variant='body2'>Duplicate</Typography>
        </MenuItem>
        <MenuItem onClick={handleReportMenuClose}>
          <Typography variant='body2'>Rename</Typography>
        </MenuItem>
        <MenuItem onClick={handleReportMenuClose}>
          <Typography variant='body2' color='error'>Delete</Typography>
        </MenuItem>
      </Menu>
    </>
  )
}

export { siteTableRes }

SiteTable.acl = {
  action: 'read',
  subject: 'reporttable-p'
}

export default SiteTable
