import { gql, useMutation, useQuery } from "@apollo/client";
import {
  CREATE_NEW_TALENT_LIST,
  FIND_POSITION_LIGHT,
  MATCH_NODES_MEMBERS_AI4,
  UPDATE_TALENT_LIST_WITH_TALENT,
} from "@eden/package-graphql";
import {
  CandidateType,
  PrioritiesType,
  TalentListType,
  TalentType,
  TradeOffsType,
} from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  AskEdenPopUp,
  Avatar,
  Button,
  // CandidateInfo,
  CandidatesTableList,
  EdenIconExclamation,
  EdenTooltip,
  ListModeEnum,
  Loading,
  Modal,
  NodeList,
  SelectList,
  TextField,
  TrainQuestionsEdenAI,
} from "@eden/package-ui";
import { Tab } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useMemo, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { FaArrowRight, FaShare } from "react-icons/fa";
import { HiOutlineLink } from "react-icons/hi";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { IoMdAddCircle, IoMdRemoveCircle } from "react-icons/io";
import { MdCompare } from "react-icons/md";
import { toast } from "react-toastify";
import ReactTooltip from "react-tooltip";

const CandidateInfo = dynamic(
  () =>
    import(`@eden/package-ui/src/info/CandidateInfo/CandidateInfo`).then(
      (module) => module.CandidateInfo
    ),
  {
    ssr: false,
  }
);

import { NextPageWithLayout } from "../../../_app";

const CREATE_FAKE_USER_CV = gql`
  mutation CreateFakeUserCVnew($fields: createFakeUserCVnewInput) {
    createFakeUserCVnew(fields: $fields) {
      _id
      discordName
      discordAvatar
    }
  }
`;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

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
}

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

const PositionCRM: NextPageWithLayout = () => {
  const router = useRouter();
  const { positionID, slug, listID } = router.query;
  const { company } = useContext(CompanyContext);
  const { currentUser } = useContext(UserContext);

  const [approvedTalentListID, setApprovedTalentListID] = useState<string>("");
  const [rejectedTalentListID, setRejectedTalentListID] = useState<string>("");

  const [
    approvedTalentListCandidatesList,
    setApprovedTalentListCandidatesList,
  ] = useState<CandidateTypeSkillMatch[]>([]);

  const [
    rejectedTalentListCandidatesList,
    setRejectedTalentListCandidatesList,
  ] = useState<CandidateTypeSkillMatch[]>([]);

  const [quickActionButtonUsed, setQuickActionButtonUsed] =
    useState<boolean>(false);

  const [candidatesOriginalList, setCandidatesOriginalList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [candidatesUnqualifiedList, setCandidatesUnqualifiedList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [nodeIDsPosition, setNodeIDsPosition] = useState<string[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserScore, setSelectedUserScore] =
    useState<number | null>(null);
  const [selectedUserSummaryQuestions, setSelectedUserSummaryQuestions] =
    useState<any[]>([]);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [trainModalOpen, setTrainModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [talentListsAvailables, setTalentListsAvailables] = useState<
    TalentListType[]
  >([]);

  const [talentListSelected, setTalentListSelected] =
    useState<TalentListType>();

  useMemo(() => {
    let _listSelected;

    if (listID && !!talentListsAvailables.length) {
      _listSelected = talentListsAvailables.find((list) => list._id === listID);
    } else {
      _listSelected = talentListsAvailables.find((list) => list._id === "000");
    }

    setTalentListSelected(_listSelected);
  }, [listID, talentListsAvailables]);

  const [candidatesFromTalentList, setCandidatesFromTalentList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [addToListOpen, setAddToListOpen] = useState<boolean>(false);
  const [opportunityDetailsOpen, setOpportunityDetailsOpen] =
    useState<boolean>(false);
  const [bestPicksOpen, setBestPicksOpen] = useState<boolean>(true);

  const [newTalentListCandidatesIds, setNewTalentListCandidatesIds] = useState<
    string[]
  >([]);

  // const [talentListToShow, setTalentListToShow] = useState<TalentListType>();

  const [newTalentListNameInputOpen, setNewTalentListNameInputOpen] =
    useState<boolean>(false);

  const [newTalentListName, setNewTalentListName] = useState<string>("");

  const {
    data: findPositionData,
    loading: findPositionIsLoading,
    // error: findPositionError,
  } = useQuery(FIND_POSITION_LIGHT, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: !Boolean(positionID),
    ssr: false,
    onCompleted: (data: any) => {
      const talentListsNames: TalentListType[] =
        data.findPosition.talentList.map((list: TalentListType) => list);

      setTalentListsAvailables(talentListsNames);

      if (
        data.findPosition.candidates.length > 0 &&
        (data.findPosition.candidates[0]?.totalMatchPerc === undefined ||
          (data.findPosition.candidates[0]?.flagSkill !== true &&
            data.findPosition.candidates[0]?.skillMatch !== undefined))
      ) {
        // calculate the average score of the percentages for each candidatesList and save it on setCandidatesList
        const candidatesListWithSkillMatch = data.findPosition.candidates.map(
          (candidate: any) => {
            let totalMatchPerc = 0;
            let totalMatchPercCount = 0;

            let letterAndColor = {};

            let flagSkill = false;

            if (
              candidate?.skillMatch != undefined &&
              candidate?.skillMatch > 0
            ) {
              totalMatchPerc += candidate.skillMatch;
              totalMatchPercCount++;
              flagSkill = true;

              letterAndColor = {
                ...letterAndColor,
                skill: getGrade(candidate.skillMatch, false),
              };
            }

            if (candidate?.overallScore) {
              totalMatchPerc += candidate.overallScore;
              totalMatchPercCount++;

              letterAndColor = {
                ...letterAndColor,
                culture: getGrade(candidate.overallScore, false),
              };
            }

            if (candidate?.skillScore) {
              totalMatchPerc += candidate.skillScore;
              totalMatchPercCount++;

              letterAndColor = {
                ...letterAndColor,
                skill: getGrade(candidate.skillScore, false),
              };

              // candidate.skillMatch = candidate.skillScore;
            }

            if (
              candidate?.compareCandidatePosition
                ?.CV_ConvoToPositionAverageScore
            ) {
              totalMatchPerc +=
                candidate?.compareCandidatePosition
                  ?.CV_ConvoToPositionAverageScore;
              totalMatchPercCount++;

              letterAndColor = {
                ...letterAndColor,
                requirements: getGrade(
                  candidate?.compareCandidatePosition
                    ?.CV_ConvoToPositionAverageScore,
                  false
                ),
              };
            }

            console.log(
              "candidate?.compareCandidatePosition?.CV_ConvoToPositionAverageScore = ",
              candidate?.compareCandidatePosition
                ?.CV_ConvoToPositionAverageScore
            );
            console.log("letterAndColor = ", letterAndColor);

            totalMatchPerc = totalMatchPerc / totalMatchPercCount;

            totalMatchPerc = parseInt(totalMatchPerc.toFixed(1));

            letterAndColor = {
              ...letterAndColor,
              totalMatchPerc: getGrade(totalMatchPerc, true),
            };

            return {
              ...candidate,
              totalMatchPerc,
              flagSkill: flagSkill,
              letterAndColor,
            };
          }
        );

        console.log(
          "candidatesListWithSkillMatch = ",
          candidatesListWithSkillMatch
        );

        // sort the candidatesList by the totalMatchPerc
        const sortedCandidatesList = candidatesListWithSkillMatch.sort(
          (a: any, b: any) => {
            if (a.totalMatchPerc > b.totalMatchPerc) {
              return -1;
            }
            if (a.totalMatchPerc < b.totalMatchPerc) {
              return 1;
            }
            return 0;
          }
        );

        // setCandidatesList(sortedCandidatesList);

        // console.log("sortedCandidatesList = ", sortedCandidatesList);

        setCandidatesOriginalList(sortedCandidatesList);

        setCandidatesFromTalentList(sortedCandidatesList);

        // const rejectedCandidatesIDs = data.findPosition.talentList.find(
        //   (list: TalentListType) => list.name === "Rejected"
        // )?.talent.length
        //   ? data.findPosition.talentList
        //       .find((list: TalentListType) => list.name === "Rejected")
        //       ?.talent.map((candidate: any) => candidate?.user?._id)
        //   : [];

        // const approvedCandidatesIDs = data.findPosition.talentList.find(
        //   (list: TalentListType) => list.name === "Accepted"
        // )?.talent.length
        //   ? data.findPosition.talentList
        //       .find((list: TalentListType) => list.name === "Accepted")
        //       ?.talent.map((candidate: any) => candidate?.user?._id)
        //   : [];

        setCandidatesUnqualifiedList(
          sortedCandidatesList
          // .filter(
          //   (candidate: any) =>
          //     !rejectedCandidatesIDs.includes(candidate.user._id)
          // )
          // .filter(
          //   (candidate: any) =>
          //     !approvedCandidatesIDs.includes(candidate.user._id)
          // )
        );

        if (findPositionData?.findPosition?.talentList) {
          setApprovedTalentListID(
            findPositionData.findPosition.talentList.find(
              (list: TalentListType) => list.name === "Accepted"
            )?._id
          );

          setApprovedTalentListCandidatesList(
            findPositionData.findPosition.talentList.find(
              (list: TalentListType) => list.name === "Accepted"
            )?.talent
          );

          setRejectedTalentListID(
            findPositionData.findPosition.talentList.find(
              (list: TalentListType) => list.name === "Rejected"
            )?._id
          );

          setRejectedTalentListCandidatesList(
            findPositionData.findPosition.talentList.find(
              (list: TalentListType) => list.name === "Rejected"
            )?.talent
          );
        }
      }

      const questionPrep: Question[] = [];

      data.findPosition.questionsToAsk.map((question: any) => {
        if (question.question == null) {
        } else {
          questionPrep.push({
            _id: question.question._id,
            content: question.question.content,
            bestAnswer: question.bestAnswer,
          });
        }
      });

      const nodesID = data.findPosition?.nodes?.map((node: any) => {
        return node?.nodeData?._id;
      });

      setNodeIDsPosition(nodesID);

      setQuestions(questionPrep);
    },
  });

  // useEffect(() => {
  //   if (talentListToShow && talentListsAvailables.length) {
  //     setTalentListSelected(talentListToShow);
  //     // setNewTalentListName(talentListToShow?.name!);
  //   }
  // }, [talentListToShow, talentListsAvailables]);

  const handleRowClick = (user: CandidateTypeSkillMatch) => {
    if (user.user?._id) setSelectedUserId(user.user?._id);
    if (user.overallScore) setSelectedUserScore(user.overallScore);
    if (user.summaryQuestions)
      setSelectedUserSummaryQuestions(user.summaryQuestions);

    console.log("user.summaryQuestions = ", user.summaryQuestions);
  };

  const [updateSkillScore, setUpdateSkillScore] = useState<boolean>(false);

  // eslint-disable-next-line no-unused-vars
  const getGrade = (percentage: number, mainColumn: boolean): Grade => {
    let grade: Grade = { letter: "", color: "" };

    if (percentage >= 70) {
      grade = { letter: "A", color: "text-utilityGreen" };
    } else if (percentage >= 50) {
      grade = { letter: "B", color: "text-utilityYellow" };
    } else if (percentage >= 30) {
      grade = { letter: "C", color: "text-utilityOrange" };
      // if (mainColumn) grade = { letter: "C", color: "text-orange-300" };
      // else grade = { letter: "C", color: "text-black" };
    } else {
      grade = { letter: "D", color: "text-utilityRed" };
      // if (mainColumn) grade = { letter: "D", color: "text-red-300" };
      // else grade = { letter: "D", color: "text-black" };
    }

    return grade;
  };

  const [mostRelevantMemberNode, setMostRelevantMemberNode] =
    useState<relevantNodeObj>({});

  const {} = useQuery(MATCH_NODES_MEMBERS_AI4, {
    variables: {
      fields: {
        nodesID: nodeIDsPosition,
        positionID: positionID,
        membersIDallow: candidatesFromTalentList?.map((userData: any) => {
          return userData?.user?._id;
        }),
        weightModules: [
          { type: "node_Skill", weight: 70 },
          { type: "node_Category", weight: 20 },
          { type: "node_Group", weight: 5 },
          { type: "node_total", weight: 50 },
          { type: "budget_total", weight: 80 },
          { type: "availability_total", weight: 85 },
          { type: "experience_total", weight: 85 },
          { type: "everythingElse_total", weight: 50 },
        ],
      },
    },
    skip:
      // !findPositionData?.findPosition ||
      // candidatesFromTalentList.length == 0 ||
      // nodeIDsPosition.length == 0,
      updateSkillScore == false,

    onCompleted: (data) => {
      // from data.matchNodesToMembers_AI4 change it to an object with member._id as the key

      setUpdateSkillScore(false);

      // -------------- Get the Candidates of the page ------------
      const memberScoreObj: { [key: string]: number } = {};

      data.matchNodesToMembers_AI4.forEach((memberT: any) => {
        const keyN = memberT?.member?._id;

        if (memberScoreObj[keyN] == undefined) {
          memberScoreObj[keyN] = memberT?.matchPercentage?.totalPercentage;
        }
      });

      const candidatesNew: CandidateTypeSkillMatch[] = [];

      for (let i = 0; i < candidatesFromTalentList.length; i++) {
        const userID = candidatesFromTalentList[i]?.user?._id;

        if (userID && memberScoreObj[userID]) {
          candidatesNew.push({
            ...candidatesFromTalentList[i],
            skillMatch: memberScoreObj[userID],
          });
        } else {
          candidatesNew.push({
            ...candidatesFromTalentList[i],
          });
        }
      }

      const _candidatesNew = candidatesNew.map((candidate: any) => {
        const _candidateWithSkillLetter = {
          ...candidate,
          letterAndColor: {
            ...candidate.letterAndColor,
            skill: getGrade(candidate.skillMatch, false),
          },
        };

        return _candidateWithSkillLetter;
      });

      const rejectedCandidatesIDs = rejectedTalentListCandidatesList.map(
        (candidate: any) => candidate?.user?._id
      );

      const approvedCandidatesIDs = approvedTalentListCandidatesList.map(
        (candidate: any) => candidate?.user?._id
      );

      setCandidatesUnqualifiedList(
        _candidatesNew
          .filter(
            (candidate: any) =>
              !rejectedCandidatesIDs.includes(candidate.user._id)
          )
          .filter(
            (candidate: any) =>
              !approvedCandidatesIDs.includes(candidate.user._id)
          )
      );

      // setCandidates(_candidatesNew);
      setCandidatesFromTalentList(_candidatesNew);

      // -------------- Get the Candidates of the page ------------

      // --------------- Find the related nodes Score and color -----------

      const mostRelevantMemberNodeT: relevantNodeObj = {};

      for (let i = 0; i < data?.matchNodesToMembers_AI4?.length; i++) {
        const infoN = data.matchNodesToMembers_AI4[i];

        const userID: string = infoN?.member?._id;

        if (userID && !mostRelevantMemberNodeT[userID]) {
          mostRelevantMemberNodeT[userID] = {
            nodes: [],
          };
        }

        const nodesPercentageT = infoN?.nodesPercentage;

        const nodesNew: NodeDisplay[] = [];

        interface RelevantMemberObj {
          [key: string]: boolean;
        }
        const mostRelevantMemberObj: RelevantMemberObj = {};

        const mostRelevantMemberNodes = [];

        for (let j = 0; j < nodesPercentageT?.length; j++) {
          const node = nodesPercentageT[j];

          // Take only the first mostRelevantMemberNodes, which has the heighers probability, later I can be more creative
          let mostRelevantMemberNode = null;

          if (
            node?.mostRelevantMemberNodes != undefined &&
            node?.mostRelevantMemberNodes?.length > 0
          ) {
            let i = 0;
            let relNode;

            while (
              mostRelevantMemberNode == null &&
              i < node?.mostRelevantMemberNodes.length
            ) {
              relNode = node?.mostRelevantMemberNodes[i];

              if (
                relNode?.node?._id != undefined &&
                !mostRelevantMemberObj[relNode?.node?._id]
              ) {
                mostRelevantMemberNode = relNode;
                mostRelevantMemberObj[relNode?.node?._id] = true;
              } else {
                i++;
              }
            }

            if (mostRelevantMemberNode == null) continue;
          }

          let colorT = "bg-purple-100";

          if (
            mostRelevantMemberNode?.score != null &&
            mostRelevantMemberNode?.score != undefined
          ) {
            if (mostRelevantMemberNode?.score > 60) {
              colorT = "bg-purple-500";
            } else if (mostRelevantMemberNode?.score > 30) {
              colorT = "bg-purple-400";
            } else if (mostRelevantMemberNode?.score > 13) {
              colorT = "bg-purple-300";
            } else if (mostRelevantMemberNode?.score > 5) {
              colorT = "bg-purple-200";
            }
          }

          mostRelevantMemberNodes.push({
            searchNode: node?.node,
            MemberRelevantnode: mostRelevantMemberNode?.node,
            score: mostRelevantMemberNode?.score,
            color: colorT,
          });

          nodesNew.push({
            nameOriginalNode: nodesPercentageT[j]?.node?.name,
            nameRelevantNode: mostRelevantMemberNode?.node?.name,
            score: mostRelevantMemberNode?.score,
            color: colorT,
          });
        }

        nodesNew.sort((a, b) => b.score - a.score); // sort based on score

        mostRelevantMemberNodeT[userID].nodes = nodesNew;
      }

      setMostRelevantMemberNode(mostRelevantMemberNodeT);

      // --------------- Find the related nodes Score and color -----------
    },
  });

  const [
    createTalentListPosition,
    { loading: createTalentListPositionLoading },
  ] = useMutation(CREATE_NEW_TALENT_LIST);

  const [
    updateUsersTalentListPosition,
    { loading: updateUsersTalentListPositionLoading },
  ] = useMutation(UPDATE_TALENT_LIST_WITH_TALENT, {
    onCompleted: (data, clientOptions) => {
      if (!quickActionButtonUsed) {
        const workingTalentListID =
          clientOptions?.variables?.fields.talentListID ===
            approvedTalentListID ||
          clientOptions?.variables?.fields.talentListID === rejectedTalentListID
            ? "000" // this is not the actual "working talent list" per se, but is the one to be redirected to
            : clientOptions?.variables?.fields.talentListID;

        if (workingTalentListID === "000") {
          if (
            clientOptions?.variables?.fields.talentListID ===
              approvedTalentListID ||
            clientOptions?.variables?.fields.talentListID ===
              rejectedTalentListID
          ) {
            const rejectedCandidatesIDs =
              data.updateUsersTalentListPosition.talentList
                .find((list: TalentListType) => list.name === "Rejected")
                ?.talent.map((candidate: any) => candidate?.user?._id);

            const approvedCandidatesIDs =
              data.updateUsersTalentListPosition.talentList
                .find((list: TalentListType) => list.name === "Accepted")
                ?.talent.map((candidate: any) => candidate?.user?._id);

            setCandidatesUnqualifiedList(
              candidatesOriginalList
                .filter(
                  (candidate: any) =>
                    !rejectedCandidatesIDs.includes(candidate.user._id)
                )
                .filter(
                  (candidate: any) =>
                    !approvedCandidatesIDs.includes(candidate.user._id)
                )
            );
            setCandidatesFromTalentList(
              candidatesOriginalList
                .filter(
                  (candidate: any) =>
                    !rejectedCandidatesIDs.includes(candidate.user._id)
                )
                .filter(
                  (candidate: any) =>
                    !approvedCandidatesIDs.includes(candidate.user._id)
                )
            );
            // setTalentListSelected({ _id: "000", name: "All candidates" });
            router.push(
              {
                pathname: `/${company?.slug}/dashboard/${positionID}`,
              },
              undefined,
              { shallow: true }
            );
          } else {
            setCandidatesFromTalentList(candidatesUnqualifiedList);
          }
        } else {
          const editedTalentListIndex =
            data?.updateUsersTalentListPosition.talentList.findIndex(
              (talentList: TalentListType) =>
                talentList._id === workingTalentListID
            );

          const editedTalentList: TalentListType =
            data?.updateUsersTalentListPosition.talentList[
              editedTalentListIndex
            ];

          const candidatesOnTalentListSelected: CandidateTypeSkillMatch[] = [];

          for (let i = 0; i < candidatesOriginalList.length; i++) {
            for (let j = 0; j < editedTalentList?.talent?.length!; j++) {
              if (
                candidatesOriginalList[i].user?._id ===
                editedTalentList?.talent![j]!.user!._id
              ) {
                candidatesOnTalentListSelected.push(candidatesOriginalList[i]);
              }
            }
          }

          setCandidatesFromTalentList(candidatesOnTalentListSelected);
          // setTalentListSelected(editedTalentList);
          router.push(
            {
              pathname: `/${company?.slug}/dashboard/${positionID}`,
              query: {
                listID: editedTalentList._id,
              },
            },
            undefined,
            { shallow: true }
          );
          setNewTalentListCandidatesIds([]);
        }
      } else {
        const rejectedCandidatesIDs =
          data.updateUsersTalentListPosition.talentList
            .find((list: TalentListType) => list.name === "Rejected")
            ?.talent.map((candidate: any) => candidate?.user?._id);

        const approvedCandidatesIDs =
          data.updateUsersTalentListPosition.talentList
            .find((list: TalentListType) => list.name === "Accepted")
            ?.talent.map((candidate: any) => candidate?.user?._id);

        setCandidatesUnqualifiedList(
          candidatesOriginalList
            .filter(
              (candidate: any) =>
                !rejectedCandidatesIDs.includes(candidate.user._id)
            )
            .filter(
              (candidate: any) =>
                !approvedCandidatesIDs.includes(candidate.user._id)
            )
        );

        setCandidatesFromTalentList(
          candidatesOriginalList
            .filter(
              (candidate: any) =>
                !rejectedCandidatesIDs.includes(candidate.user._id)
            )
            .filter(
              (candidate: any) =>
                !approvedCandidatesIDs.includes(candidate.user._id)
            )
        );

        setTalentListSelected({ _id: "000", name: "All candidates" });
      }
      setQuickActionButtonUsed(false);
    },
  });

  const handleTrainButtonClick = () => {
    // setTrainModalOpen(true);
    router.push(`/${slug}/dashboard/${positionID}/train-eden-ai`);
  };

  const [createFakeUserCV] = useMutation(CREATE_FAKE_USER_CV);

  const handleFindBestTalentClick = () => {
    // setTrainModalOpen(true);

    createFakeUserCV({
      variables: {
        fields: {
          positionID: positionID,
        },
      },
    });
  };

  const handleCloseTrainModal = () => {
    setTrainModalOpen(false);
  };

  const handleCalculateSkillScore = () => {
    // console.log("change = 232322");

    setUpdateSkillScore(true);
  };

  const handleSelectedTalentList = (list: TalentListType) => {
    if (!company) return;

    const candidatesOnTalentListSelected: CandidateTypeSkillMatch[] = [];

    // if (talentListToShow) {
    //   for (let i = 0; i < candidatesOriginalList.length; i++) {
    //     for (let j = 0; j < talentListToShow.talent!.length; j++) {
    //       if (
    //         candidatesOriginalList[i].user?._id ===
    //         talentListToShow.talent![j]!.user!._id
    //       ) {
    //         candidatesOnTalentListSelected.push(candidatesOriginalList[i]);
    //       }
    //     }
    //   }
    //   // setTalentListSelected(talentListToShow);
    //   router.push(
    //     {
    //       pathname: `/${company?.slug}/dashboard/${positionID}`,
    //       query: {
    //         listID: talentListToShow._id,
    //       },
    //     },
    //     undefined,
    //     { shallow: true }
    //   );
    //   setTalentListToShow(undefined);
    // } else
    if (list._id !== "000") {
      for (let i = 0; i < candidatesOriginalList.length; i++) {
        for (let j = 0; j < list.talent!.length; j++) {
          if (
            candidatesOriginalList[i].user?._id === list.talent![j]!.user!._id
          ) {
            candidatesOnTalentListSelected.push(candidatesOriginalList[i]);
          }
        }
      }
      // setTalentListSelected(list);
      router.push(
        {
          pathname: `/${company?.slug}/dashboard/${positionID}`,
          query: {
            listID: list._id,
          },
        },
        undefined,
        { shallow: true }
      );
    } else {
      candidatesOnTalentListSelected.push(...candidatesUnqualifiedList);
      // setTalentListSelected({ _id: "000", name: "All candidates" });
      router.push(
        {
          pathname: `/${company?.slug}/dashboard/${positionID}`,
        },
        undefined,
        { shallow: true }
      );
    }

    setNewTalentListCandidatesIds([]);

    setCandidatesFromTalentList(candidatesOnTalentListSelected);
  };

  const handleCreateNewList = () => {
    setNewTalentListNameInputOpen(true);

    setAddToListOpen(false);

    // setNewTalentListCandidatesIds(
    //   candidatesOriginalList.map((c) => c.user?._id!)
    // );

    // handleSaveNewTalentList();
  };

  const handleAddCandidatesToList = async (listID: string) => {
    setAddToListOpen(false);

    const _prevTalent = findPositionData?.findPosition.talentList
      .find((_list: any) => _list._id === listID)
      .talent.map((t: any) => t.user._id);

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: listID,
          usersTalentList: [
            ..._prevTalent,
            ...newTalentListCandidatesIds.filter(
              (t: any) => !_prevTalent.includes(t)
            ),
          ],
        },
      },
    });

    // toast.success("Candidate added to list!");
  };

  const handleRemoveCandidatesFromList = async (listID: string) => {
    const _prevTalent = findPositionData?.findPosition.talentList
      .find((_list: any) => _list._id === listID)
      .talent.map((t: any) => t.user._id);

    const _filteredTalent = _prevTalent.filter(
      (t: any) => !newTalentListCandidatesIds.includes(t)
    );

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: listID,
          usersTalentList: _filteredTalent,
        },
      },
    });

    toast.success("Candidates removed from list");
  };

  const handleCopyLink = () => {
    // const url = window.location.href;
    const url = window.location.origin + "/interview/" + positionID;

    navigator.clipboard.writeText(url);
    setNotificationOpen(true);
    setTimeout(() => {
      setNotificationOpen(false);
    }, 3000);
  };

  const handleCandidateCheckboxSelection = (candidate: CandidateType) => {
    setNewTalentListCandidatesIds((prev) => {
      const newCandidatesIds = [...prev];

      if (newCandidatesIds.includes(candidate.user?._id!)) {
        const index = newCandidatesIds.indexOf(candidate.user?._id!);

        newCandidatesIds.splice(index, 1);
      } else {
        newCandidatesIds.push(candidate.user?._id!);
      }

      return newCandidatesIds.filter((id) => id !== undefined || id !== null);
    });
  };

  const handleSaveNewTalentList = async () => {
    const result = await createTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          name: newTalentListName,
        },
      },
    });

    setNewTalentListNameInputOpen(false);
    setNewTalentListName("");
    const lastTalentListIndex =
      result.data?.createTalentListPosition.talentList.length - 1;

    const newTalentListID =
      result.data?.createTalentListPosition.talentList[lastTalentListIndex]._id;

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: newTalentListID,
          usersTalentList: newTalentListCandidatesIds,
        },
      },
    });

    toast.success("New talent list created!");
  };

  const handleShareTalentListButton = async () => {
    const url =
      window.location.origin + "/talentlist/" + talentListSelected?._id!;

    navigator.clipboard.writeText(url);
    toast.success("List link copied!");
  };

  const handleRejectCandidate = async (candidateID: string) => {
    setQuickActionButtonUsed(true);
    const _prevTalent = findPositionData?.findPosition.talentList
      .find((_list: any) => _list._id === rejectedTalentListID)
      .talent.map((t: any) => t.user._id);

    const newTalentListCandidatesIds = _prevTalent.length
      ? [..._prevTalent, candidateID]
      : [candidateID];

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: rejectedTalentListID,
          usersTalentList: newTalentListCandidatesIds,
        },
      },
    });

    toast.success("Candidate added to Rejected Candidates list!");
  };

  const handleApproveCandidate = async (candidateID: string) => {
    setQuickActionButtonUsed(true);
    const _prevTalent = findPositionData?.findPosition.talentList
      .find((_list: any) => _list._id === approvedTalentListID)
      .talent.map((t: any) => t.user._id);

    const newTalentListCandidatesIds = _prevTalent.length
      ? [..._prevTalent, candidateID]
      : [candidateID];

    await updateUsersTalentListPosition({
      variables: {
        fields: {
          positionID: positionID,
          talentListID: approvedTalentListID,
          usersTalentList: newTalentListCandidatesIds,
        },
      },
    });

    toast.success("Candidate added to Approved Candidates list!");
  };

  const [priorities, setPriorities] = useState<PrioritiesType[]>([]);

  const [tradeOffs, setTradeOffs] = useState<TradeOffsType[]>([]);

  useMemo(() => {
    if (
      findPositionData?.findPosition?.positionsRequirements?.priorities &&
      findPositionData?.findPosition?.positionsRequirements?.tradeOffs &&
      findPositionData?.findPosition?.positionsRequirements?.priorities.length >
        0 &&
      findPositionData?.findPosition?.positionsRequirements?.tradeOffs.length >
        0
    ) {
      setPriorities(
        findPositionData.findPosition.positionsRequirements.priorities
      );
      setTradeOffs(
        findPositionData.findPosition.positionsRequirements.tradeOffs
      );
    }
  }, [findPositionData?.findPosition]);

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>
      <Modal
        open={newTalentListNameInputOpen}
        onClose={() => setNewTalentListNameInputOpen(false)}
        title="Set your new talent list name"
        closeOnEsc
      >
        <div className="relative flex flex-col items-center space-y-6">
          <TextField
            name="newtalentlistnameinput"
            onChange={(event) => setNewTalentListName(event.target.value)}
            placeholder="Type the new talent list name"
            type="text"
          />

          <Button
            disabled={!newTalentListName.length}
            onClick={() => {
              setNewTalentListNameInputOpen(false);
              handleSaveNewTalentList();
            }}
            variant="secondary"
          >
            Save
          </Button>
        </div>
      </Modal>
      <div className="relative mx-auto max-w-screen-xl flex-grow p-8">
        <div className="z-20 w-full transition-all duration-200 ease-in-out">
          <div className="mb-4 flex items-center">
            <div>
              <h1 className="text-edenGreen-600 mr-6">
                {findPositionData && findPositionData.findPosition.name
                  ? findPositionData.findPosition.name.charAt(0).toUpperCase() +
                    findPositionData.findPosition.name.slice(1)
                  : ""}
              </h1>
              <p>{company?.name}</p>
            </div>

            <Button
              size="sm"
              className="opacity-0 hover:opacity-10 bg-soilBlue border-soilBlue mr-2 flex items-center !px-1 !py-0 !text-sm text-white hover:border-[#7A98E5] hover:bg-[#7A98E5]"
              variant="default"
              onClick={handleCopyLink}
            >
              <HiOutlineLink className="mr-1" />
              interview link
            </Button>
            <Button
              size="sm"
              className="opacity-0 hover:opacity-10 bg-soilBlue border-soilBlue mr-2 flex items-center !px-1 !py-0 !text-sm text-white hover:border-[#7A98E5] hover:bg-[#7A98E5]"
              variant="default"
              onClick={handleCalculateSkillScore}
            >
              Calculate Skill Score
            </Button>
            {notificationOpen && (
              <span className="text-sm text-gray-400">Link copied!</span>
            )}
            <Button
              className="opacity-0 hover:opacity-10 transition-bg relative ml-auto h-[36px] whitespace-nowrap !border-[#ff5656] pl-[16px] pr-[40px] font-bold !text-[#ff5656] duration-200 ease-in-out hover:!bg-[#ff5656] hover:!text-white hover:shadow-md hover:shadow-red-200"
              radius="pill"
              variant="secondary"
              onClick={handleTrainButtonClick}
            >
              Align with Eden
              <div className="absolute -right-[2px] -top-[2px] flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-full border-2 border-[#ff5656]">
                <div className="h-[40px] w-[40px] min-w-[40px]">
                  <Image
                    src="https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg"
                    width={40}
                    height={40}
                    alt=""
                  />
                </div>
              </div>
            </Button>
            <Button
              className="opacity-0 hover:opacity-10 transition-bg relative ml-auto h-[36px] whitespace-nowrap !border-[#007bff] pl-[16px] pr-[40px] font-bold !text-[#007bff] duration-200 ease-in-out hover:!bg-[#007bff] hover:!text-white hover:shadow-md hover:shadow-red-200"
              radius="pill"
              variant="secondary"
              onClick={handleFindBestTalentClick}
            >
              Recruit Similar Candidates
              <div className="absolute -right-[2px] -top-[2px] flex h-[36px] w-[36px] items-center justify-center overflow-hidden rounded-full border-2 border-[#007bff]">
                <div className="h-[40px] w-[40px] min-w-[40px]">
                  <Image
                    src="https://pbs.twimg.com/profile_images/1595723986524045312/fqOO4ZI__400x400.jpg"
                    width={40}
                    height={40}
                    alt=""
                  />
                </div>
              </div>
            </Button>
          </div>

          <section
            className={classNames(
              "relative mb-4 transition-all ease-in-out",
              opportunityDetailsOpen ? "pt-6" : "mb-7 pt-3"
            )}
          >
            <div
              className={classNames(
                "bg-edenGreen-200 text-edenGray-700 absolute right-0 top-0 flex h-6 w-44 cursor-pointer items-center rounded-md px-2 text-xs",
                opportunityDetailsOpen ? "rounded-bl-none rounded-br-none" : ""
              )}
              onClick={() => setOpportunityDetailsOpen(!opportunityDetailsOpen)}
            >
              {opportunityDetailsOpen
                ? "Close opportunity details"
                : "See opportunity details"}
              <div className={classNames("ml-auto")}>
                {opportunityDetailsOpen ? (
                  <BiChevronUp color="#626262" size={"1.2rem"} />
                ) : (
                  <BiChevronDown color="#626262" size={"1.2rem"} />
                )}
              </div>
            </div>
            <div
              className={classNames(
                "border-edenGreen-200 bg-edenGreen-200 w-full overflow-hidden rounded-md border-t px-4 transition-all ease-in-out",
                opportunityDetailsOpen
                  ? "max-h-[50vh] overflow-y-scroll scrollbar-hide rounded-tr-none py-4"
                  : "max-h-[0px] py-0"
              )}
            >
              <Tab.Group defaultIndex={0}>
                <Tab.List className="border-edenGreen-300 mb-4 flex h-8 w-full border-b">
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "text-edenGreen-400 -mb-px whitespace-nowrap px-3 pb-2 pl-0 text-xs",
                        selected
                          ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                          : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                      )
                    }
                  >
                    {"Priorities Summary".toUpperCase()}
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "text-edenGreen-400 -mb-px whitespace-nowrap px-3 pb-2 text-xs",
                        selected
                          ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                          : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                      )
                    }
                  >
                    {"Required skills".toUpperCase()}
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      classNames(
                        "text-edenGreen-400 -mb-px whitespace-nowrap px-3 pb-2 text-xs",
                        selected
                          ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                          : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                      )
                    }
                  >
                    {"Trade offs".toUpperCase()}
                  </Tab>
                </Tab.List>
                <Tab.Panels>
                  <Tab.Panel>
                    <ul className="w-80 mx-auto">
                      {priorities &&
                        priorities.length > 0 &&
                        priorities.map((priority, index) => (
                          <li
                            key={index}
                            className="relative mb-2 w-80 cursor-pointer rounded-md bg-white px-4 py-3"
                          >
                            <EdenTooltip
                              id={
                                priority.reason?.split(" ").join("") ||
                                `priority-tooltip-${index}`
                              }
                              innerTsx={
                                <div className="w-60">
                                  <p>{priority.reason}</p>
                                </div>
                              }
                              place="top"
                              effect="solid"
                              backgroundColor="white"
                              border
                              borderColor="#e5e7eb"
                              padding="0.5rem"
                              offset={{ left: 100 }}
                            >
                              <div className="flex w-full items-center">
                                <div className="">
                                  {index + 1}. {priority.priority}
                                </div>
                              </div>
                            </EdenTooltip>
                          </li>
                        ))}
                    </ul>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="text-center">
                      {findPositionData?.findPosition?.nodes && (
                        <NodeList nodes={findPositionData.findPosition.nodes} />
                      )}
                    </div>
                  </Tab.Panel>
                  <Tab.Panel>
                    <div className="flex max-w-lg mx-auto flex-col items-center justify-center">
                      {tradeOffs &&
                        tradeOffs.length > 0 &&
                        tradeOffs.map((tradeOff, index) => (
                          <EdenTooltip
                            key={index}
                            id={`tradeoff-${index}`}
                            innerTsx={
                              <div className="w-60">
                                <p>{tradeOff.reason}</p>
                              </div>
                            }
                            place="top"
                            effect="solid"
                            backgroundColor="white"
                            border
                            borderColor="#e5e7eb"
                            padding="0.5rem"
                            containerClassName="w-full"
                          >
                            <div className="grid grid-cols-2">
                              <label
                                className={classNames(
                                  "col-span-1 mb-2 flex w-full cursor-pointer items-center justify-center px-4 py-2 text-center transition-all ease-in-out",
                                  tradeOff.selected === tradeOff.tradeOff1
                                    ? "text-edenGreen-500 border-edenGreen-300 scale-[1.05] rounded-md border bg-white"
                                    : "bg-edenGreen-100 border-edenGreen-100 text-edenGray-500 rounded-bl-md rounded-tl-md border"
                                )}
                                htmlFor={`tradeoff-${index}-1`}
                              >
                                <div className="flex items-center justify-end">
                                  <span className="">{tradeOff.tradeOff1}</span>
                                  <input
                                    type="radio"
                                    className="ml-2 hidden"
                                    id={`tradeoff-${index}-1`}
                                    name={`tradeoff-${index}-1`}
                                    value={tradeOff.tradeOff1!}
                                    checked={
                                      tradeOff.selected === tradeOff.tradeOff1
                                    }
                                    disabled
                                  />
                                </div>
                              </label>
                              <label
                                className={classNames(
                                  "col-span-1 mb-2 flex w-full cursor-pointer items-center justify-center px-4 py-2 text-center transition-all ease-in-out",
                                  tradeOff.selected === tradeOff.tradeOff2
                                    ? "text-edenGreen-500 border-edenGreen-300 scale-[1.05] rounded-md border bg-white"
                                    : "bg-edenGreen-100 border-edenGreen-100 text-edenGray-500 rounded-br-md rounded-tr-md border"
                                )}
                                htmlFor={`tradeoff-${index}-2`}
                              >
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    className="mr-2 hidden"
                                    id={`tradeoff-${index}-2`}
                                    name={`tradeoff-${index}-2`}
                                    value={tradeOff.tradeOff2!}
                                    checked={
                                      tradeOff.selected === tradeOff.tradeOff2
                                    }
                                    disabled
                                  />
                                  <span className="">{tradeOff.tradeOff2}</span>
                                </div>
                              </label>
                            </div>
                          </EdenTooltip>
                        ))}
                    </div>
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </section>

          <section className="relative mb-4">
            <div className="bg-edenPink-100 w-full overflow-hidden rounded-md px-4 py-4">
              <h2 className="text-edenGreen-600">
                Let&apos;s find your perfect candidate today.
              </h2>
              <p>Here are some candidates picked by me, to get you started. </p>

              <div
                className={classNames(
                  "scrollbar-hide overflow-x-scroll scrollbar-hide transition-all ease-in-out",
                  bestPicksOpen ? "max-h-[30vh] pt-4" : "max-h-0 pt-0"
                )}
              >
                <div className="whitespace-nowrap flex items-stretch">
                  {candidatesUnqualifiedList
                    .slice(0, 3)
                    .map((candidate, index) => (
                      <CandidateCard
                        candidate={candidate}
                        onClick={() => {
                          setSelectedUserId(candidate.user?._id!);
                        }}
                        key={index}
                      />
                    ))}
                </div>
              </div>
            </div>
            <div
              className={classNames(
                "text-edenGray-700 absolute right-0 top-0 flex cursor-pointer items-center px-2 py-3 text-xs"
              )}
              onClick={() => setBestPicksOpen(!bestPicksOpen)}
            >
              {bestPicksOpen ? (
                <BiChevronUp color="#626262" size={"1.2rem"} />
              ) : (
                <BiChevronDown color="#626262" size={"1.2rem"} />
              )}
            </div>
          </section>

          <div className="">
            <div className="mb-4 flex items-center">
              <div className="mr-4 max-w-[200px]">
                {!!talentListsAvailables.length && (
                  <SelectList
                    items={[
                      {
                        _id: "000",
                        name: "All candidates",
                        talent: candidatesUnqualifiedList.map((candidate) => ({
                          user: candidate.user,
                        })) as TalentType[],
                        positionID:
                          typeof positionID === "string"
                            ? positionID
                            : undefined,
                      },
                      ...talentListsAvailables,
                    ]}
                    onChange={handleSelectedTalentList}
                    newValue={
                      talentListSelected ? talentListSelected : undefined
                    }
                    // isDisabled={editTalentListMode}
                  />
                )}
              </div>
              {/* <>
              {talentListSelected?._id === "000" ? (
                !newTalentListCreationMode ? (
                  <Button
                    className=""
                    variant="secondary"
                    size="sm"
                    onClick={handleCreateNewListButton}
                  >
                    Create New List
                  </Button>
                ) : (
                  <>
                    <Button
                      className="mr-2 px-4"
                      size="sm"
                      variant="primary"
                      onClick={handleSaveNewTalentListButton}
                      disabled={
                        newTalentListName === "" ||
                        newTalentListCandidatesIds.length === 0
                      }
                    >
                      Save
                    </Button>

                    <FaTimes
                      size={26}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setNewTalentListName("");
                        setNewTalentListCandidatesIds([]);
                        setNewTalentListCreationMode(false);
                      }}
                    />
                  </>
                )
              ) : !editTalentListMode ? (
                <div className="flex"> */}
              {/* <Button
                    className="mr-2"
                    variant="secondary"
                    size="sm"
                    onClick={handleEditTalentListButton}
                  >
                    Edit
                  </Button>
                  <Button
                    className="mr-2"
                    variant="secondary"
                    size="sm"
                    onClick={handleCreateNewListButton}
                  >
                    Create New List
                  </Button>
                </div>
              ) : (
                <Button
                  className="mb-4 ml-auto"
                  variant="secondary"
                  onClick={handleSaveNewTalentListButton}
                  disabled={
                    newTalentListName === "" ||
                    newTalentListCandidatesIds.length === 0
                  }
                >
                  Save
                </Button>
              )}
            </> */}
              {/* <select
              name="add-to-list"
              id="add-to-list"
              className="ml-auto cursor-pointer text-xs text-gray-600 underline hover:text-gray-500"
              value=""
              onSelect={() => {
                console.log("new list");
              }}
            >
              <option value="" disabled hidden>
                Add to list
              </option>
              <option value="asd">New list</option>
            </select> */}
              {newTalentListCandidatesIds.length > 0 && (
                <>
                  {createTalentListPositionLoading ||
                  updateUsersTalentListPositionLoading ? (
                    <Loading title="" />
                  ) : (
                    <div className="relative ml-10 mr-3">
                      <span
                        onClick={() => {
                          setAddToListOpen(true);
                        }}
                        className="cursor-pointer text-xs text-gray-600 hover:text-gray-400"
                      >
                        <IoMdAddCircle size={16} className="mb-1 mr-1 inline" />
                        Add to list
                      </span>
                      {addToListOpen && (
                        <div
                          className="fixed left-0 top-0 z-30 h-full w-full"
                          onClick={() => {
                            setAddToListOpen(false);
                          }}
                        ></div>
                      )}
                      {addToListOpen && (
                        <div
                          className={classNames(
                            "scrollbar-hide absolute left-0 top-6 z-40 max-h-[120px] w-[140px] overflow-y-scroll scrollbar-hide rounded-md border border-gray-200 bg-white hover:text-gray-600",
                            addToListOpen ? "" : "h-0"
                          )}
                        >
                          <div
                            className="cursor-pointer border-b border-gray-200 p-1 last:border-0 hover:bg-gray-100"
                            onClick={handleCreateNewList}
                          >
                            <p className="">
                              <HiOutlineDocumentPlus
                                size={16}
                                className="mb-1 mr-1 inline"
                              />
                              New list
                            </p>
                          </div>
                          {talentListsAvailables.map((list, index) => (
                            <div
                              key={index}
                              className="cursor-pointer border-b border-gray-200 p-1 last:border-0 hover:bg-gray-100"
                              onClick={() =>
                                handleAddCandidatesToList(list._id!)
                              }
                            >
                              <p className="">{list.name}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              {newTalentListCandidatesIds.length > 0 &&
                talentListSelected?._id !== "000" && (
                  <div className="relative">
                    <span
                      className="ml-4 cursor-pointer text-xs text-gray-600 hover:text-gray-400"
                      onClick={() => {
                        handleRemoveCandidatesFromList(
                          talentListSelected?._id!
                        );
                      }}
                    >
                      <IoMdRemoveCircle
                        size={16}
                        className="mb-1 mr-1 inline"
                      />
                      Remove from list
                    </span>
                  </div>
                )}
              {newTalentListCandidatesIds.length > 0 && (
                <div className="relative">
                  <span
                    data-tip="Select only 2 candidates to compare"
                    data-for={`badgeTip-compare`}
                    className={classNames(
                      "ml-8 mr-4 text-xs text-gray-600 hover:text-gray-400",
                      newTalentListCandidatesIds.length !== 2
                        ? "cursor-default hover:line-through"
                        : "cursor-pointer"
                    )}
                    onClick={() => {
                      if (newTalentListCandidatesIds.length !== 2) return;
                      setSelectedUserId(null);
                      router.push(
                        {
                          pathname: `/${company?.slug}/dashboard/${positionID}`,
                          query: {
                            candidate1: newTalentListCandidatesIds[0],
                            candidate2: newTalentListCandidatesIds[1],
                          },
                        },
                        undefined,
                        { shallow: true }
                      );
                    }}
                  >
                    <MdCompare size={16} className="mb-1 mr-1 inline" />
                    Compare
                  </span>
                  {newTalentListCandidatesIds.length !== 2 && (
                    <ReactTooltip
                      id="badgeTip-compare"
                      place="top"
                      effect="solid"
                      backgroundColor="#f87171"
                    />
                  )}
                </div>
              )}

              {talentListSelected?._id && (
                <div
                  className="border-edenGray-100 group ml-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border"
                  onClick={handleShareTalentListButton}
                  data-tip="Share talent list"
                  data-for={`share-button`}
                >
                  <FaShare
                    size={18}
                    className="text-edenGray-700 group-hover:text-edenGray-500"
                  />
                </div>
              )}
              <ReactTooltip
                id="share-button"
                place="left"
                effect="solid"
                backgroundColor="#3B4756"
                padding="0.125rem"
              >
                <span className="px-2">Share talent list</span>
              </ReactTooltip>
            </div>
          </div>
          <div className="">
            <CandidatesTableList
              candidateIDRowSelected={selectedUserId || null}
              candidatesList={
                talentListSelected?._id === "000"
                  ? candidatesUnqualifiedList.slice(3, -1) //@TODO remove this slice.
                  : candidatesFromTalentList
              }
              fetchIsLoading={findPositionIsLoading}
              setRowObjectData={handleRowClick}
              listMode={ListModeEnum.selectable}
              selectedIds={newTalentListCandidatesIds}
              handleChkSelection={handleCandidateCheckboxSelection}
            />
            {trainModalOpen ? (
              <div className="fixed inset-0 z-30 overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center px-4">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                    onClick={handleCloseTrainModal}
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <div className="transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-xl">
                    <TrainQuestionsEdenAI
                      questions={questions}
                      positionID={positionID!}
                      setQuestions={setQuestions}
                      setTrainModalOpen={setTrainModalOpen}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div
          className={classNames(
            "transition-width fixed right-0 top-0 z-30 h-screen overflow-y-scroll scrollbar-hide bg-white shadow-md duration-200 ease-in-out",
            selectedUserId ? "w-[48rem]" : "w-0"
          )}
        >
          <CandidateInfo
            key={selectedUserId || ""}
            memberID={selectedUserId || ""}
            // percentage={selectedUserScore}
            summaryQuestions={selectedUserSummaryQuestions}
            mostRelevantMemberNode={mostRelevantMemberNode}
            candidate={candidatesOriginalList?.find(
              (candidate) =>
                candidate?.user?._id?.toString() == selectedUserId?.toString()
            )}
            onClose={() => {
              setSelectedUserId(null);
            }}
            rejectCandidateFn={handleRejectCandidate}
            approveCandidateFn={handleApproveCandidate}
            qualified={
              Boolean(
                approvedTalentListCandidatesList?.find(
                  (candidate) =>
                    candidate?.user?._id?.toString() ==
                    selectedUserId?.toString()
                )
              ) ||
              Boolean(
                rejectedTalentListCandidatesList?.find(
                  (candidate) =>
                    candidate?.user?._id?.toString() ==
                    selectedUserId?.toString()
                )
              )
            }
            handleCreateNewList={handleCreateNewList}
            talentListsAvailables={talentListsAvailables}
            handleAddCandidatesToList={function (): Promise<void> {
              throw new Error("Function not implemented.");
            }}
          />
          {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
        </div>
        <div
          className={classNames(
            "absolute right-0 top-0 z-20 transform overflow-y-scroll scrollbar-hide transition-all duration-200 ease-in-out flex",
            router.query.candidate1 && router.query.candidate2
              ? "w-full"
              : "w-0"
          )}
        >
          {router.query.candidate1 && router.query.candidate2 && (
            <>
              <div className="scrollbar-hide relative h-screen w-1/2 overflow-y-scroll scrollbar-hide border-box border-r border-gray-300 bg-white">
                {/* {router.query.candidate1 ? ( */}
                <CandidateInfo
                  key={(router.query.candidate1 as string) || ""}
                  memberID={(router.query.candidate1 as string) || ""}
                  percentage={selectedUserScore}
                  summaryQuestions={selectedUserSummaryQuestions}
                  mostRelevantMemberNode={mostRelevantMemberNode}
                  handleAddCandidatesToList={handleAddCandidatesToList}
                  candidate={candidatesOriginalList?.find(
                    (candidate) =>
                      candidate?.user?._id?.toString() ==
                      router.query.candidate1?.toString()
                  )}
                  onClose={() => {
                    router.push(
                      {
                        pathname: `/${company?.slug}/dashboard/${positionID}`,
                      },
                      undefined,
                      { shallow: true }
                    );
                  }}
                  handleCreateNewList={handleCreateNewList}
                  talentListsAvailables={talentListsAvailables}
                  showAskEden={false}
                />
                {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
              </div>
              <div className="scrollbar-hide relative h-screen w-1/2 overflow-y-scroll scrollbar-hide bg-white">
                {/* {router.query.candidate2 ? ( */}
                <CandidateInfo
                  key={(router.query.candidate2 as string) || ""}
                  memberID={(router.query.candidate2 as string) || ""}
                  percentage={selectedUserScore}
                  handleCreateNewList={handleCreateNewList}
                  summaryQuestions={selectedUserSummaryQuestions}
                  mostRelevantMemberNode={mostRelevantMemberNode}
                  candidate={candidatesOriginalList?.find(
                    (candidate) =>
                      candidate?.user?._id?.toString() ==
                      router.query.candidate2?.toString()
                  )}
                  onClose={() => {
                    router.push(
                      {
                        pathname: `/${company?.slug}/dashboard/${positionID}`,
                      },
                      undefined,
                      { shallow: true }
                    );
                  }}
                  talentListsAvailables={talentListsAvailables}
                  handleAddCandidatesToList={function (): Promise<void> {
                    throw new Error("Function not implemented.");
                  }}
                  showAskEden={false}
                />
                {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
              </div>
            </>
          )}
        </div>

        {!selectedUserId &&
          !router.query.candidate1 &&
          !router.query.candidate2 &&
          currentUser?._id && (
            <AskEdenPopUp
              memberID={currentUser?._id!}
              service={AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION}
            />
          )}
      </div>
    </>
  );
};

PositionCRM.getLayout = (page: any) => <AppUserLayout>{page}</AppUserLayout>;

export default PositionCRM;

import { CompanyContext, UserContext } from "@eden/package-context";
import { IncomingMessage, ServerResponse } from "http";
import dynamic from "next/dynamic";
import Head from "next/head";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
    // signIn("google");
  }

  return {
    props: { key: url },
  };
}
interface ICandidateCardProps {
  candidate: CandidateTypeSkillMatch;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const CandidateCard = ({ candidate, onClick }: ICandidateCardProps) => {
  return (
    <div
      className="border-edenGray-100 group relative mr-4 inline-block w-80 cursor-pointer rounded-md border bg-white last:mr-0 whitespace-normal"
      onClick={onClick}
    >
      <div className="relative flex px-4 pt-2 pb-2 h-full" onClick={onClick}>
        <div className="mr-4 flex items-center">
          <Avatar src={candidate.user?.discordAvatar || ""} size="sm" />
        </div>
        <div className="w-3/4 flex flex-col justify-center">
          <p className="font-bold">{candidate.user?.discordName}</p>
          {candidate.analysisCandidateEdenAI?.background?.oneLiner && (
            <p className="text-edenGray-600 text-xs w-full whitespace-normal">
              {candidate.analysisCandidateEdenAI.background.oneLiner}
            </p>
          )}
        </div>
        <Button
          className="bg-edenGreen-100 group-hover:bg-edenGreen-200 absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center !rounded-full !p-0"
          variant="tertiary"
        >
          <FaArrowRight size={"0.75rem"} />
        </Button>
        {candidate.analysisCandidateEdenAI?.background?.content && (
          <EdenTooltip
            id={candidate.user?._id + "_tooltip"}
            innerTsx={
              <div className="w-96">
                <span className="text-gray-600">
                  {candidate.analysisCandidateEdenAI?.background?.content}
                </span>
              </div>
            }
            place="top"
            effect="solid"
            backgroundColor="white"
            border
            borderColor="#e5e7eb"
            padding="0.5rem"
          >
            <div className="bg-edenPink-200 rounded-full p-1 w-5 h-5 absolute -right-2 -top-1">
              <EdenIconExclamation className="w-full h-full" />
            </div>
          </EdenTooltip>
        )}
      </div>
    </div>
  );
};
