import gql from 'graphql-tag'

export const GET_ALL_SITES =gql`
query GetAllSites($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String) {
  getAllSites(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      site
      userId {
        id
        userName
        companyName
        fName
        lName
        email
        contact
        isEmailVerified
        role
        profileImg
        companyAddress
        Designation
        pincode
      }
      description
      gameUsers {
        TotalgameUsers
      }
      isActive
    }
  }
}
`;

export const GET_SITE =gql`
query GetSite($getSiteId: ID) {
  getSite(id: $getSiteId) {
    id
    site
    description
  }
}
`;

export const GET_ALOT_SITE_BOOLEAN =gql`
query Query($getAlotSiteBooleanId: ID) {
  getAlotSiteBoolean(id: $getAlotSiteBooleanId)
}`;

export const GET_NOT_ALLOT_SITE =gql`
query Query($getNotAllotedSiteId: ID) {
  getNotAllotedSite(id: $getNotAllotedSiteId) {
    description
    site
    id
  }

}
`;
