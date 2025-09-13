import React from 'react'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// ** hooks
import { useSocket } from 'src/hooks/userSocket'

const SendMessage = ({ row }) => {

    // ** hooks
    const { Socket } = useSocket();

    const sendMessage = () => {
        Socket.emit("getToUser", {
            title: row?.title,
            description: row?.description,
            url: row?.url,
            image: row?.image,
            icon: row?.icon
        })
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
                variant='outlined' color='error' sx={{ ml: 3 }} endIcon={<Icon icon='tabler:send' />}
                component="label" onClick={sendMessage} >
                Send
            </Button>
        </Box>
    )
}

export default SendMessage