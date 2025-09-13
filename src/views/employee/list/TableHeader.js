import { useCallback, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

//**MUi */
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import CircularProgress from '@mui/material/CircularProgress'

// ** graphQl
import { useMutation } from '@apollo/client'
import { IMPORT_USER } from 'src/graphql/mutation/user'

// ** Third Party Imports
import * as XLSX from "xlsx";
import toast from 'react-hot-toast'


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useAuth } from 'src/hooks/useAuth'

const TableHeader = props => {

  const { user } = useAuth()

  // ** Props
  const { toggle, handleChange, For } = props

  const [open, setOpen] = useState(false)
  const [xlsxData, setXlsxData] = useState('');

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

  const xlsxToJson = (e) => {
    e.preventDefault();
    setOpen(true)
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setXlsxData(json);
        setOpen(false)
      };
      reader?.readAsArrayBuffer(e?.target?.files[0]);
    } else {
      setOpen(false)
    }
  }

  // Graphql
  const [importSiteTable] = useMutation(IMPORT_USER);

  const handleUpload = () => {

    setOpen(true)


    if (xlsxData?.length > 0) {
      importSiteTable({ variables: { input: xlsxData } }).then((result) => {
        toast.success('Successfully added!')
        setXlsxData([]);
        setOpen(false)

        // setFiles([]);

      }).catch((error) => {
        ("🚀 ~ file: TableHeader.js:83 ~ importSiteTable ~ error:", error)
        setXlsxData([]);

        // setFiles([]);
        // setIsLoading(false)
      })
    } else {
      toast.error('Data is not available')
    }

    // }

  }

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
      {user?.role == "admin" && <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        Add {For}
      </Button>}
      {For == "BankAccount" && <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        Add {For}
      </Button>}
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          sx={{ mr: 4 }}
          placeholder={`Search ${For}`}
          onChange={e => optimizedFn(e.target.value)}
        />
        {/* <div>
                    <Button
                        variant='outlined' color='secondary' sx={{ mr: 3 }} startIcon={<Icon icon='tabler:upload' />}
                        component="label"
                    >
                        Export
                        <input
                            type="file"
                            onChange={(e) => xlsxToJson(e)}
                            accept=".xls,.xlsx,.csv"
                            hidden
                        />
                    </Button>
                </div>
                <Button variant='contained'  onClick={handleUpload}>Upload</Button> */}
      </Box>

      <Dialog
        open={open}

        // onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent sx={{ textAlign: "center" }}>
          <CircularProgress />
          <DialogContentText id='alert-dialog-description'>
            Loading SiteTable...
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default TableHeader
