import { CandidateType } from "@eden/package-graphql/generated";
import { Avatar, CutTextTooltip, ListModeEnum } from "@eden/package-ui";
import { ComponentPropsWithoutRef, FC, ReactNode } from "react";

type Grade = {
  letter: string;
  color: string;
};

interface CandidateTypeSkillMatch extends CandidateType {
  skillMatch: number;
  skillScore: number;
  letterAndColor?: {
    totalMatchPerc?: Grade;
    culture?: Grade;
    skill?: Grade;
    requirements?: Grade;
  };
  status?: "ACCEPTED" | "REJECTED" | undefined;
}

export type CandidatesListProps = {
  candidatesList: CandidateTypeSkillMatch[];
  // eslint-disable-next-line no-unused-vars
  fetchIsLoading: boolean;
  // eslint-disable-next-line no-unused-vars
  setRowObjectData: (candidate: CandidateTypeSkillMatch) => void;
  listMode?: ListModeEnum;
  candidateIDRowSelected?: string | null;
  // eslint-disable-next-line no-unused-vars
  handleChkSelection?: (candidate: CandidateTypeSkillMatch) => void;
  selectedIds?: string[];
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface InputGroupProps extends ComponentPropsWithoutRef<"td"> {
  extraCssClass?: string;
  textColor?: string;
  children: string | ReactNode;
}

const ColumnStyled: FC<InputGroupProps> = ({
  extraCssClass,
  children,
  textColor = "text-gray-900",
  ...otherProps
}) => (
  <td
    className={classNames("text-md px-2 py-1", textColor, extraCssClass || "")}
    {...otherProps}
  >
    {children}
  </td>
);

const getGrade = (percentage: number | null | undefined): Grade => {
  let grade: Grade = { letter: "", color: "" };

  if (!percentage && percentage !== 0) {
    grade = { letter: "?", color: "text-edenGray-500" };
    return grade;
  }

  if (percentage >= 90) {
    grade = { letter: "A+", color: "text-utilityGreen" };
  } else if (percentage >= 80) {
    grade = { letter: "A", color: "text-utilityGreen" };
  } else if (percentage >= 70) {
    grade = { letter: "B+", color: "text-utilityYellow" };
  } else if (percentage >= 60) {
    grade = { letter: "B", color: "text-utilityYellow" };
  } else if (percentage >= 50) {
    grade = { letter: "C+", color: "text-utilityOrange" };
  } else if (percentage >= 40) {
    grade = { letter: "C", color: "text-utilityOrange" };
  } else {
    grade = { letter: "D", color: "text-utilityRed" };
  }

  return grade;
};

export const CandidatesList = ({
  candidatesList,
  candidateIDRowSelected,
  setRowObjectData,
}: CandidatesListProps) => {
  const handleObjectDataSelection = (candidate: CandidateTypeSkillMatch) => {
    setRowObjectData(candidate);
  };

  return (
    <div className="w-full">
      {candidatesList.map((candidate) => (
        <button
          key={candidate.user?._id}
          className={`${
            candidate.user?._id === candidateIDRowSelected
              ? "border-edenGreen-600 border-2 shadow-md"
              : ""
          } bg-edenPink-300 hover:bg-edenPink-400 mb-2 flex h-24 w-full flex-row items-center justify-around rounded-lg hover:shadow-md`}
          onClick={() => handleObjectDataSelection(candidate)}
        >
          <ColumnStyled extraCssClass="border-r-0 pr-0 flex">
            <Avatar
              size="sm"
              src={candidate.user?.discordAvatar!}
              alt={`${candidate.user?.discordName!.trim()}-avatar`}
            />
          </ColumnStyled>
          <span className="w-32 max-w-[200px]">
            <CutTextTooltip
              className={"text-xl"}
              text={candidate.user?.discordName!}
            />
          </span>
          <ColumnStyled textColor="text-fuchsia-600 text-center w-14 h-8">
            {candidate.scoreCardTotal &&
              candidate.scoreCardTotal.score != null && (
                <div className="m-auto flex h-6 w-8 items-center justify-center rounded-md bg-white pb-px">
                  <span
                    className={classNames(
                      getGrade(candidate.scoreCardTotal.score * 100).color,
                      "text-md"
                    )}
                  >
                    {getGrade(candidate.scoreCardTotal.score * 100).letter}
                  </span>
                </div>
              )}
          </ColumnStyled>
        </button>
      ))}
    </div>
  );
};
