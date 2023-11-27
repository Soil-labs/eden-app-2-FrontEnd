import { gql, useQuery } from "@apollo/client";
import { CompanyContext, UserContext } from "@eden/package-context";
import { Maybe, Position } from "@eden/package-graphql/generated";
import {
  AppUserLayout,
  Badge,
  Button,
  EdenAiProcessingModal,
  EdenIconExclamation,
  EdenTooltip,
  SEO,
} from "@eden/package-ui";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
// import { IconPickerItem } from "react-fa-icon-picker";
import ReactTooltip from "react-tooltip";

import type { NextPageWithLayout } from "../../_app";

export const FIND_POSITIONS_OF_COMMUNITY = gql`
  query Query($fields: findPositionsOfCommunityInput) {
    findPositionsOfCommunity(fields: $fields) {
      _id
      name
      status
      icon
      generalDetails {
        officePolicy
        contractType
        yearlySalary {
          min
          max
        }
      }
      company {
        _id
        name
        imageUrl
      }
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const FAKE_MATCHSTIMATES = [
  {
    grade: "HIGH",
    text: "Your previous experience at Humain.ai as a product designer makes you a very likely fit. Be sure to mention how your ideas ended up having a huge impact on the direction of the company.",
  },
  {
    grade: "MEDIUM",
    text: "Your previous experience at Humain.ai as a product designer makes you a medium fit. Be sure to mention how your ideas ended up having a huge impact on the direction of the company.",
  },
  {
    grade: "LOW",
    text: "You're not a strong fit for this opportunity. Be sure to mention how your ideas ended up having a huge impact on the direction of the company.",
  },
];

type CutTextTooltipProps = {
  text?: Maybe<string>;
};

const CutTextTooltip = ({ text }: CutTextTooltipProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [tooltipDisable, setTooltipDisable] = useState(true);

  const handleTooltipVisible = () => {
    if (elementRef.current) {
      const element = elementRef.current;
      const isTruncated = element.scrollWidth > element.clientWidth;

      setTooltipDisable(!isTruncated);
    }
  };

  useEffect(() => {
    handleTooltipVisible();

    window.addEventListener("resize", handleTooltipVisible);

    return () => {
      // Clean up the event listener when the component unmounts
      window.removeEventListener("resize", handleTooltipVisible);
    };
  }, []);

  return (
    <>
      <div
        data-tip={text}
        data-for={`badgeTip-${text}`}
        className="text-truncate"
        ref={elementRef}
      >
        {text}
        <ReactTooltip
          id={`badgeTip-${text}`}
          className="w-fit rounded-xl bg-black !opacity-100"
          place="top"
          disable={tooltipDisable}
          effect="solid"
        >
          {text}
        </ReactTooltip>
      </div>
    </>
  );
};

const HomePage: NextPageWithLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  const { company } = useContext(CompanyContext);

  const [loadingSpinner, setLoadingSpinner] = useState(false);

  console.log("company", company);
  const { currentUser } = useContext(UserContext);

  const { data: findPositionsOfCommunityData } = useQuery(
    FIND_POSITIONS_OF_COMMUNITY,
    {
      variables: {
        fields: {
          slug: router.query.slug,
        },
      },
    }
  );

  const handlePostJobClick = async () => {
    if (
      currentUser?.companies &&
      currentUser?.companies[0] &&
      currentUser?.companies[0].company?.slug
    ) {
      setLoadingSpinner(true);
      await router.push(
        `/${currentUser?.companies[0].company?.slug}/dashboard`
      );
      setLoadingSpinner(false);
    } else {
      setLoadingSpinner(true);
      await router.push(`/pricing?community=${company?._id}`);
      setLoadingSpinner(false);
    }
  };

  const handlePickJobs = async (pos: any) => {
    setLoadingSpinner(true);
    await router.push(`/eden/jobs/${pos._id}`);
    setLoadingSpinner(false);
  };

  const handleOasisClick = async () => {
    setLoadingSpinner(true);
    await router.push("/signup");
    setLoadingSpinner(false);
  };

  const positions = [
    "Frontend Development",
    "Backend Development",
    "AI",
    "Blockchain",
    "Product",
    "DevRel",
    "Technical Writer",
    "Product Design",
  ];

  return (
    <>
      <SEO />
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
      <div className="mb-4 h-[335px] w-full bg-[url('/banner-job-board.png')] pt-12">
        <section className="mx-auto mb-4 max-w-6xl px-4">
          <h1 className="text-edenPink-400 text-4xl font-bold leading-[50.4px]">
            {"Opportunity awaits in "}
            {company?.name}
            {"'s network"}
          </h1>
          <p className="text-edenPink-400 text-base font-normal leading-[22.4px]">
            {
              "Let's build the frontiers of the new web with frens of frens & their frens as well."
            }
          </p>
        </section>
      </div>
      {/* <section className="mb-4 w-full">
        <div
          className="bg-edenGreen-600 h-48 w-full bg-cover bg-center"
          style={{
            backgroundImage:
              company?.slug === "developer-dao" || company?.slug === "tesla10"
                ? "url(/d_d_banner.jpg)"
                : "",
          }}
        ></div>
      </section> */}
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-4">
        <div className="col-span-8 px-4">
          {/* {!currentUser && ( */}
          <section className="bg-edenPink-100 mb-4 rounded-md p-4">
            <h2 className="text-edenGreen-600 mb-2">
              Use AI to leverage the {company?.name} network & land your dream
              gig.
            </h2>
            <p className="text-edenGray-900 mb-4 text-sm">
              {
                "By joining the Oasis you'll have access to your personal AI-powered career coach who helps you apply, shine & land."
              }
            </p>
            <Button
              onClick={() => {
                // signIn("google", { callbackUrl: router.asPath });
                handleOasisClick();
              }}
            >
              Join the oasis
            </Button>
          </section>
          {/* )} */}
          <section className="">
            <h3 className="mb-2">Open opportunities</h3>
            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              {findPositionsOfCommunityData
                ?.findPositionsOfCommunity!.filter(
                  (_position: Position) =>
                    _position?.status !== "ARCHIVED" &&
                    _position?.status !== "DELETED"
                )
                ?.map((position: Maybe<Position>, index: number) => {
                  console.log(position);
                  // const randMatchstimate =
                  //   FAKE_MATCHSTIMATES[Math.round(Math.random() * 2)];

                  return (
                    <div
                      key={index}
                      className="border-edenGray-100 relative col-span-1 inline-block h-[135px] min-w-[20rem] cursor-pointer rounded-md border bg-white px-4 py-6 align-top transition-all"
                      onClick={() => {
                        handlePickJobs(position);
                      }}
                    >
                      <div className="flex w-full flex-row items-center pr-14">
                        <div className="flex h-[60px] w-[60px] items-center justify-around rounded-md">
                          {/* <IconPickerItem
                            icon={position?.icon || "FaCode"}
                            size={"2rem"}
                            color='#00462C'
                          /> */}
                          <Image
                            width="48"
                            height="48"
                            src={`${
                              position?.company?.imageUrl
                                ? position?.company?.imageUrl
                                : "/default-company-image.svg"
                            }`}
                            alt={`${position?.company?.name} company image`}
                          />
                        </div>
                        <div className="ml-3 w-full max-w-[calc(100%-64px)]">
                          <CutTextTooltip text={position?.name} />
                          <p className="text-edenGray-900">
                            {position?.company?.name}
                          </p>
                          <p className="text-edenGray-900 text-sm capitalize">
                            {position?.generalDetails?.officePolicy &&
                              position?.generalDetails?.officePolicy}
                            {position?.generalDetails?.contractType
                              ? " • " + position?.generalDetails?.contractType
                              : " • Fulltime"}
                          </p>
                          {(!!position?.generalDetails?.yearlySalary?.min ||
                            position?.generalDetails?.yearlySalary?.min ===
                              0) && (
                            <p className="text-edenGray-500 text-xs">
                              $
                              {position?.generalDetails?.yearlySalary.min /
                                1000 +
                                "k"}
                              {position?.generalDetails?.yearlySalary.max
                                ? " - $" +
                                  position?.generalDetails.yearlySalary.max /
                                    1000 +
                                  "k"
                                : ""}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="absolute right-6 top-6 flex h-full flex-col justify-between">
                        <EdenTooltip
                          id={`${position?._id}`}
                          innerTsx={
                            <div className="w-60">
                              <p>This is Eden</p>
                            </div>
                          }
                          place="top"
                          effect="solid"
                          backgroundColor="white"
                          border
                          borderColor="#e5e7eb"
                          padding="0.5rem"
                        >
                          <div className="bg-edenPink-200 h-[35px] w-[35px] rounded-full p-1 shadow-md">
                            <EdenIconExclamation className="h-full w-full" />
                          </div>
                        </EdenTooltip>
                      </div>
                      <div
                        className="bg-edenGreen-200 absolute bottom-6 right-6 flex h-[35px] w-[35px] items-center justify-around rounded-full p-1"
                        onClick={() => {
                          handlePickJobs(position);
                        }}
                      >
                        <div className="text-edenGreen-500 align-center flex h-4 w-4 items-center justify-around">
                          <svg
                            width="12"
                            height="11"
                            viewBox="0 0 12 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.0156 6.03906L7.26562 9.78906C6.98438 10.0938 6.49219 10.0938 6.21094 9.78906C5.90625 9.50781 5.90625 9.01562 6.21094 8.73438L8.67188 6.25H1.5C1.07812 6.25 0.75 5.92188 0.75 5.5C0.75 5.10156 1.07812 4.75 1.5 4.75H8.67188L6.21094 2.28906C5.90625 2.00781 5.90625 1.51562 6.21094 1.23438C6.49219 0.929688 6.98438 0.929688 7.26562 1.23438L11.0156 4.98438C11.3203 5.26562 11.3203 5.75781 11.0156 6.03906Z"
                              fill="#19563F"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>
        <div className="relative col-span-4">
          <section className="bg-edenGreen-100 -mt-40 rounded-md p-4">
            {company && (
              <div className="flex flex-row items-center justify-between">
                {/* added this validation bc it was breaking the build. Please make Image more stable.*/}
                {/* also src should be company.imageUrl */}

                <Image
                  className="rounded-full"
                  width="68"
                  height="68"
                  src={`${
                    company.imageUrl
                      ? company.imageUrl
                      : "/default-company-image.svg"
                  }`}
                  alt={`${company.name} company image`}
                />

                <Button
                  variant="secondary"
                  className="float-right"
                  onClick={handlePostJobClick}
                >
                  Post a magic job
                </Button>
              </div>
            )}
            <div className="pt-2">
              <div className="mb-4">
                {company?.name ? (
                  <h2 className="text-edenGreen-600 mb-2">{company?.name}</h2>
                ) : (
                  <h2 className="text-edenGreen-600 mb-2">
                    Community talent oasis
                  </h2>
                )}

                {!!company?.description && (
                  <p className="mb-4 whitespace-pre-wrap text-sm">
                    {company?.description}
                  </p>
                )}
                {/* <div className="text-edenGray-700 mr-2 inline-block rounded-md bg-white px-3 py-2 leading-none">
              <p className="text-xs">Pre-vetted Candidates</p>
              <span className="text-edenGray-900 text-sm font-medium leading-none">
                {company?.candidatesNum}
              </span>
            </div> */}
                <div className="flex flex-row gap-[7px]">
                  <div className="border-1 border-edenGray-100 rounded-lg bg-white px-3 py-2">
                    <p className="text-edenGray-700 text-xs leading-[16.8px]">
                      Pre-vetted Candidates
                    </p>
                    <p className="text-sm font-medium leading-[19.6px]">273</p>
                  </div>
                  <div className="border-1 border-edenGray-100 rounded-lg bg-white px-3 py-2">
                    <p className="text-edenGray-700 text-xs leading-[16.8px]">
                      Combined Skills
                    </p>
                    <p className="text-sm font-medium leading-[19.6px]">982</p>
                  </div>
                </div>
              </div>

              {/* {company?.description && (
            <div className="mb-4">
              <h3>About us</h3>
              <p className="text-xs">{company?.description}</p>
            </div>
          )} */}

              <h2 className="text-edenGreen-600">Talent Pools active</h2>
              {/* {company?.positions
            ?.filter(
              (_position) =>
                _position?.status !== "ARCHIVED" &&
                _position?.status !== "DELETED"
            )
            .slice(0, 5)
            .map((position, index) => (
              <Badge
                key={index}
                text={position?.name || ""}
                cutText={22}
                className="border-edenGray-500 text-edenGreen-600 border"
              />
            ))}
          {company?.positions &&
            company?.positions!.filter(
              (_position) =>
                _position?.status !== "ARCHIVED" &&
                _position?.status !== "DELETED"
            ).length > 6 && (
              <p className="text-edenGray-500 text-xs">and more...</p>
            )} */}
              {positions.map((position, index) => (
                <Badge
                  key={index}
                  text={position || ""}
                  cutText={22}
                  className="border-edenGray-500 text-edenGreen-600 border"
                />
              ))}
              <EdenAiProcessingModal
                title="Getting things ready for you"
                open={loadingSpinner}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;
