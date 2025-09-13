import { useQuery } from '@apollo/client'
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import { forwardRef, useEffect, useState } from 'react'
import Moment from 'react-moment'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import RowOptions from 'src/components/commonComponent/RowOptions'
import { GET_ALL_SITETABLES } from "src/graphql/query/siteTable"
import { useAuth } from 'src/hooks/useAuth'
import AddSiteTable from 'src/views/siteTable/list/AddSiteTable'
import TableHeader from 'src/views/siteTable/list/TableHeader'
import { useTheme } from '@emotion/react'
import { Icon } from '@iconify/react'



const CustomInput = forwardRef((props, ref) => {
  const startDate = props?.start ? `${format(props?.start, 'MM/dd/yyyy')}` : null
  const endDate = props?.end ? ` - ${format(props?.end, 'MM/dd/yyyy')}` : null
  const value = `${startDate ? startDate : ''}${endDate ? endDate : ''}`

  return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
})


var siteTableRes

const SiteTable = () => {

  const { user } = useAuth()

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [siteSearchText, setSiteSearchText] = useState("")
  const [sumToday, setSumToday] = useState(0)
  const [sumWeek, setSumWeek] = useState(0)
  const [sumYesterday, setSumYesterday] = useState(0)
  const [sum28Day, setSum28Day] = useState(0)
  const [sumOfTwoDates, setSumOfTwoDates] = useState(null)
  const [startDate, setStartDate] = useState()
  const [filterstartDate, setFilterStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [filterendDate, setFilterEndDate] = useState()
  const [site, setSite] = useState('')
  const [siteId, setSiteId] = useState('')
  const [siteData, setSiteData] = useState([])
  const [siteObj, setSiteObj] = useState({})


  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'




  // Graphql query
  const { loading: siteTableLoading, error: siteTableError, data: siteTableData, refetch: siteTableRefetch } = useQuery(GET_ALL_SITETABLES, {
    variables: { page: pageNumber, limit: pageSize, search: searchText, startDate: filterstartDate, endDate: filterendDate, filter: JSON.stringify(siteObj) },
    fetchPolicy: "cache-and-network",
  });



  const { loading: siteTableFilterLoading, error: siteTableFilterError, data: siteTableFilter, refetch: siteTableFilterRefetch } = useQuery(GET_ALL_SITETABLES, {
    variables: { page: 1, limit: 10, search: siteSearchText },
    fetchPolicy: "cache-and-network",
  });


  siteTableRes = siteTableRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    siteTableData?.getAllSiteTables?.data && setData(siteTableData?.getAllSiteTables?.data);
    siteTableData?.getAllSiteTables?.count && setTotalRow(siteTableData?.getAllSiteTables?.count);
    siteTableData?.getAllSiteTables?.sumToday ? setSumToday(siteTableData?.getAllSiteTables?.sumToday) : setSumToday(0);
    siteTableData?.getAllSiteTables?.sumWeek ? setSumWeek(siteTableData?.getAllSiteTables?.sumWeek) : setSumWeek(0);
    siteTableData?.getAllSiteTables?.sumYesterDay ? setSumYesterday(siteTableData?.getAllSiteTables?.sumYesterDay) : setSumYesterday(0);
    siteTableData?.getAllSiteTables?.sum28Day ? setSum28Day(siteTableData?.getAllSiteTables?.sum28Day) : setSum28Day(0);
    siteTableData?.getAllSiteTables?.sumOfTwoDates ? setSumOfTwoDates(siteTableData?.getAllSiteTables?.sumOfTwoDates) : setSumOfTwoDates(0);

    // siteTableFilter?.getAllSiteTables?.data?.length > 0 && setSiteData(siteTableFilter?.getAllSiteTables?.data);
    siteTableFilter?.getAllSiteTables?.data?.length > 0 && setSiteData(siteTableFilter?.getAllSiteTables?.data?.reduce((acc, item) => {
      if (!acc?.some(site => site?.site === item?.site)) { acc?.push(item) }

      return acc;

    }, []));

  }, [siteTableData, siteTableFilter])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  const handleUserChange = (event, newValue) => {
    setSite(newValue)
    setSiteId(newValue?.site)
  }


  const handleFilter = () => {
    setSiteObj({ sitename: site?.site })
    startDate && setFilterStartDate(startDate)
    endDate && setFilterEndDate(endDate)
  }

  const hadleSiteSearch = (e) => {
    setSiteSearchText(e?.target?.value)
  }

  let SiteTableColumn = [

    {
      minWidth: 300,
      field: 'site',
      headerName: 'Site',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.site}
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
            {row?.date ? <Moment format='MMMM Do YYYY'>{row?.date}</Moment> : "--"}
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
            {row?.estimatedEarning}$
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
            {row?.pageViews}
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
            {row?.pageRpm}$
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
            {row?.impressions}
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
            {row?.impressionsRpm}$
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
            {row?.clicks}
          </Typography>
        )
      }
    },

  ]

  {
    user?.role == "admin" && SiteTableColumn?.push(
      {
        minWidth: 100,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }) => <RowOptions userData={row} refetch={siteTableRes} For='SiteTable' />
      }
    )
  }


  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }


  const handleResetFilter = () => {
    setSiteObj({})
    setStartDate()
    setFilterStartDate()
    setEndDate()
    setFilterEndDate()
    setSumOfTwoDates()
  }



  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="Today" totalSum={sumToday} />

            </Grid>

            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="YesterDay" totalSum={sumYesterday} />
            </Grid>

            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="Last 7 Days" totalSum={sumWeek} />
            </Grid>

            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="Last 28 Days" totalSum={sum28Day} />
            </Grid>

            {startDate && endDate && sumOfTwoDates ? <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails startDate={startDate} endDate={endDate} totalSum={sumOfTwoDates} />
            </Grid> : ""}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card>

            <Divider sx={{ m: '0 !important' }} />

            <TableHeader toggle={toggleAddUserDrawer} startDate={startDate} setStartDate={setStartDate} endDate={endDate}
              setEndDate={setEndDate} handleChange={handleChange} siteTableRefetch={siteTableRefetch} For='SiteTable' />

            <Divider sx={{ m: '0 !important' }} />

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


              <Grid container spacing={6} item xs={6}>
                <Autocomplete
                  sx={{ m: 5 }}
                  fullWidth
                  value={site}
                  options={siteData}
                  onChange={handleUserChange}
                  id='autocomplete-controlled'
                  renderOption={(props, option) => {
                    if (option?.site) {
                      return (
                        <li {...props} key={option.id}>
                          {option?.site}
                        </li>
                      );
                    }
                  }}
                  getOptionLabel={option => option.site || ""}
                  renderInput={params => <TextField  {...params} label='Select Site' onChange={hadleSiteSearch} />}
                />
              </Grid>

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
                <Button
                  variant='text' color='primary' sx={{ ml: 3 }} startIcon={<Icon icon='system-uicons:reset-alt' />}
                  component="label" onClick={handleResetFilter} >
                  Reset Filter
                </Button>

              </Box>



            </Grid>


            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={siteTableLoading}
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
          {addUserOpen && <AddSiteTable open={addUserOpen} toggle={toggleAddUserDrawer} siteTableRefetch={siteTableRefetch} />}
        </Grid>
      </Grid>
    </>
  )
}

export { siteTableRes }

SiteTable.acl = {
  action: 'read',
  subject: 'siteTable-p'
}

export default SiteTable
