// ** Next Imports
import Link from 'next/link'

//**mui */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'

import CustomAvatar from 'src/@core/components/mui/avatar'
import RowOptions from 'src/components/commonComponent/RowOptions'
import UserRowOptions from 'src/components/user/UserRowOption'
import { userRes } from 'src/pages/user'
import { siteTableRes } from 'src/pages/siteTable'
import { siteRes } from 'src/pages/site/index.js'

// ** MUI Imports
import Button from '@mui/material/Button'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import RenderMessageImage from 'src/views/message/list/RenderMessageImage'
import SendMessage from '../message/SendMessage'
import GameUserMessage from '../gameUser/GameUserMessage'

//** moment  */
import Moment from 'react-moment'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { affRequestRes } from 'src/pages/affiliateRequest'
import { messageLogRes } from 'src/pages/messagelog'
import { gameUserRes } from 'src/pages/gameuser'
import { messageRes } from 'src/pages/message'
import TotalGameUserToggle from '../user/TotalGameUserToggle'
import SiteMessage from '../site/GameUserMessage'
import { notificationMessageRes } from 'src/pages/notificationmessage'
import ActiveMessage from '../notificationMessage/toggleActive'
import { subAdminRes } from 'src/pages/subadmin'
import ActiveAccount from '../user/ActiveAccount'
import { userAccountRes } from 'src/pages/account'
import { userAccountResAdmin } from 'src/pages/user/userAccount/[id]'

const ListItemStyled = styled(ListItem)(({ theme }) => ({
  // borderLeftWidth: '3px',
  // borderLeftStyle: 'solid',
  padding: theme.spacing(0, 5),
  marginBottom: theme.spacing(1)
}))

const userStatusObj = {
  true: 'success',
  false: 'error'
}


// ** renders User column
let renderUser = row => {
  if (row?.avatar?.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
      >
        {getInitials(row?.userId?.userName ? row?.userId?.userName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

export const renderClient = row => {
  if (row?.avatar?.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
      >
        {getInitials(row?.userName ? row?.userName : 'John Doe')}
      </CustomAvatar>
    )
  }
}

let renderAffRequest = row => {
  if (row?.avatar?.length) {
    return <CustomAvatar src={row.avatar} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
      >
        {getInitials(row?.name ? row?.name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

// let UserColumn = [
//   {
//     minWidth: 300,
//     field: 'name',
//     headerName: 'Name',
//     renderCell: ({ row }) => {

//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }} >
//           {renderClient(row)}
//           <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
//             <Typography
//               noWrap
//               component={Link} href={`/site/siteDetails/${row?.id}`}
//               sx={{
//                 fontWeight: 500,
//                 textDecoration: 'none',
//                 color: 'text.secondary',
//                 '&:hover': { color: 'primary.main' }
//               }}
//             >
//               {row?.userName}
//             </Typography>
//             <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }} component={Link} href={`/site/siteDetails/${row?.id}`}>
//               {row?.email}
//             </Typography>
//           </Box>
//         </Box>
//       )
//     }
//   },
//   {
//     minWidth: 300,
//     field: 'contact',
//     headerName: 'Contact',
//     renderCell: ({ row }) => {

//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
//             {row?.contact}
//           </Typography>
//         </Box>
//       )
//     }
//   },

//   {
//     minWidth: 300,
//     field: 'showTotalGameUser',
//     headerName: 'show Total GameUser',
//     renderCell: ({ row }) => {

//       return (
//         <TotalGameUserToggle row={row} refetch={userRes} />
//       )
//     }
//   },
//   {
//     minWidth: 100,
//     sortable: false,
//     field: 'actions',
//     headerName: 'Actions',
//     renderCell: ({ row }) => <UserRowOptions userData={row} refetch={userRes} For="User" />
//   }
// ]

let SubAdminColumn = [
  {
    minWidth: 300,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }} >
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link} href={`/site/siteDetails/${row?.id}`}
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {row?.userName}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }} component={Link} href={`/site/siteDetails/${row?.id}`}>
              {row?.email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    minWidth: 300,
    field: 'contact',
    headerName: 'Contact',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.contact}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userData={row} refetch={subAdminRes} For="SubAdmin" />
  }
]

let SiteTableColumn = [

  {
    minWidth: 300,
    field: 'site',
    headerName: 'Site',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.site}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 180,
    field: 'date',
    headerName: 'Date',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.date ? <Moment format='MMMM Do YYYY'>{row?.date}</Moment> : "--"}
        </Typography>
      )
    }
  },
  {
    minWidth: 280,
    field: 'estimatedEarning',
    headerName: 'Estimated earnings (USD)',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap align="right" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.estimatedEarning}$
        </Typography>
      )
    }
  },
  {
    minWidth: 130,
    field: 'pageViews',
    headerName: 'Page views',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.pageViews}
        </Typography>
      )
    }
  },
  {
    minWidth: 150,
    field: 'pageRpm',
    headerName: 'Page RPM (USD)',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.pageRpm}$
        </Typography>
      )
    }
  },
  {
    minWidth: 150,
    field: 'impressions',
    headerName: 'Impressions',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.impressions}
        </Typography>
      )
    }
  },
  {
    minWidth: 220,
    field: 'impressionsRpm',
    headerName: 'Impression RPM (USD)',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.impressionsRpm}$
        </Typography>
      )
    }
  },
  {
    minWidth: 90,
    field: 'clicks',
    headerName: 'Clicks',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.clicks}
        </Typography>
      )
    }
  },
  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userData={row} refetch={siteTableRes} For='SiteTable' />
  }
]


// let SiteColumn = [
//   {
//     minWidth: 300,
//     field: 'name',
//     headerName: 'Name',
//     renderCell: ({ row }) => {

//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           {renderUser(row)}
//           <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
//             <Typography
//               noWrap
//               component={Link} href={`/site/siteDetails/${row?.userId?.id}`}
//               sx={{
//                 fontWeight: 500,
//                 textDecoration: 'none',
//                 color: 'text.secondary',
//                 '&:hover': { color: 'primary.main' }
//               }}
//             >
//               {row?.userId?.userName}
//             </Typography>
//             <Typography noWrap component={Link} href={`/site/siteDetails/${row?.userId?.id}`} variant='body2' sx={{ color: 'text.disabled' }}>
//               {row?.userId?.email}
//             </Typography>
//           </Box>
//         </Box>
//       )
//     }
//   },
//   {
//     minWidth: 300,
//     field: 'site',
//     headerName: 'Site',
//     renderCell: ({ row }) => {

//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Typography noWrap sx={{ color: 'text.secondary' }}>
//             {row?.site}
//           </Typography>
//         </Box>
//       )
//     }
//   },
//   {
//     minWidth: 300,
//     field: 'description',
//     headerName: 'Description',
//     renderCell: ({ row }) => {

//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Typography noWrap sx={{ color: 'text.secondary' }}>
//             {row?.description}
//           </Typography>
//         </Box>
//       )
//     }
//   },
//   {
//     minWidth: 200,
//     field: 'totalGameUser',
//     headerName: 'Total Game User',
//     align: 'center',
//     renderCell: ({ row }) => {

//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
//             {row?.gameUsers?.TotalgameUsers || 0}
//           </Typography>
//         </Box>
//       )
//     }
//   },
//   {
//     minWidth: 150,
//     field: 'deatail',
//     headerName: 'Detail',
//     renderCell: ({ row }) => {

//       return (
//         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//           <Button variant='text' color='secondary' component={Link} href={`/site/siteDetails/${row?.site}`}>
//             Detail
//           </Button>
//         </Box>
//       )
//     }
//   },
//   {
//     minWidth: 200,
//     field: 'send',
//     headerName: 'Send',
//     renderCell: ({ row }) => {

//       return (

//         <SiteMessage row={row} />

//       )
//     }
//   },
//   {
//     minWidth: 100,
//     sortable: false,
//     field: 'actions',
//     headerName: 'Actions',
//     renderCell: ({ row }) => <RowOptions userData={row} refetch={siteRes} For='Site' />
//   }
// ]

let SiteColumnForUser = [
  {
    minWidth: 300,
    field: 'site',
    headerName: 'Site',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.site}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 300,
    field: 'deatail',
    headerName: 'Detail',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button variant='text' color='secondary' component={Link} href={`/site/siteDetails/${row?.site}`}>
            Detail
          </Button>
        </Box>
      )
    }
  },
  {
    minWidth: 200,
    field: 'totalGameUser',
    headerName: 'Total Game User',
    align: 'center',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.gameUsers?.TotalgameUsers || 0}
          </Typography>
        </Box>
      )
    }
  },
]

let SiteTableDetailColumn = [

  {
    minWidth: 300,
    field: 'site',
    headerName: 'Site',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography component={Link} href={`/site/siteDetails/${row?.site}`} noWrap sx={{ color: 'text.secondary' }}>
            {row?.site}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 180,
    field: 'date',
    headerName: 'Date',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.date ? <Moment format='MMMM Do YYYY'>{row?.date}</Moment> : "--"}
        </Typography>
      )
    }
  },
  {
    minWidth: 280,
    field: 'estimatedEarning',
    headerName: 'Estimated earnings (USD)',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap align="right" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.estimatedEarning}$
        </Typography>
      )
    }
  },
  {
    minWidth: 130,
    field: 'pageViews',
    headerName: 'Page views',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.pageViews}
        </Typography>
      )
    }
  },
  {
    minWidth: 150,
    field: 'pageRpm',
    headerName: 'Page RPM (USD)',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.pageRpm}$
        </Typography>
      )
    }
  },
  {
    minWidth: 150,
    field: 'impressions',
    headerName: 'Impressions',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.impressions}
        </Typography>
      )
    }
  },
  {
    minWidth: 220,
    field: 'impressionsRpm',
    headerName: 'Impression RPM (USD)',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.impressionsRpm}$
        </Typography>
      )
    }
  },
  {
    minWidth: 90,
    field: 'clicks',
    headerName: 'Clicks',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.clicks}
        </Typography>
      )
    }
  },

]

let affRequestColumn = [
  {
    minWidth: 300,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }} >
          {renderAffRequest(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {row?.name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }} >
              {row?.email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    minWidth: 300,
    field: 'contact',
    headerName: 'Contact',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.mobile}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 300,
    field: 'message',
    headerName: 'message',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.message}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userData={row} refetch={affRequestRes} For="AffiliateRequest" />
  }
]

let messageColumn = [
  {
    minWidth: 100,
    field: 'icon',
    headerName: 'icon',
    renderCell: ({ row }) => {

      return (
        <RenderMessageImage row={row?.icon} />
      )
    }
  },

  {
    minWidth: 100,
    field: 'image',
    headerName: 'Image',
    renderCell: ({ row }) => {

      return (
        <RenderMessageImage row={row?.image} />
      )
    }
  },
  {
    minWidth: 250,
    field: 'title',
    headerName: 'Name',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.title}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 300,
    field: 'description',
    headerName: 'description',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.description}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 300,
    field: 'url',
    headerName: 'URL',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.url}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 200,
    field: 'send',
    headerName: 'Send',
    renderCell: ({ row }) => {

      return (
        <SendMessage row={row} />
      )
    }
  },
  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userData={row} refetch={messageRes} For='Message' />
  }
]

let gameUserColumn = [
  {
    minWidth: 120,
    field: 'userId',
    headerName: 'UserId',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.userId}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 350,
    field: 'uUrl',
    headerName: 'uUrl',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: 'text.secondary' }}>
            {row?.uUrl}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 200,
    field: 'online',
    headerName: 'Is Online',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {row?.online ? <List component='div'>
            <ListItemStyled>
              <ListItemIcon sx={{ mr: 2.5, '& svg': { color: 'success.main' } }}>
                <Icon icon='mdi:circle' fontSize='0.625rem' />
              </ListItemIcon>
              <ListItemText
                primary='Online'
              />
            </ListItemStyled>
          </List> :
            <List component='div'>
              <ListItemStyled>
                <ListItemIcon sx={{ mr: 2.5, '& svg': { color: 'error.main' } }}>
                  <Icon icon='mdi:circle' fontSize='0.625rem' />
                </ListItemIcon>
                <ListItemText
                  primary='Offline'
                />
              </ListItemStyled>
            </List>
          }
        </Box>
      )
    }
  },
  {
    minWidth: 170,
    field: 'subscribe',
    headerName: 'subscriber',
    renderCell: ({ row }) => {

      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row?.fcmValue?.endpoint ? `Subscribe` : `UnSubscribe`}
          color={userStatusObj[row?.fcmValue?.endpoint ? true : false]}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    minWidth: 150,
    field: 'country_code',
    headerName: 'country_code',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: 'text.secondary' }}>
            {row?.country_code}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 200,
    field: 'send',
    headerName: 'Send',
    renderCell: ({ row }) => {

      return (

        <GameUserMessage row={row} />

      )
    }
  },
  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userData={row} refetch={gameUserRes} For='GameUser' />
  }
]

let messageLogColumn = [
  {
    minWidth: 100,
    field: 'click',
    headerName: 'Click',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.click}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 350,
    field: 'site',
    headerName: 'site',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.site}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 100,
    field: 'icon',
    headerName: 'icon',
    renderCell: ({ row }) => {

      return (
        <RenderMessageImage row={row?.messageId?.icon} />
      )
    }
  },

  {
    minWidth: 100,
    field: 'image',
    headerName: 'Image',
    renderCell: ({ row }) => {

      return (
        <RenderMessageImage row={row?.messageId?.image} />
      )
    }
  },
  {
    minWidth: 250,
    field: 'title',
    headerName: 'Name',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.messageId?.title}
          </Typography>
        </Box>
      )
    }
  },

  // {
  //   minWidth: 300,
  //   field: 'description',
  //   headerName: 'description',
  //   renderCell: ({ row }) => {

  //     return (
  //       <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //         <Typography noWrap sx={{ color: 'text.secondary' }}>
  //           {row?.messageId?.description}
  //         </Typography>
  //       </Box>
  //     )
  //   }
  // },
  {
    minWidth: 300,
    field: 'url',
    headerName: 'URL',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.messageId?.url}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userData={row} refetch={messageLogRes} For='messageLog' />
  }
]



let notificationMessageColumn = [
  {
    minWidth: 700,
    field: 'title',
    headerName: 'title',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.title}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 300,
    field: 'color',
    headerName: 'color',
    renderCell: ({ row }) => {

      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row?.color}
          color={row?.color}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    minWidth: 200,
    sortable: false,
    field: 'Active',
    headerName: 'Active',
    renderCell: ({ row }) => <ActiveMessage row={row} refetch={notificationMessageRes} />
  },
  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userData={row} refetch={notificationMessageRes} For='NotificationMessage' />
  }
]


let UserAccountColumn = [
  {
    minWidth: 300,
    field: 'bankName',
    headerName: 'Bank Name',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.bankName}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 150,
    field: 'IFSC',
    headerName: 'IFSC',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.IFSC}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 200,
    field: 'accountNumber',
    headerName: 'Account Number',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.accountNumber}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 100,
    field: 'accountType',
    headerName: 'Account Type',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.accountType}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 250,
    field: 'accountHolderName',
    headerName: 'Account Holder Name',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.accountHolderName}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 250,
    field: 'GstNumber',
    headerName: 'Gst Number',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.GstNumber}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 100,
    field: 'image',
    headerName: 'Image',
    renderCell: ({ row }) => {

      return (
        <RenderMessageImage row={row?.GstCertificate} />
      )
    }
  },

  {
    minWidth: 200,
    sortable: false,
    field: 'Active',
    headerName: 'Active',
    renderCell: ({ row }) => <ActiveAccount row={row} refetch={userAccountRes} />
  },

  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userData={row} refetch={userAccountRes} For='UserAccount' />
  }
]


let AdminUserAccountColumn = [
  {
    minWidth: 300,
    field: 'bankName',
    headerName: 'Bank Name',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.bankName}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 150,
    field: 'IFSC',
    headerName: 'IFSC',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.IFSC}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 200,
    field: 'accountNumber',
    headerName: 'Account Number',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.accountNumber}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 100,
    field: 'accountType',
    headerName: 'Account Type',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.accountType}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 250,
    field: 'accountHolderName',
    headerName: 'Account Holder Name',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.accountHolderName}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 250,
    field: 'GstNumber',
    headerName: 'Gst Number',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.GstNumber}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 100,
    field: 'image',
    headerName: 'Image',
    renderCell: ({ row }) => {

      return (
        <RenderMessageImage row={row?.GstCertificate} />
      )
    }
  },

  {
    minWidth: 200,
    sortable: false,
    field: 'Active',
    headerName: 'Active',
    renderCell: ({ row }) => <ActiveAccount row={row} refetch={userAccountResAdmin} />
  },

  {
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions userData={row} refetch={userAccountResAdmin} For='UserAccount' />
  }
]



let LiveReportColumn = [

  {
    minWidth: 300,
    field: 'site',
    headerName: 'Site',
    renderCell: ({ row }) => {

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.DOMAIN_NAME}
          </Typography>
        </Box>
      )
    }
  },
  {
    minWidth: 180,
    field: 'date',
    headerName: 'Date',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.DATE ? <Moment format='MMMM Do YYYY'>{row?.DATE}</Moment> : "--"}
        </Typography>
      )
    }
  },
  {
    minWidth: 280,
    field: 'estimatedEarning',
    headerName: 'Estimated earnings (USD)',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap align="right" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.ESTIMATED_EARNINGS}$
        </Typography>
      )
    }
  },
  {
    minWidth: 130,
    field: 'pageViews',
    headerName: 'Page views',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.PAGE_VIEWS}
        </Typography>
      )
    }
  },
  {
    minWidth: 150,
    field: 'pageRpm',
    headerName: 'Page RPM (USD)',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.PAGE_VIEWS_RPM}$
        </Typography>
      )
    }
  },
  {
    minWidth: 150,
    field: 'impressions',
    headerName: 'Impressions',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.IMPRESSIONS}
        </Typography>
      )
    }
  },
  {
    minWidth: 220,
    field: 'impressionsRpm',
    headerName: 'Impression RPM (USD)',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.IMPRESSIONS_RPM}$
        </Typography>
      )
    }
  },
  {
    minWidth: 90,
    field: 'clicks',
    headerName: 'Clicks',
    align: 'right',
    renderCell: ({ row }) => {

      return (
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
          {row?.CLICKS}
        </Typography>
      )
    }
  }
]

export {

  // UserColumn,

  SiteTableColumn,

  // SiteColumn,
  SiteColumnForUser,
  SiteTableDetailColumn,
  affRequestColumn,
  messageLogColumn,
  gameUserColumn,
  messageColumn,
  notificationMessageColumn,
  SubAdminColumn,
  UserAccountColumn,
  AdminUserAccountColumn,
  LiveReportColumn
}
