/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

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
  const { positionID } = router.query;

  const [formData, setFormData] = useState({
    _id: "",
    phase: "QUERY",
    senderID: positionID,
    senderType: "POSITION",
    responderID: "110217248786571144327",
    responderType: "USER",
    question: "",
  });

  useEffect(() => {
    if (positionID) {
      setFormData({
        ...formData,
        senderID: positionID,
      });
      console.log("positionID = ", positionID);
    }
  }, [positionID]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData); // You can perform further actions with the form data, such as sending it to an API

    updateQueryResponse({
      variables: {
        fields: {
          _id: formData._id,
          phase: formData.phase,
          senderID: formData.senderID,
          senderType: formData.senderType,
          responderID: formData.responderID,
          responderType: formData.responderType,
          question: formData.question,
        },
      },
    });
  };

  const [updateQueryResponse, {}] = useMutation(UPDATE_QUERY_RESPONSE, {
    onCompleted({ updateQueryResponse }) {
      console.log("data tl= ", updateQueryResponse);
      // if (!deleteError) console.log("deleteError is null");
      // //   console.log("deleteError", deleteError);
      // refetchErrors();

      // console.log("data = " , data)

      // if (updateQueryResponse) {
      //   setFormData({
      //     ...formData,
      //     _id: updateQueryResponse._id,
      //   });
      // }
    },
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsAns, setQuestionsAns] = useState<Question[]>([]);

  useSubscription(QUERY_RESPONSE_UPDATED, {
    variables: {
      fields: {
        senderID: positionID,
        senderType: "POSITION",
        phase: "QUERY",
      },
    },
    // skip: !partyId,
    onData: ({ data }) => {
      const questionIndex = questions.findIndex(
        (question) =>
          question._id.toString() ==
          data.data.queryResponseUpdated._id.toString()
      );

      if (questionIndex !== -1) {
        // update the answer
        const updatedQuestions = [...questions];

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

  useSubscription(QUERY_RESPONSE_UPDATED, {
    variables: {
      fields: {
        senderID: positionID,
        senderType: "POSITION",
        phase: "RESPONDED",
      },
    },
    // skip: !partyId,
    onData: ({ data }) => {
      const questionIndex = questionsAns.findIndex(
        (question) =>
          question._id.toString() ==
          data.data.queryResponseUpdated._id.toString()
      );

      if (questionIndex !== -1) {
        // update the answer
        const updatedQuestions = [...questionsAns];

        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          question: {
            content: data.data.queryResponseUpdated.content,
          },
        };
        setQuestionsAns(updatedQuestions);
      } else {
        // add the question
        setQuestionsAns([...questionsAns, data.data.queryResponseUpdated]);
      }

      // also filter out from setQuestions if it exists there
      const questionIndex2 = questions.findIndex(
        (question) =>
          question._id.toString() ==
          data.data.queryResponseUpdated._id.toString()
      );

      if (questionIndex2 !== -1) {
        // update the answer
        const updatedQuestions = [...questions];

        updatedQuestions.splice(questionIndex2, 1);
        setQuestions(updatedQuestions);
      }
    },
  });

  const {} = useQuery(FIND_QUERY_RESPONSES, {
    variables: {
      fields: {
        senderID: positionID,
        senderType: "POSITION",
        phase: "QUERY",
      },
    },
    onCompleted: (data) => {
      setQuestions(data.findQueryResponses);
    },
  });

  const {} = useQuery(FIND_QUERY_RESPONSES, {
    variables: {
      fields: {
        senderID: positionID,
        senderType: "POSITION",
        phase: "RESPONDED",
      },
    },
    onCompleted: (data) => {
      setQuestionsAns(data.findQueryResponses);
    },
  });

  console.log("formData = ", formData);

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex">
          <div className="mb-4 w-1/2 rounded bg-white px-8 pb-8 pt-6 shadow-md">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="_id">
                  _id:
                </label>
                <input
                  type="text"
                  id="_id"
                  name="_id"
                  value={formData._id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="phase">
                  phase:
                </label>
                <select
                  id="phase"
                  name="phase"
                  value={formData.phase}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  <option value="QUERY">Query</option>
                  <option value="RESPONDED">Responded</option>
                  <option value="VIEWED">Viewed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="senderID">
                  senderID:
                </label>
                <input
                  type="text"
                  id="senderID"
                  name="senderID"
                  value={formData.senderID}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="senderType">
                  senderType:
                </label>
                <select
                  id="senderType"
                  name="senderType"
                  value={formData.senderType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  {/* <option value="">Select a sender type</option> */}
                  <option value="POSITION">Position</option>
                  <option value="USER">User</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="responderID">
                  responderID:
                </label>
                <input
                  type="text"
                  id="responderID"
                  name="responderID"
                  value={formData.responderID}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="responderType">
                  Response Type
                </label>
                <select
                  id="responderType"
                  name="responderType"
                  value={formData.responderType}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  {/* <option value="">Select a responder type</option> */}
                  {/* <option value="Type A">Type A</option>
              <option value="Type B">Type B</option> */}
                  <option value="USER">User</option>
                  <option value="POSITION">Position</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  className="mb-2 block text-xl font-bold text-gray-700"
                  htmlFor="question"
                >
                  Question
                </label>
                <input
                  type="text"
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 bg-yellow-100 px-4 py-4 text-2xl font-semibold shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-500 px-4 py-2 text-white"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div className="float-right mb-4 w-1/2 rounded bg-white px-8 pb-8 pt-6 shadow-md">
            <h1>Question that you Send</h1>
            <div className="w-full max-w-lg space-y-4 p-4">
              {questions.map((question) => (
                <div key={question._id}>
                  <p className="mb-2 text-lg font-semibold">
                    Q: {question.question.content}
                  </p>

                  <p className="mb-2 text-xs font-semibold text-gray-400">
                    _id: {question._id}
                  </p>
                </div>
              ))}
            </div>
            <div className="my-8 border-b-4 text-gray-500"></div>

            <h1>Question Received Answer</h1>
            <div className="w-full max-w-lg space-y-4 p-4">
              {questionsAns.map((question) => (
                <div key={question._id}>
                  <p className="mb-2 text-lg font-semibold">
                    Q: {question.question.content}
                  </p>

                  <p className="mb-2 text-xs font-semibold text-gray-400">
                    Answer: {question.answer.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default askQuestionPosition;
