import { useQuery } from '@apollo/client'
import { Autocomplete, Box, Button, Card, Checkbox, Divider, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import Moment from 'react-moment'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import Loader from 'src/components/loader/loader'
import { GET_ADSENSE_FULL_REPORT, GET_ADSENSE_FULL_SITE_REPORT, GET_ADSENSE_SITE_TOTAL_REPORT } from 'src/graphql/query/adsense'
import isoCountries from 'iso-3166-1'
import * as XLSX from 'xlsx'

var siteTableRes

const SiteTable = () => {

  // ** State
  const [sumToday, setSumToday] = useState(0)
  const [sumWeek, setSumWeek] = useState(0)
  const [sumYesterday, setSumYesterday] = useState(0)
  const [sumMonth, setSumMonth] = useState(0)
  const [previousMonthTotal, setPreviousMonthTotal] = useState(0)



  const [data, setData] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [totalRow, setTotalRow] = useState(10)
  const [siteObj, setSiteObj] = useState({})
  const [countryReport, setCountryReport] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState([])
  const [countryCodes, setCountryCodes] = useState([])


  const offset = (pageNumber - 1) * pageSize;

  // adsense data

  const { loading: siteTableLoading, error: siteTableError, data: adsenseReportData, refetch: siteTableRefetch } = useQuery(GET_ADSENSE_SITE_TOTAL_REPORT, {
    variables: { filter: JSON.stringify(siteObj) },
    fetchPolicy: "cache-and-network",
  });

  const { loading: fullReportLoading, error: fullReportError, data: fullReport, refetch: fullReportRefetch } = useQuery(GET_ADSENSE_FULL_SITE_REPORT, {
    variables: { filter: JSON.stringify(siteObj) },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {

    !siteTableLoading && setSumToday(Number(adsenseReportData?.getAdsenseSiteTotalReport?.TODAY?.total?.ESTIMATED_EARNINGS || 0))
    !siteTableLoading && setSumYesterday(Number(adsenseReportData?.getAdsenseSiteTotalReport?.YESTERDAY?.total?.ESTIMATED_EARNINGS || 0))
    !siteTableLoading && setSumWeek(Number(adsenseReportData?.getAdsenseSiteTotalReport?.LAST_7_DAYS?.total?.ESTIMATED_EARNINGS || 0))
    !siteTableLoading && setSumMonth(Number(adsenseReportData?.getAdsenseSiteTotalReport?.MONTH_TO_DATE?.total?.ESTIMATED_EARNINGS || 0))
    !siteTableLoading && setPreviousMonthTotal(Number(adsenseReportData?.getAdsenseSiteTotalReport?.LAST_MONTH?.total?.ESTIMATED_EARNINGS || 0))

  }, [adsenseReportData, siteTableLoading])


  useEffect(() => {

    fullReport?.getAdsenseFullSiteReport?.YEAR_TO_DATE?.total?.length > 0 && setData(fullReport?.getAdsenseFullSiteReport?.YEAR_TO_DATE?.total?.slice(offset, offset + pageSize));
    fullReport?.getAdsenseFullSiteReport?.YEAR_TO_DATE?.total?.length && setTotalRow(fullReport?.getAdsenseFullSiteReport?.YEAR_TO_DATE?.total?.length);

  }, [fullReport, offset, pageSize])

  const countries = isoCountries.all().map((countryCode) => { return { name: countryCode?.country, code: countryCode?.alpha2 } })


  const handleCountryChange = (event, newValue) => {
    const constructiondesignIdarr = newValue?.map(data => data?.code)
    constructiondesignIdarr && setCountryCodes(constructiondesignIdarr)
    setSelectedCountry(newValue)
  }

  const handleFilter = () => {
    setSiteObj({ countrycode: countryCodes })
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
    {
      minWidth: 150,
      field: 'country',
      headerName: 'country code',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.COUNTRY_NAME}
            </Typography>
          </Box>
        )
      }
    }

  ]

  const handleExport = () => {

    const newArray = fullReport?.getAdsenseFullSiteReport?.YEAR_TO_DATE?.total.map(item => {
      return {
        "Site": item?.DOMAIN_NAME,
        "Country": item?.COUNTRY_NAME,
        "Date": item?.DATE,
        "Impressions": item?.IMPRESSIONS,
        "Clicks": item?.CLICKS,
        "Page views": item?.PAGE_VIEWS,
        "Estimated earnings (USD)": item?.ESTIMATED_EARNINGS,
        "Page RPM (USD)": item?.PAGE_VIEWS_RPM,
        "Impression RPM (USD)": item?.IMPRESSIONS_RPM,
        "Active View Viewable": item?.ACTIVE_VIEW_VIEWABILITY,
      };
    })

    const sheet = XLSX?.utils?.json_to_sheet(newArray);
    const workbook = XLSX?.utils.book_new();
    XLSX?.utils?.book_append_sheet(workbook, sheet, 'Sheet1');
    XLSX?.writeFile(workbook, `${new Date()?.getTime()}_report.xlsx`);
  }

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>

          <Grid container spacing={6}>
            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="Today" totalSum={sumToday} color={sumToday < sumYesterday ? 'error.main' : 'success.main'} />
            </Grid>
            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="YesterDay" totalSum={sumYesterday} />
            </Grid>
            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="7 Days Ago" totalSum={sumWeek} />
            </Grid>
            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="This Month" totalSum={sumMonth} />
            </Grid>
            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="Last Month" totalSum={previousMonthTotal} />
            </Grid>
          </Grid>

        </Grid>

      </Grid >




      <Grid item xs={12} sx={{ py: 4 }}>
        <Card>
          <Grid container spacing={6} item xs={12} sx={{ py: 4, px: 6, }}>
            <Grid container spacing={6} item xs={6}>
              <Autocomplete
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
      </Grid>





      <Loader disable={siteTableLoading} />
    </>
  )
}

export { siteTableRes }

SiteTable.acl = {
  action: 'read',
  subject: 'sitereport-p'
}

export default SiteTable
