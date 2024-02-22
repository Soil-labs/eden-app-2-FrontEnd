import { AppUserLayout, Button } from "@eden/package-ui";
import useAuthGate from "@eden/package-ui/src/hooks/useAuthGate/useAuthGate";
import { getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";

import { NextPageWithLayout } from "../../_app";

const HARDCODED_POOLS = [
  {
    title: "Frontend Developer",
    url: "/interview/64e311bf3c477e32522fd57b",
  },
  {
    title: "Backend Developer",
    url: "/interview/64dde2a36dee65306b6eb62d",
  },
  {
    title: "Blockchain Developer",
    url: "/interview/64dc91572d77394577b12925",
  },
  {
    title: "Full Stack Developer",
    url: "/interview/64e3686c083f8b472997d451",
  },
  {
    title: "DevRel",
    url: "/interview/64dcd423966c1c455f0966bc",
  },
  {
    title: "Designer",
    url: "/interview/64dcb0fd2d7739565ab13152",
  },
];

const SignupCommunity: NextPageWithLayout = () => {
  const router = useRouter();
  const [selectedCollective, setSelectedCollective] = useState<number>(-1);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  useAuthGate();

  const handleSelect = (index: number) => {
    setSelectedCollective(index);
  };

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-y-scroll bg-[url('/oasis-bg.png')] bg-cover bg-no-repeat pb-16">
        <div>
          <div className="mx-auto flex h-[236px] w-[604px] flex-col items-center justify-center rounded-lg bg-white">
            <div className="font-Moret text-edenGreen-600 text-2xl font-bold leading-[33.6px]">
              Choose your talent collective.
            </div>
            <p>
              You’ll be considered for all opportunities that align with your
              skills.{" "}
            </p>

            <div
              onClick={() => setShowOptions(!showOptions)}
              className="relative mb-[10px] mt-[18px]"
            >
              {/* <div */}
              {/*   className={`${ */}
              {/*     selectedCollective > -1 ? "text-black" : "text-balck  " */}
              {/*   } bg-edenPink-200 border-edenGray-500  flex h-[33px] w-[204px] items-center justify-between rounded-md border pl-[13px] pr-1 text-center text-xs outline-none hover:cursor-pointer`} */}
              {/* > */}
              <div className="bg-edenPink-200 border-edenGray-500 flex  h-[33px] w-[204px] items-center justify-between rounded-md border pl-[13px] pr-1 text-center text-xs text-black outline-none hover:cursor-pointer">
                {selectedCollective > -1
                  ? HARDCODED_POOLS[selectedCollective].title
                  : "Select talent collective to join"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.3}
                  stroke="#393939"
                  className="-mb-px h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
              {showOptions && (
                <div className="border-edenGray-500 bg-edenPink-200 absolute left-0 top-full z-10 w-[204px] translate-y-1 rounded-md border">
                  {HARDCODED_POOLS.map((pool, index) => (
                    <div
                      className="hover:bg-edenPink-400 py-2 pl-4 text-xs hover:cursor-pointer"
                      onClick={() => handleSelect(index)}
                      key={index}
                    >
                      {pool.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-edenGray-700 mb-[10px] text-[10px] leading-[14px]">
              If you are a hiring manager login{" "}
              <Link
                href={"/pricing?community=64da1c72e48f083ff46500fd"}
                className="hover:text-edenGray-500 underline"
              >
                here
              </Link>
            </p>

            <Button
              disabled={selectedCollective === -1}
              className="flex h-[34px] items-center"
              onClick={() => {
                if (selectedCollective > -1)
                  router.push(HARDCODED_POOLS[selectedCollective].url);
              }}
            >
              Join the oasis
            </Button>
          </div>
          <div className="relative mt-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-edenPink-500 font-Moret -ml-4 flex rounded-md text-2xl font-bold focus:outline-none"
            >
              <div className="flex items-center justify-center">
                {!isOpen ? (
                  <BiChevronRight
                    className="text-edenPink-500"
                    size={"2.4rem"}
                  />
                ) : (
                  <BiChevronDown
                    className="text-edenPink-500"
                    size={"2.4rem"}
                  />
                )}
                <h1>What is a talent oasis?</h1>{" "}
              </div>
            </button>

            {isOpen && (
              <div className="absolute z-10 rounded-md">
                <div className="text-edenPink-400 px-4">
                  <p className="mb-4">
                    The Eden talent collectives are an AI-managed & curated
                    talent pool that helps you apply, shine for & land your
                    dream opportunities.
                  </p>
                  <p>
                    By joining the oasis, our AI will actively pitch your
                    profile to hiring managers.
                  </p>
                  <ul className="list-disc pl-5">
                    <li>
                      Be discovered by hiring managers before anyone else.
                    </li>
                    <li>
                      Get constant feedback on your current profile, application
                      & interview style.
                    </li>
                    <li>
                      Ask for career advice: given your profile & the current
                      market, what could be your next move?
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

SignupCommunity.getLayout = (page: any) => (
  <AppUserLayout>{page}</AppUserLayout>
);

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  resolvedUrl: string;
}) {
  const url = ctx.resolvedUrl;

  const session = getCookieFromContext(ctx);

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${encodeURIComponent(url)}`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}

export default SignupCommunity;
