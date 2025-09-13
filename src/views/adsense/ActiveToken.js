import { useMutation } from '@apollo/client'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { useEffect, useState } from 'react'

import toast from 'react-hot-toast'
import { UPDATE_ADSENSE_TOKEN } from 'src/graphql/mutation/adsense'

const ActiveToken = ({ row, refetch }) => {

  //**state */
  const [checked, setChecked] = useState(row?.isActive)


  useEffect(() => {
    setChecked(row?.isActive)
  }, [row?.isActive])

  // ** Graphql
  const [tokenUpdate] = useMutation(UPDATE_ADSENSE_TOKEN);

  const handleChange = (e) => {
    setChecked(e.target.checked)

    tokenUpdate({
      variables: {
        input: {
          id: row?.id,
          isActive: e.target.checked
        }
      }
    }).then((result) => {
      refetch();
      toast.success('Successfully Updated!')
    }).catch((error) => {
      toast.error('Something Went Wrong!')
    })
  }

  return (
    <FormControlLabel control={<Switch checked={checked} onChange={(e) => handleChange(e)} />} label={`${checked ? "Active" : "In-Active"}`} />
  )
}

export default ActiveToken;
