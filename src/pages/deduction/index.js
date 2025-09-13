import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'

import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Custom Component Imports

import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import addDays from 'date-fns/addDays'

// ** graphQl
import { useQuery } from '@apollo/client'
import { GET_ALL_SITETABLES } from "src/graphql/query/siteTable"

//**custom component */

import AddSiteTable from 'src/views/siteTable/list/AddSiteTable'
import TableHeader from 'src/views/siteTable/list/TableHeader'
import { Box, CardContent, Typography } from '@mui/material'
import RowOptions from 'src/components/commonComponent/RowOptions'
import Moment from 'react-moment'
import { useAuth } from 'src/hooks/useAuth'
import Link from 'next/link'
import { GET_ALL_DEDUCTIONS } from 'src/graphql/query/deduction'
import DeductionTableHeader from 'src/views/deduction/DeductionTableHeader'

var deductionRes

const SiteTable = () => {

  const { user } = useAuth()

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [sumToday, setSumToday] = useState(0)
  const [sumWeek, setSumWeek] = useState(0)
  const [sumYesterday, setSumYesterday] = useState(0)
  const [sum28Day, setSum28Day] = useState(0)
  const [sumOfTwoDates, setSumOfTwoDates] = useState(0)
  const [total, setTotal] = useState(0)
  const [deduction, setDeduction] = useState(0)

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45))

  // ** Hook
  const theme = useTheme()
  const { direction } = theme

  // const handleOnChange = dates => {
  //   null
  //   const [start, end] = dates
  //   setStartDate(start)
  //   setEndDate(end)
  // }

  // const handleOnChangeRange = dates => {
  //   const [start, end] = dates
  //   setStartDateRange(start)
  //   setEndDateRange(end)
  // }

  // const CustomInput = forwardRef((props, ref) => {
  //   const startDate = format(props.start, 'MM/dd/yyyy')
  //   const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
  //   const value = `${startDate}${endDate !== null ? endDate : ''}`

  //   return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
  // })


  // Graphql query
  const { loading: deductionLoading, error: deductionError, data: deductionData, refetch: DeductionRefetch } = useQuery(GET_ALL_DEDUCTIONS, {
    variables: { page: pageNumber, limit: pageSize, search: searchText, startDate: startDate, endDate: endDate },
    fetchPolicy: "cache-and-network",
  });

  deductionRes = DeductionRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    deductionData?.getAllDeduction?.data && setData(deductionData?.getAllDeduction?.data);
    deductionData?.getAllDeduction?.count && setTotalRow(deductionData?.getAllDeduction?.count);
    deductionData?.getAllDeduction?.totalErnings ? setTotal(deductionData?.getAllDeduction?.totalErnings) : setTotal(0);
    deductionData?.getAllDeduction?.totalDeduction ? setDeduction(deductionData?.getAllDeduction?.totalDeduction) : setDeduction(0);

    // deductionData?.getAllDeduction?.sumToday ? setSumToday(deductionData?.getAllDeduction?.sumToday) : setSumToday(0);
    // deductionData?.getAllDeduction?.sumWeek ? setSumWeek(deductionData?.getAllDeduction?.sumWeek) : setSumWeek(0);
    // deductionData?.getAllDeduction?.sumYesterDay ? setSumYesterday(deductionData?.getAllDeduction?.sumYesterDay) : setSumYesterday(0);

    // deductionData?.getAllDeduction?.sumOfTwoDates ? setSumOfTwoDates(deductionData?.getAllDeduction?.sumOfTwoDates) : setSumOfTwoDates(0);
  }, [deductionData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)


  let DeductionColumn = [

    {
      minWidth: 400,
      field: 'site',
      headerName: 'Site',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.site_link}
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
      minWidth: 250,
      field: 'estimatedEarning',
      headerName: 'Estimated earnings (USD)',
      align: 'right',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap variant='h5' sx={{ color: "warning.main", textTransform: 'capitalize' }}>
            {(row?.SiteTableData)?.toFixed(2)}$
          </Typography>
        )
      }
    },
    {
      minWidth: 130,
      field: 'deduction',
      headerName: 'Deduction',
      align: 'right',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap variant='h5' sx={{ color: 'error.main', textTransform: 'capitalize' }}>
            {(row?.deduction)?.toFixed(2)}$
          </Typography>
        )
      }
    },
    {
      minWidth: 130,
      field: 'total',
      headerName: 'Total',
      align: 'right',
      renderCell: ({ row }) => {

        return (
          <Typography noWrap variant='h5' sx={{ color: 'success.main', textTransform: 'capitalize' }}>
            {(row?.SiteTableData - row?.deduction)?.toFixed(2)}$
          </Typography>
        )
      }
    },
  ]

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={3} sm={6} >

              {/* <CardStatsHorizontalWithDetails title="Today" totalSum={sumToday} /> */}
              <Card>
                <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ mb: 1, columnGap: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography >Estimated earning</Typography>
                    </Box>
                    <Typography sx={{ color: 'warning.main' }} variant='h5'>
                      {(total)?.toFixed(2)} $
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

            </Grid>

            <Grid item xs={12} md={3} sm={6} >
              {/* <CardStatsHorizontalWithDetails title="YesterDay" totalSum={sumYesterday} /> */}
              <Card>
                <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ mb: 1, columnGap: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography >Deduction</Typography>
                    </Box>
                    <Typography sx={{ color: 'error.main' }} variant='h5'>
                      {(deduction)?.toFixed(2)} $
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={3} sm={6} >
              {/* <CardStatsHorizontalWithDetails title="Last 7 Days" totalSum={sumWeek} /> */}
              <Card>
                <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Box sx={{ mb: 1, columnGap: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography >Total earning</Typography>
                    </Box>
                    <Typography sx={{ color: 'success.main' }} variant='h5'>
                      {(total - deduction)?.toFixed(2)} $
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="Last 28 Days" totalSum={sum28Day} />
            </Grid> */}

            {/* {startDate && endDate && <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails startDate={startDate} endDate={endDate} totalSum={sumOfTwoDates} />
            </Grid>} */}

          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />
            <DeductionTableHeader toggle={toggleAddUserDrawer} startDate={startDate} setStartDate={setStartDate} endDate={endDate}
              setEndDate={setEndDate} handleChange={handleChange} DeductionRefetch={DeductionRefetch} For='Deduction' />
            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={deductionLoading}
              rowHeight={62}
              rows={data}
              columns={DeductionColumn}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
          {addUserOpen && <AddSiteTable open={addUserOpen} toggle={toggleAddUserDrawer} DeductionRefetch={DeductionRefetch} />}
        </Grid>
      </Grid>
    </>
  )
}

export { deductionRes }

SiteTable.acl = {
  action: 'read',
  subject: 'deduction-p'
}

export default SiteTable
