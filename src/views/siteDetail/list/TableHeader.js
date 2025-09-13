import { useState, forwardRef } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'


// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'
import * as XLSX from "xlsx";
import { CircularProgress, Dialog, DialogContent, DialogContentText } from '@mui/material'

const TableHeader = props => {
  // ** Props
  const { toggle, handleChange, For, siteTableRefetch, startDate, setStartDate, endDate, setEndDate, userId, dataAll } = props
  const [open, setOpen] = useState(false)


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

  const CustomInput = forwardRef((props, ref) => {
    const startDate = props?.start ? `${format(props?.start, 'MM/dd/yyyy')}` : null
    const endDate = props?.end ? ` - ${format(props?.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate ? startDate : ''}${endDate ? endDate : ''}`

    return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  const auth = useAuth();


  // ** Hook
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  const handleResetFilter = () => {
    setStartDate()
    setEndDate()
  }



  const ExportExcel = () => {

    setOpen(true)

    let flattenedArray = dataAll.map(obj => {

      return {
        "Site": obj?.site,
        "Date": obj?.date,
        "Estimated Earning": obj?.estimatedEarning,
        "ActiveView Viewable": obj?.activeViewViewable,
        "Impressions": obj?.impressions,
        "Impressions Rpm": obj?.impressionsRpm,
        "Page Rpm": obj?.pageRpm,
        "Page Views": obj?.pageViews,
        "Clicks": obj?.clicks,
      };

    }
    );

    const sheet = XLSX?.utils?.json_to_sheet(flattenedArray);
    const workbook = XLSX?.utils.book_new();
    XLSX?.utils?.book_append_sheet(workbook, sheet, 'Sheet1');
    XLSX?.writeFile(workbook, `${new Date()?.getTime()}_site_details.xlsx`);

    setOpen(false)

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
      {auth?.user?.role == "admin" && userId && <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
        <Icon fontSize='1.125rem' icon='tabler:plus' />
        Add Site
      </Button>}
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>

        {auth?.user?.role == "admin" && userId && <Button onClick={ExportExcel} variant='contained' sx={{ '& svg': { ml: 2 }, mr: 5 }}>
          Export
          <Icon fontSize='1.125rem' icon='fluent:arrow-export-up-16-filled' />
        </Button>}

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
            Exporting Data...
          </DialogContentText>
        </DialogContent>
      </Dialog>



    </Box>
  )
}

export default TableHeader
