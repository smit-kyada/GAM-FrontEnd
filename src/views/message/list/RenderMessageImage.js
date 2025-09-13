import React from 'react'
import { useState } from 'react'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

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

const RenderMessageImage = ({ row }) => {

    const [openSe, setOpenSe] = useState(false)

    const Image = row?.includes('http') ? row : `${process.env.NEXT_PUBLIC_BASE_URL}/${row}`

    return (
        <>
            {(row) && <img width={40} height={40} src={Image} alt={row} onClick={() => setOpenSe(true)} />}
            {/* <img width={46} src={`${process.env.NEXT_PUBLIC_BASE_URL}/${row?.images?.[0]}`} alt={row?.images} onClick={() => setOpenSe(true)} /> */}
            <Dialog
                open={openSe}
                onClose={() => setOpenSe(false)}
                aria-labelledby='customized-dialog-title'
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
                <CustomCloseButton aria-label='close' onClick={() => setOpenSe(false)}>
                    <Icon icon='tabler:x' fontSize='1.25rem' />
                </CustomCloseButton>
                <DialogContent dividers sx={{ p: theme => `${theme.spacing(4)} !important` }}>
                    <img width="100%" src={Image} alt={row} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default RenderMessageImage
