import { gql } from "@apollo/client";

export const INTERVIEW_EDEN_AI = gql`
  query ($fields: interviewEdenAIInput!) {
    interviewEdenAI(fields: $fields) {
      reply
      date
      conversationID
      questionAskingNow
      unansweredQuestionsArr {
        questionContent
        questionID
      }
      timesAsked
    }
  }
`;

export const MESSAGE_MAP_KG_V4 = gql`
  query ($fields: messageMapKG_V4Input!) {
    messageMapKG_V4(fields: $fields) {
      keywords {
        keyword
        confidence
        nodeID
        node {
          _id
          name
          node
          categoryNodes {
            name
          }
          groupNodes {
            name
          }
        }
      }
    }
  }
`;

export const ASK_EDEN_USER_POSITION = gql`
  query AskEdenUserPosition($fields: askEdenUserPositionInput) {
    askEdenUserPosition(fields: $fields) {
      reply
    }
  }
`;

export const ASK_EDEN_USER_POSITION_AFTER_INTERVIEW = gql`
  query AskEdenUserPosition($fields: askEdenUserPositionInput) {
    askEdenUserPosition(fields: $fields) {
      reply
    }
  }
`;

export const ASK_EDEN_GPT4_ONLY = gql`
  query InterviewEdenGPT4only($fields: interviewEdenGPT4onlyInput) {
    interviewEdenGPT4only(fields: $fields) {
      reply
      date
      conversationID
    }
  }
`;

export const ASK_EDEN_USER_POSITION_GPT_FUNC_V2 = gql`
  query AskEdenUserPositionGPTFunc_V2(
    $fields: askEdenUserPositionGPTFunc_V2Input
  ) {
    askEdenUserPositionGPTFunc_V2(fields: $fields) {
      reply
    }
  }
`;

export const SEARCH_EDEN_V1 = gql`
  query SearchEden_V1($fields: searchEden_V1Input) {
    searchEden_V1(fields: $fields) {
      reply
    }
  }
`;
