
import { Icon } from '@iconify/react';
import { Checkbox } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx'
import Select from 'react-select'
import countryList from 'react-select-country-list'

const FilterComponent = ({ setFilterStatus, data, setHandeleSiteDataSearch }) => {

  const [side, setSide] = useState([])

  const handleSideChange = (event, newValue) => { setSide(newValue) }

  const handleTypeChange = (event, newValue) => { setType(newValue) }
  const handleIVRverificationChange = (event, newValue) => { setIVRverification(newValue) }
  const handleWhatsappChange = (event, newValue) => { setWhatsapp(newValue) }

  const [value, setValue] = useState('')
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = value => {
    setValue(value)
  }

  const ApplyFilter = () => {
    setFilterStatus({ country: value?.label || "", site: side?.length > 0 && side?.map(i => i?.site) || ""  })
  }

  const handleExport = () => {
    const sheet = XLSX?.utils?.json_to_sheet(data);
    const workbook = XLSX?.utils.book_new();
    XLSX?.utils?.book_append_sheet(workbook, sheet, 'Sheet1');
    XLSX?.writeFile(workbook, `${new Date()?.getTime()}_orders.xlsx`);
  }


  return (
    <Grid container spacing={3} sm={12} sx={{ margin: "12px 10px 24px 10px" }}>

      {/* <Grid item xs={12} sm={2}>
        <DateRangeFilter startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
      </Grid> */}

      <Grid sx={{ p: 0 }} item xs={12} sm={3} >

        <Autocomplete
          fullWidth
          multiple={true}
          size='small'
          disableCloseOnSelect
          options={data}
          isOptionEqualToValue={(option, value) => {
            return option.id === value.id
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{ marginRight: 8, }}
                checked={selected}
              />
              {option.site}
            </li>
          )}
          onChange={handleSideChange}
          id='autocomplete-controlled'
          getOptionLabel={option => option.site || ''}
          renderInput={params => <TextField  {...params} label='Select Site' onChange={(e)=> setHandeleSiteDataSearch(e.target.value)}/>}
          limitTags={2}
        />

      </Grid>

      {/* <Grid sx={{ pr: 0 }} item xs={12} sm={2} >
        <Autocomplete
          fullWidth
          multiple={true}
          size='small'
          disableCloseOnSelect
          options={data}
          isOptionEqualToValue={(option, value) => {
            return option.id === value.id
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                style={{ marginRight: 8, }}
                checked={selected}
              />
              {option.site}
            </li>
          )}
          onChange={handleSideChange}
          id='autocomplete-controlled'
          getOptionLabel={option => option.site || ''}
          renderInput={params => <TextField  {...params} label='Select Countery' />}
          limitTags={2}
        />
      </Grid> */}

      {/* <Grid sx={{ p: 0 }} item xs={12} sm={2} >
        <Autocomplete
          fullWidth
          value={IVRverification}
          size='small'
          options={[{
            name: "All"
          },
          {
            name: "verified"
          },
          {
            name: "cancelled"
          }]}

          onChange={handleIVRverificationChange}
          id='autocomplete-controlled2'
          getOptionLabel={option => option?.name || ""}
          renderInput={params => <TextField  {...params} label='IVR Verification' />}
        />
      </Grid> */}
      <Grid sx={{ p: 0 }} item xs={12} sm={2} >
        <Select options={options} value={value} onChange={changeHandler} />
      </Grid>


      <Grid sx={{ p: 0 }} item xs={12} sm={2} >
        <Button variant='contained' color='success' sx={{ mr: 2 }} onClick={ApplyFilter}>
          Apply
        </Button>

        <Button variant='contained' color='error' onClick={() => {
          setSide(""), setFilterStatus("")
        }}>
          clear
        </Button>
      </Grid>

      <Grid sx={{ p: 0 }} item xs={12} sm={2} >
        <Button variant='contained' color='primary' onClick={() => handleExport()}>
          Download Excel &nbsp; <Icon icon="fa6-solid:file-excel" />
        </Button>
      </Grid>

    </Grid>
  )
}

export default FilterComponent
