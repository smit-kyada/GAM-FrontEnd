import { useEffect, useState } from 'react'

// ** MUI Imports
import { useMutation, useQuery } from '@apollo/client'
import { Icon } from '@iconify/react'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Moment from 'react-moment'
import RowOptions from 'src/components/commonComponent/RowOptions'
import { GET_ALL_ADSENSE_TOKEN } from 'src/graphql/query/adsense'
import AddAdsenseToken from 'src/views/adsense/AddAdsenseToken'
import TableHeader from 'src/views/employee/list/TableHeader'
import Link from 'next/link'
import { GET_ADMIN_TOKEN } from 'src/graphql/query/user'
import { useAuth } from 'src/hooks/useAuth'
import { GENERATE_ADMIN_TOKEN } from 'src/graphql/mutation/user'
import Loader from 'src/components/loader/loader'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

var tokenRes

const AdsenseToken = () => {

  const { user } = useAuth()


  const router = useRouter()

  const [generateAdmintoken] = useMutation(GENERATE_ADMIN_TOKEN)

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [adminToken, setAdminToken] = useState(null)
  const [loading, setLoading] = useState(false)


  // Graphql query
  const { loading: userLoading, error: userError, data: userData, refetch: tokenRefetch } = useQuery(GET_ALL_ADSENSE_TOKEN, {
    variables: { page: pageNumber, limit: pageSize, search: searchText },
    fetchPolicy: "cache-and-network",
  });

  const { loading: adminTokenLoading, error: adminTokenError, data: adminTokenData, refetch: adminTokenRefetch } = useQuery(GET_ADMIN_TOKEN, {
    variables: { getAdminTokenId: user?.id },
    fetchPolicy: "cache-and-network",
  });

  tokenRes = tokenRefetch

  const handleChange = e => setSearchText(e)


  useEffect(() => {
    userData?.getAllAdsenses?.data && setData(userData?.getAllAdsenses?.data)
    userData?.getAllAdsenses?.count && setTotalRow(userData?.getAllAdsenses?.count);

    adminTokenData?.getAdminToken && setAdminToken(adminTokenData?.getAdminToken)

  }, [userData, adminTokenData]);
  useEffect(() => {
    setAccessToken(localStorage.getItem("accessToken"))
  }, [typeof window !== "undefined" && localStorage.getItem("accessToken")])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)


  // column

  let AdsenseToken = [
    {
      minWidth: 250,
      field: 'expiry_date',
      headerName: 'expiry date',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              <Moment format='MMMM Do YYYY, h:mm:ss a'>{row?.expiry_date}</Moment>
            </Typography>
          </Box>
        )
      }
    },
    {
      minWidth: 120,
      field: 'token_type',
      headerName: 'token type',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.token_type}
            </Typography>
          </Box>
        )
      }
    },
    {
      minWidth: 200,
      field: 'access_token',
      headerName: 'access token',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.access_token}
            </Typography>
          </Box>
        )
      }
    },
    {
      minWidth: 200,
      field: 'refresh_token',
      headerName: 'refresh token',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.refresh_token}
            </Typography>
          </Box>
        )
      }
    },
    {
      minWidth: 450,
      field: 'scope',
      headerName: 'scope',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.scope}
            </Typography>
          </Box>
        )
      }
    },

    // {
    //   minWidth: 150,
    //   field: 'Active/InActive',
    //   headerName: 'Active',
    //   renderCell: ({ row }) => {

    //     return (
    //       <ActiveToken row={row} refetch={tokenRes} />
    //     )
    //   }
    // },

    {
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => <RowOptions userData={row} refetch={tokenRes} For='AdsenseToken' />
    },
  ]


  const handleAdminToken = async () => {

    setLoading(true)

    await generateAdmintoken({
      variables: {
        generateAdminTokenId: user?.id
      }
    })
      .then((res) => {
        setLoading(false)
        adminTokenRefetch()
        setAdminToken(res?.data?.generateAdminToken)

        window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/authorize/${res?.data?.generateAdminToken}`, '_blank');

      })
      .catch((err) => {
        console.log("🚀 ~ file: index.js:197 ~ handleAdminToken ~ err:", err)
        setLoading(false)
        toast.error(err)
      })

  }


  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />

            {/* <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='Adsense Token' /> */}

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


              <Button variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={handleAdminToken}>
                <Icon fontSize='1.125rem' icon='carbon:add-filled' />
                Generate New Token
              </Button>
            </Box>


            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={userLoading}
              rowHeight={62}
              rows={data}
              columns={AdsenseToken}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
          {addUserOpen && <AddAdsenseToken open={addUserOpen} toggle={toggleAddUserDrawer} tokenRefetch={tokenRefetch} />}
        </Grid>
      </Grid>

      <Loader disable={loading} />
    </>
  )
}

export { tokenRes }

AdsenseToken.acl = {
  action: 'read',
  subject: 'adsense-p'
}

export default AdsenseToken
