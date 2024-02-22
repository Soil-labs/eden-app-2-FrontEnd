import "react-datepicker/dist/react-datepicker.css";

import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { UPDATE_MEMBER } from "@eden/package-graphql";
import { Mutation, UpdateMemberInput } from "@eden/package-graphql/generated";
import {
  BrandedAppUserLayout,
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
import { getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";
import mixpanel from "mixpanel-browser";
import Head from "next/head";
import { useRouter } from "next/router";
import { forwardRef, useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { AiOutlineFile } from "react-icons/ai";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { TiStarHalfOutline } from "react-icons/ti";
import { toast } from "react-toastify";

import ApplicationStepContainer from "@/components/interview/ApplicationContainer";
// import ConnectTelegramContainer from "@/components/interview/ConnectTelegramContainer";
import InterviewEdenAIStepContainer from "@/components/interview/InterviewContainer";
import ProfileQuestionsContainer from "@/components/interview/ProfileQuestions";
import UploadCVContainer from "@/components/interview/UploadCVContainer";

import type { NextPageWithLayout } from "../../../_app";

const SUBMIT_CANDIDATE_POSITION = gql`
  mutation SubmitCandidatePosition($fields: submitCandidatePositionInput) {
    submitCandidatePosition(fields: $fields) {
      _id
      name
    }
  }
`;

const InterviewPage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();

  useAuthGate();

  const { positionID, panda } = router.query;
  // eslint-disable-next-line no-unused-vars
  const [interviewEnded, setInterviewEnded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [cvEnded, setCvEnded] = useState<Boolean>(false);
  const [insightsChecked, setInsightsChecked] = useState<Boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [showStartInterviewModal, setShowStartInterviewModal] =
    useState<boolean>(false);
  const [submittingGeneralDetails, setSubmittingGeneralDetails] =
    useState<boolean>(false);
  const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
  const [titleRole, setTitleRole] = useState<string>("");
  const [topSkills, setTopSkills] = useState<any[]>([]);
  const [content, setContent] = useState<{
    matchPercentage: number | null;
    improvementPoints: string | null;
    strongFit: string | null;
    growthAreas: string | null;
    experienceAreas: string | null;
  }>({
    matchPercentage: null,
    improvementPoints: null,
    strongFit: null,
    growthAreas: null,
    experienceAreas: null,
  });
  const [generalDetails, setGeneralDetails] = useState<any>({});
  const [startDate, setStartDate] = useState<Date | null>(null);
  //remove later
  const [scheduleState, setScheduleState] = useState("first");

  // console.log("cvEnded = ", cvEnded);
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
  });

  useEffect(() => {
    mixpanel.track("Interview > Start");
  }, []);

  const handleCvEnd = () => {
    // console.log("cv end");
    setCvEnded(true);
    mixpanel.track("Interview > CV Uploaded");
    setStep(1);
  };

  const handleInterviewEnd = () => {
    // console.log("interview end");
    setInterviewEnded(true);
  };

  const [submitCandidatePosition, {}] = useMutation(SUBMIT_CANDIDATE_POSITION, {
    onCompleted({}: Mutation) {
      mixpanel.track("Interview > Application submitted");
      setSubmittingGeneralDetails(false);
      setStep(step + 1);
    },
    onError: () => {
      toast.error("Server error");
      setSubmittingGeneralDetails(false);
    },
  });

  const [updateMember] = useMutation(UPDATE_MEMBER, {
    onCompleted({}: Mutation) {
      // if (!updateMember) console.log("updateMember is null");
      // setStep(step + 1);
      submitCandidatePosition({
        variables: {
          fields: { candidateID: currentUser?._id, positionID: positionID },
        },
      });
    },
    onError: () => {
      toast.error("Server error");
      setSubmittingGeneralDetails(false);
    },
  });

  const handleGeneralDetailsSubmit = () => {
    const fields: UpdateMemberInput = {};

    if (generalDetails?._id) fields._id = generalDetails?._id;
    if (generalDetails?.budget?.perHour)
      fields.budget = { perHour: Number(generalDetails?.budget?.perHour || 0) };
    if (generalDetails?.hoursPerWeek)
      fields.hoursPerWeek = Number(generalDetails?.hoursPerWeek || 0);
    if (generalDetails?.location) fields.location = generalDetails?.location;
    if (generalDetails?.timeZone) fields.timeZone = generalDetails?.timeZone;
    if (generalDetails?.experienceLevel?.total)
      fields.experienceLevel = fields.experienceLevel
        ? {
            ...fields.experienceLevel,
            total: +generalDetails?.experienceLevel?.total,
          }
        : {
            total: +generalDetails?.experienceLevel?.total,
          };
    if (generalDetails?.experienceLevel?.years)
      fields.experienceLevel = fields.experienceLevel
        ? {
            ...fields.experienceLevel,
            years: +generalDetails?.experienceLevel?.years,
          }
        : {
            years: +generalDetails?.experienceLevel?.years,
          };

    setSubmittingGeneralDetails(true);

    updateMember({
      variables: {
        fields: fields,
      },
    });
  };

  function handleStartInterviewStep() {
    setShowStartInterviewModal(true);
  }

  function handleFinishInterviewStep() {
    setShowInterviewModal(true);
  }

  const onCloseHandler = () => {
    setTimeout(() => {
      setShowStartInterviewModal(false);
      setScheduleState("first");
      setStartDate(null);
    }, 800);
  };

  //Calendar stuff, need to turn this into a component later

  interface CustomInputProps {
    value?: string;
    onClick?: () => void;
  }

  const newEndDateHandler = () => {
    if (!startDate) return null;

    const newEndDate = new Date(startDate);

    newEndDate.setMinutes(startDate.getMinutes() + 30);

    console.log("newEndDate", newEndDate);

    return newEndDate;
  };
  const constructLink = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (startDate) {
      const startDateFormat =
        startDate.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";

      console.log(startDate);

      const newEndDate = newEndDateHandler();

      if (!newEndDate) return;

      const endDateFormat =
        newEndDate.toISOString().replace(/[-:.]/g, "").slice(0, 15) + "Z";

      const interviewLink = `https://developer-dao.joineden.ai/interview/${positionID}`;

      const link = `https://calendar.google.com/calendar/u/0/r/eventedit?text=Interview+with+Eden&dates=${startDateFormat}/${endDateFormat}&details=A+30+min+interview+with+Eden+AI.+Join+via+this+link:+<a href="${interviewLink}">Click Here!</a>&location=${interviewLink}&recur=RRULE:FREQ=WEEKLY;UNTIL=20231231T000000Z`;

      setTimeout(() => {
        setScheduleState("third");
      }, 300);

      if (link !== "") {
        event.preventDefault();
        window.open(link, "_blank");
      }
    }
  };

  const ExampleCustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
    ({ value, onClick }, ref) => (
      <h3 className="whitespace-nowrap">
        <button
          className="bg-edenPink-300 text-edenGreen-500  h-8 w-52 min-w-fit rounded-lg border border-neutral-400 py-[0.16rem] pl-10 pr-6 "
          onClick={onClick}
          ref={ref}
        >
          {value}
        </button>
      </h3>
    )
  );

  ExampleCustomInput.displayName = "ExampleCustomInput";

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
      <div className="mx-auto h-[calc(100vh-5rem)] w-full max-w-7xl px-2">
        <div className="scrollbar-hide relative h-full w-full overflow-y-scroll rounded-lg bg-white p-6">
          {/* <Card className="mx-auto mt-3 h-[88vh] w-full max-w-7xl overflow-y-scroll rounded-none px-4 pt-4"> */}
          {currentUser && (
            <div className="relative h-full w-full">
              <div className={"h-full w-full"}>
                <Wizard
                  branded
                  showStepsHeader
                  forceStep={step}
                  canPrev={false}
                  onStepChange={(_stepNum: number) => {
                    if (_stepNum !== step) {
                      setStep(_stepNum);
                    }
                  }}
                  animate
                >
                  <WizardStep
                    navigationDisabled={!panda}
                    nextDisabled={!cvEnded}
                    label={
                      step === 0 ? (
                        <span>
                          <AiOutlineFile
                            size={"0.8rem"}
                            className="-mt-0.5 mr-1 inline-block"
                          />
                          CV
                        </span>
                      ) : (
                        "CV"
                      )
                    }
                    nextButton={
                      <button
                        disabled={!cvEnded}
                        className="disabled:!border-edenGray-500 disabled:!bg-edenGray-100 disabled:!text-edenGray-500 -mx-4 -mb-4 box-border w-[calc(100%+2rem)] max-w-sm rounded-md border border-black bg-black p-2 font-normal text-white hover:bg-white hover:text-black disabled:cursor-not-allowed md:mx-auto"
                        onClick={handleStartInterviewStep}
                        style={{
                          fontFamily: "Roboto, sans-serif",
                        }}
                      >
                        Get Started!
                      </button>
                    }
                  >
                    <UploadCVContainer
                      setTitleRole={setTitleRole}
                      setTopSkills={setTopSkills}
                      setContent={setContent}
                      handleCvEnd={handleCvEnd}
                      position={findPositionData?.findPosition}
                      editMode={!!panda}
                    />
                  </WizardStep>
                  <WizardStep
                    navigationDisabled={!panda}
                    label={
                      step === 1 ? (
                        <span>
                          <TiStarHalfOutline
                            size={"0.9rem"}
                            className="-mt-1 mr-1 inline-block"
                          />
                          Insights
                        </span>
                      ) : (
                        "Insights"
                      )
                    }
                    nextDisabled={!insightsChecked}
                    nextButton={
                      <button
                        disabled={!insightsChecked}
                        className="disabled:!border-edenGray-500 disabled:!bg-edenGray-100 disabled:!text-edenGray-500 -mx-4 -mb-4 box-border w-[calc(100%+2rem)] max-w-sm rounded-md border border-black bg-black p-2 font-normal text-white hover:bg-white hover:text-black disabled:cursor-not-allowed md:mx-auto"
                        onClick={handleStartInterviewStep}
                        style={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        Start Interview
                      </button>
                    }
                  >
                    <ApplicationStepContainer
                      topSkills={topSkills}
                      titleRole={titleRole}
                      position={findPositionData?.findPosition}
                      content={content}
                    />
                    <div className="absolute -bottom-10 left-0 flex w-full justify-center rounded-md bg-white px-4 py-2 text-xs text-gray-500">
                      <input
                        type="checkbox"
                        id="consent"
                        onChange={(e) => {
                          setInsightsChecked(e.target.checked);
                        }}
                        className="mr-3"
                      />
                      <label htmlFor="consent">
                        I acknowledge that my Resume and responses can be stored
                        and shared with hiring managers by Eden
                        <span className="mx-1 text-red-600">*</span>
                      </label>
                    </div>
                    <Modal
                      open={showStartInterviewModal}
                      onClose={onCloseHandler}
                    >
                      {scheduleState === "first" && (
                        <div className="mx-auto max-w-sm px-4 py-12">
                          <h2 className="text-md text-center font-normal">
                            {"You're about to start the interview!"}
                          </h2>
                          <p className="text-edenGray-700 mb-8 text-center text-sm">
                            {
                              "This chat based interview will take around 10 minutes. Just Be your smashing self :)"
                            }
                          </p>
                          <div className="flex flex-col">
                            <button
                              className="disabled:!border-edenGray-500 disabled:!bg-edenGray-100 disabled:!text-edenGray-500 mb-4 box-border w-full max-w-sm rounded-md border border-black bg-black p-2 font-normal text-white hover:bg-white hover:text-black disabled:cursor-not-allowed md:mx-auto"
                              onClick={() => {
                                setShowStartInterviewModal(false);
                                mixpanel.track(
                                  "Interview > Start AI Interview"
                                );
                                setStep(step + 1);
                              }}
                              style={{ fontFamily: "Roboto, sans-serif" }}
                            >
                              {"Let's begin!"}
                            </button>
                            <p
                              className="text-edenGray-700 hover:!text-edenGray-500 cursor-pointer text-center underline"
                              onClick={() => setScheduleState("second")}
                            >
                              Schedule for later
                            </p>
                          </div>
                        </div>
                      )}
                      {scheduleState === "second" && (
                        <div className="mt-7 flex flex-col items-center justify-center py-48  ">
                          <div className="mb-4 flex flex-col items-center">
                            <h1 className=" text-edenGreen-600 text-3xl font-bold">
                              Pick a date.
                            </h1>
                          </div>

                          <div className="mb-12">
                            <DatePicker
                              className=" rounded-md border border-black pl-3"
                              selected={startDate}
                              onChange={(date: any) => setStartDate(date)}
                              timeInputLabel="Time:"
                              dateFormat="MM/dd/yyyy h:mm aa"
                              showTimeSelect
                              timeIntervals={15}
                              popperPlacement="top-start"
                              customInput={<ExampleCustomInput />}
                              showIcon
                            />
                          </div>
                          {!startDate ? (
                            <Button className="" variant="secondary" disabled>
                              add to calendar{" "}
                            </Button>
                          ) : (
                            <Button
                              className=""
                              variant="secondary"
                              onClick={constructLink}
                            >
                              add to calendar{" "}
                            </Button>
                          )}
                        </div>
                      )}
                      {scheduleState === "third" && (
                        <div className="flex h-60 flex-col items-center justify-center ">
                          <h1 className="text-edenGreen-500 text-4xl">
                            {"See You Then! :)"}
                          </h1>
                        </div>
                      )}
                    </Modal>
                  </WizardStep>
                  {/* <WizardStep navigationDisabled nextDisabled={!interviewEnded} label={"chat"}> */}
                  <WizardStep
                    navigationDisabled={!panda}
                    label={
                      step === 2 ? (
                        <span>
                          <IoChatbubbleEllipsesOutline
                            size={"0.8rem"}
                            className="-mt-1 mr-1 inline-block"
                          />
                          Insights
                        </span>
                      ) : (
                        "Interview"
                      )
                    }
                    nextButton={
                      <button
                        disabled={!cvEnded}
                        className="disabled:!border-edenGray-500 disabled:!bg-edenGray-100 disabled:!text-edenGray-500 -mx-4 -mb-4 box-border w-[calc(100%+2rem)] max-w-sm rounded-md border border-black bg-black p-2 font-normal text-white hover:bg-white hover:text-black disabled:cursor-not-allowed md:mx-auto"
                        onClick={() => {
                          handleFinishInterviewStep();
                        }}
                        style={{
                          fontFamily: "Roboto, sans-serif",
                        }}
                      >
                        Finish Interview
                      </button>
                    }
                  >
                    <div className="mx-auto h-full max-w-lg">
                      <InterviewEdenAIStepContainer
                        handleEnd={handleInterviewEnd}
                      />
                    </div>

                    <Modal open={showInterviewModal} closeOnEsc={false}>
                      <div className="px-4 py-8">
                        <h2 className="mb-12 text-center">
                          Are you sure you want to end the interview?
                        </h2>
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
                              mixpanel.track("Interview > End AI Interview");
                              setStep(step + 1);
                            }}
                          >
                            Finish Interview
                          </Button>
                        </div>
                      </div>
                    </Modal>
                  </WizardStep>

                  <WizardStep
                    navigationDisabled={!panda}
                    label={
                      step === 3 ? (
                        <span>
                          <BsFillCheckSquareFill
                            size={"0.8rem"}
                            className="-mt-0.5 mr-1 inline-block"
                          />
                          Insights
                        </span>
                      ) : (
                        "Details"
                      )
                    }
                    nextButton={
                      <button
                        className="disabled:!border-edenGray-500 disabled:!bg-edenGray-100 disabled:!text-edenGray-500 -mx-4 -mb-4 box-border w-[calc(100%+2rem)] max-w-sm rounded-md border border-black bg-black p-2 font-normal text-white hover:bg-white hover:text-black disabled:cursor-not-allowed md:mx-auto"
                        onClick={() => {
                          handleGeneralDetailsSubmit();
                        }}
                        disabled={
                          !(
                            generalDetails?.budget?.perHour &&
                            generalDetails?.hoursPerWeek &&
                            generalDetails?.location &&
                            generalDetails?.timeZone &&
                            (generalDetails?.experienceLevel?.years ||
                              generalDetails?.experienceLevel?.years === 0) &&
                            (generalDetails?.experienceLevel?.total ||
                              generalDetails?.experienceLevel?.years === 0)
                          )
                        }
                        style={{
                          fontFamily: "Roboto, sans-serif",
                        }}
                      >
                        Submit Application
                      </button>
                    }
                  >
                    <ProfileQuestionsContainer
                      onChange={(data) => {
                        setGeneralDetails(data);
                      }}
                    />
                    {submittingGeneralDetails && (
                      <EdenAiProcessingModal
                        title="Saving data"
                        open={submittingGeneralDetails}
                      />
                    )}
                  </WizardStep>
                  <WizardStep
                    navigationDisabled={!panda}
                    label={
                      step === 4 ? (
                        <span>
                          <TbHeart
                            size={"0.9rem"}
                            className="-mt-0.5 mr-1 inline-block"
                          />
                          Insights
                        </span>
                      ) : (
                        "All done"
                      )
                    }
                  >
                    <ConfirmEmailContainer
                      email={currentUser.conduct?.email || ""}
                      position={findPositionData?.findPosition!}
                    />
                  </WizardStep>
                  {/* <WizardStep navigationDisabled={!panda} label={"ALL DONE"}>
                  <FinalContainer />
                  <ConnectTelegramContainer
                    candidateTelegramID={
                      currentUser.conduct?.telegramChatID || undefined
                    }
                  />
                </WizardStep> */}

                  {/* <WizardStep label={"end"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-8 text-2xl font-medium">Thanks</h2>
              </section>
            </WizardStep> */}
                </Wizard>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

InterviewPage.getLayout = (page) => (
  <BrandedAppUserLayout>{page}</BrandedAppUserLayout>
);

export default InterviewPage;

import { BsFillCheckSquareFill } from "react-icons/bs";
import { TbHeart } from "react-icons/tb";

import ConfirmEmailContainer from "@/components/interview/ConfirmEmailContainer";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = getCookieFromContext(ctx);

  const url = (ctx as any).req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${encodeURIComponent(url)}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

// ------- Interview Chat --------

const FIND_POSITION = gql`
  query ($fields: findPositionInput) {
    findPosition(fields: $fields) {
      _id
      name
      company {
        name
        type
      }
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
        }
      }
      positionsRequirements {
        roleDescription
        benefits
      }
      generalDetails {
        yearlySalary {
          min
          max
        }
      }
    }
  }
`;
