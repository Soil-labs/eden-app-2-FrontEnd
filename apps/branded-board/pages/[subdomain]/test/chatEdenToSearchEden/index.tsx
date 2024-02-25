/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  MatchMembersToSkillOutput,
  Project,
  RoleType,
} from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  CandidateInfoTestSearchAlgo,
  Card,
  ChatMessage,
  EdenAiProcessingModal,
  InterviewEdenAI,
} from "@eden/package-ui";
import React, { useContext, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../../_app";

export const TEXT_TO_PRIMITIVES_AND_TALENT = gql`
  mutation ($fields: textToPrimitivesAndTalentInput) {
    textToPrimitivesAndTalent(fields: $fields) {
      primitiveState {
        nodeInput {
          _id
          name
        }
        score
      }
      memberScoreAndPrimitiveCardType {
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
            }
          }
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

interface NodeObj {
  [key: string]: {
    active: boolean;
    confidence: number;
    isNew: boolean;
  };
}

const chatEden: NextPageWithLayout = () => {
  const [nodeObj, setNodeObj] = useState<NodeObj>({});

  console.log("nodeObj = ", nodeObj);

  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [primitives, setPrimitives] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const [initTextToPrimitivesAndTalent, {}] = useMutation(
    TEXT_TO_PRIMITIVES_AND_TALENT,
    {
      onCompleted({ textToPrimitivesAndTalent }) {
        setLoadingSpinner(false);
        if (
          textToPrimitivesAndTalent &&
          textToPrimitivesAndTalent.memberScoreAndPrimitiveCardType.length > 0
        ) {
          // console.log("textToPrimitivesAndTalent = ", textToPrimitivesAndTalent)

          const memberScoreAndPrimitiveCardType =
            textToPrimitivesAndTalent.memberScoreAndPrimitiveCardType;

          const updatedUsers = memberScoreAndPrimitiveCardType.map(
            (user: any) => ({
              id: user.member._id,
              name: user.member.discordName,
              picture: user.member.discordAvatar,
              primitiveCardMemInput: user.primitiveCardMemInput,
              score: user.score,
            })
          );

          console.log(
            "memberScoreAndPrimitiveCardType = ",
            memberScoreAndPrimitiveCardType
          );

          console.log("updatedUsers = ", updatedUsers);

          setUsers(updatedUsers);

          if (textToPrimitivesAndTalent.primitiveState.length > 0) {
            const primitivesTemp = textToPrimitivesAndTalent.primitiveState.map(
              (node: any) => ({
                _id: node.nodeInput._id,
                name: node.nodeInput.name,
                score: node.score,
              })
            );

            setPrimitives(primitivesTemp);
          }
        }
      },
    }
  );

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

  const handleSearch = (message: string) => {
    setLoadingSpinner(true);
    initTextToPrimitivesAndTalent({
      variables: {
        fields: {
          text: message,
          primitiveState: primitives.map(
            (primitive: { _id: string; score: number }) => ({
              nodeID: primitive._id,
              score: primitive.score,
            })
          ),
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

  // --------- Position and User ------------
  const { currentUser } = useContext(UserContext);
  // --------- Position and User ------------

  //  ------------- Popup Preparation ----------

  const handleClosePopup = () => {
    setSelectedUser(null);
  };

  //  ------------- Popup Preparation ----------

  const [conversationID, setConversationID] = useState<String>("");

  interface MessageObject {
    message: string;
    sentMessage: boolean;
  }
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false });

  // --------------- interview AI ---------------
  type Question = {
    _id: string;
    content: string;
    bestAnswer: string;
  };

  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

  const [questions, setQuestions] = useState<Question[]>([]);
  // --------------- interview AI ---------------

  useEffect(() => {
    if (chatN.length > 0 && chatN[chatN.length - 1]?.user == "02") {
      handleSearch(chatN[chatN.length - 1].message);
    }
  }, [chatN]);

  return (
    <>
      <div className="mx-auto grid h-screen grid-cols-12 overflow-hidden bg-[#f3f3f3]">
        <div className="col-span-5 flex flex-1 flex-col pl-8 pr-4">
          <div className="h-[60vh]">
            <InterviewEdenAI
              aiReplyService={AI_INTERVIEW_SERVICES.ASK_EDEN_TO_SEARCH_TALENT}
              handleChangeChat={(_chat: any) => {
                setChatN(_chat);
              }}
              handleChangeNodes={(_nodeObj: any) => {
                setNodeObj(_nodeObj);
              }}
              sentMessageToEdenAIobj={sentMessageToEdenAIobj}
              setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
              placeholder={
                <p className="bg-accentColor rounded-lg p-1 text-center font-medium">
                  Hi! I&apos;m Eden AI. Say &quot;Hello&quot; to start the
                  interview
                </p>
              }
              questions={questions}
              setQuestions={setQuestions}
              userID={currentUser?._id}
              useMemory={false}
              conversationID={conversationID}
              setConversationID={setConversationID}
            />
          </div>
          <div className="h-[40vh] py-4">
            {!loadingSpinner && (
              <Card
                border
                shadow
                className="h-full overflow-hidden bg-white p-5"
              >
                <div className="mt-4 flex flex-wrap gap-4">
                  {primitives.map(
                    (
                      primitive: { name: string; score: number },
                      index: number
                    ) => {
                      let bgColorClass = "bg-blue-100"; // Base color class
                      let textColorClass = "text-black"; // Default text color
                      // Determine the shade and text color based on the score

                      console.log("primitive.score = ", primitive.score);

                      if (primitive.score <= 5) {
                        bgColorClass = "bg-blue-200"; // Lightest blue for scores 0-1
                        textColorClass = "text-white"; // Black text for lighter backgrounds
                      } else if (primitive.score > 5 && primitive.score <= 7) {
                        bgColorClass = "bg-blue-500"; // Lighter blue for scores 2-5
                        textColorClass = "text-white"; // Black text for lighter backgrounds
                      } else if (primitive.score > 7 && primitive.score <= 9) {
                        bgColorClass = "bg-blue-600"; // Medium blue for scores 6-8
                        textColorClass = "text-white"; // White text for darker backgrounds
                      } else {
                        bgColorClass = "bg-blue-800"; // Dark blue for scores 9-10
                        textColorClass = "text-white"; // White text for darker backgrounds
                      }
                      return (
                        <span
                          key={index}
                          className={`rounded-full ${bgColorClass} ${textColorClass} px-6 py-3 text-sm font-semibold`}
                        >
                          {primitive.name}
                        </span>
                      );
                    }
                  )}
                </div>
              </Card>
            )}
            <EdenAiProcessingModal
              title="Getting things ready for you"
              open={loadingSpinner}
            />
          </div>
        </div>
        <div className="col-span-7 flex flex-1 flex-col pl-4 pr-8">
          <div className="h-full py-4">
            <Card border shadow className="h-full overflow-hidden bg-white">
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
                      <img
                        src={user.picture}
                        className="mr-2 h-8 w-8 rounded-full"
                      />

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
                        candidate?.user?._id?.toString() ==
                        selectedUser.id?.toString()
                    )}
                    onClose={() => {
                      // setSelectedUserId(null);
                    }}
                  />
                </div>
              )}
            </Card>
          </div>
          {/* New Card for Settings Placeholder */}
          {!selectedUser && (
            <div className="mt-4">
              <Card border shadow className="overflow-hidden bg-white p-4">
                <div className="-mx-2 mb-4 flex flex-wrap">
                  <div className="mb-4 w-1/2 px-2">
                    <label>Page Size:</label>
                    <input
                      type="number"
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="ml-2 rounded border p-2 text-xs"
                    />
                  </div>
                  <div className="mb-4 w-1/2 px-2">
                    <label>Page Number:</label>
                    <input
                      type="number"
                      value={pageNumber}
                      onChange={(e) => setPageNumber(Number(e.target.value))}
                      className="ml-2 rounded border p-2 text-xs"
                    />
                  </div>
                  <div className="mb-4 w-1/2 px-2">
                    <label>Neighbor Node Max Size:</label>
                    <input
                      type="number"
                      value={neighborNodeMaxSize}
                      onChange={(e) =>
                        setNeighborNodeMaxSize(Number(e.target.value))
                      }
                      className="ml-2 rounded border p-2 text-xs"
                    />
                  </div>
                  <div className="mb-4 w-1/2 px-2">
                    <label>Score Card Max Size:</label>
                    <input
                      type="number"
                      value={scoreCardMaxSize}
                      onChange={(e) =>
                        setScoreCardMaxSize(Number(e.target.value))
                      }
                      className="ml-2 rounded border p-2 text-xs"
                    />
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default chatEden;

import { getCookieFromContext } from "@eden/package-ui/utils";
import { Maybe } from "graphql/jsutils/Maybe";
import { IncomingMessage, ServerResponse } from "http";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = getCookieFromContext(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export interface IUserDiscoverCardProps {
  matchMember?: Maybe<MatchMembersToSkillOutput>;
  project?: Maybe<Project>;
  role?: Maybe<RoleType>;
  invite?: boolean;
  messageUser?: boolean;
  phase?: string;
  nodesID?: string[];
  conversation?: any;
}
