import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'

// ** hooks
import { useSocket } from 'src/hooks/userSocket'

import { useQuery } from '@apollo/client'
import { GET_SITE } from 'src/graphql/query/site'

const CustomCloseButton = styled(IconButton)(({ theme }) => ({
    top: 0,
    right: 0,
    color: 'grey.500',
    position: 'absolute',
    boxShadow: theme.shadows[6],
    transform: 'translate(10px, -10px)',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: `${theme.palette.background.paper} !important`,
    transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[3],
        transform: 'translate(7px, -5px)'
    }
}))

const ViewAlotSite = ({ open, setOpen, userData }) => {

    // ** hooks
    const { Socket } = useSocket();

    const [allSite, setAllSite] = useState([])

    // const [open, setOpen] = useState(false);


    const handleClickOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const { loading: siteLoading, error: siteError, data: siteData, refetch: siteRefetch } = useQuery(GET_SITE, {
        variables: { getSiteId: userData?.id },
        fetchPolicy: "cache-and-network",
    });

    useEffect(() => {
        siteData?.getSite && setAllSite(siteData?.getSite)
    }, [siteData])





    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <Button
                variant='outlined' color='error' sx={{ ml: 3 }} endIcon={<Icon icon='tabler:send' />}
                component="label" onClick={handleClickOpen}>
                View
            </Button> */}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='customized-dialog-title'
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
                    <Typography variant='h6' align="center">
                        Alotted Sites
                    </Typography>
                    <CustomCloseButton aria-label='close' onClick={handleClose}>
                        <Icon icon='tabler:x' fontSize='1.25rem' />
                    </CustomCloseButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important` }}>


                    {/* <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Icon icon='tabler:mail' fontSize={20} />
                            </ListItemIcon>
                            <ListItemText primary='Inbox' />
                        </ListItemButton>
                    </ListItem> */}


                        <List component='nav' aria-label='main mailbox'>
                            {
                              allSite?.length>0 ?  allSite?.map((data, index) => {
                                    return <ListItem disablePadding key={'data'+index}>
                                        <ListItemButton>

                                        {/* <ListItemText primary={index+1} /> */}
                                            <ListItemIcon>
                                                <Icon icon='fluent-mdl2:live-site' fontSize={20} />
                                            </ListItemIcon>
                                            <ListItemText primary={data?.site} />
                                        </ListItemButton>
                                    </ListItem>
                                }) : <Typography align="center" sx={{ color: 'text.secondary' }}>
                               No Data Available
                            </Typography>
                            }
                        </List>

                </DialogContent>
                <DialogActions sx={{ p: theme => `${theme.spacing(3)} !important` }}>
                    {/* <Button variant='text' color='warning' onClick={sendMessage}>Send</Button> */}
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ViewAlotSite
