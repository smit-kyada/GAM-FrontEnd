import gql from 'graphql-tag'

export const ADD_BANKDETAIL = gql`
mutation Mutation($input: InBankDetail) {
  createBankDetail(input: $input) {
    accNumber
    bankName
    id
    ifscCode
    swiftCode
  }
}
`;

export const UPDATE_BANKDETAIL = gql`
mutation Mutation($input: InUpBankDetail) {
  updateBankDetail(input: $input) {
    id
    bankName
  }
}
`;

export const DELETE_BANKDETAIL = gql`
mutation Mutation($deleteBankDetailId: ID) {
  deleteBankDetail(id: $deleteBankDetailId)
}
`;

