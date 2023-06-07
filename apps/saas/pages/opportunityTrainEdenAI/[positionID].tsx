import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  Button,
  Card,
  ChatMessage,
  CountdownTimer,
  InterviewEdenAI,
  ProgressBarGeneric,
  // RawDataGraph,
  SEO,
  TextArea,
  Wizard,
  WizardStep,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";

// import { rawDataPersonProject } from "../../utils/data/rawDataPersonProject";
import type { NextPageWithLayout } from "../_app";

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

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

const HomePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { positionID } = router.query;
  const [interviewEnded, setInterviewEnded] = useState(false);
  // const [cvEnded, setCvEnded] = useState<Boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  // const [titleRole, setTitleRole] = useState(null);
  // const [topSkills, setTopSkills] = useState([]);

  // console.log("cvEnded = ", cvEnded);
  const {
    // data: findPositionData,
    // error: findPositionError,
  } = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: !positionID,
  });

  const handleInterviewEnd = () => {
    console.log("interview end");

    setInterviewEnded(true);
  };

  const handleProgress = (_step: any) => {
    switch (_step) {
      case 1:
        setProgress(25);
        break;
      case 2:
        setProgress(50);
        break;
      case 3:
        setProgress(75);
        break;
      case 4:
        setProgress(100);
        break;
      default:
    }
  };

  const [webpageLink, setWebpageLink] = useState("");
  const [pastedText, setPastedText] = useState("");

  // const [webPageText, setWebPageText] = useState("");
  const [scraping, setScraping] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleWebpageLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWebpageLink(e.target.value);
  };

  const handlePastedTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
  };

  const handleLinkSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setScraping(true);

    const queryParams = new URLSearchParams({ url: webpageLink }).toString();

    try {
      const response = await fetch(
        `/api/webpage_scraper/webpage_scraper?${queryParams}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        let error;

        try {
          const { error: serverError } = await response.json();

          error = serverError;
        } catch (jsonError) {
          error = "An error occurred while decoding the response JSON";
        }
        setError(`HTTP error! status: ${response.status}, error: ${error}`);
        throw new Error(
          `HTTP error! status: ${response.status}, error: ${error}`
        );
      }

      console.log("API response:", response);

      const { textResponse } = await response.json();

      websiteToMemoryCompany({
        variables: {
          // fields: { message: textResponse, userID: currentUser?._id },
          fields: {
            message: textResponse,
            positionID: positionID,
          },
        },
      });

      // setReport(textResponse);
    } catch (error) {
      setError(
        `An error occurred while fetching the LinkedIn profile: ${
          (error as Error).message
        }
        
        Please copy the text from the job post page manually and paste it in the textfield below`
      );
    }
  };

  const handleTextSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setScraping(true);
    console.log("pastedText", pastedText);

    websiteToMemoryCompany({
      variables: {
        fields: { message: pastedText, positionID: positionID },
      },
    });
    setPastedText("");
  };

  console.log("progress = ", progress);
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
      <Card
        className="mx-auto mt-3 w-full max-w-5xl overflow-y-scroll bg-white"
        shadow
      >
        {currentUser && (
          <div className="h-full w-full p-8">
            <div className="absolute left-0 top-0 w-full">
              <ProgressBarGeneric progress={progress} />
            </div>
            <Wizard canPrev={false} onStepChange={handleProgress}>
              <WizardStep label={"welcome0"}>
                <div className="flex flex-col items-center space-y-6">
                  <form
                    className=" flex flex-col items-center  space-y-2"
                    onSubmit={handleLinkSubmit}
                  >
                    <label>Extract Text From Page</label>
                    <input
                      className="w-96 border-2 border-black pl-1"
                      onChange={handleWebpageLinkChange}
                      placeholder="https://www.example.com"
                    />
                    <Button
                      variant="primary"
                      className="w-fit"
                      type="submit"
                      loading={scraping}
                    >
                      Submit Link
                    </Button>
                    {report && (
                      <div className="whitespace-pre-wrap">{report}</div>
                    )}
                    {error && <div className="text-red-500">{error}</div>}
                  </form>
                  <form
                    className="flex w-3/12 flex-col items-center  space-y-2"
                    onSubmit={handleTextSubmit}
                  >
                    <label>Paste the text from the Position Page Here</label>

                    <TextArea
                      value={pastedText}
                      rows={15}
                      onChange={handlePastedTextChange}
                    />
                    <Button variant="primary" type="submit">
                      Submit Text
                    </Button>
                  </form>
                </div>
              </WizardStep>

              <WizardStep nextDisabled={!interviewEnded} label={"chat"}>
                <div className="mx-auto h-[70vh] max-w-lg">
                  <InterviewEdenAIContainer
                    handleEnd={handleInterviewEnd}
                    interviewQuestionsForPosition={
                      interviewQuestionsForPosition
                    }
                  />
                </div>
              </WizardStep>

              <WizardStep label={"profile"}>
                <p className="mb-8 text-center">Just a few questions missing</p>
                <ProfileQuestionsContainer />
              </WizardStep>

              <WizardStep label={"createQuestions"}>
                <p className="mb-8 text-center">Just a few questions missing</p>
                <CreateQuestions />
              </WizardStep>

              {/* <WizardStep label={"end"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-8 text-2xl font-medium">Thanks</h2>
              </section>
            </WizardStep> */}
            </Wizard>
          </div>
        )}
      </Card>
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

  const url = ctx.req.url?.replace("/", "");

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
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

  console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { positionID } = router.query;
  // --------- Position and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  console.log(
    "interviewQuestionsForPosition = ",
    interviewQuestionsForPosition
  );

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

      setQuestions(questionsChange);
    },
  });

  const [conversationID, setConversationID] = useState<String>("");

  // console.log("positionID = ", positionID);

  const [experienceTypeID] = useState<string>("");

  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

  console.log("conversationID = ", conversationID);

  useEffect(() => {
    if (
      interviewQuestionsForPosition &&
      interviewQuestionsForPosition?.length > 0
    ) {
      setQuestions(interviewQuestionsForPosition);
    }
  }, [interviewQuestionsForPosition]);

  return (
    <div className="w-full">
      <div className="relative h-[68vh]">
        <div className="absolute left-0 top-2 z-20 w-full">
          <ProgressBarGeneric
            color="accentColor"
            progress={
              (100 *
                (findPositionData?.findPosition?.questionsToAsk.length -
                  questions.length)) /
              findPositionData?.findPosition?.questionsToAsk.length
            }
          />
        </div>
        {
          <InterviewEdenAI
            key={experienceTypeID}
            aiReplyService={AI_INTERVIEW_SERVICES.INTERVIEW_EDEN_AI}
            experienceTypeID={experienceTypeID}
            handleChangeChat={(_chat: any) => {
              setChatN(_chat);
            }}
            sentMessageToEdenAIobj={sentMessageToEdenAIobj}
            setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            placeholder={
              <p className="bg-accentColor rounded-lg p-1 text-center font-medium">
                Hi! I&apos;m Eden AI. Say &quot;Hello&quot; to start the
                interview
              </p>
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
          />
        }
      </div>
      <CountdownTimer />
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

import { Members } from "@eden/package-graphql/generated";
import Head from "next/head";
import { useForm } from "react-hook-form";

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
        console.log(
          "positionTextAndConvoToReportCriteria = ",
          positionTextAndConvoToReportCriteria
        );

        setScraping(false);

        let jobDescription =
          positionTextAndConvoToReportCriteria.report.replace(/<|>/g, "");

        //Change - to •
        jobDescription = jobDescription.replace(/-\s/g, "• ");

        setReport(jobDescription);
      },
    }
  );

  const handleClick = () => {
    console.log("change =");

    setScraping(true);

    positionTextAndConvoToReportCriteria({
      variables: {
        // fields: { message: textResponse, userID: currentUser?._id },
        fields: {
          positionID: positionID,
        },
      },
    });
  };

  return (
    <div className="w-full">
      <Button
        variant="primary"
        className="w-fit"
        type="submit"
        onClick={handleClick}
        loading={scraping}
      >
        Submit Link
      </Button>

      {report && <div className="whitespace-pre-wrap">{report}</div>}
    </div>
  );
};

export const POSITION_SUGGEST_QUESTIONS = gql`
  mutation ($fields: positionSuggestQuestionsAskCandidateInput!) {
    positionSuggestQuestionsAskCandidate(fields: $fields) {
      success
      questionSuggest {
        question
        IDCriteria
      }
    }
  }
`;

type QuestionSuggest = {
  question: String;
  IDCriteria: String;
};

interface ICreateQuestions {}

const CreateQuestions = ({}: ICreateQuestions) => {
  const { currentUser } = useContext(UserContext);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [scraping, setScraping] = useState<boolean>(false);

  // const [questionsSuggest, setQuestionsSuggest] = useState<QuestionSuggest[]>(
  //   []
  // );

  const [questions, setQuestions] = useState<QuestionSuggest[]>([]);

  // const handleQuestionChange = (event, index) => {
  //   const { name, value } = event.target;

  //   setQuestions((prevQuestions) => {
  //     const newQuestions = [...prevQuestions];

  //     newQuestions[index][name] = value;
  //     return newQuestions;
  //   });
  // // };
  // const handleQuestionChange = (
  //   event: React.ChangeEvent<HTMLTextAreaElement>,
  //   index: number
  // ): void => {
  //   const { name, value } = event.target;

  //   setQuestions((prevQuestions) => {
  //     const newQuestions: Question[] = [...prevQuestions];

  //     newQuestions[index][name as keyof Question] = value;
  //     return newQuestions;
  //   });
  // };
  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ): void => {
    const { name, value } = event.target;

    setQuestions((prevQuestions) => {
      const newQuestions: QuestionSuggest[] = [...prevQuestions];

      newQuestions[index][name as keyof QuestionSuggest] = value;
      return newQuestions;
    });
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", IDCriteria: `b${prevQuestions.length + 1}` },
    ]);
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
        console.log(
          "positionSuggestQuestionsAskCandidate = ",
          positionSuggestQuestionsAskCandidate
        );

        setScraping(false);

        setQuestions(positionSuggestQuestionsAskCandidate.questionSuggest);
      },
    }
  );

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

  // console.log("questionsSuggest = ", questionsSuggest);

  return (
    <div className="w-full">
      {/* <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleClick}
      >
        Click me
      </button> */}
      <Button
        variant="primary"
        className="w-fit"
        type="submit"
        onClick={handleClick}
        loading={scraping}
      >
        Submit Link
      </Button>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {questions.map((question, index) => (
          <div
            key={question.question.toString()}
            className="rounded-lg bg-white p-4 shadow"
          >
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-bold">Question {index + 1}</h2>
              <textarea
                name="question"
                value={question.question.toString()}
                onChange={(event) => handleQuestionChange(event, index)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
              />
            </div>
          </div>
        ))}
        {questions.length === 0 ? null : (
          <button
            type="button"
            onClick={handleAddQuestion}
            className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Add Question
          </button>
        )}
      </div>
    </div>
  );
};
