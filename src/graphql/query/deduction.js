import gql from 'graphql-tag'

export const GET_ALL_DEDUCTIONS = gql`
query GetAllDeduction($page: Number, $endDate: Date, $limit: Number, $startDate: Date, $isSearch: Boolean, $filter: String, $search: String) {
  getAllDeduction(page: $page, endDate: $endDate, limit: $limit, startDate: $startDate, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      site_link
      deduction
      SiteTableData
      date
    }
    sumWeek
    sumYesterDay
    sumMonth
    sum28Day
    sumToday
    totalErnings
    totalDeduction
    previousMonthTotal
  }
}
`;

export const GET_DEDUCTION = gql`
query GetDeduction($site: String, $page: Number, $limit: Number, $startDate: Date, $endDate: Date) {
  getDeduction(site: $site, page: $page, limit: $limit, startDate: $startDate, endDate: $endDate) {
    count
    data {
      id
      site_link
      deduction
      SiteTableData
      date
    }
    sumWeek
    sumYesterDay
    sumMonth
    sum28Day
    sumToday
    totalErnings
    totalDeduction
    previousMonthTotal
  }
}
`;
