import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  AI_INTERVIEW_SERVICES,
  Button,
  ChatMessage,
  InterviewEdenAI,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";

export const CV_TO_MEMORY = gql`
  mutation ($fields: storeLongTermMemorySummaryInput) {
    storeLongTermMemorySummary(fields: $fields) {
      success
      message
    }
  }
`;

const FIND_COMPANY = gql`
  query ($fields: findCompanyInput) {
    findCompany(fields: $fields) {
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

const ADD_CANDIDATE_TO_COMPANY = gql`
  mutation ($fields: addCandidatesCompanyInput) {
    addCandidatesCompany(fields: $fields) {
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

  // --------- Company and User ------------
  const { currentUser } = useContext(UserContext);

  console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { companyID } = router.query;
  // --------- Company and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  const {} = useQuery(FIND_COMPANY, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: companyID == "" || companyID == null,
    onCompleted: (data) => {
      setQuestions(
        data.findCompany.questionsToAsk.map((question: any) => {
          return {
            _id: question.question._id,
            content: question.question.content,
            bestAnswer: question.bestAnswer,
          };
        })
      );
    },
  });

  const [addCandidateToCompany] = useMutation(ADD_CANDIDATE_TO_COMPANY, {
    onCompleted: (data) => {
      console.log("data = ", data);
      setAddCandidateFlag(true);
    },
  });

  const [addCandidateFlag, setAddCandidateFlag] = useState<boolean>(false);

  useEffect(() => {
    console.log("addCandidateFlag = ", addCandidateFlag);
    console.log("companyID = ", companyID);
    console.log("currentUser?._id  = ", currentUser?._id);
    if (
      addCandidateFlag == false &&
      currentUser?._id != undefined &&
      companyID != undefined
    ) {
      addCandidateToCompany({
        variables: {
          fields: {
            companyID: companyID,
            candidates: [
              {
                userID: currentUser?._id,
              },
            ],
          },
        },
      });
    }
  }, [companyID, currentUser?._id]);

  console.log("companyID = ", companyID);

  const [experienceTypeID] = useState<string>("");

  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  const [CVtoMemory] = useMutation(CV_TO_MEMORY, {
    onCompleted({ CVtoMemory }) {
      console.log("CVtoMemory.success==== ", CVtoMemory);
      setIsLoading(false);
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64File = ((reader.result as string) || "").split(",")[1];
      const response = await fetch("../api/process-pdf/process-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileBuffer: base64File }),
      });

      if (response.ok) {
        const { text } = await response.json();

        CVtoMemory({
          variables: { fields: { message: text, userID: currentUser?._id } },
        });

        // CVtoJobs({ variables: { fields: { cvString: text } } });

        // CVtoNodes({ variables: { fields: { message: text } } });

        console.log(text);
      } else {
        const { error } = await response.json();

        console.log("error aaa", error);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-full w-1/2 flex-col space-y-4 p-4">
        <h1 className="mb-4 text-3xl font-bold">
          Help Eden with some questions to know you better
        </h1>
      </div>
      <div className="flex h-screen flex-col items-center justify-center text-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center space-y-2"
        >
          <label>Resume(CV)</label>
          <label htmlFor="input" className="text-center text-sm">
            Upload Recent Resume Here
          </label>
          <input
            className="ml-60"
            onChange={handleFileChange}
            type="file"
            accept=".pdf"
          ></input>

          <Button loading={isLoading} type="submit" variant="primary">
            {isLoading ? "Uploading Resume..." : "Upload Resume"}
          </Button>
        </form>
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
