import { gql } from "@apollo/client";

export const FIND_MEMBERS = gql`
  query ($fields: findMembersInput) {
    findMembers(fields: $fields) {
      _id
      discordAvatar
      discordName
      discriminator
      bio
      links {
        name
        url
      }
      previousProjects {
        title
        description
        startDate
        endDate
      }
      memberRole {
        _id
        title
      }
      nodes {
        nodeData {
          _id
          name
          node
        }
      }
    }
  }
`;
