import { useQuery } from '@apollo/client'
import { Card, Divider, Grid } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { UserAccountColumn } from 'src/components/columns/Columns'
import Loader from 'src/components/loader/loader'
import AddUserAccount from 'src/components/user/AddUserAccount'
import BlockUserModel from 'src/components/user/BlockUserModel'
import UserBankAccountDialog from 'src/components/user/UserBankAccountDialog'
import { GET_USER_ACCOUNTS, GET_USER_LIST } from 'src/graphql/query/user'
import { useAuth } from 'src/hooks/useAuth'
import TableHeader from 'src/views/employee/list/TableHeader'

var userAccountRes;

const Account = () => {

  const { user } = useAuth()

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")


  // Graphql query
  const { loading: userAccountLoading, error: userError, data: userAccountData, refetch: userAccountRefetch } = useQuery(GET_USER_ACCOUNTS, {
    variables: { page: pageNumber, limit: pageSize, search: searchText, filter: JSON.stringify({ userId: user?.id }) },
    fetchPolicy: "cache-and-network",
  });

  userAccountRes = userAccountRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    userAccountData?.getAllAccounts?.data && setData(userAccountData?.getAllAccounts?.data)
    userAccountData?.getAllAccounts?.count && setTotalRow(userAccountData?.getAllAccounts?.count);

  }, [userAccountData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)


  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />
            <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='BankAccount' />
            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={userAccountLoading}
              rowHeight={62}
              rows={data}
              columns={UserAccountColumn}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
          {addUserOpen && <AddUserAccount open={addUserOpen} toggle={toggleAddUserDrawer} userAccountRefetch={userAccountRefetch} userId={user?.id} />}
        </Grid>
      </Grid>


      <Loader disable={userAccountLoading} />


      <UserBankAccountDialog />
      <BlockUserModel/>
    </>
  )
}

Account.acl = {
  action: 'read',
  subject: 'account-p'
}

export { userAccountRes }

export default Account
