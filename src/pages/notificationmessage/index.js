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
import { messageColumn, notificationMessageColumn } from 'src/components/columns/Columns'

import TableHeader from 'src/components/commonComponent/TableHeader'
import AddMessage from 'src/views/message/list/AddMessage'
import { GET_ALL_NOTIFICATIONMESSAGE } from 'src/graphql/query/notificationMessage'
import AddNotificationMessage from 'src/components/notificationMessage/addNotificationMessage'

var notificationMessageRes

const Message = () => {

    // ** State
    const [pageSize, setPageSize] = useState(10)
    const [pageNumber, setPageNumber] = useState(1)
    const [data, setData] = useState([]);
    const [totalRow, setTotalRow] = useState(10)
    const [addUserOpen, setAddUserOpen] = useState(false)
    const [searchText, setSearchText] = useState("")

    // Graphql query
    const { loading: messageLoading, error: messageError, data: messageData, refetch: messageRefetch } = useQuery(GET_ALL_NOTIFICATIONMESSAGE, {
        variables: { page: pageNumber, limit: pageSize, search: searchText },
        fetchPolicy: "cache-and-network",
    });

    notificationMessageRes = messageRefetch

    const handleChange = e => setSearchText(e)

    useEffect(() => {
        messageData?.getAllNotificationMessages?.data && setData(messageData?.getAllNotificationMessages?.data)
        messageData?.getAllNotificationMessages?.count && setTotalRow(messageData?.getAllNotificationMessages?.count);

    }, [messageData])

    const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

    return (
        <>
            <Grid container spacing={6.5}>
                <Grid item xs={12}>
                    <Card>
                        <Divider sx={{ m: '0 !important' }} />
                        <TableHeader toggle={toggleAddUserDrawer} handleChange={handleChange} For='NotificationMessage' />
                        <Divider sx={{ m: '0 !important' }} />
                        <DataGrid
                            autoHeight
                            paginationMode='server'
                            onPageChange={page => setPageNumber(page + 1)}
                            loading={messageLoading}
                            rowHeight={62}
                            rows={data}
                            columns={notificationMessageColumn}
                            pageSize={pageSize}
                            rowCount={totalRow}
                            disableSelectionOnClick
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                        />
                    </Card>
                    {addUserOpen && <AddNotificationMessage open={addUserOpen} toggle={toggleAddUserDrawer} messageRefetch={messageRefetch} />}
                </Grid>
            </Grid>
        </>
    )
}

export { notificationMessageRes };

Message.acl = {
    action: 'read',
    subject: 'notificationmessages-p'
}

export default Message
