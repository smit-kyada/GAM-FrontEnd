import gql from 'graphql-tag'

export const GET_ALL_MESSAGES =gql`
query GetAllMessages($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String) {
  getAllMessages(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      title
      description
      image
      icon
      url
    }
  }
}
`;