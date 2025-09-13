import { useCallback, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

const TableHeader = props => {
    // ** Props
    const { toggle, handleChange, For } = props

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
            <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                <Icon fontSize='1.125rem' icon='tabler:plus' />
                Add {For}
            </Button>
            <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <TextField
                    size='small'
                    sx={{ mr: 4 }}
                    placeholder={`Search ${For}`}
                    onChange={e => optimizedFn(e.target.value)}
                />
            
            </Box>

           
        </Box>
    )
}

export default TableHeader
