import gql from 'graphql-tag'

export const CREATE_ADSENSE_TOKEN = gql`
mutation CreateAdsense($input: InAdsense) {
  createAdsense(input: $input) {
    id
    access_token
    refresh_token
    scope
    id_token
    token_type
    expiry_date
    isActive
  }
}
`;

export const UPDATE_ADSENSE_TOKEN = gql`
mutation UpdateAdsense($input: InUpAdsense) {
  updateAdsense(input: $input) {
    id
    access_token
    refresh_token
    scope
    id_token
    token_type
    expiry_date
    isActive
  }
}
`;

export const DELETE_ADSENSE_TOKEN = gql`
mutation DeleteAdsense($deleteAdsenseId: ID) {
  deleteAdsense(id: $deleteAdsenseId)
}
`;

