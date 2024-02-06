import {
  AI_REPLY_SERVICES,
  Button,
  ChatMessage,
  EdenAiChat,
} from "@eden/package-ui";
import React, { useState } from "react";
import { HiBadgeCheck } from "react-icons/hi";

const cardsDataInit = [
  {
    title: "Skill & Experience",
    trust: 30,
    time: 3,
    completed: false,
    firstMessage:
      "What specific skills do you think the ideal candidate should have for this position?",
    experienceTypeID: "SKILLS_EXPERIENCE",
  },
  {
    title: "Background",
    trust: 30,
    time: 4,
    completed: false,
    firstMessage:
      "What industries or fields of work do you think the candidate's experience would be most relevant to the position you are looking to fill?",
    experienceTypeID: "INDUSTRIES",
  },
  {
    title: "Culture Fit",
    trust: 25,
    time: 2,
    completed: false,
    firstMessage:
      "What qualities and characteristics do you think would be most important for the candidate to possess in order to fit well with your team and position culture?",
    experienceTypeID: "CULTURE_FIT",
  },
];

interface cardsDataType {
  title: string;
  trust: number;
  time: number;
  completed: boolean;
  firstMessage: string;
  experienceTypeID: string;
}

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

interface ChatMessageAll {
  [key: string]: ChatMessage;
}

interface IExperienceCreateProfileChatTalentSearchProps {
  // eslint-disable-next-line no-unused-vars
  handleChangeNodes?: (val: any) => void;
  // eslint-disable-next-line no-unused-vars
  handleChangeChat?: (val: any) => void;
}

const ExperienceCreateProfileChatTalentSearch: React.FC<
  IExperienceCreateProfileChatTalentSearchProps
> = ({ handleChangeNodes, handleChangeChat }) => {
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // const initialState = cardsDataInit.reduce((acc, curr) => {
  //   return {
  //     ...acc,
  //     [curr.experienceTypeID]: {
  //       message: "",
  //       sentMessage: false,
  //       user: "",
  //     },
  //   };
  // }, {});
  // const [sentMessageToEdenAIobjV2, setSentMessageToEdenAIobjV2] = useState(initialState);

  // console.log("sentMessageToEdenAIobjV2 = " , sentMessageToEdenAIobjV2)

  // const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
  //   useState<MessageObject>({ message: "stsdf", sentMessage: true, user: "01" });

  // const [clearConversation, setClearConversation] = useState<boolean>(false);

  const [experienceTypeID, setExperienceTypeID] = useState<string>("");

  // const [isDoneAvailable, setIsDoneAvailable] = useState(false);

  const initialState = cardsDataInit.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.experienceTypeID]: [],
    };
  }, {});
  const [chatN, setChatN] = useState<ChatMessageAll>(initialState);
  // const [chatN, setChatN] = useState<ChatMessage>([]);

  const [changeChatN, setChangeChatN] = useState<ChatMessage>([]);

  const [activeCard, setActiveCard] = useState<number | null>(null);

  const [cardsData] = useState<cardsDataType[]>(cardsDataInit);
  // const [cardsData, setCardsData] = useState<cardsDataType[]>(cardsDataInit);

  // const [totalTrustPoints, setTotalTrustPoints] = useState(0);

  console.log("activeCard = ", activeCard);

  // useEffect(() => {
  //   if (chatN.length > 5) {
  //     setIsDoneAvailable(true);
  //   }
  // }, [chatN]);

  // function handleDoneClick() {
  //   setIsDoneAvailable(false);
  //   setActiveCard(null);
  //   setClearConversation(true);

  //   // update only the cardData that were clicked
  //   const newCardsData = cardsData.map((card: cardsDataType, index: number) => {
  //     if (index === activeCard) {
  //       setTotalTrustPoints(totalTrustPoints + card.trust);
  //       return { ...card, completed: true };
  //     }
  //     return card;
  //   });

  //   setCardsData(newCardsData);
  // }

  // console.log("chatN = ", chatN);

  return (
    <div className="h-full w-full">
      <div className="pt-10"></div>
      <section className="grid h-[calc(100%-5rem)] w-full grid-cols-12">
        <div className="scrollbar-hide col-span-3 flex h-full flex-col overflow-scroll">
          {cardsData.map((card: cardsDataType, idx: number) => (
            <div key={card.title} className="mb-2 w-full last:mb-0">
              <div
                style={
                  idx == activeCard
                    ? {
                        border: "1px solid rgba(0, 255, 0, 0.5)",
                        borderRadius: "5px",
                        boxShadow: "0 0 5px 2px rgba(0, 255, 0, 0.5)",
                      }
                    : {}
                }
                className="relative flex h-16 flex-col rounded-lg border bg-white bg-opacity-60 p-2 text-gray-800"
              >
                {card.completed && (
                  <HiBadgeCheck
                    className="absolute right-2 top-2"
                    size={24}
                    color="rgba(0, 255, 0, 1)"
                  />
                )}
                <h2 className="mb-1">{card.title}</h2>
                <div>
                  <p className="mb-1 text-sm">Time: {card.time} min</p>
                  <br />
                  {/* <p className="text-sm">TRUST Points: {card.trust}</p>
                  <p className="mb-1 text-sm">Time: {card.time} min</p> */}
                </div>
                <Button
                  className="absolute bottom-2 right-2 rounded-md bg-opacity-90 !px-4 !py-px text-xs"
                  // onClick={() => {
                  //     // setSentMessageToEdenAIobj({
                  //     //     message: card.firstMessage,
                  //     //     sentMessage: true,
                  //     //     user: "01"
                  //     // });
                  //     setTimeout(console.log("hello " ), 3000);
                  //     setClearConversation(true)
                  // }}
                  variant="primary"
                  onClick={() => {
                    setTimeout(() => {
                      // setSentMessageToEdenAIobj({
                      //   message: card.firstMessage,
                      //   sentMessage: true,
                      //   user: "01",
                      // });
                      console.log(
                        "chatN[card.experienceTypeID] = ",
                        chatN[card.experienceTypeID]
                      );
                      if (chatN[card.experienceTypeID].length == 0) {
                        setSentMessageToEdenAIobj({
                          message: card.firstMessage,
                          sentMessage: true,
                          user: "01",
                        });
                      }
                      setChangeChatN(chatN[card.experienceTypeID]);
                    }, 1200);
                    // setClearConversation(true);
                    setExperienceTypeID(card.experienceTypeID);
                    setActiveCard(idx);
                  }}
                >
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="relative z-20 col-span-9 flex h-full flex-col items-center justify-center text-lg">
          <div className="absolute -top-14 left-0 h-[calc(100%+5rem)] w-full pl-4">
            {activeCard != null && (
              <EdenAiChat
                key={experienceTypeID}
                //   aiReplyService={AI_REPLY_SERVICES.EDEN_GPT_REPLY_CHAT_API_V3}
                aiReplyService={AI_REPLY_SERVICES.EDEN_AI_TAL_SEARCH_EXPIRIENCE}
                experienceTypeID={experienceTypeID}
                //   extraNodes={extraNodes}
                handleChangeNodes={(_nodeObj: any) => {
                  // console.log("handleChangeNodes:", _nodeObj);
                  // setNodeObj(_nodeObj);
                  if (handleChangeNodes) handleChangeNodes(_nodeObj);
                }}
                handleChangeChat={(_chat: any) => {
                  console.log("handleChangeChat:", _chat);

                  // chatN[experienceTypeID].push(_chat);
                  if (chatN[experienceTypeID].length < _chat.length) {
                    chatN[experienceTypeID] = _chat;

                    setChatN(chatN);
                  }
                  // setChatN(_chat);
                  if (handleChangeChat) handleChangeChat(_chat);
                }}
                //   setShowPopupSalary={setShowPopup}
                //   setMode={setMode}
                sentMessageToEdenAIobj={sentMessageToEdenAIobj}
                setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
                // clearConversation={clearConversation}
                // setClearConversation={setClearConversation}
                changeChatN={changeChatN}
                setChangeChatN={setChangeChatN}
              />
            )}
          </div>
          {/* {activeCard != null && (
            <div className="absolute -bottom-8">
              <Button
                disabled={!isDoneAvailable}
                variant="primary"
                onClick={handleDoneClick}
              >
                {isDoneAvailable ? "Done!" : "Done"}
              </Button>
            </div>
          )} */}
        </div>
      </section>
    </div>
  );
};

export default ExperienceCreateProfileChatTalentSearch;
