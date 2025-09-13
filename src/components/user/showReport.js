import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import toast from 'react-hot-toast'
import { UPDATE_USER } from 'src/graphql/mutation/user'

const ShowReport = ({ row, refetch }) => {

  //**state */
  const [checked, setChecked] = useState(row?.showReport)


  useEffect(() => {
    setChecked(row?.showReport)
  }, [row?.showReport])

  // ** Graphql
  const [updateUser] = useMutation(UPDATE_USER);

  const handleChange = (e) => {
    setChecked(e.target.checked)

    updateUser({
      variables: {
        input: {
          id: row?.id,
          showReport: e.target.checked,
          isOnlyReport: false
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
    <FormControlLabel control={<Switch checked={checked} onChange={(e) => handleChange(e)} />} label='Show Report to User' />
  )
}

export default ShowReport;
