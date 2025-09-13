import gql from 'graphql-tag'

export const GET_ALL_NOTIFICATIONMESSAGE =gql`
query Query($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String) {
  getAllNotificationMessages(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      title
      color
      isActive
    }
  }
}
`;


export const GET_NOTIFICATIONMESSAGE =gql`
query GetNotificationMessage($getNotificationMessageId: ID) {
  getNotificationMessage(id: $getNotificationMessageId) {
    id
    title
    color
    isActive
  }
}
`;