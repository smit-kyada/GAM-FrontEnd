import React from 'react'
import SiteRequestTable from 'src/components/commonComponent/SiteRequestTable'

const SiteRequestsPage = () => {
  return <SiteRequestTable />
}

SiteRequestsPage.acl = {
  action: 'read',
  subject: 'site-requests-p'
}

export default SiteRequestsPage
