import gql from 'graphql-tag'

export const GET_SITE_REQUESTS = gql`
query GetSiteRequests($page: Int, $limit: Int, $search: String, $filter: String) {
  getSiteRequests(page: $page, limit: $limit, search: $search, filter: $filter) {
    count
    data {
      id
      requestedSite
      requestedDescription
      requestMessage
      status
      adminResponse
      createdAt
      updatedAt
      reviewedAt
      userId {
        id
        userName
        email
        fName
        lName
        companyName
        contact
      }
      siteId {
        id
        site
        description
      }
    }
  }
}
`;

export const GET_MY_SITE_REQUESTS = gql`
query GetMySiteRequests($page: Int, $limit: Int, $search: String, $filter: String) {
  getMySiteRequests(page: $page, limit: $limit, search: $search, filter: $filter) {
    count
    data {
      id
      requestedSite
      requestedDescription
      requestMessage
      status
      adminResponse
      createdAt
      updatedAt
      reviewedAt
    }
  }
}
`;

export const GET_SITE_REQUEST_BY_ID = gql`
query GetSiteRequest($id: ID!) {
  getSiteRequest(id: $id) {
    id
    requestedSite
    requestedDescription
    requestMessage
    status
    adminResponse
    createdAt
    updatedAt
    reviewedAt
    userId {
      id
      userName
      email
      fName
      lName
      companyName
      contact
    }
    siteId {
      id
      site
      description
    }
    reviewedBy {
      id
      userName
      email
    }
    createdSiteId {
      id
      site
      description
    }
  }
}
`;
