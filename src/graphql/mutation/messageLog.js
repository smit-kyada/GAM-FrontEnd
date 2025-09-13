import gql from 'graphql-tag'

export const CREATE_MESSAGELOG=gql`
mutation Mutation($input: InMessageLog) {
  createMessageLog(input: $input) {
    click
  }
}
`;

export const UPDATE_MESSAGELOG=gql`
mutation Mutation($input: UpMessageLog) {
  updateMessageLog(input: $input) {
    click
  }
}
`;

export const DELETE_MESSAGELOG=gql`
mutation DeleteMessageLog($deleteMessageLogId: ID) {
  deleteMessageLog(id: $deleteMessageLogId)
}
`;