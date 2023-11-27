"use client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { FIND_CONVERSATIONS } from "@eden/package-graphql";
import { ConversationType } from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES_2,
  ChatMessage,
  Loading,
  SearchEdenAI,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

interface SearchEdenContainerProps {
  handleEnd?: () => void;
}

const FIND_POSITION = gql`
  query ($fields: findPositionInput) {
    findPosition(fields: $fields) {
      _id
      name
      company {
        name
        type
      }
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
        }
      }
      positionsRequirements {
        roleDescription
        benefits
      }
      generalDetails {
        yearlySalary {
          min
          max
        }
      }
    }
  }
`;

const ADD_CANDIDATE_TO_POSITION = gql`
  mutation ($fields: addCandidatesPositionInput) {
    addCandidatesPosition(fields: $fields) {
      _id
      name
      candidates {
        user {
          _id
          discordName
          discordAvatar
        }
        overallScore
      }
    }
  }
`;

const SearchEdenContainer = ({ handleEnd }: SearchEdenContainerProps) => {
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // --------- Position and User ------------
  const { currentUser } = useContext(UserContext);

  console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { positionID } = router.query;
  // --------- Position and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  // eslint-disable-next-line no-unused-vars
  const { data: findPositionData } = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: positionID == "" || positionID == null,
    onCompleted: (data) => {
      let questionsChange = data.findPosition.questionsToAsk.map(
        (question: any) => {
          return {
            _id: question?.question?._id,
            content: question?.question?.content,
            bestAnswer: question?.bestAnswer,
          };
        }
      );

      questionsChange = questionsChange.filter((question: any) => {
        return question._id != null;
      });

      setQuestions(questionsChange);
    },
  });

  const [addCandidateToPosition] = useMutation(ADD_CANDIDATE_TO_POSITION, {
    onCompleted: (data) => {
      console.log("data = ", data);
      setAddCandidateFlag(true);
    },
  });

  const [addCandidateFlag, setAddCandidateFlag] = useState<boolean>(false);

  const [conversationID, setConversationID] = useState<String>(
    "656248629d414e89c8dbbe33"
  );
  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("CHAT N", chatN);

  // SOS 🆘 -> the candidate is not been added to the position // return back before publish code
  useEffect(() => {
    if (
      addCandidateFlag == false &&
      currentUser?._id != undefined &&
      positionID != undefined &&
      conversationID != ""
    ) {
      console.log("change conversationID= ", conversationID);
      addCandidateToPosition({
        variables: {
          fields: {
            positionID: positionID,
            candidates: [
              {
                userID: currentUser?._id,
                conversationID: conversationID,
              },
            ],
          },
        },
      });
    }
  }, [positionID, currentUser?._id, conversationID]);

  const [experienceTypeID] = useState<string>("");

  // console.log("chatN = ", chatN);

  // console.log("conversationID = ", conversationID);

  const { loading: findConversationsLoading } = useQuery(FIND_CONVERSATIONS, {
    variables: {
      fields: {
        // _id: [conversationID],
        // _id: "653a4a744f6649e825a91b14",
        _id: conversationID,
        // positionID: positionID,
        // userID: [currentUser?._id],
      },
    },
    onCompleted: (_data) => {
      setChatN(
        _data.findConversations[
          _data.findConversations.length - 1
        ].conversation.map((_mess: ConversationType) => ({
          user: _mess.role === "assistant" ? "01" : "02",
          message: _mess.content,
          date: _mess.date,
        })) //.slice(0, -1)
      );
    },
    ssr: false,
  });

  return (
    <div className="h-full w-full">
      <div className="relative h-full">
        {/* <div className="absolute left-0 top-2 z-20 w-full">
            <ProgressBarGeneric
              color="accentColor"
              progress={
                (100 *
                  (findPositionData?.findPosition?.questionsToAsk.length -
                    questions.length)) /
                findPositionData?.findPosition?.questionsToAsk.length
              }
            />
          </div> */}
        {!findConversationsLoading && (
          <SearchEdenAI
            key={experienceTypeID}
            // aiReplyService={AI_INTERVIEW_SERVICES_2.INTERVIEW_EDEN_AI}
            aiReplyService={AI_INTERVIEW_SERVICES_2.SEARCH_EDEN_V1}
            experienceTypeID={experienceTypeID}
            // eslint-disable-next-line no-unused-vars
            handleChangeChat={(_chat: any) => {
              // setChatN(_chat);
            }}
            changeChatN={chatN}
            sentMessageToEdenAIobj={sentMessageToEdenAIobj}
            setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            placeholder={
              <div className="pt-4">
                <Loading title="Loading Eden AI" />
              </div>
            }
            questions={questions}
            setQuestions={setQuestions}
            userID={"108867786318229498302"}
            positionID={positionID}
            positionTrainEdenAI={false}
            conversationID={conversationID}
            setConversationID={setConversationID}
            handleEnd={() => {
              if (handleEnd) handleEnd();
            }}
            headerText={`Interview with Eden AI`}
          />
        )}
      </div>
      {/* <CountdownTimer /> */}
      {/* <div className="absolute right-0 top-32 pr-6">
          <span>
            progress{" "}
            {(100 *
              (findPositionData?.findPosition?.questionsToAsk.length -
                questions.length)) /
              findPositionData?.findPosition?.questionsToAsk.length}
          </span>
        </div> */}
    </div>
  );
};

export default SearchEdenContainer;
