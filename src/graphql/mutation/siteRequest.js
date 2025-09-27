import gql from 'graphql-tag'

export const REVIEW_SITE_REQUEST = gql`
mutation ReviewSiteRequest($input: SiteRequestReviewInput!) {
  reviewSiteRequest(input: $input) {
    id
    status
    adminResponse
    reviewedAt
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

export const CREATE_SITE_REQUEST = gql`
mutation CreateSiteRequest($input: SiteRequestInput!) {
  createSiteRequest(input: $input) {
    id
    requestedSite
    requestedDescription
    requestMessage
    status
    createdAt
    userId {
      id
      userName
      email
    }
  }
}
`;

export const DELETE_SITE_REQUEST = gql`
mutation DeleteSiteRequest($id: ID!) {
  deleteSiteRequest(id: $id)
}
`;
