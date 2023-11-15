import { SaasUserLayout } from "@eden/package-ui";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";
import { Bar } from "react-chartjs-2";

import type { NextPageWithLayout } from "../_app";
Chart.register(CategoryScale);

const data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const ConnectTGPage: NextPageWithLayout = () => {
  return (
    <>
      <h1> hey</h1>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Bar
          data={data}
          width={100}
          height={600}
          options={{
            maintainAspectRatio: false,
          }}
        />
        {/* <a style={{ marginLeft: '10px' }}>Go to Second Page</a> */}
      </div>
    </>
  );
};

ConnectTGPage.getLayout = (page) => <SaasUserLayout>{page}</SaasUserLayout>;

export default ConnectTGPage;
