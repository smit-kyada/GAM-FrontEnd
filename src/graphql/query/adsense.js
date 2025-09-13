import gql from 'graphql-tag'

export const GET_ALL_ADSENSE_TOKEN = gql`
query GetAllAccounts($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String) {
  getAllAdsenses(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      access_token
      refresh_token
      scope
      id_token
      token_type
      expiry_date
      authUrl
      isActive
    }
  }
}
`;

export const GET_ADSENSE_TOKEN = gql`
query GetAdsense($getAdsenseId: ID) {
  getAdsense(id: $getAdsenseId) {
    id
    access_token
    refresh_token
    scope
    id_token
    token_type
    expiry_date
    authUrl
    isActive
  }
}
`;

export const GET_ADSENSE_TOTAL_REPORT = gql`
query GetAdsenseTotalReport($page: Number, $limit: Number, $filter: String, $isSearch: Boolean, $search: String) {
  getAdsenseTotalReport(page: $page, limit: $limit, filter: $filter, isSearch: $isSearch, search: $search) {
    TODAY {
      total {
      ESTIMATED_EARNINGS
      }
    }
    YESTERDAY {
      total {
      ESTIMATED_EARNINGS
      }
    }
    LAST_7_DAYS {
      total {
      ESTIMATED_EARNINGS
      }
    }
    MONTH_TO_DATE {
      total {
      ESTIMATED_EARNINGS
      }
    }
    LAST_MONTH {
      total {
      ESTIMATED_EARNINGS
      }
    }
    DATE_RANGE {
      total {
      ESTIMATED_EARNINGS
      }
    }
    YEAR_TO_DATE {
      total {
        id
        DOMAIN_NAME
        COUNTRY_CODE
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


export const GET_ADSENSE_FULL_REPORT = gql`
query GetAdsenseFullReport($page: Number, $limit: Number, $filter: String, $isSearch: Boolean, $search: String) {
  getAdsenseFullReport(page: $page, limit: $limit, filter: $filter, isSearch: $isSearch, search: $search) {
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



export const GET_ADSENSE_FULL_SITE_REPORT = gql`
query GetAdsenseFullSiteReport($page: Number, $limit: Number, $filter: String, $isSearch: Boolean, $search: String) {
  getAdsenseFullSiteReport(page: $page, limit: $limit, filter: $filter, isSearch: $isSearch, search: $search) {
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


export const GET_ADSENSE_SITE_TOTAL_REPORT = gql`
query GetAdsenseSiteTotalReport($page: Number, $limit: Number, $filter: String, $isSearch: Boolean, $search: String) {
  getAdsenseSiteTotalReport(page: $page, limit: $limit, filter: $filter, isSearch: $isSearch, search: $search) {
    TODAY {
      total {
         ESTIMATED_EARNINGS
      }
    }
    YESTERDAY {
           total {
         ESTIMATED_EARNINGS
      }
    }
    LAST_7_DAYS {
                   total {
         ESTIMATED_EARNINGS
      }
    }
    MONTH_TO_DATE {
            total {
         ESTIMATED_EARNINGS
      }
    }
    LAST_MONTH {
            total {
         ESTIMATED_EARNINGS
      }
    }
    YEAR_TO_DATE {
        total {
         ESTIMATED_EARNINGS
      }
    }
  }
}
`;

