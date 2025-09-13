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
import { GET_ALL_MESSAGELOG } from 'src/graphql/query/messageLog'

//**custom component */
import { messageLogColumn } from 'src/components/columns/Columns'

import TableHeader from 'src/components/commonComponent/TableHeader'
import AddMessageLog from 'src/views/messageLog/list/AddMessageLog'

var messageLogRes

const MessageLog = () => {

  // ** State
  const [pageSize, setPageSize] = useState(10)
  const [pageNumber, setPageNumber] = useState(1)
  const [data, setData] = useState([]);
  const [totalRow, setTotalRow] = useState(10)
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  // Graphql query
  const { loading: messageLoading, error: messageLogError, data: messageLogData, refetch: messageLogRefetch } = useQuery(GET_ALL_MESSAGELOG, {
    variables: { page: pageNumber, limit: pageSize, search: searchText },
    fetchPolicy: "cache-and-network",
  });

  messageLogRes = messageLogRefetch

  const handleChange = e => setSearchText(e)

  useEffect(() => {
    messageLogData?.getAllMessageLogs?.data && setData(messageLogData?.getAllMessageLogs?.data)
    messageLogData?.getAllMessageLogs?.count && setTotalRow(messageLogData?.getAllMessageLogs?.count);

  }, [messageLogData])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <>
      <Grid container spacing={6.5}>
        <Grid item xs={12}>
          <Card>
            <Divider sx={{ m: '0 !important' }} />
            <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='messageLog' />
            <Divider sx={{ m: '0 !important' }} />
            <DataGrid
              autoHeight
              paginationMode='server'
              onPageChange={page => setPageNumber(page + 1)}
              loading={messageLoading}
              rowHeight={62}
              rows={data}
              columns={messageLogColumn}
              pageSize={pageSize}
              rowCount={totalRow}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50, 100]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            />
          </Card>
          {addUserOpen && <AddMessageLog open={addUserOpen} toggle={toggleAddUserDrawer} messageLogRefetch={messageLogRefetch} />}
        </Grid>
      </Grid>
    </>
  )
}

export { messageLogRes };

MessageLog.acl = {
  action: 'read',
  subject: 'messageLog-p'
}

export default MessageLog
