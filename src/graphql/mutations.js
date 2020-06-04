import { gql } from "apollo-boost";

export const CREATE_USER = gql`
  mutation createUser(
    $userId: String!
    $name: String!
    $username: String!
    $email: String!
    $bio: String!
    $website: String!
    $profileImage: String!
    $phoneNumber: String!
  ) {
    insert_users(
      objects: {
        bio: $bio
        email: $email
        name: $name
        phone_number: $phoneNumber
        profile_image: $profileImage
        username: $username
        user_id: $userId
        website: $website
      }
    ) {
      affected_rows
    }
  }
`;