import { CandidateType } from "@eden/package-graphql/generated";
import {
  Avatar,
  Badge,
  Button,
  CheckBox,
  Loading,
  TextField,
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
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import moment from "moment";
import Column from "../../components/DragDrop/Column";

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
  status?: "ACCEPTED" | "REJECTED" | undefined;
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
  const router = useRouter();
  const { positionID } = router.query;
  const [showMatchDetails, setShowMatchDetails] = useState(false);

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

  const interviewLink = `https://www.edenprotocol.app/interview/${positionID}`;

  return (
    <section className="bg-bgColor w-full overflow-hidden rounded-tl-md rounded-tr-md">
      <table className="w-full">
        <thead className="bg-edenGreen-100 text-edenGray-700 font-md text-xs font-normal">
          <tr className="h-10">
            {listMode !== ListModeEnum.list ? <th>{/* Select */}</th> : null}
            <th className="min-w-min pl-2 text-start font-normal">Name</th>
            <th className="font-normal">
              Fit Score
              {showMatchDetails ? (
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
              )}
            </th>
            {showMatchDetails && (
              <>
                <th className="font-normal">
                  Skills (
                  {
                    candidatesList[0]?.scoreCardCategoryMemories?.filter(
                      (_category) =>
                        _category && _category.category === "TECHNICAL_SKILLS"
                    )[0]?.priority
                  }
                  )
                </th>
                <th className="font-normal">
                  Experience (
                  {
                    candidatesList[0]?.scoreCardCategoryMemories?.filter(
                      (_category) =>
                        _category && _category.category === "EXPERIENCE"
                    )[0]?.priority
                  }
                  )
                </th>
                <th className="font-normal">
                  Behavior (
                  {
                    candidatesList[0]?.scoreCardCategoryMemories?.filter(
                      (_category) =>
                        _category && _category.category === "BEHAVIOR"
                    )[0]?.priority
                  }
                  )
                </th>
                <th className="font-normal">
                  Values (
                  {
                    candidatesList[0]?.scoreCardCategoryMemories?.filter(
                      (_category) =>
                        _category && _category.category === "CORE_VALUES"
                    )[0]?.priority
                  }
                  )
                </th>
              </>
            )}
            {/* <th className="font-normal">Technical Skills</th>
            <th className="font-normal">Experience</th>
            <th className="font-normal">Behavior</th>
            <th className="font-normal">Core Values</th> */}
            {/* <th className="py-2 pr-2 text-right font-medium">
              $/hour
            </th> */}
            {/* <th className="py-2 font-medium">Level</th> */}
            <th className="font-normal">Location</th>
            <th className="font-normal">Timezone</th>
            <th className="font-normal">Application date</th>
            <th className="font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {fetchIsLoading ? (
            <tr>
              <td colSpan={8} className="content-center py-2">
                <Loading />
              </td>
            </tr>
          ) : Boolean(candidatesList.length) ? (
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
                      alt={`${candidate.user?.discordName?.trim()}-avatar`}
                    />
                    <span className="ml-2">{candidate.user?.discordName!}</span>
                  </div>
                </ColumnStyled>

                <ColumnStyled textColor="text-fuchsia-600 text-center">
                  {candidate.scoreCardTotal &&
                    candidate.scoreCardTotal.score != null && (
                      // <div className='p-auto'>
                      <div className="bg-edenPink-300 m-auto flex h-6 w-8 items-center justify-center rounded-md pb-px">
                        <span
                          className={classNames(
                            getGrade(candidate.scoreCardTotal.score * 100)
                              .color,
                            "text-md"
                          )}
                        >
                          {
                            getGrade(candidate.scoreCardTotal.score * 100)
                              .letter
                          }
                        </span>
                      </div>
                      // </div>
                    )}
                </ColumnStyled>

                {showMatchDetails && (
                  <>
                    <ColumnStyled textColor="text-fuchsia-600 text-center">
                      {candidate.scoreCardCategoryMemories &&
                        candidate.scoreCardCategoryMemories.filter(
                          (_category, index) =>
                            _category &&
                            _category.category === "TECHNICAL_SKILLS"
                        ).length > 0 && (
                          // <div className='p-auto'>
                          <div className="border-edenGray-100 relative -my-4 flex h-8 w-12 items-center justify-center rounded-[0.25rem] border">
                            <span
                              className={classNames(
                                getGrade(
                                  candidate.scoreCardCategoryMemories.filter(
                                    (_category, index) =>
                                      _category &&
                                      _category.category === "TECHNICAL_SKILLS"
                                  )[0]?.score! * 100
                                ).color,
                                "text-md"
                              )}
                            >
                              {
                                getGrade(
                                  candidate.scoreCardCategoryMemories.filter(
                                    (_category, index) =>
                                      _category &&
                                      _category.category === "TECHNICAL_SKILLS"
                                  )[0]?.score! * 100
                                ).letter
                              }
                            </span>
                          </div>
                          // </div>
                        )}
                    </ColumnStyled>

                    <ColumnStyled textColor="text-fuchsia-600 text-center">
                      {candidate.scoreCardCategoryMemories &&
                        candidate.scoreCardCategoryMemories.filter(
                          (_category, index) =>
                            _category && _category.category === "EXPERIENCE"
                        ).length > 0 && (
                          <div className="border-edenGray-100 relative -my-4 flex h-8 w-12 items-center justify-center rounded-[0.25rem] border">
                            <span
                              className={classNames(
                                getGrade(
                                  candidate.scoreCardCategoryMemories.filter(
                                    (_category, index) =>
                                      _category &&
                                      _category.category === "EXPERIENCE"
                                  )[0]?.score! * 100
                                ).color,
                                "text-md"
                              )}
                            >
                              {
                                getGrade(
                                  candidate.scoreCardCategoryMemories.filter(
                                    (_category, index) =>
                                      _category &&
                                      _category.category === "EXPERIENCE"
                                  )[0]?.score! * 100
                                ).letter
                              }
                            </span>
                          </div>
                        )}
                    </ColumnStyled>
                    <ColumnStyled textColor="text-fuchsia-600 text-center">
                      {candidate.scoreCardCategoryMemories &&
                        candidate.scoreCardCategoryMemories.filter(
                          (_category, index) =>
                            _category && _category.category === "BEHAVIOR"
                        ).length > 0 && (
                          <div className="border-edenGray-100 relative -my-4 flex h-8 w-12 items-center justify-center rounded-[0.25rem] border">
                            <span
                              className={classNames(
                                getGrade(
                                  candidate.scoreCardCategoryMemories.filter(
                                    (_category, index) =>
                                      _category &&
                                      _category.category === "BEHAVIOR"
                                  )[0]?.score! * 100
                                ).color,
                                "text-md"
                              )}
                            >
                              {
                                getGrade(
                                  candidate.scoreCardCategoryMemories.filter(
                                    (_category, index) =>
                                      _category &&
                                      _category.category === "BEHAVIOR"
                                  )[0]?.score! * 100
                                ).letter
                              }
                            </span>
                          </div>
                        )}
                    </ColumnStyled>
                    <ColumnStyled textColor="text-fuchsia-600 text-center">
                      {candidate.scoreCardCategoryMemories &&
                        candidate.scoreCardCategoryMemories.filter(
                          (_category, index) =>
                            _category && _category.category === "CORE_VALUES"
                        ).length > 0 && (
                          <div className="border-edenGray-100 relative -my-4 flex h-8 w-12 items-center justify-center rounded-[0.25rem] border">
                            <span
                              className={classNames(
                                getGrade(
                                  candidate.scoreCardCategoryMemories.filter(
                                    (_category, index) =>
                                      _category &&
                                      _category.category === "CORE_VALUES"
                                  )[0]?.score! * 100
                                ).color,
                                "text-md"
                              )}
                            >
                              {
                                getGrade(
                                  candidate.scoreCardCategoryMemories.filter(
                                    (_category, index) =>
                                      _category &&
                                      _category.category === "CORE_VALUES"
                                  )[0]?.score! * 100
                                ).letter
                              }
                            </span>
                          </div>
                        )}
                    </ColumnStyled>
                  </>
                )}

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
                {/* <ColumnStyled textColor='text-[#86C8BC] text-center'>
                  {candidate?.letterAndColor &&
                  candidate?.letterAndColor?.requirements ? (
                    <div className='border-edenGray-100 -my-4 mx-auto mx-auto flex h-8 w-12 items-center justify-center rounded-[0.25rem] border'>
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

                <ColumnStyled textColor='text-[#86C8BCaaa] text-center'>
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
                </ColumnStyled> */}

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

                <ColumnStyled textColor="text-center" extraCssClass="w-auto">
                  {candidate.dateApply && (
                    <p className="text-sm">
                      {moment(Number(candidate.dateApply)).format("MMM Do")}
                    </p>
                  )}
                </ColumnStyled>
                <ColumnStyled textColor="text-center" extraCssClass="w-auto">
                  {candidate.status === "ACCEPTED" && (
                    <Badge
                      text="accepted"
                      className="!text-2xs !bg-edenGreen-400 text-white"
                      tooltip={false}
                    />
                  )}
                  {candidate.status === "REJECTED" && (
                    <Badge
                      text="rejected"
                      className="!text-2xs !bg-utilityRed text-white"
                      tooltip={false}
                    />
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
                <div className="flex flex-col items-center">
                  <Image
                    className="mb-4 mt-16"
                    alt="sleeping dashboard'
"
                    src="/sleeping-dashboard.png"
                    width={216}
                    height={83}
                  ></Image>
                  <h1>Your talent oasis awaits!</h1>
                  <p>
                    Fill your dashboard with stellar candidates by sharing the
                    interview link
                  </p>
                  <div className="items-center-center mt-6 flex w-7/12 space-x-2 ">
                    <div className="relative w-11/12 ">
                      <TextField
                        className="w-82 h-12 border-2 border-neutral-400 pl-10"
                        onChange={() => console.log("hi")}
                        value={interviewLink}
                      ></TextField>
                      <div className="absolute bottom-3 left-3 ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                          />
                        </svg>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      className="font-Unica h-12  w-fit  border-neutral-400 font-medium text-black "
                      onClick={() => {
                        navigator.clipboard.writeText(interviewLink);
                        toast.success("interview link copied to clipboard");
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          width={20}
                          height={20}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                          />
                        </svg>
                      </div>
                    </Button>
                  </div>
                </div>
              </ColumnStyled>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};
