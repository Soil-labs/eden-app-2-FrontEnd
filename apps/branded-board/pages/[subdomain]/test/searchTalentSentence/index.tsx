/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useMutation, useQuery } from "@apollo/client";
import { CandidateInfoTestSearchAlgo } from "@eden/package-ui";
// import dynamic from "next/dynamic";
import React, { useState } from "react";

// const CandidateInfo = dynamic(
//   () =>
//     import(`@eden/package-ui/src/info/CandidateInfo/CandidateInfo`).then(
//       (module) => module.CandidateInfo
//     ),
//   {
//     ssr: false,
//   }
// );
import type { NextPageWithLayout } from "../../../_app";

export const TEXT_TO_PRIMITIVES_AND_TALENT = gql`
  mutation ($fields: textToPrimitivesAndTalentInput) {
    textToPrimitivesAndTalent(fields: $fields) {
      score
      member {
        _id
        discordName
        discordAvatar
      }
      primitiveCardMemInput {
        score
        scoreReal
        nodeInput {
          _id
          name
        }
        cardMemoryOutput {
          cardMemory {
            _id
            content
          }
          scoreCardTotal
          nodeOutput {
            node {
              _id
              name
            }
            scoreTotal
            scoreHop
            scoreNode
            scoreCard
          }
        }
        neighborNodeWithMemOutput {
          nodeOutput {
            name
          }
          cardMemoryOutput {
            content
          }
          scoreTotal
          scoreCard
          scoreNode
        }
      }
    }
  }
`;

export const FIND_CANDIDATE_INFO_FOR_MEMBER = gql`
  query ($fields: findCandidateInfoForMemberInput) {
    findCandidateInfoForMember(fields: $fields) {
      positionID
      scoreCardTotal {
        score
      }
      scoreCardCategoryMemories {
        category
        score
        reason
        priority
      }
      keyAttributes {
        attribute
        reason
        score
      }
      futurePotential {
        attribute
        reason
        score
      }
      dateApply
      overallScore
      skillScore
      conversationID
      user {
        _id
        discordName
        discordAvatar
        timeZone
        location
        oneLiner
        budget {
          perHour
        }
        experienceLevel {
          total
          years
        }
      }
      readyToDisplay
      summaryQuestions {
        questionID
        originalQuestionContent
        questionContent
        questionContentSmall
        answerContent
        answerContentSmall
        reason
        score
        bestAnswerPosition
        subConversationAnswer {
          role
          content
        }
      }
      notesInterview {
        categoryName
        score
        reason
      }
      compareCandidatePosition {
        CV_ConvoToPositionAverageScore
        CV_ConvoToPosition {
          categoryName
          score
          reason
        }
        reportPassFail {
          categoryName
          title
          score
          reason
          IDb
        }
      }
      analysisCandidateEdenAI {
        flagAnalysisCreated
        background {
          content
          smallVersion
          oneLiner
        }
        fitRequirements {
          content
        }
        skills {
          content
        }
      }
    }
  }
`;

const SearchTalentSentence: NextPageWithLayout = () => {
  const [sentence, setSentence] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [primitives, setPrimitives] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [initTextToPrimitivesAndTalent, {}] = useMutation(
    TEXT_TO_PRIMITIVES_AND_TALENT,
    {
      onCompleted({ textToPrimitivesAndTalent }) {
        if (textToPrimitivesAndTalent && textToPrimitivesAndTalent.length > 0) {
          // console.log("textToPrimitivesAndTalent = ", textToPrimitivesAndTalent)

          const updatedUsers = textToPrimitivesAndTalent.map((user: any) => ({
            id: user.member._id,
            name: user.member.discordName,
            picture: user.member.discordAvatar,
            primitiveCardMemInput: user.primitiveCardMemInput,
            score: user.score,
          }));

          setUsers(updatedUsers);

          const primitivesTemp =
            textToPrimitivesAndTalent[0].primitiveCardMemInput.map(
              (node: any) => ({
                id: node.nodeInput._id,
                name: node.nodeInput.name,
              })
            );

          setPrimitives(primitivesTemp);
        }
      },
    }
  );

  console.log("users= ", users);
  console.log("primitives= ", primitives);

  const {} = useQuery(FIND_CANDIDATE_INFO_FOR_MEMBER, {
    variables: {
      fields: {
        memberID:
          users.length > 0 ? users.map((user: { id: string }) => user.id) : [],
      },
    },
    skip: users.length === 0,
    onCompleted: (data) => {
      if (data?.findCandidateInfoForMember) {
        setCandidates(data.findCandidateInfoForMember);
      }
    },
  });

  const [pageSize, setPageSize] = useState(4);
  const [pageNumber, setPageNumber] = useState(1);
  const [neighborNodeMaxSize, setNeighborNodeMaxSize] = useState(3);
  const [scoreCardMaxSize, setScoreCardMaxSize] = useState(6);

  const handleSearch = () => {
    initTextToPrimitivesAndTalent({
      variables: {
        fields: {
          text: sentence,
          pageSize: pageSize,
          pageNumber: pageNumber,
          neighborNodeMaxSize: neighborNodeMaxSize,
          scoreCardMaxSize: scoreCardMaxSize,
        },
      },
    });
  };

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  // console.log("selectedUser= ", selectedUser);

  return (
    <div className="flex">
      <div className="w-1/3 p-4">
        <textarea
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          className="mb-4 h-20 w-full rounded border p-2"
        />
        <button
          onClick={handleSearch}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Search
        </button>
        <div className="mt-4 flex flex-wrap gap-2">
          {primitives.map((primitive: { name: string }, index: number) => (
            <span
              key={index}
              className="rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {primitive.name}
            </span>
          ))}
        </div>
        <hr className="my-4" />
        <div className="mb-4">
          <label>Page Size:</label>
          <input
            type="number"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="ml-2 rounded border p-2"
          />
        </div>
        <div className="mb-4">
          <label>Page Number:</label>
          <input
            type="number"
            value={pageNumber}
            onChange={(e) => setPageNumber(Number(e.target.value))}
            className="ml-2 rounded border p-2"
          />
        </div>
        <div className="mb-4">
          <label>Neighbor Node Max Size:</label>
          <input
            type="number"
            value={neighborNodeMaxSize}
            onChange={(e) => setNeighborNodeMaxSize(Number(e.target.value))}
            className="ml-2 rounded border p-2"
          />
        </div>
        <div className="mb-4">
          <label>Score Card Max Size:</label>
          <input
            type="number"
            value={scoreCardMaxSize}
            onChange={(e) => setScoreCardMaxSize(Number(e.target.value))}
            className="ml-2 rounded border p-2"
          />
        </div>
      </div>
      <div className="w-2/3 overflow-y-scroll p-4">
        {users.map(
          (user: {
            id: string;
            picture: string;
            name: string;
            score: number;
          }) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="mb-2 flex items-center"
            >
              <img src={user.picture} className="mr-2 h-8 w-8 rounded-full" />

              <div>
                <div>{user.name}</div>
                <div>Score: {user.score}</div>
              </div>
            </div>
          )
        )}
      </div>
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative rounded bg-white p-4">
            <button
              onClick={handleClosePopup}
              className="absolute right-2 top-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <CandidateInfoTestSearchAlgo
            key={selectedUser.id || ""}
            memberID={selectedUser.id || ""}
            scoreCardSearch={selectedUser.primitiveCardMemInput}
            summaryQuestions={[]}
            mostRelevantMemberNode={{}}
            candidate={candidates?.find(
              (candidate: { user?: { _id?: string } }) =>
                candidate?.user?._id?.toString() == selectedUser.id?.toString()
            )}
            onClose={() => {
              // setSelectedUserId(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchTalentSentence;
