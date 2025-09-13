import React from 'react'
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'


// ** graphQl
import { useQuery } from '@apollo/client'
import { GET_ALL_GAMEUSER, GET_HOMESUBSCRIBER } from 'src/graphql/query/gameUser'

//**custom component */
import { gameUserColumn } from 'src/components/columns/Columns'

import TableHeader from 'src/views/gameUser/list/TableHeader'

// ** hooks
import { useSocket } from 'src/hooks/userSocket'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'
import { useAuth } from 'src/hooks/useAuth'
import CardStatsHorizontalWithDetailsGameUser from 'src/components/gameUser/cardGameUser'


var gameUserRes

const Index = () => {

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [isOnline, setIsOnline] = useState("")
  const [isSubscribe, setIsSubscribe] = useState("")
  const [empty, setEmpty] = useState("")

  const [totalUser, setTotalUser] = useState(0);

  const [totalGameUser, setTotalGameUser] = useState(0)
  const [totalSubscriber, setTotalSubscriber] = useState(0)

  const { Socket } = useSocket();
  const { user } = useAuth();

  // Graphql query
  const { loading: gameUsersLoading, error: gameUsersError, data: gameUsersData, refetch: gameUsersRefetch } = useQuery(GET_HOMESUBSCRIBER, {
    variables: { page: 1, limit: [] },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    gameUsersData?.getAllSubscribers?.count && setTotalGameUser(gameUsersData?.getAllSubscribers?.count);
    gameUsersData?.getAllSubscribers?.totalSubscribers && setTotalSubscriber(gameUsersData?.getAllSubscribers?.totalSubscribers);
  }, [gameUsersData])



  // Graphql query
  const { loading: gameUserLoading, error: gameUserError, data: gameUserData, refetch: gameUserRefetch } = useQuery(GET_ALL_GAMEUSER, {
    variables: { page: pageNumber, limit: pageSize, search: searchText, endTime: empty, filter: JSON.stringify({ online: isOnline , Subscribe : isSubscribe}) },
    fetchPolicy: "cache-and-network",
  });

  gameUserRes = gameUserRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    gameUserData?.getAllGameUsers?.data && setData(gameUserData?.getAllGameUsers?.data)
    gameUserData?.getAllGameUsers?.count && setTotalRow(gameUserData?.getAllGameUsers?.count);

  }, [gameUserData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  useEffect(() => {
    if (user?.role == "admin") {
      Socket.on("totalConnectUser", (data) => {
        setTotalUser(data?.data);
      })
    }
  }, [Socket])


  return (
    <>
      <Grid container spacing={6.5}>
        
      <Grid item xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={3} sm={6} >
            <CardStatsHorizontalWithDetailsGameUser title="GameUsers" totalSum={totalGameUser} />
          </Grid>
          <Grid item xs={12} md={3} sm={6} >
            <CardStatsHorizontalWithDetailsGameUser title="Subscribers" totalSum={totalSubscriber} />
          </Grid>
          <Grid item xs={12} md={3} sm={6} >
            <CardStatsHorizontalWithDetailsGameUser title="Active Users" totalSum={totalUser} />
          </Grid>
        </Grid>
      </Grid>
        <Grid item xs={12}>
          <Card>
            {/* <Divider sx={{ m: '0 !important' }} /> */}
            <TableHeader setEmpty={setEmpty} handleChange={handleChange} setIsOnline={setIsOnline} isOnline={isOnline} isSubscribe={isSubscribe} setIsSubscribe={setIsSubscribe}/>
            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={gameUserLoading}
              rowHeight={62}
              rows={data}
              columns={gameUserColumn}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50 ,100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>

        </Grid>
      </Grid>
    </>
  )
}

export { gameUserRes };

Index.acl = {
  action: 'read',
  subject: 'gameuser-p'
}

export default Index
