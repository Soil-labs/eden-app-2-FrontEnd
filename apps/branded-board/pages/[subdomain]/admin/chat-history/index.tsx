import { useQuery } from "@apollo/client";
import {
  FIND_AVAILABLE_MEMBERS,
  FIND_CHAT_HISTORY,
} from "@eden/package-graphql";
import { ChatExternalApp, Members } from "@eden/package-graphql/generated";
import { BrandedSaasUserLayout, Button, Loading } from "@eden/package-ui";
import React, { useEffect, useMemo, useRef, useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

import { NextPageWithLayout } from "../../../_app";

const ChatHistory: NextPageWithLayout = () => {
  const [selectedMember, setSelectedMember] = useState<Members>();
  const [search, setSearch] = useState<string>("");
  const [members, setMembers] = useState<Members[]>([]);
  const [chatExternalAppData, setChatExternalAppData] = useState<
    ChatExternalApp[]
  >([]);

  const messageEndRef = useRef<any>();

  const { data: memberData, loading: memberDataIsLoading } = useQuery(
    FIND_AVAILABLE_MEMBERS,
    {
      variables: {
        fields: {
          _id: null,
        },
      },
      ssr: false,
      onCompleted: (data: any) => {
        const filteredMembers = data.findMembers.filter((member: Members) =>
          member.discordName?.toLowerCase().includes(search)
        );

        setMembers(filteredMembers);
      },
    }
  );

  const { loading: chatHistoryLoading } = useQuery(FIND_CHAT_HISTORY, {
    variables: {
      fields: {
        userID: selectedMember?._id,
        communicationAuthorType: "USER",
        lastNumMessages: 100,
      },
    },
    ssr: false,
    onCompleted: (data: any) => {
      setChatExternalAppData(data?.findLastNumMessagesChatExternalApp);
    },
  });

  const formatTime = (timestamp: string) => {
    const dateStr = timestamp.split("T")[0];
    const timeStr = timestamp.split("T")[1].split("Z")[0];

    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);

    const ampm = hour < 12 ? "AM" : "PM";
    const twelveHourFormat = hour % 12 || 12;

    const pastTime = new Date(timestamp);
    const currentTime = Date.now();

    const daysToDateBack = Math.floor(
      (currentTime - pastTime.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      (daysToDateBack > 1
        ? month + "/" + day + "/" + year
        : daysToDateBack === 1
        ? "Yesterday"
        : "Today") +
      " at " +
      twelveHourFormat +
      ":" +
      (minute < 10 ? "0" + minute : minute) +
      ampm
    );
  };

  const handleMemberClick = (member: Members) => {
    setSelectedMember(member);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  useMemo(() => {
    const filteredMembers = memberData?.findMembers?.filter((member: Members) =>
      member.discordName?.toLowerCase().includes(search)
    );

    setMembers(filteredMembers);
  }, [search, memberData]);

  useEffect(() => {
    if (messageEndRef.current)
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatExternalAppData]);

  return (
    <>
      <div className="flex h-screen flex-row justify-around gap-5 p-10">
        <div className="flex h-full flex-col justify-around gap-2">
          <input
            className="h-10 w-80 rounded-md border-2 p-2"
            placeholder="Search for the users..."
            onChange={(e) => handleInputChange(e)}
          ></input>
          <div className="scrollbar-hide mb-10 mt-5 flex h-[calc(100%-150px)] w-96 flex-col overflow-y-auto pb-20">
            {memberDataIsLoading ? (
              <Loading />
            ) : (
              !memberDataIsLoading &&
              members.length > 0 &&
              members.map((member: Members) => (
                <Button
                  key={member._id}
                  onClick={() => handleMemberClick(member)}
                  className="mt-1"
                  variant={
                    member._id === selectedMember?._id ? "secondary" : "primary"
                  }
                >
                  {member.discordName}
                </Button>
              ))
            )}
          </div>
        </div>
        <div className="border-edenGray-100 mr-20 flex w-[640px] flex-col rounded-md border">
          <section className="border-edenGray-100 flex h-[2.75rem] items-center border-b">
            <h3 className="text-edenGreen-600 w-full text-center">
              Interview with Eden AI
            </h3>
          </section>
          <section className="scrollbar-hide border-edenGray-100 transition-height h-full overflow-y-scroll border-b ease-in-out">
            <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-hide scrolling-touch flex h-full flex-col px-6 py-4">
              <div className="">
                {chatHistoryLoading ? (
                  <Loading />
                ) : chatExternalAppData && chatExternalAppData.length ? (
                  <>
                    {chatExternalAppData
                      .slice()
                      .reverse()
                      .map((chat: ChatExternalApp) => (
                        <div className="chat-message mb-4" key={chat._id}>
                          <div
                            className={classNames(
                              chat.senderRole === "assistant"
                                ? ""
                                : "justify-end",
                              "flex items-start"
                            )}
                          >
                            <div
                              className={classNames(
                                chat.senderRole === "assistant"
                                  ? "order-2"
                                  : "order-1",
                                "mx-2 flex max-w-[78%] flex-col items-start space-y-2 text-xs"
                              )}
                            >
                              <div className="relative flex flex-col">
                                <div>
                                  {chat.senderRole !== "assistant" && (
                                    <>
                                      <span className="text-edenGray-700 float-right text-xs font-semibold">
                                        {selectedMember?.discordName}
                                      </span>
                                    </>
                                  )}

                                  {chat.senderRole !== "user" && (
                                    <>
                                      <span className="text-edenGreen-600 text-sm font-semibold">
                                        Eden
                                      </span>
                                    </>
                                  )}
                                </div>

                                <span
                                  className={classNames(
                                    chat.senderRole === "assistant"
                                      ? "bg-edenPink-300"
                                      : "bg-edenGray-100",
                                    "inline-block whitespace-pre-wrap rounded-lg p-4 text-xs"
                                  )}
                                >
                                  {chat.message}
                                </span>
                                <div
                                  className={classNames(
                                    "absolute bottom-6 h-4 w-4 -rotate-45 rounded-sm",
                                    chat.senderRole === "assistant"
                                      ? "bg-edenPink-300 -left-[0.3rem]"
                                      : "bg-edenGray-100 -right-[0.3rem]"
                                  )}
                                ></div>
                                {chat.senderRole !== "assistant" && (
                                  <>
                                    <span className="self-end text-[10px] opacity-50">
                                      {formatTime(chat.timeStamp)}
                                    </span>
                                  </>
                                )}
                                {chat.senderRole !== "user" && (
                                  <>
                                    <span className="text-[10px] opacity-50">
                                      {formatTime(chat.timeStamp)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div ref={messageEndRef} />
                  </>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

ChatHistory.getLayout = (page: any) => (
  <BrandedSaasUserLayout>{page}</BrandedSaasUserLayout>
);

export default ChatHistory;
