import { Maybe, Position } from "@eden/package-graphql/generated";
import {
  BrandedAppUserLayout,
  EdenAiProcessingModal,
  EdenIconExclamation,
  EdenTooltip,
} from "@eden/package-ui";
import SEOBrandedJobBoard from "@eden/package-ui/src/SEO/SEOBrandedJobBoard";
import { classNames } from "@eden/package-ui/utils";
import axios from "axios";
import { InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

import type { NextPageWithLayout } from "../../_app";
// const ReactTooltip = dynamic<any>(() => import("react-tooltip"), {
//   ssr: false,
// });

const JobsPage: NextPageWithLayout = ({
  company,
  positions,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [officePolicyFilter, setOfficePolicyFilter] = useState<string[]>([]);

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

  const _filteredPositions =
    officePolicyFilter.length === 0
      ? []
      : _positions.filter((_position: Position) => {
          const _isHybrid =
            _position?.generalDetails?.officePolicy === "hybrid-1-day-office" ||
            _position?.generalDetails?.officePolicy === "hybrid-2-day-office" ||
            _position?.generalDetails?.officePolicy === "hybrid-3-day-office" ||
            _position?.generalDetails?.officePolicy === "hybrid-4-day-office";

          return (
            _isHybrid ||
            officePolicyFilter.includes(
              _position?.generalDetails?.officePolicy!
            )
          );
        });

  return (
    <>
      <SEOBrandedJobBoard
        title={company?.name}
        description={company?.description}
        company={company}
      />

      {/* -------- Banner -------- */}
      <section className="mx-auto mb-8 max-w-screen-xl px-2 md:px-8">
        <div className="relative mb-4 w-full rounded-xl bg-black bg-[url('/banner-job-board-mobile.png')] bg-cover bg-center px-4 pb-36 pt-8 md:h-96 md:bg-[url('/banner-job-board.png')] md:px-12 md:pb-2 md:pt-4">
          {/* company image */}
          <div className="">
            <Image
              width="72"
              height="72"
              className="mr-auto rounded-lg md:mx-auto"
              src={"/banner-job-board-logo.png"}
              alt={`${company?.name} company image`}
            />
          </div>
          <div className="flex w-full flex-col justify-center py-4 md:h-[calc(100%-72px)] md:max-w-[60%]">
            <h1 className="font-clash-display mb-2 font-medium text-white">
              {"The "}
              {company?.name}
              {" Talent Collective"}
            </h1>
            <p className="mb-8 font-light text-[#BDBDC0]">
              {
                "Developer DAO is a decentralized autonomous organization nurturing collaboration, learning, and value creation in the web3 developer community. It's a hub for beginners and professionals to build and mentor."
              }
            </p>

            <div className="flex items-center justify-center md:justify-start">
              <Link href={`/signup`} className="mr-3">
                <BrandedButton color="#000000">
                  Join the Collective
                </BrandedButton>
              </Link>
              <span className="mr-3 text-white">or</span>
              <Link href={`/pricing?community=${company?._id}`}>
                <BrandedButton variant="secondary" color="#FFFFFF">
                  Post a Job
                </BrandedButton>
              </Link>
            </div>
          </div>
        </div>
        <div className="relative mx-auto -mt-8 mb-12 flex w-full max-w-xl items-center justify-between rounded-md bg-[#F7F8F7] p-2 lg:w-[70%]">
          <div className="flex w-full justify-start px-4">
            <div className="flex flex-col">
              <span className="text-edenGray-500 text-sm">
                Pre-vetted Candidates
              </span>
              <span>273</span>
            </div>
          </div>
          <div className="border-edenGray-300 mx-2 h-12 border-r"></div>
          <div className="flex w-full justify-start px-4">
            <div className="flex flex-col">
              <span className="text-edenGray-500 text-sm">Combined Skills</span>
              <span>982</span>
            </div>
          </div>
          <div className="border-edenGray-300 mx-2 h-12 border-r"></div>
          <div className="flex w-full justify-start px-4">
            <div className="flex flex-col">
              <span className="text-edenGray-500 text-sm">Total live jobs</span>
              <span>{_filteredPositions.length}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-screen-xl grid-cols-12 gap-4 px-2 pb-16 md:px-8">
        {/* -------- Filter & Ask Eden sections -------- */}
        <section className="col-span-12 md:col-span-3">
          {/* -------- Filter sections -------- */}
          <FilterOpportunities
            onChange={(data: any) => {
              setOfficePolicyFilter(data.officePolicy);
            }}
          />
        </section>
        {/* -------- Jobs Section -------- */}
        <section className="col-span-12 pt-2 md:col-span-9 md:px-6">
          <h3 className="font-clash-display mb-2 font-medium">Opportunities</h3>
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-4 md:gap-y-8 lg:grid-cols-3">
            {_filteredPositions.map(
              (position: Maybe<Position>, index: number) => {
                return (
                  <PositionCard
                    position={position!}
                    setLoadingSpinner={setLoadingSpinner}
                    key={index}
                  />
                );
              }
            )}
          </div>
        </section>
      </div>
      <EdenAiProcessingModal
        title="Getting things ready for you"
        open={loadingSpinner}
      />
    </>
  );
};

JobsPage.getLayout = (page) => (
  <BrandedAppUserLayout>{page}</BrandedAppUserLayout>
);

export const getStaticProps = async (context: {
  params: { subdomain: string };
}) => {
  try {
    const _slug = context.params?.subdomain;

    const companyRes = await axios.post(
      process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
      {
        headers: {
          "Access-Control-Allow-Origin": `*`,
        },
        variables: { fields: { slug: _slug } },
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
          candidatesNum
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
            fields: { slug: _slug },
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
        item.company = {
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
        positions: filteredPositions.reverse(),
      },
      // 10 min to rebuild all paths
      // (this means new data will show up after 10 min of being added)
      revalidate: 600,
    };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};

export const getStaticPaths = async () => {
  try {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
      {
        headers: {
          "Access-Control-Allow-Origin": `*`,
        },
        variables: { fields: [] },
        query: `
        query FindCompanies($fields: findCompaniesInput) {
          findCompanies(fields: $fields) {
            _id
            slug
          }
        }
        `,
      }
    );

    const paths = res.data.data.findCompanies
      .filter((_comp: any) => !!_comp.slug)
      .map((_comp: any) => ({
        params: { subdomain: _comp.slug },
      }));

    return {
      paths,
      fallback: true,
    };
  } catch (error) {
    console.log(error);
    return {
      paths: [],
      fallback: true,
    };
  }
};

export default JobsPage;

type PositionCardProps = {
  position: Position;
  setLoadingSpinner: Dispatch<SetStateAction<boolean>>;
};

const PositionCard = ({ position, setLoadingSpinner }: PositionCardProps) => {
  const handlePickJobs = async () => {
    setLoadingSpinner(true);
  };

  return (
    <Link
      className="transition-ease-in-out group relative col-span-1 w-full cursor-pointer rounded-md bg-[#F7F8F7] p-1 shadow-sm transition-all hover:scale-[101%] hover:shadow-md"
      onClick={() => {
        handlePickJobs();
      }}
      href={`/jobs/${position._id}`}
    >
      <div className="bg-edenGreen-200 relative flex h-56 w-full items-center rounded-md p-2">
        {(!!position?.generalDetails?.yearlySalary?.min ||
          position?.generalDetails?.yearlySalary?.min === 0) && (
          <p className="text-edenGray-500 absolute left-2 top-4 w-full text-sm">
            ${position?.generalDetails?.yearlySalary.min / 1000 + "k"}
            {position?.generalDetails?.yearlySalary.max
              ? " - $" + position?.generalDetails.yearlySalary.max / 1000 + "k"
              : ""}
          </p>
        )}
        <h2 className="font-clash-display text-3xl font-normal">
          {position?.name}
        </h2>
      </div>
      <div className="flex w-full flex-row p-2">
        <Image
          style={{ objectFit: "contain" }}
          width="44"
          height="44"
          className="mr-2 rounded-md"
          src={`${
            position?.company?.imageUrl
              ? position?.company?.imageUrl
              : "/default-company-image.svg"
          }`}
          alt={`${position?.company?.name} company image`}
        />
        <div className="flex flex-col justify-center">
          <h4 className="text-edenGray-500 font-normal">
            {position?.company?.name}
          </h4>
          <p className="text-edenGray-900 text-sm capitalize">
            {position?.generalDetails?.officePolicy &&
              position?.generalDetails?.officePolicy}
            {position?.generalDetails?.contractType
              ? " • " + position?.generalDetails?.contractType
              : " • Fulltime"}
          </p>
        </div>
      </div>
      <div className="absolute right-2 top-2 flex h-full flex-col justify-between">
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
    </Link>
  );
};

type FilterOpportunitiesProps = {
  // eslint-disable-next-line no-unused-vars
  onChange: (data: any) => void;
};

const FilterOpportunities = ({ onChange }: FilterOpportunitiesProps) => {
  const [unwrapped, setUnwrapped] = useState(false);

  const { watch, setValue, getValues } = useForm<any>({
    defaultValues: {
      officePolicy: ["on-site", "remote", "hybrid"],
    },
  });

  useMemo(() => {
    onChange({ officePolicy: getValues("officePolicy") });
  }, [watch("officePolicy")]);

  return (
    <section className="rounded-md bg-[#F7F8F7] p-4">
      <div className="mb-4 flex items-center">
        <h3 className="font-clash-display font-medium">Filter opportunities</h3>
        <div
          className="hover:bg-edenGray-100 ml-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-full"
          onClick={() => {
            setUnwrapped(!unwrapped);
          }}
        >
          {unwrapped ? <BiChevronDown /> : <BiChevronUp />}
        </div>
      </div>

      <form>
        <div className="relative mb-2 mr-2 inline-block">
          <input
            defaultChecked={true}
            id="on-site"
            type="checkbox"
            className="peer hidden"
            onChange={(e) => {
              e.target.checked
                ? setValue("officePolicy", [
                    ...getValues("officePolicy"),
                    "on-site",
                  ])
                : setValue(
                    "officePolicy",
                    getValues("officePolicy").filter(
                      (item: string) => item !== "on-site"
                    )
                  );
            }}
          />
          <label
            htmlFor="on-site"
            className="border-soilGray text-edenGray-500 cursor-pointer select-none rounded-sm border px-2 py-0.5 peer-checked:border-2 peer-checked:border-black peer-checked:text-black"
          >
            On-site
          </label>
        </div>
        <div className="relative mb-2 mr-2 inline-block">
          <input
            defaultChecked={true}
            id="remote"
            type="checkbox"
            className="peer hidden"
            onChange={(e) => {
              e.target.checked
                ? setValue("officePolicy", [
                    ...getValues("officePolicy"),
                    "remote",
                  ])
                : setValue(
                    "officePolicy",
                    getValues("officePolicy").filter(
                      (item: string) => item !== "remote"
                    )
                  );
            }}
          />
          <label
            htmlFor="remote"
            className="border-soilGray text-edenGray-500 cursor-pointer select-none rounded-sm border px-2 py-0.5 peer-checked:border-2 peer-checked:border-black peer-checked:text-black"
          >
            Remote
          </label>
        </div>
        <div className="relative mb-2 mr-2 inline-block">
          <input
            defaultChecked={true}
            id="hybrid"
            type="checkbox"
            className="peer hidden"
            onChange={(e) => {
              e.target.checked
                ? setValue("officePolicy", [
                    ...getValues("officePolicy"),
                    "hybrid",
                  ])
                : setValue(
                    "officePolicy",
                    getValues("officePolicy").filter(
                      (item: string) => item !== "hybrid"
                    )
                  );
            }}
          />
          <label
            htmlFor="hybrid"
            className="border-soilGray text-edenGray-500 cursor-pointer select-none rounded-sm border px-2 py-0.5 peer-checked:border-2 peer-checked:border-black peer-checked:text-black"
          >
            Hybrid
          </label>
        </div>
      </form>
    </section>
  );
};

type BrandedButtonProps = {
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

const BrandedButton = ({
  children,
  color,
  variant = "primary",
}: BrandedButtonProps) => {
  return (
    <button
      style={{
        backgroundColor: color,
      }}
      className={classNames(
        "whitespace-no-wrap inline-block rounded-md border border-white px-4 py-2 text-white hover:!bg-white hover:text-black",
        variant === "secondary"
          ? "!text-black hover:!bg-black hover:!text-white"
          : "text-white"
      )}
    >
      {children}
    </button>
  );
};
