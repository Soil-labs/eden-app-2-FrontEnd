// eslint-disable-next-line no-unused-vars
import { gql, useQuery } from "@apollo/client";
import { DynamicConnectButton } from "@dynamic-labs/sdk-react-core";
// eslint-disable-next-line no-unused-vars
import { CompanyContext, UserContext } from "@eden/package-context";
import { Company, Maybe, Position } from "@eden/package-graphql/generated";
import {
  AppUserLayout,
  Badge,
  Button,
  EdenAiProcessingModal,
  EdenIconExclamation,
  EdenTooltip,
  SEOJobBoard,
} from "@eden/package-ui";
import axios from "axios";
// import { InferGetStaticPropsType } from "next";
// import ReactTooltip from "react-tooltip";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { NextPageWithLayout } from "../../_app";
const ReactTooltip = dynamic<any>(() => import("react-tooltip"), {
  ssr: false,
});

const JobsPage: NextPageWithLayout = ({ company, positions }) => {
  const router = useRouter();
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const _positions: Position[] =
    (company?.type === "COMMUNITY"
      ? positions
      : positions?.map((item: any) => {
          //this map avoids having to fetch company again inside each position in backend
          item.company = {
            _id: company?._id,
            name: company?.name,
            slug: company?.slug,
            imageUrl: company?.imageUrl,
          };
          return item;
        })) || [];

  const handleOasisClick = async () => {
    setLoadingSpinner(true);
    await router.push("/signup");
    setLoadingSpinner(false);
  };

  return (
    <>
      <SEOJobBoard
        title={company?.name}
        description={company.description}
        company={company}
      />
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

      {/* -------- Banner -------- */}
      <div className="mx-auto mb-4 h-[335px] max-w-6xl bg-[url('/banner-job-board.png')] pt-12">
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

      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-4 pb-16">
        {company?.type !== "COMMUNITY" && <div className="col-span-2"></div>}
        {/* -------- Join Oasis Section -------- */}
        <div className={"col-span-8 px-4"}>
          {company?.type === "COMMUNITY" && (
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
          )}

          {/* -------- Jobs Section -------- */}
          <section className="">
            <h3 className="mb-2">Open opportunities</h3>
            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              {_positions
                ?.reverse()
                .map((position: Maybe<Position>, index: number) => {
                  return (
                    <PositionCard
                      position={position!}
                      setLoadingSpinner={setLoadingSpinner}
                      key={index}
                    />
                  );
                })}
            </div>
          </section>
        </div>

        {/* -------- Community Details Section -------- */}
        {company?.type !== "COMMUNITY" && <div className="col-span-2"></div>}
        {company?.type === "COMMUNITY" && (
          <div className="relative col-span-4">
            <PostJobToCommunityCard
              company={company}
              setLoadingSpinner={setLoadingSpinner}
            />
          </div>
        )}
      </div>
      <EdenAiProcessingModal
        title="Getting things ready for you"
        open={loadingSpinner}
      />
    </>
  );
};

JobsPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export const getServerSideProps = async (context: any) => {
  try {
    const companyRes = await axios.post(
      process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
      {
        headers: {
          "Access-Control-Allow-Origin": `*`,
        },
        variables: { fields: { slug: context.params.slug } },
        query: `
      query ($fields: findCompanyFromSlugInput) {
        findCompanyFromSlug(fields: $fields) {
          _id
          name
          type
          slug
          description
          imageUrl
          mission
          benefits
          values
          founders
          whatsToLove
          positions {
            _id
            name
            icon
            status
            talentList {
              _id
              name
            }
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
              slug
              imageUrl
            }
          }
          employees {
            status
            typeT
            user {
              _id
              discordName
              discordAvatar
            }
          }
          # candidatesNum
          skillsNum
        }
      }
    `,
      }
    );

    const company = companyRes.data.data.findCompanyFromSlug;
    let positions;

    if (company?.type === "COMMUNITY") {
      const communityPositions = await axios.post(
        process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
        {
          headers: {
            "Access-Control-Allow-Origin": `*`,
          },
          variables: {
            fields: { slug: context.params.slug },
          },
          query: `
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
              slug
              imageUrl
              whatsToLove
            }
          }
        }
      `,
        }
      );

      positions = communityPositions.data.data.findPositionsOfCommunity;
    } else {
      positions = company?.positions;
      positions?.map((item: any) => {
        //this map avoids having to fetch company again inside each position in backend
        item!.company = {
          _id: company?._id,
          name: company?.name,
          slug: company?.slug,
          imageUrl: company?.imageUrl,
        };
        return item;
      });
    }

    const filteredPositions = positions.filter(
      (_position: Position) =>
        _position?.status !== "ARCHIVED" &&
        _position?.status !== "UNPUBLISHED" &&
        _position?.status !== "DELETED"
    );

    return {
      props: {
        company,
        positions: filteredPositions,
      },
      // 10 min to rebuild all paths
      // (this means new data will show up after 10 min of being added)
      // revalidate: 600,
    };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};

// export const getStaticPaths = async () => {
//   try {
//     const res = await axios.post(
//       process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
//       {
//         headers: {
//           "Access-Control-Allow-Origin": `*`,
//         },
//         variables: { fields: [] },
//         query: `
//         query FindCompanies($fields: findCompaniesInput) {
//           findCompanies(fields: $fields) {
//             _id
//             slug
//           }
//         }
//         `,
//       }
//     );

//     const paths = res.data.data.findCompanies
//       .filter((_comp: any) => !!_comp.slug)
//       .map((_comp: any) => ({
//         params: { slug: _comp.slug },
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
//       fallback: true,
//     };
//   }
// };

export default JobsPage;

type PositionCardProps = {
  position: Position;
  setLoadingSpinner: Dispatch<SetStateAction<boolean>>;
};

const PositionCard = ({ position, setLoadingSpinner }: PositionCardProps) => {
  const router = useRouter();

  const handlePickJobs = async (pos: any) => {
    setLoadingSpinner(true);
    await router.push(`/${pos.company?.slug}/jobs/${pos._id}`);
    setLoadingSpinner(false);
  };

  return (
    <div
      className="border-edenGray-100 relative col-span-1 inline-block h-[135px] min-w-[20rem] cursor-pointer rounded-md border bg-white px-4 py-6 align-top transition-all"
      onClick={() => {
        handlePickJobs(position);
      }}
    >
      <div className="flex w-full flex-row items-center pr-14">
        <div className="flex h-[60px] w-[60px] items-center justify-around rounded-md">
          <img
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
          <p className="text-edenGray-900">{position?.company?.name}</p>
          <p className="text-edenGray-900 text-sm capitalize">
            {position?.generalDetails?.officePolicy &&
              position?.generalDetails?.officePolicy}
            {position?.generalDetails?.contractType
              ? " • " + position?.generalDetails?.contractType
              : " • Fulltime"}
          </p>
          {(!!position?.generalDetails?.yearlySalary?.min ||
            position?.generalDetails?.yearlySalary?.min === 0) && (
            <p className="text-edenGray-500 text-xs">
              ${position?.generalDetails?.yearlySalary.min / 1000 + "k"}
              {position?.generalDetails?.yearlySalary.max
                ? " - $" +
                  position?.generalDetails.yearlySalary.max / 1000 +
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
            <div className="w-80">
              <p>{position.company?.whatsToLove}</p>
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
};

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

type PostJobToCommunityCardProps = {
  company: Company;
  setLoadingSpinner: Dispatch<SetStateAction<boolean>>;
};

const PostJobToCommunityCard = ({
  company,
  setLoadingSpinner,
}: PostJobToCommunityCardProps) => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);

  const handlePostJobClick = async () => {
    setLoadingSpinner(true);
    if (
      currentUser?.companies &&
      currentUser?.companies[0] &&
      currentUser?.companies[0].company?.slug
    ) {
      await router.push(
        `/${currentUser?.companies[0].company?.slug}/dashboard`
      );
    } else {
      await router.push(`/pricing?community=${company?._id}`);
    }
    setLoadingSpinner(false);
  };

  const positionsList = [
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
    <section className="bg-edenGreen-100 -ml-2 -mt-40 mr-2 overflow-hidden rounded-md p-4">
      {company && (
        <div className="flex flex-row items-center justify-between">
          <Image
            className="rounded-md"
            width="68"
            height="68"
            src={`${
              company?.imageUrl
                ? company?.imageUrl
                : "/default-company-image.svg"
            }`}
            alt={`${company?.name} company image`}
          />

          {currentUser ? (
            <Button
              variant="secondary"
              className="float-right"
              onClick={handlePostJobClick}
            >
              Post a magic job
            </Button>
          ) : (
            <DynamicConnectButton buttonClassName="w-full py-2 px-4 font-Moret text-lg rounded-md font-bold bg-edenGreen-600 text-white hover:bg-edenGreen-300 hover:text-edenGreen-600 disabled:!text-edenGray-500 disabled:!bg-edenGray-100">
              Post a magic job
            </DynamicConnectButton>
          )}
        </div>
      )}
      <div className="pt-2">
        <div className="mb-4">
          {company?.name ? (
            <h2 className="text-edenGreen-600 mb-2">{company?.name}</h2>
          ) : (
            <h2 className="text-edenGreen-600 mb-2">Community talent oasis</h2>
          )}

          {!!company?.description && (
            <p className="mb-4 whitespace-pre-wrap text-sm">
              {company?.description}
            </p>
          )}
          <div className="flex flex-row gap-[7px]">
            <div className="border-1 border-edenGray-100 rounded-lg bg-white px-3 py-2">
              <p className="text-edenGray-700 text-xs leading-[16.8px]">
                Pre-vetted Candidates
              </p>
              <p className="text-sm font-medium leading-[19.6px]">273</p>
            </div>
            {/* <div className="border-1 border-edenGray-100 rounded-lg bg-white px-3 py-2">
              <p className="text-edenGray-700 text-xs leading-[16.8px]">
                Combined Skills
              </p>
              <p className="text-sm font-medium leading-[19.6px]">982</p>
            </div> */}
          </div>
        </div>

        <h2 className="text-edenGreen-600">Talent Pools active</h2>
        {positionsList.map((position, index) => (
          <Badge
            key={index}
            text={position || ""}
            cutText={22}
            className="border-edenGray-500 text-edenGreen-600 border"
          />
        ))}
      </div>
    </section>
  );
};
