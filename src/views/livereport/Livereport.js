import { useMutation, useQuery } from '@apollo/client'
import { Autocomplete, Box, Button, Card, Checkbox, Divider, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { forwardRef, useEffect, useState } from 'react'
import Moment from 'react-moment'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import Loader from 'src/components/loader/loader'
import { GET_ADSENSE_FULL_REPORT, GET_ADSENSE_TOTAL_REPORT } from 'src/graphql/query/adsense'
import { GET_ALL_SITES } from 'src/graphql/query/site'
import { useAuth } from 'src/hooks/useAuth'
import isoCountries from 'iso-3166-1'
import * as XLSX from 'xlsx'
import toast from 'react-hot-toast'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTheme } from '@emotion/react'
import { GENERATE_ADSENSE_EXCEL } from 'src/graphql/mutation/site'

var siteTableRes


const CustomInput = forwardRef((props, ref) => {
  const startDate = props?.start ? `${format(props?.start, 'MM/dd/yyyy')}` : null
  const endDate = props?.end ? ` - ${format(props?.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate ? startDate : ''}${endDate ? endDate : ''}`

  return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
})

const Livereport = ({ userSite }) => {

  // ** State
  const [data, setData] = useState([]);
  const [sumToday, setSumToday] = useState(0)
  const [sumWeek, setSumWeek] = useState(0)
  const [sumYesterday, setSumYesterday] = useState(0)
  const [sumMonth, setSumMonth] = useState(0)
  const [previousMonthTotal, setPreviousMonthTotal] = useState(0)
  const [sumOfTwoDates, setSumOfTwoDates] = useState(null)
  const [totalRow, setTotalRow] = useState(10)
  const [siteSearchText, setSiteSearchText] = useState("")
  const [siteObj, setSiteObj] = useState({ site: userSite })
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [site, setSite] = useState('')
  const [siteId, setSiteId] = useState('')
  const [siteData, setSiteData] = useState([])

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  // country
  const [countryReport, setCountryReport] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState([])
  const [countryCodes, setCountryCodes] = useState([])

  const [limit, setLimit] = useState(100)
  const [limitcopy, setLimitCopy] = useState(100)

  const offset = (pageNumber - 1) * pageSize;

  const auth = useAuth()

  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const Obj = {}

  if (auth?.user?.role !== "admin") { Obj.site = userSite }
  else { Obj.site = [] }

  // Graphql query
  const { loading: siteTableLoading, error: siteTableError, data: adsenseReportData, refetch: siteTableRefetch } = useQuery(GET_ADSENSE_TOTAL_REPORT, {
    variables: { filter: JSON.stringify(siteObj) },
    fetchPolicy: "cache-and-network",
  });

  const { loading: fullReportLoading, error: fullReportError, data: fullReport, refetch: fullReportRefetch } = useQuery(GET_ADSENSE_FULL_REPORT, {
    variables: { page: pageNumber, limit: limit, filter: JSON.stringify(siteObj) },
    fetchPolicy: "cache-and-network",
  });

  const { loading: siteTableFilterLoading, error: siteTableFilterError, data: siteTableFilter, refetch: siteTableFilterRefetch } = useQuery(GET_ALL_SITES, {
    variables: { page: 1, limit: 10, search: siteSearchText },
    fetchPolicy: "cache-and-network",
  })

  siteTableRes = siteTableRefetch

  useEffect(() => {
    !siteTableLoading && setSumToday(Number(adsenseReportData?.getAdsenseTotalReport?.TODAY?.total?.ESTIMATED_EARNINGS || 0))
    !siteTableLoading && setSumYesterday(Number(adsenseReportData?.getAdsenseTotalReport?.YESTERDAY?.total?.ESTIMATED_EARNINGS || 0))
    !siteTableLoading && setSumWeek(Number(adsenseReportData?.getAdsenseTotalReport?.LAST_7_DAYS?.total?.ESTIMATED_EARNINGS || 0))
    !siteTableLoading && setSumMonth(Number(adsenseReportData?.getAdsenseTotalReport?.MONTH_TO_DATE?.total?.ESTIMATED_EARNINGS || 0))
    !siteTableLoading && setPreviousMonthTotal(Number(adsenseReportData?.getAdsenseTotalReport?.LAST_MONTH?.total?.ESTIMATED_EARNINGS || 0))
    adsenseReportData?.getAdsenseTotalReport?.DATE_RANGE?.total?.ESTIMATED_EARNINGS && setSumOfTwoDates(Number(adsenseReportData?.getAdsenseTotalReport?.DATE_RANGE?.total?.ESTIMATED_EARNINGS || null))

  }, [siteTableLoading, adsenseReportData])

  useEffect(() => {

    siteTableFilter?.getAllSites?.data?.length > 0 && setSiteData(siteTableFilter?.getAllSites?.data);
    setSiteObj({ site: userSite, })
  }, [siteTableFilter, userSite])


  useEffect(() => {
    setSiteObj({ site: userSite, })
  }, [userSite])

  const handleFilter = () => {
    setSiteObj({ site: siteId?.length > 0 ? siteId : userSite, countrycode: countryCodes, startDate, endDate })

    // setLimit(Number(limitcopy))
    setLimit(limitcopy)
  }

  const handleResetFilter = () => {
    setSiteObj({ site: userSite })
    setSumOfTwoDates(null)
    setStartDate()
    setEndDate()
    setLimit(100)
    setLimitCopy(100)

  }

  const handleUserChange = (event, newValue) => {

    const userArr = newValue?.map(data => data?.site)
    setSite(newValue)
    userArr && setSiteId(userArr)
  }

  // column

  let SiteTableColumn = [
    {
      minWidth: 300,
      field: 'site',
      headerName: 'Site',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.DOMAIN_NAME}
            </Typography>
          </Box>
        )
      }
    },

    {
      minWidth: 180,
      field: 'date',
      headerName: 'Date',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.DATE ? <Moment format='MMMM Do YYYY'>{row?.DATE}</Moment> : "--"}
          </Typography>
        )
      }
    },
    {
      minWidth: 180,
      field: 'estimatedEarning',
      headerName: 'Estimated earnings (USD)',
      align: 'right',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap align="right" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.ESTIMATED_EARNINGS}$
          </Typography>
        )
      }
    },
    {
      minWidth: 130,
      field: 'pageViews',
      headerName: 'Page views',
      align: 'right',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.PAGE_VIEWS}
          </Typography>
        )
      }
    },
    {
      minWidth: 150,
      field: 'pageRpm',
      headerName: 'Page RPM (USD)',
      align: 'right',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.PAGE_VIEWS_RPM}$
          </Typography>
        )
      }
    },
    {
      minWidth: 150,
      field: 'impressions',
      headerName: 'Impressions',
      align: 'right',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.IMPRESSIONS}
          </Typography>
        )
      }
    },
    {
      minWidth: 220,
      field: 'impressionsRpm',
      headerName: 'Impression RPM (USD)',
      align: 'right',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.IMPRESSIONS_RPM}$
          </Typography>
        )
      }
    },
    {
      minWidth: 90,
      field: 'clicks',
      headerName: 'Clicks',
      align: 'right',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.CLICKS}
          </Typography>
        )
      }
    },

  ]

  countryReport && SiteTableColumn?.push({
    minWidth: 150,
    field: 'country',
    headerName: 'country',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.COUNTRY_NAME}
          </Typography>
        </Box>
      )
    }
  },)

  useEffect(() => {

    fullReport?.getAdsenseFullReport?.YEAR_TO_DATE?.total?.length > 0 && setData(fullReport?.getAdsenseFullReport?.YEAR_TO_DATE?.total?.slice(offset, offset + pageSize));
    fullReport?.getAdsenseFullReport?.YEAR_TO_DATE?.total?.length && setTotalRow(fullReport?.getAdsenseFullReport?.YEAR_TO_DATE?.total?.length);

  }, [fullReport, offset, pageSize])


  const countries = isoCountries.all().map((countryCode) => { return { name: countryCode?.country, code: countryCode?.alpha2 } })

  const handleCountryChange = (event, newValue) => {
    const constructiondesignIdarr = newValue?.map(data => data?.code)
    constructiondesignIdarr && setCountryCodes(constructiondesignIdarr)
    setSelectedCountry(newValue)
  }

  const handleCountryReport = () => {
    setCountryReport(prev => !prev)
    setSiteObj({ site: userSite })
  }


  const [adsenseExcel] = useMutation(GENERATE_ADSENSE_EXCEL)
  
  const handleExport = async () => {

    // const newArray = fullReport?.getAdsenseFullReport?.YEAR_TO_DATE?.total.map(item => {
    //   return {
    //     "Site": item?.DOMAIN_NAME,
    //     "Country": item?.COUNTRY_NAME,
    //     "Date": item?.DATE,
    //     "Impressions": item?.IMPRESSIONS,
    //     "Clicks": item?.CLICKS,
    //     "Page views": item?.PAGE_VIEWS,
    //     "Estimated earnings (USD)": item?.ESTIMATED_EARNINGS,
    //     "Page RPM (USD)": item?.PAGE_VIEWS_RPM,
    //     "Impression RPM (USD)": item?.IMPRESSIONS_RPM,
    //     "Active View Viewable": item?.ACTIVE_VIEW_VIEWABILITY,
    //   };
    // })

    // const sheet = XLSX?.utils?.json_to_sheet(newArray);
    // const workbook = XLSX?.utils.book_new();
    // XLSX?.utils?.book_append_sheet(workbook, sheet, 'Sheet1');
    // XLSX?.writeFile(workbook, `${new Date()?.getTime()}_report.xlsx`);


    adsenseExcel({
      variables: {
        input: JSON.stringify({ site: siteId?.length > 0 ? siteId : userSite, countrycode: countryCodes })
      }
    }).then((result) => {
      toast.success("Excel")
      const link = document.createElement('a');
      link.href = `${process.env.NEXT_PUBLIC_BASE_URL}/${result?.data?.genrateAdsenseExcel}`;
      link.download = result?.data?.genrateAdsenseExcel;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);


    }).catch((error) => {
      console.log("🚀 ~ file: Livereport.js:333 ~ handleExport ~ error:", error)
      toast.error(error?.message)
    })

  }

  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }


  if (siteTableError?.message) {
    return <div>
      <Typography variant='h4' color={"primary"} sx={{ fontWeight: "bold", textAlign: "center" }} >{siteTableError?.message}</Typography>
    </div>
  }
  else {

    return (
      <>
        <Grid container spacing={6.5}>
          <Grid item xs={12}>

            <Grid container spacing={6}>
              <Grid item xs={12} md={3} sm={6}  >
                <CardStatsHorizontalWithDetails title="Today" totalSum={sumToday} color={sumToday < sumYesterday ? 'error.main' : 'success.main'} />
              </Grid>
              <Grid item xs={12} md={3} sm={6}  >
                <CardStatsHorizontalWithDetails title="YesterDay" totalSum={sumYesterday} />
              </Grid>
              <Grid item xs={12} md={3} sm={6}  >
                <CardStatsHorizontalWithDetails title="7 Days Ago" totalSum={sumWeek} />
              </Grid>
              <Grid item xs={12} md={3} sm={6}  >
                <CardStatsHorizontalWithDetails title="This Month" totalSum={sumMonth} />
              </Grid>
              <Grid item xs={12} md={3} sm={6}  >
                <CardStatsHorizontalWithDetails title="Last Month" totalSum={previousMonthTotal} />
              </Grid>

              {sumOfTwoDates && startDate && endDate && <Grid item xs={12} md={3} sm={6}>
                <CardStatsHorizontalWithDetails startDate={startDate} endDate={endDate} totalSum={sumOfTwoDates} />
              </Grid>}

            </Grid>
          </Grid>

          {/*  */}

          <Grid item xs={12}>

            <FormControlLabel control={<Switch checked={countryReport} onChange={handleCountryReport} />} label='Country Report' />

            <Card>
              <Grid container spacing={6} item xs={12} sx={{ py: 4, px: 6, }}>

                <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', m: 5 }}>
                  <DatePickerWrapper>
                    <div>
                      <DatePicker
                        selectsRange
                        endDate={endDate}
                        selected={startDate}
                        startDate={startDate}
                        id='date-range-picker'
                        onChange={handleOnChange}
                        shouldCloseOnSelect={false}
                        popperPlacement={popperPlacement}
                        customInput={<CustomInput label='Date Range' start={startDate} end={endDate} />}
                      />
                    </div>
                  </DatePickerWrapper>


                </Box>

                {/* <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', m: 5 }}>
                  <TextField type='number' placeholder='Limit' label="Limit" value={limitcopy} onChange={(e) => setLimitCopy(e.target.value)} />
                </Box> */}

                <Grid container spacing={6} item xs={6}>

                  <Autocomplete
                    sx={{ m: 5 }}
                    fullWidth
                    multiple={true}
                    size='medium'
                    disableCloseOnSelect
                    options={siteData}
                    isOptionEqualToValue={(option, value) => {
                      return option.id === value.id
                    }}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          style={{ marginRight: 8, }}
                          checked={selected}
                        />
                        {option.site}
                      </li>
                    )}
                    onChange={handleUserChange}
                    id='autocomplete-controlled'
                    getOptionLabel={option => option.site || ''}
                    renderInput={params => <TextField  {...params} label='Select Site' onChange={(e) => setSiteSearchText(e?.target?.value)} />}
                    limitTags={2}
                  />


                  {
                    countryReport && <Autocomplete
                      fullWidth
                      sx={{ m: 5 }}
                      multiple={true}
                      defaultValue={selectedCountry}
                      disableCloseOnSelect={true}
                      options={countries}
                      isOptionEqualToValue={(option, value) => {
                        return option.code === value.code
                      }}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            style={{ marginRight: 8, }}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      )}
                      onChange={handleCountryChange}
                      id='autocomplete-controlled'
                      getOptionLabel={option => option.name || ''}
                      renderInput={params => <TextField  {...params} label='Select Country' />}
                    />
                  }




                </Grid>


                <Grid container spacing={6} item xs={6}>
                  <Box
                    sx={{
                      py: 4,
                      px: 6,
                      rowGap: 2,
                      columnGap: 4,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Button variant='contained' color={'primary'} onClick={handleFilter}>Filter</Button>

                    <Button variant='text' color={'primary'} onClick={handleResetFilter}>Reset Filter</Button>

                    <Button variant='contained' color={'primary'} onClick={handleExport}>Export</Button>
                  </Box>

                </Grid>

              </Grid>

              <Divider sx={{ m: '0 !important' }} />
              <DataGrid
                autoHeight
                paginationMode='server'
                onPageChange={page => setPageNumber(page + 1)}
                loading={fullReportLoading}
                rowHeight={62}
                rows={data}
                columns={SiteTableColumn}
                pageSize={pageSize}
                rowCount={totalRow}
                disableSelectionOnClick
                rowsPerPageOptions={[10, 25, 50, 100]}
                onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              />
            </Card>
          </Grid >

          {/*  */}
        </Grid >

        <Loader disable={siteTableLoading} />
      </>
    )
  }

}

export { siteTableRes }

export default Livereport
