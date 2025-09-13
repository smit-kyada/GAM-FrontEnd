import gql from 'graphql-tag'

export const GET_ALL_GAMEUSER = gql`
query GetAllGameUsers($page: Number, $limit: Number, $isSearch: Boolean, $filter: String, $search: String, $endTime: String) {
  getAllGameUsers(page: $page, limit: $limit, isSearch: $isSearch, filter: $filter, search: $search, endTime: $endTime) {
    count
    data {
      id
      userId
      socketId
      startTime
      endTime
      uUrl
      country_code
      online
      fcmValue {
        endpoint
        expirationTime
        keys {
          p256dh
          auth
        }
      }
    }
  }
}
`;

export const GET_GAMEUSER = gql`
query GetGameUser($getGameUserId: ID) {
  getGameUser(id: $getGameUserId) {
    count
    data {
      id
      socketId
      startTime
      uUrl
      userId
      endTime
      country_code
      online
    }
  }
}
`;

export const GET_HOMESUBSCRIBER =gql`
query GetAllSubscribers($page: Number, $limit: Number) {
  getAllSubscribers(page: $page, limit: $limit) {
    count
    totalSubscribers
  }
}
`;
