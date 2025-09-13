const navigation = () => {
  return [

    {
      title: 'Home',
      action: 'read',
      subject: 'home-c',
      path: '/home',
      icon: 'tabler:smart-home',
    },
    {
      title: 'Users',
      icon: 'clarity:users-solid',
      children: [
        {
          title: 'User',
          path: '/user',
          action: 'read',
          subject: 'user-p',
          icon: 'clarity:users-solid',
        },
        {
          path: '/subadmin',
          action: 'read',
          subject: 'subadmin-p',
          title: 'Sub Admin',
          icon: 'clarity:administrator-solid',
        },
        {
          path: '/affiliateRequest',
          action: 'read',
          subject: 'affiliateRequest-p',
          title: 'Affiliate Request',
          icon: 'mdi:partnership',
        },
      ]
    },
    {
      title: 'Site Setting',
      icon: 'arcticons:url-checker',
      action: 'read',
      subject: 'siteTable-p',
      children: [
        {
          path: '/siteTable',
          action: 'read',
          subject: 'siteTable-p',
          title: 'SiteTable',
          icon: 'fluent-mdl2:live-site',
        },

        // {
        //   path: '/country',
        //   action: 'read',
        //   subject: 'country',
        //   title: 'CountryTable',
        //   icon: 'gis:search-country',
        // },
        {
          path: '/site',
          action: 'read',
          subject: 'sites-p',
          title: 'Site',
          icon: 'dashicons:admin-site',
        },
      ]
    },
    {
      title: 'Message Setting',
      icon: 'zondicons:notification',
      children: [
        {
          title: 'Message',
          action: 'read',
          subject: 'messages-p',
          path: '/message',
          icon: 'tabler:message',
        },
        {
          title: 'MessageLog',
          action: 'read',
          subject: 'messageLog-p',
          path: '/messagelog',
          icon: 'octicon:log-24',
        },
        {
          title: 'NotificationMessage',
          action: 'read',
          subject: 'notificationmessages-p',
          path: '/notificationmessage',
          icon: 'jam:alert',
        },
      ]
    },
    {
      title: 'Reports',
      icon: 'mdi:report-line',

      // action: 'read',
      // subject: 'reportLog-p',
      children: [
        {
          title: 'ReportLog',
          action: 'read',
          subject: 'reportLog-p',
          path: '/reportlog',
          icon: 'material-symbols:history',
        },
        {
          path: '/report',
          action: 'read',
          subject: 'report-p',
          title: 'Report',
          icon: 'mdi:report-line',
        },
        {
          path: '/livereport',
          action: 'read',
          subject: 'livereport-p',
          title: 'Live Report',
          icon: 'mdi:file-report-outline',
        },
        {
          path: '/reportTable',
          action: 'read',
          subject: 'reporttable-p',
          title: 'Report Table',
          icon: 'mdi:file-report-outline',
        },
      ]
    },
    {
      path: '/country',
      action: 'read',
      subject: 'country',
      title: 'CountryTable',
      icon: 'fluent-mdl2:world',
    },

    {
      path: '/profile',
      action: 'read',
      subject: 'profile-p',
      title: 'Profile',
      icon: 'gg:profile',
    },
    {
      path: '/mysite',
      action: 'read',
      subject: 'mysites-p',
      title: 'My Sites',
      icon: 'fluent-mdl2:live-site',
    },
    {
      path: '/account',
      action: 'read',
      subject: 'mysites-p',
      title: 'Accounts',
      icon: 'mdi:bank',
    },
    // {
    //   title: 'Deduction',
    //   action: 'read',
    //   subject: 'deduction-p',
    //   path: '/deduction',
    //   icon: 'map:accounting',
    // },
    {
      title: 'Token',
      action: 'read',
      subject: 'adsense-p',
      path: '/adsense',
      icon: 'material-symbols:security',
    },
    {
      title: 'Block User Messages',
      action: 'read',
      subject: 'blockusermessage-p',
      path: '/blockuserquery',
      icon: 'material-symbols:block',
    },

    // {
    //   path: '/report',
    //   action: 'read',
    //   subject: 'report-p',
    //   title: 'Report',
    //   icon: 'mdi:file-report-outline',
    // },
    {
      path: '/sitereport',
      action: 'read',
      subject: 'sitereport-p',
      title: 'Site Report',
      icon: 'mdi:file-report-outline',
    },

    // {
    //   path: '/livereport',
    //   action: 'read',
    //   subject: 'livereport-p',
    //   title: 'Live Report',
    //   icon: 'mdi:file-report-outline',
    // },
  ]
}

export default navigation
