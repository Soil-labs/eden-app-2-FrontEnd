import { useQuery } from "@apollo/client";
import { FIND_MEMBER } from "@eden/package-graphql";
import {
  SummaryQuestionType,
  TalentListType,
} from "@eden/package-graphql/generated";
import {
  Avatar,
  Badge,
  Button,
  CandidateTypeSkillMatch,
  EdenAiLetter,
  EdenChatTabNew,
  InfoTabNew,
  ListModeEnum,
} from "@eden/package-ui";
import { Tab } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";

import { ScorecardTabNew } from "./tabs/ScorecardTabNew";

type NodeDisplay = {
  nameRelevantNode: string;
  nameOriginalNode: string;
  score: number;
  color: string;
};

type relevantNodeObj = {
  [key: string]: {
    nodes: NodeDisplay[];
  };
};

export interface ICandidateInfoNewProps {
  memberID: string;
  percentage?: number | null;
  summaryQuestions?: SummaryQuestionType[];
  mostRelevantMemberNode?: relevantNodeObj;
  candidate?: CandidateTypeSkillMatch;
  onClose?: () => void;
  // eslint-disable-next-line no-unused-vars
  rejectCandidateFn?: (memberID: string) => void;
  // eslint-disable-next-line no-unused-vars
  approveCandidateFn?: (memberID: string) => void;
  // qualified?: "ACCEPTED" | "REJECTED" | undefined;
  handleCreateNewList?: () => void;
  talentListsAvailables?: TalentListType[];
  // eslint-disable-next-line no-unused-vars
  handleAddCandidatesToList?: (listID: string) => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  handleChkSelection?: (candidate: any) => void;
  listMode?: ListModeEnum;
  showAskEden?: boolean;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const CandidateInfoNew = ({
  memberID,
  mostRelevantMemberNode,
  candidate,
  listMode = ListModeEnum.edit,
  talentListsAvailables,
  handleAddCandidatesToList,
}: ICandidateInfoNewProps) => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [tabClicked, setTabClicked] = useState(false);

  const [letterType, setLetterType] = useState<
    "rejection" | "nextInterviewInvite" | ""
  >("");

  const handleRejectionLetter = () => {
    setLetterType("rejection");
    setIsOpen(true);
  };

  const tabRef = useRef<HTMLDivElement | null>(null);

  const handleSecondInterviewLetter = () => {
    setLetterType("nextInterviewInvite");
    setIsOpen(true);
  };

  const { data: dataMember } = useQuery(FIND_MEMBER, {
    variables: {
      fields: {
        _id: memberID,
      },
    },
    skip: !Boolean(memberID),
    ssr: false,
  });

  const categoryNames = ["Skills", "Behavior", "Values"];

  const tabs = [
    {
      tab: "Background",
      Content: () => (
        <InfoTabNew
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          mostRelevantMemberNode={mostRelevantMemberNode}
          candidate={candidate}
        />
      ),
    },
    {
      tab: "Scorecard",
      Content: () => <ScorecardTabNew candidate={candidate} />,
    },
    {
      tab: "Transcript",
      Content: () => (
        <EdenChatTabNew
          member={dataMember?.findMember}
          memberImg={dataMember?.findMember.discordAvatar}
          conversationID={candidate?.conversationID || undefined}
        />
      ),
    },
  ];

  type Grade = {
    letter: string;
    color: string;
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

  useEffect(() => {
    if (tabClicked) {
      if (index === 1) setTimeout(() => ScrollToTop(), 1000);
      else ScrollToTop();
      setTabClicked(false);
    }
  }, [index]);

  const ScrollToTop = () => {
    if (tabRef.current) {
      tabRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative h-full">
      <div className="scrollbar-hide eden-green-200 h-full overflow-y-scroll overscroll-y-contain">
        <section className="w-full flex-col">
          {/* ---- Header ---- */}
          <div>
            <div className="bg-edenGreen-600 flex p-8 pb-4">
              <div className="flex w-full flex-row">
                <div className="flex max-w-2xl flex-col pr-6 pt-1">
                  <div className="flex flex-row text-white">
                    <Avatar
                      src={dataMember?.findMember.discordAvatar!}
                      size={`xl`}
                    />
                    <div className="ml-6 flex flex-col">
                      <div className="font-Moret text-2xl leading-[33.6px]">
                        {dataMember?.findMember?.discordName}
                      </div>
                      <div className="text-xs leading-[16.8px]">
                        {dataMember?.findMember?.oneLiner}
                      </div>
                      <div className="mt-3 flex flex-row items-center gap-2">
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.52148 19.9387L6.52148 18.9385"
                            stroke="#F9E1ED"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M18.5205 19.9162L17.5195 18.916"
                            stroke="#F9E1ED"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M5.49805 6.93848L6.49805 7.93768"
                            stroke="#F9E1ED"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M18.4991 6.91602L17.498 7.91621"
                            stroke="#F9E1ED"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12 21.416V22.4162"
                            stroke="#F9E1ED"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12 4.41602V5.41621"
                            stroke="#F9E1ED"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M4.04501 13.416H3"
                            stroke="#F9E1ED"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M21.0001 13.416H19.9551"
                            stroke="#F9E1ED"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M12.4629 10.1079L13.2288 11.6404C13.3048 11.7912 13.4508 11.8953 13.6178 11.9196L15.3339 12.1658C15.6119 12.2027 15.8078 12.4586 15.7708 12.7359C15.7558 12.8497 15.7028 12.9558 15.6198 13.0356L14.3788 14.2275C14.2578 14.3442 14.2008 14.5125 14.2298 14.6789L14.5238 16.3621C14.5688 16.6424 14.3778 16.907 14.0968 16.9527C13.9858 16.9703 13.8728 16.9518 13.7738 16.8992L12.2418 16.1043C12.0908 16.0265 11.9108 16.0265 11.7598 16.1043L10.2268 16.8992C9.97583 17.0325 9.66284 16.9372 9.52984 16.6861C9.47784 16.5869 9.45883 16.4731 9.47683 16.3621L9.76983 14.6789C9.79983 14.5135 9.74385 14.3442 9.62185 14.2275L8.37984 13.0356C8.17884 12.841 8.17184 12.5199 8.36584 12.3175C8.44584 12.2348 8.55182 12.1813 8.66582 12.1667L10.3818 11.9196C10.5498 11.8962 10.6948 11.7921 10.7708 11.6413L11.5388 10.1079C11.6718 9.853 11.9848 9.7538 12.2398 9.8851C12.3348 9.9347 12.4129 10.0126 12.4629 10.1079Z"
                            stroke="#F9E1ED"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        {candidate?.scoreCardTotal &&
                          candidate?.scoreCardTotal.score != null && (
                            <div className="flex h-8 w-14 items-center justify-center rounded-md bg-white pb-px">
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
                          )}
                        <div className="flex flex-col">
                          <div className="text-md flex flex-row items-center gap-1">
                            Matchstimate
                            <svg
                              width="17"
                              height="18"
                              viewBox="0 0 17 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                opacity="0.4"
                                d="M2.47917 9C2.47917 12.5203 5.3331 15.375 8.85417 15.375C12.3752 15.375 15.2292 12.5203 15.2292 9C15.2292 5.47893 12.3752 2.625 8.85417 2.625C5.3331 2.625 2.47917 5.47893 2.47917 9Z"
                                stroke="#7FA294"
                                stroke-width="1.0625"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M8.85821 11.616V8.57046M8.85417 6.4176V6.3728"
                                stroke="#7FA294"
                                stroke-width="1.0625"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="text-[10px] tracking-[-0.266px]">
                            <u>Complete Company Profile</u> to unlock
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-edenPink-100 mt-4 flex h-[101px] min-w-[426px] flex-col rounded-lg p-4">
                    <div className="font-Moret text-edenGreen-600 flex flex-row text-base font-bold">
                      <div className="bg-edenGreen-300 mr-2 flex h-6 w-6 items-center justify-around rounded-full">
                        <svg
                          width="17"
                          height="16"
                          viewBox="0 0 17 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.5289 7.69874C0.724149 5.18624 1.66465 2.31449 4.3024 1.46474C5.6899 1.01699 7.2214 1.28099 8.3749 2.14874C9.46615 1.30499 11.0539 1.01999 12.4399 1.46474C15.0776 2.31449 16.0241 5.18624 15.2201 7.69874C13.9676 11.6812 8.3749 14.7487 8.3749 14.7487C8.3749 14.7487 2.8234 11.7277 1.5289 7.69874Z"
                            stroke="#00462C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.375 4.02515C12.1775 4.28465 12.7445 5.0009 12.8127 5.84165"
                            stroke="#00462C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                      {"What's exciting about them?"}
                    </div>
                    <div className="text-edenGray-700 text-xs leading-[16.8px] tracking-[-0.2228px]">
                      {
                        "They're a founder who's been operating in your space for the past 8 years. They showed  exceptional vision alignment, more so than most of the others. "
                      }
                    </div>
                  </div>
                </div>

                <div className="border-edenPink-200 mb-2 mt-8 flex min-w-[282px] flex-col justify-between border-l pl-5">
                  <div className="grid w-full grid-cols-3">
                    {candidate?.scoreCardCategoryMemories &&
                      candidate?.scoreCardCategoryMemories.length > 0 &&
                      candidate?.scoreCardCategoryMemories
                        .filter((category) => {
                          return (
                            category &&
                            (category.category === "TECHNICAL_SKILLS" ||
                              category.category === "BEHAVIOR" ||
                              category.category === "CORE_VALUES")
                          );
                        })
                        .map(
                          (category, index) =>
                            category && (
                              <div
                                key={`${category}`}
                                className="flex justify-center"
                              >
                                <div className="flex flex-col justify-center">
                                  <div className="text-edenPink-200 text-center text-sm">
                                    {categoryNames[index]}
                                  </div>
                                  <div className="flex h-8 w-14 items-center justify-center rounded-md bg-white pb-px">
                                    {category.score && (
                                      <span
                                        className={classNames(
                                          getGrade(category.score * 100).color,
                                          "text-md"
                                        )}
                                      >
                                        {getGrade(category.score * 100).letter}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                        )}
                  </div>
                  <div className="flex flex-row items-center">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.0102 21.7392C12.5103 21.7374 12.0156 21.6369 11.5546 21.4433C11.0937 21.2497 10.6755 20.9669 10.3242 20.6112C8.25757 18.5532 6.19624 16.4915 4.14024 14.4262C3.22926 13.5325 2.66779 12.3426 2.55724 11.0712C2.49024 10.3572 2.50122 8.39921 2.51622 6.62021L2.52123 5.96719C2.52995 5.09547 2.84212 4.25405 3.40404 3.58755C3.96596 2.92106 4.74253 2.47116 5.60024 2.31521C5.81624 2.27621 6.62422 2.2462 10.4002 2.2622H10.7182C11.4666 2.25344 12.209 2.39705 12.9001 2.68432C13.5912 2.9716 14.2166 3.39651 14.7382 3.93319C16.7836 5.97586 18.8266 8.01988 20.8672 10.0652C21.2224 10.4121 21.505 10.826 21.6987 11.283C21.8924 11.7401 21.9934 12.2311 21.9957 12.7275C21.9981 13.2239 21.9017 13.7158 21.7123 14.1746C21.5228 14.6334 21.2441 15.05 20.8922 15.4002C19.1542 17.1529 17.4089 18.8979 15.6562 20.6352C14.9551 21.3389 14.0036 21.7359 13.0102 21.7392ZM9.49825 3.7612C8.11225 3.7612 6.11222 3.7662 5.83522 3.7962C5.33019 3.89759 4.87499 4.16853 4.54506 4.56411C4.21513 4.9597 4.0303 5.45616 4.02123 5.97119L4.01622 6.63321C4.00622 7.80221 3.98525 10.2332 4.05025 10.9332C4.12807 11.8576 4.538 12.7226 5.20424 13.3682C7.25824 15.4349 9.31789 17.4949 11.3832 19.5482C11.5906 19.7661 11.8397 19.94 12.1158 20.0594C12.3919 20.1788 12.6892 20.2413 12.99 20.2432C13.2908 20.245 13.5888 20.1862 13.8664 20.0702C14.1439 19.9543 14.3952 19.7835 14.6052 19.5682C16.3552 17.8349 18.0969 16.0935 19.8302 14.3442C20.0455 14.1343 20.2163 13.883 20.3322 13.6056C20.4482 13.3281 20.507 13.0302 20.5051 12.7295C20.5033 12.4288 20.4408 12.1315 20.3214 11.8555C20.202 11.5795 20.0281 11.3304 19.8102 11.1232C17.7702 9.07786 15.7276 7.03452 13.6822 4.99319C13.2998 4.59539 12.8395 4.28069 12.3301 4.06872C11.8206 3.85675 11.273 3.75206 10.7212 3.7612H9.49825Z"
                        fill="#FAE7F1"
                      />
                      <path
                        d="M8.5537 10.6558C8.23697 10.6665 7.92134 10.6131 7.62576 10.4988C7.33017 10.3845 7.06072 10.2116 6.83361 9.9906C6.6065 9.76955 6.4264 9.50488 6.30413 9.21249C6.18187 8.9201 6.11997 8.60603 6.12212 8.28912C6.12428 7.97221 6.19047 7.65898 6.3167 7.36828C6.44294 7.07759 6.62662 6.8154 6.85671 6.59747C7.08681 6.37954 7.35858 6.21037 7.65569 6.10009C7.95281 5.98982 8.26915 5.94073 8.58572 5.95578H8.5967C8.90018 5.95702 9.2004 6.01856 9.47988 6.13684C9.75936 6.25512 10.0126 6.42778 10.2247 6.64477C10.4455 6.86583 10.6201 7.12852 10.7386 7.4176C10.857 7.70667 10.9169 8.0164 10.9147 8.32879C10.9081 8.9498 10.6562 9.54299 10.2139 9.97894C9.77154 10.4149 9.17475 10.6582 8.5537 10.6558ZM8.58071 7.45578C8.46601 7.45268 8.35187 7.47275 8.24511 7.5148C8.13835 7.55684 8.04116 7.61999 7.95937 7.70047C7.87759 7.78094 7.81289 7.87708 7.76913 7.98315C7.72537 8.08922 7.70345 8.20304 7.70471 8.31778C7.70609 8.53813 7.79494 8.74892 7.95171 8.90377C8.02992 8.98381 8.12321 9.04754 8.22619 9.0913C8.32917 9.13507 8.43982 9.15802 8.55172 9.15878C8.77502 9.15783 8.98917 9.07005 9.14892 8.91403C9.30867 8.75801 9.40148 8.54599 9.40771 8.32278C9.40839 8.20725 9.38623 8.09273 9.34246 7.98581C9.2987 7.87888 9.23419 7.78166 9.1527 7.69976C8.99645 7.55481 8.79534 7.46767 8.58273 7.45279L8.58071 7.45578Z"
                        fill="#FAE7F1"
                      />
                    </svg>
                    <p className="bg-edenGray-100 ml-[10px] rounded-lg px-[10px] py-[2px] text-xs leading-[16.8px] tracking-[-1.9%]">
                      Founder
                    </p>
                    <p className="bg-edenGray-100 ml-[10px] rounded-lg px-[10px] py-[2px] text-xs leading-[16.8px] tracking-[-1.9%]">
                      Bs in Computer Science
                    </p>
                  </div>
                  <div className="flex flex-row">
                    <svg
                      width="16"
                      height="21"
                      viewBox="0 0 16 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.34228 10.832H7.36328C6.77458 10.832 6.29788 11.3088 6.29788 11.8974C6.29788 12.4861 6.77458 12.9638 7.36328 12.9638H8.58138C9.17008 12.9638 9.64678 13.4405 9.64678 14.0292C9.64678 14.6178 9.17008 15.0946 8.58138 15.0946H6.60238M7.97168 15.0959V15.991M7.97168 9.9336V10.8365M4.81738 6.47656C6.92088 6.96012 9.02348 6.96012 11.1271 6.47656M2.66158 9.8764C3.35141 8.7283 4.09572 7.59873 4.81766 6.46815L2.84449 2.77576C2.84449 2.77576 2.9953 2.64635 3.37184 2.35446C4.49756 1.48269 5.72933 1.25696 7.06128 1.77458C8.33008 2.26787 9.61728 2.64149 10.995 2.56365C11.3959 2.5403 12.9341 2.33598 12.9341 2.33598L11.1273 6.46134C11.8493 7.59095 12.5916 8.7283 13.2815 9.8764C14.4159 11.764 15.5008 13.8695 14.6222 16.0606C13.5996 18.6117 10.6165 19.4582 7.97098 19.5C5.32652 19.4582 2.34342 18.6117 1.32084 16.0606C0.442248 13.8695 1.5271 11.764 2.66158 9.8764Z"
                        stroke="#FCEEF5"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p className="bg-edenPink-300 ml-[10px] rounded-lg px-[10px] py-[2px] text-xs leading-[16.8px] tracking-[-1.9%]">
                      {"$120K-$190K+equity"}
                    </p>
                    <p className="bg-edenPink-300 ml-[10px] rounded-lg px-[10px] py-[2px] text-xs leading-[16.8px] tracking-[-1.9%]">
                      {"Full-time"}
                    </p>
                  </div>
                  <div className="flex flex-row">
                    <svg
                      width="17"
                      height="21"
                      viewBox="0 0 17 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11 9.00051C11 7.61924 9.88076 6.5 8.50051 6.5C7.11924 6.5 6 7.61924 6 9.00051C6 10.3808 7.11924 11.5 8.50051 11.5C9.88076 11.5 11 10.3808 11 9.00051Z"
                        stroke="#FCEEF5"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.49951 19.5C7.30104 19.5 1 14.3984 1 9.06329C1 4.88664 4.3571 1.5 8.49951 1.5C12.6419 1.5 16 4.88664 16 9.06329C16 14.3984 9.69799 19.5 8.49951 19.5Z"
                        stroke="#FCEEF5"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p className="bg-edenPink-300 ml-[10px] rounded-lg px-[10px] py-[2px] text-xs leading-[16.8px] tracking-[-1.9%]">
                      {"Remote"}
                    </p>
                    <p className="bg-edenPink-300 ml-[10px] rounded-lg px-[10px] py-[2px] text-xs leading-[16.8px] tracking-[-1.9%]">
                      {"Chattanooga, TN"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div ref={tabRef} />
          </div>
        </section>
        <section className="mt-6 pb-20 ">
          {/* @TODO memoize tab group */}
          <Tab.Group
            defaultIndex={index}
            onChange={(index: number) => {
              setIndex(index);
              setTabClicked(true);
            }}
          >
            <Tab.List className="border-edenGreen-300 flex h-8 w-full justify-between border-b">
              {tabs.map(({ tab }, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    classNames(
                      "text-edenGreen-400 -mb-px w-full pb-2 text-xs",
                      selected
                        ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                        : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                    )
                  }
                >
                  {tab.toUpperCase()}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <div className="w-full">
                {tabs.map(({ Content }, index) => (
                  <Tab.Panel key={index}>
                    <div className="px-8 py-4">
                      <Content />
                    </div>
                  </Tab.Panel>
                ))}
              </div>
            </Tab.Panels>
          </Tab.Group>
        </section>
      </div>
      {dataMember?.findMember && (
        <section className="border-edenGray-100 absolute bottom-2 right-0 flex w-full items-center gap-4 border-t-2 px-4 pt-2">
          {!candidate?.status ? (
            <>
              {listMode !== ListModeEnum.list && (
                <Button
                  variant="secondary"
                  onClick={handleSecondInterviewLetter}
                >
                  Schedule 2nd interview
                </Button>
              )}

              {listMode !== ListModeEnum.list && (
                <Button
                  variant="tertiary"
                  className="bg-utilityRed text-utilityRed hover:bg-utilityRed bg-opacity-10 hover:bg-opacity-100 hover:text-white"
                  onClick={handleRejectionLetter}
                >
                  Reject candidate
                </Button>
              )}
            </>
          ) : (
            <>
              {candidate?.status === "ACCEPTED" && (
                <Badge
                  text="accepted"
                  className="!bg-edenGreen-400 text-white"
                  tooltip={false}
                />
              )}
              {candidate?.status === "REJECTED" && (
                <Badge
                  text="rejected"
                  className="!bg-utilityRed text-white"
                  tooltip={false}
                />
              )}
            </>
          )}

          {/* ask eden chat */}
          {/* {dataMember?.findMember && showAskEden && (
            <AskEdenPopUp
              memberID={dataMember?.findMember._id}
              service={AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION}
              placeholder='Ask me any question about the Candidate'
              title={`Ask Eden about ${dataMember?.findMember?.discordName}`}
            />
          )} */}
        </section>
      )}

      {isOpen && letterType && (
        <EdenAiLetter
          member={dataMember?.findMember}
          isModalOpen={isOpen}
          letterType={letterType}
          onClose={() => {
            setIsOpen(false);
          }}
          onSubmit={() => {
            handleAddCandidatesToList!(
              (letterType === "rejection"
                ? talentListsAvailables!.find(
                    (list) => list.name === "Rejected"
                  )!._id
                : talentListsAvailables!.find(
                    (list) => list.name === "Accepted"
                  )!._id)!
            );
          }}
        />
      )}
    </div>
  );
};
