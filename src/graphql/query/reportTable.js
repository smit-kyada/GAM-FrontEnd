import gql from "graphql-tag";

export const GET_ALL_REPORTTABLES = gql`
  query GetReports(
    $site: [String!]
    $country: [String]
    $startDate: String!
    $byDated: Boolean!
    $endDate: String!
    $page: Int!
    $limit: Int!
  ) {
    getReports(
      site: $site
      country: $country
      startDate: $startDate
      endDate: $endDate
      byDated: $byDated
      page: $page
      limit: $limit
    ) {
      totalDocs
      totalPages
      page
      docs {
        id
        date
        site
        impressions
        clicks
        ctr
        ecpm
        revenue
        totalRequests
        costPerClick
        matchRate
        country
      }
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
`;

export const GET_ADUNIT_REPORTTABLES = gql`
  query getAdUnitReports(
    $site: [String!]
    $country: [String]
    $startDate: String!
    $byDated: Boolean!
    $endDate: String!
    $page: Int!
    $limit: Int!
  ) {
     getAdUnitReports(
      site: $site
      country: $country
      startDate: $startDate
      endDate: $endDate
      byDated: $byDated
      page: $page
      limit: $limit
     ) {
      totalDocs
      totalPages
      page
      docs {
        id
        date
        site
        impressions
        clicks
        ctr
        ecpm
        revenue
        totalRequests
        costPerClick
        matchRate
        country
      }
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
`;

export const GET_HOURS_REPORTTABLES = gql`
  query getHoursWiseReports(
    $site: [String!]
    $startDate: String!
    $endDate: String!
    $page: Int!
    $limit: Int!
  ) {
    getHoursWiseReports(
      site: $site
      startDate: $startDate
      endDate: $endDate
      page: $page
      limit: $limit
    ) {
      totalDocs
      totalPages
      page
      docs {
        id
        date
        site
        impressions
        clicks
        ctr
        ecpm
        revenue
        totalRequests
        costPerClick
        matchRate
        hour
      }
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
`;

export const GET_ALL_REPORTTABLES_BY_DATE = gql`
  query getTotalRevenueData(
    $sites: [String!]
    $days: Int!
  ) {
    getTotalRevenueData(
      sites: $sites
      days: $days
    ) {
      dailyData {
        date
        totalRevenue
        sites
      }
    }
  }
`;