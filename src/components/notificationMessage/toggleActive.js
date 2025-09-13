import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useState } from 'react'
import { useMutation } from '@apollo/client'

import toast from 'react-hot-toast'
import { UPDATE_USER } from 'src/graphql/mutation/user'
import { UPDATE_NOTIFICATIONMESSAGE } from 'src/graphql/mutation/notificationMessage'

const ActiveMessage = ({ row, refetch }) => {

  //**state */
  const [checked, setChecked] = useState(row?.isActive)

  // ** Graphql
  const [updateUser] = useMutation(UPDATE_NOTIFICATIONMESSAGE);

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
      toast.success('Successfully Updated!')

      refetch();
    }).catch((error) => {
      toast.error('Something Went Wrong!')
    })
  }

  return (
    <FormControlLabel control={<Switch checked={checked} onChange={(e) => handleChange(e)} />} label='active' />
  )
}

export default ActiveMessage;