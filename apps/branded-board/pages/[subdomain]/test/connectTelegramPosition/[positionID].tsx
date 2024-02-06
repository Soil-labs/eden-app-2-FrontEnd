/* eslint-disable react-hooks/rules-of-hooks */
import { gql, useMutation, useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
// import dynamic from "next/dynamic";
import React, { useState } from "react";

import type { NextPageWithLayout } from "../../../_app";

export const INITIATE_CONNECTION_TG = gql`
  mutation ($fields: initiateConnectionTelegramInput) {
    initiateConnectionTelegram(fields: $fields) {
      done
      _id
      name
      telegram
      telegramChatID
      authTelegramCode
    }
  }
`;

export const POSITION_DATA_CONNECTED_TG = gql`
  subscription ($fields: positionDataConnectedTGInput) {
    positionDataConnectedTG(fields: $fields) {
      _id
      conduct {
        telegram
        telegramChatID
        telegramConnectionCode
      }
    }
  }
`;

const connectTelegram: NextPageWithLayout = () => {
  const router = useRouter();
  const { positionID } = router.query;

  const [telegramAuthCode, setTelegramAuthCode] = useState<String>("");
  const [flagFinishTGconnection, setFlagFinishTGconnection] =
    useState<Boolean>(false);

  const [initiateConnectionTelegram, {}] = useMutation(INITIATE_CONNECTION_TG, {
    onCompleted({ initiateConnectionTelegram }) {
      console.log("data tl= ", initiateConnectionTelegram);

      if (initiateConnectionTelegram.authTelegramCode) {
        setTelegramAuthCode(initiateConnectionTelegram.authTelegramCode);
      }
    },
  });

  useSubscription(POSITION_DATA_CONNECTED_TG, {
    variables: {
      fields: {},
    },
    onData: ({ data }) => {
      console.log("data donki= ", data);
      if (data?.data?.positionDataConnectedTG) {
        if (data?.data?.positionDataConnectedTG?._id == positionID) {
          setFlagFinishTGconnection(true);
        }
      }
    },
  });

  const handleTelegramClick = () => {
    console.log("positionID = ", positionID);
    initiateConnectionTelegram({
      variables: {
        fields: {
          positionID: positionID,
        },
      },
    });
  };

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
        <main className="flex flex-col items-center">
          {flagFinishTGconnection == false && (
            <>
              <button
                onClick={handleTelegramClick}
                className="mb-4 rounded-md bg-blue-500 px-4 py-2 text-white shadow-lg"
              >
                Connect Telegram
              </button>

              {telegramAuthCode && (
                <>
                  <p className="text-lg text-gray-800">
                    Find Soil 🌱 on Telegram and click /start
                  </p>
                  <p className="text-gray-500">Number: ${telegramAuthCode}</p>
                </>
              )}
            </>
          )}

          {flagFinishTGconnection == true && (
            <>
              <p className="text-lg text-gray-800">Telegram Connected</p>
            </>
          )}
        </main>
      </div>
    </>
  );
};

export default connectTelegram;
