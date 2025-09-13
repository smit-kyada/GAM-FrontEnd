import React from 'react'
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CustomChip from 'src/@core/components/mui/chip'

// ** graphQl
import { GET_ALL_SITES } from 'src/graphql/query/site'

import { CircularProgress, Dialog, DialogContent, DialogContentText } from "@mui/material";
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import { Autocomplete, CardContent, CardHeader, FormControl, Icon, InputLabel, TextField } from '@mui/material'

// ** graphQl
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_SITETABLES } from "src/graphql/query/siteTable"
import { GET_ALOT_SITE_BOOLEAN, GET_NOT_ALLOT_SITE } from 'src/graphql/query/site'

//**custom component */
// import { SiteColumnForUser } from 'src/components/columns/Columns'

import TableHeader from 'src/views/site/list/TableHeader'
import AddSite from 'src/views/site/list/AddSite'
import { useAuth } from 'src/hooks/useAuth'
import { UPDATE_USER_SITE } from 'src/graphql/mutation/site'
import Link from 'next/link'
import SiteMessage from 'src/components/site/GameUserMessage'
import UserBankAccountDialog from 'src/components/user/UserBankAccountDialog'
import BlockUserModel from 'src/components/user/BlockUserModel'

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


  const [open, setOpen] = useState()
  const [allMessage, setAllMessage] = useState([])
  const [messageId, setMessageId] = useState("")
  const [messageName, setMessageName] = useState("")



  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { loading: messageLoading, error: msgError, data: messageData, refetch: messageRefetch } = useQuery(GET_NOT_ALLOT_SITE, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    messageData?.getAllMessages?.data && setAllMessage(messageData?.getAllMessages?.data)
  }, [messageData])

  const { loading: alotBooleanLoading, error: alotBooleanError, data: alotBooleanData, refetch: alotsiteRefetch } = useQuery(GET_ALOT_SITE_BOOLEAN, {
    variables: {},
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    messageData?.getNotAllotedSite && setAllMessage(messageData?.getNotAllotedSite)
    alotBooleanData?.getAlotSiteBoolean && setOpen(alotBooleanData?.getAlotSiteBoolean)
  }, [messageData, alotBooleanData])

  const handleMessageChange = (event, newValue) => {
    setMessageId(newValue?.id)
    setMessageName(newValue)
  }

  const [upDateSite] = useMutation(UPDATE_USER_SITE)

  const sendMessage = async () => {
    await upDateSite({
      variables: {
        "input": {
          "id": messageId
        }
      }
    })
      .then(res => {
        setOpen(false)
        toast.success("sucessfully updated!")
      })
      .catch(err => console.log(err))
  }


  let SiteColumnForUser = [
    {
      minWidth: 500,
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
      minWidth: 150,
      field: 'deatail',
      headerName: 'Detail',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button variant='text' color='secondary' component={Link} href={`/site/siteDetails/${encodeURIComponent(row?.site)}`}>
              Detail
            </Button>
          </Box>
        )
      }
    },
  ]

  if (auth?.user?.showTotalGameUser) {
    SiteColumnForUser?.splice(1, 0, {
      minWidth: 200,
      field: 'totalGameUser',
      headerName: 'Total Game User',
      align: 'center',
      renderCell: ({ row }) => {

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.gameUsers?.TotalgameUsers || 0}
            </Typography>
          </Box>
        )
      }
    })
  }

  if (auth?.user?.showTotalGameUser) {
    SiteColumnForUser?.push({
      minWidth: 200,
      field: 'send',
      headerName: 'Send',
      renderCell: ({ row }) => {

        return (

          <SiteMessage row={row} />

        )
      }
    },)
  }

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

      {/* {auth?.user?.role == "client" && auth?.user?.block == false && <Dialog
        open={open}


        aria-labelledby='customized-dialog-title'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
          <Typography variant='h6' align="center">
            Alot Site
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important` }}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Autocomplete
              fullWidth
              value={messageName}
              options={allMessage}
              onChange={handleMessageChange}
              id='autocomplete-controlled'
              renderOption={(props, option) => {
                if (option.site) {
                  return (
                    <li {...props} key={option.id}>
                      {option.site}
                    </li>
                  );
                }
              }}
              getOptionLabel={option => option.site || ""}
              renderInput={params => <TextField  {...params} label='Select Site' />}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
          <Button variant='text' color='warning' onClick={sendMessage}>Alot</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>} */}

      <UserBankAccountDialog />
      <BlockUserModel/>

    </>
  );
}

Index.acl = {
  action: 'read',
  subject: 'mysites-p'
}

export default Index;
