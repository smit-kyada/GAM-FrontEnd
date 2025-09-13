import gql from 'graphql-tag'

export const CREATE_AFFREQUEST = gql`
mutation Mutation($input: InAffRequest) {
  createAffRequest(input: $input) {
    id
    name
    email
    mobile
    message
  }
}
`;

export const UPDATE_AFFREQUEST = gql`
mutation UpdateAffRequest($input: InUpAffRequest) {
  updateAffRequest(input: $input) {
    email
  }
}
`;

export const DELETE_AFFREQUEST = gql`
mutation Mutation($deleteAffRequestId: ID) {
  deleteAffRequest(id: $deleteAffRequestId)
}
`;