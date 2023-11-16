import { gql, useMutation } from "@apollo/client";
import { SaasUserLayout } from "@eden/package-ui";
import React, { useState } from "react";

import type { NextPageWithLayout } from "../_app";

const SAVE_STATE_VALUE = gql`
  mutation ($fields: saveStateValueInput!) {
    saveStateValue(fields: $fields) {
      userID
      name
      type
      value
      timeStamp
    }
  }
`;

const ConnectTGPage: NextPageWithLayout = () => {
  const [energy, setEnergy] = useState("");
  const [stress, setStress] = useState("");
  const [happiness, setHappiness] = useState("");

  const [saveStateData, {}] = useMutation(SAVE_STATE_VALUE, {});

  const saveToBackend = async () => {
    // Save input1, input2, input3 to the backend
    console.log(energy, stress, happiness);

    await saveStateData({
      variables: {
        fields: {
          userID: "9302939402012",
          type: "ENERGY",
          value: parseInt(energy),
        },
      },
    });

    await saveStateData({
      variables: {
        fields: {
          userID: "9302939402012",
          type: "STRESS",
          value: parseInt(stress),
        },
      },
    });

    await saveStateData({
      variables: {
        fields: {
          userID: "9302939402012",
          type: "HAPPINESS",
          value: parseInt(happiness),
        },
      },
    });
  };

  return (
    <>
      <form>
        <div className="grid gap-6 mb-6 md:grid-cols-2 p-6">
          <label className="block mb-2 text-xl font-medium text-gray-900 dark:text-black">
            Flow of the Day
          </label>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Energy
            </label>
            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="5"
              required
              value={energy}
              onChange={(e) => setEnergy(e.target.value)}
            ></input>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Happiness
            </label>
            <input
              type="text"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="5"
              required
              value={happiness}
              onChange={(e) => setHappiness(e.target.value)}
            ></input>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
              Stress
            </label>
            <input
              type="text"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="5"
              required
              value={stress}
              onChange={(e) => setStress(e.target.value)}
            ></input>
          </div>
          <div style={{ padding: "10px" }}></div>
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
              saveToBackend();
              alert("Done ✅");
              setEnergy("");
              setStress("");
              setHappiness("");
            }}
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

ConnectTGPage.getLayout = (page) => <SaasUserLayout>{page}</SaasUserLayout>;

export default ConnectTGPage;
