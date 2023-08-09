import { CandidateType } from "@eden/package-graphql/generated";
import {
  Avatar,
  Badge,
  CheckBox,
  Loading,
  TextHeading2,
} from "@eden/package-ui";
import clsx from "clsx";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  ComponentPropsWithoutRef,
  FC,
  ReactNode,
  use,
  useEffect,
  useState,
} from "react";

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
    className={clsx("text-md px-2 py-1", textColor, extraCssClass)}
    {...otherProps}
  >
    {children}
  </td>
);

type Grade = {
  letter: string;
  color: string;
};

// This can be refactored to util function and processed with useMemo inside the component
export interface CandidateTypeSkillMatch extends CandidateType {
  skillMatch: number;
  skillScore: number;
  flagSkill?: boolean;
  totalMatchPerc?: number;
  letterAndColor?: {
    totalMatchPerc?: Grade;
    culture?: Grade;
    skill?: Grade;
    requirements?: Grade;
  };
}

export enum ListModeEnum {
  "list" = "list",
  "creation" = "creation",
  "edit" = "edit",
  "selectable" = "selectable",
}

type CandidatesTableListProps = {
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

export const CandidatesTableList: FC<CandidatesTableListProps> = ({
  candidatesList,
  fetchIsLoading,
  setRowObjectData,
  candidateIDRowSelected = null,
  listMode = ListModeEnum.list,
  handleChkSelection,
  selectedIds,
}) => {
  const handleObjectDataSelection = (candidate: CandidateTypeSkillMatch) => {
    setRowObjectData(candidate);
  };
  // const [showMatchDetails, setShowMatchDetails] = useState(true);

  // console.log("candidatesList 00 0 = ", candidatesList);

  //@TODO this is a mock
  const getSkillsNumber = (letter: string) => {
    const randNum = Math.floor(Math.random() * 3);
    switch (letter) {
      case "A":
        return `${14 + randNum}/16`;
      case "B":
        return `${10 + randNum}/16`;
      case "C":
        return `${6 + randNum}/16`;
      case "D":
        return `${2 + randNum}/16`;
      default:
        return null;
    }
  };

  //start here

  return (
    <section className="bg-bgColor w-full overflow-hidden rounded-tl-md rounded-tr-md">
      <table className="w-full">
        <thead className="bg-edenGreen-100 text-edenGray-700 font-md text-xs font-normal">
          <tr className="h-10">
            {listMode !== ListModeEnum.list ? <th>{/* Select */}</th> : null}
            <th className="min-w-min pl-2 text-start font-normal">Name</th>
            <th className="font-normal">
              Fit Score
              {/* {showMatchDetails ? (
                <AiOutlineEyeInvisible
                  size={24}
                  className="ml-2 inline cursor-pointer text-gray-600 hover:text-gray-400"
                  onClick={() => setShowMatchDetails(false)}
                />
              ) : (
                <AiOutlineEye
                  size={24}
                  className="ml-2 inline cursor-pointer text-gray-600 hover:text-gray-400"
                  onClick={() => setShowMatchDetails(true)}
                />
              )} */}
            </th>
            {/* {showMatchDetails && (
              <th className={"py-2 font-medium"}>
                Requir.
              </th>
            )} */}
            <th className="font-normal">Culture Fit</th>
            <th className="font-normal">Skills</th>
            {/* <th className="py-2 pr-2 text-right font-medium">
              $/hour
            </th> */}
            {/* <th className="py-2 font-medium">Level</th> */}
            <th className="font-normal">Location</th>
            <th className="font-normal">Timezone</th>
          </tr>
        </thead>
        <tbody>
          {fetchIsLoading ? (
            <tr>
              <td colSpan={8} className="content-center py-2">
                <Loading />
              </td>
            </tr>
          ) : Boolean(candidatesList) ? (
            candidatesList.map((candidate, idx) => (
              <tr
                key={`${candidate.user?._id}-${idx}`}
                onClick={() => handleObjectDataSelection(candidate)}
                className={`${
                  candidateIDRowSelected === candidate.user?._id
                    ? "!bg-edenGreen-300"
                    : ""
                } hover:bg-edenGray-100 border-edenGray-100 group h-12 cursor-pointer border-b`}
              >
                {listMode !== ListModeEnum.list ? (
                  <ColumnStyled className="-mr-1 w-8 px-0 py-0">
                    <CheckBox
                      className="-mr-1 pl-2"
                      name={candidate.user?._id!}
                      checked={
                        selectedIds
                          ? selectedIds.includes(candidate.user?._id!)
                          : false
                      }
                      onChange={() =>
                        handleChkSelection && handleChkSelection(candidate)
                      }
                    />
                  </ColumnStyled>
                ) : null}
                <ColumnStyled extraCssClass="border-r-0 pr-0">
                  <div className="flex flex-nowrap items-center">
                    <Avatar
                      size="xs"
                      src={candidate.user?.discordAvatar!}
                      alt={`${candidate.user?.discordName!.trim()}-avatar`}
                    />
                    <span className="ml-2">{candidate.user?.discordName!}</span>
                  </div>
                </ColumnStyled>
                <ColumnStyled textColor="text-fuchsia-600 text-center">
                  {candidate.totalMatchPerc &&
                  candidate.letterAndColor?.totalMatchPerc ? (
                    <div className="border-edenGray-100 -my-4 mx-auto flex h-8 w-12 items-center justify-center rounded-[0.25rem] border">
                      <p
                        className={`${candidate.letterAndColor.totalMatchPerc.color}`}
                      >
                        {`${candidate.letterAndColor.totalMatchPerc.letter}`}
                      </p>
                    </div>
                  ) : null}
                </ColumnStyled>

                {/* {showMatchDetails && (
                  <ColumnStyled textColor="text-[#EDBFB7] text-center">
                    {candidate?.compareCandidatePosition
                      ?.CV_ConvoToPositionAverageScore ? (
                      <TextHeading2
                        className={classNames(
                          candidate?.letterAndColor?.requirements?.letter ==
                            "A" ||
                            candidate?.letterAndColor?.requirements?.letter ==
                              "B"
                            ? candidate?.letterAndColor?.requirements?.color
                            : "text-black",
                          "font-black"
                        )}
                      >
                        {`${candidate?.letterAndColor?.requirements?.letter}`}
                      </TextHeading2>
                    ) : (
                      <div></div>
                    )}
                  </ColumnStyled>
                )} */}
                <ColumnStyled textColor="text-[#86C8BC] text-center">
                  {candidate.overallScore ? (
                    <div className="border-edenGray-100 -my-4 mx-auto mx-auto flex h-8 w-12 items-center justify-center rounded-[0.25rem] border">
                      <p
                        className={classNames(
                          candidate?.letterAndColor?.requirements?.color
                            ? candidate?.letterAndColor?.requirements?.color
                            : "text-edenGray-600"
                        )}
                      >
                        {`${candidate?.letterAndColor?.requirements?.letter}`}
                      </p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </ColumnStyled>

                <ColumnStyled textColor="text-[#86C8BCaaa] text-center">
                  {candidate.skillMatch || candidate.skillScore ? (
                    <p
                      className={classNames(
                        candidate?.letterAndColor?.skill?.color
                          ? candidate?.letterAndColor?.skill?.color
                          : "text-edenGray-600"
                      )}
                    >
                      {candidate?.letterAndColor?.skill?.letter &&
                        getSkillsNumber(
                          candidate?.letterAndColor?.skill?.letter
                        )}
                    </p>
                  ) : (
                    <div></div>
                  )}
                </ColumnStyled>

                {/* <ColumnStyled extraCssClass="pr-2 text-right">
                  {candidate.user?.budget?.perHour ? (
                    <TextHeading2 className="font-black text-yellow-500">
                      ${candidate.user?.budget?.perHour}
                    </TextHeading2>
                  ) : // <span className="text-gray-400">-</span>
                  null}
                </ColumnStyled>
                <ColumnStyled extraCssClass="text-center">
                  {candidate?.user?.experienceLevel?.total ? (
                    <Badge
                      colorRGB="153,255,204"
                      tooltip={false}
                      text={
                        candidate?.user.experienceLevel?.total
                          ? candidate?.user.experienceLevel?.total <= 3
                            ? "Junior"
                            : candidate?.user.experienceLevel?.total <= 6
                            ? "Mid"
                            : "Senior"
                          : "Entry"
                      }
                      cutText={9}
                    />
                  ) : null}
                </ColumnStyled> */}

                <ColumnStyled textColor="text-center" extraCssClass="w-auto">
                  {candidate.user?.location && (
                    <p className="text-sm">{candidate.user?.location}</p>
                  )}
                </ColumnStyled>

                <ColumnStyled textColor="text-center" extraCssClass="w-auto">
                  {candidate.user?.timeZone && (
                    <p className="text-sm">
                      {candidate.user?.timeZone &&
                      (candidate.user.timeZone.includes("+") ||
                        candidate.user.timeZone.includes("-"))
                        ? candidate.user.timeZone
                        : "GMT - 02:00"}
                    </p>
                    // <p className="text-sm">{candidate.user?.timeZone}</p>
                  )}
                </ColumnStyled>
              </tr>
            ))
          ) : (
            <tr>
              <ColumnStyled
                extraCssClass="text-center content-center py-2"
                textColor="black"
                colSpan={8}
              >
                No candidates found
              </ColumnStyled>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};
