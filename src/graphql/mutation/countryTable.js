import gql from 'graphql-tag'

export const CREATE_COUNTRYTABLE = gql`
mutation Mutation($input: InCountryTable) {
  createCountryTable(input: $input) {
    id
    site
    date
    estimatedEarning
    pageViews
    pageRpm
    impressions
    impressionsRpm
    activeViewViewable
    clicks
  }
}
`;

export const UPDATE_COUNTRYTABLE = gql`
mutation Mutation($input: InUpCountryTable) {
  updateCountryTable(input: $input) {
    pageViews
  }
}
`;

export const DELETE_COUNTRYTABLE = gql`
mutation DeleteCountryTable($deleteCountryTableId: ID) {
  deleteCountryTable(id: $deleteCountryTableId)
}
`;

export const IMPORT_COUNTRYTABLE = gql`
mutation Mutation($input: JSON!) {
  importCountryTable(input: $input)
}
`;
