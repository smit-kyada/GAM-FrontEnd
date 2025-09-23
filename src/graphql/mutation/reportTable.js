import gql from 'graphql-tag'

export const DOWNLOAD_HOURS_WISE_CSV = gql`
mutation DownloadHoursWiseCSV($site: [String!], $startDate: String!, $endDate: String!) {
  downloadHoursWiseCSV(
    site: $site
    startDate: $startDate
    endDate: $endDate
  ) {
    csvData
    totalRecords
    totals {
      impressions
      clicks
      ctr
      ecpm
      revenue
      totalRequests
      costPerClick
      matchRate
    }
  }
}
`

export const DOWNLOAD_AD_UNIT_REPORT_CSV = gql`
mutation DownloadAdUnitReportCSV($site: [String!], $country: [String!], $startDate: String!, $endDate: String!, $byDated: Boolean!) {
  downloadAdUnitReportCSV(
    site: $site
    country: $country
    startDate: $startDate
    endDate: $endDate
    byDated: $byDated
  ) {
    csvData
    totalRecords
    totals {
      impressions
      clicks
      ctr
      ecpm
      revenue
      totalRequests
      costPerClick
      matchRate
    }
  }
}
`

export const DOWNLOAD_DAILY_REPORT_CSV = gql`
mutation DownloadDailyReportCSV($site: [String!], $country: [String!], $startDate: String!, $endDate: String!, $byDated: Boolean!) {
  downloadDailyReportCSV(
    site: $site
    country: $country
    startDate: $startDate
    endDate: $endDate
    byDated: $byDated
  ) {
    csvData
    totalRecords
    totals {
      impressions
      clicks
      ctr
      ecpm
      revenue
      totalRequests
      costPerClick
      matchRate
    }
  }
}
`
