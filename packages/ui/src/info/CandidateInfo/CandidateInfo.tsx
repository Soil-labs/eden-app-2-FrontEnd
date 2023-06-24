import { useQuery } from "@apollo/client";
import { FIND_MEMBER } from "@eden/package-graphql";
import { SummaryQuestionType } from "@eden/package-graphql/generated";
import {
  AskEdenTab,
  Avatar,
  Button,
  CandidateTypeSkillMatch,
  EdenChatTab,
  GraphTab,
  InfoTab,
  MatchTab,
  MeetingNotes,
  ReportNotes,
  TextHeading3,
} from "@eden/package-ui";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";

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

export interface ICandidateInfoProps {
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
  qualified?: boolean;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const CandidateInfo = ({
  memberID,
  summaryQuestions,
  mostRelevantMemberNode,
  candidate,
  onClose,
  rejectCandidateFn,
  approveCandidateFn,
  qualified = false,
}: ICandidateInfoProps) => {
  const [index, setIndex] = useState(0);

  const router = useRouter();

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
        />
      ),
    },
    {
      tab: "Fit",
      Content: () => (
        <ReportNotes
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          candidate={candidate}
        />
      ),
    },
    {
      tab: "Interview Analysis",
      Content: () => (
        <MatchTab
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          summaryQuestions={summaryQuestions}
        />
      ),
    },
    {
      tab: "Skill Match",
      Content: () => (
        <GraphTab
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
        />
      ),
    },
    {
      tab: "Culture Fit",
      Content: () => (
        <MeetingNotes member={dataMember?.findMember} candidate={candidate} />
      ),
    },
    {
      tab: "Ask Eden",
      Content: () => (
        <AskEdenTab member={dataMember?.findMember} candidate={candidate} />
      ),
    },
    {
      tab: "Transcript",
      Content: () => (
        <EdenChatTab
          memberImg={dataMember?.findMember.discordAvatar}
          conversationID={candidate?.conversationID || undefined}
        />
      ),
    },
  ];

  const handleRejectCandidate = () => {
    rejectCandidateFn && rejectCandidateFn(memberID);
  };

  const handleApproveCandidate = () => {
    approveCandidateFn && approveCandidateFn(memberID);
  };

  return (
    <>
      <div className="font-Inter absolute z-20 h-40 w-full flex-col bg-white text-center">
        <FaChevronLeft
          className="absolute left-4 top-4 cursor-pointer text-gray-500 hover:text-gray-400"
          onClick={onClose}
        />
        <div className="grid w-full grid-cols-3 bg-white">
          <div className="col-1 mt-5 w-full py-2 text-center">
            {!router.pathname.includes("/talentlist") && !qualified ? (
              <div className="flex w-full justify-end">
                <Button
                  className="border-none bg-red-400 text-sm font-bold text-white hover:bg-red-500"
                  radius="pill"
                  onClick={handleRejectCandidate}
                >
                  REJECT
                </Button>
              </div>
            ) : null}
          </div>
          <div className="col-2 p-2 pb-1">
            <div className="flex w-full justify-center">
              <Avatar src={dataMember?.findMember.discordAvatar!} size={`lg`} />
            </div>
          </div>
          <div className="col-3 mt-5 w-full py-2 text-center text-sm">
            {!router.pathname.includes("/talentlist") && !qualified ? (
              <div className="flex w-full justify-start">
                <Button
                  variant="primary"
                  radius="pill"
                  className="border-none font-bold text-white"
                  onClick={handleApproveCandidate}
                >
                  APPROVE
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex w-full justify-center px-4">
          <TextHeading3 className="font-extrabold">
            {dataMember?.findMember?.discordName}
          </TextHeading3>
        </div>
        <TextHeading3 className="w-full justify-center px-4 !text-sm font-bold text-gray-400">
          {dataMember?.findMember?.memberRole?.title}
        </TextHeading3>
      </div>
      <div className="w-full bg-white">
        <Tab.Group
          defaultIndex={index}
          onChange={(index: number) => {
            console.log("Changed selected tab to:", index);
            setIndex(index);
          }}
        >
          <Tab.List className="absolute top-36 z-20 flex h-8  w-full justify-between bg-white text-lg">
            {tabs.map(({ tab }, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  classNames(
                    "pt-px text-[14px]",
                    selected
                      ? "border-b-soilGreen-700 w-full border-b-2 bg-lime-50 text-gray-600 outline-none"
                      : "font-avenir-roman w-full border-b-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <div className="relative top-44">
              {tabs.map(({ Content }, index) => (
                <Tab.Panel key={index}>
                  {/* <div className="h-[calc(100vh-17rem)]"> */}
                  {/* <div className="relative"> */}
                  <div className="abolute px-6">
                    <Content />
                  </div>
                  {/* </div> */}
                </Tab.Panel>
              ))}
            </div>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};
