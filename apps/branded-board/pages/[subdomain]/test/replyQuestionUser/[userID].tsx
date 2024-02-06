/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import React, { useState } from "react";

import type { NextPageWithLayout } from "../../../_app";

export const QUERY_RESPONSE_UPDATED = gql`
  subscription ($fields: queryResponseUpdatedInput) {
    queryResponseUpdated(fields: $fields) {
      _id
      sender {
        positionID
        userID
      }
      responder {
        positionID
        userID
      }
      phase
      question {
        content
      }
      answer {
        content
      }
    }
  }
`;

export const UPDATE_QUERY_RESPONSE = gql`
  mutation ($fields: updateQueryResponseInput) {
    updateQueryResponse(fields: $fields) {
      _id
      sender {
        positionID
        userID
      }
      responder {
        positionID
        userID
      }
      phase
      question {
        content
      }
      answer {
        content
      }
    }
  }
`;

export const FIND_QUERY_RESPONSES = gql`
  query ($fields: findQueryResponsesInput) {
    findQueryResponses(fields: $fields) {
      _id
      sender {
        positionID
        userID
      }
      responder {
        positionID
        userID
      }
      phase
      question {
        content
      }
      answer {
        content
      }
    }
  }
`;

type Question = {
  _id: string;
  question: {
    content: string;
  };
  answer: {
    content: string;
  };
};

const askQuestionPosition: NextPageWithLayout = () => {
  const router = useRouter();
  const { userID } = router.query;

  // ------------------ Question and asnwers ------------------
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [answerContent, setAnswerContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupID, setPopupID] = useState<string | null>(null);
  const [popupObject, setPopupObject] = useState<Question>({
    _id: "",
    question: {
      content: "",
    },
    answer: {
      content: "",
    },
  });

  const [questions, setQuestions] = useState<Question[]>([]);

  const handleAnswerButtonClick = (questionId: string) => {
    // setSelectedQuestionId(questionId);
    setPopupID(questionId);
    setShowPopup(true);

    const question = questions.find((question) => question._id === questionId);

    if (question) {
      setPopupObject(question);
    }
  };

  const handlePopupSubmit = () => {
    // Save the answer
    setShowPopup(false);

    const updatedQuestions = questions.filter(
      (question) => question._id !== selectedQuestionId
    );

    setAnswerContent("");
    setSelectedQuestionId(null);

    // Update the questions array
    setQuestions(updatedQuestions);

    setSelectedQuestionId(popupID);

    console.log("popupObject = ", popupObject);

    if (popupObject._id) {
      updateQueryResponse({
        variables: {
          fields: {
            _id: popupObject._id,
            phase: "RESPONDED",
            answer: answerContent,
          },
        },
      });
    }
  };

  // ------------------ Question and asnwers ------------------

  const [updateQueryResponse, {}] = useMutation(UPDATE_QUERY_RESPONSE, {
    onCompleted({ data }) {
      console.log("data = ", data);
    },
  });

  const {} = useQuery(FIND_QUERY_RESPONSES, {
    variables: {
      fields: {
        responderID: userID,
        responderType: "USER",
        phase: "QUERY",
      },
    },
    onCompleted: (data) => {
      setQuestions(data.findQueryResponses);
    },
  });

  useSubscription(QUERY_RESPONSE_UPDATED, {
    variables: {
      fields: {
        responderID: userID,
        responderType: "USER",
        phase: "QUERY",
      },
    },
    // skip: !partyId,
    onData: ({ data }) => {
      // const queryResponseUpdated = data?.data?.queryResponseUpdated;

      console.log(
        "data.queryResponseUpdated = ",
        data.data.queryResponseUpdated
      );

      // add this new questions to the setQuestions
      // Check if the _id already exist and just update the answer

      const questionIndex = questions.findIndex(
        (question) =>
          question._id.toString() ==
          data.data.queryResponseUpdated._id.toString()
      );

      if (questionIndex !== -1) {
        // update the answer
        const updatedQuestions = [...questions];
        // updatedQuestions[questionIndex].question.content = data.data.queryResponseUpdated.content;

        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          question: {
            content: data.data.queryResponseUpdated.content,
          },
        };
        setQuestions(updatedQuestions);
      } else {
        // add the question
        setQuestions([...questions, data.data.queryResponseUpdated]);
      }
    },
  });

  console.log("questions = ", questions);

  return (
    <>
      <h1>Questions to Answer</h1>
      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-lg space-y-4 p-4">
          {questions.map((question) => (
            <div
              key={question._id}
              className={`${
                selectedQuestionId === question._id ? "hidden" : ""
              } rounded-lg bg-white p-4 shadow`}
            >
              <p className="mb-2 text-lg font-semibold">
                {question.question.content}
              </p>
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white"
                onClick={() => handleAnswerButtonClick(question._id)}
              >
                Answer
              </button>
            </div>
          ))}
        </div>
        {/* Popup */}
        {showPopup && (
          <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
            <div className="mx-auto max-w-md rounded-lg bg-white p-4 shadow">
              <textarea
                className="mb-2 h-32 w-full resize-none border border-gray-300 p-2"
                placeholder="Enter your answer..."
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
              ></textarea>
              <button
                className="rounded bg-blue-500 px-4 py-2 text-white"
                onClick={handlePopupSubmit}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default askQuestionPosition;
