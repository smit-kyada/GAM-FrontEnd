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
import { GET_USER_LIST } from "src/graphql/query/user"

//**custom component */
// import { UserColumn } from 'src/components/columns/Columns'

import TableHeader from 'src/views/employee/list/TableHeader'

import AddUser from 'src/views/employee/list/AddUser'
import TotalGameUserToggle from 'src/components/user/TotalGameUserToggle'
import UserRowOptions from 'src/components/user/UserRowOption'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import Link from 'next/link'
import { useAuth } from 'src/hooks/useAuth'
import BlockUserToggle from 'src/components/user/BlockUserToggle'
import ActiveAccount from 'src/components/user/ActiveAccount'
import ActiveUser from 'src/components/user/ActiveUser'
import IsOnlyReport from 'src/components/user/isOnlyReport'
import ShowReport from 'src/components/user/showReport'
import ShowAllData from 'src/components/user/showAllData'

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
  const { loading: userLoading, error: userError, data: userData, refetch: userRefetch } = useQuery(GET_USER_LIST, {
    variables: { page: pageNumber, limit: pageSize, search: searchText },
    fetchPolicy: "cache-and-network",
  });

  userRes = userRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    userData?.getUserList?.data && setData(userData?.getUserList?.data)
    userData?.getUserList?.count && setTotalRow(userData?.getUserList?.count);

  }, [userData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)




  // render client

  let renderClient = row => {
    if (row?.avatar?.length) {
      return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={row.avatarColor}
          sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
        >
          {getInitials(row?.userName ? row?.userName : 'John Doe')}
        </CustomAvatar>
      )
    }
  }


  // column

  let UserColumn = [
    {
      minWidth: 250,
      field: 'name',
      headerName: 'Name',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }} >
            {renderClient(row)}
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
                {row?.userName}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }} component={Link} href={`/user/userSiteDetails/${row?.id}`}>
                {row?.email}
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
              {row?.contact}
            </Typography>
          </Box>
        )
      }
    },
  ]

  // admin column
  {
    user?.role == "admin" && UserColumn?.push(

      // {
      //   minWidth: 300,
      //   field: 'showTotalGameUser',
      //   headerName: 'show Total GameUser',
      //   renderCell: ({ row }) => {

      //     return (
      //       <TotalGameUserToggle row={row} refetch={userRes} />
      //     )
      //   }
      // },


      {
        minWidth: 250,
        field: 'ShowAllData',
        headerName: 'Show All Data',
        renderCell: ({ row }) => {

          return (
            <ShowAllData row={row} refetch={userRes} />
          )
        }
      },
      {
        minWidth: 250,
        field: 'isOnlyReport',
        headerName: 'Show Only Report',
        renderCell: ({ row }) => {

          return (
            <IsOnlyReport row={row} refetch={userRes} />
          )
        }
      },
      {
        minWidth: 250,
        field: 'showReport',
        headerName: 'Show Report to User',
        renderCell: ({ row }) => {

          return (
            <ShowReport row={row} refetch={userRes} />
          )
        }
      },
      {
        minWidth: 150,
        field: 'BlockUser',
        headerName: 'Block User',
        renderCell: ({ row }) => {

          return (
            <BlockUserToggle row={row} refetch={userRes} />
          )
        }
      },
      {
        minWidth: 150,
        field: 'Active/InActive',
        headerName: 'Active',
        renderCell: ({ row }) => {

          return (
            <ActiveUser row={row} refetch={userRes} />
          )
        }
      },
      {
        minWidth: 100,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }) => <UserRowOptions userData={row} refetch={userRes} For="User" />
      },
    )
  }



  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />
            <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='User' />
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

export { userRes };

User.acl = {
  action: 'read',
  subject: 'user-p'
}

export default User
