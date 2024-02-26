/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
// import {
//   // FIND_MEMBER_INFO,
//   MATCH_NODES_MEMBERS_AI4,
// } from "@eden/package-graphql";
import {
  MatchMembersToSkillOutput,
  Project,
  RoleType,
} from "@eden/package-graphql/generated";
import {
  // CardGrid,
  // CommonServerAvatarList,
  AI_INTERVIEW_SERVICES,
  Card,
  ChatMessage,
  DynamicSearchGraph,
  InterviewEdenAI,
} from "@eden/package-ui";
import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";

import { FIND_RELATED_NODE } from "../../../utils/data/GQLfuncitons";
import type { NextPageWithLayout } from "../../_app";
import MultiSelectPopup from "./components/MultiSelectPopup";
// import SalaryPopup from "./components/SalaryPopup";

const ADD_NODES_TO_POSITION = gql`
  mutation ($fields: addNodesToPositionInput) {
    addNodesToPosition(fields: $fields) {
      _id
      name
      nodes {
        nodeData {
          _id
          name
        }
      }
    }
  }
`;

const ADD_CONV_RECRUITER_TO_POSITION = gql`
  mutation ($fields: addConvRecruiterToPositionInput) {
    addConvRecruiterToPosition(fields: $fields) {
      _id
      convRecruiterReadyToDisplay
      convRecruiter {
        user {
          _id
          discordName
        }
        readyToDisplay
        conversation {
          role
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
  const [nodeObj, setNodeObj] = useState<NodeObj>({
    // "640a739dc5d61b4bae0ee091": {
    //   // SOS 🆘 -> problem with this node combination
    //   confidence: 9,
    //   active: false,
    //   isNew: true,
    // },
    // "6416b6e1a57032640bd813aa": {
    //   confidence: 9,
    //   active: true,
    //   isNew: true,
    // },
    // "6416adcc48d9ba5ceefb67cc": {
    //   confidence: 9,
    //   active: true,
    //   isNew: true,
    // },
    // "6425213bfd005e8c789ceaca": {
    //   confidence: 10,
    //   active: true,
    //   isNew: true,
    // },
    // "6425213cfd005e8c789ceacd": {
    //   confidence: 10,
    //   active: true,
    //   isNew: true,
    // },
    // "6425213dfd005e8c789cead0": {
    //   confidence: 10,
    //   active: true,
    //   isNew: false,
    // },
  });

  console.log("nodeObj = ", nodeObj);

  // --------- Position and User ------------
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { positionID } = router.query;
  // --------- Position and User ------------

  // SOS 🆘 -> This is the place that adds notes to the position backend, take it back after debugging
  const [addNodesToPosition, {}] = useMutation(ADD_NODES_TO_POSITION, {
    onCompleted({ data }) {
      console.log("yeaaa added nodes = ", data);
    },
  });

  //  ------------- Popup Preparation ----------
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [nodeSearchRelated, setnodeSearchRelated] = useState("");

  const [optionsPopup, setOptionsPopup] = useState<any>([]);
  const [setExtraNodes] = useState<any>([]);

  // const optionsPopup = [
  //   { value: "ID1", label: "React" },
  //   { value: "ID2", label: "Javascript" },
  //   { value: "ID3", label: "UX" },
  //   { value: "ID4", label: "UI" },
  // ];

  const handleOpenPopup = (nodeID: any) => {
    setIsOpenPopup(true);
    setnodeSearchRelated(nodeID);
  };

  console.log("nodeSearchRelated = ", nodeSearchRelated);

  const handleClosePopup = () => {
    setIsOpenPopup(false);
  };

  const handleSelectPopup = (selectedOptionsPopup: Array<any>) => {
    setExtraNodes(selectedOptionsPopup);
  };
  //  ------------- Popup Preparation ----------

  // const [setChatN] = useState<ChatMessage>([]);

  const {} = useQuery(FIND_RELATED_NODE, {
    variables: {
      fields: {
        _id: nodeSearchRelated,
      },
    },
    skip: nodeSearchRelated == "",
    onCompleted: (data) => {
      // setDataMembersA(data.findNodes);
      const optionPopup: any[] = [];

      data.findNode?.relatedNodes?.forEach((node: any) => {
        optionPopup.push({
          value: node._id,
          label: node.name,
        });
      });

      setOptionsPopup(optionPopup);
    },
  });

  const [conversationID, setConversationID] = useState<String>("");

  const [addConvRecruterToPosition] = useMutation(
    ADD_CONV_RECRUITER_TO_POSITION,
    {
      onCompleted: (data) => {
        console.log("data = ", data);
        // setAddCandidateFlag(true);
      },
    }
  );

  useEffect(() => {
    if (
      currentUser?._id != undefined &&
      positionID != undefined &&
      conversationID != ""
    ) {
      console.log("change conversationID= ", conversationID);
      addConvRecruterToPosition({
        variables: {
          fields: {
            positionID: positionID,
            userID: currentUser?._id,
            conversationID: conversationID,
          },
        },
      });
    }
  }, [positionID, currentUser?._id, conversationID]);

  //  ------------- change activation nodes when click ----
  const [activateNodeEvent, setActivateNodeEvent] = useState<any>(null);

  useEffect(() => {
    // what node where clicked
    if (activateNodeEvent != null) {
      activateNode(activateNodeEvent);
      setActivateNodeEvent(null);
    }
  }, [activateNodeEvent]);

  useEffect(() => {
    if (positionID && nodeObj) {
      console.log("change = 232323", positionID);

      // object nodeObj to array of IDs
      const nodeIDs = Object.keys(nodeObj);

      const nodeArrAddComp = nodeIDs.map((id) => ({ nodeID: id }));

      console.log("nodeArrAddComp = ", nodeArrAddComp);

      if (nodeArrAddComp.length > 0) {
        addNodesToPosition({
          variables: {
            fields: {
              positionID: positionID,
              nodes: nodeArrAddComp,
            },
          },
        });
      }
    }
  }, [positionID, nodeObj]);

  const activateNode = (nodeID: string) => {
    // activate the node that was clicked
    // const matchingIndex = nodesID?.indexOf(nodeID);

    // console.log("fuckOF = ");

    if (nodeObj[nodeID]) {
      nodeObj[nodeID].active = !nodeObj[nodeID].active;
      setNodeObj(nodeObj);
    }

    // if (matchingIndex != -1 && matchingIndex != undefined) {
    //   const newActiveNodes = [...activeNodes];

    //   newActiveNodes[matchingIndex] = !newActiveNodes[matchingIndex];
    //   setActiveNodes(newActiveNodes);
    // }
  };

  interface MessageObject {
    message: string;
    sentMessage: boolean;
  }
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false });

  // --------------- interview AI ---------------
  // type Question = {
  //   _id: string;
  //   content: string;
  // };
  type Question = {
    _id: string;
    content: string;
    bestAnswer: string;
  };

  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

  const [questions, setQuestions] = useState<Question[]>([
    {
      _id: "6463897f156bd63721b94027",
      content: "Can you tell me more about your position and what it does?",
      bestAnswer: "",
    },
    {
      _id: "646255db66a9435d4ab98c6b",
      content:
        "What is the position culture like and how would you describe the team dynamic?",
      bestAnswer: "",
    },
    {
      _id: "646255d466a9435d4ab98c67",
      content:
        "What are the key skills and qualifications required for this role?",
      bestAnswer: "",
    },
    {
      _id: "646255d766a9435d4ab98c69",
      content:
        "What are the main responsibilities and expectations of this position?",
      bestAnswer: "",
    },
    {
      _id: "6463899a156bd63721b94029",
      content:
        "What are the expectations for performance and success in this role?",
      bestAnswer: "",
    },
    {
      _id: "646389aa156bd63721b9402b",
      content:
        "What are the biggest challenges that the new hire will face in this position?",
      bestAnswer: "",
    },
    {
      _id: "646389b9156bd63721b9402d",
      content: "What is the benefits of this role?",
      bestAnswer: "",
    },
  ]);
  // --------------- interview AI ---------------

  return (
    <>
      <div className="mx-auto grid h-screen grid-cols-12 overflow-hidden bg-[#f3f3f3] ">
        <div className="col-span-5 flex flex-1 flex-col pl-8 pr-4">
          <div className="h-[60vh]">
            <InterviewEdenAI
              aiReplyService={AI_INTERVIEW_SERVICES.ASK_EDEN_TO_SEARCH_TALENT}
              handleChangeChat={(_chat: any) => {
                setChatN(_chat);
              }}
              handleChangeNodes={(_nodeObj: any) => {
                // console.log("handleChangeNodes:", nodeObj);
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
            {/* <EdenAiChat
              aiReplyService={AI_REPLY_SERVICES.EDEN_GPT_REPLY_CHAT_API_V3}
              // aiReplyService={AI_REPLY_SERVICES.EDEN_GPT_REPLY}
              extraNodes={extraNodes}
              handleChangeNodes={(_nodeObj: any) => {
                // console.log("handleChangeNodes:", nodeObj);
                setNodeObj(_nodeObj);
              }}
              // handleChangeChat={(_chat: any) => {
              //   // console.log("handleChangeChat:", _chat);
              //   // setChatN(_chat);
              // }}
              // setShowPopupSalary={setShowPopup}
              sentMessageToEdenAIobj={sentMessageToEdenAIobj}
              setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            /> */}
          </div>
          <div className="h-[40vh] py-4">
            <Card border shadow className="h-full overflow-hidden bg-white">
              {/* <p className="pointer-events-none absolute left-0 top-2 w-full text-center leading-tight text-slate-600">
                Click suggested bubbles
                <br /> to connect them to your
                <br /> search
              </p> */}
              <DynamicSearchGraph
                nodesID={Object.keys(nodeObj)}
                activeNodes={Object.values(nodeObj).map(
                  (node: any) => node.active
                )}
                isNewNodes={Object.values(nodeObj).map(
                  (node: any) => node.isNew
                )}
                setActivateNodeEvent={setActivateNodeEvent}
                height={"380"}
                // graphType={"simple"}
                // graphType={"KG_AI_2"}
                graphType={"KG_AI_2_plusIndustry"}
                // zoomGraph={1.1}
                setRelatedNodePopup={handleOpenPopup}
                disableZoom={true}
              />
            </Card>
          </div>
        </div>
      </div>
      {/* </div> */}
      <MultiSelectPopup
        options={optionsPopup}
        isOpen={isOpenPopup}
        onClose={handleClosePopup}
        onSelect={handleSelectPopup}
      />
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
