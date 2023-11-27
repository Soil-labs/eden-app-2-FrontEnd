import { gql, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
// import { UPDATE_MEMBER } from "@eden/package-graphql";
// import { Mutation } from "@eden/package-graphql/generated";
import {
  AppUserLayout,
  Button,
  // EdenAiProcessingModal,
  Modal,
  // ProgressBarGeneric,
  // RawDataGraph,
  SEO,
  Wizard,
  WizardStep,
} from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

import ConnectTelegramContainer from "@/components/interview/ConnectTelegramContainer";
// import { toast } from "react-toastify";
// import ApplicationStepContainer from "@/components/interview/ApplicationContainer";
import SearchEdenContainer from "@/components/interview/SearchEdenContainer";

// import ProfileQuestionsContainer from "@/components/interview/ProfileQuestions";
// import UploadCVContainer from "@/components/interview/UploadCVContainer";
import type { NextPageWithLayout } from "../../../_app";

const HomePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { positionID, panda } = router.query;
  // eslint-disable-next-line no-unused-vars
  const [interviewEnded, setInterviewEnded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [cvEnded, setCvEnded] = useState<Boolean>(false);
  // const [insightsChecked, setInsightsChecked] = useState<Boolean>(false);
  const [step, setStep] = useState<number>(0);
  // const [showStartInterviewModal, setShowStartInterviewModal] =
  //   useState<boolean>(false);
  const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
  // const [titleRole, setTitleRole] = useState<string>("");
  // const [topSkills, setTopSkills] = useState<any[]>([]);
  // const [content, setContent] = useState<{
  //   matchPercentage: number | null;
  //   improvementPoints: string | null;
  //   strongFit: string | null;
  //   growthAreas: string | null;
  //   experienceAreas: string | null;
  // }>({
  //   matchPercentage: null,
  //   improvementPoints: null,
  //   strongFit: null,
  //   growthAreas: null,
  //   experienceAreas: null,
  // });
  // const [generalDetails] = useState<any>({});

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

  // const handleCvEnd = () => {
  //   // console.log("cv end");
  //   setCvEnded(true);
  //   setStep(1);
  // };

  const handleInterviewEnd = () => {
    // console.log("interview end");
    setInterviewEnded(true);
  };

  // const [updateMember] = useMutation(
  //   UPDATE_MEMBER,
  //   {
  //     onCompleted({ updateMember }: Mutation) {
  //       if (!updateMember) console.log("updateMember is null");
  //       setStep(step + 1);
  //     },
  //     onError: () => {
  //       toast.error("Server error");
  //     },
  //   }
  // );

  // const handleGeneralDetailsSubmit = () => {
  //   const fields: UpdateMemberInput = {};

  //   if (generalDetails?._id) fields._id = generalDetails?._id;
  //   if (generalDetails?.budget?.perHour)
  //     fields.budget = { perHour: Number(generalDetails?.budget?.perHour || 0) };
  //   if (generalDetails?.hoursPerWeek)
  //     fields.hoursPerWeek = Number(generalDetails?.hoursPerWeek || 0);
  //   if (generalDetails?.location) fields.location = generalDetails?.location;
  //   if (generalDetails?.timeZone) fields.timeZone = generalDetails?.timeZone;
  //   if (generalDetails?.experienceLevel?.total)
  //     fields.experienceLevel = fields.experienceLevel
  //       ? {
  //         ...fields.experienceLevel,
  //         total: +generalDetails?.experienceLevel?.total,
  //       }
  //       : {
  //         total: +generalDetails?.experienceLevel?.total,
  //       };
  //   if (generalDetails?.experienceLevel?.years)
  //     fields.experienceLevel = fields.experienceLevel
  //       ? {
  //         ...fields.experienceLevel,
  //         years: +generalDetails?.experienceLevel?.years,
  //       }
  //       : {
  //         years: +generalDetails?.experienceLevel?.years,
  //       };

  //   updateMember({
  //     variables: {
  //       fields: fields,
  //     },
  //   });
  // };

  // function handleStartInterviewStep() {
  //   setShowStartInterviewModal(true);
  // }

  function handleFinishInterviewStep() {
    setShowInterviewModal(true);
  }

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
      <div className="scrollbar-hide relative mx-auto h-screen w-full max-w-7xl overflow-y-scroll p-8">
        {/* <Card className="mx-auto mt-3 h-[88vh] w-full max-w-7xl overflow-y-scroll rounded-none px-4 pt-4"> */}
        {currentUser && (
          <div className="relative h-full w-full">
            {step === 0 && (
              <div className="pt-8">
                <h1 className="text-edenGreen-600 text-center">
                  {findPositionData?.findPosition?.company.type === "COMMUNITY"
                    ? `Let's get you onboarded to the ${findPositionData?.findPosition?.name}, ${currentUser.discordName}!`
                    : `Hey ${currentUser.discordName}!`}
                </h1>
                <p className="text-edenGray-900 text-center">
                  {findPositionData?.findPosition?.company.type === "COMMUNITY"
                    ? `You're about to do an interview with Eden to join ${findPositionData?.findPosition?.company?.name}.`
                    : `Congrats! You've been selected to do an interview with ${findPositionData?.findPosition?.company?.name} for the ${findPositionData?.findPosition?.name} role!`}
                </p>
              </div>
            )}
            <div
              className={classNames(
                "w-full",
                step === 0 ? "h-[calc(100%-6rem)]" : "h-full"
              )}
            >
              <Wizard
                showStepsHeader={step !== 0}
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
                  label={"INTERVIEW"}
                  nextButton={
                    <Button
                      variant="primary"
                      className="mx-auto"
                      onClick={() => {
                        handleFinishInterviewStep();
                      }}
                    >
                      Finish Interview
                    </Button>
                  }
                >
                  <div className="mx-auto h-full max-w-lg">
                    <SearchEdenContainer handleEnd={handleInterviewEnd} />
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
                            setStep(step + 1);
                          }}
                        >
                          Finish Interview
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </WizardStep>

                <WizardStep navigationDisabled={!panda} label={"ALL DONE"}>
                  {/* <FinalContainer /> */}
                  <ConnectTelegramContainer
                    candidateTelegramID={
                      currentUser.conduct?.telegramChatID || undefined
                    }
                  />
                </WizardStep>

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
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

import { IncomingMessage, ServerResponse } from "http";
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
