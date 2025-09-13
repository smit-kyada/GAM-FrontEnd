import gql from 'graphql-tag'

export const GET_BANKDETAIL =gql`
query Query($getBankDetailId: ID) {
  getBankDetail(id: $getBankDetailId) {
    count
    data {
      accNumber
      bankName
      id
      ifscCode
      swiftCode
    }
  }
}
`;

export const IS_USER_BANK_ACCOUNT =gql`
query Query($isUserBankAccId: ID) {
  IsUserBankAcc(id: $isUserBankAccId)
}
`;
