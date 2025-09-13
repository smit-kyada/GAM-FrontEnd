import { useMutation } from '@apollo/client'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { useEffect, useState } from 'react'

import toast from 'react-hot-toast'
import { UPDATE_USER_ACCOUNT } from 'src/graphql/mutation/user'

const ActiveAccount = ({ row, refetch }) => {

  //**state */
  const [checked, setChecked] = useState(row?.active)


  useEffect(() => {
    setChecked(row?.active)
  }, [row?.active])

  // ** Graphql
  const [updateUser] = useMutation(UPDATE_USER_ACCOUNT);

  const handleChange = (e) => {
    setChecked(e.target.checked)

    updateUser({
      variables: {
        input: {
          id: row?.id,
          active: e.target.checked
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
    <FormControlLabel control={<Switch checked={checked} onChange={(e) => handleChange(e)} />} label='active' />
  )
}

export default ActiveAccount;
