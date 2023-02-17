import { gql } from "@apollo/client";

export const FIND_PROJECT = gql`
  query ($fields: findProjectInput) {
    findProject(fields: $fields) {
      _id
      title
      description
      descriptionOneLine
      emoji
      serverID
      backColorEmoji
      collaborationLinks {
        link
        title
      }
      champion {
        _id
        discordName
        discordAvatar
        discriminator
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
      }
      team {
        memberInfo {
          _id
          discordName
          discordAvatar
          discriminator
          bio
          memberRole {
            _id
            title
          }
          links {
            name
            url
          }
          nodes {
            nodeData {
              _id
              name
              node
              subNodes {
                _id
                name
                node
              }
            }
          }
          endorsements {
            endorser {
              _id
              discordAvatar
              discordName
            }
          }
          serverID
        }
        phase
        roleID
      }
      role {
        _id
        title
        shortDescription
        description
        ratePerHour
        hoursPerWeek
        dateRangeStart
        dateRangeEnd
        openPositions
        expectations
        benefits
        keyResponsibilities
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
      }
      dates {
        complition
        kickOff
      }
      budget {
        token
        totalBudget
      }
    }
  }
`;
