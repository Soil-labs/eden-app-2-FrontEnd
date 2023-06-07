import { gql, useMutation } from "@apollo/client";
import { Mutation } from "@eden/package-graphql/generated";
import React, { useState } from "react";

const ADD_QUESTIONS_TO_POSITION = gql`
  mutation ($fields: addQuestionsToAskPositionInput) {
    addQuestionsToAskPosition(fields: $fields) {
      _id
      name
      candidates {
        overallScore
        user {
          _id
          discordName
          discordAvatar
        }
      }
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

type Question = {
  _id: number;
  content: string;
  bestAnswer: string;
};

type Questions = Question[];

type Props = {
  questions: Questions;
  positionID?: string | string[] | undefined;
  // eslint-disable-next-line no-unused-vars
  setQuestions: (questions: Questions) => void;
  // eslint-disable-next-line no-unused-vars
  setTrainModalOpen: (open: boolean) => void;
};

const TrainQuestionsEdenAI = ({
  questions = [],
  positionID,
  setQuestions,
  setTrainModalOpen,
}: Props) => {
  const [updateQuestionsPosition] = useMutation(ADD_QUESTIONS_TO_POSITION, {
    onCompleted({ updateNodesToMember }: Mutation) {
      console.log("updateNodesToMember = ", updateNodesToMember);
    },
    // skip: positionID == "" || positionID == null,
  });

  console.log("questions = ", questions);

  const [newQuestion, setNewQuestion] = useState("");

  const handleQuestionAdd = () => {
    if (newQuestion.trim() !== "") {
      // const newId = questions.length + 1;

      console.log("newQuestion = ", newQuestion);

      setQuestions([
        ...questions,
        { _id: -1, content: newQuestion, bestAnswer: "" },
      ]);
      setNewQuestion("");
    }
  };

  const handleSaveChanges = () => {
    updateQuestionsPosition({
      variables: {
        fields: {
          positionID: positionID,
          questionsToAsk: questions.map((question) => {
            if (question._id === -1) {
              return {
                questionContent: question.content,
                bestAnswer: question.bestAnswer,
              };
            } else {
              return {
                questionID: question._id,
                bestAnswer: question.bestAnswer,
                questionContent: question.content,
              };
            }
          }),
        },
      },
    });
    setTrainModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Train Questions for Eden AI</h1>
      <ul className="space-y-2">
        {questions.map((question) => (
          <li key={question._id}>
            <p className="font-medium">{question.content}</p>
            <input
              type="text"
              className="rounded border px-2 py-1"
              placeholder="Enter the answer"
              value={question.bestAnswer}
              onChange={(e) => {
                const newQuestions = [...questions];
                const index = newQuestions.findIndex(
                  (q) => q._id === question._id
                );

                newQuestions[index].bestAnswer = e.target.value;
                setQuestions(newQuestions);
              }}
            />
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <input
          type="text"
          className="mr-2 rounded border px-2 py-1"
          placeholder="Enter a new question"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button
          className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
          onClick={handleQuestionAdd}
        >
          Add Question
        </button>
      </div>
      <button
        className="absolute bottom-0 right-0 mb-6 mr-6 mt-4 rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
        onClick={handleSaveChanges}
      >
        Save Changes
      </button>
    </div>
  );
};

export default TrainQuestionsEdenAI;
