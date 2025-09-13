// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Component Import
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'

//** moment  */
import Moment from 'react-moment'

const CardStatsHorizontalWithDetailsGameUser = props => {
  // ** Props
  const {
    sx,
    icon,
    stats,
    title,
    totalSum,
    startDate,
    endDate,
    color,
    subtitle,
    trendDiff,

    iconSize = 24,
    avatarSize = 38,
    trend = 'positive',
    avatarColor = 'primary'
  } = props

  return (
    <Card sx={{ ...sx }}>
      <CardContent sx={{ gap: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          {startDate && <Typography>
            {startDate && <Moment format='MMMM Do YYYY'>{startDate}</Moment>}
            ~~
            {endDate && <Moment format='MMMM Do YYYY'>{endDate}</Moment>}
          </Typography>}
          <Typography
            sx={{ color: totalSum <= 0 ? 'error.main' : 'success.main' }} variant='h5'
          >{`${totalSum}`}</Typography>
          <Box sx={{ mb: 1, columnGap: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography >Total</Typography>
            {/* <Typography
              sx={{ color: totalSum <= 0 ? 'error.main' : 'success.main' }}
            >{`${totalSum}`}</Typography> */}
          </Box>

          <Typography sx={{ mb: 1, color: 'text.secondary' }} >{title}</Typography>
          {/* <Typography sx={{ color: 'text.secondary' }}>{`subtitle`}</Typography> */}
        </Box>
        {/* <CustomAvatar skin='light' variant='rounded' color={avatarColor} sx={{ width: avatarSize, height: avatarSize }}>
          <Icon icon={icon} fontSize={`iconSize`} />
        </CustomAvatar> */}
      </CardContent>
    </Card>
  )
}

export default CardStatsHorizontalWithDetailsGameUser
