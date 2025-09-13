import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** graphQl
import { useQuery } from '@apollo/client'


import Moment from 'react-moment/dist'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { GET_ALL_REPORT_LOGS } from 'src/graphql/query/reportlog'
import { useAuth } from 'src/hooks/useAuth'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'

var siteRes

const Index = () => {

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  const auth = useAuth();

  // Graphql query
  const { loading: siteLoading, error: siteError, data: siteData, refetch: siteRefetch } = useQuery(GET_ALL_REPORT_LOGS, {
    variables: { page: pageNumber, limit: pageSize, search: searchText },
    fetchPolicy: "cache-and-network",
  });

  siteRes = siteRefetch

  const handleChange = e => setSearchText(e)
  useEffect(() => {
    siteData?.getAllApplog?.data && setData(siteData?.getAllApplog?.data)
    siteData?.getAllApplog?.count && setTotalRow(siteData?.getAllApplog?.count);
  }, [siteData])


  const renderClient = row => {
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


  let SiteColumnForUser = [
    {
      minWidth: 250,
      field: 'userName',
      headerName: 'User',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
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
      minWidth: 220,
      sortable: false,
      field: 'title',
      headerName: 'Title',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.title}
          </Typography>
        )
      }
    },
    {
      minWidth: 400,
      sortable: false,
      field: 'logFor',
      headerName: 'Log For',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.logFor}
          </Typography>
        )
      }
    },
    {
      field: 'role',
      minWidth: 150,
      headerName: 'Role',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar
              skin='light'
              sx={{ mr: 4, width: 30, height: 30 }}
              color={"secondary"}
            >
              <Icon icon={"tabler:device-laptop"} />
            </CustomAvatar>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.userId?.role}
            </Typography>
          </Box>
        )
      }
    },
    {
      minWidth: 300,
      sortable: false,
      field: 'time',
      headerName: 'Time',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            <Moment format='MMMM Do YYYY, h:mm:ss a'>{row?.createdAt}</Moment>
          </Typography>
        )
      }

      // ({ row }) => <RowOptions id={row.id}/>
    }

  ]


  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />
            {/* <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='Site' /> */}
            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={siteLoading}
              rowHeight={62}
              rows={data}
              columns={SiteColumnForUser}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
          {/* {addUserOpen && <AddSite open={addUserOpen} toggle={toggleAddUserDrawer} siteRefetch={siteRefetch} />} */}
        </Grid>
      </Grid>
    </>
  );
}

Index.acl = {
  action: 'read',
  subject: 'reportLog-p'
}

export default Index;
