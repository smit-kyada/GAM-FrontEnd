import React from 'react'
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import CustomAvatar from 'src/@core/components/mui/avatar'


// ** graphQl
import { useQuery } from '@apollo/client'
import { GET_ALL_SITES } from 'src/graphql/query/site'

//**custom component */

// import { SiteColumn } from 'src/components/columns/Columns'

import TableHeader from 'src/views/site/list/TableHeader'
import AddSite from 'src/views/site/list/AddSite'
import RowOptions from 'src/components/commonComponent/RowOptions'
import { Button } from '@mui/material'
import Link from 'next/link'
import SiteMessage from 'src/components/site/GameUserMessage'
import { useAuth } from 'src/hooks/useAuth'
import { getInitials } from 'src/@core/utils/get-initials'
import ActiveSite from 'src/components/site/ActiveSite'

var siteRes

const Index = () => {

  const { user } = useAuth()

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  // Graphql query
  const { loading: siteLoading, error: siteError, data: siteData, refetch: siteRefetch } = useQuery(GET_ALL_SITES, {
    variables: { page: pageNumber, limit: pageSize, search: searchText },
    fetchPolicy: "cache-and-network",
  });

  siteRes = siteRefetch


  const handleChange = e => setSearchText(e)

  useEffect(() => {
    siteData?.getAllSites?.data && setData(siteData?.getAllSites?.data)
    siteData?.getAllSites?.count && setTotalRow(siteData?.getAllSites?.count);
  }, [siteData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)



  // render user


  let renderUser = row => {
    if (row?.avatar?.length) {
      return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
    } else {
      return (
        <CustomAvatar
          skin='light'
          color={row.avatarColor}
          sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
        >
          {getInitials(row?.userId?.userName ? row?.userId?.userName : row?.userId?.companyName)}
        </CustomAvatar>
      )
    }
  }



  // site column
  let SiteColumn = [
    {
      minWidth: 260,
      field: 'name',
      headerName: 'Name',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderUser(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link} href={`/site/siteDetails/${row?.id}`}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {row?.userId?.userName || row?.userId?.companyName}
              </Typography>
              <Typography noWrap component={Link} href={`/site/siteDetails/${row?.id}`} variant='body2' sx={{ color: 'text.disabled' }}>
                {row?.userId?.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      minWidth: 290,
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
      minWidth: 280,
      field: 'description',
      headerName: 'Description',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row?.description}
            </Typography>
          </Box>
        )
      }
    },

    // {
    //   minWidth: 160,
    //   field: 'totalGameUser',
    //   headerName: 'Total Game User',
    //   align: 'center',
    //   renderCell: ({ row }) => {

    //     return (
    //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //         <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
    //           {row?.gameUsers?.TotalgameUsers || 0}
    //         </Typography>
    //       </Box>
    //     )
    //   }
    // },
    {
      minWidth: 130,
      field: 'deatail',
      headerName: 'Detail',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant='text' color='secondary' component={Link} href={`/site/siteDetails/${row?.id}`}>
              Detail
            </Button>
          </Box>
        )
      }
    },
  ]


  {
    user?.role == "admin" && SiteColumn?.push(

      // {
      //   minWidth: 180,
      //   field: 'send',
      //   headerName: 'Send',
      //   renderCell: ({ row }) => {

      //     return (

      //       <SiteMessage row={row} />

      //     )
      //   }
      // },
      {
        minWidth: 170,
        field: 'Active/InActive',
        headerName: 'Active',
        renderCell: ({ row }) => {

          return (
            <ActiveSite row={row} refetch={siteRes} />
          )
        }
      },
      {
        minWidth: 70,
        sortable: false,
        field: 'actions',
        headerName: 'Actions',
        renderCell: ({ row }) => <RowOptions userData={row} refetch={siteRes} For='Site' />
      }
    )
  }



  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />
            <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='Site' />
            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={siteLoading}
              rowHeight={62}
              rows={data}
              columns={SiteColumn}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
          {addUserOpen && <AddSite open={addUserOpen} toggle={toggleAddUserDrawer} siteRefetch={siteRefetch} />}
        </Grid>
      </Grid>
    </>
  )
}

export { siteRes };

Index.acl = {
  action: 'read',
  subject: 'sites-p'
}

export default Index
