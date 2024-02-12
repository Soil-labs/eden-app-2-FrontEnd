import { useQuery } from "@apollo/client";
import { FIND_MEMBER } from "@eden/package-graphql";
import {
  SummaryQuestionType,
  TalentListType,
} from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AskEdenPopUp,
  Avatar,
  Badge,
  Button,
  CandidateTypeSkillMatch,
  EdenAiLetter,
  EdenChatTab,
  InfoTab,
  ListModeEnum,
  LongText,
} from "@eden/package-ui";
import { Tab } from "@headlessui/react";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

import { ScorecardSearchAlgoTab } from "./tabs/ScorecardSearchAlgoTab";

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

export interface ICandidateInfoTestSearchAlgoProps {
  memberID: string;
  percentage?: number | null;
  summaryQuestions?: SummaryQuestionType[];
  mostRelevantMemberNode?: relevantNodeObj;
  candidate?: CandidateTypeSkillMatch;
  scoreCardSearch?: any;
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

export const CandidateInfoTestSearchAlgo = ({
  memberID,
  mostRelevantMemberNode,
  candidate,
  scoreCardSearch,
  onClose,
  listMode = ListModeEnum.edit,
  // rejectCandidateFn,
  // approveCandidateFn,
  // handleChkSelection,
  talentListsAvailables,
  // handleCreateNewList,
  handleAddCandidatesToList,
  // qualified = undefined,
  showAskEden = true,
}: ICandidateInfoTestSearchAlgoProps) => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // console.log("memberID", memberID);

  const [letterType, setLetterType] = useState<
    "rejection" | "nextInterviewInvite" | ""
  >("");

  const handleRejectionLetter = () => {
    setLetterType("rejection");
    setIsOpen(true);
  };

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

  const tabs = [
    // {
    //   tab: "Notes",
    //   Content: () => (
    //     <>
    //       <MatchTab
    //         member={
    //           {
    //             ...candidate,
    //             user: dataMember?.findMember,
    //           } as CandidateTypeSkillMatch
    //         }
    //         summaryQuestions={summaryQuestions}
    //       />
    //       <MeetingNotes member={dataMember?.findMember} candidate={candidate} />
    //     </>
    //   ),
    // },
    {
      tab: "Background",
      Content: () => (
        <InfoTab
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
      Content: () => (
        <ScorecardSearchAlgoTab
          candidate={candidate}
          scoreCardSearch={scoreCardSearch}
        />
      ),
    },
    // {
    //   tab: "Fit",
    //   Content: () => (
    //     <ReportNotes
    //       member={
    //         {
    //           ...candidate,
    //           user: dataMember?.findMember,
    //         } as CandidateTypeSkillMatch
    //       }
    //       candidate={candidate}
    //     />
    //   ),
    // },

    // {
    //   tab: "Skill Match",
    //   Content: () => (
    //     <GraphTab
    //       member={
    //         {
    //           ...candidate,
    //           user: dataMember?.findMember,
    //         } as CandidateTypeSkillMatch
    //       }
    //       candidate={candidate}
    //     />
    //   ),
    // },
    // {
    //   tab: "Key Info",
    //   Content: () => (
    //     <MeetingNotes member={dataMember?.findMember} candidate={candidate} />
    //   ),
    // },
    {
      tab: "Transcript",
      Content: () => (
        <EdenChatTab
          member={dataMember?.findMember}
          memberImg={dataMember?.findMember.discordAvatar}
          conversationID={candidate?.conversationID || undefined}
        />
      ),
    },
  ];

  // const handleRejectCandidate = () => {
  //   rejectCandidateFn && rejectCandidateFn(memberID);
  // };

  // const handleApproveCandidate = () => {
  //   approveCandidateFn && approveCandidateFn(memberID);
  // };

  return (
    <div className="relative h-full">
      <div className="scrollbar-hide h-full overflow-y-scroll	overscroll-y-contain bg-white">
        <section className="w-full flex-col">
          <div
            onClick={onClose}
            className="bg-edenGreen-100 hover:bg-edenGreen-200 absolute right-10 top-9 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md"
          >
            <IoClose color="#19563F" size={"1rem"} />
          </div>

          {/* ---- Header ---- */}
          <div>
            <div className="mb-6 flex p-8 pb-4">
              <div className="mr-3">
                <Avatar
                  src={dataMember?.findMember.discordAvatar!}
                  size={`md`}
                />
              </div>
              <div className="w-full">
                <h3 className="font-Unica text-edenGreen-600">
                  {dataMember?.findMember?.discordName}
                </h3>
                <div>
                  <p className="text-edenGray-700 text-xs">
                    <span>{dataMember?.findMember?.location}</span>
                    {dataMember?.findMember?.timeZone && " | "}
                    <span>{dataMember?.findMember?.timeZone}</span>
                  </p>
                </div>
                <div>
                  {dataMember?.findMember?.oneLiner ? (
                    <p className="text-edenGray-900 w-full whitespace-pre-wrap text-sm">
                      {dataMember?.findMember?.oneLiner}
                    </p>
                  ) : (
                    <LongText
                      cutText={80}
                      text={(dataMember?.findMember?.bio as string) || ""}
                      className={`text-edenGray-900 w-full whitespace-pre-wrap text-sm`}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pb-20">
          {/* @TODO memoize tab group */}
          <Tab.Group
            defaultIndex={index}
            onChange={(index: number) => {
              // console.log("Changed selected tab to:", index);
              setIndex(index);
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
              <div className="">
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
        <section className="border-edenGray-100 absolute bottom-0 right-0 flex h-20 w-full items-center gap-4 border-t-2 bg-white px-4">
          {/* ------- schedule live interview button ------- */}
          {!candidate?.status ? (
            <>
              {listMode !== ListModeEnum.list && (
                <Button
                  variant="secondary"
                  onClick={handleSecondInterviewLetter}
                >
                  Schedule live interview
                </Button>
              )}

              {/* ------- schedule 2nd interview button ------- */}
              {listMode !== ListModeEnum.list && (
                <Button
                  variant="tertiary"
                  className="bg-utilityRed text-utilityRed hover:bg-utilityRed bg-opacity-10 hover:bg-opacity-100 hover:text-white"
                  onClick={handleRejectionLetter}
                  // onClick={handleRejectCandidate}
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
          {dataMember?.findMember && showAskEden && (
            <AskEdenPopUp
              memberID={dataMember?.findMember._id}
              service={AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION}
              placeholder="Ask me any question about the Candidate"
              title={`Ask Eden about ${dataMember?.findMember?.discordName}`}
            />
          )}
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
            if (handleAddCandidatesToList)
              handleAddCandidatesToList!(
                (letterType === "rejection"
                  ? talentListsAvailables?.find(
                      (list) => list.name === "Rejected"
                    )?._id
                  : talentListsAvailables?.find(
                      (list) => list.name === "Accepted"
                    )?._id) || ""
              );
          }}
        />
      )}
    </div>
  );
};
