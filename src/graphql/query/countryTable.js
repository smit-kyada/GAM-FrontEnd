import gql from 'graphql-tag'

export const GET_ALL_COUNTRYTABLES = gql`
query GetAllCountryTables($startDate: Date, $endDate: Date, $search: String, $filter: String, $isSearch: Boolean, $limit: Number, $page: Number) {
  getAllCountryTables(startDate: $startDate, endDate: $endDate, search: $search, filter: $filter, isSearch: $isSearch, limit: $limit, page: $page) {
    count
    sumMonth
    sumWeek
    sumYesterDay
    sum28Day
    sumOfTwoDates
    sumToday
    previousMonthTotal
    data {
      id
      site
      date
      estimatedEarning
      pageViews
      pageRpm
      impressions
      impressionsRpm
      activeViewViewable
      country
      clicks
    }
  }
}
`;

export const GET_COUNTRYTABLE = gql`
query GetCountry($userId: ID, $siteId:ID,$endDate: Date, $startDate: Date, $limit: Number, $page: Number, $site: String) {
  getCountryTable(userId: $userId,siteId:$siteId endDate: $endDate, startDate: $startDate, limit: $limit, page: $page, site: $site) {
    sumYesterDay
    sumWeek
    sumToday
    sumMonth
    sum28Day
    data {
      id
      site
      date
      estimatedEarning
      pageViews
      pageRpm
      impressions
      country
      impressionsRpm
      activeViewViewable
      clicks
    }
    count
  }
}
`;
