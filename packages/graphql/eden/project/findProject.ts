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
      }
      team {
        memberInfo {
          _id
          discordName
          discordAvatar
          attributes {
            Motivator
            Coordinator
            Director
            Helper
            Inspirer
            Observer
            Reformer
            Supporter
          }
          links {
            name
            url
          }
          skills {
            skillInfo {
              _id
              name
            }
          }
        }
        phase
        roleID
      }
      role {
        _id
        title
        description
        nodes {
          nodeData {
            _id
            name
            node
          }
        }
        archive
        keyRosponsibilities
        openPositions
        dateRangeStart
        dateRangeEnd
        hoursPerWeek
        budget {
          totalBudget
          token
          perHour
          perMonth
        }
        skills {
          skillData {
            _id
            name
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
      tweets {
        _id
        content
        registeredAt
        approved
        title
        author {
          _id
          discordName
          discordAvatar
        }
      }
    }
  }
`;
