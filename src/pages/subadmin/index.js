import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'


// ** graphQl
import { useQuery } from '@apollo/client'
import { GET_USER_LIST } from "src/graphql/query/user"

//**custom component */
import { SubAdminColumn } from 'src/components/columns/Columns'

import TableHeader from 'src/views/employee/list/TableHeader'
import AddSubAdmin from 'src/views/subadmin/AddSubAdmin'


var subAdminRes

const User = () => {

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  // Graphql query
  const { loading: userLoading, error: userError, data: userData, refetch: subAdminRefetch } = useQuery(GET_USER_LIST, {
    variables: { page: pageNumber, limit: pageSize, search: searchText, filter: JSON.stringify({ role: "subadmin" }) },
    fetchPolicy: "cache-and-network",
  });

  subAdminRes = subAdminRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    userData?.getUserList?.data && setData(userData?.getUserList?.data)
    userData?.getUserList?.count && setTotalRow(userData?.getUserList?.count);

  }, [userData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />
            <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='SubAdmin' />
            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={userLoading}
              rowHeight={62}
              rows={data}
              columns={SubAdminColumn}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
          {addUserOpen && <AddSubAdmin open={addUserOpen} toggle={toggleAddUserDrawer} subAdminRefetch={subAdminRefetch} />}
        </Grid>
      </Grid>
    </>
  )
}

export { subAdminRes }

User.acl = {
  action: 'read',
  subject: 'subadmin-p'
}

export default User
