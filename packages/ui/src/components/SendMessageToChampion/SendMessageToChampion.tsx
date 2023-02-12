import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  Maybe,
  MutationAddNewChatArgs,
  Project,
  RoleType,
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

const SET_APPLY_TO_PROJECT = gql`
  mutation ($fields: changeTeamMember_Phase_ProjectInput!) {
    changeTeamMember_Phase_Project(fields: $fields) {
      _id
    }
  }
`;

export interface ISendMessageToChampionProps {
  project?: Maybe<Project>;
  role?: Maybe<RoleType>;
}

export const SendMessageToChampion = ({
  project,
  role,
}: ISendMessageToChampionProps) => {
  // console.log("project", project);
  // console.log("role", role);
  // console.log("member", member);

  const { currentUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const [selectedServer, setSelectedServer] = useState<ServerTemplate>({});

  const [addNewChat] = useMutation<any, MutationAddNewChatArgs>(ADD_NEW_CHAT);

  const [changeTeamMemberPhaseProject, {}] = useMutation(SET_APPLY_TO_PROJECT, {
    onCompleted: () => {
      toast.success("success");
      setTimeout(() => {
        setSendingMessage(false);
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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

    // console.log(jsonData);

    return jsonData;
  };

  const embededMessage = `
       Hello ${project?.champion?.discordName}, you just had a new interest form ${currentUser?.discordName} for the role ${role?.title}.
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

    please check out my profile on Eden
    https://eden-alpha-develop.vercel.app/profile/${currentUser?.discordName}
  `;

  const handleSendMessage = async () => {
    setSendingMessage(true);

    const { threadId } = await createThread({
      message: `<@${currentUser?._id}> <@${project?.champion?._id}>`,
      tagName: "Project Application",
      embedMessage: embededMessage,
      senderAvatarURL: currentUser?.discordAvatar!,
      senderName: `${currentUser?.discordName} - is interested in ${project?.title}`,
      channelId: selectedServer.channel?.forumID!,
      threadName: `Project Application -- ${project?.title}`,
      ThreadAutoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
      enableButton: true,
    });

    try {
      await createMessage({
        message: followUpMessage,
        channelId: selectedServer?.channel?.chatID!,
        thread: threadId,
      });

      if (currentUser?._id !== project?.champion?._id)
        await addNewChat({
          variables: {
            fields: {
              message: message,
              projectID: project?._id!,
              receiverID: project?.champion?._id!,
              senderID: currentUser?._id!,
              serverID: selectedServer?._id!,
              threadID: threadId,
            },
          },
          context: { serviceName: "soilservice" },
        });
    } catch (error) {
      console.log(error);
    } finally {
      setIsMessageSent(true);
      if (project?._id && project?.champion?._id && role?._id) {
        changeTeamMemberPhaseProject({
          variables: {
            fields: {
              projectID: project?._id,
              memberID: currentUser?._id,
              roleID: role?._id,
              phase: "engaged",
            },
          },
          context: { serviceName: "soilservice" },
        });
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  // if (!member) return null;

  return (
    <div className={``}>
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
              <div className="rounded-xl border border-gray-300 py-4 px-3">
                <TextHeading3 className={`mr-4`}>
                  Send message to @{project?.champion?.discordName} about the{" "}
                  {role?.title} Role
                </TextHeading3>
                <div className={`my-4 md:mr-28 md:flex md:justify-between`}>
                  <div
                    className={`font-Inter my-auto font-medium text-gray-700`}
                  >
                    Select a Discord Server to Connect in
                  </div>
                  <ServerSelector
                    compareServerID={project?.serverID || []}
                    onChangeServer={(val) => setSelectedServer(val)}
                  />
                </div>

                {isEmpty(selectedServer) ? null : (
                  <>
                    {selectedServer?.channel?.forumID ? (
                      <>
                        <div className="flex items-center ">
                          <Avatar
                            src={currentUser?.discordAvatar || ""}
                            alt={currentUser?.discordName || ""}
                            size={`sm`}
                          />
                          <TextHeading3 className="ml-3">
                            @{currentUser?.discordName}
                            {currentUser?.discriminator && (
                              <span className="pl-1 text-sm text-gray-400">
                                #{currentUser?.discriminator}
                              </span>
                            )}
                          </TextHeading3>
                        </div>
                        <div className="mt-3">
                          <TextArea
                            rows={6}
                            value={message}
                            className="border-none px-0"
                            placeholder="Start typing here"
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                        <div className="mt-3 text-center">
                          <div className="inline-block">
                            {!sendingMessage && selectedServer?._id && (
                              <Button
                                disabled={
                                  message.length === 0 || sendingMessage
                                }
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
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
