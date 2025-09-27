import { useQuery, useLazyQuery } from '@apollo/client'
import { Box, Button, Typography, Select, MenuItem, FormControl, IconButton, Popover, TextField, List, ListItem, ListItemButton, ListItemText, InputAdornment } from '@mui/material'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { DataGrid, GridFooterContainer, GridPagination } from '@mui/x-data-grid'
import { useEffect, useState, useCallback, useMemo, useRef, forwardRef } from 'react'
import Moment from 'react-moment'
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

          {filteredData?.byCountry && (
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
  const [byDated, setByDated] = useState(true)
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
  const [selectedBreakdowns, setSelectedBreakdowns] = useState([]);

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
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end';

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
      country: appliedFilters.byCountry ? appliedFilters.selectedCountries.length > 0 ? appliedFilters.selectedCountries : ["ALL"] : null,
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
      country: appliedFilters.byCountry ? appliedFilters.selectedCountries.length > 0 ? appliedFilters.selectedCountries : ["ALL"] : null,
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

    // Only show error if this is not the initial render and no sites are selected
    // Check if appliedFilters already has selectedSites (meaning this is not initial render)
    const isInitialRender = !appliedFilters.selectedSites || appliedFilters.selectedSites.length === 0;

    if (selectedSites.length === 0 && !isInitialRender) {
      toast.error("Please select at least one site");
      return;
    }

    setPageNumber(1)
    setAppliedFilters(newFilters)
  }, [startDate, endDate, pageSize, byDated, appliedFilters.byCountry, byAdUnit, byHours, appliedFilters.selectedSites]) // Added appliedFilters.selectedSites to check initial state

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
    const today = new Date();
    let start, end;

    switch (range) {
      case 'today':
        start = new Date(today);
        end = new Date(today);
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
    }));
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
  const filteredSearchOptions = searchFilterOptions.filter(option =>
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
    const allSelected = filteredSiteOptions.length > 0 &&
      filteredSiteOptions.every(site => selectedSites.includes(site));

    if (allSelected) {
      setSelectedSites(prev => prev.filter(site => !filteredSiteOptions.includes(site)));
    } else {
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
              backgroundColor: 'grey.100',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1,
              px: 1,
              py: 0.25,
              fontSize: '12px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'grey.200'
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
        {appliedFilters.selectedCountries?.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'grey.100',
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1,
              px: 1,
              py: 0.25,
              fontSize: '12px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'grey.200'
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
                  backgroundColor: 'rgba(0,0,0,0.1)'
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
      'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate']
    })

    // Reset appliedSelections to default (all Ad-Exchange values selected)
    setAppliedSelections({
      'Ad-Exchange': ['Impressions', 'CTR', 'ECPM', 'Revenue', 'Clicks', 'Match Rate']
    })

    // Reset selected breakdowns
    setSelectedBreakdowns([])

    // Reset site selection
    setSelectedSites([])

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

            {/* <Divider sx={{ m: '0 !important' }} /> */}

            {/* <TableHeader
              toggle={toggleAddUserDrawer}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              siteTableRefetch={reportTableRefetch}
              For='SiteTable'
            /> */}

            {/* <Divider sx={{ m: '0 !important' }} />

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
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFilter(filter.id)}
                          sx={{
                            width: 16,
                            height: 16,
                            marginLeft: '8px',
                            padding: 0,
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <Icon icon="tabler:x" sx={{ fontSize: '12px', color: 'text.secondary' }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Grid> */}

            <Divider sx={{ m: '0 !important' }} />

            {/* Date Filter Bar */}
            <Grid container spacing={3} alignItems='center' xs={12}>
              <Grid container alignItems='center' spacing={2} sx={{ margin: '16px', width: 'calc(100% - 32px)' }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
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
                          variant={isSelected ? 'contained' : 'outlined'}
                          startIcon={isSelected ? <Icon icon='tabler:check' /> : null}
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
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: isSelected ? 600 : 400,
                            backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
                            color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
                            borderColor: isSelected ? theme.palette.primary.main : theme.palette.divider,
                            '&:hover': {
                              backgroundColor: isSelected
                                ? theme.palette.primary.dark
                                : theme.palette.action.hover,
                              borderColor: theme.palette.primary.main
                            }
                          }}
                        >
                          {option.label}
                        </Button>
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ m: '0 !important' }} />

            {/* Breakdowns Section */}
            <Grid container spacing={3} alignItems='center' xs={12}>
              <Grid container alignItems='center' spacing={2} sx={{ margin: '16px', width: 'calc(100% - 32px)' }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Left side - Breakdowns */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant='body1' sx={{ fontWeight: 500, color: 'text.primary' }}>
                        Breakdowns:
                      </Typography>

                      {/* Show selected breakdowns */}
                      {selectedBreakdowns.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          {selectedBreakdowns.map((breakdown, index) => (
                            <Box
                              key={breakdown}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                backgroundColor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                px: 1.5,
                                py: 0.5,
                                fontSize: '14px'
                              }}
                            >
                              <Typography variant="body2" sx={{ color: 'text.primary' }}>
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
                                  '&:hover': {
                                    backgroundColor: 'action.hover'
                                  }
                                }}
                              >
                                <Icon icon="tabler:x" sx={{ fontSize: '12px', color: 'text.secondary' }} />
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
                          position: 'relative',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText'
                          }
                        }}
                      >
                        Add
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -2,
                            right: 8,
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main'
                          }}
                        />
                      </Button>
                    </Box>

                    {/* Vertical Divider */}
                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    {/* Right side - Search/Filter */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        ref={searchFieldRef}
                        onClick={handleSearchFilterDropdownOpen}
                        size='small'
                        sx={{
                          minWidth: 300,
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'background.paper',
                            borderRadius: 2,
                            cursor: 'pointer',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'divider'
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main'
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main'
                            }
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Icon icon='tabler:filter' sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position='end'>
                              <Icon icon='tabler:chevron-down' sx={{ color: 'text.secondary', fontSize: '1rem' }} />
                            </InputAdornment>
                          ),
                          inputComponent: CustomInput
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Divider sx={{ m: '0 !important' }} />

            {/* Ad Exchange Metric Buttons */}
            <Grid container spacing={3} alignItems='center' xs={12}>
              <Grid container alignItems='center' spacing={2} sx={{ margin: '16px', width: 'calc(100% - 32px)' }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      {/* All metric buttons with interactive selection */}
                      {[
                        { label: 'Impressions', icon: 'tabler:presentation' },
                        { label: 'CTR', icon: 'tabler:click' },
                        { label: 'ECPM', icon: 'cil:chart-line' },
                        { label: 'Clicks', icon: 'ic:baseline-ads-click' },
                        { label: 'Revenue', icon: 'tabler:coin' },
                        { label: 'Match Rate', icon: 'tabler:a-b' },
                      ].map((metric) => {
                        const isSelected = appliedSelections['Ad-Exchange']?.includes(metric.label) || false;
                        const isLastSelected = isSelected && (appliedSelections['Ad-Exchange']?.length || 0) <= 1;
                        return (
                          <Button
                            key={metric.label}
                            variant={isSelected ? 'contained' : 'outlined'}
                            startIcon={<Icon icon={isSelected ? 'tabler:check' : metric.icon} />}
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
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: isSelected ? 600 : 400,
                              backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
                              color: isSelected ? theme.palette.primary.contrastText : theme.palette.text.primary,
                              borderColor: isSelected ? theme.palette.primary.main : theme.palette.divider,
                              '&:hover': {
                                backgroundColor: isSelected
                                  ? theme.palette.primary.dark
                                  : theme.palette.action.hover,
                                borderColor: theme.palette.primary.main
                              }
                            }}
                          >
                            {metric.label}
                          </Button>
                        );
                      })}
                    </Box>

                    {/* Edit icon */}
                    <IconButton size='small' sx={{ ml: 2 }}>
                      <Icon icon='tabler:edit' />
                    </IconButton>
                  </Box>
                </Grid>

                {/* Selected Metrics Display */}
                {/* <Grid item xs={12}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2,
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Icon
                        icon='tabler:check'
                        style={{ fontSize: 20, color: theme.palette.primary.main }}
                      />
                      <Typography variant='h6' sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                        {appliedSelections['Ad-Exchange']?.length || 0} Metric{(appliedSelections['Ad-Exchange']?.length || 0) !== 1 ? 's' : ''} Selected
                      </Typography>
                    </Box>
                    <Divider orientation='vertical' flexItem />
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography variant='body2' color='text.secondary'>
                        Selected:
                      </Typography>
                      {(appliedSelections['Ad-Exchange'] || []).map((metric, index) => (
                        <Box key={metric} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant='body2' sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                            {metric}
                          </Typography>
                          {index < (appliedSelections['Ad-Exchange'] || []).length - 1 && (
                            <Typography variant='body2' color='text.secondary'>•</Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid> */}

                <Grid item xs={12}>
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
                    Footer: () => <CustomFooter
                      totals={totals}
                      filteredData={appliedFilters} selectedAdExchange={selectedAdExchange}
                      key={`footer-${JSON.stringify(totals)}-${JSON.stringify(appliedFilters)}-${JSON.stringify(selectedAdExchange)}`}
                    />
                  }}
                  sx={{
                    minWidth: 'max-content',
                    '& .MuiDataGrid-main': {
                      overflow: 'visible !important'
                    },
                    '& .MuiDataGrid-virtualScroller': {
                      overflow: 'visible !important'
                    },
                    '& .MuiDataGrid-footerContainer': {
                      // overflow: 'visible !important',
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
            {filteredBreakdownsOptions.map((option, index) => (
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
              onClick={handleSelectAllSites}
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
                Select All ({filteredSiteOptions.length})
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
    </>
  )
}

export { siteTableRes }

SiteTable.acl = {
  action: 'read',
  subject: 'reporttable-p'
}

export default SiteTable
