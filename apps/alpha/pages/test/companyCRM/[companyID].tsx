import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { SelectedUser } from "./components/SelectedUser";
import TrainQuestionsEdenAI from "./components/TrainQuestionsEdenAI";

const FIND_COMPANY = gql`
  query ($fields: findCompanyInput) {
    findCompany(fields: $fields) {
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

type User = {
  _id: number;
  name: string;
  avatar: string;
  score: number;
  reason: string;
  summaryQuestions: summaryQuestionType[];
};

type summaryQuestionType = {
  questionID: number;
  questionContent: string;
  answerContent: string;
  bestAnswerCompany: string;
  reason: string;
  score: number;
};

type Question = {
  _id: number;
  content: string;
  bestAnswer: string;
};

// type Users = User[];

// const users: Users = [
//   {
//     id: 1,
//     name: "John Doe",
//     email: "johndoe@example.com",
//     avatar: "https://randomuser.me/api/portraits/men/1.jpg",
//   },
//   {
//     id: 2,
//     name: "Jane Doe",
//     email: "janedoe@example.com",
//     avatar: "https://randomuser.me/api/portraits/women/2.jpg",
//   },
//   // Add more users as needed
// ];

const CompanyCRM: React.FC = () => {
  // interface MessageObject {
  //   message: string;
  //   sentMessage: boolean;
  //   user?: string;
  // }

  const router = useRouter();
  const { companyID } = router.query;

  // const [companyID] = useState<String>("644a5949e1ba07a9e9e3842c");

  const [users, setUsers] = useState<User[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { data: dataCompany } = useQuery(FIND_COMPANY, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: companyID == "" || companyID == null,
    onCompleted: (data) => {
      // console.log("createRoom completed", data);
      setUsers(
        data.findCompany.candidates.map((candidate: any) => {
          return {
            _id: candidate.user._id,
            name: candidate.user.discordName,
            avatar: candidate.user?.discordAvatar,
            score: candidate.overallScore,
          };
        })
      );

      const questionPrep: Question[] = [];

      data.findCompany.questionsToAsk.map((question: any) => {
        console.log("question = ", question);
        if (question.question == null) {
        } else {
          questionPrep.push({
            _id: question.question._id,
            content: question.question.content,
            bestAnswer: question.bestAnswer,
          });
        }
        // return {
        //   _id: question.question._id,
        //   content: question.question.content,
        //   bestAnswer: question.bestAnswer,
        // };
      });

      setQuestions(questionPrep);
    },
  });

  console.log("dataCompany = ", dataCompany);

  console.log("companyID = ", companyID);

  console.log("questions = ", questions);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [trainModalOpen, setTrainModalOpen] = useState(false);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleTrainButtonClick = () => {
    setTrainModalOpen(true);
  };

  const handleCloseTrainModal = () => {
    setTrainModalOpen(false);
  };

  const handleCopyLink = () => {
    // const url = window.location.href;
    const url = "http://localhost:3000/test/interviewEdenAIpage/" + companyID;

    navigator.clipboard.writeText(url);
    setNotificationOpen(true);
    setTimeout(() => {
      setNotificationOpen(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex justify-between">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Users
        </h1>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleCopyLink}
        >
          Link Candidates Copy
        </button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 &&
            users.map((user) => (
              <tr
                key={user._id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(user)}
              >
                <td className="border px-4 py-2">{user._id}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <button
        className="mt-4 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
        onClick={handleTrainButtonClick}
      >
        Train EdenAI
      </button>
      {selectedUser && (
        <SelectedUser
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      )}
      {/* {selectedUser && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setSelectedUser(null)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            ></span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg    font-medium leading-6 text-gray-900">
                      {selectedUser.name}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Score: {selectedUser.score}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {trainModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={handleCloseTrainModal}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div className="transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
              <TrainQuestionsEdenAI
                questions={questions}
                companyID={companyID}
                setQuestions={setQuestions}
                setTrainModalOpen={setTrainModalOpen}
              />
            </div>
          </div>
        </div>
      )}
      {notificationOpen && (
        <div className="fixed bottom-0 right-0 mb-4 mr-4 rounded-lg bg-green-500 px-4 py-2 text-white">
          Link copied!
        </div>
      )}
    </div>
  );
};

export default CompanyCRM;
