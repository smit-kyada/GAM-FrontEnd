import gql from 'graphql-tag'

export const GET_ALL_AFFREQUEST =gql`
query Query($limit: Number, $page: Number, $isSearch: Boolean, $filter: String, $search: String) {
  getAllAffRequests(limit: $limit, page: $page, isSearch: $isSearch, filter: $filter, search: $search) {
    count
    data {
      id
      name
      email
      mobile
      message
    }
  }
}
`;