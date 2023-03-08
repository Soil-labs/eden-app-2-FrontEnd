/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  FIND_MEMBER_INFO,
  MATCH_NODES_MEMBERS_AI4,
} from "@eden/package-graphql";
import {
  MatchMembersToSkillOutput,
  MatchPercentage,
  Members,
  Project,
  RoleType,
} from "@eden/package-graphql/generated";
import {
  AvatarList,
  Badge,
  Button,
  Card,
  CardGrid,
  ChatSimple,
  CommonServerAvatarList,
  DynamicSearchGraph,
  LongText,
  MemberInfoWithDynamicGraph,
  SendMessageUserToUser,
  SocialMediaComp,
  TextHeading3,
  TextLabel1,
  UserInviteModal,
  UserWithDescription,
} from "@eden/package-ui";
// import dynamic from "next/dynamic";
import React, { Fragment, useContext, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../_app";
import {
  EDEN_GPT_REPLY,
  EDEN_GPT_REPLY_CHAT_API,
  EDEN_GPT_REPLY_MEMORY,
  MESSAGE_MAP_KG,
  STORE_LONG_TERM_MEMORY,
} from "./utils/GQLfuncitons";

const chatEden: NextPageWithLayout = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [messageUser, setMessageUser] = useState<string>("");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [edenAIsentMessage, setEdenAIsentMessage] = useState<boolean>(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { currentUser } = useContext(UserContext);

  // console.log("currentUser = ", currentUser);

  // const [nodesID, setNodesID] = useState<string[]>([
  //   "63eaf095df71c82f61c17a3c",
  //   "63eaf031df71c82f61c178fc",
  // ]);

  // console.log("nodesID = ", nodesID);
  // const [nodesID, setNodesIDK] = useState<string[]>([
  //   "63eaf095df71c82f61c17a3c",
  //   "63eaf031df71c82f61c178fc",
  // ]);
  // const [activeNodes, setActiveNodes] = useState<Boolean[]>([false, false]);

  const [nodesID, setNodesID] = useState<string[]>([]);

  // const [nodesID, setNodesIDK] = useState<string[]>([]);
  const [nodesConfidence, setNodesConfidence] = useState<string[]>([]);
  const [activeNodes, setActiveNodes] = useState<Boolean[]>([]);

  // console.log("nodesID = ", nodesID);

  // const [nodeNames]

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [chatN, setChatN] = useState([
    {
      user: "01",
      message: "Hey I am Eden AI, how can I help you?",
    },
  ]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [chatNprepareGPT, setChatNprepareGPT] = useState<string>("");

  // console.log("nodesID = " , nodesID)
  // console.log("nodesConfidence = " , nodesConfidence)

  const [
    selectedOption,
    // setSelectedOption
  ] = useState<string | null>("option3");

  const { data: dataEdenGPTReply } = useQuery(EDEN_GPT_REPLY, {
    variables: {
      fields: {
        message: messageUser,
      },
    },
    skip: messageUser == "" || selectedOption != "option1",
  });

  const { data: dataEdenGPTReplyMemory } = useQuery(EDEN_GPT_REPLY_MEMORY, {
    variables: {
      fields: {
        message: messageUser,
        memorySort: chatNprepareGPT,
        userID: currentUser?._id,
      },
    },
    skip: messageUser == "" || selectedOption != "option2",
  });

  const { data: dataEdenGPTReplyChatAPI } = useQuery(EDEN_GPT_REPLY_CHAT_API, {
    variables: {
      fields: {
        message: messageUser,
        conversation: chatN
          .map((obj) => {
            if (obj.user === "01") {
              return { role: "assistant", content: obj.message };
            } else {
              return { role: "user", content: obj.message };
            }
          })
          .slice(-6),
        userID: currentUser?._id,
      },
    },
    skip: messageUser == "" || selectedOption != "option3",
  });

  const { data: dataMessageMapKG } = useQuery(MESSAGE_MAP_KG, {
    variables: {
      fields: {
        message: messageUser,
      },
    },
    skip: messageUser == "",
  });

  const [dataMembersA, setDataMembersA] = useState<any>(null);

  const {} = useQuery(MATCH_NODES_MEMBERS_AI4, {
    variables: {
      fields: {
        nodesID: nodesID.filter((node, index) => activeNodes[index]),
        weightModules: [
          {
            type: "node_subExpertise",
            weight: 80,
          },
          {
            type: "node_subTypeProject",
            weight: 20,
          },
          {
            type: "node_total",
            weight: 50,
          },
          {
            type: "everything_else",
            weight: 50,
          },
        ],
      },
    },
    // skip: !nodesID
    onCompleted: (data) => {
      setDataMembersA(data.matchNodesToMembers_AI4);
    },
  });

  // console.log("dataMembers = ", dataMembers);

  const [numMessageLongTermMem, setNumMessageLongTermMem] = useState<any>(0);

  const [storeLongTermMemory, {}] = useMutation(STORE_LONG_TERM_MEMORY, {
    // onCompleted({ storeLongTermMemory }) {
    //   // // if (!storeLongTermMemory) console.log("deleteError is null");
    //   // // //   console.log("deleteError", deleteError);
    //   // refetchErrors();
    //   // console.log("you just saved memory with sumary = ", storeLongTermMemory);
    // },
  });

  const handleStoreLongTermMemory = () => {
    storeLongTermMemory({
      variables: {
        fields: {
          messages: chatN
            .map((obj) => {
              if (obj.user === "01") {
                return { ...obj, name: "Eden: ", user: undefined };
              } else {
                return { ...obj, name: "User: ", user: undefined };
              }
            })
            .slice(-6),
          userID: currentUser?._id,
        },
      },
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (
      (dataEdenGPTReply || dataEdenGPTReplyMemory || dataEdenGPTReplyChatAPI) &&
      edenAIsentMessage == true
    ) {
      const chatT = [...chatN];

      let newMessage = "";

      if (selectedOption == "option3") {
        newMessage = dataEdenGPTReplyChatAPI.edenGPTreplyChatAPI.reply;
      } else if (selectedOption == "option2") {
        newMessage = dataEdenGPTReplyMemory.edenGPTreplyMemory.reply;
      } else if (selectedOption == "option1") {
        newMessage = dataEdenGPTReply.edenGPTreply.reply;
      }
      chatT.push({
        user: "01",
        message: newMessage,
      });
      setChatN(chatT);

      // from chatT that is an array of objects, translate it to a string
      let chatNprepareGPTP = "";

      for (let i = 0; i < chatT.length; i++) {
        // // console.log("chatNprepareGPTP = " , i,chatT[i].message)

        if (chatT[i].user == "01")
          chatNprepareGPTP += "Eden AI: " + chatT[i].message + "\n";
        else chatNprepareGPTP += "User: " + chatT[i].message + "\n";
      }

      // // console.log("chatNprepareGPTP = FINAL -- " , chatNprepareGPTP)

      setChatNprepareGPT(chatNprepareGPTP);

      setEdenAIsentMessage(false);
    }
  }, [dataEdenGPTReply, dataEdenGPTReplyMemory, dataEdenGPTReplyChatAPI]);

  // ---------------- update nodes ------------
  useEffect(() => {
    if (dataMessageMapKG) {
      const keywordsAI: any = [];
      const newNodeID: any = [];
      const newNodeConfidence: any = [];

      dataMessageMapKG?.messageMapKG?.keywords?.forEach((keyword: any) => {
        if (keyword.nodeID) {
          keywordsAI.push(keyword.keyword);
          newNodeID.push(keyword.nodeID);
          newNodeConfidence.push(keyword.confidence);
        }
      });

      // const newNodesIDK = [...nodesID];
      // const newActiveNodes = [...activeNodes];
      // const newNodesConfidence = [...nodesConfidence]

      const newNodesIDK = [];
      const newActiveNodes = [];
      const newNodesConfidence = [];

      //  --------- only take the ones that are true or have high confidence ------------
      for (let i = 0; i < nodesID.length; i++) {
        const nodeN = nodesID[i];
        const nodeActive = activeNodes[i];
        const nodeConfidence = nodesConfidence[i];

        if (nodeActive) {
          newNodesIDK.push(nodeN);
          newActiveNodes.push(nodeActive);
          newNodesConfidence.push(nodeConfidence);
        } else {
          if (parseInt(nodeConfidence) > 6) {
            newNodesIDK.push(nodeN);
            newActiveNodes.push(nodeActive);
            newNodesConfidence.push(nodeConfidence);
          }
        }
      }
      //  --------- only take the ones that are true or have high confidence ------------

      for (let i = 0; i < newNodeID.length; i++) {
        if (!newNodesIDK.includes(newNodeID[i])) {
          newNodesIDK.push(newNodeID[i]);
          newNodesConfidence.push(newNodeConfidence[i]);
          if (newNodeConfidence[i] > 6) {
            newActiveNodes.push(true);
          } else {
            newActiveNodes.push(false);
          }
        }
      }

      // setNodesIDK(newNodesIDK);
      setNodesID(newNodesIDK);
      setActiveNodes(newActiveNodes);
      setNodesConfidence(newNodesConfidence);
    }
  }, [dataMessageMapKG]);
  // ---------------- update nodes ------------

  const handleSentMessage = (messageN: any, userN: any) => {
    const chatT = [...chatN];

    chatT.push({
      user: userN,
      message: messageN,
    });
    setChatN(chatT);

    setNumMessageLongTermMem(numMessageLongTermMem + 1);

    if (numMessageLongTermMem > 3) {
      handleStoreLongTermMemory();
      setNumMessageLongTermMem(0);
    }

    // console.log("messageN ==------- ", messageN);

    setMessageUser(messageN);

    setEdenAIsentMessage(true);

    // // console.log("handleSentMessage = ", chatT);
  };

  //  ------------- change activation nodes when click ----
  const [activateNodeEvent, setActivateNodeEvent] = useState<any>(null);

  useEffect(() => {
    // what node where clicked
    if (activateNodeEvent != null) {
      activateNode(activateNodeEvent);
      setActivateNodeEvent(null);
    }
  }, [activateNodeEvent]);

  const activateNode = (nodeID: string) => {
    // activate the node that was clicked
    const matchingIndex = nodesID?.indexOf(nodeID);

    if (matchingIndex != -1 && matchingIndex != undefined) {
      const newActiveNodes = [...activeNodes];

      newActiveNodes[matchingIndex] = !newActiveNodes[matchingIndex];
      setActiveNodes(newActiveNodes);
    }
  };
  //  ------------- change activation nodes when click ----

  return (
    <>
      <div className="flex h-screen">
        <div className="flex flex-1 flex-col">
          {/* <button
            type="button"
            className={
              "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
            }
            onClick={() => {
              handleStoreLongTermMemory();
              setNumMessageLongTermMem(0);
            }}
          >
            {" "}
            Save Memory{" "}
          </button>
          <div>
            <ButtonGroup
              selectedOption={selectedOption}
              handleButtonClick={handleButtonClick}
            />
          </div>
          <div className="w-full py-2">
            <div className="h-1 w-full bg-gray-300"></div>
          </div> */}

          <div className="h-1/2">
            <ChatSimple chatN={chatN} handleSentMessage={handleSentMessage} />
          </div>
          <div className="h-1/2">
            {nodesID?.length > 0 && dataMembersA?.length == 0 && (
              <div className="flex justify-center py-4">
                <h1 className="h-16 rounded-lg bg-gray-200 px-6 py-2 text-center text-sm shadow-md sm:h-16 sm:text-lg">
                  <span className="block leading-tight">
                    Click Grey Bubbles to{" "}
                  </span>
                  <span className="block leading-tight">
                    Connect them to your search
                  </span>
                </h1>
              </div>
            )}
            <div className={`flex h-screen w-full gap-4`}>
              <div className="h-full w-full">
                <DynamicSearchGraph
                  nodesID={nodesID}
                  activeNodes={activeNodes}
                  setActivateNodeEvent={setActivateNodeEvent}
                  height={"380"}
                  graphType={"simple"}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-full flex-1 ">
          {/* <GridLayout> */}
          {/* <GridItemNine> */}
          <Card
            shadow
            className="scrollbar-hide h-full overflow-scroll bg-white p-4"
          >
            <CardGrid>
              {dataMembersA?.map(
                (member: MatchMembersToSkillOutput, index: number) => (
                  <UserDiscoverCard
                    key={index}
                    matchMember={member}
                    // role={selectedRole}
                    // project={dataProject?.findProject}
                    invite
                    phase={``}
                    nodesID={nodesID}
                  />
                )
              )}
            </CardGrid>
          </Card>
          {/* </GridItemNine> */}
          {/* </GridLayout> */}
        </div>
      </div>
    </>
  );
};

export default chatEden;

// ---------------- FROM HERE, ELOI'S MESS UwU ------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------
// ------------------------------------------------------------

import { round } from "@eden/package-ui/utils";
import { Maybe } from "graphql/jsutils/Maybe";
import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session || session.error === "RefreshAccessTokenError") {
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

const EDEN_GPT_PROFILES = gql`
  query EdenGPTsearchProfiles($fields: edenGPTsearchProfilesInput) {
    edenGPTsearchProfiles(fields: $fields) {
      reply
    }
  }
`;

export interface IUserDiscoverCardProps {
  matchMember?: Maybe<MatchMembersToSkillOutput>;
  project?: Maybe<Project>;
  role?: Maybe<RoleType>;
  invite?: boolean;
  messageUser?: boolean;
  phase?: string;
  nodesID?: string[];
}

const UserDiscoverCard = ({
  matchMember,
  project,
  role,
  invite,
  phase,
  nodesID,
}: IUserDiscoverCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const member = matchMember?.member;
  const matchPercentage = matchMember?.matchPercentage;
  const nodesPercentage = matchMember?.nodesPercentage;

  if (!member) return null;

  return (
    <Card border>
      <div className={`flex justify-center`}>
        <div>
          <div className={`relative flex flex-col items-center`}>
            <UserWithDescription
              member={member}
              percentage={round(Number(matchPercentage?.totalPercentage), 0)}
            />

            {member?.links && (
              <div className="flex justify-center">
                <SocialMediaComp size="sm" title="" links={member?.links} />
              </div>
            )}
          </div>
        </div>
        <div className="absolute right-2 top-2">
          <Button onClick={() => setIsOpen(!isOpen)}>More</Button>
        </div>
      </div>

      <div className="flex">
        <LongText
          cutText={100}
          text={(member?.bio as string) || ""}
          className={`text-darkGreen font-Inter my-2 text-sm`}
        />
      </div>

      {member?.serverID && (
        <CommonServerAvatarList
          label={`common servers`}
          size={`xs`}
          serverID={member?.serverID as string[]}
        />
      )}

      {nodesPercentage && (
        <div>
          <p className="font-Inter mb-1 text-sm font-bold text-zinc-500">
            🛠 Top skills
          </p>
          <div>
            {nodesPercentage.slice(0, 6).map((node, index) => (
              <Badge
                text={node?.node?.name || ""}
                key={index}
                className={`bg-soilPurple/20 py-px text-xs`}
              />
            ))}
          </div>
        </div>
      )}

      {member?.endorsements && member?.endorsements.length > 0 && (
        <div className="mt-4">
          <TextLabel1>🎙 ENDORSEMENTS</TextLabel1>
          <div className={`flex`}>
            <AvatarList
              className="inline-block !w-auto !justify-start"
              avatars={member?.endorsements
                .slice(0, 5)
                .map((endorsement: any) => ({
                  size: "xs",
                  src: endorsement?.endorser?.discordAvatar,
                }))}
            />
            {member?.endorsements.slice(5).length > 0 && (
              <p className="text-soilGray ml-6 mt-1 inline">
                +{member?.endorsements.slice(8).length} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* {(item.lifetimeStakeTRST || item.totalTRST) && (
        <div className="-mx-2 mt-3 -mb-3 flex">
          {item.lifetimeStakeTRST && (
            <LifetimeTRST
              member={item}
              lifetimeStakeTRST={item?.lifetimeStakeTRST}
              averageMonthlyReturnTRST={
                Math.round((item?.lifetimeStakeTRST / 100) * 10) / 10
              }
            />
          )}
          {item.totalTRST && (
            <div className="bg-soilPurple ml-auto mr-0 whitespace-nowrap rounded-xl px-2 text-sm text-white">{`${item.totalTRST} $TRST`}</div>
          )}
        </div>
      )} */}

      {invite && project && role ? (
        <UserInviteModal
          open={isOpen}
          member={member}
          project={project}
          role={role}
          phase={phase}
          matchPercentage={matchPercentage}
          onClose={() => setIsOpen(!isOpen)}
        />
      ) : (
        <>
          <UserMessageModal
            open={isOpen}
            member={member}
            matchPercentage={matchPercentage}
            nodesPercentage={nodesPercentage}
            nodesID={nodesID}
            onClose={() => setIsOpen(!isOpen)}
          />
        </>
      )}
    </Card>
  );
};

// import { toast } from "react-toastify";

// const SET_APPLY_TO_PROJECT = gql`
//   mutation ($fields: changeTeamMember_Phase_ProjectInput!) {
//     changeTeamMember_Phase_Project(fields: $fields) {
//       _id
//     }
//   }
// `;

export interface IUserMessageModalProps {
  member?: Members;
  matchPercentage?: Maybe<MatchPercentage>;
  open?: boolean;
  nodesPercentage?: any;
  nodesID?: string[];
  onClose?: () => void;
}

const UserMessageModal = ({
  member,
  matchPercentage,
  open,
  nodesPercentage,
  nodesID,
  onClose,
}: IUserMessageModalProps) => {
  const { data: dataMemberInfo } = useQuery(FIND_MEMBER_INFO, {
    variables: {
      fields: {
        _id: member?._id,
      },
    },
    skip: !member?._id || !open,
  });

  const findMember = dataMemberInfo?.findMember;
  const [showMessage, setShowMessage] = useState(false);

  // const [changeTeamMemberPhaseProject, {}] = useMutation(SET_APPLY_TO_PROJECT, {
  //   onCompleted: () => {
  //     // console.log(changeTeamMemberPhaseProject);
  //     toast.success("success");
  //     onClose && onClose();
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });
  const [chatN, setChatN] = useState([
    {
      user: "01",
      message: `Do you have any questions about ${member?.discordName}?`,
    },
    {
      user: "01",
      message: `In the profile I only have only basic info, you can now dig deeper with me ✌️`,
    },
  ]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [messageUser, setMessageUser] = useState<string>("");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [edenAIsentMessage, setEdenAIsentMessage] = useState<boolean>(false);

  const handleSentMessage = (messageN: any, userN: any) => {
    const chatT = [...chatN];

    chatT.push({
      user: userN,
      message: messageN,
    });
    setChatN(chatT);

    // console.log("messageN ==------- ", messageN);

    setMessageUser(messageN);

    // eslint-disable-next-line react-hooks/rules-of-hooks

    setEdenAIsentMessage(true);

    // // console.log("handleSentMessage = ", chatT);
  };

  // const mergeUniqueKeywords = (arr1: any, arr2: any) => {
  //   const uniqueKeywords = new Set([...arr1, ...arr2]);

  // const newKeywords = Array.from(arr2.filter(keyword => !uniqueKeywords.has(keyword)));
  // const newKeywords = arr2.filter((keyword: any) => !arr1.includes(keyword));

  // const nodesNew = [...nodesN.nodes];

  // const edgesNew = [...nodesN.edges];

  // newKeywords.forEach((keyword: any) => {
  //   if (keyword != "") {
  //     nodesNew.push({
  //       id: keyword,
  //       label: keyword,
  //       size: 40,
  //     });
  //     edgesNew.push({
  //       source: "node0",
  //       target: keyword,
  //     });
  //   }
  // });

  // setNodesN({
  //   nodes: nodesNew,
  //   edges: edgesNew,
  // });

  // const mergeUniqueK = Array.from(uniqueKeywords);

  // const mergeUniqueKNew = [];

  // for (let i = 0; i < mergeUniqueK.length; i++) {
  //   if (mergeUniqueK[i] !== "") {
  //     mergeUniqueKNew.push(mergeUniqueK[i]);
  //   }
  // }

  // // console.log(mergeUniqueKNew);

  //   return mergeUniqueKNew;
  // };

  const { data: dataEdenGPTReply } = useQuery(EDEN_GPT_PROFILES, {
    variables: {
      fields: {
        message: messageUser,
        profileIDs: [member?._id],
      },
    },
    skip: messageUser == "",
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (dataEdenGPTReply && edenAIsentMessage == true) {
      const chatT = [...chatN];

      chatT.push({
        user: "01",
        message: dataEdenGPTReply.edenGPTsearchProfiles.reply,
      });
      setChatN(chatT);

      setEdenAIsentMessage(false);

      // if the dataEdenGPTReply.edenGPTreply.keywords are new then add them to keywordsDiscussion

      // const keywordsAI = dataEdenGPTReply.edenGPTsearchProfiles.keywords;

      // const newKeywords = mergeUniqueKeywords(keywordsDiscussion, keywordsAI);

      // if (keywordsAI.length > 0) {
      //   setKeywordsDiscussion(newKeywords);
      // }
    }
  }, [dataEdenGPTReply]);
  if (!member) return null;
  // if (!findMember) return null;

  console.log("nodesID", nodesID);

  return (
    <ChatModal open={open} onClose={onClose}>
      {open && (
        <div
          className="h-8/10 fixed -right-[340px] bottom-0 z-50 w-[300px] rounded-lg bg-white"
          onClick={(e) => {
            // console.log("this event :)");

            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <ChatSimple chatN={chatN} handleSentMessage={handleSentMessage} />
        </div>
      )}
      <div className={`h-8/10 scrollbar-hide w-full overflow-scroll`}>
        <div className={`mt-4 grid grid-cols-5`}>
          <div className={`col-span-2 flex justify-end`}></div>
          <div className={`col-span-1 h-8`}></div>
          <div className={`col-span-2`}>
            {!showMessage && (
              <Button onClick={() => setShowMessage(!showMessage)}>
                Connect with {member?.discordName}
              </Button>
            )}
            {showMessage && (
              <Button onClick={() => setShowMessage(!showMessage)}>
                Cancel Message
              </Button>
            )}
          </div>
        </div>
        <div className={`-mt-12`}>
          {showMessage ? (
            <div>
              <div>
                <UserWithDescription
                  member={member}
                  percentage={matchPercentage?.totalPercentage || undefined}
                />
              </div>
              <div className={`my-4`}>
                <TextHeading3 className={`text-md text-gray-500`}>
                  Start a converstation with @{member?.discordName}.
                </TextHeading3>
              </div>
              <SendMessageUserToUser member={member} />
            </div>
          ) : (
            // <MemberInfo
            //   member={findMember || member}
            //   percentage={matchPercentage?.totalPercentage || undefined}
            // />
            // <MemberInfoWithGraph
            //   member={findMember || member}
            //   percentage={matchPercentage?.totalPercentage || undefined}
            //   hasGraph
            // />
            <MemberInfoWithDynamicGraph
              member={findMember || member}
              nodesID={nodesPercentage
                .flatMap((obj: { conn_nodeIDs: any }) => obj.conn_nodeIDs)
                .slice(0, 4)}
              // nodesID={nodesPercentage.map((node: { node: { _id: any; }; }) => node.node._id)}
              percentage={matchPercentage?.totalPercentage || undefined}
              hasGraph
            />
          )}
        </div>
      </div>
    </ChatModal>
  );
};

import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

export type ChatModalProps = {
  title?: string;
  children?: React.ReactNode;
  open?: boolean;
  closeOnEsc?: boolean;
  onClose?: () => void;
};

const ChatModal = ({
  title = "",
  children,
  open = false,
  closeOnEsc = true,
  onClose,
}: ChatModalProps) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const onCloseModal = () => {
    if (onClose) onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={"fixed inset-0 z-10 overflow-y-auto"}
        onClose={() => {
          if (onClose) {
            onCloseModal();
          }
          if (closeOnEsc) setIsOpen(false);
          onClose && onClose();
        }}
      >
        <div
          className={
            "flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
          }
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className={
                "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              }
            />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className={"hidden sm:inline-block sm:h-screen sm:align-middle"}
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={
                "relative z-30 inline-block rounded-lg bg-white p-2 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 sm:align-middle"
              }
            >
              <div
                className={"absolute top-0 right-0 hidden pt-4 pr-4 sm:block"}
              >
                {closeOnEsc && (
                  <button
                    type="button"
                    className={
                      "rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    }
                    onClick={() => {
                      setIsOpen(false);
                      onClose && onClose();
                    }}
                  >
                    <span className={"sr-only"}>Close</span>
                    <XIcon className={"h-6 w-6"} aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className={"sm:flex"}>
                <div className={"mt-3 w-full sm:mt-0"}>
                  <Dialog.Title
                    as="h3"
                    className={`text-lg font-medium leading-6 text-gray-900 ${
                      closeOnEsc ? "mr-12" : ""
                    }`}
                  >
                    {title}
                  </Dialog.Title>
                  <div className={"mt-2"}>{children}</div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
