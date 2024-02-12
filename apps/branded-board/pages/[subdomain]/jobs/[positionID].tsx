import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
  useMutation,
} from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  CandidateType,
  Position,
  PositionStatus,
} from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AskEdenPopUp,
  BrandedAppUserLayout,
  Button,
  EdenAiProcessingModal,
  EdenIconExclamation,
  EdenIconExclamationAndQuestion,
  Loading,
  Modal,
  SEOPosition,
} from "@eden/package-ui";
import { classNames, getCookieFromContext } from "@eden/package-ui/utils";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
// dynamic import tooltip
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import {
  Control,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormGetValues,
  UseFormRegister,
} from "react-hook-form";
import { AiOutlineEyeInvisible, AiOutlineUserAdd } from "react-icons/ai";
import { BsChevronLeft, BsLightningFill } from "react-icons/bs";
import { GoTag } from "react-icons/go";
import {
  HiOutlineHeart,
  HiOutlineShare,
  HiOutlineUsers,
  HiPencil,
} from "react-icons/hi";
import { HiFlag } from "react-icons/hi2";
import { SlLocationPin } from "react-icons/sl";
import { TbMoneybag } from "react-icons/tb";
import { toast } from "react-toastify";

import type { NextPageWithLayout } from "../../_app";
const Tooltip = dynamic(
  () => import("@eden/package-ui").then((mod) => mod.Tooltip),
  {
    ssr: false,
  }
);

const BULK_UPDATE = gql`
  mutation (
    $fieldsCompany: updateCompanyDetailsInput!
    $fieldsPosition: updatePositionInput!
    $fieldsPositionDetails: updatePositionGeneralDetailsInput!
  ) {
    updateCompanyDetails(fields: $fieldsCompany) {
      _id
      name
      slug
      description
    }

    updatePosition(fields: $fieldsPosition) {
      _id
      status
      whoYouAre
      whatTheJobInvolves
    }

    updatePositionGeneralDetails(fields: $fieldsPositionDetails) {
      _id
    }
  }
`;

// export async function generateMetadata({
//   params,
// }: {
//   params: Position;
// }): Promise<Metadata> {
//   return {
//     title: "hi",
//     description: "",
//     openGraph: {
//       images: [],
//     },
//   };
// }

const editInputClasses =
  "inline-block bg-transparent -my-[2px] border-2 border-utilityOrange px-1 rounded-md outline-utilityYellow remove-arrow focus:outline-none";

const PositionPage: NextPageWithLayout = ({
  position,
  submitted,
  matchstimate,
}: {
  position: Position;
  submitted?: boolean;
  matchstimate?: number;
}) => {
  const router = useRouter();
  const { edit } = router.query;
  const editMode = edit === "true";

  const { currentUser } = useContext(UserContext);

  const [editCompany] = useState(true);
  const [uploadingCompanyImage, setUploadingCompanyImage] = useState(false);
  const [backToDashboardModalOpen, setBackToDashboardModalOpen] =
    useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [trainAiModalOpen, setTrainAiModalOpen] = useState(false);
  const [openAskEden, setOpenAskEden] = useState(false);

  const { control, register, handleSubmit, getValues, setValue } = useForm<any>(
    {
      defaultValues: {
        name: position.name || "",
        //Removes -
        whoYouAre: position.whoYouAre?.replace(/- /g, "") || "",
        whatTheJobInvolves:
          position.whatTheJobInvolves?.replace(/- /g, "") || "",
        generalDetails: {
          yearlySalary: {
            min: position.generalDetails?.yearlySalary?.min,
            max: position.generalDetails?.yearlySalary?.max,
          },
          contractType: position.generalDetails?.contractType || "",
          officeLocation: position.generalDetails?.officeLocation || "",
          officePolicy: position.generalDetails?.officePolicy || "",
        },
        company: {
          description: position.company?.description,
          imageUrl: position.company?.imageUrl,
          employeesNumber: position.company?.employeesNumber,
          tags: position.company?.tags || [],
          mission: position.company?.mission,
          funding:
            position.company?.funding?.map((round) => ({
              date: round?.date,
              amount: round?.amount,
              name: round?.name,
            })) || [],
          benefits: position.company?.benefits?.replace(/- /g, ""),
          values: position.company?.values?.replace(/^\s*-\s*/gm, ""),
          founders: position.company?.founders,
          glassdoor: position.company?.glassdoor,
          whatsToLove: position.company?.whatsToLove,
        },
      },
    }
  );

  const fileInput = useRef<HTMLInputElement | null>(null);

  const [bulkUpdate, { loading: bulkUpdateLoading }] = useMutation(
    BULK_UPDATE,
    {
      onCompleted(data) {
        console.log("completed update");
        console.log(data);

        setPublishModalOpen(false);
        if (data.updatePosition.status === "ACTIVE") {
          setTrainAiModalOpen(true);
        }
        if (data.updatePosition.status === "UNPUBLISHED") {
          toast.success("Saved as draft");
        }
        // router.push(
        //   `/dashboard/${position.company?.name}/${position._id}/train-eden-ai`
        // );
      },
      onError() {
        toast.error("An error occurred while submitting");
      },
    }
  );

  const onSubmit: SubmitHandler<Position> = (_position: Position) => {
    bulkUpdate({
      variables: {
        fieldsCompany: {
          slug: position.company?.slug,
          ..._position.company,
        },
        fieldsPosition: {
          _id: position._id,
          name: _position.name,
          status: _position.status,
          whoYouAre: _position.whoYouAre,
          whatTheJobInvolves: _position.whatTheJobInvolves,
        },
        fieldsPositionDetails: {
          _id: position._id,
          ...getValues("generalDetails"),
        },
      },
    });
    setPublishModalOpen(false);

    if (_position.status === "ACTIVE") {
      setConfettiRun(true);
    }
  };

  const handleFileChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingCompanyImage(true);
      try {
        if (e.target.files[0] > 1 * 1024 * 1024) {
          // setSizeErr(true);
          setUploadingCompanyImage(false);
          return;
        }

        const postid = `${position.company?._id}_${Math.floor(
          100000 + Math.random() * 900000
        )}`;
        const blob = e.target.files[0].slice(
          0,
          e.target.files[0].size,
          "application/png"
        );

        const newFile = new File([blob], `${postid}.png`, {
          type: "application/png",
        });

        const formData = new FormData();

        formData.append("imgfile", newFile);

        await axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/storage/store-image` as string,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        setValue(
          "company.imageUrl",
          `https://storage.googleapis.com/eden_companies_images/${postid}.png`
        );
        setUploadingCompanyImage(false);
      } catch (error) {
        setUploadingCompanyImage(false);
        // toast.error(error);
      }
    }
  };

  console.log("publishModalOpen", publishModalOpen);

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

  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [confettiRun, setConfettiRun] = useState(false);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (confettiRun) {
      // @ts-ignore
      setWidth(ref.current?.clientWidth || 0);
      // @ts-ignore
      setHeight(ref.current?.clientHeight || 0);
      setTimeout(() => {
        setConfettiRun(false);
      }, 2500);
    }
  }, [confettiRun]);

  const handleInterviewNav = async () => {
    setLoadingSpinner(true);
  };

  const getGrade = (percentage: number) => {
    let grade = { letter: "", color: "" };

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

  const redirectUrl =
    process.env.NEXT_PUBLIC_ENV_BRANCH === "develop"
      ? `https://eden-saas-staging.vercel.app/${position.company?.slug}/jobs/${position._id}`
      : `https://www.edenprotocol.app/${position.company?.slug}/jobs/${position._id}`;

  return (
    <>
      <SEOPosition
        title={`${position?.name} @ ${position.company?.name}`}
        company={position.company?.name || ""}
        contractType={position.generalDetails?.contractType || ""}
        description={position?.company?.description || ""}
        image={position?.company?.imageUrl || ""}
        position={position?.name!}
        salaryMax={position.generalDetails?.yearlySalary?.max!}
        salaryMin={position.generalDetails?.yearlySalary?.min!}
        officePolicy={position.generalDetails?.officePolicy!}
        location={position.generalDetails?.officeLocation!}
        redirectUrl={redirectUrl}
      />
      <div>
        {editMode && (
          <>
            <section className="mx-auto flex grid h-16 w-4/5 w-full max-w-4xl items-center px-4">
              <span
                onClick={() => {
                  setBackToDashboardModalOpen(true);
                }}
                className="text-edenGray-600 hover:text-edenGray-500 mr-auto cursor-pointer text-lg"
              >
                <BsChevronLeft className="-mt-1 mr-1 inline" size={16} />
                Go back to dashboard
              </span>
            </section>
            <Modal
              open={backToDashboardModalOpen}
              closeOnEsc={true}
              onClose={() => setBackToDashboardModalOpen(false)}
            >
              <div className="flex flex-col items-center justify-center px-28 py-8 text-center">
                <EdenIconExclamation className="mb-2 h-16" />
                <h2 className=" mb-4">Go back to dashboard?</h2>
                <p className="mb-12">
                  {"Be careful! Unsaved changes won't be applied"}
                </p>
                <div className="flex justify-center gap-8">
                  <Button
                    onClick={() => {
                      setBackToDashboardModalOpen(false);
                    }}
                  >
                    Stay here
                  </Button>
                  <Link
                    className="font-Moret !bg-utilityRed flex items-center rounded-md px-4 py-2 text-lg font-bold !text-white hover:opacity-75"
                    href={`/dashboard/${position.company?.slug}/${position._id}`}
                  >
                    Go back to dashboard
                  </Link>
                </div>
              </div>
            </Modal>
          </>
        )}

        <section className="mx-auto max-w-screen-xl px-2 md:px-8">
          <div className="relative flex w-full flex-col items-center justify-center rounded-lg bg-black bg-[url('/banner-job-board-mobile.png')] bg-cover bg-center px-4 pb-36 pt-8 md:h-96 md:bg-[url('/banner-job-board.png')] md:px-12 md:pb-2 md:pt-4">
            <h1 className="mb-2 text-center text-white">
              {editMode && editCompany ? (
                <>
                  <input
                    {...register("name")}
                    className={classNames(editInputClasses, "")}
                  />
                  {`, ${position?.company?.name}`}
                </>
              ) : (
                `${getValues("name")}, ${position?.company?.name}`
              )}
            </h1>
            <section className="flex justify-center">
              {editMode && editCompany ? (
                <div className="border-edenGray-50 mb-4 mr-3 border-r pr-4">
                  <TbMoneybag
                    color="#F7F8F7"
                    size={20}
                    className="mr-2 inline-block"
                  />
                  <div className="inline-block rounded-xl px-3 py-0.5 text-white">
                    {`$ `}

                    <input
                      type="number"
                      placeholder="min salary"
                      {...register("generalDetails.yearlySalary.min", {
                        valueAsNumber: true,
                      })}
                      className={classNames(editInputClasses, "ml-0 mr-1 w-20")}
                    />
                    {` -  $`}
                    <input
                      type="number"
                      placeholder="max salary"
                      {...register("generalDetails.yearlySalary.max", {
                        valueAsNumber: true,
                      })}
                      className={classNames(editInputClasses, "ml-1 w-20")}
                    />
                  </div>
                </div>
              ) : getValues("generalDetails.yearlySalary.min") ||
                getValues("generalDetails.yearlySalary.min") === 0 ||
                getValues("generalDetails.yearlySalary.max") ||
                getValues("generalDetails.yearlySalary.max") === 0 ? (
                <div className="border-edenGray-50 mb-4 mr-3 border-r pr-4">
                  <TbMoneybag
                    color="#F7F8F7"
                    size={20}
                    className="mr-2 inline-block"
                  />
                  <div className="inline-block rounded-xl text-white">
                    {`${
                      getValues("generalDetails.yearlySalary.min") ||
                      getValues("generalDetails.yearlySalary.min") === 0
                        ? `$ ${formattedSalary(
                            getValues("generalDetails.yearlySalary.min")
                          )}`
                        : ""
                    }${
                      (getValues("generalDetails.yearlySalary.min") ||
                        getValues("generalDetails.yearlySalary.min") === 0) &&
                      (getValues("generalDetails.yearlySalary.max") ||
                        getValues("generalDetails.yearlySalary.max") === 0)
                        ? `  -  `
                        : ""
                    }${
                      getValues("generalDetails.yearlySalary.max") ||
                      getValues("generalDetails.yearlySalary.max") === 0
                        ? `$ ${formattedSalary(
                            getValues("generalDetails.yearlySalary.max")
                          )}`
                        : ""
                    }`}
                  </div>
                </div>
              ) : null}

              {(getValues("generalDetails.officeLocation") ||
                getValues("generalDetails.officePolicy") ||
                (editMode && editCompany)) && (
                <div className="mb-4">
                  <SlLocationPin
                    size={18}
                    color="#FFFFFF"
                    className=" mr-3 inline-block"
                  />
                  {editMode && editCompany ? (
                    <div className="mb-1 mr-2 inline-block text-white">
                      <select
                        {...register("generalDetails.officePolicy")}
                        disabled={!(editMode && editCompany)}
                        className={classNames(
                          editInputClasses,
                          "disabled:border-0 disabled:opacity-100"
                        )}
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
                  ) : (
                    getValues("generalDetails.officePolicy") && (
                      <div className="mb-1 mr-2 inline-block text-white">
                        {parseOfficePolicy(
                          getValues("generalDetails.officePolicy")
                        )}
                      </div>
                    )
                  )}
                  {editMode && editCompany ? (
                    <div className="mb-1 mr-2 inline-block text-white">
                      <input
                        {...register("generalDetails.officeLocation")}
                        placeholder="Office location"
                        className={classNames(editInputClasses, "")}
                      />
                    </div>
                  ) : (
                    getValues("generalDetails.officeLocation") && (
                      <div className="mb-1 mr-2 inline-block text-white">
                        {getValues("generalDetails.officeLocation")}
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            <div className="mb-4 flex max-w-sm items-center rounded-md bg-[rgba(255,255,255,0.39)] p-1">
              <div className="text-edenGray-600 ml-1 mr-3 flex items-center justify-center rounded-md border bg-[#F7F8F7] px-4 py-1.5">
                {submitted ? (
                  typeof matchstimate === "number" ? (
                    <h4
                      className={classNames(
                        "text-lg",
                        getGrade(matchstimate).color
                      )}
                    >
                      {getGrade(matchstimate).letter}
                    </h4>
                  ) : (
                    <div
                      className="h-8 w-8"
                      style={{ animation: "spin 2s ease-in-out infinite" }}
                    >
                      <EdenIconExclamationAndQuestion className="h-full w-full" />
                    </div>
                  )
                ) : (
                  <h4 className="text-lg">?</h4>
                )}
              </div>
              <div className="flex items-center">
                <div className="flex flex-col flex-nowrap justify-center pr-4">
                  <h3 className="text-white">Matchstimate{"  "}</h3>

                  <p className="text-xs !text-white">
                    {!submitted ? (
                      <>
                        <a
                          href="#"
                          onClick={() => handleInterviewNav()}
                          className="cursor-pointer underline"
                        >
                          Upload your resume
                        </a>{" "}
                        to unlock
                      </>
                    ) : typeof matchstimate !== "number" ? (
                      <>Your score is being processed</>
                    ) : null}
                  </p>
                </div>
                <Tooltip className="!text-edenGray-500 ml-auto mr-1 inline">
                  This helps candidates understand if this opportunity is a
                  match for them.
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="relative mx-auto -mt-8 mb-12 flex w-[90%] items-center rounded-md bg-[#F7F8F7] p-2 lg:w-[70%]">
            {!submitted ? (
              <>
                <div className="bg-edenGray-100 mr-4 flex items-center justify-center rounded-lg p-4">
                  <EdenIconExclamationAndQuestion className="h-8 w-8" />
                </div>
                <div className="mr-4">
                  <h4>Kickoff your AI -interview right now!</h4>
                  <p className="text-edenGray-500 text-sm">
                    Our AI interview helps you hit on everything the hiring
                    manager wants to know + we’ll re-use your interview to help
                    skip the fist interview for other opportunities
                  </p>
                </div>
                <Link
                  href={`/interview/${position?._id}`}
                  className="ml-auto flex items-center whitespace-nowrap rounded-md bg-black px-8 py-4 text-white hover:bg-white hover:text-black"
                  onClick={() => {
                    handleInterviewNav();
                  }}
                >
                  Interview now
                </Link>
              </>
            ) : (
              <p className="text-edenGray-600 w-full py-2 text-center">
                You have applied to this position
              </p>
            )}
          </div>
        </section>

        <div className="mx-auto grid w-full max-w-screen-xl grid-cols-12 gap-x-6 px-4 pb-16">
          {/* ---- POSITION DETAILS ---- */}
          <div className="col-span-12 md:col-span-7">
            <section className="mb-8 overflow-hidden rounded-3xl bg-[#F7F8F7]">
              <div className="bg-black px-4 py-3">
                <h2 className="text-white">Role</h2>
              </div>
              <div className="px-4 py-4">
                <div className="border-edenGray-300 mb-4 border-b-2">
                  <h3 className=" mb-2 font-semibold">Who you are</h3>
                  <div className="mb-4 text-xs">
                    {editMode ? (
                      <>
                        <textarea
                          rows={8}
                          {...register("whoYouAre")}
                          className={classNames(editInputClasses, "w-full")}
                        />
                      </>
                    ) : (
                      <ul className="text-edenGray-900 list-disc pl-4 ">
                        {getValues("whoYouAre") &&
                          getValues("whoYouAre")
                            .split("\n")
                            .filter((line: any) => line.trim() !== "")
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="">
                  <h3 className=" mb-2 font-semibold">What the job involves</h3>
                  <div className="text-xs">
                    {editMode ? (
                      <>
                        <textarea
                          rows={8}
                          {...register("whatTheJobInvolves")}
                          className={classNames(editInputClasses, "w-full")}
                        />
                      </>
                    ) : (
                      <ul className="text-edenGray-900 list-disc pl-4 ">
                        {getValues("whatTheJobInvolves") &&
                          getValues("whatTheJobInvolves")
                            .split("\n")
                            .filter((line: any) => line.trim() !== "")
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ---- SHARE & REPORT ---- */}
            <section className="mb-8 grid grid-cols-2 gap-4 overflow-hidden rounded-md bg-[#F7F8F7] px-4 py-4">
              <div
                className="group col-span-1 flex w-fit cursor-pointer items-center"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://edenprotocol.app/${position.company?.slug}/jobs/${position._id}`
                  );
                  toast.success("Job link copied");
                }}
              >
                <HiOutlineShare
                  size={20}
                  className=" group-hover:text-edenGreen-400 mr-2 inline"
                />
                <span className="group-hover:text-edenGray-500 whitespace-nowrap text-xs group-hover:underline">
                  Share this job
                </span>
              </div>
              <div className="group col-span-1 flex w-fit cursor-pointer items-center">
                <HiFlag
                  size={20}
                  className=" group-hover:text-edenGreen-400 mr-2 inline"
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
                  className=" group-hover:text-edenGreen-400 mr-2 inline"
                />
                <span className="group-hover:text-edenGray-500 whitespace-nowrap text-xs group-hover:underline">
                  <a href="mailto:tom@joineden.xyz">Refer someone & get paid</a>
                </span>
              </div>
            </section>
          </div>

          <div className="col-span-12 md:col-span-5">
            {/* ---- YOU & THE ROLE ---- */}
            {!submitted && (
              <section className="mb-8 overflow-hidden rounded-3xl bg-[#F7F8F7]">
                <div className="bg-black px-4 py-3">
                  <h2 className="text-white">You & the role</h2>
                </div>
                <div className="px-4 py-4">
                  <div className="bg-edenGray-100 mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md">
                    <AiOutlineEyeInvisible size={"1.4rem"} />
                  </div>
                  <h3 className="mb-4 text-center font-semibold">
                    Section Locked!
                  </h3>
                  <p className="mb-2 text-center font-semibold">
                    Upload your resume to unlock:
                  </p>
                  <ul className="text-edenGray-900 list-none pl-4 text-center text-sm">
                    <li className="mb-1"> If you’d be a good fit</li>
                    <li className="mb-1">
                      What your strengths are for this opportunity
                    </li>
                    <li className="mb-1">
                      What your weaknesses are for this opportunity
                    </li>
                  </ul>

                  <div className="mt-4 flex justify-center">
                    <Link
                      href={`/interview/${position?._id}`}
                      className="flex items-center whitespace-nowrap rounded-md bg-black px-12 py-4 text-white hover:bg-white hover:text-black"
                      onClick={() => {
                        handleInterviewNav();
                      }}
                    >
                      Interview now
                    </Link>
                  </div>
                </div>
              </section>
            )}

            {/* ---- COMPANY DETAILS ---- */}
            <section className="mb-8 overflow-hidden rounded-3xl bg-[#F7F8F7]">
              <div className="bg-black px-4 py-3">
                <h2 className="text-white">Company</h2>
              </div>

              <div className="px-4 pt-4">
                {editMode && editCompany ? (
                  <label
                    htmlFor="file-upload"
                    className={classNames(
                      "relative block w-fit cursor-pointer rounded-md hover:bg-black hover:bg-opacity-20",
                      editMode
                        ? "border-utilityOrange -my-[2px] mb-1 border-2"
                        : ""
                    )}
                  >
                    {uploadingCompanyImage && (
                      <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
                        <Loading title="" />
                      </div>
                    )}
                    <img
                      src={getValues("company.imageUrl") || ""}
                      className="mb-2 h-20"
                      alt={position?.company?.name || ""}
                    />
                    <HiPencil
                      size={20}
                      className="text-utilityOrange absolute bottom-1 right-1 opacity-60"
                    />
                    <input
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInput}
                      type="file"
                      accept=".png"
                    ></input>
                  </label>
                ) : (
                  // <img
                  //   src={getValues("company.imageUrl") || ""}
                  //   className="mb-2 h-20"
                  //   alt={position?.company?.name || ""}
                  // />
                  <div className="relative mb-2 flex h-[80px] max-w-[180px] items-start">
                    <img
                      className="h-[80px]"
                      src={`${
                        position?.company?.imageUrl
                          ? position?.company?.imageUrl
                          : "/default-company-image.svg"
                      }`}
                      alt={`${position?.company?.name} company image`}
                    />
                  </div>
                )}
                <p className="text-edenGray-900 mb-4 text-sm">
                  {editMode && editCompany ? (
                    <>
                      <textarea
                        rows={3}
                        {...register("company.description")}
                        className={classNames(editInputClasses, "w-full")}
                      />
                    </>
                  ) : (
                    `${getValues("company.description")}`
                  )}
                </p>

                {(getValues("company.employeesNumber") ||
                  getValues("company.employeesNumber") === 0 ||
                  (editMode && editCompany)) && (
                  <p className="text-edenGray-900 mb-2 text-sm">
                    <HiOutlineUsers size={20} className=" mr-2 inline-block" />
                    {editMode && editCompany ? (
                      <>
                        <input
                          type="number"
                          {...register("company.employeesNumber", {
                            valueAsNumber: true,
                          })}
                          className={classNames(editInputClasses, "w-20")}
                        />
                        {` employees`}
                      </>
                    ) : (
                      `${getValues("company.employeesNumber")} employees`
                    )}
                  </p>
                )}
                {(editMode || !!position?.company?.tags?.length) && (
                  <div className="mb-2 text-sm">
                    <GoTag size={24} className=" mr-2 inline-block" />
                    <CompanyTagsField
                      control={control}
                      getValues={getValues}
                      register={register}
                      editMode={editMode && editCompany}
                    />
                  </div>
                )}

                <div className="bg-edenGreen-200 rounded-md p-4 text-sm">
                  <div className="mb-2 flex">
                    <div className="bg-edenGreen-300 mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                      <HiOutlineHeart size={16} className="" />
                    </div>
                    <h3 className="">What&apos;s to love?</h3>
                  </div>
                  <p className="text-edenGray-700 text-xs">
                    {editMode && editCompany ? (
                      <textarea
                        {...register("company.whatsToLove")}
                        rows={4}
                        className={classNames(editInputClasses, "w-full")}
                      />
                    ) : (
                      getValues("company.whatsToLove")
                    )}
                  </p>
                </div>
              </div>
              <div className="px-6">
                {/* ---- MISSION ---- */}
                {(position?.company?.mission || editMode) && (
                  <div className="border-edenGray-300 border-b-2 py-4 last:!border-0">
                    <h3 className="">About the company</h3>
                    <p className="text-xs">
                      {editMode ? (
                        <>
                          <textarea
                            rows={8}
                            {...register("company.mission")}
                            className={classNames(editInputClasses, "w-full")}
                          />
                        </>
                      ) : (
                        getValues("company.mission")
                      )}
                    </p>
                  </div>
                )}

                {/* ---- INSIGHTS ---- */}
                {position?.company?.insights &&
                  position?.company?.insights.length > 0 && (
                    <div className="border-edenGray-300 border-b-2 py-4 last:!border-0">
                      <h3 className="">Insights</h3>
                      <div className="relative flex w-full flex-wrap">
                        {position?.company?.insights?.map((insight, index) => (
                          <div
                            key={index}
                            className="mt-2 flex min-w-[50%] items-center"
                          >
                            <div className="mr-2 flex h-6 w-8 items-center justify-center rounded-md bg-black pb-px">
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
                  <div className="border-edenGray-300 border-b-2 py-4 last:!border-0">
                    <h3 className="">Eden&apos;s Take</h3>
                    <p className="text-xs">{position.company.edenTake}</p>
                  </div>
                )}

                {/* ---- WIDGETS ---- */}
                {(editMode ||
                  (position?.company?.funding &&
                    position?.company?.funding?.length > 0)) && (
                  <div className="border-edenGray-300 border-b-2 py-4 last:!border-0">
                    {/* <h3 className=" mb-4">Widgets</h3> */}

                    {/* ---- FUNDING ---- */}
                    <FundingWidget
                      control={control}
                      getValues={getValues}
                      register={register}
                      editMode={editMode}
                    />
                    {/* ---- CULTURE ---- */}
                    {/* {position?.company?.culture && (
                    <div className="mb-4 last:mb-0">
                    <h3 className=" mb-2">
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
                {(editMode ||
                  (position?.company?.benefits &&
                    getValues("company.benefits") != "N/A")) && (
                  <div className="border-edenGray-300 border-b-2 py-4 last:!border-0">
                    <h3 className="">Benefits & perks</h3>
                    <div className="text-xs">
                      {editMode ? (
                        <>
                          <textarea
                            rows={8}
                            {...register("company.benefits")}
                            className={classNames(editInputClasses, "w-full")}
                          />
                        </>
                      ) : (
                        <ul className="text-edenGray-900 list-disc pl-4 ">
                          {getValues("company.benefits")
                            .split("\n")
                            .filter((line: any) => line.trim() !== "")
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {/* ---- COMPANY VALUES ---- */}
                {(editMode ||
                  (position?.company?.values &&
                    getValues("company.values") != "N/A")) && (
                  <div className="border-edenGray-300 border-b-2 py-4 last:!border-0">
                    <h3 className="">Company Values</h3>
                    <div className="text-xs">
                      {editMode ? (
                        <>
                          <textarea
                            rows={8}
                            {...register("company.values")}
                            className={classNames(editInputClasses, "w-full")}
                          />
                        </>
                      ) : (
                        <ul className="text-edenGray-900 list-disc pl-4 ">
                          {getValues("company.values")
                            .split("\n")
                            .filter((line: any) => line.trim() !== "")
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {/* ---- FOUNDERS ---- */}
                {(editMode ||
                  (position?.company?.founders &&
                    getValues("company.founders") != "N/A")) && (
                  <div className="border-edenGray-300 border-b-2 py-4 last:!border-0">
                    <h3 className="">Founders</h3>
                    <p className="text-xs">
                      {editMode ? (
                        <>
                          <textarea
                            rows={8}
                            {...register("company.founders")}
                            className={classNames(editInputClasses, "w-full")}
                          />
                        </>
                      ) : (
                        getValues("company.founders")
                      )}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* ---- FOOTER APPLY ---- */}

        {!editMode ? (
          <>
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
          </>
        ) : (
          <footer className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-center bg-black">
            <Button
              onClick={handleSubmit((data) =>
                onSubmit({ ...data, status: PositionStatus.Unpublished })
              )}
              className="hover:!bg-edenGreen-300 mr-4 border-white text-white hover:!border-white hover:!text-black"
            >
              Save as draft
            </Button>
            <Button
              onClick={() => {
                setPublishModalOpen(true);
              }}
              variant="secondary"
              className="!border-2 border-white bg-white !text-black"
            >
              Publish
            </Button>

            <Modal open={bulkUpdateLoading} closeOnEsc={false}>
              <div className="h-80">
                <Loading title={"Updating position"} />
              </div>
            </Modal>

            <div
              className={`pointer-events-none fixed left-0 top-0 z-50 h-screen w-screen	`}
              ref={ref}
            >
              <Confetti
                width={width}
                height={height}
                numberOfPieces={confettiRun ? 250 : 0}
                colors={["#F0F4F2", "#19563F", "#FCEEF5", "#F5C7DE"]}
              />
            </div>
            <Modal open={publishModalOpen} closeOnEsc={false}>
              <div className="flex flex-col items-center justify-center px-28 py-8 text-center">
                <EdenIconExclamationAndQuestion className="mb-2 h-16" />
                <h2 className=" mb-4">Ready to publish?</h2>
                <p className="mb-12">
                  Soon after you publish Eden will start recruiting in the
                  community & put the magic into magic job-post.
                </p>
                <div className="flex justify-center gap-8">
                  <Button
                    onClick={() => {
                      setPublishModalOpen(false);
                      // handleSubmit((data) =>
                      //   onSubmit({
                      //     ...data,
                      //     status: PositionStatus.Unpublished,
                      //   })
                      // );
                    }}
                  >
                    Not done yet
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleSubmit((data) =>
                      onSubmit({ ...data, status: PositionStatus.Active })
                    )}
                  >
                    Let&apos;s do it!
                  </Button>
                </div>
              </div>
            </Modal>

            <Modal open={trainAiModalOpen} closeOnEsc={false}>
              <div className="flex flex-col items-center justify-center px-8 py-8 pt-2 text-center">
                <div
                  className={
                    " mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F8F7]"
                  }
                >
                  <BsLightningFill size={"2rem"} />
                </div>
                <h2 className=" mb-4">
                  One last thing: should we configure the AI-interview for you?
                </h2>
                <p className="mb-4">
                  The way talent applies to your opportunity is through an
                  AI-powered interview.
                </p>
                <p className="mb-8">
                  Think of this like the screening interview that a recruiter
                  would do built into the job board.
                </p>
                <div className="flex justify-center gap-8">
                  <Button
                    onClick={() => {
                      router.push(
                        `/dashboard/${position.company?.slug}/${position._id}`
                      );
                    }}
                  >
                    Auto-configure the AI-interview for me
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      router.push(
                        `/dashboard/${position.company?.slug}/${position._id}/train-eden-ai`
                      );
                    }}
                  >
                    Let me configure the AI-interview
                  </Button>
                </div>
              </div>
            </Modal>
          </footer>
        )}
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
  cache: new InMemoryCache({ resultCaching: false }),
});

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const positionID = ctx.params?.positionID;
  const { edit } = ctx.query;

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
          candidates {
            submitted
            scoreCardTotal {
              score
            }
            user {
              _id
            }
          }
        }
      }
    `,
    variables: {
      fields: {
        _id: positionID,
      },
      ssr: true,
      cache: "no-cache",
    },
  });

  const session = getCookieFromContext(ctx);
  const userApplied = data.findPosition.candidates.find(
    (_cand: CandidateType) => _cand.user?._id === session?._id
  );

  let submitted = false;
  let matchstimate = null;

  if (userApplied) submitted = true;
  if (
    userApplied?.scoreCardTotal &&
    typeof userApplied?.scoreCardTotal?.score === "number" &&
    userApplied?.scoreCardTotal?.score >= 0
  )
    matchstimate = userApplied?.scoreCardTotal?.score * 100;

  // if not edit mode don't authenticate, allow
  if (edit !== "true") {
    return {
      props: {
        position: data.findPosition || null,
        submitted: submitted,
        matchstimate: matchstimate,
      },
    };
  }

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
        companySlug: data.findPosition.company.slug,
      }),
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
    }
  );

  console.log("===>", res.status);
  console.log(session?._id, session?.accessLevel, session?.email);

  // if not authorised, redirect to request-access
  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access?company=${data.findPosition.company.slug}`,
        permanent: false,
      },
    };
  }

  // if company does not exist, redirect to create-company
  //@TODO maybe we need a 404 page for this
  if (res.status === 404) {
    return {
      redirect: {
        destination: `/create-company`,
        permanent: false,
      },
    };
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

PositionPage.getLayout = (page) => (
  <BrandedAppUserLayout>{page}</BrandedAppUserLayout>
);

export default PositionPage;

export interface IFundingWidget {
  control: Control;
  register: UseFormRegister<any>;
  getValues: UseFormGetValues<any>;
  editMode: boolean;
}

const FundingWidget = ({
  control,
  register,
  getValues,
  editMode,
}: IFundingWidget) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm
    name: "company.funding", // unique name for your Field Array
  });

  return (
    <div className="mb-4 last:mb-0">
      <h3 className=" mb-2">Funding</h3>
      <div
        className={classNames(
          "bg-edenGreen-300 rounded-md p-4",
          editMode ? "px-1" : ""
        )}
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative mb-2 flex items-center justify-between last:mb-0"
          >
            <span className="text-white">
              {editMode ? (
                <input
                  placeholder="date"
                  {...register(`company.funding.${index}.date`)}
                  className={classNames(editInputClasses, "mx-0 w-full")}
                />
              ) : (
                getValues(`company.funding.${index}.date`)
              )}
            </span>
            <div className="bg-edenPink-400 mx-1 h-2 w-2 rounded-full px-1"></div>
            <span className="text-white">
              {editMode ? (
                <input
                  placeholder="amount"
                  {...register(`company.funding.${index}.amount`)}
                  className={classNames(editInputClasses, "mx-0 w-full")}
                />
              ) : (
                getValues(`company.funding.${index}.amount`)
              )}
            </span>
            <div className="bg-edenGreen-600 text-edenPink-400 font-Moret inline-block rounded-xl px-3 py-0.5 font-bold">
              {editMode ? (
                <input
                  placeholder="series"
                  {...register(`company.funding.${index}.name`)}
                  className={classNames(editInputClasses, "mx-0 w-full")}
                />
              ) : (
                getValues(`company.funding.${index}.name`)
              )}
            </div>
            {editMode && (
              <div
                className="bg-edenGray-500 text-utilityRed border-utilityRed hover:text-edenGray-500 hover:bg-utilityRed absolute -right-6 mx-auto flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 pb-1 text-xl font-bold"
                onClick={() => remove(index)}
              >
                -
              </div>
            )}
          </div>
        ))}
        {editMode && (
          <div
            className="bg-edenGray-500 text-utilityOrange border-utilityOrange hover:text-edenGray-500 hover:bg-utilityOrange mx-auto flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 pb-1 text-xl font-bold"
            onClick={() => append({ date: "", amount: "", name: "" })}
          >
            +
          </div>
        )}
      </div>
    </div>
  );
};

export interface ICompanyTagsField {
  control: Control;
  register: UseFormRegister<any>;
  getValues: UseFormGetValues<any>;
  editMode: boolean;
}

const CompanyTagsField = ({
  control,
  register,
  getValues,
  editMode,
}: IFundingWidget) => {
  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm
    name: "company.tags", // unique name for your Field Array
  });

  return (
    <div className="inline">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="bg-edenGray-100 relative mb-2 mr-2 inline-block max-w-[28%] rounded-md px-2 pb-1"
        >
          <span className="">
            {editMode ? (
              <input
                placeholder="tag"
                {...register(`company.tags.${index}`)}
                className={classNames(
                  "-mx-2 w-[calc(100%+1rem)] px-0",
                  editInputClasses
                )}
              />
            ) : (
              getValues(`company.tags.${index}`)
            )}
          </span>
          {editMode && (
            <div
              className="bg-edenGray-500 text-utilityRed border-utilityRed hover:text-edenGray-500 hover:bg-utilityRed absolute -right-2 -top-2 mx-auto flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 pb-1 text-xl font-bold"
              onClick={() => remove(index)}
            >
              -
            </div>
          )}
        </div>
      ))}
      {editMode && (
        <div
          className="bg-edenGray-500 text-utilityOrange border-utilityOrange hover:text-edenGray-500 hover:bg-utilityOrange ml-2 inline-block h-6 w-6 cursor-pointer rounded-full border-2 text-xl font-bold"
          onClick={() => append("")}
        >
          <div className="flex h-full w-full items-center justify-center">
            +
          </div>
        </div>
      )}
    </div>
  );
};
