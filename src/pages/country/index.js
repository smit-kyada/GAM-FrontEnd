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

// import { SiteTableColumn } from 'src/components/columns/Columns'

import AddSiteTable from 'src/views/siteTable/list/AddSiteTable'
import { Box, Typography } from '@mui/material'
import RowOptions from 'src/components/commonComponent/RowOptions'
import Moment from 'react-moment'
import { useAuth } from 'src/hooks/useAuth'
import Link from 'next/link'
import FilterComponent from 'src/components/filterComponent'
import { GET_ALL_COUNTRYTABLES } from 'src/graphql/query/countryTable'
import AddCountryTable from 'src/views/countryTable/AddCountryTable'
import TableHeader from 'src/views/countryTable/TableHeader'
import { GET_ALL_SITES } from 'src/graphql/query/site'
import UserBankAccountDialog from 'src/components/user/UserBankAccountDialog'
import BlockUserModel from 'src/components/user/BlockUserModel'

var siteTableRes

const SiteTable = () => {

    const { user } = useAuth()

    // ** State
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [data, setData] = useState([]);
    const [siteData, setSiteData] = useState([]);
    const [totalRow, setTotalRow] = useState(10)
    const [addUserOpen, setAddUserOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [sumToday, setSumToday] = useState(0)
    const [sumWeek, setSumWeek] = useState(0)
    const [sumYesterday, setSumYesterday] = useState(0)
    const [sum28Day, setSum28Day] = useState(0)
    const [sumOfTwoDates, setSumOfTwoDates] = useState(0)

    const [filter, setFilter] = useState(false)
    const [filterStatus, setFilterStatus] = useState({})

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()

    const [startDateRange, setStartDateRange] = useState(new Date())
    const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45))

    // ** Hook
    const theme = useTheme()
    const { direction } = theme
    const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

    const [handeleSiteDataSearch, setHandeleSiteDataSearch] = useState('');

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
    const { loading: siteLoading, error: siteError, data: sideData, refetch: siteRefetch } = useQuery(GET_ALL_SITES, {
        variables: { page: 1, limit: 10, search: handeleSiteDataSearch },
        fetchPolicy: "cache-and-network",
    });


    // Graphql query
    const { loading: siteTableLoading, error: siteTableError, data: siteTableData, refetch: siteTableRefetch } = useQuery(GET_ALL_COUNTRYTABLES, {
        variables: { page: pageNumber, limit: pageSize, search: searchText, startDate: startDate, endDate: endDate, filter: JSON.stringify({ ...filterStatus }) },
        fetchPolicy: "cache-and-network",
    });

    siteTableRes = siteTableRefetch

    const handleChange = e => setSearchText(e)

    useEffect(() => {
        siteTableData?.getAllCountryTables?.data && setData(siteTableData?.getAllCountryTables?.data);
        sideData?.getAllSites?.data && setSiteData(sideData?.getAllSites?.data);
        siteTableData?.getAllCountryTables?.count && setTotalRow(siteTableData?.getAllCountryTables?.count);
        siteTableData?.getAllCountryTables?.sumToday ? setSumToday(siteTableData?.getAllCountryTables?.sumToday) : setSumToday(0);
        siteTableData?.getAllCountryTables?.sumWeek ? setSumWeek(siteTableData?.getAllCountryTables?.sumWeek) : setSumWeek(0);
        siteTableData?.getAllCountryTables?.sumYesterDay ? setSumYesterday(siteTableData?.getAllCountryTables?.sumYesterDay) : setSumYesterday(0);
        siteTableData?.getAllCountryTables?.sum28Day ? setSum28Day(siteTableData?.getAllCountryTables?.sum28Day) : setSum28Day(0);
        siteTableData?.getAllCountryTables?.sumOfTwoDates ? setSumOfTwoDates(siteTableData?.getAllCountryTables?.sumOfTwoDates) : setSumOfTwoDates(0);
    }, [siteTableData, sideData])

    const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)


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
            field: 'country',
            headerName: 'Country',
            renderCell: ({ row }) => {

                return (
                    <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                        {row?.country}
                    </Typography>
                )
            }
        },
        {
            minWidth: 140,
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
            minWidth: 100,
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
            minWidth: 160,
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
                        {/* <Grid item xs={12} md={3} sm={6} >
              <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <DatePickerWrapper sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }} >
                    <DatePicker
                      selectsRange
                      endDate={endDate}
                      selected={startDate}
                      startDate={startDate}
                      id='date-range-picker'
                      onChange={handleOnChange}
                      shouldCloseOnSelect={false}
                      popperPlacement={popperPlacement}
                      customInput={<CustomInput label='Select Date Range' start={startDate} end={endDate} />}
                    />
                </DatePickerWrapper>
              </Box>
            </Grid> */}
                        {startDate && endDate && <Grid item xs={12} md={3} sm={6} >
                            <CardStatsHorizontalWithDetails startDate={startDate} endDate={endDate} totalSum={sumOfTwoDates} />
                        </Grid>}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <Divider sx={{ m: '0 !important' }} />
                        <TableHeader setFilterStatus={setFilterStatus} filter={filter} setFilter={setFilter} toggle={toggleAddUserDrawer} startDate={startDate} setStartDate={setStartDate} endDate={endDate}
                            setEndDate={setEndDate} handleChange={handleChange} siteTableRefetch={siteTableRefetch} For='CountrySiteTable' />
                        <Divider sx={{ m: '0 !important' }} />

                        <Box>{filter && <FilterComponent setFilter={setFilter} setFilterStatus={setFilterStatus} data={siteData} setHandeleSiteDataSearch={setHandeleSiteDataSearch} />}</Box>

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
                    {addUserOpen && <AddCountryTable open={addUserOpen} toggle={toggleAddUserDrawer} siteTableRefetch={siteTableRefetch} />}
                </Grid>
            </Grid>

            <UserBankAccountDialog />
            <BlockUserModel/>
        </>
    )
}

export { siteTableRes }

SiteTable.acl = {
    action: 'read',
    subject: 'country'
}

export default SiteTable
