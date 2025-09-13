import React from 'react'
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'

import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Next Import
import { useRouter } from 'next/router'
import { SiteTableDetailColumn } from 'src/components/columns/Columns'
import TableHeader from 'src/views/siteDetail/list/TableHeader'
import AddSite from 'src/views/siteDetail/list/AddSite'

// ** graphQl
import { useQuery } from '@apollo/client'
import { GET_SITETABLE } from "src/graphql/query/siteTable"
import { GET_USER } from 'src/graphql/query/user'
import Error401 from 'src/pages/401'

const SiteDetail = () => {

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [sumToday, setSumToday] = useState(0)
  const [sumWeek, setSumWeek] = useState(0)
  const [sumYesterday, setSumYesterday] = useState(0)
  const [sum28Day, setSum28Day] = useState(0)
  const [users, setUsers] = useState({})
  const [addUserOpen, setAddUserOpen] = useState(false)

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const router = useRouter()
  const { index } = router.query
  const [title, setTitle] = useState()

  let Obj = { page: pageNumber, limit: pageSize, startDate: startDate, endDate: endDate }

  if (index?.includes(".")) {
    Obj.site = index
  } else {
    Obj.siteId = index

    // setTitle(index)
  }

  // Graphql query
  const { loading: siteTableLoading, error: siteTableError, data: siteTableData, refetch: siteTableRefetch } = useQuery(GET_SITETABLE, {
    variables: Obj,
    fetchPolicy: "cache-and-network",
  });


  // const { loading: userLoading, error: userError, data: userData, refetch: userRefetch } = useQuery(GET_USER, {
  //   variables: { getUserId: index },
  //   fetchPolicy: "cache-and-network",
  // });

  useEffect(() => {
    siteTableData?.getSiteTable?.data && setData(siteTableData?.getSiteTable?.data)
    siteTableData?.getSiteTable?.count && setTotalRow(siteTableData?.getSiteTable?.count);
    siteTableData?.getSiteTable?.sumToday ? setSumToday(siteTableData?.getSiteTable?.sumToday) : setSumToday(0);
    siteTableData?.getSiteTable?.sumWeek ? setSumWeek(siteTableData?.getSiteTable?.sumWeek) : setSumWeek(0);
    siteTableData?.getSiteTable?.sumYesterDay ? setSumYesterday(siteTableData?.getSiteTable?.sumYesterDay) : setSumYesterday(0);
    siteTableData?.getSiteTable?.sum28Day ? setSum28Day(siteTableData?.getSiteTable?.sum28Day) : setSum28Day(0);
  }, [siteTableData])

  // useEffect(() => {
  //   userData?.getUser && setUsers(userData?.getUser)
  // }, [userData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  if (siteTableError?.message === "\"You Are Not Authenticate\"") return <Error401 />

  return (
    <>
      <Typography variant='h5' sx={{ textTransform: 'capitalize', mb: 5 }}>
        {/* {users?.userName || title} */}
      </Typography>
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
              <CardStatsHorizontalWithDetails title="7 Days Ago" totalSum={sumWeek} />
            </Grid>

            <Grid item xs={12} md={3} sm={6} >
              <CardStatsHorizontalWithDetails title="28 Days Ago" totalSum={sum28Day} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ mt: 5 }}>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader startDate={startDate} setStartDate={setStartDate} endDate={endDate}
            setEndDate={setEndDate} toggle={toggleAddUserDrawer} userId={Obj?.siteId} />
          <Divider sx={{ m: '0 !important' }} />
          <DataGrid
            autoHeight
            paginationMode='server'
            onPageChange={page => setPageNumber(page + 1)}
            loading={siteTableLoading}
            rowHeight={62}
            rows={data}
            columns={SiteTableDetailColumn}
            pageSize={pageSize}
            rowCount={totalRow}
            disableSelectionOnClick
            rowsPerPageOptions={[10, 25, 50, 100]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          />

          {addUserOpen && <AddSite open={addUserOpen} toggle={toggleAddUserDrawer} siteRefetch={siteTableRefetch} userId={Obj?.userId} />}
        </Card>
      </Grid>
    </>
  )
}


SiteDetail.acl = {
  action: 'read',
  subject: 'siteDetail-p'
}

export default SiteDetail
