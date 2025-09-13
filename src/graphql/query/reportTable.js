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
