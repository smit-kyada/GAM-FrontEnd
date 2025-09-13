import gql from 'graphql-tag'

export const CREATE_SITETABLE = gql`
mutation Mutation($input: InSiteTable) {
  createSiteTable(input: $input) {
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

export const UPDATE_SITETABLE = gql`
mutation Mutation($input: InUpSiteTable) {
  updateSiteTable(input: $input) {
    pageViews
  }
}
`;

export const DELETE_SITETABLE = gql`
mutation DeleteSiteTable($deleteSiteTableId: ID) {
  deleteSiteTable(id: $deleteSiteTableId)
}
`;

export const IMPORT_SITETABLE = gql`
mutation Mutation($input: JSON!) {
  importSiteTable(input: $input)
}
`;
