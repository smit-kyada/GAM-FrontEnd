import { forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'

import { Checkbox, Dialog, DialogContent } from "@mui/material"
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'

// ** graphQl
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_SITES, GET_ALOT_SITE_BOOLEAN, GET_NOT_ALLOT_SITE } from 'src/graphql/query/site'
import { GET_ALL_SITETABLES, GET_USER_SITETABLE_REPORT } from "src/graphql/query/siteTable"

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

//**custom component */
import { SiteTableColumn } from 'src/components/columns/Columns'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import { useTheme } from '@emotion/react'
import { Autocomplete, Box, Button, CardContent, FormControl, Icon, TextField, Typography } from '@mui/material'
import { UPDATE_USER_SITE } from 'src/graphql/mutation/site'
import { useAuth } from 'src/hooks/useAuth'
import TableHeader from 'src/views/report/list/TableHeader'
import * as XLSX from "xlsx"
import UserBankAccountDialog from 'src/components/user/UserBankAccountDialog'
import BlockUserModel from 'src/components/user/BlockUserModel'

var siteTableRes

const SiteTable = () => {

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("");
  const [column, setColumn] = useState(SiteTableColumn);
  const [sumToday, setSumToday] = useState(0)
  const [sumWeek, setSumWeek] = useState(0)
  const [sumYesterday, setSumYesterday] = useState(0)
  const [sum28Day, setSum28Day] = useState(0)
  const [sumMonth, setSumMonth] = useState(0)
  const [startDate, setStartDate] = useState()
  const [filterstartDate, setFilterStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [filterendDate, setFilterEndDate] = useState()

  const [sumOfTwoDates, setSumOfTwoDates] = useState()
  const [previousMonthTotal, setPreviousMonthTotal] = useState()
  const [user, setUser] = useState('')
  const [userId, setUserId] = useState('')
  const [filteruserId, setFilterUserId] = useState([])
  const [userData, setUserData] = useState([])

  const [open, setOpen] = useState()
  const [allMessage, setAllMessage] = useState([])
  const [messageId, setMessageId] = useState("")
  const [messageName, setMessageName] = useState("")


  const CustomInput = forwardRef((props, ref) => {
    const startDate = props?.start ? `${format(props?.start, 'MM/dd/yyyy')}` : null
    const endDate = props?.end ? ` - ${format(props?.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate ? startDate : ''}${endDate ? endDate : ''}`

    return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  console.log("userData", userData)

  const auth = useAuth()

  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const Obj = {
    site: filteruserId
  }

  // Graphql query
  const { loading: siteTableLoading, error: siteTableError, data: siteTableData, refetch: siteTableRefetch } = useQuery(GET_USER_SITETABLE_REPORT, {
    variables: { page: pageNumber, limit: pageSize, search: searchText, startDate: filterstartDate, endDate: filterendDate, filter: JSON.stringify(Obj) },
    fetchPolicy: "cache-and-network",
  });

  const { loading: siteLoading, error: siteError, data: siteData, refetch: siteRefetch } = useQuery(GET_ALL_SITES, {
    variables: { page: pageNumber, limit: 100, search: searchText },
    fetchPolicy: "cache-and-network",
  });

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { loading: messageLoading, error: msgError, data: messageData, refetch: messageRefetch } = useQuery(GET_NOT_ALLOT_SITE, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    messageData?.getAllMessages?.data && setAllMessage(messageData?.getAllMessages?.data)
  }, [messageData])

  const { loading: alotBooleanLoading, error: alotBooleanError, data: alotBooleanData, refetch: alotsiteRefetch } = useQuery(GET_ALOT_SITE_BOOLEAN, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    messageData?.getNotAllotedSite && setAllMessage(messageData?.getNotAllotedSite)
    alotBooleanData?.getAlotSiteBoolean && setOpen(alotBooleanData?.getAlotSiteBoolean)
  }, [messageData, alotBooleanData])

  const handleMessageChange = (event, newValue) => {
    setMessageId(newValue?.id)
    setMessageName(newValue)
  }

  const [upDateSite] = useMutation(UPDATE_USER_SITE)

  const sendMessage = async () => {
    await upDateSite({
      variables: {
        "input": {
          "id": messageId
        }
      }
    })
      .then(res => {
        setOpen(false)
        toast.success("sucessfully updated!")
      })
      .catch(err => console.log(err))
  }


  siteTableRes = siteTableRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    siteTableData?.getUserSiteTableReport?.data && setData(siteTableData?.getUserSiteTableReport?.data)
    siteTableData?.getUserSiteTableReport?.count && setTotalRow(siteTableData?.getUserSiteTableReport?.count);
    siteTableData?.getUserSiteTableReport?.sumToday ? setSumToday(siteTableData?.getUserSiteTableReport?.sumToday) : setSumToday(0);
    siteTableData?.getUserSiteTableReport?.sumWeek ? setSumWeek(siteTableData?.getUserSiteTableReport?.sumWeek) : setSumWeek(0);
    siteTableData?.getUserSiteTableReport?.sumYesterDay ? setSumYesterday(siteTableData?.getUserSiteTableReport?.sumYesterDay) : setSumYesterday(0);
    siteTableData?.getUserSiteTableReport?.sum28Day ? setSum28Day(siteTableData?.getUserSiteTableReport?.sum28Day) : setSum28Day(0);
    siteTableData?.getUserSiteTableReport?.sumMonth ? setSumMonth(siteTableData?.getUserSiteTableReport?.sumMonth) : setSumMonth(0);
    siteTableData?.getUserSiteTableReport?.sumOfTwoDates ? setSumOfTwoDates(siteTableData?.getUserSiteTableReport?.sumOfTwoDates) : setSumOfTwoDates(0);
    siteTableData?.getUserSiteTableReport?.previousMonthTotal ? setPreviousMonthTotal(siteTableData?.getUserSiteTableReport?.previousMonthTotal) : setPreviousMonthTotal(0);
  }, [siteTableData])

  useEffect(() => {
    siteData?.getAllSites?.data && setUserData(siteData?.getAllSites?.data)
  }, [siteData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  // SiteTableColumn

  useEffect(() => {
    setColumn(SiteTableColumn?.filter(d => d?.field !== "actions"))
  }, [])

  // SiteTableColumn?.filter((d) => {
  //   if (d?.field !== "actions") return d;
  // })

  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const handleUserChange = (event, newValue) => {

    // setUser(newValue)
    // setUserId(newValue?.site)

    const userArr = newValue?.map(data => data?.site)
    userArr && setUserId(userArr)
    setUser(newValue)
  }


  const handleFilter = () => {

    userId && setFilterUserId(userId)
    startDate && setFilterStartDate(startDate)
    endDate && setFilterEndDate(endDate)

    // setStartDate()
    // setEndDate()
  }

  const handleResetFilter = () => {
    setStartDate()
    setFilterStartDate()
    setEndDate()
    setFilterEndDate()
    setFilterUserId()
    setUserId('')
    setUser('')
    setSumOfTwoDates()
  }



  const DownloadRemittanceExcel = (siteData) => {

    let Allsite = siteData.map(item => {

      return {
        [`Site`]: item?.site,
        [`Date`]: item?.date?.split("T")?.[0],
        [`Estimated earnings (USD)`]: item?.estimatedEarning,
        [`Page views`]: item?.pageViews,
        [`Page RPM (USD)`]: item?.pageRpm,
        [`Impressions`]: item?.impressions,
        [`Impression RPM (USD)`]: item?.impressionsRpm,
        [`Active View Viewable`]: item?.activeViewViewable,
        [`Clicks`]: item?.clicks,
      };
    })



    const sheet = XLSX?.utils?.json_to_sheet(Allsite);
    const workbook = XLSX?.utils.book_new();
    XLSX?.utils?.book_append_sheet(workbook, sheet, 'Sheet1');
    XLSX?.writeFile(workbook, `${new Date()?.getTime()}_Report.xlsx`);

  };

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>

          <Grid container spacing={6}>
            <Grid item xs={12} md={2.3} sm={6} >
              <CardStatsHorizontalWithDetails title="Today" totalSum={sumToday} color={sumToday < sumYesterday ? 'error.main' : 'success.main'} />
            </Grid>
            <Grid item xs={12} md={2.3} sm={6} >
              <CardStatsHorizontalWithDetails title="YesterDay" totalSum={sumYesterday} />
            </Grid>
            <Grid item xs={12} md={2.3} sm={6} >
              <CardStatsHorizontalWithDetails title="7 Days Ago" totalSum={sumWeek} />
            </Grid>
            <Grid item xs={12} md={2.3} sm={6} >
              <CardStatsHorizontalWithDetails title="This Month" totalSum={sumMonth} />
            </Grid>
            <Grid item xs={12} md={2.3} sm={6} >
              <CardStatsHorizontalWithDetails title="Last Month" totalSum={previousMonthTotal} />
            </Grid>
          </Grid>
        </Grid>


        <Grid item xs={12}>
          <Card>

            <CardContent>
              {/* {sumOfTwoDates && <Typography
                sx={{ color: sumOfTwoDates <= 0 ? 'error.main' : 'success.main', mb: 5 }} variant='h5'
              >{`${sumOfTwoDates.toFixed(2)} $`}</Typography>} */}

              <Grid container spacing={6} item xs={12}>

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
                  {/* <Autocomplete
                    sx={{ m: 5 }}
                    fullWidth
                    value={user}
                    options={userData}
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
                    renderInput={params => <TextField  {...params} label='Select Site' />}
                  /> */}

                  <Autocomplete
                    sx={{ m: 5 }}
                    fullWidth
                    multiple={true}
                    disableCloseOnSelect
                    options={userData}
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
                    renderInput={params => <TextField  {...params} label='Select Site' />}
                    limitTags={2}
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
                  <Button color='error' variant='contained'
                    onClick={() => DownloadRemittanceExcel(data)} size='medium'>
                    Export
                  </Button>
                </Box>



              </Grid>



            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} siteTableRefetch={siteTableRefetch} For='SiteTable' sumOfTwoDates={sumOfTwoDates} />
            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={siteTableLoading}
              rowHeight={62}
              rows={data}
              columns={column}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
        </Grid>
      </Grid >


      {auth?.isBankAccount?.IsUserBankAcc && auth?.user?.role == "client" && auth?.user?.block == false && <Dialog
        open={open}

        // onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' align="center">
            Alot Site
          </Typography>
          {/* <CustomCloseButton aria-label='close' onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton> */}
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important` }}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Autocomplete
              fullWidth
              value={messageName}
              options={allMessage}
              onChange={handleMessageChange}
              id='autocomplete-controlled'
              renderOption={(props, option) => {
                if (option.site) {
                  return (
                    <li {...props} key={option.id}>
                      {option.site}
                    </li>
                  );
                }
              }}
              getOptionLabel={option => option.site || ""}
              renderInput={params => <TextField  {...params} label='Select Site' />}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button variant='text' color='warning' onClick={sendMessage}>Alot</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>}

      <UserBankAccountDialog />
      <BlockUserModel/>

    </>
  )
}

export { siteTableRes }

SiteTable.acl = {
  action: 'read',
  subject: 'report-p'
}

export default SiteTable
