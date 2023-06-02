import { gql, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  AI_INTERVIEW_SERVICES,
  ChatMessage,
  InterviewEdenAI,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

const FIND_POSITION = gql`
  query ($fields: findPositionInput) {
    findPosition(fields: $fields) {
      _id
      name
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
        }
      }
    }
  }
`;

// const ADD_CANDIDATE_TO_POSITION = gql`
//   query ($fields: addCandidatesPositionInput) {
//     addCandidatesPosition(fields: $fields) {
//       _id
//       name
//       candidates {
//         user {
//           _id
//           discordName
//           discordAvatar
//         }
//         overallScore
//       }
//     }
//   }
// `;

// interface cardsDataType {
//   title: string;
//   trust: number;
//   time: number;
//   completed: boolean;
//   firstMessage: string;
//   experienceTypeID: string;
// }

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

const InterviewEdenAIpage: React.FC = () => {
  interface MessageObject {
    message: string;
    sentMessage: boolean;
    user?: string;
  }
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // --------- Position and User ------------
  const { currentUser } = useContext(UserContext);

  console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { positionID } = router.query;
  // --------- Position and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  const {} = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: positionID == "" || positionID == null,
    onCompleted: (data) => {
      setQuestions(
        data.findPosition.questionsToAsk.map((question: any) => {
          return {
            _id: question.question._id,
            content: question.question.content,
            bestAnswer: question.bestAnswer,
          };
        })
      );
    },
  });

  // const {} = useMutation(ADD_CANDIDATE_TO_POSITION, {
  //   variables: {
  //     fields: {
  //       _id: positionID,
  //       candidates: [
  //         {
  //           userID: "908392557258604544",
  //         },
  //       ],
  //     },
  //   },
  //   skip: positionID == "" || positionID == null || currentUser?._id != "",
  //   onCompleted: (data) => {
  //     console.log("data = ", data);
  //   },
  // });

  console.log("positionID = ", positionID);

  const [experienceTypeID] = useState<string>("");

  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-full w-1/2 flex-col space-y-4 p-4">
        <h1 className="mb-4 text-3xl font-bold">
          Help Eden with some questions to know you better
        </h1>
      </div>
      <div className="flex h-screen flex-col items-center justify-center text-lg">
        <div className="h-[60vh]">
          {
            <InterviewEdenAI
              key={experienceTypeID}
              aiReplyService={AI_INTERVIEW_SERVICES.INTERVIEW_EDEN_AI}
              experienceTypeID={experienceTypeID}
              //   extraNodes={extraNodes}
              //   handleChangeNodes={(_nodeObj: any) => {
              //     // console.log("handleChangeNodes:", nodeObj);
              //     setNodeObj(_nodeObj);
              //   }}
              handleChangeChat={(_chat: any) => {
                // console.log("handleChangeChat:", _chat);
                setChatN(_chat);
              }}
              //   setShowPopupSalary={setShowPopup}
              //   setMode={setMode}
              sentMessageToEdenAIobj={sentMessageToEdenAIobj}
              setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
              placeholder={""}
              questions={questions}
              setQuestions={setQuestions}
              userID={currentUser?._id}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default InterviewEdenAIpage;
