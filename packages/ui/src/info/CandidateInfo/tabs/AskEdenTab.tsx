import { gql, useQuery } from "@apollo/client";
import { Members } from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  ChatMessage,
  InterviewEdenAI,
} from "@eden/package-ui";
import { getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { FC, useState } from "react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = getCookieFromContext(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

// ------- Interview Chat --------

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

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

// interface InterviewEdenAIContainerProps {
//   handleEnd?: () => void;
// }
interface Props {
  member?: Members;
  candidate: any;
}

// type Category = {
//   categoryName: string;
//   reason: string[];
// };

// type AskEdenTabType = Category[];

// eslint-disable-next-line no-unused-vars
export const AskEdenTab: FC<Props> = ({ member, candidate }) => {
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // --------- Position and User ------------
  // const { currentUser } = useContext(UserContext);

  // console.log("currentUser = ", currentUser?._id);

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

  const [conversationID, setConversationID] = useState<String>("");

  // console.log("positionID = ", positionID);

  const [experienceTypeID] = useState<string>("");

  // eslint-disable-next-line no-unused-vars
  const [chatN, setChatN] = useState<ChatMessage>([]);

  // console.log("chatN = ", chatN);

  console.log("conversationID = ", conversationID);

  return (
    <div className="w-full">
      <div className="relative mt-3 h-[calc(100vh-17rem)]">
        <div className="absolute left-0 top-2 z-20 w-full">
          {/* <ProgressBarGeneric
            color="accentColor"
            progress={
              (100 *
                (findPositionData?.findPosition?.questionsToAsk.length -
                  questions.length)) /
              findPositionData?.findPosition?.questionsToAsk.length
            }
          /> */}
        </div>
        <div className="mx-auto h-full max-w-lg flex-col xl:w-2/4 xl:items-stretch 2xl:pb-0">
          <InterviewEdenAI
            key={experienceTypeID}
            aiReplyService={AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION}
            experienceTypeID={experienceTypeID}
            handleChangeChat={(_chat: any) => {
              setChatN(_chat);
            }}
            sentMessageToEdenAIobj={sentMessageToEdenAIobj}
            setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            placeholder={
              <p className="bg-cottonPink text-edenGreen-600 rounded-lg p-1 text-center font-medium">
                Ask me any question about the Candidate
              </p>
            }
            questions={questions}
            setQuestions={setQuestions}
            userID={member?._id}
            positionID={positionID}
            conversationID={conversationID}
            setConversationID={setConversationID}
            // handleEnd={() => {
            //   if (handleEnd) handleEnd();
            // }}
          />
        </div>
      </div>
    </div>
  );
};
