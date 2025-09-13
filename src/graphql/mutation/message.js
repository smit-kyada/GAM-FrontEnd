import gql from 'graphql-tag'

export const CREATE_MESSAGE =gql`
mutation Mutation($input: InMessage) {
  createMessage(input: $input) {
    id
    title
    description
    image
    icon
    url
  }
}
`;

export const UPDATE_MESSAGE =gql`
mutation UpdateMessage($input: UpMessage) {
  updateMessage(input: $input) {
    id
    title
    description
    image
    icon
    url
  }
}
`;

export const DELETE_MESSAGE=gql`
mutation DeleteMessage($deleteMessageId: ID) {
  deleteMessage(id: $deleteMessageId)
}
`;