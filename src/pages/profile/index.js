// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import CardTransactions from 'src/components/profile/CardTransactions'
import AddBankDetail from 'src/views/profile/addBankDetail'
import { GET_BANKDETAIL } from 'src/graphql/query/bankDetail'
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import UserBankAccountDialog from 'src/components/user/UserBankAccountDialog'
import { GET_ME } from 'src/graphql/query/user'
import BlockUserModel from 'src/components/user/BlockUserModel'

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(20)
  }
}))

const Index = () => {

  const [data, setData] = useState([]);
  const [user, setUser] = useState("")

  // Graphql query
  const { loading: bankDetailLoading, error: bankDetailError, data: bankDetailData, refetch: bankDetailRefetch } = useQuery(GET_BANKDETAIL, {
    variables: { page: 1, limit: [] },
    fetchPolicy: "cache-and-network",
  });


  // const handleChange = e => setSearchText(e)

  useEffect(() => {
    bankDetailData?.getBankDetail?.data && setData(bankDetailData?.getBankDetail?.data)
  }, [bankDetailData])


  // Graphql query
  const { loading: userLoading, error: userError, data: userData, refetch: userRefetch } = useQuery(GET_ME, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    userData?.get_me && setUser(userData?.get_me)

  }, [userData])


  return (
    <>
      <Grid container spacing={12}>
        <Grid item xs={12} md={6} lg={12}>
          {user && <AddBankDetail user={user} userRefetch={userRefetch} />}
        </Grid>
      </Grid >

      {/* <Grid container spacing={6}>
        {data?.map((d, index) => {
          return (
            <Grid item xs={12} md={6} lg={6} key={'d' + index}>
              <CardTransactions bankDetail={d} bankDetailRefetch={bankDetailRefetch} />
            </Grid>
          )
        })}

      </Grid > */}

      <UserBankAccountDialog />
      <BlockUserModel/>


      {/* <Grid container > */}
      {/* <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <BoxWrapper>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant='h4' sx={{ mb: 1.5 }}>
              We are launching soon
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              We're creating something awesome. Please subscribe to get notified when it's ready!
            </Typography>
          </Box>
        </BoxWrapper>
        <Img height='500' alt='coming-soon-illustration' src='/images/pages/misc-coming-soon.png' />
      </Box> */}
      {/* </Grid> */}

    </>
  )
}
Index.acl = {
  action: 'read',
  subject: 'profile-p'
}

export default Index
