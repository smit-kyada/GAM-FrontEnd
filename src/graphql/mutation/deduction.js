import gql from 'graphql-tag'

export const CREATE_DEDUCTION = gql`
mutation CreateDeduction($input: InDeductions) {
  createDeduction(input: $input) {
    id
    site_link
    deduction
  }
}
`;

export const UPDATE_DEDUCTION = gql`
mutation UpdateDeduction($input: InUpDeductions) {
  updateDeduction(input: $input) {
    id
    site_link
    deduction
  }
}
`;

export const DELETE_DEDUCTION = gql`
mutation DeleteDeduction($deleteDeductionId: ID) {
  deleteDeduction(id: $deleteDeductionId)
}
`;

export const IMPORT_DEDUCTION = gql`
mutation ImportDeduction($input: JSON!) {
  importDeduction(input: $input)
}
`;
