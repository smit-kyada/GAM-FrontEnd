import gql from 'graphql-tag'

export const GET_ALL_REPORT_LOGS = gql`
query GetAllApplog($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String) {
  getAllApplog(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      title
      logFor
      createdAt
      userId {
        id
        userName
        email
        contact
        role
        showTotalGameUser
      }
    }
  }
}
`;

export const GET_LAST_REPORT_LOGS = gql`
query GetLastApplog($getLastApplogId: ID) {
  getLastApplog(id: $getLastApplogId) {
    id
    title
    logFor
    createdAt
  }
}
`;
