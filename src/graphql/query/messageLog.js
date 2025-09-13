import gql from 'graphql-tag'

export const GET_ALL_MESSAGELOG=gql`
query Query($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String) {
  getAllMessageLogs(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      
      click
      site
      messageId {
        id
        title
        description
        image
        icon
        url
      }
    }
  }
}
`;

export const GET_MESSAGELOG=gql`
query GetMessageLog($getMessageLogId: ID) {
  getMessageLog(id: $getMessageLogId) {
    id
    messageId {
      id
      title
      description
      image
      icon
      url
    }
    click
    site
  }
}
`;