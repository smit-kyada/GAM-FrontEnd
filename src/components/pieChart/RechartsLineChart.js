// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'


const CustomTooltip = props => {
  // ** Props
  const { active, payload } = props
  if (active && payload) {

    return (
      <div className='recharts-custom-tooltip'>
        <Typography sx={{ fontSize: '0.875rem' }}>{`${payload[0].value?.toFixed(2)} $`}</Typography>
      </div>
    )
  }

  return null
}

const RechartsLineChart = ({ direction, data }) => {
  const totalEarning = data.reduce((total, item) => total + item.totalEstimatedEarning, 0);

  return (
    <Card>
      <CardHeader
        title='Estimated Earnings Report'
        subheader='Last 30 Days Estimated Earnings'
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6' sx={{ mr: 5 }}>
              {/* $ {totalEarning?.toFixed(2)} */}
            </Typography>
            <CustomChip
              skin='light'
              color='success'
              sx={{ fontWeight: 500, borderRadius: 1, fontSize: '0.875rem' }}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1 } }}>
                  <Icon icon='tabler:arrow-up' fontSize='1rem' />
                  <span>
                    {/* 22% */}
                    $ {totalEarning}
                  </span>
                </Box>
              }
            />
          </Box>
        }
      />
      <CardContent>
        <Box sx={{ height: 350 }}>
          <ResponsiveContainer>
            <LineChart height={350} data={data} style={{ direction }} >

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey='date'
                reversed={direction === 'rtl'}
                interval={0}
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis orientation={direction === 'rtl' ? 'right' : 'left'} />
              {/* <Tooltip content={CustomTooltip} /> */}
              <Tooltip />
              <Legend />
              <Line dataKey='totalEstimatedEarning' stroke='#EA5455' activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RechartsLineChart
