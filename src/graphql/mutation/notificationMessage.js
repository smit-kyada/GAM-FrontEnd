import gql from 'graphql-tag';

export const CREATE_NOTIFICATIONMESSAGE =gql`
mutation Mutation($input: InNotificationMessage) {
  createNotificationMessage(input: $input) {
    id
  }
}
`;

export const UPDATE_NOTIFICATIONMESSAGE =gql`
mutation UpdateNotificationMessage($input: UpNotificationMessage) {
  updateNotificationMessage(input: $input) {
    id
  }
}
`;

export const DELETE_NOTIFICATIONMESSAGE =gql`
mutation DeleteNotificationMessage($deleteNotificationMessageId: ID) {
  deleteNotificationMessage(id: $deleteNotificationMessageId)
}
`;