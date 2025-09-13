import { useCallback, useState, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

//**MUi */
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import CircularProgress from '@mui/material/CircularProgress'

// ** Custom Component Imports
import CustomInput from './PickersCustomInput'


// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** graphQl
import { useMutation } from '@apollo/client'
import { IMPORT_SITETABLE } from 'src/graphql/mutation/siteTable'

// ** Third Party Imports
import * as XLSX from "xlsx";
import toast from 'react-hot-toast'


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
import { ValidExcel } from 'src/components/ValidExcel'


const staticSiteTableHeader = [
  "Date",
  "Site",
  "Estimated earnings (USD)",
  "Page views",
  "Page RPM (USD)",
  "Impressions",
  "Impression RPM (USD)",
  "Active View Viewable",
  "Clicks"
]

const TableHeader = props => {

  const { user } = useAuth()

  // ** Props
  const { toggle, handleChange, For, siteTableRefetch, startDate, setStartDate, endDate, setEndDate, setFilter, filter } = props
  const [open, setOpen] = useState(false)
  const [xlsxData, setXlsxData] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [fileReader, setFileReader] = useState(null);

  // const [startDate, setStartDate] = useState(new Date())
  // const [endDate, setEndDate] = useState(addDays(new Date(), 15))
  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45))

  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }

  // const CustomInput = forwardRef((props, ref) => {
  //   const startDate = props?.start ? `${format(props?.start, 'MM/dd/yyyy')}` : null
  //   const endDate = props?.end ? ` - ${format(props?.end, 'MM/dd/yyyy')}` : null
  //   const value = `${startDate ? startDate : ''}${endDate ? endDate : ''}`

  //   return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
  // })

  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

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
      var reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        const header = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setHeaderData(header[0])
        setXlsxData(json);
        setOpen(false)
        setFileReader(null);
      };
      reader?.readAsArrayBuffer(e?.target?.files[0]);
      setFileReader(reader);
    } else {
      setOpen(false)
    }
  }

  // Graphql
  const [importSiteTable] = useMutation(IMPORT_SITETABLE);

  const handleUpload = () => {

    if (xlsxData?.length > 0) {

      const isValid = ValidExcel(headerData, staticSiteTableHeader)

      if (isValid) {

        setOpen(true)
        importSiteTable({ variables: { input: xlsxData } }).then((result) => {
          toast.success('Successfully added!')
          setXlsxData('');
          setOpen(false)
          siteTableRefetch()

        }).catch((error) => {
          toast.error(error.message);
          setXlsxData([]);
          setHeaderData([]);
          setOpen(false)
        })
      } else {
        toast.error("Provided Excel is not Match with Sample Excel,Please Check Spelling and Remove Extra Field From Excel if Has.")
      }

    } else {
      toast.error('Data is not available')
    }



  }

  const handleSampleXlsxDownload = () => {

    const link = document.createElement('a');
    link.href = `/siteTable.xlsx`;
    link.download = `/siteTable.xlsx`;
    link.click();

  }

  const handleResetFilter = () => {
    setStartDate()
    setEndDate()
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

      {/* <Box sx={{ mb: 4 }}>
        <DatePickerWrapper>
          <DatePicker
            timeIntervals={15}
            selected={startDate}
            id='date-time-picker2'
            dateFormat='MM/dd/yyyy'
            popperPlacement={popperPlacement}
            onChange={date => setStartDate(date)}
            customInput={<CustomInput label='Select Start Date' />}
          />
        </DatePickerWrapper>
      </Box> */}
      {/* <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <DatePickerWrapper>
          <div>
            <DatePicker
              selectsRange
              endDate={endDate}
              selected={startDate}
              startDate={startDate}
              id='date-range-picker'
              onChange={handleOnChange}
              shouldCloseOnSelect={false}
              popperPlacement={popperPlacement}
              customInput={<CustomInput label='Date Range' start={startDate} end={endDate} />}
            />
          </div>
        </DatePickerWrapper>
        <Button
          variant='text' color='primary' sx={{ ml: 3 }} startIcon={<Icon icon='system-uicons:reset-alt' />}
          component="label" onClick={handleResetFilter}>
          Reset Filter
        </Button>

      </Box> */}


      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

        {/* <TextField
          size='small'
          sx={{ mr: 4 }}
          placeholder={`Search ${For}`}
          onChange={e => optimizedFn(e.target.value)}
        /> */}


        {user?.role == "admin" && <Box sx={{ border: 1, p: 1.5, borderRadius: 1 }}>
          <Button
            variant='outlined' color={xlsxData ? 'secondary' : 'primary'} sx={{ mr: 3 }} startIcon={<Icon icon='tabler:upload' />}
            component="label"
          >
            Import
            <input
              type="file"
              onChange={(e) => xlsxToJson(e)}
              accept=".xls,.xlsx,.csv"
              hidden
            />
          </Button>
          <Button variant='contained' color={"primary"} disabled={xlsxData ? false : true} onClick={handleUpload}>Upload</Button>
          <Button variant='contained' color={"primary"} sx={{ ml: 3 }} onClick={handleSampleXlsxDownload}>Sample excel</Button>
        </Box>}
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
