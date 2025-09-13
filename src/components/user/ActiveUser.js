import { useMutation } from '@apollo/client'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { useEffect, useState } from 'react'

import toast from 'react-hot-toast'
import { IN_ACTIVE_USER, UPDATE_USER } from 'src/graphql/mutation/user'

const ActiveUser = ({ row, refetch }) => {

  //**state */
  const [checked, setChecked] = useState(row?.isActive)


  useEffect(() => {
    setChecked(row?.isActive)
  }, [row?.isActive])

  // ** Graphql
  const [updateUser] = useMutation(IN_ACTIVE_USER);

  const handleChange = (e) => {
    setChecked(e.target.checked)

    updateUser({
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

export default ActiveUser;
