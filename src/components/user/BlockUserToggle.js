import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useState } from 'react'
import { useMutation } from '@apollo/client'

import toast from 'react-hot-toast'
import { BLOCK_USER, UPDATE_USER } from 'src/graphql/mutation/user'

const BlockUserToggle = ({ row, refetch }) => {

  //**state */
  const [checked, setChecked] = useState(row?.block)

  // ** Graphql
  const [blockUser] = useMutation(BLOCK_USER);

  const handleChange = (e) => {
    setChecked(e.target.checked)

    blockUser({ 
      variables: {
        input: {
          id: row?.id,
          block: e.target.checked
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
    <FormControlLabel control={<Switch checked={checked} onChange={(e) => handleChange(e)} />} label='block' />
  )
}

export default BlockUserToggle;
