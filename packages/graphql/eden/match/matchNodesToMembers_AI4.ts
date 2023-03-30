import { gql } from "@apollo/client";

export const MATCH_NODES_MEMBERS_AI4 = gql`
  query ($fields: matchNodesToMembers_AI4Input) {
    matchNodesToMembers_AI4(fields: $fields) {
      member {
        _id
        discordName
        discordAvatar
        discriminator
        bio
        serverID
        timeZone
        hoursPerWeek
        location
        totalIncome
        completedOpportunities
        # endorsements {
        #   endorser {
        #     _id
        #     discordAvatar
        #     discordName
        #     discriminator
        #   }
        # }
        endorsementsReceive {
          _id
          userSend {
            discordName
            discordAvatar
          }
          stars
          stake
          endorsementMessage
        }
        endorseSummary {
          summary
          mainNodes {
            node {
              _id
              name
            }
            confidence
          }
          averageStars
          averageStake
          totalStake
          numberEndorsement
          endorsers {
            discordName
          }
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
        links {
          name
          url
        }
      }
      matchPercentage {
        totalPercentage
      }
      nodesPercentage {
        node {
          _id
          name
        }
        totalPercentage
        conn_nodeIDs
      }
    }
  }
`;
