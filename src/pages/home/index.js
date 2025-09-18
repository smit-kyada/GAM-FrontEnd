// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { Dialog, DialogContent } from "@mui/material"
import DialogActions from '@mui/material/DialogActions'

// ** graphQl
import { useQuery } from '@apollo/client'

// ** Icon Imports
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import { format, subDays } from 'date-fns'
import { GET_ALL_SITES, GET_ALOT_SITE_BOOLEAN, GET_NOT_ALLOT_SITE } from 'src/graphql/query/site'
import { GET_ALL_REPORTTABLES, GET_ALL_REPORTTABLES_BY_DATE } from 'src/graphql/query/reportTable'

import Link from 'next/link'
import PieChart from 'src/components/pieChart/RechartsLineChart'
import { GET_USERDASHBOARD } from 'src/graphql/query/user'
import { useAuth } from 'src/hooks/useAuth'
import UserBankAccountDialog from 'src/components/user/UserBankAccountDialog'
import { IS_USER_BANK_ACCOUNT } from 'src/graphql/query/bankDetail'
import BlockUserModel from 'src/components/user/BlockUserModel'
import RechartsLineChart from 'src/components/pieChart/RechartsLineChart'
import EmailVerifiedModel from 'src/components/user/EmailVerifiedModel'

const Home = () => {

  const [open, setOpen] = useState()
  const [allMessage, setAllMessage] = useState([])
  const [dataa, setDataa] = useState([])
  const [startDate, setStartDate] = useState(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState(new Date())
  const [siteList, setSiteList] = useState([]);

  const auth = useAuth()

  const { loading: messageLoading, error: msgError, data: messageData, refetch: messageRefetch } = useQuery(GET_NOT_ALLOT_SITE, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  console.log(siteList, "siteList")

  // const {
  //   loading: siteTableLoading,
  //   error: siteTableError,
  //   data: siteTableData,
  //   refetch: reportTableRefetch
  // } = useQuery(GET_ALL_REPORTTABLES, {
  //   variables: {
  //     page: 1,
  //     limit: 30,
  //     site: siteList,
  //     byDated: true,
  //     startDate: startDate ? format(startDate, 'yyyy-MM-dd') : null,
  //     endDate: endDate ? format(endDate, 'yyyy-MM-dd') : null
  //   },
  //   fetchPolicy: 'cache-and-network',
  //   notifyOnNetworkStatusChange: true
  // })

  const {
    loading: siteTableLoading,
    error: siteTableError,
    data: siteTableData,
    refetch: reportTableRefetch
  } = useQuery(GET_ALL_REPORTTABLES_BY_DATE, {
    variables: {
      sites: siteList,
      days: 30
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    skip: siteList.length === 0
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
      search: ""
    },
    fetchPolicy: 'cache-and-network'
  });

  useEffect(() => {
    if (siteDatas?.getAllSites?.data) {
      setSiteList(
        [...new Set(siteDatas.getAllSites.data.map(item => item.site?.trim() ?? ""))]
      );    
    }
  }, [siteDatas])

  // Graphql query
  const { loading: userDashboardLoading, error: userDashboardError, data: userDashboardData, refetch: userDashboardRefetch } = useQuery(GET_USERDASHBOARD, {
    variables: { page: 1, limit: 10 },
    fetchPolicy: "cache-and-network",
  });


  // Graphql query
  const { loading: isUserBankAccountLoading, error: isUserBankAccountError, data: isUserBankAccountData, refetch: isUserBankAccountRefetch } = useQuery(IS_USER_BANK_ACCOUNT, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });


  useEffect(() => {
    messageData?.getAllMessages?.data && setAllMessage(messageData?.getAllMessages?.data)

    // userDashboardData?.getDashBoardData && setDataa(JSON.parse(userDashboardData?.getDashBoardData))
    siteTableData?.getTotalRevenueData?.dailyData && setDataa(siteTableData?.getTotalRevenueData?.dailyData?.map(item => {
      return { totalEstimatedEarning: item.totalRevenue, date: item.date }
    }))
  }, [messageData, siteTableData])

  const { loading: alotBooleanLoading, error: alotBooleanError, data: alotBooleanData, refetch: alotsiteRefetch } = useQuery(GET_ALOT_SITE_BOOLEAN, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    messageData?.getNotAllotedSite && setAllMessage(messageData?.getNotAllotedSite)
    alotBooleanData?.getAlotSiteBoolean && setOpen(alotBooleanData?.getAlotSiteBoolean)
  }, [messageData, alotBooleanData])

  return (
    <>
      <Grid container spacing={6}>

        <Grid item xs={12}>
          <Card>
            <CardHeader title='Welcome to Funcliq 🚀'></CardHeader>
            <CardContent>
              <Typography sx={{ mb: 2 }}>
                {/* All the best for your new project. */}
              </Typography>
              <Typography>
                {/* Please make sure to read our Template Documentation to understand where to go from here and how to use our */}
                {/* template. */}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} >
          <RechartsLineChart data={dataa} />
        </Grid>

      </Grid>


      <EmailVerifiedModel />
      <UserBankAccountDialog />
      <BlockUserModel />
      {/* {isUserBankAccountData && <UserBankAccountDialog isUser={isUserBankAccountData?.IsUserBankAcc} isUserBankAccountRefetch={isUserBankAccountRefetch} />} */}
    </>
  )
}

Home.acl = {
  action: 'read',
  subject: 'home-c'
}

export default Home
