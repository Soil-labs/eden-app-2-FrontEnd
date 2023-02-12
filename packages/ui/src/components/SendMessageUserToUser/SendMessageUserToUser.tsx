import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  Maybe,
  Members,
  MutationAddNewChatArgs,
  ServerTemplate,
} from "@eden/package-graphql/generated";
import {
  Avatar,
  Button,
  Loading,
  ServerSelector,
  TextArea,
  TextHeading3,
} from "@eden/package-ui";
import { ThreadAutoArchiveDuration } from "discord-api-types/v10";
import isEmpty from "lodash/isEmpty";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

import {
  // CreateDMApiRequestBody,
  // CreateDMApiResponse,
  CreateMessageApiRequestBody,
  CreateThreadApiRequestBody,
  CreateThreadResponse,
} from "../../../types/type";

const ADD_NEW_CHAT = gql`
  mutation AddNewChat($fields: addNewChatInput) {
    addNewChat(fields: $fields) {
      _id
    }
  }
`;

export interface ISendMessageUserToUserrProps {
  member: Maybe<Members>;
}

export const SendMessageUserToUser = ({
  member,
}: ISendMessageUserToUserrProps) => {
  const { currentUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerTemplate>({});

  // eslint-disable-next-line no-unused-vars
  const [addNewChat] = useMutation<any, MutationAddNewChatArgs>(ADD_NEW_CHAT);

  const createThread = async (body: CreateThreadApiRequestBody) => {
    const response = await fetch(encodeURI("/api/discord/createForumPost"), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const jsonData: CreateThreadResponse = await response.json().catch((e) => {
      toast.error("e", e);
    });

    return jsonData;
  };

  const embededMessage = `
    Hello ${member?.discordName}, you just had a new connection form ${currentUser?.discordName}.
    `;

  const createMessage = async (body: CreateMessageApiRequestBody) => {
    const response = await fetch(encodeURI("/api/discord/createMessage"), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const jsonData: CreateThreadResponse = await response.json();

    return jsonData;
  };

  const followUpMessage = `
    Message from ${currentUser?.discordName}:

    ${message}

    
    https://eden-alpha-develop.vercel.app/profile/${currentUser?.discordName}
  `;

  const handleSendMessage = async () => {
    setSendingMessage(true);

    const { threadId } = await createThread({
      message: `<@${currentUser?._id}> <@${member?._id}>`,
      tagName: "User Introduction",
      embedMessage: embededMessage,
      senderAvatarURL: currentUser?.discordAvatar!,
      senderName: `${currentUser?.discordName} -- Just invite you to a conversation`,
      channelId: selectedServer.channel?.forumID!,
      threadName: `User Introduction`,
      ThreadAutoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
      enableButton: true,
    });

    // handleDMCheck({ threadID: threadId });

    try {
      await createMessage({
        message: followUpMessage,
        channelId: selectedServer?.channel?.chatID!,
        thread: threadId,
      });
      setIsMessageSent(true);
    } catch (error) {
      console.log(error);
      setSendingMessage(false);
    }

    // NEED A PROJECT ID?
    // try {
    //   await addNewChat({
    //     variables: {
    //       fields: {
    //         message: message,
    //         projectID: project?._id!,
    //         receiverID: member?._id!,
    //         senderID: currentUser?._id!,
    //         serverID: selectedServer?._id!,
    //         threadID: threadId,
    //       },
    //     },
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  // const handleDMCheck = async ({ threadID }: { threadID: string }) => {
  //   const message = `Hello ${member?.discordName}, you just had a new connection form ${currentUser?.discordName}. threadID: ${threadID}`;

  //   if (!currentUser) return;
  //   const requestBody: CreateDMApiRequestBody = {
  //     message: message,
  //     recipientId: currentUser?._id as string,
  //   };

  //   try {
  //     const response = await fetch(encodeURI("/api/discord/createDM"), {
  //       method: "POST",
  //       body: JSON.stringify(requestBody),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     });
  //     const jsonData: CreateDMApiResponse = await response.json();

  //     console.log(jsonData.status);
  //     if (jsonData.status === "Done") {
  //       console.log("done");
  //     } else {
  //       console.log("not done");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  if (!member) return null;

  return (
    <div className={`h-80`}>
      {isMessageSent ? (
        <div className={`flex flex-col items-center justify-center`}>
          <TextHeading3 className={`mt-24`}>
            Message sent successfully!
          </TextHeading3>
        </div>
      ) : (
        <>
          {sendingMessage ? (
            <Loading title={`sending message...`} />
          ) : (
            <>
              <div className={`my-4 md:mr-28 md:flex md:justify-between`}>
                <div className={`font-Inter my-auto font-medium text-gray-700`}>
                  Select a Discord Server to Connect in
                </div>
                <ServerSelector
                  compareServerID={member?.serverID || []}
                  onChangeServer={(val) => setSelectedServer(val)}
                />
              </div>

              {isEmpty(selectedServer) ? null : (
                <>
                  {selectedServer?.channel?.forumID ? (
                    <>
                      <div className="rounded-xl border border-gray-300 py-4 px-3">
                        <div className="flex items-center ">
                          <Avatar
                            src={currentUser?.discordAvatar || ""}
                            alt={currentUser?.discordName || ""}
                            size={`sm`}
                          />
                          <TextHeading3 className="ml-3">
                            @{currentUser?.discordName}
                            <span className="pl-1 text-sm text-gray-400">
                              #{currentUser?.discriminator}
                            </span>
                          </TextHeading3>
                        </div>
                        <div className="mt-3">
                          <TextArea
                            rows={6}
                            value={message}
                            className={`border-none p-4`}
                            placeholder={`Start typing here...`}
                            customStyle={{ fontSize: "20px" }}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                        <div className="inline-block">
                          {!sendingMessage && (
                            <Button
                              disabled={message.length === 0 || sendingMessage}
                              variant="primary"
                              onClick={() => {
                                handleSendMessage();
                              }}
                            >
                              Send
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <TextHeading3 className={`mt-24`}>
                        Contact Server Admin to set up a channel for Eden
                      </TextHeading3>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};
