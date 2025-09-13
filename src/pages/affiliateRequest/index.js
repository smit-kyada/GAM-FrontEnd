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

//**custom component */
import { affRequestColumn } from 'src/components/columns/Columns'

import TableHeader from 'src/views/site/list/TableHeader'
import AddSite from 'src/views/site/list/AddSite'
import { GET_ALL_AFFREQUEST } from 'src/graphql/query/affRequest'
import CreateAffRequest from 'src/views/affRequest/CreateAffRequest'

var affRequestRes

const Index = () => {

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  // Graphql query
  const { loading: affRequestLoading, error: siteError, data: affRequestData, refetch: affRequestRefetch } = useQuery(GET_ALL_AFFREQUEST, {
    variables: { page: pageNumber, limit: pageSize, search: searchText },
    fetchPolicy: "cache-and-network",
  });

  affRequestRes = affRequestRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    affRequestData?.getAllAffRequests?.data && setData(affRequestData?.getAllAffRequests?.data)
    affRequestData?.getAllAffRequests?.count && setTotalRow(affRequestData?.getAllAffRequests?.count);
  }, [affRequestData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />
            <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='AffiliateRequest' />
            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={affRequestLoading}
              rowHeight={62}
              rows={data}
              columns={affRequestColumn}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10,25, 50,100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
          {addUserOpen && <CreateAffRequest open={addUserOpen} toggle={toggleAddUserDrawer} affRequestRefetch={affRequestRefetch} />}
        </Grid>
      </Grid>
    </>
  )
}

export { affRequestRes };

Index.acl = {
  action: 'read',
  subject: 'affiliateRequest-p'
}

export default Index
