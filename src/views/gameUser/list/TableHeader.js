import { useCallback, useState, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

// ** graphQl
import { useMutation } from '@apollo/client'


// ** Third Party Imports
import * as XLSX from "xlsx";
import toast from 'react-hot-toast'


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'

const TableHeader = ({ setEmpty, handleChange, setIsOnline, isOnline ,isSubscribe ,setIsSubscribe }) => {

    const debounce = (func) => {
        let timer;

        return function (...args) {
            const context = this;
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                func.apply(context, args);
            }, 500);
        };
    };

    const optimizedFn = useCallback(debounce(handleChange), []);

    return (
        <Box
            sx={{
                py: 4,
                px: 6,
                rowGap: 2,
                columnGap: 4,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}
        >


            {/* for active user commented this part because first time start time end time this happen */}

            {/* <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

                <Button
                    variant='contained' color='success' sx={{ ml: 3 }}
                    component="label" onClick={() => setEmpty("empty")}>
                    Get Active User
                </Button>

                <Button
                    variant='text' color='primary' sx={{ ml: 3 }} startIcon={<Icon icon='system-uicons:reset-alt' />}
                    component="label" onClick={() => setEmpty("")}>
                    Reset Filter
                </Button>

            </Box> */}

            <Box>

                <FormControl sx={{ ml: 5}}>
                    <InputLabel id='name-select-2'>IsActive</InputLabel>
                    <Select
                        fullWidth

                        // size="small"
                        value={isOnline}
                        id='selectIsActive'
                        label='IsActive'
                        labelId='name-select-2'
                        onChange={e => setIsOnline(e.target.value)}
                        inputProps={{ placeholder: 'IsActive' }}
                    >
                        <MenuItem value={``}>none</MenuItem>
                        <MenuItem value={true}>Online</MenuItem>
                        <MenuItem value={false}>Offline</MenuItem>
                    </Select>
                </FormControl>


                <FormControl sx={{ ml: 5}}>
                    <InputLabel id='name-select-3'>IsSubscribe</InputLabel>
                    <Select
                        fullWidth
                        
                        // size="small"
                        value={isSubscribe}
                        id='IsSubscribe'
                        label='IsSubscribe'
                        labelId='name-select-3'
                        onChange={e => setIsSubscribe(e.target.value)}
                        inputProps={{ placeholder: 'IsSubscribe' }}
                    >
                        <MenuItem value={``}>none</MenuItem>
                        <MenuItem value={true}>Subscribe</MenuItem>
                        <MenuItem value={false}>UnSubscribe</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant='text' color='primary' sx={{ ml: 3 }} startIcon={<Icon icon='system-uicons:reset-alt' />}
                    component="label" onClick={() => {
                        setIsSubscribe("");
                        setIsOnline("")
                    }}>
                    Reset Filter
                </Button>

            </Box>

            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    size='small'
                    sx={{ mr: 4 }}
                    placeholder={`Search GameUser`}
                    onChange={e => optimizedFn(e.target.value)}
                />
            </Box>

        </Box>
    )
}

export default TableHeader
