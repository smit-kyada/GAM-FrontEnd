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
import { GET_ALL_MESSAGES } from 'src/graphql/query/message'

//**custom component */
import { messageColumn } from 'src/components/columns/Columns'

import TableHeader from 'src/components/commonComponent/TableHeader'
import AddMessage from 'src/views/message/list/AddMessage'

var messageRes

const Message = () => {

    // ** State
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [data, setData] = useState([]);
    const [totalRow, setTotalRow] = useState(10)
    const [addUserOpen, setAddUserOpen] = useState(false)
    const [searchText, setSearchText] = useState("")

    // Graphql query
    const { loading: messageLoading, error: messageError, data: messageData, refetch: messageRefetch } = useQuery(GET_ALL_MESSAGES, {
        variables: { page: pageNumber, limit: pageSize, search: searchText },
        fetchPolicy: "cache-and-network",
    });

    messageRes = messageRefetch

    const handleChange = e => setSearchText(e)

    useEffect(() => {
        messageData?.getAllMessages?.data && setData(messageData?.getAllMessages?.data)
        messageData?.getAllMessages?.count && setTotalRow(messageData?.getAllMessages?.count);

    }, [messageData])

    const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

    return (
        <>
            <Grid container spacing={6.5}>
                <Grid item xs={12}>
                    <Card>
                        <Divider sx={{ m: '0 !important' }} />
                        <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='Message' />
                        <Divider sx={{ m: '0 !important' }} />
                        <DataGrid
                            autoHeight
                            paginationMode='server'
                            onPageChange={page => setPageNumber(page + 1)}
                            loading={messageLoading}
                            rowHeight={62}
                            rows={data}
                            columns={messageColumn}
                            pageSize={pageSize}
                            rowCount={totalRow}
                            disableSelectionOnClick
                            rowsPerPageOptions={[10,25,50,100]}
                            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                        />
                    </Card>
                    {addUserOpen && <AddMessage open={addUserOpen} toggle={toggleAddUserDrawer} messageRefetch={messageRefetch} />}
                </Grid>
            </Grid>
        </>
    )
}

export { messageRes };

Message.acl = {
    action: 'read',
    subject: 'messages-p'
  }

export default Message
