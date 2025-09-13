import gql from 'graphql-tag'

export const GET_ALL_SITETABLES = gql`
query GetAllSiteTables($startDate: Date, $endDate: Date, $search: String, $filter: String, $isSearch: Boolean, $limit: Number, $page: Number) {
  getAllSiteTables(startDate: $startDate, endDate: $endDate, search: $search, filter: $filter, isSearch: $isSearch, limit: $limit, page: $page) {
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
      clicks
    }
  }
}
`;

export const GET_USER_SITETABLE_REPORT = gql`
query GetUserSiteTableReport($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String, $startDate: Date, $endDate: Date) {
  getUserSiteTableReport(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search, startDate: $startDate, endDate: $endDate) {
    count
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
      clicks
    }
    sumWeek
    sumYesterDay
    sumMonth
    sum28Day
    sumToday
    sumOfTwoDates
    previousMonthTotal
  }
}
`;

export const GET_SITETABLE = gql`
query GetSite($userId: ID, $siteId:ID,$endDate: Date, $startDate: Date, $limit: Number, $page: Number, $site: String, $fetchAll:Boolean) {
  getSiteTable(userId: $userId,siteId:$siteId endDate: $endDate, startDate: $startDate, limit: $limit, page: $page, site: $site, fetchAll:$fetchAll) {
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
      impressionsRpm
      activeViewViewable
      clicks
    }
    count
  }
}
`;

export const GET_SITE_REPORT_SITETABLE = gql`
query GetSiteReportSiteTable($page: Number, $limit: Number, $startDate: Date, $endDate: Date, $siteId: ID,$site: String) {
  getSiteReportSiteTable(page: $page, limit: $limit, startDate: $startDate, endDate: $endDate, siteId: $siteId,site: $site) {
    count
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
      clicks
    }
    sumWeek
    sumYesterDay
    sumMonth
    sum28Day
    sumToday
    sumOfTwoDates
    previousMonthTotal
  }
}
`;

export const GET_SITETABLE_REPORT = gql`
query GetSiteTableReport($page: Number, $limit: Number, $filter: String, $isSearch: Boolean, $search: String) {
  getSiteTableReport(page: $page, limit: $limit, filter: $filter, isSearch: $isSearch, search: $search) {
    TODAY {
      total {
        IMPRESSIONS
        CLICKS
        PAGE_VIEWS
        ESTIMATED_EARNINGS
        PAGE_VIEWS_RPM
        IMPRESSIONS_RPM
        ACTIVE_VIEW_VIEWABILITY
      }
    }
    YESTERDAY {
          total {
        IMPRESSIONS
        CLICKS
        PAGE_VIEWS
        ESTIMATED_EARNINGS
        PAGE_VIEWS_RPM
        IMPRESSIONS_RPM
        ACTIVE_VIEW_VIEWABILITY
      }
    }
    LAST_7_DAYS {
          total {
        IMPRESSIONS
        CLICKS
        PAGE_VIEWS
        ESTIMATED_EARNINGS
        PAGE_VIEWS_RPM
        IMPRESSIONS_RPM
        ACTIVE_VIEW_VIEWABILITY
      }
    }
    MONTH_TO_DATE {
          total {
        IMPRESSIONS
        CLICKS
        PAGE_VIEWS
        ESTIMATED_EARNINGS
        PAGE_VIEWS_RPM
        IMPRESSIONS_RPM
        ACTIVE_VIEW_VIEWABILITY
      }
    }
    LAST_MONTH {
          total {
        IMPRESSIONS
        CLICKS
        PAGE_VIEWS
        ESTIMATED_EARNINGS
        PAGE_VIEWS_RPM
        IMPRESSIONS_RPM
        ACTIVE_VIEW_VIEWABILITY
      }
    }
    YEAR_TO_DATE {
          total {
        id
        DOMAIN_NAME
        COUNTRY_CODE
        COUNTRY_NAME
        DATE
        IMPRESSIONS
        CLICKS
        PAGE_VIEWS
        ESTIMATED_EARNINGS
        PAGE_VIEWS_RPM
        IMPRESSIONS_RPM
        ACTIVE_VIEW_VIEWABILITY
      }
    }
  }
}
`;
