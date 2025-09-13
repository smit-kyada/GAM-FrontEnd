import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import toast from 'react-hot-toast'
import { UPDATE_USER } from 'src/graphql/mutation/user'

const ShowAllData = ({ row, refetch }) => {

  //**state */
  const [checked, setChecked] = useState(row?.showAllData)


  useEffect(() => {
    setChecked(row?.showAllData)
  }, [row?.showAllData])

  // ** Graphql
  const [updateUser] = useMutation(UPDATE_USER);

  const handleChange = (e) => {
    setChecked(e.target.checked)

    updateUser({
      variables: {
        input: {
          id: row?.id,
          showAllData: e.target.checked,
        }
      }
    }).then((result) => {
      toast.success('Successfully Updated!')

      refetch();
    }).catch((error) => {
      toast.error('Something Went Wrong!')
    })
  }

  return (
    <FormControlLabel control={<Switch checked={checked} onChange={(e) => handleChange(e)} />} label='Show All Data' />
  )
}

export default ShowAllData;
