import { gql, useQuery } from "@apollo/client";
import { SaasUserLayout } from "@eden/package-ui";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

import type { NextPageWithLayout } from "../_app";
Chart.register(CategoryScale);

const SHOW_CHART_STATE_VALUES = gql`
  query ($fields: showChartStateValuesInput) {
    showChartStateValues(fields: $fields) {
      timeStamp
      value
    }
  }
`;

const FIND_STATE_CHART_OPTIMAL_INFO = gql`
  query ($fields: findStateChartOptimalInfoInput) {
    findStateChartOptimalInfo(fields: $fields) {
      chartPoints
      chartMinDate
      chartMaxDate
      chartStartDate
      chartEndDate
    }
  }
`;

const ConnectTGPage: NextPageWithLayout = () => {
  const [chartData, setChartData] = useState<any>({});

  const [selectedValues, setSelectedValues] = useState<string>("HAPPINESS");

  // const [numberChartPoints, setNumberChartPoints] = useState<number>(8);
  // const [minDate, setMinDate] = useState<any>("2023-11-10T13:59:53.121Z");
  // const [maxDate, setMaxDate] = useState<any>("2023-11-14T13:59:53.121Z");
  const [numberChartPoints, setNumberChartPoints] = useState<number>(0);
  const [minDate, setMinDate] = useState<any>("");
  const [maxDate, setMaxDate] = useState<any>("");

  const [minDateTotalUser, setMinDateTotalUser] = useState<any>("");
  const [maxDateTotalUser, setMaxDateTotalUser] = useState<any>("");

  const {} = useQuery(FIND_STATE_CHART_OPTIMAL_INFO, {
    variables: {
      fields: {
        userID: "9302939402013",
        type: selectedValues,
      },
    },
    onCompleted: (data) => {
      console.log(
        "data.findStateChartOptimalInfo = ",
        data.findStateChartOptimalInfo
      );

      if (data?.findStateChartOptimalInfo) {
        if (data.findStateChartOptimalInfo?.chartPoints)
          setNumberChartPoints(data.findStateChartOptimalInfo.chartPoints);

        if (data.findStateChartOptimalInfo?.chartStartDate)
          setMinDate(data.findStateChartOptimalInfo.chartStartDate);

        if (data.findStateChartOptimalInfo?.chartEndDate)
          setMaxDate(data.findStateChartOptimalInfo.chartEndDate);

        if (data.findStateChartOptimalInfo?.chartMinDate) {
          const date = new Date(data.findStateChartOptimalInfo.chartMinDate);
          const formattedDate = `${date.getFullYear()}-${(
            "0" +
            (date.getMonth() + 1)
          ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

          setMinDateTotalUser(formattedDate);
        }

        if (data.findStateChartOptimalInfo?.chartMaxDate) {
          const date = new Date(data.findStateChartOptimalInfo.chartMaxDate);
          const formattedDate = `${date.getFullYear()}-${(
            "0" +
            (date.getMonth() + 1)
          ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

          setMaxDateTotalUser(formattedDate);
        }
      }
    },
  });

  const {
    // data: showChartData,
    // refetch: refetchChartData
  } = useQuery(SHOW_CHART_STATE_VALUES, {
    variables: {
      fields: {
        userID: "9302939402013",
        type: selectedValues,
        // startDate: "2023-11-10T13:59:53.121Z",
        startDate: minDate,
        // endDate: "2023-11-14T13:59:53.121Z",
        endDate: maxDate,
        numberChartPoints: numberChartPoints,
      },
    },
    skip: numberChartPoints == 0 || !minDate || !maxDate,
    onCompleted: (data) => {
      console.log("data", data);

      // take only the timeStamp on an array
      // const timeStampArray = data.showChartStateValues.map((item: any) => item.timeStamp)
      const timeStampArray = data.showChartStateValues.map((item: any) => {
        const date = new Date(item.timeStamp);

        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear().toString().slice(-2);

        return `${day}-${month}-${year}`;
      });

      console.log("timeStampArray", timeStampArray);

      const valueArray = data.showChartStateValues.map(
        (item: any) => item.value
      );

      const backgroundColorArray = valueArray.map(
        () => "rgba(54, 162, 235, 0.2)"
      );
      const borderColorArray = valueArray.map(() => "rgba(54, 162, 235, 1)");

      setChartData({
        labels: timeStampArray,
        datasets: [
          {
            label: "Energy",
            data: valueArray,
            backgroundColor: backgroundColorArray,
            borderColor: borderColorArray,
            borderWidth: 1,
          },
        ],
      });

      console.log("timeStampArray", timeStampArray);
    },
  });

  return (
    <>
      {/* ------------------- Chart Points -------------- */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <label style={{ marginRight: "10px" }}>Chart Points:</label>
        <input
          id="chartPoints"
          type="range"
          min="1"
          max="30"
          value={numberChartPoints}
          onChange={(e) => setNumberChartPoints(Number(e.target.value))}
          className="w-64 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
        <label style={{ marginLeft: "10px" }}>{numberChartPoints}</label>
      </div>
      {/* ------------------- Chart Points -------------- */}

      {/* ------------------- Type Chart -------------- */}
      <div>
        <label style={{ marginRight: "10px" }}>Select Values:</label>
        <select
          className="w-64 cursor-pointer bg-blue-500 hover:bg-blue-200 text-white font-bold py-2 px-6 rounded"
          value={selectedValues}
          onChange={(e) => setSelectedValues(e.target.value)}
        >
          <option value="ENERGY">Energy</option>
          <option value="HAPPINESS">Happiness</option>
          <option value="PRODUCTIVITY">Productivity</option>
          <option value="STRESS">Stress</option>
        </select>
      </div>
      {/* ------------------- Type Chart -------------- */}

      {/* ------------------- Date Picker -------------- */}
      <div>
        <label style={{ marginRight: "10px" }}>Min Date:</label>
        <input
          type="date"
          value={minDate}
          min={minDateTotalUser}
          max={maxDateTotalUser}
          onChange={(e) => setMinDate(e.target.value)}
        />
      </div>
      <div>
        <label style={{ marginRight: "10px" }}>Max Date:</label>
        <input
          type="date"
          value={maxDate}
          min={minDateTotalUser}
          max={maxDateTotalUser}
          onChange={(e) => setMaxDate(e.target.value)}
        />
      </div>
      {/* ------------------- Date Picker -------------- */}

      {/* ------------------- Chart -------------- */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {chartData && chartData?.labels?.length > 0 && (
          <Bar
            data={chartData}
            width={100}
            height={600}
            options={{
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 10,
                },
              },
            }}
          />
        )}
      </div>
      {/* ------------------- Chart -------------- */}
    </>
  );
};

ConnectTGPage.getLayout = (page) => <SaasUserLayout>{page}</SaasUserLayout>;

export default ConnectTGPage;
