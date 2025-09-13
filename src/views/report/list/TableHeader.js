import { useCallback, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { TextField, Typography } from '@mui/material'

//**MUi */
import CircularProgress from '@mui/material/CircularProgress'

// ** graphQl
import { useMutation } from '@apollo/client'
import { IMPORT_SITETABLE } from 'src/graphql/mutation/siteTable'

// ** Third Party Imports
import * as XLSX from "xlsx";
import toast from 'react-hot-toast'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

const TableHeader = ({ toggle, handleChange, For, siteTableRefetch, sumOfTwoDates }) => {


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
      {sumOfTwoDates ? <Typography
        sx={{ color: sumOfTwoDates <= 0 ? 'error.main' : 'success.main', mb: 5 }} variant='h5'
      >{`${sumOfTwoDates.toFixed(2)} $`}</Typography> : '.'}

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
