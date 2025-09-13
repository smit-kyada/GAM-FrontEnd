import gql from 'graphql-tag'

export const DELETE_GAMEUSER =gql`
mutation Mutation($deleteGameUserId: ID) {
  deleteGameUser(id: $deleteGameUserId)
}
`;