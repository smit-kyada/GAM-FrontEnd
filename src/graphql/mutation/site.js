import gql from 'graphql-tag'

export const CREATE_SITE=gql`
mutation Mutation($input: InSite) {
  createSite(input: $input) {
    id
    site
  }
}
`;

export const UPDATE_SITE =gql`
mutation UpdateSite($input: InUpSite) {
  updateSite(input: $input) {
    site
  }
}
`;

export const DELETE_SITE =gql`
mutation DeleteSite($deleteSiteId: ID) {
  deleteSite(id: $deleteSiteId)
}
`;

export const UPDATE_USER_SITE =gql`
mutation Mutation($input: InUpSite) {
  updateUserSite(input: $input) {
    id
  }
}
`;

export const GENERATE_ADSENSE_EXCEL =gql`
mutation GenrateAdsenseExcel($input: String) {
  genrateAdsenseExcel(input: $input)
}
`;
