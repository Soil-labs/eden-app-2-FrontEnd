import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  CompanyFoundRoundType,
  Maybe,
  Position,
} from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  AskEdenPopUp,
  Button,
  EdenAiProcessingModal,
  EdenIconExclamationAndQuestion,
  SEOPosition,
  Tooltip,
} from "@eden/package-ui";
import { classNames, getCookieFromContext } from "@eden/package-ui/utils";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineUserAdd } from "react-icons/ai";
import { BsStar } from "react-icons/bs";
import { GoTag } from "react-icons/go";
import { HiOutlineHeart, HiOutlineShare, HiOutlineUsers } from "react-icons/hi";
import { HiFlag } from "react-icons/hi2";
import { SlLocationPin } from "react-icons/sl";
import { TbMoneybag } from "react-icons/tb";
import { toast } from "react-toastify";

import type { NextPageWithLayout } from "../../../_app";

const PositionPage: NextPageWithLayout = ({
  position,
}: {
  position: Position;
}) => {
  const router = useRouter();

  const { currentUser } = useContext(UserContext);
  const [openAskEden, setOpenAskEden] = useState(false);

  const parseOfficePolicy = (_officePolicy: string) => {
    if (_officePolicy === "on-site") return "On site";
    if (_officePolicy === "remote") return "Remote";
    if (_officePolicy === "hybrid-1-day-office") return "Hybrid - 1 day office";
    if (_officePolicy === "hybrid-2-day-office") return "Hybrid - 2 day office";
    if (_officePolicy === "hybrid-3-day-office") return "Hybrid - 3 day office";
    if (_officePolicy === "hybrid-4-day-office") return "Hybrid - 4 day office";

    return "";
  };

  const formattedSalary = (salary: number) => {
    if (salary >= 1000) return `${salary / 1000}k`;

    return salary;
  };

  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const handleInterviewNav = async () => {
    setLoadingSpinner(true);
    await router.push(`/interview/${position._id}`);
    setLoadingSpinner(false);
  };

  return (
    <>
      <SEOPosition
        title={`${position?.name} @ ${position.company?.name}`}
        description={position?.company?.description || ""}
        image={position?.company?.imageUrl || ""}
        position={position?.name!}
        salaryMax={position.generalDetails?.yearlySalary?.max!}
        salaryMin={position.generalDetails?.yearlySalary?.min!}
        officePolicy={position.generalDetails?.officePolicy!}
        location={position.generalDetails?.officeLocation!}
      />

      <div>
        <section
          className="flex w-full justify-center py-24"
          style={{
            backgroundImage: "url(/banner.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="relative grid w-4/5 max-w-4xl grid-cols-12 rounded-md bg-white p-10">
            {/* {editMode && (
              <button
                className="bg-edenGray-500 text-utilityOrange border-utilityOrange disabled:text-edenGray-700 disabled:border-edenGray-700 absolute right-4 top-4 flex items-center whitespace-nowrap rounded-md border px-2"
                onClick={() => {
                  setEditCompany(!editCompany);
                }}
              >
                <HiPencil size={16} className="mr-2 inline-block" />
                Edit
              </button>
            )} */}
            <div className="col-span-5">
              <div className="mb-10">
                <h1 className="text-edenGreen-600 mb-2">
                  {`${position?.name}, ${position?.company?.name}`}
                </h1>
                {
                  <div className="bg-edenGray-100 w-fit rounded-md px-2 text-sm">
                    {position?.generalDetails?.contractType}
                  </div>
                }
              </div>

              {position?.generalDetails?.yearlySalary?.min ||
              position?.generalDetails?.yearlySalary?.min === 0 ||
              position?.generalDetails?.yearlySalary?.max ||
              position?.generalDetails?.yearlySalary?.max === 0 ? (
                <div className="mb-4">
                  <TbMoneybag
                    size={24}
                    className="text-edenGreen-600 mr-3 inline-block"
                  />
                  <div className="bg-edenGreen-600 text-edenPink-300 font-Moret inline-block rounded-xl px-3 py-0.5 font-bold">
                    {`${
                      position?.generalDetails.yearlySalary.min ||
                      position?.generalDetails.yearlySalary.min === 0
                        ? `$ ${formattedSalary(
                            position?.generalDetails.yearlySalary.min
                          )}`
                        : ""
                    }${
                      (position?.generalDetails.yearlySalary.min ||
                        position?.generalDetails.yearlySalary.min === 0) &&
                      (position?.generalDetails.yearlySalary.max ||
                        position?.generalDetails.yearlySalary.max === 0)
                        ? `  -  `
                        : ""
                    }${
                      position?.generalDetails.yearlySalary.max ||
                      position?.generalDetails.yearlySalary.max === 0
                        ? `$ ${formattedSalary(
                            position?.generalDetails.yearlySalary.max
                          )}`
                        : ""
                    }`}
                  </div>
                </div>
              ) : null}
              <div className="mb-4 flex items-center">
                <BsStar
                  size={24}
                  className="text-edenGreen-600 mr-3 inline-block"
                />
                <div className="text-edenGray-600 border-edenGray-300 ml-1 mr-3 flex items-center justify-center rounded-md border px-6 py-1.5">
                  <h4 className="text-lg">?</h4>
                </div>
                <div>
                  <div className="flex flex-nowrap items-center">
                    <h3 className="text-edenGreen-600">Matchstimate{"  "}</h3>
                    <Tooltip className="inline">
                      This helps candidates understand if this opportunity is a
                      match for them.
                    </Tooltip>
                  </div>
                  <p className="text-edenGray-500 text-xs">
                    <a
                      href="#"
                      onClick={() => handleInterviewNav()}
                      className="cursor-pointer text-blue-500 underline"
                    >
                      Upload your resume
                    </a>{" "}
                    to unlock
                  </p>
                </div>
              </div>

              {(position?.generalDetails?.officeLocation ||
                position?.generalDetails?.officePolicy) && (
                <div className="mb-4">
                  <SlLocationPin
                    size={24}
                    className="text-edenGreen-600 mr-3 inline-block"
                  />
                  {position?.generalDetails?.officePolicy && (
                    <div className="bg-edenGreen-600 text-edenPink-300 font-Moret mb-1 mr-2 inline-block rounded-xl px-3 py-0.5 font-bold">
                      {parseOfficePolicy(
                        position?.generalDetails?.officePolicy
                      )}
                    </div>
                  )}
                  {position?.generalDetails?.officeLocation && (
                    <div className="bg-edenGreen-600 text-edenPink-300 font-Moret mr-2 inline-block rounded-xl px-3 py-0.5 font-bold">
                      {position?.generalDetails?.officeLocation}
                    </div>
                  )}
                </div>
              )}

              <div
                className={classNames(
                  "border-edenGreen-600 hover:bg-edenGreen-100 relative mt-12 flex h-[calc(2.5rem+4px)] w-[calc(100%-1.5rem)] cursor-pointer items-center justify-between overflow-hidden rounded-full border-2 bg-white pl-4 drop-shadow-sm transition-all ease-in-out"
                )}
                onClick={() => setOpenAskEden(true)}
              >
                <span className="text-edenGreen-600 font-Moret mr-4">
                  {"Ask Eden about this opportunity"}
                </span>
                <div
                  className={classNames(
                    "bg-edenPink-400 absolute right-0 float-right flex h-10 w-10 transform cursor-pointer items-center justify-center rounded-full transition-all ease-in-out"
                  )}
                >
                  <EdenIconExclamationAndQuestion className="h-6 w-6" />
                </div>
              </div>
            </div>
            <div className="border-edenGreen-300 col-span-7 border-l-2 pl-4">
              <Image
                width="180"
                height="180"
                className="mb-6"
                src={`${
                  position?.company?.imageUrl
                    ? position?.company?.imageUrl
                    : "/default-company-image.svg"
                }`}
                alt={`${position?.company?.name} company image`}
              />
              <p className="text-edenGray-900 mb-2 text-sm">
                {`${position?.company?.description}`}
              </p>

              {position?.company?.employeesNumber ||
                (position?.company?.employeesNumber === 0 && (
                  <p className="text-edenGray-900 mb-2 text-sm">
                    <HiOutlineUsers
                      size={20}
                      className="text-edenGreen-600 mr-2 inline-block"
                    />
                    {`${position?.company?.employeesNumber} employees`}
                  </p>
                ))}
              {!!position?.company?.tags?.length && (
                <p className="mb-2 text-sm">
                  <GoTag
                    size={24}
                    className="text-edenGreen-600 mr-2 inline-block"
                  />
                  <CompanyTagsField tags={position?.company?.tags} />
                </p>
              )}

              <div className="bg-edenPink-100 rounded-md p-4 text-sm">
                <div className="mb-2 flex">
                  <div className="bg-edenGreen-300 mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                    <HiOutlineHeart size={16} className="text-edenGreen-600" />
                  </div>
                  <h3 className="text-edenGreen-600">What&apos;s to love?</h3>
                </div>
                <p className="text-edenGray-700 text-xs">
                  {position?.company?.whatsToLove}
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="mx-auto grid w-4/5 max-w-4xl grid-cols-12 gap-x-8 px-4 py-16">
          {/* ---- POSITION DETAILS ---- */}
          <div className="col-span-12 md:col-span-6">
            <section className="bg-edenPink-100 mb-8 overflow-hidden rounded-md">
              <div className="bg-edenPink-300 px-6 py-4">
                <h2 className="text-edenGreen-600">Role</h2>
              </div>
              <div className="border-edenGreen-300 px-6 py-4">
                <div className="border-edenGreen-300 mb-4 border-b-2">
                  <h3 className="text-edenGreen-600 mb-2 font-semibold">
                    Who you are
                  </h3>
                  <p className="mb-4 text-xs">
                    {
                      <ul className="text-edenGray-900 list-disc pl-4 ">
                        {position?.whoYouAre &&
                          position?.whoYouAre
                            .split("\n")
                            .filter((line: any) => line.trim() !== "")
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                      </ul>
                    }
                  </p>
                </div>
                <div className="">
                  <h3 className="text-edenGreen-600 mb-2 font-semibold">
                    What the job involves
                  </h3>
                  <p className="text-xs">
                    {
                      <ul className="text-edenGray-900 list-disc pl-4 ">
                        {position?.whatTheJobInvolves &&
                          position?.whatTheJobInvolves
                            .split("\n")
                            .filter((line: any) => line.trim() !== "")
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                      </ul>
                    }
                  </p>
                </div>
              </div>
            </section>

            {/* ---- SHARE & REPORT ---- */}
            <section className="bg-edenPink-100 mb-8 grid grid-cols-2 gap-4 overflow-hidden rounded-md px-4 py-4">
              <div
                className="group col-span-1 flex w-fit cursor-pointer items-center"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://developer-dao.joineden.ai/jobs/${position._id}`
                  );
                  toast.success("Job link copied");
                }}
              >
                <HiOutlineShare
                  size={20}
                  className="text-edenGreen-600 group-hover:text-edenGreen-400 mr-2 inline"
                />
                <span className="group-hover:text-edenGray-500 whitespace-nowrap text-xs group-hover:underline">
                  Share this job
                </span>
              </div>
              <div className="group col-span-1 flex w-fit cursor-pointer items-center">
                <HiFlag
                  size={20}
                  className="text-edenGreen-600 group-hover:text-edenGreen-400 mr-2 inline"
                />
                <span className="group-hover:text-edenGray-500 whitespace-nowrap text-xs group-hover:underline">
                  <a href="mailto:tom@joineden.xyz">
                    Report a problem with this job
                  </a>
                </span>
              </div>
              <div className="group col-span-1 flex w-fit cursor-pointer items-center">
                <AiOutlineUserAdd
                  size={20}
                  className="text-edenGreen-600 group-hover:text-edenGreen-400 mr-2 inline"
                />
                <span className="group-hover:text-edenGray-500 whitespace-nowrap text-xs group-hover:underline">
                  <a href="mailto:tom@joineden.xyz">Refer someone & get paid</a>
                </span>
              </div>
            </section>
          </div>

          <div className="col-span-12 md:col-span-6">
            {/* ---- YOU & THE ROLE ---- */}
            <section className="bg-edenPink-100 mb-8 overflow-hidden rounded-md">
              <div className="bg-edenPink-300 px-6 py-4">
                <h2 className="text-edenGreen-600">You & the role</h2>
              </div>
              <div className="px-6 py-4">
                <div className="bg-edenPink-300 mx-auto flex h-8 w-8 items-center justify-center rounded-md">
                  <AiOutlineEyeInvisible size={"1.4rem"} />
                </div>
                <h3 className="text-edenGreen-600 mb-4 text-center font-semibold">
                  Upload your resume to unlock:
                </h3>
                <ul className="text-edenGray-900 list-disc pl-4 text-sm">
                  <li className="mb-2"> If you’d be a good fit</li>
                  <li className="mb-2">
                    What your strengths are for this opportunity
                  </li>
                  <li className="mb-2">
                    What your weaknesses are for this opportunity
                  </li>
                </ul>

                <div className="mt-4 flex justify-center">
                  <Button
                    variant="secondary"
                    // onClick={() => {
                    //   router.push(`/interview/${position._id}`);
                    // }}
                    onClick={() => {
                      handleInterviewNav();
                    }}
                  >
                    Upload Your Resume
                  </Button>
                </div>
              </div>
            </section>

            {/* ---- COMPANY DETAILS ---- */}
            <section className="bg-edenPink-100 mb-8 overflow-hidden rounded-md">
              <div className="bg-edenPink-300 px-6 py-4">
                <h2 className="text-edenGreen-600">Company</h2>
              </div>
              <div className="px-6">
                {/* ---- MISSION ---- */}
                {position?.company?.mission && (
                  <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                    <h3 className="text-edenGreen-600">About the company</h3>
                    <p className="text-xs">{position?.company?.mission}</p>
                  </div>
                )}

                {/* ---- INSIGHTS ---- */}
                {position?.company?.insights &&
                  position?.company?.insights.length > 0 && (
                    <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                      <h3 className="text-edenGreen-600">Insights</h3>
                      <div className="relative flex w-full flex-wrap">
                        {position?.company?.insights?.map((insight, index) => (
                          <div
                            key={index}
                            className="mt-2 flex min-w-[50%] items-center"
                          >
                            <div className="bg-edenPink-300 mr-2 flex h-6 w-8 items-center justify-center rounded-md pb-px">
                              <span
                                className={classNames(
                                  // getGrade(_category!.score! * 100).color,
                                  "text-md"
                                )}
                              >
                                {insight?.letter}
                              </span>
                            </div>
                            <p className="text-2xs text-edenGray-700">
                              {insight?.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* ---- EDEN'S TAKE ---- */}
                {position?.company?.edenTake && (
                  <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                    <h3 className="text-edenGreen-600">Eden&apos;s Take</h3>
                    <p className="text-xs">{position.company.edenTake}</p>
                  </div>
                )}

                {/* ---- WIDGETS ---- */}
                {position?.company?.funding &&
                  position?.company?.funding?.length > 0 && (
                    <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                      {/* <h3 className="text-edenGreen-600 mb-4">Widgets</h3> */}

                      {/* ---- FUNDING ---- */}
                      <FundingWidget founding={position.company.funding} />
                      {/* ---- CULTURE ---- */}
                      {/* {position?.company?.culture && (
                    <div className="mb-4 last:mb-0">
                    <h3 className="text-edenGreen-600 mb-2">
                    AI culture summary
                    </h3>
                    <div className="bg-edenGreen-300 rounded-md p-4">
                    <div className="mb-2 text-center">
                    {position?.company?.culture.tags &&
                      position?.company?.culture.tags?.map(
                        (tag, index) => (
                          <div
                          key={index}
                          className="bg-edenGreen-600 text-edenPink-400 font-Moret mr-2 inline inline rounded-md px-4 py-1 last:mr-0"
                                >
                                {tag}
                                </div>
                                )
                                )}
                                </div>
                                <p className="text-sm text-white">
                                {position.company.culture.description}
                                </p>
                                </div>
                                </div>
                              )} */}
                    </div>
                  )}

                {/* ---- BENEFITS ---- */}
                {position?.company?.benefits &&
                  position?.company.benefits != "N/A" && (
                    <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                      <h3 className="text-edenGreen-600">Benefits & perks</h3>
                      <p className="text-xs">
                        {
                          <ul className="text-edenGray-900 list-disc pl-4 ">
                            {position?.company.benefits
                              .split("\n")
                              .filter((line: any) => line.trim() !== "")
                              .map((line: any, index: any) => (
                                <li className="mb-4" key={index}>
                                  {line}
                                </li>
                              ))}
                          </ul>
                        }
                      </p>
                    </div>
                  )}

                {/* ---- COMPANY VALUES ---- */}
                {position?.company?.values &&
                  position?.company.values != "N/A" && (
                    <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                      <h3 className="text-edenGreen-600">Company Values</h3>
                      <p className="text-xs">
                        {
                          <ul className="text-edenGray-900 list-disc pl-4 ">
                            {position?.company.values
                              .split("\n")
                              .filter((line: any) => line.trim() !== "")
                              .map((line: any, index: any) => (
                                <li className="mb-4" key={index}>
                                  {line}
                                </li>
                              ))}
                          </ul>
                        }
                      </p>
                    </div>
                  )}

                {/* ---- FOUNDERS ---- */}
                {position?.company?.founders &&
                  position?.company.founders != "N/A" && (
                    <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                      <h3 className="text-edenGreen-600">Founders</h3>
                      <p className="text-xs">{position?.company.founders}</p>
                    </div>
                  )}
              </div>
            </section>
          </div>
        </div>

        {/* ---- FOOTER APPLY ---- */}
        <footer className="bg-edenGreen-600 fixed bottom-0 left-0 flex h-16 w-full items-center justify-center">
          <Button
            className="border-edenPink-400 !text-edenPink-400"
            onClick={() => {
              handleInterviewNav();
            }}
          >
            Apply with AI
          </Button>
          {currentUser?._id && (
            <AskEdenPopUp
              memberID={currentUser?._id}
              service={
                AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION_AFTER_INTERVIEW
              }
              title="Ask Eden about this opportunity"
              className="!bottom-[0.35rem] !right-2"
              forceOpen={openAskEden}
              onClose={() => {
                setOpenAskEden(false);
              }}
            />
          )}
        </footer>
      </div>
      <EdenAiProcessingModal
        title="This will be exciting"
        open={loadingSpinner}
      />
    </>
  );
};

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(),
});

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const positionID = ctx.params?.positionID;
  const { edit } = ctx.query;
  const _slug = ctx.params?.subdomain;

  const { data } = await client.query({
    query: gql`
      query ($fields: findPositionInput!) {
        findPosition(fields: $fields) {
          _id
          name
          status
          whoYouAre
          whatTheJobInvolves
          company {
            _id
            name
            slug
            imageUrl
            description
            benefits
            employeesNumber
            tags
            whatsToLove
            mission
            insights {
              letter
              text
            }
            edenTake
            funding {
              name
              date
              amount
            }
            culture {
              tags
              description
            }
            benefits
            values
            founders
            glassdoor
          }
          generalDetails {
            yearlySalary {
              min
              max
            }
            contractType
            officePolicy
            officeLocation
          }
        }
      }
    `,
    variables: {
      fields: {
        _id: positionID,
      },
      ssr: true,
    },
  });

  // if not edit mode don't authenticate, allow
  if (edit !== "true") {
    return {
      props: { position: data.findPosition || null },
    };
  }

  const session = getCookieFromContext(ctx);

  // if not session ask for login
  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${ctx.req.url}`,
        permanent: false,
      },
    };
  }

  // if operator access, allow
  if (session?.accessLevel === 5) {
    return {
      props: { position: data.findPosition || null },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session?._id,
        companySlug: _slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  console.log(res.status);

  // if not authorised, redirect to request-access
  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access?company=${_slug}`,
        permanent: false,
      },
    };
  }

  // if company does not exist, redirect to create-company
  //@TODO maybe we need a 404 page for this
  if (res.status === 404) {
    return { notFound: true };
  }

  const _companyAuth = await res.json();

  // if company is not a community (bc communities don't pay)
  // and company is not subscribed to any stripe products
  // redirect to dasboard subscription
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

  // default allow
  return {
    props: { position: data.findPosition || null },
  };
}

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// export const getStaticProps = async (context: any) => {
//   await delay(200);

//   try {
//     const positionID = context.params?.positionID;

//     const client = new ApolloClient({
//       uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
//       cache: new InMemoryCache(),
//     });

//     const { data } = await client.query({
//       query: gql`
//         query ($fields: findPositionInput!) {
//           findPosition(fields: $fields) {
//             _id
//             name
//             status
//             whoYouAre
//             whatTheJobInvolves
//             company {
//               _id
//               name
//               slug
//               imageUrl
//               description
//               benefits
//               employeesNumber
//               tags
//               whatsToLove
//               mission
//               insights {
//                 letter
//                 text
//               }
//               edenTake
//               funding {
//                 name
//                 date
//                 amount
//               }
//               culture {
//                 tags
//                 description
//               }
//               benefits
//               values
//               founders
//               glassdoor
//             }
//             generalDetails {
//               yearlySalary {
//                 min
//                 max
//               }
//               contractType
//               officePolicy
//               officeLocation
//             }
//           }
//         }
//       `,
//       variables: {
//         fields: {
//           _id: positionID,
//         },
//       },
//     });

//     return {
//       props: { position: data.findPosition || null },
//       revalidate: 600,
//     };
//   } catch (error) {
//     console.log(error);
//     return { notFound: true };
//   }
// };

// export const getStaticPaths = (async () => {
//   try {
//     const res = await axios.post(
//       process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
//       {
//         headers: {
//           "Access-Control-Allow-Origin": `*`,
//         },
//         variables: { fields: [] },
//         query: `
//           query FindPositions($fields: findPositionsInput) {
//             findPositions(fields: $fields) {
//               _id
//               company
//                 {
//                   slug
//                 }
//             }
//           }
//         `,
//       }
//     );

//     const paths = res.data.data.findPositions
//       .filter((_pos: any) => {
//         return !!_pos.company && !!_pos.company.slug;
//       })
//       .map((_pos: any) => ({
//         params: { positionID: _pos._id, slug: _pos.company.slug },
//       }));

//     console.log("getStaticPaths --- ", paths);

//     // { fallback: false } means other routes should 404
//     return {
//       paths,
//       fallback: true,
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       paths: [],
//       fallback: false,
//     };
//   }
// }) satisfies GetStaticPaths;

PositionPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default PositionPage;

export interface IFundingWidget {
  founding: Maybe<CompanyFoundRoundType>[];
}

const FundingWidget = ({ founding }: IFundingWidget) => {
  return (
    <div className="mb-4 last:mb-0">
      <h3 className="text-edenGreen-600 mb-2">Funding</h3>
      <div className={classNames("bg-edenGreen-300 rounded-md p-4")}>
        {founding.map((field, index: number) => (
          <div
            key={index}
            className="relative mb-2 flex items-center justify-between last:mb-0"
          >
            <span className="text-white">{field?.date}</span>
            <div className="bg-edenPink-400 mx-1 h-2 w-2 rounded-full px-1"></div>
            <span className="text-white">{field?.amount}</span>
            <div className="bg-edenGreen-600 text-edenPink-400 font-Moret inline-block rounded-xl px-3 py-0.5 font-bold">
              {field?.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export interface ICompanyTagsField {
  tags: Maybe<string>[];
}

const CompanyTagsField = ({ tags }: ICompanyTagsField) => {
  return (
    <div className="inline">
      {tags.map((tag: Maybe<string>, index: number) =>
        tag ? (
          <div
            key={index}
            className="bg-edenGray-100 relative mb-2 mr-2 inline-block max-w-[28%] rounded-md px-2 pb-1"
          >
            <span className="">{tag}</span>
          </div>
        ) : null
      )}
    </div>
  );
};
