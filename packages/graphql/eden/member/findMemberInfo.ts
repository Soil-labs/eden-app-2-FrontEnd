import { gql } from "@apollo/client";

export const FIND_MEMBER_INFO = gql`
  query ($fields: findMemberInput) {
    findMember(fields: $fields) {
      _id
      discordName
      discordAvatar
      discriminator
      memberRole {
        _id
        title
        description
      }
      bio
      links {
        name
        url
      }
      nodes {
        nodeData {
          _id
          name
          node
        }
      }
      previousProjects {
        title
        description
        startDate
        endDate
      }
      endorsements {
        arweaveTransactionID
        endorsementMessage
        endorser {
          _id
          discordAvatar
          discordName
          discriminator
        }
      }
      preferences {
        findCoFounder {
          interestedMatch
        }
        findMentee {
          interestedMatch
        }
        findMentor {
          interestedMatch
        }
        findProject {
          interestedMatch
        }
        findUser {
          interestedMatch
        }
      }
    }
  }
`;
