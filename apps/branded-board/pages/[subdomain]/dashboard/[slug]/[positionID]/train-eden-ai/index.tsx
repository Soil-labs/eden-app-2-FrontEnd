import { gql, useMutation, useQuery } from "@apollo/client";
import { CompanyContext, UserContext } from "@eden/package-context";
import {
  PrioritiesInput,
  PrioritiesType,
  QuestionType,
  QuestionTypeInput,
  TradeOffsInput,
  TradeOffsType,
  UpdatePrioritiesTradeOffsInput,
} from "@eden/package-graphql/generated";
import {
  BrandedSaasUserLayout,
  Button,
  EdenAiProcessingModal,
  Modal,
  // ProgressBarGeneric,
  // RawDataGraph,
  SEO,
  Wizard,
  WizardStep,
} from "@eden/package-ui";
import useAuthGate from "@eden/package-ui/src/hooks/useAuthGate/useAuthGate";
import { classNames, getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { CreateQuestions } from "@/components/TrainEdenAiSteps/CreateQuestionsContainer";
import { FinalFormContainer } from "@/components/TrainEdenAiSteps/FinalFormContainer";
import { InterviewEdenAIContainer } from "@/components/TrainEdenAiSteps/InterviewEdenAIContainer";
import { PrioritiesAndTradeOffsContainer } from "@/components/TrainEdenAiSteps/PrioritiesAndTradeOffsContainer";
import { ProfileQuestionsContainer } from "@/components/TrainEdenAiSteps/ProfileQuestionsContainer";

import type { NextPageWithLayout } from "../../../../../_app";

export const WEBPAGE_TO_MEMORY = gql`
  mutation ($fields: websiteToMemoryCompanyInput!) {
    websiteToMemoryCompany(fields: $fields) {
      report
      interviewQuestionsForPosition {
        originalQuestionID
        originalContent
        personalizedContent
      }
    }
  }
`;

// const UPDATE_POSITION = gql`
//   mutation ($fields: updatePositionInput!) {
//     updatePosition(fields: $fields) {
//       _id
//     }
//   }
// `;

const FIND_POSITION = gql`
  query ($fields: findPositionInput) {
    findPosition(fields: $fields) {
      _id
      name
      icon
      positionsRequirements {
        priorities {
          priority
          reason
        }
        tradeOffs {
          reason
          selected
          tradeOff1
          tradeOff2
        }
      }
      interviewQuestionsForPosition {
        originalQuestionID
        originalContent
        personalizedContent
      }
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
          category
        }
      }
    }
  }
`;

export const POSITION_TEXT_CONVO_TO_REPORT = gql`
  mutation ($fields: positionTextAndConvoToReportCriteriaInput!) {
    positionTextAndConvoToReportCriteria(fields: $fields) {
      success
      report
    }
  }
`;

const ADD_QUESTIONS_TO_POSITION = gql`
  mutation ($fields: addQuestionsToAskPositionInput) {
    addQuestionsToAskPosition(fields: $fields) {
      _id
      name
      candidates {
        overallScore
        user {
          _id
          discordName
          discordAvatar
        }
      }
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
          category
        }
      }
    }
  }
`;

const UPDATE_POSITION_GENERAL_DETAILS = gql`
  mutation UpdatePositionGeneralDetails(
    $fields: updatePositionGeneralDetailsInput
  ) {
    updatePositionGeneralDetails(fields: $fields) {
      _id
      generalDetails {
        startDate
        visaRequired
        officePolicy
        yearlySalary {
          min
          max
        }
        socials {
          portfolio
          linkedin
          twitter
          telegram
          github
          lens
          custom
        }
        officeLocation
        contractType
        contractDuration
      }
    }
  }
`;

const UPADTE_PRIORITIES_AND_TRADEOFFS = gql`
  mutation UpdatePrioritiesTradeOffs($fields: updatePrioritiesTradeOffsInput) {
    updatePrioritiesTradeOffs(fields: $fields) {
      success
    }
  }
`;

// type Question = {
//   _id: string;
//   content: string;
//   bestAnswer: string;
// };

const FLOW_TITLES = [
  // {
  //   title: "Tell me about your opportunity!",
  //   subtitle: "You're launching a new opportunity with Eden.",
  // },
  {
    title: "Some questions to make sure we're on the same page!",
    subtitle:
      "Think of this like the intake conversation you would have with your recruiter.",
  },
  {
    title: "Just want to check with you to see if I got this right.",
    subtitle:
      "Please adjust as you see fit to make sure Eden's got your priorities & tradeoffs right.",
  },
  {
    title:
      "This is the score card I came up with, based on what we talked about.",
    subtitle:
      "This is the list of topics we'll use to benchmark all the candidates. Feel free to edit, add or delete.",
  },
  {
    title: "And here's my list of not-to-miss questions.",
    subtitle:
      "These questions get adapted in realtime based on the context of the candidate & rest of the interview.",
  },
  {
    title: "Almost there. Just the final details.",
    subtitle: "Some elemental stuff to add.",
  },
  {
    title: "That was fun!!",
    subtitle: "You did it!",
  },
];

const TrainAiPage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const { company } = useContext(CompanyContext);
  const router = useRouter();

  useAuthGate();

  const { positionID, panda } = router.query;

  const [interviewEnded, setInterviewEnded] = useState(false);
  const [createQuestionsEnded, setCreateQuestionsEnded] = useState(false);
  const [alignmentEnded, setAlignmentEnded] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [step, setStep] = useState<number>(0);

  const {
    data: findPositionData,
    // error: findPositionError,
  } = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: !positionID,
    // onCompleted(data) {
    //   setValue("position", {
    //     ...data.findPosition,
    //     icon: data.findPosition.icon ? data.findPosition.icon : "FaCode",
    //   });
    // },
  });

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<any>({
    defaultValues: { position: "", pastedText: "" },
  });

  const handleInterviewEnd = () => {
    setInterviewEnded(true);
  };

  // const [scraping, setScraping] = useState<boolean>(false);
  // const [report, setReport] = useState<string | null>(null);

  // const [interviewQuestionsForPosition, setInterviewQuestionsForPosition] =
  //   useState<Question[]>([]);

  // const { currentUser } = useContext(UserContext);

  // const [websiteToMemoryCompany] = useMutation(WEBPAGE_TO_MEMORY, {
  //   onCompleted({ websiteToMemoryCompany }) {
  //     console.log(
  //       "websiteToMemoryCompany.report",
  //       websiteToMemoryCompany.report
  //     );
  //     let jobDescription = websiteToMemoryCompany.report.replace(/<|>/g, "");

  //     //Change - to •
  //     jobDescription = jobDescription.replace(/-\s/g, "• ");

  //     setReport(jobDescription);

  //     setScraping(false);

  //     let questionsChange =
  //       websiteToMemoryCompany.interviewQuestionsForPosition.map(
  //         (question: any) => {
  //           return {
  //             _id: question?.originalQuestionID,
  //             content: question?.personalizedContent,
  //             bestAnswer: "",
  //           };
  //         }
  //       );

  //     questionsChange = questionsChange.filter((question: any) => {
  //       return question._id != null;
  //     });

  //     setInterviewQuestionsForPosition(questionsChange);
  //   },
  // });

  // const [updatePosition] = useMutation(UPDATE_POSITION, {
  //   onCompleted() {
  //     getCompanyFunc();
  //   },
  // });

  // const handleDescriptionStepSubmit = async () => {
  //   const _pastedText = getValues("pastedText");

  //   setScraping(true);

  //   if (_pastedText !== "") {
  //     try {
  //       await Promise.all([
  //         websiteToMemoryCompany({
  //           variables: {
  //             fields: { message: _pastedText, positionID: positionID },
  //           },
  //         }),
  //         updatePosition({
  //           variables: {
  //             fields: {
  //               _id: positionID,
  //               name: getValues("position.name"),
  //               icon: getValues("position.icon"),
  //               companyID: company?._id,
  //             },
  //           },
  //         }),
  //       ]);

  //       setStep(step + 1);
  //     } catch {
  //       toast.error("Couldn't save data");
  //     }
  //   }

  //   setScraping(false);
  // };

  // const handlePrioritiesStepSubmit = async () => {
  //   const _positionsRequirements = getValues("positionsRequirements");

  //   setScraping(true);
  //   try {
  //     const _fields = {
  //       _id: positionID,
  //       companyID: company?._id,
  //       positionsRequirements: {
  //         priorities: _positionsRequirements.priorities,
  //         tradeOffs: _positionsRequirements.tradeOffs,
  //       },
  //     };

  //     updatePosition({
  //       variables: {
  //         fields: _fields,
  //       },
  //     }),
  //       setStep(step + 1);
  //   } catch {
  //     toast.error("Couldn't save data");
  //   }

  //   setScraping(false);
  // };

  // ------ PRIORITIES STEP ------
  const [updatePrioritiesTradeOffs] = useMutation(
    UPADTE_PRIORITIES_AND_TRADEOFFS
  );

  // handle question suggestions submit
  const handlePrioritiesStepSubmit = () => {
    if (positionID) {
      updatePrioritiesTradeOffs({
        variables: {
          fields: {
            positionID:
              typeof positionID === "string" ? positionID : positionID[0],
            priorities: getValues(
              "position.positionsRequirements.priorities"
            ).map(
              (priority: PrioritiesType) =>
                ({
                  priority: priority.priority,
                } as PrioritiesInput)
            ),
            tradeOffs: getValues(
              "position.positionsRequirements.tradeOffs"
            ).map(
              (tradeOff: TradeOffsType) =>
                ({
                  selected: tradeOff.selected,
                  tradeOff1: tradeOff.tradeOff1,
                  tradeOff2: tradeOff.tradeOff2,
                } as TradeOffsInput)
            ),
          } as UpdatePrioritiesTradeOffsInput,
        },
        onCompleted() {
          setStep(step + 1);
        },
        onError() {
          toast.error("There was an error while submitting");
        },
      });
    }
  };

  // ------ ALIGNMENT STEP ------

  const [
    positionTextAndConvoToReportCriteria,
    { loading: loadingUpdateReportToPosition },
  ] = useMutation(POSITION_TEXT_CONVO_TO_REPORT, {
    // eslint-disable-next-line no-unused-vars
    onCompleted({ positionTextAndConvoToReportCriteria }) {
      setStep(step + 1);
    },
    onError() {
      // setScraping(false);
    },
  });

  const handleSubmitAlignment = () => {
    // setScraping(true);

    positionTextAndConvoToReportCriteria({
      variables: {
        fields: {
          positionID: positionID,
          updatedReport: getValues("position.positionsRequirements.content"),
        },
      },
    });
  };

  // ------ QUESTIONS STEP ------

  const [
    updatePositionGeneralDetails,
    { loading: loadingUpdatePositionGeneralDetails },
  ] = useMutation(UPDATE_POSITION_GENERAL_DETAILS);

  // handle question suggestions submit
  const handleSaveGeneralDetails = (publish = false) => {
    if (positionID) {
      updatePositionGeneralDetails({
        variables: {
          fields: {
            _id: typeof positionID === "string" ? positionID : positionID[0],
            status: publish ? "ACTIVE" : "UNPUBLISHED",
            ...getValues("position.generalDetails"),
          },
        },
        onCompleted() {
          router.push(`/dashboard/${company?.slug}/${positionID}`);
        },
        onError() {
          toast.error("There was an error while submitting");
        },
      });
    }
  };
  // ------ QUESTIONS STEP ------

  const [
    updateQuestionsPosition,
    { loading: loadingUpdateQuestionsToPosition },
  ] = useMutation(ADD_QUESTIONS_TO_POSITION);

  // handle question suggestions submit
  const handleSaveChangesInterviewQuestions = () => {
    if (positionID) {
      updateQuestionsPosition({
        variables: {
          fields: {
            positionID:
              typeof positionID === "string" ? positionID : positionID[0],
            questionsToAsk: getValues("position.questionsToAsk").map(
              (question: QuestionType) =>
                ({
                  // questionID: question.question?._id,
                  questionContent: question.question?.content,
                  category: question?.category,
                } as QuestionTypeInput)
            ),
          },
        },
        onCompleted() {
          setStep(step + 1);
        },
        onError() {
          toast.error("There was an error while submitting");
        },
      });
    }
  };

  // const [notificationOpen, setNotificationOpen] = useState(false);

  // const handleCopyLink = (positionID: string) => {
  //   // const url = window.location.href;
  //   const url = window.location.origin + "/interview/" + positionID;

  //   navigator.clipboard.writeText(url);
  //   setNotificationOpen(true);
  //   setTimeout(() => {
  //     setNotificationOpen(false);
  //   }, 3000);
  // };

  // ---- confetti setup ----
  // const [height, setHeight] = useState(0);
  // const [width, setWidth] = useState(0);
  // const [confettiRun, setConfettiRun] = useState(false);
  // const ref = useRef(null);

  // useEffect(() => {
  //   if (step === 2) {
  //     setConfettiRun(true);
  //     // @ts-ignore
  //     setWidth(ref.current?.clientWidth || 0);
  //     // @ts-ignore
  //     setHeight(ref.current?.clientHeight || 0);
  //     setTimeout(() => {
  //       setConfettiRun(false);
  //     }, 2500);
  //   }
  // }, [step]);

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
      <SEO />
      <div
        key={typeof positionID === "string" ? positionID : ""}
        className="scrollbar-hide relative mx-auto h-screen w-full max-w-5xl overflow-y-scroll p-8"
      >
        {currentUser && findPositionData && (
          <div className="relative h-full w-full pt-[5%]">
            {/* <div className="absolute left-0 top-0 w-full">
              <ProgressBarGeneric progress={progress} />
            </div> */}
            <h1 className="text-edenGreen-600 text-center">
              {FLOW_TITLES[step].title}
            </h1>
            <div className="h-[95%] w-full">
              <p className="text-edenGray-900 text-center">
                {FLOW_TITLES[step].subtitle}
              </p>
              <Wizard
                showStepsHeader
                canPrev={false}
                forceStep={step}
                onStepChange={(_stepNum: number) => {
                  if (_stepNum !== step) {
                    setStep(_stepNum);
                  }
                }}
                animate
              >
                {/* <WizardStep
                  label={"Description"}
                  navigationDisabled={!panda}
                  nextDisabled
                  nextButton={
                    <Button
                      loading={scraping}
                      variant="secondary"
                      // type="submit"
                      className="mx-auto"
                      onClick={() => {
                        handleDescriptionStepSubmit();
                      }}
                      disabled={!watch("position.name") || !watch("pastedText")}
                    >
                      Save & Continue
                    </Button>
                  }
                >
                  <div className="relative flex h-full items-center justify-center">
                    {findPositionData && (
                      <DescriptionContainer
                        defaultValues={{
                          "position.name": findPositionData?.findPosition?.name,
                          "position.icon":
                            findPositionData?.findPosition?.icon || "FaCode",
                        }}
                        onChange={(data) => {
                          setValue("position.name", data["position.name"]);
                          setValue("pastedText", data.pastedText);
                          setValue("position.icon", data["position.icon"]);
                        }}
                      />
                    )}
                    <EdenAiProcessingModal
                      open={scraping}
                      title="Give me 30 seconds!"
                    >
                      <div className="text-center">
                        <p>
                          I&apos;m reading your job description, writing down
                          additional questions I have for you so I can draft the
                          ideal interview for your candidates!
                        </p>
                      </div>
                    </EdenAiProcessingModal>
                  </div>
                </WizardStep> */}

                {/* <WizardStep nextDisabled={!interviewEnded} label={"chat"}> */}
                <WizardStep
                  label={"Eden Convo"}
                  nextButton={
                    <Button
                      variant="secondary"
                      className={classNames(
                        "mx-auto",
                        !interviewEnded
                          ? "!text-edenGray-500 !bg-edenGray-100"
                          : ""
                      )}
                      onClick={() => {
                        setShowInterviewModal(true);
                      }}
                    >
                      Next
                    </Button>
                  }
                  navigationDisabled={!panda}
                >
                  <div className="relative mx-auto h-full w-full max-w-2xl">
                    <InterviewEdenAIContainer
                      handleEnd={handleInterviewEnd}
                      // interviewQuestionsForPosition={
                      //   interviewQuestionsForPosition
                      // }
                    />
                  </div>
                  <Modal open={showInterviewModal} closeOnEsc={false}>
                    <div className="px-4 py-8">
                      <h2 className="mb-4 text-center">
                        Are you done talking?
                      </h2>
                      <p className="text-edenGray-700 mx-auto mb-12 max-w-[60%] text-center">
                        The more you talk here, the more accurate the matching
                        will be!
                      </p>
                      <div className="flex justify-evenly">
                        <Button
                          onClick={() => {
                            setShowInterviewModal(false);
                          }}
                          variant="primary"
                        >
                          {"I'm not done yet"}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setShowInterviewModal(false);
                            setStep(step + 1);
                          }}
                        >
                          {"Let's move on"}
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </WizardStep>

                <WizardStep
                  label={"Priorities & TradeOffs"}
                  navigationDisabled={!panda}
                  nextButton={
                    <Button
                      variant="secondary"
                      className="mx-auto"
                      onClick={() => {
                        handlePrioritiesStepSubmit();
                      }}
                      disabled={
                        !watch("position.positionsRequirements.priorities") ||
                        !watch("position.positionsRequirements.tradeOffs")
                      }
                    >
                      Save & Continue
                    </Button>
                  }
                >
                  <div className="mx-auto flex h-full max-w-5xl items-center">
                    <PrioritiesAndTradeOffsContainer
                      position={getValues("position")}
                      onChange={(val) => {
                        setValue(
                          "position.positionsRequirements.priorities",
                          val.priorities
                        );
                        setValue(
                          "position.positionsRequirements.tradeOffs",
                          val.tradeOffs
                        );
                      }}
                    />
                  </div>
                </WizardStep>

                <WizardStep
                  label={"Alignment"}
                  navigationDisabled={!panda}
                  nextButton={
                    alignmentEnded ? (
                      <Button
                        variant="secondary"
                        className="mx-auto"
                        onClick={() => {
                          handleSubmitAlignment();
                        }}
                        loading={loadingUpdateReportToPosition}
                        disabled={
                          !watch("position.positionsRequirements.content") ||
                          loadingUpdateReportToPosition
                        }
                      >
                        Save & Continue
                      </Button>
                    ) : (
                      <></>
                    )
                  }
                >
                  <div className="mx-auto h-full max-w-2xl">
                    <ProfileQuestionsContainer
                      onChange={(val) => {
                        setValue("position.positionsRequirements.content", val);
                      }}
                      onLastStep={(isLastStep: boolean) => {
                        setAlignmentEnded(isLastStep);
                      }}
                    />
                    {loadingUpdateQuestionsToPosition && (
                      <EdenAiProcessingModal
                        open={loadingUpdateReportToPosition}
                        title="Generating optimal interview"
                      >
                        <div className="text-center">
                          <p>
                            {`I've done 1000s of interviews and I'm currently cross-referencing the best seed questions to ask based on everything you've just told me. You'll be able to add, delete & adapt of course!`}
                          </p>
                        </div>
                      </EdenAiProcessingModal>
                    )}
                  </div>
                </WizardStep>

                <WizardStep
                  label={"Eden Suggestions"}
                  navigationDisabled={!panda}
                  nextButton={
                    createQuestionsEnded ? (
                      <Button
                        variant={"primary"}
                        className="mx-auto"
                        loading={loadingUpdateQuestionsToPosition}
                        onClick={() => handleSaveChangesInterviewQuestions()}
                      >
                        Save & Continue
                      </Button>
                    ) : (
                      <></>
                    )
                  }
                >
                  <div className="relative mx-auto h-full max-w-2xl">
                    {/* <h2 className="mb-4 text-xl font-medium">
                      {"Eden's Seed Interview Questions"}
                    </h2>
                    <p className="mb-8 text-sm leading-tight text-gray-500">
                      {
                        "Here’s a list of all the must & nice to have. Feel free to edit any line"
                      }
                    </p> */}
                    <CreateQuestions
                      onChange={(data: QuestionType[]) => {
                        setValue("position.questionsToAsk", data);
                      }}
                      onLastStep={(isLastStep: boolean) => {
                        setCreateQuestionsEnded(isLastStep);
                      }}
                    />
                    {loadingUpdateQuestionsToPosition && (
                      <EdenAiProcessingModal
                        open={loadingUpdateQuestionsToPosition}
                        title="Generating optimal interview"
                      >
                        <div className="text-center">
                          <p>
                            {`I've done 1000s of interviews and I'm currently cross-referencing the best seed questions to ask based on everything you've just told me. You'll be able to add, delete & adapt of course!`}
                          </p>
                        </div>
                      </EdenAiProcessingModal>
                    )}
                  </div>
                </WizardStep>
                <WizardStep
                  label={"Final Details"}
                  navigationDisabled={!panda}
                  hideNext
                >
                  <div className="mx-auto max-w-[40rem]">
                    {/* <h2 className="text-xl font-medium px-8">
                      Final Interview Details
                    </h2>
                    <h3 className="text-edenGreen-600 w-full text-center">
                      {
                        "All done, this is the final step. Fill in some quick information and we're off!"
                      }
                    </h3> */}
                    <FinalFormContainer
                      onChange={(data) => {
                        setValue(
                          "position.generalDetails.startDate",
                          new Date(data.targetedStartDate)
                        );
                        setValue(
                          "position.generalDetails.visaRequired",
                          data.visaRequirements
                        );
                        setValue(
                          "position.generalDetails.officePolicy",
                          data.officePolicy
                        );
                        setValue(
                          "position.generalDetails.officeLocation",
                          data.officeLocation
                        );
                        setValue(
                          "position.generalDetails.contractType",
                          data.contractType
                        );
                        setValue(
                          "position.generalDetails.contractDuration",
                          data.contractDuration
                        );
                        setValue(
                          "position.generalDetails.yearlySalary",
                          Number(data.yearlySalary)
                        );
                        setValue(
                          "position.generalDetails.socials",
                          data.socials
                        );
                      }}
                    />

                    <div className="absolute -bottom-20 left-0 mt-4 flex w-full justify-evenly">
                      <Button
                        variant={"secondary"}
                        className="mx-auto"
                        loading={loadingUpdatePositionGeneralDetails}
                        onClick={() => handleSaveGeneralDetails(true)}
                      >
                        Publish & continue to dashboard
                      </Button>
                      {/* <Button
                        variant={"primary"}
                        className="mx-auto"
                        loading={loadingUpdatePositionGeneralDetails}
                        onClick={() => handleSaveGeneralDetails(true)}
                      >
                        Save & Publish to Developer DAO
                      </Button> */}
                    </div>
                  </div>
                </WizardStep>
                {/* <WizardStep label={"Share Link"} navigationDisabled={!panda}>
                  <div className="flex h-full flex-col items-center justify-center pb-28">
                    <div className="max-w-3xl">
                      <h1 className="text-edenGreen-600 mb-4 text-center">
                        Let&apos;s get the interviews rolling!
                      </h1>
                      <p className="mb-8 text-center">
                        Sit back and relax, we&apos;re all set! Share the link
                        to to whoever you want to kickoff the interview with!
                      </p>
                    </div>
                    <div className="flex w-2/3 justify-center">
                      <div className="border-edenGray-500 scrollbar-hide mr-2 flex h-12 w-full items-center overflow-x-scroll rounded-md border bg-white px-2 text-sm">
                        <MdLink size={18} className="mr-2" />
                        {window.location.origin + "/interview/" + positionID}
                      </div>
                      <Button
                        className="border-edenGray-500 whitespace-nowrap border font-normal"
                        variant="tertiary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(positionID as string);
                        }}
                      >
                        <div className="flex w-full items-center justify-center whitespace-nowrap text-sm">
                          {!notificationOpen ? (
                            <>
                              <MdContentCopy className="mr-2" />
                              interview link
                            </>
                          ) : (
                            "Link copied!"
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                  <Button
                    className="absolute bottom-8 right-8 z-30 mx-auto"
                    variant={"primary"}
                    onClick={() => {
                      router.push(`/dashboard/${company?.slug}/${positionID}`);
                    }}
                  >
                    Continue to Dashboard
                  </Button>
                </WizardStep> */}
              </Wizard>
            </div>
            {/* {step === 1 && (
              <div className="absolute bottom-12 w-full">
                <div className="bg-edenPink-400 mx-auto h-12 w-12 rounded-full p-2">
                  <EdenIconQuestion className="h-8 w-8" />
                </div>
              </div>
            )} */}
            {panda && (
              <Button
                className="absolute bottom-0 left-0 !border-white !bg-white text-gray-300 hover:!text-gray-200"
                variant="secondary"
                onClick={() => {
                  setStep(step + 1);
                }}
              >
                Next
              </Button>
            )}
            {/* {step === 2 && (
              <div
                className={`pointer-events-none fixed left-0 top-0 z-20 h-screen w-screen	`}
                ref={ref}
              >
                <Confetti
                  width={width}
                  height={height}
                  numberOfPieces={confettiRun ? 250 : 0}
                  colors={["#F0F4F2", "#19563F", "#FCEEF5", "#F5C7DE"]}
                />
              </div>
            )} */}
          </div>
        )}
      </div>
    </>
  );
};

TrainAiPage.getLayout = (page) => (
  <BrandedSaasUserLayout>{page}</BrandedSaasUserLayout>
);

export default TrainAiPage;

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
}) {
  const session = getCookieFromContext(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel === 5 && session._id !== "113589215262737174259") {
    return {
      props: { key: url },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session._id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  console.log(res.status);

  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access?company=${ctx.query.slug}`,
        permanent: false,
      },
    };
  }

  if (res.status === 404) {
    return {
      redirect: {
        destination: `/create-company`,
        permanent: false,
      },
    };
  }

  const _companyAuth = await res.json();

  if (
    res.status === 200 &&
    _companyAuth.company.type !== "COMMUNITY" &&
    (!_companyAuth.company.stripe ||
      !_companyAuth.company.stripe.product ||
      !_companyAuth.company.stripe.product.ID)
  ) {
    return {
      redirect: {
        destination: `/dashboard/${_companyAuth.company.slug}/subscription`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}
