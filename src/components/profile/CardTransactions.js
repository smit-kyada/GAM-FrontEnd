// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import RowOptions from 'src/views/profile/rowOption'
import UpdateModel from 'src/views/profile/updateModel'

// const data = [
//   {
//     amount: 75,
//     title: 'Wallet',
//     subtitle: 'Starbucks',
//     amountDiff: 'negative',
//     avatarColor: 'primary',
//     avatarIcon: 'tabler:wallet'
//   },
//   {
//     amount: 480,
//     subtitle: 'Add Money',
//     title: 'Bank Transfer',
//     avatarColor: 'success',
//     avatarIcon: 'tabler:browser-check'
//   },
//   {
//     amount: 268,
//     title: 'PayPal',
//     avatarColor: 'error',
//     subtitle: 'Client Payment',
//     avatarIcon: 'tabler:brand-paypal'
//   },
//   {
//     amount: 699,
//     title: 'Master Card',
//     amountDiff: 'negative',
//     avatarColor: 'secondary',
//     subtitle: 'Ordered iPhone 13',
//     avatarIcon: 'tabler:credit-card'
//   },
//   {
//     amount: 98,
//     subtitle: 'Refund',
//     avatarColor: 'info',
//     title: 'Bank Transaction',
//     avatarIcon: 'tabler:currency-dollar'
//   },
//   {
//     amount: 126,
//     title: 'PayPal',
//     avatarColor: 'error',
//     subtitle: 'Client Payment',
//     avatarIcon: 'tabler:brand-paypal'
//   },
//   {
//     amount: 1290,
//     title: 'Bank Transfer',
//     amountDiff: 'negative',
//     avatarColor: 'success',
//     subtitle: 'Pay Office Rent',
//     avatarIcon: 'tabler:browser-check'
//   }
// ]

const CardTransactions = ({ bankDetail, bankDetailRefetch }) => {
  return (
    <Card className='card'>
      <CardHeader
        title='Bank Detail' subheaderTypographyProps={{ sx: { mt: '0 !important' } }}
        action={

          // <RowOptions userData={bankDetail} refetch={bankDetailRefetch} For="AffiliateRequest" />

          <UpdateModel userData={bankDetail} refetch={bankDetailRefetch} For="AffiliateRequest" />



          // <OptionsMenu
          //   options={['Edit', 'Delete']}
          //   iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          // />
        }
      />
      <CardContent>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
          <CustomAvatar skin='light' variant='rounded' color={"secondary"} sx={{ mr: 4, width: 34, height: 34 }}>
            <Icon icon={"mdi:bank"} />
          </CustomAvatar>

          <Box sx={{ rowGap: 1, columnGap: 4, width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography sx={{ fontWeight: 500 }}>Bank Name</Typography>
            </Box>
            <Typography sx={{ fontWeight: 500 }} >
              {bankDetail?.bankName}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
          <CustomAvatar skin='light' variant='rounded' color={"info"} sx={{ mr: 4, width: 34, height: 34 }}>
            <Icon icon={"mdi:card-account-details"} />
          </CustomAvatar>
          <Box sx={{ rowGap: 1, columnGap: 4, width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography sx={{ fontWeight: 500 }}>Account Number</Typography>
            </Box>
            <Typography sx={{ fontWeight: 500 }} >
              {bankDetail?.accNumber}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>

          <CustomAvatar skin='light' variant='rounded' color={"success"} sx={{ mr: 4, width: 34, height: 34 }}>
            {/* <Icon icon={item.avatarIcon} /> */}
          </CustomAvatar>

          <Box sx={{ rowGap: 1, columnGap: 4, width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography sx={{ fontWeight: 500 }}>IFSC Code</Typography>
            </Box>

            <Typography sx={{ fontWeight: 500 }} >
              {bankDetail?.ifscCode}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 5 }}>
          <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4, width: 34, height: 34 }}>
            {/* <Icon icon={item.avatarIcon} /> */}
          </CustomAvatar>
          <Box sx={{ rowGap: 1, columnGap: 4, width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography sx={{ fontWeight: 500 }}>Swift Code</Typography>
            </Box>
            <Typography sx={{ fontWeight: 500 }} >
              {bankDetail?.swiftCode}
            </Typography>
          </Box>
        </Box>

      </CardContent>
    </Card>
  )
}

export default CardTransactions
