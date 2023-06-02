import { gql, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Members, Project } from "@eden/package-graphql/generated";
import { Avatar, TextLabel1 } from "@eden/package-ui";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { BsCoin } from "react-icons/bs";

import { ChatBox, KeywordList, ReviewButton, StarRating } from "./";
import { IChatMessages } from "./ReviewMemberContainer";

const EDEN_GPT_ENDORSE_CHAT_API = gql`
  query ($fields: edenGPTReviewChatAPIInput!) {
    edenGPTReviewChatAPI(fields: $fields) {
      reply
    }
  }
`;

const MESSAGE_MAP_KG = gql`
  query ($fields: messageMapKGInput!) {
    messageMapKG(fields: $fields) {
      keywords {
        keyword
        confidence
        nodeID
      }
    }
  }
`;

interface IReviewModalView1Props {
  member?: Members;
  project?: Project;
  onNext: () => void;
  rating: number;
  // eslint-disable-next-line no-unused-vars
  onRatingChange: (rating: number) => void;
  chatMessages?: IChatMessages[];
  // eslint-disable-next-line no-unused-vars
  onChatMessagesChange: Dispatch<SetStateAction<IChatMessages[]>>;
}

export const ReviewModalView1 = ({
  member,
  project,
  onNext,
  rating,
  onRatingChange,
  chatMessages,
  onChatMessagesChange,
}: IReviewModalView1Props) => {
  const { currentUser } = useContext(UserContext);

  const [messageUser, setMessageUser] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [kgNodes, setKgNodes] = useState<any[]>([]);

  const [topSkillsNodes, setTopSkillsNodes] = useState<any[]>([]);
  const [prosNodes, setProsNodes] = useState<any[]>([]);
  const [consNodes, setConsNodes] = useState<any[]>([]);
  const [generalNodes, setGeneralNodes] = useState<any[]>([]);

  useQuery(EDEN_GPT_ENDORSE_CHAT_API, {
    variables: {
      fields: {
        message: messageUser,
        conversation: chatMessages
          ?.map((obj: IChatMessages) => {
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
    skip: messageUser == "",
    onCompleted: (data) => {
      // console.log("edenGPTReviewChatAPI = ", data);
      onChatMessagesChange((prev) => [
        ...prev,
        { user: "01", message: data.edenGPTReviewChatAPI.reply },
      ]);
      setMessageUser("");
      setLoading(false);
    },
  });

  useEffect(() => {
    if (kgNodes.length > 0) {
      setTopSkillsNodes(kgNodes.filter((node) => node.confidence === 10));
      setProsNodes(
        kgNodes.filter((node) => node.confidence > 6 && node.confidence < 10)
      );
      setConsNodes(kgNodes.filter((node) => node.confidence === 0));
      setGeneralNodes(
        kgNodes.filter((node) => node.confidence < 6 && node.confidence > 0)
      );
    }
  }, [kgNodes]);

  const chatNToString = () => {
    let chatNString = "";

    chatMessages?.forEach((message) => {
      chatNString += message.message + " ";
    });
    // console.log("chatNString = ", chatNString);
    return chatNString;
  };

  useQuery(MESSAGE_MAP_KG, {
    variables: {
      fields: {
        message: chatNToString(),
      },
    },
    skip: chatMessages && chatMessages.length < 2,
    onCompleted: (data) => {
      // console.log("dataMessageMapKG = ", data);
      setKgNodes(data.messageMapKG.keywords);
    },
  });

  useEffect(() => {
    if (member && project && currentUser && chatMessages?.length === 0)
      onChatMessagesChange((prev) => [
        ...prev,
        {
          user: "01",
          message: `Hey ${currentUser?.discordName}!  How was your experience working with ${member?.discordName} on ${project?.title}?`,
        },
      ]);
  }, [member, project, currentUser, chatMessages]);

  const handleSentMessage = useCallback((message: string, user: string) => {
    setLoading(true);
    onChatMessagesChange((prev) => [...prev, { user, message }]);
    setMessageUser(message);
  }, []);

  return (
    <div className={`grid grid-cols-3 gap-4`}>
      <div className={`col-span-2`}>
        <ChatBox
          chatN={chatMessages}
          messageLoading={loading}
          handleSentMessage={handleSentMessage}
        />
      </div>
      <div className={`col-span-1`}>
        <div className={`text-lg font-medium uppercase text-neutral-700`}>
          Endorsing:
        </div>
        <div className={`my-4	flex items-center gap-2`}>
          <div>
            <Avatar src={member?.discordAvatar!} size="sm" />
          </div>
          <div>
            <div>
              {member?.discordName && (
                <span className="text-lg font-medium tracking-wide text-neutral-600">
                  @{member?.discordName}
                </span>
              )}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {member?.memberRole?.title}
            </div>
          </div>
        </div>

        <KeywordList
          label={`Top Skills:`}
          nodes={topSkillsNodes}
          colorRGB={`235,225,255`}
          closeButton
          handleDeleteNode={(val) => {
            setTopSkillsNodes((prev) => prev.filter((node) => node !== val));
          }}
        />
        <KeywordList
          label={`Pros:`}
          nodes={prosNodes}
          colorRGB={`209,247,196`}
          closeButton
          handleDeleteNode={(val) => {
            setProsNodes((prev) => prev.filter((node) => node !== val));
          }}
        />
        <KeywordList
          label={`Cons:`}
          nodes={consNodes}
          colorRGB={`209,247,196`}
          closeButton
          handleDeleteNode={(val) => {
            setConsNodes((prev) => prev.filter((node) => node !== val));
          }}
        />
        <KeywordList
          label={`General:`}
          nodes={generalNodes}
          colorRGB={`209,247,196`}
          closeButton
          handleDeleteNode={(val) => {
            setGeneralNodes((prev) => prev.filter((node) => node !== val));
          }}
        />
        <div className={`my-4 text-center shadow-md`}>
          <TextLabel1 className={`text-xs font-semibold text-neutral-800`}>
            Would you want to work with @{member?.discordName} again?
          </TextLabel1>
          <StarRating rating={rating} onRatingChange={onRatingChange} />
        </div>
        <div className={`mt-12 flex justify-center`}>
          {chatMessages && chatMessages?.length < 5 ? (
            <button
              type={`button`}
              disabled
              className={`rounded-full border-2 bg-[#D7D7FF]/10 px-4 py-1 font-semibold uppercase text-neutral-400`}
            >
              Endorse{" "}
              <BsCoin className={`ml-2 inline-block h-4 w-4 text-yellow-500`} />
            </button>
          ) : (
            <ReviewButton type={`button`} onClick={onNext} />
          )}
        </div>
      </div>
    </div>
  );
};
