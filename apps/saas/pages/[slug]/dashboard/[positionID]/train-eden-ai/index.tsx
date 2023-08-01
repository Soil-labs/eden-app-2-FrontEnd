import { gql, useMutation, useQuery } from "@apollo/client";
import { CompanyContext, UserContext } from "@eden/package-context";
import {
  Members,
  Mutation,
  Position,
  PrioritiesType,
  TradeOffsType,
} from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  Button,
  ChatMessage,
  EdenAiProcessingModal,
  EdenTooltip,
  FillSocialLinks,
  // CountdownTimer,
  InterviewEdenAI,
  Loading,
  // ProgressBarGeneric,
  // RawDataGraph,
  SEO,
  Wizard,
  WizardStep,
} from "@eden/package-ui";
import { Tab } from "@headlessui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { Controller, useForm } from "react-hook-form";
import { SlLocationPin } from "react-icons/sl";

// import { rawDataPersonProject } from "../../utils/data/rawDataPersonProject";
import type { NextPageWithLayout } from "../../../../_app";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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

const UPDATE_POSITION = gql`
  mutation ($fields: updatePositionInput!) {
    updatePosition(fields: $fields) {
      _id
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
        }
      }
    }
  }
`;

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

const TrainAiPage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const { company, getCompanyFunc } = useContext(CompanyContext);
  const router = useRouter();
  const { positionID } = router.query;

  // eslint-disable-next-line no-unused-vars
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [step, setStep] = useState<number>(0);
  // const [cvEnded, setCvEnded] = useState<Boolean>(false);
  // const [titleRole, setTitleRole] = useState(null);
  // const [topSkills, setTopSkills] = useState([]);

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
    onCompleted(data) {
      setValue("position", data.findPosition);
    },
  });

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<any>({
    defaultValues: { position: "", pastedText: "" },
  });

  const handleInterviewEnd = () => {
    // console.log("interview end");
    setInterviewEnded(true);
  };

  // const [webpageLink, setWebpageLink] = useState("");
  // const [webPageText, setWebPageText] = useState("");
  const [scraping, setScraping] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [report, setReport] = useState<string | null>(null);

  const [interviewQuestionsForPosition, setInterviewQuestionsForPosition] =
    useState<Question[]>([]);

  // const { currentUser } = useContext(UserContext);

  const [websiteToMemoryCompany] = useMutation(WEBPAGE_TO_MEMORY, {
    onCompleted({ websiteToMemoryCompany }) {
      console.log(
        "websiteToMemoryCompany.report",
        websiteToMemoryCompany.report
      );
      let jobDescription = websiteToMemoryCompany.report.replace(/<|>/g, "");

      //Change - to •
      jobDescription = jobDescription.replace(/-\s/g, "• ");

      setReport(jobDescription);

      setScraping(false);

      let questionsChange =
        websiteToMemoryCompany.interviewQuestionsForPosition.map(
          (question: any) => {
            return {
              _id: question?.originalQuestionID,
              content: question?.personalizedContent,
              bestAnswer: "",
            };
          }
        );

      questionsChange = questionsChange.filter((question: any) => {
        return question._id != null;
      });

      setInterviewQuestionsForPosition(questionsChange);
    },
  });

  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onCompleted() {
      getCompanyFunc();
    },
  });

  // const handleLinkSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setScraping(true);

  //   const queryParams = new URLSearchParams({ url: webpageLink }).toString();

  //   try {
  //     const response = await fetch(
  //       `/api/webpage_scraper/webpage_scraper?${queryParams}`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //     if (!response.ok) {
  //       let error;

  //       try {
  //         const { error: serverError } = await response.json();

  //         error = serverError;
  //       } catch (jsonError) {
  //         error = "An error occurred while decoding the response JSON";
  //       }
  //       setError(`HTTP error! status: ${response.status}, error: ${error}`);
  //       throw new Error(
  //         `HTTP error! status: ${response.status}, error: ${error}`
  //       );
  //     }

  //     console.log("API response:", response);

  //     const { textResponse } = await response.json();

  //     websiteToMemoryCompany({
  //       variables: {
  //         // fields: { message: textResponse, userID: currentUser?._id },
  //         fields: {
  //           message: textResponse,
  //           positionID: positionID,
  //         },
  //       },
  //     });

  //     // setReport(textResponse);
  //   } catch (error) {
  //     setError(
  //   `An error occurred while fetching the LinkedIn profile: ${
  //     (error as Error).message
  //   }

  //   Please copy the text from the job post page manually and paste it in the textfield below`
  // );
  //   }
  // };

  const handleDescriptionStepSubmit = async () => {
    const _pastedText = getValues("pastedText");

    setScraping(true);

    if (_pastedText !== "") {
      try {
        await Promise.all([
          websiteToMemoryCompany({
            variables: {
              fields: { message: _pastedText, positionID: positionID },
            },
          }),
          updatePosition({
            variables: {
              fields: {
                _id: positionID,
                name: getValues("position.name"),
                companyID: company?._id,
              },
            },
          }),
        ]);

        setStep(step + 1);
      } catch {
        toast.error("Couldn't save data");
      }
    }

    setScraping(false);
  };

  // eslint-disable-next-line no-unused-vars
  const handlePrioritiesStepSubmit = async () => {
    const _positionsRequirements = getValues("positionsRequirements");

    setScraping(true);
    try {
      const _fields = {
        _id: positionID,
        companyID: company?._id,
        positionsRequirements: {
          priorities: _positionsRequirements.priorities,
          tradeOffs: _positionsRequirements.tradeOffs,
        },
      };

      updatePosition({
        variables: {
          fields: _fields,
        },
      }),
        setStep(step + 1);
    } catch {
      toast.error("Couldn't save data");
    }

    setScraping(false);
  };

  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleCopyLink = (positionID: string) => {
    // const url = window.location.href;
    const url = window.location.origin + "/interview/" + positionID;

    navigator.clipboard.writeText(url);
    setNotificationOpen(true);
    setTimeout(() => {
      setNotificationOpen(false);
    }, 3000);
  };

  // ---- confetti setup ----
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [confettiRun, setConfettiRun] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (step === 6) {
      setConfettiRun(true);
      // @ts-ignore
      setWidth(ref.current?.clientWidth || 0);
      // @ts-ignore
      setHeight(ref.current?.clientHeight || 0);
      setTimeout(() => {
        setConfettiRun(false);
      }, 2500);
    }
  }, [step]);

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:3442218,hjsv:6};
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
        className="relative mx-auto h-screen w-full max-w-5xl overflow-y-scroll scrollbar-hide p-8"
      >
        {currentUser && (
          <div className="h-full w-full">
            {/* <div className="absolute left-0 top-0 w-full">
              <ProgressBarGeneric progress={progress} />
            </div> */}
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
              <WizardStep
                label={"Description"}
                navigationDisabled
                nextDisabled
                nextButton={
                  <Button
                    loading={scraping}
                    variant="secondary"
                    // type="submit"
                    className="ml-auto"
                    onClick={() => {
                      handleDescriptionStepSubmit();
                    }}
                    disabled={!watch("position.name") || !watch("pastedText")}
                  >
                    Save & Continue
                  </Button>
                }
              >
                <div className="flex h-full items-center justify-center">
                  <form className="w-full max-w-[33rem]">
                    <div className="mb-6">
                      <label
                        htmlFor="name"
                        className="text-edenGray-500 mb-2 block text-xs"
                      >
                        Opportunity name
                      </label>
                      <input
                        id="name"
                        {...register("position.name")}
                        placeholder="Type name here..."
                        className="border-edenGray-100 block w-full rounded-md border px-4 py-2 text-sm"
                        onFocus={(event) => {
                          event.target.select();
                        }}
                      />
                    </div>

                    <div className="mb-6">
                      <label className="text-edenGray-500 mb-2 block text-xs">
                        Copy/paste your job description from LinkedIn,
                        Greenhouse...
                      </label>

                      <textarea
                        {...register("pastedText")}
                        // onChange={handlePastedTextChange}
                        placeholder="This is a sample text..."
                        className="border-edenGray-100 mb-4 block w-full resize-none rounded-md border px-4 pb-20 pt-32 text-sm outline-0"
                        onFocus={(event) => {
                          event.target.select();
                        }}
                      />
                    </div>
                  </form>
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
              </WizardStep>

              {/* <WizardStep nextDisabled={!interviewEnded} label={"chat"}> */}
              <WizardStep label={"Eden Convo"} navigationDisabled={true}>
                <div className="mx-auto h-[70vh] max-w-2xl">
                  <InterviewEdenAIContainer
                    handleEnd={handleInterviewEnd}
                    interviewQuestionsForPosition={
                      interviewQuestionsForPosition
                    }
                  />
                </div>
              </WizardStep>

              <WizardStep
                label={"Priorities & TradeOffs"}
                navigationDisabled={step === 0}
              >
                <div className="mx-auto h-full max-w-5xl">
                  <Controller
                    name={"positionsRequirements"}
                    control={control}
                    render={({ field: { onChange } }) => (
                      <PrioritiesAndTradeOffsContainer
                        position={findPositionData?.findPosition}
                        onChange={onChange}
                      />
                    )}
                  />
                </div>
              </WizardStep>

              <WizardStep label={"Alignment"} navigationDisabled={step === 0}>
                <div className="mx-auto h-full max-w-2xl">
                  <h2 className="mb-4">Complete Checks & Balances List</h2>
                  <p className="text-edenGray-500 mb-8 text-sm">
                    Here&apos;s a list of all the must & nice to haves that I
                    will look for in the candidate based in the info you&apos;ve
                    provided to me. Feel free to edit any line by changing,
                    deleting or adding elements that might be missing.
                  </p>
                  <ProfileQuestionsContainer />
                </div>
              </WizardStep>

              <WizardStep
                label={"Eden Suggestions"}
                navigationDisabled={step === 0}
              >
                <div className="mx-auto h-full max-w-2xl">
                  <h2 className="mb-4 text-xl font-medium">
                    Eden Seed Interview Questions
                  </h2>
                  <p className="mb-8 text-sm leading-tight text-gray-500">
                    Here&apos;s a list of all the questions Eden will ask to
                    understand the candidate. These questions might get adapted
                    in real time based on the information that the candidate
                    already gives to ensure getting the most out of the
                    conversation.
                  </p>
                  <CreateQuestions />
                </div>
              </WizardStep>
              <WizardStep
                label={"Final Details"}
                navigationDisabled={step === 0}
              >
                <div className="mx-auto max-w-3xl text-center">
                  <h2 className="text-xl font-medium">
                    Final Important Details
                  </h2>
                  <p className="text-sm text-zinc-400">
                    All done, this is the final step. Fill in some quick
                    information and we’re off!
                  </p>
                  <FinalFormContainer />
                </div>
              </WizardStep>
              <WizardStep label={"Share Link"} navigationDisabled={step === 0}>
                <div className="flex h-full flex-col items-center justify-center pb-28">
                  <div className="max-w-3xl">
                    <h1 className="text-edenGreen-600 mb-4 text-center">
                      Let&apos;s get the interviews rolling!
                    </h1>
                    <p className="mb-8 text-center">
                      Sit back and relax, we&apos;re all set! Share the link to
                      to whoever you want to kickoff the interview with!
                    </p>
                  </div>
                  <div className="flex w-2/3 justify-center">
                    <div className="border-edenGray-500 mr-2 flex h-12 w-full items-center overflow-x-scroll scrollbar-hide rounded-md border bg-white px-2 text-sm">
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
                    router.push(`/${company?.slug}/dashboard/${positionID}`);
                  }}
                >
                  Continue to Dashboard
                </Button>
              </WizardStep>

              {/* <WizardStep label={"end"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-8 text-2xl font-medium">Thanks</h2>
              </section>
            </WizardStep> */}
            </Wizard>
            {step === 6 && (
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
            )}
          </div>
        )}
      </div>
    </>
  );
};

TrainAiPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default TrainAiPage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { MdContentCopy, MdLink } from "react-icons/md";
import { toast } from "react-toastify";

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
        }
      }
    }
  }
`;

// interface cardsDataType {
//   title: string;
//   trust: number;
//   time: number;
//   completed: boolean;
//   firstMessage: string;
//   experienceTypeID: string;
// }

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

interface InterviewEdenAIContainerProps {
  handleEnd?: () => void;
  interviewQuestionsForPosition?: Question[];
}

const InterviewEdenAIContainer = ({
  handleEnd,
  interviewQuestionsForPosition,
}: InterviewEdenAIContainerProps) => {
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // --------- Position and User ------------
  const { currentUser } = useContext(UserContext);
  const { company } = useContext(CompanyContext);

  // console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { positionID } = router.query;
  // --------- Position and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  // console.log(
  //   "interviewQuestionsForPosition = 223 ",
  //   interviewQuestionsForPosition
  // );

  const { data: findPositionData } = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: positionID == "" || positionID == null,
    onCompleted: (data) => {
      console.log("data = ", data);
      let questionsChange = data.findPosition.interviewQuestionsForPosition.map(
        (question: any) => {
          return {
            _id: question?.originalQuestionID,
            content: question?.originalContent,
            bestAnswer: "",
          };
        }
      );

      questionsChange = questionsChange.filter((question: any) => {
        return question._id != null;
      });

      if (questionsChange.length > 0) {
        setQuestions(questionsChange);
      }
    },
  });

  const [conversationID, setConversationID] = useState<String>("");

  console.log("findPositionData = ", findPositionData);

  const [experienceTypeID] = useState<string>("");

  // eslint-disable-next-line no-unused-vars
  const [chatN, setChatN] = useState<ChatMessage>([]);

  // console.log("chatN = ", chatN);

  // console.log("conversationID = ", conversationID);

  useEffect(() => {
    if (
      interviewQuestionsForPosition &&
      interviewQuestionsForPosition?.length > 0
    ) {
      console.log("Yea I am here = 223");
      setQuestions(interviewQuestionsForPosition);
    }
  }, [interviewQuestionsForPosition]);

  // console.log("questions = 223 -1", questions);
  // console.log(
  //   findPositionData?.findPosition?.questionsToAsk.length,
  //   questions.length,
  //   findPositionData?.findPosition?.questionsToAsk.length
  // );

  return (
    <div className="w-full">
      <div className="relative h-[68vh]">
        {/* <div className="flex justify-center">
          <ProgressBarGeneric
            color="accentColor"
            progress={
              (100 *
                (findPositionData?.findPosition?.questionsToAsk.length -
                  questions.length)) /
              findPositionData?.findPosition?.questionsToAsk.length
            }
          />
        </div> */}
        {
          <InterviewEdenAI
            key={experienceTypeID}
            aiReplyService={AI_INTERVIEW_SERVICES.ASK_EDEN_GPT4_ONLY}
            experienceTypeID={experienceTypeID}
            handleChangeChat={(_chat: any) => {
              setChatN(_chat);
            }}
            sentMessageToEdenAIobj={sentMessageToEdenAIobj}
            setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            placeholder={
              <div className="pt-4">
                <Loading title="Loading Eden AI" />
              </div>
            }
            questions={questions}
            setQuestions={setQuestions}
            userID={currentUser?._id}
            positionID={positionID}
            conversationID={conversationID}
            setConversationID={setConversationID}
            positionTrainEdenAI={true}
            handleEnd={() => {
              if (handleEnd) handleEnd();
            }}
            headerText={`${findPositionData?.findPosition?.name} @ ${company?.name}`}
          />
        }
        {/* <CountdownTimer /> */}
      </div>
      {/* <div className="absolute right-0 top-32 pr-6">
        <span>
          progress{" "}
          {(100 *
            (findPositionData?.findPosition?.questionsToAsk.length -
              questions.length)) /
            findPositionData?.findPosition?.questionsToAsk.length}
        </span>
      </div> */}
    </div>
  );
};

export const FIND_PRIORITIES_TRAIN_EDEN_AI = gql`
  query findPrioritiesTrainEdenAI($fields: findPrioritiesTrainEdenAIInput) {
    findPrioritiesTrainEdenAI(fields: $fields) {
      success
      priorities {
        priority
        reason
      }
      tradeOffs {
        tradeOff1
        tradeOff2
        reason
        selected
      }
    }
  }
`;

interface IPrioritiesAndTradeOffsContainerProps {
  position: Position;
  // eslint-disable-next-line no-unused-vars
  onChange: (val: any) => void;
}

const PrioritiesAndTradeOffsContainer = ({
  position,
  onChange,
}: IPrioritiesAndTradeOffsContainerProps) => {
  const router = useRouter();
  const { positionID } = router.query;
  // const { currentUser } = useContext(UserContext);

  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);

  const [priorities, setPriorities] = useState<PrioritiesType[]>([]);

  const [tradeOffs, setTradeOffs] = useState<TradeOffsType[]>([]);

  // const { register, watch, control, setValue, getValues } = useForm<Members>({
  //   defaultValues: {},
  // });

  // eslint-disable-next-line no-unused-vars
  const { data: findPrioritiesAndTradeOffsData, loading: loadingPriorities } =
    useQuery(FIND_PRIORITIES_TRAIN_EDEN_AI, {
      variables: {
        fields: {
          positionID: positionID,
        },
      },
      skip:
        !!position.positionsRequirements?.tradeOffs &&
        !!position.positionsRequirements?.tradeOffs.length &&
        !!position.positionsRequirements?.priorities &&
        !!position.positionsRequirements?.priorities.length,
      onCompleted({ findPrioritiesTrainEdenAI }) {
        // console.log("findPrioritiesTrainEdenAI = ", findPrioritiesTrainEdenAI);

        setPriorities(findPrioritiesTrainEdenAI.priorities);
        setTradeOffs(
          (findPrioritiesTrainEdenAI?.tradeOffs! as TradeOffsType[]).map(
            (tradeOff: TradeOffsType) => {
              const _selected =
                tradeOff.selected == tradeOff.tradeOff1
                  ? tradeOff.tradeOff1!
                  : tradeOff.tradeOff2!;

              return { ...tradeOff, selected: _selected };
            }
          )! as TradeOffsType[]
        );
      },
    });

  useEffect(() => {
    if (
      position.positionsRequirements?.priorities &&
      position.positionsRequirements?.tradeOffs &&
      position.positionsRequirements?.priorities.length > 0 &&
      position.positionsRequirements?.tradeOffs.length > 0
    ) {
      setPriorities(
        position.positionsRequirements?.priorities! as PrioritiesType[]
      );
      setTradeOffs(
        (position.positionsRequirements?.tradeOffs! as TradeOffsType[]).map(
          (tradeOff: TradeOffsType) => {
            const _selected =
              tradeOff.selected == tradeOff.tradeOff1
                ? tradeOff.tradeOff1!
                : tradeOff.tradeOff2!;

            return { ...tradeOff, selected: _selected };
          }
        )! as TradeOffsType[]
      );
    }
  }, [position.positionsRequirements]);

  const handleSelect = (index: number, option: string) => {
    const newTradeoffs = [...tradeOffs];

    newTradeoffs[index] = { ...newTradeoffs[index], selected: option };
    setTradeOffs(newTradeoffs);
  };

  const permutePriorities = (index1: number, index2: number) => {
    if (
      index1 < 0 ||
      index1 >= priorities.length ||
      index2 < 0 ||
      index2 >= priorities.length
    ) {
      throw new Error("Invalid index");
    }

    const newArray = [...priorities];

    [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];

    setPriorities(newArray);
  };

  useEffect(() => {
    onChange({ priorities: priorities, tradeOffs: tradeOffs });
  }, [priorities, tradeOffs]);

  return (
    <div className="grid h-full w-full grid-cols-12 gap-4">
      {loadingPriorities && (
        <EdenAiProcessingModal
          open={loadingPriorities}
          title="Understanding your Priorities & Tradeoffs"
        >
          <div className="text-center">
            <p>{`As any great recruiter would tell you, I understand the perfect match doesn't exist. It's all about your priorities & tradeoffs - so in a couple of seconds please work with me so we can be super aligned on this!`}</p>
          </div>
        </EdenAiProcessingModal>
      )}
      <section className="bg-edenPink-200 col-span-6 rounded-md px-12 py-4">
        <h2 className="text-edenGreen-600 mb-2 text-center">Key Priorities</h2>
        <p className="mb-6 text-center">
          Here&apos;s what I got your priorities are - please re-arrange as you
          see fit.
        </p>
        <ul className="">
          {priorities &&
            priorities.length > 0 &&
            priorities.map((priority, index) => (
              <li
                key={index}
                className="relative mb-2 cursor-pointer rounded-md bg-white px-4 py-4"
              >
                <EdenTooltip
                  id={priority.reason!.split(" ").join("")}
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
                    <div className="-my-2 mr-4">
                      <div
                        className={classNames(
                          "text-edenGreen-500 hover:text-edenGreen-300",
                          index === 0 ? "hidden" : "",
                          index === priorities.length - 1 ? "" : "-mb-2"
                        )}
                      >
                        <BiChevronUp
                          size={"1.5rem"}
                          onClick={() => {
                            permutePriorities(index, index - 1);
                          }}
                        />
                      </div>
                      <div
                        className={classNames(
                          "text-edenGreen-500 hover:text-edenGreen-300",
                          index === priorities.length - 1 ? "hidden" : "",
                          index === 0 ? "" : "-mt-2"
                        )}
                      >
                        <BiChevronDown
                          size={"1.5rem"}
                          onClick={() => {
                            permutePriorities(index, index + 1);
                          }}
                        />
                      </div>
                    </div>
                    <div className="">
                      {index + 1}. {priority.priority}
                    </div>
                  </div>
                </EdenTooltip>
              </li>
            ))}
        </ul>
      </section>
      <section className="bg-edenPink-200 col-span-6 rounded-md px-12 py-4">
        <h2 className="text-edenGreen-600 mb-2 text-center">Tradeoffs</h2>
        <p className="mb-6 text-center">
          From what I gathered, these are your tradeoff preferences - feel free
          to adjust
        </p>

        <div className="flex flex-col items-center justify-center">
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
                      tradeOffs[index].selected === tradeOff.tradeOff1
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
                          tradeOffs[index].selected === tradeOff.tradeOff1
                        }
                        onChange={() =>
                          handleSelect(index, tradeOff.tradeOff1!)
                        }
                      />
                    </div>
                  </label>
                  <label
                    className={classNames(
                      "col-span-1 mb-2 flex w-full cursor-pointer items-center justify-center px-4 py-2 text-center transition-all ease-in-out",
                      tradeOffs[index].selected === tradeOff.tradeOff2
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
                          tradeOffs[index].selected === tradeOff.tradeOff2
                        }
                        onChange={() =>
                          handleSelect(index, tradeOff.tradeOff2!)
                        }
                      />
                      <span className="">{tradeOff.tradeOff2}</span>
                    </div>
                  </label>
                </div>
              </EdenTooltip>
            ))}
        </div>
      </section>
    </div>
  );
};

export const POSITION_TEXT_CONVO_TO_REPORT = gql`
  mutation ($fields: positionTextAndConvoToReportCriteriaInput!) {
    positionTextAndConvoToReportCriteria(fields: $fields) {
      success
      report
    }
  }
`;

interface IProfileQuestionsContainerProps {}

const ProfileQuestionsContainer = ({}: IProfileQuestionsContainerProps) => {
  const { currentUser } = useContext(UserContext);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [scraping, setScraping] = useState<boolean>(false);

  const [report, setReport] = useState<string | null>(null);

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<Members>({
    defaultValues: { ...currentUser },
  });

  const { positionID } = router.query;

  const [positionTextAndConvoToReportCriteria] = useMutation(
    POSITION_TEXT_CONVO_TO_REPORT,
    {
      onCompleted({ positionTextAndConvoToReportCriteria }) {
        // console.log(
        //   "positionTextAndConvoToReportCriteria = ",
        //   positionTextAndConvoToReportCriteria
        // );

        setScraping(false);

        let jobDescription =
          positionTextAndConvoToReportCriteria.report.replace(/<|>/g, "");

        //Change - to •
        jobDescription = jobDescription.replace(/-\s/g, "• ");

        setReport(jobDescription);
      },
    }
  );

  // const handleClick = () => {
  //   console.log("change =");

  //   setScraping(true);

  //   positionTextAndConvoToReportCriteria({
  //     variables: {
  //       // fields: { message: textResponse, userID: currentUser?._id },
  //       fields: {
  //         positionID: positionID,
  //       },
  //     },
  //   });
  // };

  useEffect(() => {
    if (scraping == false) {
      setScraping(true);

      positionTextAndConvoToReportCriteria({
        variables: {
          // fields: { message: textResponse, userID: currentUser?._id },
          fields: {
            positionID: positionID,
          },
        },
      });
      return () => {
        setScraping(false);
      };
    }
  }, []);

  return (
    <div className="w-full">
      {/* <Button
        variant="primary"
        className="w-fit"
        type="submit"
        onClick={handleClick}
        loading={scraping}
      >
        Recalculate Criteria
      </Button> */}

      {scraping && (
        <EdenAiProcessingModal
          open={scraping}
          title="Compiling candidate checklist"
        >
          <div className="text-center">
            <p>{`These are the criteria you & I will use to benchmark all of the candidates. I'm generating this list based on everything you've just told me prior - of course you'll be able to add, delete & edit!`}</p>
          </div>
        </EdenAiProcessingModal>
      )}
      {report && (
        <div className="whitespace-pre-wrap">
          {convertTextCategoriesToHTML(report)}
        </div>
      )}
    </div>
  );
};

function convertTextCategoriesToHTML(text: string): JSX.Element {
  interface Category {
    name: string;
    bullets: string[];
  }
  const categories: Category[] = [];

  // Split the text into lines
  const lines = text.split("\n");

  let currentCategory: Category | null = null;

  // Process each line
  lines.forEach((line) => {
    // Remove leading/trailing white spaces and colons
    const trimmedLine = line.trim();

    // Check if it's a category line
    if (trimmedLine.startsWith("Category")) {
      const categoryName = trimmedLine
        .substring(trimmedLine.indexOf(":") + 1)
        .trim();

      currentCategory = { name: categoryName, bullets: [] };
      categories.push(currentCategory);
    }

    // Check if it's a bullet point line
    if (trimmedLine.startsWith("•")) {
      if (currentCategory) {
        const bulletText = trimmedLine
          .replace("•", "")
          .substring(trimmedLine.indexOf(":") + 1)
          .trim();

        currentCategory.bullets.push(bulletText);
      }
    }
  });

  // Render the elements
  const elements = categories.map((category, index) => (
    <div key={index} className="mb-6">
      <div className="border-edenGreen-300 flex justify-between border-b px-4">
        <h3 className="text-edenGreen-500 mb-3">{category.name}</h3>
      </div>
      <ul>
        {category.bullets.map((bullet: string, bulletIndex: number) => (
          <li
            className="border-edenGray-100 w-full rounded-md border-b px-4"
            key={bulletIndex}
          >
            <div className="flex w-full columns-2 items-center justify-between py-4">
              <p className="w-full pr-4 text-sm">{bullet}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ));

  // Render the elements inside a div
  return <div>{elements}</div>;
}

export const POSITION_SUGGEST_QUESTIONS = gql`
  mutation ($fields: positionSuggestQuestionsAskCandidateInput!) {
    positionSuggestQuestionsAskCandidate(fields: $fields) {
      success
      questionSuggest {
        question
        IDCriteria
        category
      }
    }
  }
`;

type QuestionSuggest = {
  question: String;
  IDCriteria: String;
};
type QuestionGroupedByCategory = {
  [category: string]: QuestionSuggest[];
};

interface QuestionSuSQL {
  category: string;
  question: string;
  IDCriteria: string;
}

interface ICreateQuestions {}

const CreateQuestions = ({}: ICreateQuestions) => {
  const { currentUser } = useContext(UserContext);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [scraping, setScraping] = useState<boolean>(false);
  const [scrapingSave, setScrapingSave] = useState<boolean>(false);

  const [questions, setQuestions] = useState<QuestionGroupedByCategory>({});

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
    category: string
  ): void => {
    const { name, value } = event.target;

    setQuestions((prevQuestions) => {
      const newQuestions: QuestionGroupedByCategory = { ...prevQuestions };

      newQuestions[category] = newQuestions[category].map((question, i) => {
        if (i === index) {
          return {
            ...question,
            [name]: value,
          };
        }
        return question;
      });

      return newQuestions;
    });
  };

  const handleAddQuestion = (category: string) => {
    setQuestions((prevQuestions: QuestionGroupedByCategory) => ({
      ...prevQuestions,
      [category]: [
        ...prevQuestions[category],
        { question: "", IDCriteria: `b${prevQuestions[category].length + 1}` },
      ],
    }));
  };

  const handleDeleteQuestion = (category: string, position: number) => {
    const _newArr = [...questions[category]];

    _newArr.splice(position, 1);

    setQuestions((prevQuestions: QuestionGroupedByCategory) => ({
      ...prevQuestions,
      [category]: _newArr,
    }));
  };

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<Members>({
    defaultValues: { ...currentUser },
  });

  const { positionID } = router.query;

  const [positionSuggestQuestionsAskCandidate] = useMutation(
    POSITION_SUGGEST_QUESTIONS,
    {
      onCompleted({ positionSuggestQuestionsAskCandidate }) {
        // console.log(
        //   "positionSuggestQuestionsAskCandidate = ",
        //   positionSuggestQuestionsAskCandidate
        // );

        setScraping(false);

        // setQuestions(positionSuggestQuestionsAskCandidate.questionSuggest);

        const questionsWithCategory: QuestionGroupedByCategory = {};

        positionSuggestQuestionsAskCandidate.questionSuggest.forEach(
          (q: QuestionSuSQL) => {
            if (questionsWithCategory[q.category] == undefined) {
              questionsWithCategory[q.category] = [];
            }

            questionsWithCategory[q.category].push({
              question: q.question,
              IDCriteria: q.IDCriteria,
            });
          }
        );

        // console.log("questionsWithCategory = ", questionsWithCategory);
        setQuestions(questionsWithCategory);
      },
    }
  );

  // eslint-disable-next-line no-unused-vars
  const handleClick = () => {
    console.log("change =");

    setScraping(true);

    positionSuggestQuestionsAskCandidate({
      variables: {
        // fields: { message: textResponse, userID: currentUser?._id },
        fields: {
          positionID: positionID,
        },
      },
    });
  };

  useEffect(() => {
    setScraping(true);

    positionSuggestQuestionsAskCandidate({
      variables: {
        // fields: { message: textResponse, userID: currentUser?._id },
        fields: {
          positionID: positionID,
        },
      },
    });
    return () => {
      setScraping(false);
    };
  }, []);

  // console.log("questionsSuggest = ", questionsSuggest);

  const [updateQuestionsPosition] = useMutation(ADD_QUESTIONS_TO_POSITION, {
    // eslint-disable-next-line no-unused-vars
    onCompleted({ updateNodesToMember }: Mutation) {
      // console.log("updateNodesToMember = ", updateNodesToMember);
      setScrapingSave(false);
    },
    // skip: positionID == "" || positionID == null,
  });

  const handleSaveChanges = () => {
    let positionID_ = "";

    if (Array.isArray(positionID)) {
      if (positionID.length > 0) {
        positionID_ = positionID[0];
      }
    } else {
      if (positionID != undefined) {
        positionID_ = positionID;
      }
    }
    if (positionID_ != "") {
      setScrapingSave(true);

      const questionsToAsk: any[] = [];

      // Object.keys(questions).forEach((category) => {
      for (const category in questions) {
        const categoryQuestions = questions[category];

        for (let j = 0; j < categoryQuestions.length; j++) {
          const question = categoryQuestions[j];

          questionsToAsk.push({
            questionContent: question.question,
            bestAnswer: "",
          });
        }
      }
      updateQuestionsPosition({
        variables: {
          fields: {
            positionID: positionID_,
            questionsToAsk: questionsToAsk,
          },
        },
      });
    }
  };

  // console.log("questions 1001= ", questions);

  return (
    <div className="w-full">
      {/* <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleClick}
      >
        Click me
      </button> */}
      {/* <Button
        variant="primary"
        className="w-fit"
        type="submit"
        onClick={handleClick}
        loading={scraping}
      >
        Suggest Questions
      </Button> */}
      {scraping && (
        <EdenAiProcessingModal
          open={scraping}
          title="Generating optimal interview"
        >
          <div className="text-center">
            <p>
              {`I've done 1000s of interviews and I'm currently cross-referencing the best seed questions to ask based on everything you've just told me. You'll be able to add, delete & adapt of course!`}
            </p>
          </div>
        </EdenAiProcessingModal>
      )}
      <Button
        className="absolute bottom-8 right-8 z-30 mx-auto"
        variant={"primary"}
        loading={scrapingSave}
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>
      <div className="">
        {Object.keys(questions).map((category) => (
          <div key={category + questions[category].length}>
            <h2 className="mb-2 text-xl font-medium">{category}</h2>
            {questions[category].map((question, index) => (
              <div key={`${category}_${index}`} className="relative mb-2">
                <textarea
                  name="question"
                  defaultValue={question.question.toString()}
                  onChange={(event) =>
                    handleQuestionChange(event, index, category)
                  }
                  className="w-full resize-none hover:resize focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(category, index)}
                  className="absolute -left-10 top-1 flex h-4 w-4 rotate-45 cursor-pointer items-center justify-center rounded-full border-[2px] border-gray-400 bg-white pb-[2px] font-bold text-gray-400 hover:bg-gray-400 hover:text-white hover:opacity-80"
                >
                  +
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddQuestion(category)}
              className="bg-accentColor mx-auto mb-2 block h-8 w-8 rounded-full font-bold text-white hover:opacity-80"
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface IFinalFormContainerProps {}

const FinalFormContainer = ({}: IFinalFormContainerProps) => {
  return (
    <>
      {/* <form className="grid grid-cols-2 gap-16">
        <div className="col-span-1">
          <div className="mb-2 flex items-center justify-between">
            <label className="w-2/5 pr-2">Targetted Start Date</label>
            <input
              type="date"
              name="targettedStartDate"
              className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
            />
          </div>
          <div className="mb-2 flex items-center justify-between">
            <label className="w-2/5 pr-2">Visa Requirements</label>
            <input
              type="text"
              name="visaRequirements"
              className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
            />
          </div>
          <div className="mb-2 flex items-center justify-between">
            <label className="w-2/5 pr-2">Office Locations</label>
            <input
              type="text"
              name="officeLocations"
              className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
            />
          </div>
          <div className="mb-2 flex items-center justify-between">
            <label className="w-2/5 pr-2">Office Policy</label>
            <select
              name="officePolicy"
              className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
              defaultValue={""}
            >
              <option value={""} disabled hidden>
                Select an option...
              </option>
              <option value="on-site">On site</option>
              <option value="remote">Remote</option>
              <option value="hybrid-1-day-office">Hybrid - 1 day office</option>
              <option value="hybrid-2-day-office">Hybrid - 2 day office</option>
              <option value="hybrid-3-day-office">Hybrid - 3 day office</option>
              <option value="hybrid-4-day-office">Hybrid - 4 day office</option>
            </select>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <label className="w-2/5 pr-2">Contract Type</label>
            <select
              name="contractType"
              className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
              defaultValue={""}
            >
              <option value={""} disabled hidden>
                Select an option...
              </option>
              <option value="fulltime">Full time</option>
              <option value="parttime">Part time</option>
              <option value="freelance">Freelance</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <label className="w-2/5 pr-2">Contract Duration</label>
            <input
              type="text"
              name="contractDuration"
              className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
            />
          </div>
        </div>
        <div className="col-span-1">
          <label>Key Company Links</label>
          <FillSocialLinks />
        </div>
      </form> */}
      <form className="flex items-center justify-center">
        <div className="mt-6 h-96 w-[40rem]  rounded-lg  px-8 pb-8 pt-3">
          <Tab.Group>
            <Tab.List className="  border-edenGreen-300 flex  w-full justify-between border-b ">
              <div className="flex items-start gap-x-6">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "text-edenGreen-400 -mb-px w-full pb-2 text-xs",
                      selected
                        ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                        : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                    )
                  }
                >
                  GENERAL
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "text-edenGreen-400 -mb-px w-full pb-2 text-xs",
                      selected
                        ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                        : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                    )
                  }
                >
                  SOCIALS
                </Tab>
              </div>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="pt-8">
                <div className="flex  gap-x-6">
                  <div className="flex  flex-col items-start text-xs">
                    <label>Targeted Start Date</label>
                    <input
                      type="date"
                      name="targetedStartDate"
                      className="  border-edenGray-100 w-56  rounded-lg border  py-[.45rem] outline-none "
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <label className="text-xs">Visa Required</label>
                    <div className="border-edenGray-100 mt-2 w-24 rounded-lg border bg-white p-2 text-xs ">
                      <select
                        name="visaRequirements"
                        className="w-full outline-none"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex   w-full flex-col items-start pr-2">
                    <label className="text-xs ">Office Policy</label>
                    <div className="border-edenGray-100 mt-2  w-full rounded-lg border bg-white p-2 text-xs">
                      <select
                        name="officeLocations"
                        className="w-full outline-none"
                        defaultValue={""}
                      >
                        <option value={""} disabled hidden>
                          Select an option...
                        </option>
                        <option value="on-site">On site</option>
                        <option value="remote">Remote</option>
                        <option value="hybrid-1-day-office">
                          Hybrid - 1 day office
                        </option>
                        <option value="hybrid-2-day-office">
                          Hybrid - 2 day office
                        </option>
                        <option value="hybrid-3-day-office">
                          Hybrid - 3 day office
                        </option>
                        <option value="hybrid-4-day-office">
                          Hybrid - 4 day office
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative mb-12 mt-6 flex flex-col items-start">
                    <label className="text-xs">Office Locations</label>
                    <div className="mt-2 w-full rounded-lg bg-white text-xs">
                      <SlLocationPin className="absolute bottom-2 left-2 h-5 w-5 " />
                      <input
                        type="text"
                        className=" border-edenGray-100  w-full rounded-lg border p-2 pl-9  outline-none"
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="flex gap-x-8 ">
                  <div className="flex flex-col items-start">
                    <label className="text-xs">Contact Type</label>
                    <div className="border-edenGray-100   mt-2 w-64  rounded-lg border bg-white p-2 text-xs">
                      <select
                        className=" w-full outline-none"
                        name="contractType"
                        defaultValue={""}
                      >
                        <option value={""} disabled hidden>
                          Select an option...
                        </option>
                        <option value="fulltime">Full time</option>
                        <option value="parttime">Part time</option>
                        <option value="freelance">Freelance</option>
                        <option value="intern">Intern</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-start">
                    <label className="text-xs">Contract Duration</label>
                    <div className="border-edenGray-100 mt-2  w-full rounded-lg border bg-white p-2 text-xs">
                      <select
                        className="w-full outline-none "
                        name="contractDuration"
                        defaultValue={""}
                      >
                        <option value={""} disabled hidden>
                          Select duration of contract
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className=" gird grid-cols-2">
                  <FillSocialLinks />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </form>
    </>
  );
};
