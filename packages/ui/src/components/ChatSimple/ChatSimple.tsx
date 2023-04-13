/* eslint-disable @next/next/no-img-element */
import "./styles.css";

import { useEffect, useRef, useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { HiPencil } from "react-icons/hi";

import { Card } from "../..";

export interface IChatSimple {
  chatN?: any;
  handleSentMessage?: any;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const ChatSimple = ({ chatN, handleSentMessage }: IChatSimple) => {
  const componentRef = useRef<any>(null);
  const Users: any = {
    "01": {
      name: "EdenAI",
      img: "https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg",
    },
    "02": {
      name: "User",
      img: "https://cdn.discordapp.com/avatars/961730944170090516/e5844ca759a74e995027a0e50c5cb1bf.png",
    },
  };

  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    // Keep the scroll position at the bottom of the component
    componentRef.current.scrollTop = componentRef.current.scrollHeight;
    // console.log(
    //   "componentRef.current.scrollHeight = ",
    //   componentRef.current.scrollHeight
    // );
  });

  // console.log("chatN = ", chatN);

  return (
    <>
      <div className="flex h-full flex-col justify-between">
        <div className="h-[calc(100%-38px)] py-4">
          <Card border shadow className="h-full overflow-scroll bg-white">
            <div
              ref={componentRef}
              // className="h-full overflow-y-auto bg-white p-4"
              className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-col space-y-4 p-3"
            >
              {/* <div className="p:2 flex h-screen flex-1 flex-col justify-between sm:p-6"> */}
              {/* <p className="text-lg font-bold">Message Title</p> */}
              <div className="my-4">
                {chatN && chatN.length ? (
                  chatN.map((chat: any, index: any) => (
                    <div className="chat-message p-2" key={index}>
                      <div
                        className={classNames(
                          chat.user == "01" ? "" : "justify-end",
                          "flex items-start"
                        )}
                      >
                        <div
                          className={classNames(
                            chat.user == "01" ? "order-2" : "order-1",
                            "mx-2 flex max-w-[78%] flex-col items-start space-y-2 text-xs"
                          )}
                        >
                          <span
                            // className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600"
                            className={classNames(
                              chat.user == "01"
                                ? "rounded-tl-none border border-[#D1E4EE] bg-[#EDF2F7]"
                                : "rounded-tr-none border border-[#BDECF6] bg-[#D9F5FD]",
                              "inline-block whitespace-pre-wrap rounded-lg px-4 py-2"
                            )}
                          >
                            {chat.message}
                          </span>
                        </div>
                        <img
                          src={Users[chat.user]?.img}
                          alt="My profile"
                          className="order-1 h-6 w-6 rounded-full"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="mb-6 rounded-xl bg-lime-50 px-2 py-1">
                      <p className="text-center leading-tight">
                        Welcome to Eden!
                        <br />
                        <span className="text-sm">
                          What are you looking for?
                        </span>
                      </p>
                    </div>
                    <ul className="text-center text-sm text-slate-300">
                      <li className="mb-4">
                        • Eden can find an amazing talent
                        <br />
                        Tailored to your requirements
                      </li>
                      <li className="mb-4">
                        • New people are joining Eden network
                        <br />
                        everyday You can save your search and we’ll notify you
                        of a new match
                      </li>
                      <li className="mb-4">
                        • Can analyze your requests, from the
                        <br />
                        Most sophisticated, to the most high level
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        <Card
          border
          shadow
          className="flex h-[38px] items-center justify-between bg-white px-3"
        >
          <HiPencil className="mr-2 h-[30px] w-[30px]" />
          <input
            type="text"
            className="mr-2 w-full bg-transparent px-4 py-2"
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <div
            className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center"
            onClick={() => {
              handleSentMessage(inputMessage, "02");

              setInputMessage("");
            }}
          >
            <CiLocationArrow1 className="h-[24px] w-[24px] rotate-45" />
          </div>
          {/* <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={() => {
              handleSentMessage(inputMessage, "02");

              setInputMessage("");
            }}
          >
            Send
          </button> */}
        </Card>
      </div>
    </>
  );
};
