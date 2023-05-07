import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  AI_INTERVIEW_SERVICES,
  ChatMessage,
  InterviewEdenAI,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

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

const InterviewEdenAIpage: React.FC = () => {
  // --------- Company and User ------------
  const { currentUser } = useContext(UserContext);

  const router = useRouter();
  const { companyID } = router.query;
  // --------- Company and User ------------

  useEffect(() => {
    console.log("companyID,currentUser?._id = ", companyID, currentUser?._id);
  }, [companyID, currentUser?._id]);

  const [questions, setQuestions] = useState<any[]>([]);

  const {} = useQuery(FIND_COMPANY, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: companyID == "" || companyID == null,
    onCompleted: (data) => {
      console.log("data.findCompany = ", data.findCompany.questionsToAsk);

      let questionsChange = data.findCompany.questionsToAsk.map(
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

      console.log("questionsChange = ", questionsChange);

      setQuestions(questionsChange);
      // setQuestions(
      //   data.findCompany.questionsToAsk.map((question: any) => {
      //     return {
      //       _id: question.question._id,
      //       content: question.question.content,
      //       bestAnswer: question.bestAnswer,
      //     };
      //   })
      // );
    },
  });

  useEffect(() => {
    console.log("questions = ", questions);
  }, [questions]);

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-full w-1/2 flex-col space-y-4 p-4">
        <h1 className="mb-4 text-3xl font-bold">
          Help Eden with some questions to know you better
        </h1>
      </div>
    </div>
  );
};

export default InterviewEdenAIpage;
