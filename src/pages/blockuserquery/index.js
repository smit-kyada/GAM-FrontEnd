import { useQuery } from '@apollo/client'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { renderClient } from 'src/components/columns/Columns'
import ActiveUser from 'src/components/user/ActiveUser'
import BlockUserToggle from 'src/components/user/BlockUserToggle'
import IsOnlyReport from 'src/components/user/isOnlyReport'
import ShowAllData from 'src/components/user/showAllData'
import ShowReport from 'src/components/user/showReport'
import UserRowOptions from 'src/components/user/UserRowOption'
import { GET_ALL_BLOCK_USER_QUERY } from "src/graphql/query/user"
import { useAuth } from 'src/hooks/useAuth'
import AddUser from 'src/views/employee/list/AddUser'

var userRes

const User = () => {

  const { user } = useAuth()

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  // Graphql query
  const { loading: userLoading, error: userError, data: userData, refetch: userRefetch } = useQuery(GET_ALL_BLOCK_USER_QUERY, {
    variables: { page: pageNumber, limit: pageSize, search: searchText },
    fetchPolicy: "cache-and-network",
  });

  userRes = userRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    userData?.getAllQueries?.data && setData(userData?.getAllQueries?.data)
    userData?.getAllQueries?.count && setTotalRow(userData?.getAllQueries?.count);

  }, [userData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)




  // render client



  // column

  let UserColumn = [
    {
      minWidth: 300,
      field: 'name',
      headerName: 'Name',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }} >
            {renderClient(row?.userId)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link} href={`/user/userSiteDetails/${row?.id}`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {row?.userId?.userName}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {row?.userId?.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      minWidth: 150,
      field: 'contact',
      headerName: 'Contact',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.userId?.contact}
            </Typography>
          </Box>
        )
      }
    },

    {
      minWidth: 700,
      field: 'message',
      headerName: 'message',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.message}
            </Typography>
          </Box>
        )
      }
    },
  ]


  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />

            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={userLoading}
              rowHeight={62}
              rows={data}
              columns={UserColumn}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
          {addUserOpen && <AddUser open={addUserOpen} toggle={toggleAddUserDrawer} userRefetch={userRefetch} />}
        </Grid>
      </Grid>
    </>
  )
}

export { userRes }

User.acl = {
  action: 'read',
  subject: 'blockusermessage-p'
}

export default User
