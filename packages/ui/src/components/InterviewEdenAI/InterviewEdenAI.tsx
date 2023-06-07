import { useQuery } from "@apollo/client";
import { Maybe } from "@eden/package-graphql/generated";
import { ChatSimple } from "@eden/package-ui";
// import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

// eslint-disable-next-line no-unused-vars
import { INTERVIEW_EDEN_AI, MESSAGE_MAP_KG_V4 } from "./gqlFunctions";

interface NodeObj {
  [key: string]: {
    active: boolean;
    confidence: number;
    isNew: boolean;
  };
}
interface Question {
  _id: string;
  content: string;
  bestAnswer: string;
}

// interface Task {
//   taskType: string;
//   percentageCompleted: number;
//   taskTypeID: string;
// }

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

export enum AI_INTERVIEW_SERVICES {
  // eslint-disable-next-line no-unused-vars
  INTERVIEW_EDEN_AI = "INTERVIEW_EDEN_AI",
}
type ChatMessage = Array<{ user: string; message: string; date: Date }>;

export interface IInterviewEdenAIProps {
  aiReplyService: AI_INTERVIEW_SERVICES;
  extraNodes?: Array<any>;
  sentMessageToEdenAIobj?: MessageObject;
  changeChatN?: ChatMessage;
  experienceTypeID?: string;
  questions?: Question[];
  userID?: Maybe<string> | undefined;
  useMemory?: boolean;
  positionTrainEdenAI?: boolean;
  conversationID?: String;
  positionID?: string | string[] | undefined;
  // eslint-disable-next-line no-unused-vars
  handleChangeNodes?: (nodes: NodeObj) => void;
  // eslint-disable-next-line no-unused-vars
  handleChangeChat?: (chat: ChatMessage) => void;
  // eslint-disable-next-line no-unused-vars
  setShowPopupSalary?: (show: boolean) => void;
  // eslint-disable-next-line no-unused-vars
  setMode?: (val: "salary" | "level" | "availability") => void;
  // eslint-disable-next-line no-unused-vars
  setSentMessageToEdenAIobj?: (message: any, sentMessage: any) => void;
  // eslint-disable-next-line no-unused-vars
  setChangeChatN?: (messageArr: any) => void;
  // eslint-disable-next-line no-unused-vars
  setQuestions?: (questions: Question[]) => void;
  // eslint-disable-next-line no-unused-vars
  setConversationID?: (conversationID: string) => void;

  placeholder?: any;
  handleEnd?: () => void;
}

export const InterviewEdenAI = ({
  aiReplyService,
  // extraNodes, // extra nodes to add to the query
  sentMessageToEdenAIobj,
  // experienceTypeID,
  changeChatN,
  questions,
  userID,
  useMemory = true,
  positionTrainEdenAI,
  positionID,
  handleChangeNodes,
  handleChangeChat,
  // setShowPopupSalary,
  // setMode,
  setSentMessageToEdenAIobj,
  setChangeChatN,
  setQuestions,
  setConversationID,
  placeholder = "",
  handleEnd,
}: IInterviewEdenAIProps) => {
  // const { currentUser } = useContext(UserContext);

  const [chatN, setChatN] = useState<ChatMessage>([] as ChatMessage); // all chat messages

  // const [conversationN, setConversationN] = useState<ChatMessage>([] as ChatMessage); // all chat messages

  // const [chatNprepareGPT, setChatNprepareGPT] = useState<string>(""); // formated chat messages for chatGPT
  // eslint-disable-next-line no-unused-vars
  const [messageUser, setMessageUser] = useState<string>(""); // last message sent from user

  // eslint-disable-next-line no-unused-vars
  const [nodeObj, setNodeObj] = useState<NodeObj>({}); // list of nodes

  const [edenAIsentMessage, setEdenAIsentMessage] = useState<boolean>(false); // sets if response is pending (TODO => change logic to query based)
  const [numMessageLongTermMem, setNumMessageLongTermMem] = useState<any>(0);

  // const [previusTaskDoneID, setPreviusTaskDoneID] = useState<String>("");

  // const [executedTasks, setExecutedTasks] = useState<Task[]>([
  //   {
  //     taskType: "Find Skill",
  //     percentageCompleted: 0,
  //     taskTypeID: "skill_task",
  //   },
  //   {
  //     taskType: "Find Industry",
  //     percentageCompleted: 0,
  //     taskTypeID: "insudtry_task",
  //   },
  //   {
  //     taskType: "Find Experience level",
  //     percentageCompleted: 0,
  //     taskTypeID: "experience_task",
  //   },
  //   {
  //     taskType: "Find Salary level",
  //     percentageCompleted: 0,
  //     taskTypeID: "salary_task",
  //   },
  //   {
  //     taskType: "Find Availability",
  //     percentageCompleted: 0,
  //     taskTypeID: "availability_task",
  //   },
  // ]);

  // const [setUnansweredQuestions] = useState<String[]>([
  //   "What's your previous experience in this field?",
  //   "What are your strengths and weaknesses?",
  //   "Can you give an example of handling a difficult situation at work?",
  //   "How do you stay updated with industry trends and developments?",
  //   "What are your salary expectations for this role?",
  //   "Can you tell us about a project or achievement you're proud of?",
  //   "Can you describe your ideal work environment?",
  // ]);

  // const [setQuestionAskingNow] = useState<string>("");

  const [timesAsked, setTimesAsked] = useState<number>(0);

  // -------------- AI GPT NODES --------------
  // const { data: dataMessageMapKGV4 } = useQuery(MESSAGE_MAP_KG_V4, {
  //   variables: {
  //     fields: {
  //       message: messageUser,
  //       // assistantMessage:
  //       // chatN.length > 3 ? chatN[chatN.length - 3]?.message : "",
  //       // assistantMessage: chatN[chatN.length - 2]?.message,
  //       assistantMessage: chatN[chatN.length - 3]?.message,
  //     },
  //   },
  //   skip:
  //     messageUser == "" ||
  //     chatN.length < 2 ||
  //     chatN[chatN.length - 2]?.user == "01",
  // });

  // update nodes ---- TODO => refactor this to query onCompleted
  // useEffect(() => {
  //   if (dataMessageMapKGV4) {
  //     const newNodeObj: any = [];

  //     dataMessageMapKGV4?.messageMapKG_V4?.keywords?.forEach((keyword: any) => {
  //       if (keyword.nodeID) {
  //         newNodeObj.push({
  //           nodeID: keyword.nodeID,
  //           active: true,
  //           confidence: keyword.confidence,
  //           isNew: true,
  //         });
  //       }
  //     });

  //     const newNodesObjK: any = {};

  //     //  --------- only take the ones that are true or have high confidence ------------

  //     for (const [key, value] of Object.entries(nodeObj)) {
  //       const nodeActive = value.active;
  //       const nodeConfidence = value.confidence;

  //       if (nodeActive) {
  //         newNodesObjK[key] = {
  //           active: nodeActive,
  //           confidence: nodeConfidence,
  //         };
  //       } else {
  //         if (Object.keys(nodeObj).length > 7) {
  //           if (nodeConfidence > 5) {
  //             newNodesObjK[key] = {
  //               active: nodeActive,
  //               confidence: nodeConfidence,
  //             };
  //           }
  //         } else {
  //           newNodesObjK[key] = {
  //             active: nodeActive,
  //             confidence: nodeConfidence,
  //           };
  //         }
  //       }
  //     }
  //     //  --------- only take the ones that are true or have high confidence ------------
  //     for (let i = 0; i < newNodeObj.length; i++) {
  //       if (!Object.keys(newNodesObjK).includes(newNodeObj[i].nodeID)) {
  //         let newActive = false;

  //         if (newNodeObj[i].confidence > 6) {
  //           newActive = true;
  //         }
  //         newNodesObjK[newNodeObj[i].nodeID] = {
  //           active: newActive,
  //           confidence: newNodeObj[i].confidence,
  //           isNew: true,
  //         };
  //       }
  //     }

  //     setNodeObj(newNodesObjK);
  //     // ------- Array of objects to disctionary ------------
  //   }
  // }, [dataMessageMapKGV4]);
  // // -----------------------------------------

  // ---------- Timer Count ------------
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  function toraFunc() {
    if (startTime) {
      setElapsedTime(Date.now() - startTime);
    } else {
      setStartTime(Date.now());
    }
  }

  // function formatTime(time: number) {
  //   const seconds = Math.floor(time / 1000);
  //   const milliseconds = Math.floor(time % 1000);

  //   return `${seconds}.${milliseconds} seconds`;
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime) {
        setElapsedTime(Date.now() - startTime);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [startTime]);

  // useEffect(() => {
  //   if (elapsedTime > 25000) {
  //     setElapsedTime(0);
  //     setStartTime(Date.now());
  //   }
  // }, [elapsedTime]);

  // ---------- Timer Count ------------

  // ---------- AI GPT REPLY MESSAGE ----------
  const { data: dataInterviewEdenAI } = useQuery(INTERVIEW_EDEN_AI, {
    variables: {
      fields: {
        conversation: chatN.map((obj) => {
          if (obj.user === "01") {
            return { role: "assistant", content: obj.message, date: obj.date };
          } else {
            return { role: "user", content: obj.message, date: obj.date };
          }
          // }),
        }),
        positionTrainEdenAI: positionTrainEdenAI,
        timesAsked: timesAsked,
        positionID: positionID,
        userID: userID,
        unansweredQuestionsArr: questions?.map((question) => {
          return {
            questionID: question._id,
            questionContent: question.content,
          };
        }),
        useMemory: useMemory,
      },
    },
    skip:
      chatN.length == 0 ||
      aiReplyService != AI_INTERVIEW_SERVICES.INTERVIEW_EDEN_AI ||
      chatN[chatN.length - 1]?.user == "01" ||
      userID == "" ||
      questions?.length == 0 ||
      questions == undefined,
    onCompleted: (data) => {
      // toraFunc();
      // setElapsedTime(0);
      // setStartTime(Date.now());
      // console.log("setnmessae = ");

      setStartTime(0);
      setElapsedTime(0);
      if (
        data.interviewEdenAI.unansweredQuestionsArr &&
        data.interviewEdenAI.unansweredQuestionsArr.length === 0 &&
        handleEnd
      ) {
        handleEnd();
      }
    },
  });

  // ---------- When GPT Reply, Store all convo messages and GPT friendly formated messages ------------
  useEffect(() => {
    if (dataInterviewEdenAI && edenAIsentMessage == true) {
      const chatT: ChatMessage = [...chatN];

      // let newMessage = "";

      // if (aiReplyService === AI_INTERVIEW_SERVICES.EDEN_GPT_REPLY_CHAT_API_V2) {
      //   newMessage = dataEdenGPTReplyChatAPI.edenGPTreplyChatAPI_V2.reply;
      // } else if (aiReplyService === AI_INTERVIEW_SERVICES.EDEN_GPT_REPLY_MEMORY) {
      //   newMessage = dataEdenGPTReplyMemory.edenGPTreplyMemory.reply;
      // } else if (aiReplyService === AI_INTERVIEW_SERVICES.EDEN_GPT_REPLY) {
      //   newMessage = dataInterviewEdenAI.interviewEdenAI.reply;
      // }
      const reply = dataInterviewEdenAI?.interviewEdenAI?.reply;
      // const unansweredQuestions =
      //   dataInterviewEdenAI?.interviewEdenAI?.unansweredQuestions;
      // const questionAskingNow =
      //   dataInterviewEdenAI?.interviewEdenAI?.questionAskingNow;
      const timesAsked = dataInterviewEdenAI?.interviewEdenAI?.timesAsked;

      let questionsT: Question[] = [];

      questionsT =
        dataInterviewEdenAI?.interviewEdenAI?.unansweredQuestionsArr.map(
          (question: any) => {
            return {
              _id: question.questionID,
              content: question.questionContent,
            };
          }
        );

      // setQuestionAskingNow(questionAskingNow);

      // setUnansweredQuestions(unansweredQuestions);

      console.log("questionsT = ", questionsT);

      const conversationID = dataInterviewEdenAI?.interviewEdenAI
        ?.conversationID as string;

      if (setConversationID && conversationID != undefined) {
        setConversationID(conversationID);
      }

      if (setQuestions != undefined && questionsT != undefined) {
        setQuestions(questionsT);
      }

      setTimesAsked(timesAsked);

      chatT.push({
        user: "01",
        message: reply,
        date: dataInterviewEdenAI?.interviewEdenAI.date,
      });

      setChatN(chatT);

      // from chatT that is an array of objects, translate it to a string
      let chatNprepareGPTP = "";

      for (let i = 0; i < chatT.length; i++) {
        if (chatT[i].user == "01")
          chatNprepareGPTP += "Eden AI: " + chatT[i].message + "\n";
        else chatNprepareGPTP += "User: " + chatT[i].message + "\n";
      }

      console.log("chatNprepareGPTP = ", chatNprepareGPTP);

      // setChatNprepareGPT(chatNprepareGPTP);
      setEdenAIsentMessage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInterviewEdenAI]);
  // -----------------------------------------

  // ---------- When sent message, Store all convo messages and long term memory ------------
  const handleSentMessage = (messageN: any, userN: any) => {
    const chatT = [...chatN];

    chatT.push({
      user: userN,
      message: messageN,
      date: new Date(),
    });
    setChatN(chatT as [{ user: string; message: string; date: Date }]);

    setNumMessageLongTermMem(numMessageLongTermMem + 1);

    if (numMessageLongTermMem > 3) {
      setNumMessageLongTermMem(0);
    }

    toraFunc();
    setElapsedTime(0);
    setStartTime(Date.now());

    setMessageUser(messageN);

    setEdenAIsentMessage(true);
  };

  // --------- sent Message to Eden AI ---------------
  useEffect(() => {
    if (
      setSentMessageToEdenAIobj &&
      sentMessageToEdenAIobj?.sentMessage == true
    ) {
      if (sentMessageToEdenAIobj?.user != "") {
        setTimeout(() => {
          handleSentMessage(
            sentMessageToEdenAIobj?.message,
            sentMessageToEdenAIobj?.user
          );
        }, 700);
      } else {
        handleSentMessage(sentMessageToEdenAIobj?.message, "02");
      }
      setSentMessageToEdenAIobj("", false);
    }
  }, [sentMessageToEdenAIobj]);
  // --------- sent Message to Eden AI ---------------

  // --------- sent Message to Eden AI ---------------
  useEffect(() => {
    if (setChangeChatN && changeChatN && changeChatN.length > 0) {
      setChatN(changeChatN);
      setChangeChatN([]);
    }
  }, [changeChatN]);
  // --------- sent Message to Eden AI ---------------

  // ------------ Change on chat event --------------

  useEffect(() => {
    if (handleChangeChat) handleChangeChat!(chatN);
  }, [chatN]);
  // ------------ Change on nodes event --------------
  useEffect(() => {
    if (handleChangeNodes) handleChangeNodes(nodeObj);
  }, [nodeObj]);

  return (
    <>
      <div className="flex flex-col items-center p-4">
        {/* <div className="mb-4 text-4xl font-bold text-gray-800">
          {formatTime(elapsedTime)}
        </div> */}
        {elapsedTime > 15000 && (
          <div className="rounded-md bg-pink-400 p-2">
            <h3 className="text-center font-bold text-white">
              EdenAI is sleeping ➡️ Say hi Again
            </h3>
          </div>
        )}
      </div>

      <ChatSimple
        chatN={chatN}
        handleSentMessage={handleSentMessage}
        placeholder={placeholder}
      />
      {/* <div>
        <button onClick={toraFunc}>Start Timer</button>
        <div>Elapsed Time: {formatTime(elapsedTime)}</div>
      </div> */}
    </>
  );
};
