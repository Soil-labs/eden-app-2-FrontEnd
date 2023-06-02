// import { gql, useQuery } from "@apollo/client";
import { Members } from "@eden/package-graphql/generated";
import { PopoverScoreReason } from "@eden/package-ui";
import { FC, useEffect, useState } from "react";

import { PercentageAnalysis } from "../../../components/PercentageAnalysis";

// const CANDIDATE_NOTES_EDENAI = gql`
//   query ($fields: candidateNotesEdenAIInput!) {
//     candidateNotesEdenAI(fields: $fields) {
//       categoryName
//       reason
//     }
//   }
// `;

interface Props {
  member?: Members;
  candidate: any;
}

interface DatabaseItem {
  categoryName: string;
  title: string;
  score: number;
  reason: string;
  IDb: string;
}

// interface DatabaseProps = DatabaseItem[];

type meetingNotesType = DatabaseItem[];

export const ReportNotes: FC<Props> = ({ candidate }) => {
  const [meetingNotesData, setReportNotesData] = useState<{
    [key: string]: meetingNotesType;
  }>({});

  // const [items, setItems] = useState(data);

  // const handleScoreChange = (IDb: string, score: number) => {
  //   // Update the score for the item with the given IDb
  //   const updatedItems = items.map((item) =>
  //     item.IDb === IDb ? { ...item, score } : item
  //   );

  //   setItems(updatedItems);

  //   // Call the onScoreChange callback, if provided
  //   if (onScoreChange) {
  //     onScoreChange(IDb, score);
  //   }
  // };

  useEffect(() => {
    if (candidate?.compareCandidatePosition?.reportPassFail) {
      // const categories: meetingNotesType = [];
      const categories: { [key: string]: meetingNotesType } = {};

      candidate?.compareCandidatePosition?.reportPassFail.forEach(
        (item: DatabaseItem) => {
          if (!categories[item.categoryName]) {
            categories[item.categoryName] = [];
          }
          categories[item.categoryName].push(item);
        }
      );

      // console.log("categories w2= ", categories);

      setReportNotesData(categories);
    }

    // if (candidate?.compareCandidatePosition?.reportPassFail)
    //   setReportNotesData(candidate.compareCandidatePosition.reportPassFail);
  }, [candidate]);

  console.log("meetingNotesData = ", meetingNotesData);

  return (
    <>
      <div className=" ml-14 w-10/12 ">
        <PercentageAnalysis matchingMax={40} tabCategory="points" />
      </div>
      <div className="space-y-4 rounded-lg p-4 py-12">
        {/* Render each category */}
        {Object.entries(meetingNotesData).map(([categoryName, items]) => (
          <div key={categoryName}>
            <h2 className="text-lg font-medium">{categoryName}</h2>
            <ul className="list-disc space-y-2 pl-7">
              {/* Render each item in the category */}

              {items.map((item) => {
                const score = item.score || 0;
                const hasPassed = score >= 5;

                return (
                  // eslint-disable-next-line react/jsx-key
                  <PopoverScoreReason
                    question={{
                      score: item.score,
                      reason: item.reason,
                    }}
                  >
                    <li
                      key={item.IDb}
                      className="flex cursor-pointer items-center justify-between py-2 hover:bg-gray-200"
                      title={
                        item.title.trim().split(" ").slice(0, 25).join(" ") +
                        (item.title.split(" ").length > 25 ? "..." : "")
                      }
                      onClick={() => {
                        // handleScoreChange(item.IDb, newScore);
                      }}
                    >
                      <span className="mr-2">
                        •{" "}
                        {item.title.trim().split(" ").slice(0, 25).join(" ") +
                          (item.title.split(" ").length > 25 ? "..." : "")}
                      </span>
                      {hasPassed ? (
                        <span className="text-green-500">&#x2714;</span>
                      ) : (
                        <span className="text-red-500">&#x2718;</span>
                      )}
                    </li>
                  </PopoverScoreReason>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};
