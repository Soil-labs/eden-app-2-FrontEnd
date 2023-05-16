import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  Card,
  ChatMessage,
  CVUploadGPT,
  InterviewEdenAI,
  // RawDataGraph,
  SEO,
  Wizard,
  WizardStep,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

// import { rawDataPersonProject } from "../../utils/data/rawDataPersonProject";
import type { NextPageWithLayout } from "../_app";

const HomePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { companyID } = router.query;
  const [interviewEnded, setInterviewEnded] = useState(false);

  const {
    data: findCompanyData,
    // error: findCompanyError,
  } = useQuery(FIND_COMPANY, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: !companyID,
  });

  const handleEnd = () => {
    console.log("interview end");

    setInterviewEnded(true);
  };

  return (
    <>
      <SEO />
      <Card className="mx-auto mt-3 h-[88vh] w-full max-w-5xl bg-white" shadow>
        <div className="h-full w-full p-8">
          <Wizard canPrev={false}>
            <WizardStep label={"welcome"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-8 text-2xl font-medium">{`Hi! I'm Eden. 👋`}</h2>
                {findCompanyData?.findCompany?.name ? (
                  <>
                    <p>
                      I am the AI that&lsquo;s here to help you unlock your next
                      dream opportunity
                    </p>
                    <br />
                    <p>
                      🎉 You&lsquo;ve been invited to take the next steps with{" "}
                      <b>{findCompanyData.findCompany.name}.</b> 🎉
                    </p>
                    <br />
                    <p>
                      If you need a refresher, here&lsquo;s the{" "}
                      <Link href={"https://google.com"} target="_blank">
                        <b className="underline hover:text-slate-600">
                          opportunity
                        </b>
                      </Link>{" "}
                      info
                    </p>
                    <br />
                    <br />
                    <br />
                    <p>
                      When you&lsquo;re ready, click next and you&lsquo;ll be
                      doing your first interview with me!
                    </p>
                  </>
                ) : (
                  <p> </p>
                )}
              </section>
            </WizardStep>
            {/* <WizardStep label={"instructions"}>
              <section className="flex h-full flex-col items-center justify-center">
                {findCompanyData?.findCompany?.name && (
                  <h3 className="mb-8 text-lg font-medium">
                    Your first interview with {findCompanyData.findCompany.name}{" "}
                    will be a discussion with Eden AI
                  </h3>
                )}
                <div className="mt-8 flex h-[70%] w-full justify-center">
                  <RawDataGraph
                    rawData={rawDataPersonProject}
                    disableZoom={true}
                  />
                </div>
              </section>
            </WizardStep> */}
            <WizardStep label={"cv"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h3 className="mb-8 text-center text-lg font-medium">
                  Hey {currentUser?.discordName}!
                </h3>
                <p className="mb-8 text-center">
                  In order for me to be able to ask relevant questions,
                  <br />
                  please upload your CV first.
                </p>
                {/* <p>--- ADD UPLOAD CV BUTTON --</p> */}
                <CVUploadGPT />
              </section>
            </WizardStep>
            <WizardStep nextDisabled={!interviewEnded} label={"chat"}>
              <div className="mx-auto h-[70vh] max-w-lg">
                <InterviewEdenAIContainer handleEnd={handleEnd} />
              </div>
            </WizardStep>
            <WizardStep label={"end"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-8 text-2xl font-medium">Thanks</h2>
              </section>
            </WizardStep>
          </Wizard>
        </div>
      </Card>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

import { IncomingMessage, ServerResponse } from "http";
import Link from "next/link";
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

const FIND_COMPANY = gql`
  query ($fields: findCompanyInput) {
    findCompany(fields: $fields) {
      _id
      name
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

const ADD_CANDIDATE_TO_COMPANY = gql`
  mutation ($fields: addCandidatesCompanyInput) {
    addCandidatesCompany(fields: $fields) {
      _id
      name
      candidates {
        user {
          _id
          discordName
          discordAvatar
        }
        overallScore
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

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

interface InterviewEdenAIContainerProps {
  handleEnd?: () => void;
}

const InterviewEdenAIContainer = ({
  handleEnd,
}: InterviewEdenAIContainerProps) => {
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // --------- Company and User ------------
  const { currentUser } = useContext(UserContext);

  console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { companyID } = router.query;
  // --------- Company and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  const {} = useQuery(FIND_COMPANY, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: companyID == "" || companyID == null,
    onCompleted: (data) => {
      let questionsChange = data.findCompany.questionsToAsk.map(
        (question: any) => {
          return {
            _id: question?.question?._id,
            content: question?.question?.content,
            bestAnswer: question?.bestAnswer,
          };
        }
      );

      questionsChange = questionsChange.filter((question: any) => {
        return question._id != null;
      });

      setQuestions(questionsChange);
    },
  });

  const [addCandidateToCompany] = useMutation(ADD_CANDIDATE_TO_COMPANY, {
    onCompleted: (data) => {
      console.log("data = ", data);
      setAddCandidateFlag(true);
    },
  });

  const [addCandidateFlag, setAddCandidateFlag] = useState<boolean>(false);

  const [conversationID, setConversationID] = useState<String>("");

  useEffect(() => {
    if (
      addCandidateFlag == false &&
      currentUser?._id != undefined &&
      companyID != undefined &&
      conversationID != ""
    ) {
      console.log("change conversationID= ", conversationID);
      addCandidateToCompany({
        variables: {
          fields: {
            companyID: companyID,
            candidates: [
              {
                userID: currentUser?._id,
                conversationID: conversationID,
              },
            ],
          },
        },
      });
    }
  }, [companyID, currentUser?._id, conversationID]);

  // console.log("companyID = ", companyID);

  const [experienceTypeID] = useState<string>("");

  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

  console.log("conversationID = ", conversationID);

  return (
    <div className="w-full">
      <div className="h-[68vh]">
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
            conversationID={conversationID}
            setConversationID={setConversationID}
            handleEnd={() => {
              if (handleEnd) handleEnd();
            }}
          />
        }
      </div>
    </div>
  );
};
