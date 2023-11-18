import { ApolloClient, gql, InMemoryCache, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Position, PositionStatus } from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  AskEdenPopUp,
  Button,
  EdenIconExclamationAndQuestion,
  Loading,
  Modal,
  SEO,
  Tooltip,
} from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
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
import { BsLightningFill, BsStar } from "react-icons/bs";
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

const editInputClasses =
  "inline-block bg-transparent -my-[2px] border-2 border-utilityOrange px-1 rounded-md outline-utilityYellow remove-arrow focus:outline-none";

const PositionPage: NextPageWithLayout = ({
  position,
}: {
  position: Position;
}) => {
  const router = useRouter();
  const { edit } = router.query;
  const editMode = edit === "true";

  const { currentUser } = useContext(UserContext);

  const [editCompany] = useState(true);
  const [uploadingCompanyImage, setUploadingCompanyImage] = useState(false);
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
      onCompleted() {
        console.log("completed update");

        setPublishModalOpen(false);
        setTrainAiModalOpen(true);
        // router.push(
        //   `/${position.company?.name}/dashboard/${position._id}/train-eden-ai`
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
    setConfettiRun(true);
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

  return (
    <>
      <SEO
        title={position?.company?.name || ""}
        description={position?.name || ""}
        image={position?.company?.imageUrl || ""}
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
                {editMode && editCompany ? (
                  <div className="bg-edenGray-100 w-fit rounded-md px-2 text-sm">
                    <select
                      {...register("generalDetails.contractType")}
                      disabled={!(editMode && editCompany)}
                      className={classNames(
                        editInputClasses,
                        "disabled:border-0 disabled:opacity-100"
                      )}
                    >
                      <option value={""} disabled hidden>
                        Select an option...
                      </option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contractor">Contractor</option>
                    </select>
                  </div>
                ) : (
                  <div className="bg-edenGray-100 w-fit rounded-md px-2 text-sm">
                    {getValues("generalDetails.contractType")}
                  </div>
                )}
              </div>

              {editMode && editCompany ? (
                <div className="mb-4">
                  <TbMoneybag
                    size={24}
                    className="text-edenGreen-600 mr-3 inline-block"
                  />
                  <div className="bg-edenGreen-600 text-edenPink-300 font-Moret inline-block rounded-xl px-3 py-0.5 font-bold">
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
                <div className="mb-4">
                  <TbMoneybag
                    size={24}
                    className="text-edenGreen-600 mr-3 inline-block"
                  />
                  <div className="bg-edenGreen-600 text-edenPink-300 font-Moret inline-block rounded-xl px-3 py-0.5 font-bold">
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
                    <Link
                      href={`/interview/${position._id}`}
                      className="underline"
                    >
                      Upload your resume
                    </Link>{" "}
                    to unlock
                  </p>
                </div>
              </div>

              {(getValues("generalDetails.officeLocation") ||
                getValues("generalDetails.officePolicy") ||
                (editMode && editCompany)) && (
                <div className="mb-4">
                  <SlLocationPin
                    size={24}
                    className="text-edenGreen-600 mr-3 inline-block"
                  />
                  {editMode && editCompany ? (
                    <div className="bg-edenGreen-600 text-edenPink-300 font-Moret mb-1 mr-2 inline-block rounded-xl px-3 py-0.5 font-bold">
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
                      <div className="bg-edenGreen-600 text-edenPink-300 font-Moret mb-1 mr-2 inline-block rounded-xl px-3 py-0.5 font-bold">
                        {parseOfficePolicy(
                          getValues("generalDetails.officePolicy")
                        )}
                      </div>
                    )
                  )}
                  {editMode && editCompany ? (
                    <div className="bg-edenGreen-600 text-edenPink-300 font-Moret mr-2 inline-block rounded-xl px-3 py-0.5 font-bold">
                      <input
                        {...register("generalDetails.officeLocation")}
                        className={classNames(editInputClasses, "")}
                      />
                    </div>
                  ) : (
                    getValues("generalDetails.officeLocation") && (
                      <div className="bg-edenGreen-600 text-edenPink-300 font-Moret mr-2 inline-block rounded-xl px-3 py-0.5 font-bold">
                        {getValues("generalDetails.officeLocation")}
                      </div>
                    )
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
                <img
                  src={getValues("company.imageUrl") || ""}
                  className="mb-2 h-20"
                  alt={position?.company?.name || ""}
                />
              )}
              <p className="text-edenGray-900 mb-2 text-sm">
                {editMode && editCompany ? (
                  <>
                    <textarea
                      rows={2}
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
                  <HiOutlineUsers
                    size={20}
                    className="text-edenGreen-600 mr-2 inline-block"
                  />
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
                <p className="mb-2 text-sm">
                  <GoTag
                    size={24}
                    className="text-edenGreen-600 mr-2 inline-block"
                  />
                  <CompanyTagsField
                    control={control}
                    getValues={getValues}
                    register={register}
                    editMode={editMode && editCompany}
                  />
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
                  {editMode && editCompany ? (
                    <textarea
                      {...register("company.whatsToLove")}
                      className={classNames(editInputClasses, "w-full")}
                    />
                  ) : (
                    getValues("company.whatsToLove")
                  )}
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
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                      </ul>
                    )}
                  </p>
                </div>
                <div className="">
                  <h3 className="text-edenGreen-600 mb-2 font-semibold">
                    What the job involves
                  </h3>
                  <p className="text-xs">
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
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                      </ul>
                    )}
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
                    `https://edenprotocol.app/${position.company?.slug}/jobs/${position._id}`
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
                  <Link href={`/interview/${position._id}`}>
                    <Button
                      variant="secondary"
                      // onClick={() => {
                      //   router.push(`/interview/${position._id}`);
                      // }}
                    >
                      Upload Your Resume
                    </Button>
                  </Link>
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
                {(position?.company?.mission || editMode) && (
                  <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                    <h3 className="text-edenGreen-600">About the company</h3>
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
                <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                  <h3 className="text-edenGreen-600 mb-4">Widgets</h3>

                  {/* ---- FUNDING ---- */}
                  {(editMode || position?.company?.funding) && (
                    <FundingWidget
                      control={control}
                      getValues={getValues}
                      register={register}
                      editMode={editMode}
                    />
                  )}
                  {/* ---- CULTURE ---- */}
                  {position?.company?.culture && (
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
                  )}
                </div>

                {/* ---- BENEFITS ---- */}
                {(editMode || position?.company?.benefits) && (
                  <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                    <h3 className="text-edenGreen-600">Benefits & perks</h3>
                    <p className="text-xs">
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
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                        </ul>
                      )}
                    </p>
                  </div>
                )}

                {/* ---- COMPANY VALUES ---- */}
                {(editMode || position?.company?.values) && (
                  <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                    <h3 className="text-edenGreen-600">Company Values</h3>
                    <p className="text-xs">
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
                            .map((line: any, index: any) => (
                              <li className="mb-4" key={index}>
                                {line}
                              </li>
                            ))}
                        </ul>
                      )}
                    </p>
                  </div>
                )}

                {/* ---- FOUNDERS ---- */}
                {(editMode || position?.company?.founders) && (
                  <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                    <h3 className="text-edenGreen-600">Founders</h3>
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
        <footer className="bg-edenGreen-600 fixed bottom-0 left-0 flex h-16 w-full items-center justify-center">
          {!editMode ? (
            <>
              <Link href={`/interview/${position._id}`}>
                <Button className="border-edenPink-400 !text-edenPink-400">
                  Apply with AI
                </Button>
              </Link>
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
            <>
              <Button
                onClick={handleSubmit((data) =>
                  onSubmit({ ...data, status: PositionStatus.Unpublished })
                )}
                className="border-edenPink-400 !text-edenPink-400 mr-4"
              >
                Save as draft
              </Button>
              <Button
                onClick={() => setPublishModalOpen(true)}
                className="border-edenPink-400 !text-edenPink-400"
              >
                Publish to Developer DAO
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
                  <h2 className="text-edenGreen-600 mb-4">Ready to publish?</h2>
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
                      "text-edenGreen-600 bg-edenPink-100 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full"
                    }
                  >
                    <BsLightningFill size={"2rem"} />
                  </div>
                  <h2 className="text-edenGreen-600 mb-4">
                    One last thing: should we configure the AI-interview for
                    you?
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
                          `/${position.company?.slug}/dashboard/${position._id}`
                        );
                      }}
                    >
                      Auto-configure the AI-interview for me
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        router.push(
                          `/${position.company?.slug}/dashboard/${position._id}/train-eden-ai`
                        );
                      }}
                    >
                      Let me configure the AI-interview
                    </Button>
                  </div>
                </div>
              </Modal>
            </>
          )}
        </footer>
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const positionID = ctx.params?.positionID;
  const { edit } = ctx.query;

  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    cache: new InMemoryCache(),
  });

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
    },
  });

  // if not edit mode don't authenticate, allow
  if (edit !== "true") {
    return {
      props: { position: data.findPosition || null },
    };
  }

  const session = await getSession(ctx);

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
        userID: session?.user!.id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  console.log(res.status);

  // if not authorised, redirect to request-access
  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access?company=${ctx.query.slug}`,
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
        destination: `/${_companyAuth.company.slug}/dashboard/subscription`,
        permanent: false,
      },
    };
  }

  // default allow
  return {
    props: { position: data.findPosition || null },
  };
}

PositionPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

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
      <h3 className="text-edenGreen-600 mb-2">Funding</h3>
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

  console.log(fields);

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
                placeholder="date"
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
          className="bg-edenGray-500 text-utilityOrange border-utilityOrange hover:text-edenGray-500 hover:bg-utilityOrange ml-2 inline-block h-6 w-6 cursor-pointer rounded-full border-2 pb-1 text-xl font-bold"
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
