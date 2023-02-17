import { gql } from "@apollo/client";

export const FIND_MEMBER = gql`
  query ($fields: findMemberInput) {
    findMember(fields: $fields) {
      _id
      discordAvatar
      discordName
      bio
      archiveProjects
      discriminator
      hoursPerWeek
      interest
      timeZone
      projects {
        champion
        favorite
        info {
          _id
          description
          title
        }
      }
      links {
        name
        url
      }
      memberRole {
        _id
        title
      }
      nodes {
        nodeData {
          aboveNodes {
            _id
            name
            node
          }
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
        endorser {
          _id
          discordName
          discordAvatar
          discriminator
        }
        endorsementMessage
        arweaveTransactionID
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
