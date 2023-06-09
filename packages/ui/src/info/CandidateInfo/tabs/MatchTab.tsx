import { gql, useQuery } from "@apollo/client";
import { Members, SummaryQuestionType } from "@eden/package-graphql/generated";
import {
  BackgroundMatchChart,
  Card,
  PopoverScoreReason,
  TeamAttributeChart,
  // TextHeading2,
  TextInputLabel,
  TextLabel1,
} from "@eden/package-ui";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { FC, useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { GoGraph } from "react-icons/go";
import { TbViewfinderOff } from "react-icons/tb";

import { PercentageAnalysis } from "../../../components/PercentageAnalysis";

const MEMBER_PIE_CHART_NODE_CATEGORY = gql`
  query ($fields: memberPieChartNodeCategoriesInput) {
    memberPieChartNodeCategories(fields: $fields) {
      categoryName
      percentage
    }
  }
`;

const MEMBER_RADIO_CHART_CHARACTER_ATTRIBUTES = gql`
  query ($fields: memberRadioChartCharacterAttributesInput) {
    memberRadioChartCharacterAttributes(fields: $fields) {
      attributeName
      score
      reason
    }
  }
`;

// const dataRadarchart = [
//   {
//     memberInfo: {
//       discordName: "Kwame",
//       attributes: {
//         Coordinator: 60,
//         DirectorTP: 70,
//         Helper: 70,
//         Inspirer: 80,
//         Motivator: 70,
//         Observer: 90,
//         Reformer: 50,
//         Supporter: 40,
//       },
//     },
//   },
// ];

ChartJS.register(ArcElement, Legend, Tooltip);

type Props = {
  member?: Members;
  summaryQuestions?: SummaryQuestionType[];
};

type BarChartQuestions = {
  questionID: string;
  questionContent: string;
  userPercentage: number;
  averagePercentage: number;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const MatchTab: FC<Props> = ({ member, summaryQuestions }) => {
  console.log("summaryQuestions = 22", summaryQuestions);

  const [dataBarChart, setDataBarChart] = useState<BarChartQuestions[]>([]);

  const [summaryQuestionSelected, setSummaryQuestionSelected] =
    useState<SummaryQuestionType>();

  console.log("member = ", member);

  interface ChartData {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  }

  const [pieChartData, setPieChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });

  const { loading: loadingPieNodeCategory } = useQuery(
    MEMBER_PIE_CHART_NODE_CATEGORY,
    {
      variables: {
        fields: {
          memberID: member?._id,
        },
      },
      skip: member?._id == undefined,
      onCompleted: (data) => {
        const labels = [];
        const dataPT = [];

        for (let i = 0; i < data.memberPieChartNodeCategories.length; i++) {
          const elementT = data.memberPieChartNodeCategories[i];

          labels.push(elementT.categoryName);

          dataPT.push(elementT.percentage);
        }

        setPieChartData({
          labels: labels,
          datasets: [
            {
              data: dataPT,
              backgroundColor: [
                "#FFD4B2",
                "#FFF6BD",
                "#CEEDC7",
                "#86C8BC",
                "#FD8A8A",
                "#F1F7B5",
                "#A8D1D1",
                "#9EA1D4",
              ],
            },
          ],
        });
      },
    }
  );

  type radiochartType = {
    memberInfo: {
      discordName: string;
      attributes: {
        [key: string]: number;
      };
    };
  };

  const [radioChart, setRadioChart] = useState<radiochartType[]>([]);

  const optionsRadar = {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      r: {
        suggestedMin: 30,
        suggestedMax: 100,
        ticks: {
          stepSize: 20, // Optional: Specify the step size between ticks
        },
      },
    },
  };

  const { loading: radioChartLoading } = useQuery(
    MEMBER_RADIO_CHART_CHARACTER_ATTRIBUTES,
    {
      variables: {
        fields: {
          memberID: member?._id,
        },
      },
      skip: member?._id == undefined,
      onCompleted: (data) => {
        interface attributesType {
          [key: string]: any;
        }
        const attributesT: attributesType = {};

        let averageScore = 0;
        let numT = 0;

        for (
          let i = 0;
          i < data.memberRadioChartCharacterAttributes.length;
          i++
        ) {
          const elementT: {
            attributeName: string;
            score: number;
            reason: string;
          } = data.memberRadioChartCharacterAttributes[i];

          if (elementT && elementT.attributeName) {
            const nameAtt = elementT.attributeName;

            // how to make maximum 11 letters on nameAtt
            // if (nameAtt.length > 11) {
            //   nameAtt = nameAtt.substring(0, 11) + "...";
            // }

            attributesT[nameAtt] = elementT.score;

            averageScore = averageScore + elementT.score;
            numT = numT + 1;
          }
        }

        averageScore = averageScore / numT;

        // male averageScore int
        averageScore = Math.round(averageScore);

        setRadioChart([
          {
            memberInfo: {
              discordName:
                member?.discordName + " - " + averageScore.toString() + "%" ??
                "",
              attributes: attributesT,
            },
          },
        ]);

        console.log("CHANGE Radio Chart", [
          {
            memberInfo: {
              discordName: member?.discordName ?? "",
              attributes: attributesT,
            },
          },
        ]);
      },
    }
  );

  console.log("radioChart = ", radioChart);

  useEffect(() => {
    const dataBarChartPr: BarChartQuestions[] = [];
    const dataBarChartMaxLength: number = 6;

    summaryQuestions?.forEach((question: any) => {
      console.log("question = ", question);

      if (question?.score && dataBarChartPr.length < dataBarChartMaxLength) {
        dataBarChartPr.push({
          questionID: question?.questionID,
          questionContent: question?.questionContentSmall,
          userPercentage: question?.score * 10,
          averagePercentage: 50, // change later to the average of users
        });
      }
    });

    setDataBarChart(dataBarChartPr);
  }, [summaryQuestions]);

  // const data = {
  //   labels: ["One", "Two", "Three"],
  //   datasets: [
  //     {
  //       data: [3, 6, 9],
  //       backgroundColor: ["aqua", "orangered", "purple"],
  //     },
  //   ],
  // };

  // const options = {
  //   scale: {
  //     ticks: {
  //       min: 0,
  //       max: 100,
  //     },
  //   },
  // };

  return (
    <div className="relative pb-4 pt-4">
      <PercentageAnalysis tabCategory="points" matchingMax={100} />
      <div className="mb-8 grid grid-cols-12">
        <div className="col-span-6 mb-4">
          <p className="mb-2 text-center">
            <TextLabel1>PieChart</TextLabel1>
          </p>
          {/* <Pie data={data} options={options} /> */}
          {!!loadingPieNodeCategory ? (
            <LoadingGraphData />
          ) : pieChartData.datasets[0]?.data.length > 0 ? (
            <Pie
              data={pieChartData}
              options={{
                layout: {
                  padding: 12,
                },
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          ) : (
            <NoGraphData />
          )}
        </div>
        <div className="col-span-6 mb-4">
          <p className="mb-2 text-center">
            <TextLabel1>Radar Chart</TextLabel1>
          </p>
          {/* <Pie data={data} options={options} /> */}
          {/* <TeamAttributeChart members={dataRadarchart} /> */}
          {radioChartLoading ? (
            <LoadingGraphData />
          ) : (
            <>
              {radioChart?.length > 0 ? (
                <div className="-mt-8">
                  <TeamAttributeChart
                    members={radioChart}
                    options={optionsRadar}
                  />
                </div>
              ) : (
                <NoGraphData />
              )}
            </>
          )}
        </div>
        <div className="col-span-2"></div>
        <div className="col-span-8">
          <p className="mb-4 text-center">
            <TextLabel1>Background match</TextLabel1>
          </p>
          {/* <BackgroundMatchChart
            memberName={member?.discordName ?? ""}
            backgroundMatchData={exampleData}
          /> */}
          {dataBarChart.length > 0 ? (
            <div className="h-[300px]">
              <BackgroundMatchChart
                memberName={member?.discordName ?? ""}
                backgroundMatchData={dataBarChart}
              />
            </div>
          ) : (
            <LoadingGraphData />
          )}
        </div>
        <div className="col-span-2"></div>
      </div>
      <p className="mb-2 text-center">
        <TextLabel1>INTERVIEW ANALYSIS</TextLabel1>
      </p>
      <div
        className={`mx-auto mb-2 grid grid-cols-4 gap-6`}
        // className={`mx-auto grid grid-cols-${
        //   summaryQuestions?.length === 1 ? 3 : summaryQuestions?.length
        // } gap-4`}
      >
        {summaryQuestions
          ? summaryQuestions.map((item, index) => (
              <div
                key={index}
                className={classNames(
                  "transition-scale z-10 h-full cursor-pointer rounded-3xl border-none bg-gray-50 shadow-sm ease-in-out hover:scale-[1.02] hover:bg-[#EDFEFF]",
                  summaryQuestionSelected?.questionID === item.questionID
                    ? "border-accentColor scale-[1.02] bg-lime-50"
                    : ""
                )}
                onClick={() => {
                  setSummaryQuestionSelected(item);
                  if (document) {
                    setTimeout(() => {
                      document
                        .getElementById("summary-question-chat")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 200);
                  }
                }}
              >
                <PopoverScoreReason question={item}>
                  <div className="flex min-h-[120px] flex-col items-center justify-between py-4">
                    <div className="mx-auto mb-2 flex h-10 justify-center">
                      <p className="text-center">
                        <p className="font-semibold">
                          {item.questionContentSmall?.replace(".", "")}
                        </p>
                      </p>
                    </div>
                    <div className="">
                      <div className="flex h-full items-center justify-center">
                        {!item.score ? (
                          <TextInputLabel className="mr-auto text-center text-xs text-black">
                            {item.answerContentSmall?.replace(".", "")}
                          </TextInputLabel>
                        ) : (
                          true
                        )}
                        {item.score ? (
                          <div className="ml-1 text-center text-lg font-bold leading-tight">
                            <div className="hidden text-[#12A321] text-[#8CE136] text-[#E40000] text-[#FF6847] text-[#FFCF25]"></div>
                            <p
                              className={classNames(
                                `text-${getPercentageColor(item.score * 10)}`
                              )}
                            >
                              {getPercentageText(item.score * 10)}
                            </p>
                          </div>
                        ) : //  : (
                        //   <TextInputLabel className="text-xs text-black">
                        //     {item.answerContentSmall.replace(".", "")}
                        //   </TextInputLabel>
                        // )
                        null}
                      </div>
                    </div>
                  </div>
                </PopoverScoreReason>
              </div>
            ))
          : null}
      </div>
      {/* <p className="text-soilHeading3 font-poppins mb-6 text-center font-black text-gray-400">
        CULTURE FIT
      </p>
      <div
        className={`mx-auto grid grid-cols-${
          summaryQuestions?.length || 4
        } gap-4`}
      >
        {summaryQuestions
          ? summaryQuestions?.map((item, index) => (
              <PopoverScoreReason size="lg" key={index} question={item}>
                <div className="hover:bg-blue-200">
                  <div className="mx-auto flex h-16 w-auto items-center justify-center">
                    <p className="text-center">
                      <TextLabel1 className="text-black">
                        {item.questionContentSmall.replace(".", "")}
                      </TextLabel1>
                    </p>
                  </div>
                  <div className="mx-auto flex items-center justify-center">
                    <p className="text-center">
                      <TextLabel1 className="text-soilPurple">
                        {item.answerContentSmall.replace(".", "")}
                      </TextLabel1>
                    </p>
                  </div>
                </div>
              </PopoverScoreReason>
            ))
          : null}
      </div> */}

      {summaryQuestionSelected &&
      summaryQuestionSelected.subConversationAnswer ? (
        <Card
          border
          shadow
          className="mx-auto my-4 max-h-fit max-w-lg overflow-scroll !border-gray-200 bg-white  pb-4"
        >
          <div
            id="summary-question-chat"
            className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrolling-touch flex flex-col space-y-4 p-3"
          >
            <div className="">
              {summaryQuestionSelected.subConversationAnswer.map(
                (conversation: any, index: number) => (
                  <>
                    <div className="chat-message p-2" key={index}>
                      <div
                        className={classNames(
                          conversation.role == "assistant" ? "" : "justify-end",
                          "flex items-start"
                        )}
                      >
                        <div
                          className={classNames(
                            conversation.role == "assistant"
                              ? "order-2"
                              : "order-1",
                            "mx-2 flex max-w-[78%] flex-col items-start space-y-2 text-xs"
                          )}
                        >
                          <span
                            // className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600"
                            className={classNames(
                              conversation.role == "assistant"
                                ? "rounded-tl-none border border-[#D1E4EE] bg-[#EDF2F7]"
                                : "rounded-tr-none border border-[#BDECF6] bg-[#D9F5FD]",
                              "inline-block whitespace-pre-wrap rounded-lg px-4 py-2"
                            )}
                          >
                            {conversation.content}
                          </span>
                        </div>
                        <img
                          src={
                            conversation.role == "assistant"
                              ? "https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg"
                              : member?.discordAvatar || ""
                          }
                          className="order-1 h-6 w-6 rounded-full"
                        />
                      </div>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

const getPercentageColor = (percentage: number) => {
  let color = "";

  if (percentage >= 90) {
    color = "[#12A321]";
  } else if (percentage >= 70) {
    color = "[#8CE136]";
  } else if (percentage >= 50) {
    color = "[#FFCF25]";
  } else if (percentage >= 40) {
    color = "[#FF6847]";
  } else {
    color = "[#E40000]";
  }

  return color;
};

const getPercentageText = (percentage: number) => {
  let text = "";

  if (percentage >= 90) {
    text = "very strong";
  } else if (percentage >= 70) {
    text = "strong";
  } else if (percentage >= 50) {
    text = "neutral";
  } else if (percentage >= 40) {
    text = "weak";
  } else {
    text = "very weak";
  }

  return text.toUpperCase();
};

export const LoadingGraphData: FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <GoGraph size={80} color="#e3e3e3" className="" />
      <p className="z-10 text-center text-gray-400">Loading data...</p>
    </div>
  );
};

export const NoGraphData: FC = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center py-8">
      <TbViewfinderOff size={50} color="#e3e3e3" className="" />
      <p className="z-10 text-center text-gray-400">No data found</p>
    </div>
  );
};
