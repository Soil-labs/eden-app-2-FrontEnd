import { AttributesType } from "@eden/package-graphql/generated";
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export interface IMember {
  memberInfo: {
    discordName: string;
    attributes: AttributesType;
  };
}
export interface ITeamAttributeChartProps {
  members: IMember[];
  options?: any;
}

const colors = [
  "#1abc9c60",
  // "#2ecc7160",
  // "#3498db60",
  // "#9b59b660",
  // "#34495e60",
  // "#f1c40f60",
  // "#e67e2260",
  // "#e74c3c60",
  // "#ecf0f160",
  // "#95a5a660",
  "FFD4B260",
  "FFF6BD60",
  "CEEDC760",
  "86C8BC60",
  "FD8A8A60",
  "F1F7B560",
  "A8D1D160",
  "9EA1D460",
];

export const TeamAttributeChart = ({
  members,
  options = {},
}: ITeamAttributeChartProps) => {
  const labels = Object.keys(members[0].memberInfo.attributes).map((attr) =>
    attr.split(" ")
  );
  const datasets = members.map(({ memberInfo }, i) => {
    return {
      label: memberInfo.discordName,
      data: Object.keys(memberInfo.attributes).map(
        (key) => memberInfo.attributes[key as keyof AttributesType]
      ),
      fill: true,
      backgroundColor: colors[i],
      borderColor: colors[i],
      pointBackgroundColor: colors[i],
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: colors[i],
    };
  });

  return (
    <Radar
      data={{
        labels,
        datasets,
      }}
      options={options}
    />
  );
};
