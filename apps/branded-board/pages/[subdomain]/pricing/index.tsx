import { classNames } from "@dynamic-labs/sdk-react-core";
import { BrandedAppUserLayout, Button } from "@eden/package-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiArch } from "react-icons/bi";
import { BsJournalCheck, BsSearchHeart } from "react-icons/bs";
import { HiOutlineShare, HiOutlineUsers } from "react-icons/hi2";
import { IoCheckmarkSharp } from "react-icons/io5";

import { IS_PRODUCTION } from "../../../constants";
import type { NextPageWithLayout } from "../../_app";

type PRODUCTS_TYPE = {
  name: string;
  id: string;
  description: string;
  monthlyPrice: number;
  priceID: string;
  featured: boolean;
  saves: number | null;
}[];

const PRODUCTS: PRODUCTS_TYPE = [
  {
    name: "1 post",
    id: "1post",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 249,
    priceID: IS_PRODUCTION
      ? "price_1OjMZUBxX85c6z0C0rX2LRmF"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: false,
    saves: null,
  },
  {
    name: "3 posts",
    id: "3posts",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 149,
    priceID: IS_PRODUCTION
      ? "price_1OjMcPBxX85c6z0CrdC48xXf"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: true,
    saves: 40,
  },
  {
    name: "5 posts",
    id: "5posts",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 99,
    priceID: IS_PRODUCTION
      ? "price_1OjMdYBxX85c6z0C6qRH6XFX"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: false,
    saves: 60,
  },
];

const DDBenefits = [
  {
    title: "Bi-weekly Spotlight",
    subtitle: "We'll spotlight your job on all our channels",
    features: [
      {
        icon: null,
        text: (
          <span>
            <b>20k+</b> discord members
          </span>
        ),
      },
      {
        icon: null,
        text: (
          <span>
            <b>80k+</b> followers on X
          </span>
        ),
      },
      {
        icon: null,
        text: (
          <span>
            <b>3k+</b> engaged newsletter readers
          </span>
        ),
      },
    ],
    footer: {
      title: "Targeted Exposure",
      subtitle: "Get in front of the right people",
      icon: <BsSearchHeart size={20} color="#F9E1ED" />,
    },
  },
  {
    title: "Intelligent Intro's",
    subtitle: "Get relevant intros to our talent collective",
    features: [
      {
        icon: null,
        text: (
          <span>
            Members have previously worked at companies such as Members have
            previously worked at companies such as <b>Polygon</b>, <b>Meta</b>&{" "}
            <b>Google</b>
          </span>
        ),
      },
      {
        icon: null,
        text: (
          <span>
            Collective includes everyone from <b>solidity</b>,{" "}
            <b>full-stack devs</b> & <b>data scientists</b> to{" "}
            <b>product designers</b> & <b>managers</b>
          </span>
        ),
      },
    ],
    footer: {
      title: "Relevant Talent",
      subtitle: "Instantly talk to the right people",
      icon: <HiOutlineUsers size={20} color="#F9E1ED" />,
    },
  },
  {
    title: "AI-powered vetting",
    subtitle: "Get relevant intros to our talent collective",
    features: [
      {
        icon: null,
        text: (
          <span>
            Instantly see <b>relevant info per score topic</b>
          </span>
        ),
      },
      {
        icon: null,
        text: (
          <span>
            Dig into the <b>AI-interview transcripts</b> of applications for
            similar roles
          </span>
        ),
      },
      {
        icon: null,
        text: (
          <span>
            Leverage our <b>dynamic scoring</b> algo with <b>bias aware</b>{" "}
            tooling
          </span>
        ),
      },
    ],
    footer: {
      title: "Dig deep, fast",
      subtitle: "Get in front of the right people",
      icon: <BsJournalCheck size={20} color="#F9E1ED" />,
    },
  },
  {
    title: "Farcaster Frames",
    subtitle: "Use our intelligent frame & brand to grow reach",
    features: [
      {
        icon: null,
        text: (
          <span>
            Leverage our <b>instant interview frame</b>
          </span>
        ),
      },
      {
        icon: null,
        text: (
          <span>
            Tap into the network of the network with our{" "}
            <b>talent vouching frame</b>
          </span>
        ),
      },
      {
        icon: null,
        text: (
          <span>
            Engage passive talent with <b>nominate frame</b>
          </span>
        ),
      },
    ],
    footer: {
      title: "Engage Intelligently & broadly",
      subtitle: "Grow your reach through engagement",
      icon: <BiArch size={20} color="#F9E1ED" />,
    },
  },
  {
    title: "Community referrals",
    subtitle: "Tap into the network of our network",
    features: [
      {
        icon: null,
        text: (
          <span>
            Leverage our <b>multi-player referral mechanism</b> to activate the
            network of our network to help you find the right talent.
          </span>
        ),
      },
    ],
    footer: {
      title: "Grow impactful reach",
      subtitle: "Tap into credible & verifiable connections",
      icon: <HiOutlineShare size={20} color="#F9E1ED" />,
    },
  },
];

const SubscribePage: NextPageWithLayout = () => {
  const router = useRouter();
  const communityID = router.query.community;
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const getLink = (): string => {
    let url = `/hm-signup?product=${
      PRODUCTS.find((_product) => _product.id === selectedPrice)?.priceID
    }`;

    if (communityID) {
      const communityIDs = router.query.community
        ? [router?.query.community].flat(1)
        : [];

      url = url + `&community=${communityIDs.join(",")}`;
    }

    return url;
  };

  return (
    <>
      <div className="mx-auto w-full max-w-screen-md pb-16">
        <div className="font-clash-display mb-12 flex w-full flex-nowrap items-center justify-center text-3xl font-medium">
          <img
            src="/d_d-logo-and-text.png"
            width={320}
            className="max-w-[70%]"
          />
          <span className="mb-1">talent</span>
        </div>
        <h1 className="font-clash-display mb-4 text-center font-medium">
          {"Find pioneering web3 talent, "}
          <span className="whitespace-nowrap">
            fast.
            <div className="relative inline-block w-[16px]">
              {"‎"}
              <svg
                className="absolute -top-3 left-0 w-[16px]"
                width="27"
                height="34"
                viewBox="0 0 27 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1393 20.3421C17.0711 20.8279 14.7338 21.2747 13.2988 22.7513C11.6124 24.4804 11.2129 27.6473 10.7691 33.981C10.3105 27.4142 9.89632 24.2667 8.04714 22.5764C6.61218 21.2553 4.2896 20.8279 0.398926 20.3616C4.45233 19.8758 6.80449 19.429 8.22466 17.9718C9.92591 16.2233 10.3253 13.0758 10.7691 6.72266C11.1834 12.5707 11.5532 15.6987 12.929 17.5056C14.3048 19.3124 16.7013 19.8176 21.1393 20.3421Z"
                  fill="#000000"
                />
                <path
                  d="M26.1105 7.42507C24.1607 7.65787 23.0404 7.87204 22.3526 8.57974C21.5444 9.4085 21.3529 10.9263 21.1402 13.962C20.9204 10.8146 20.7219 9.30607 19.8356 8.49594C19.1478 7.86273 18.0347 7.65787 16.1699 7.43438C18.1127 7.20159 19.24 6.98742 19.9207 6.28903C20.7361 5.45096 20.9275 3.94244 21.1402 0.897461C21.3387 3.70033 21.516 5.19954 22.1754 6.06554C22.8348 6.93154 23.9834 7.17365 26.1105 7.42507Z"
                  fill="#000000"
                />
              </svg>
            </div>
          </span>
        </h1>
        <h4 className="text-edenGray-700 mb-8 text-center font-normal">
          Gain exposure to a network of 100.000+ professionals interested in
          building in web3 - ranging from senior web3 developers to battle
          tested product designers.
        </h4>

        <section className="mx-auto mb-12 w-full max-w-screen-sm px-4">
          <div className="mb-8">
            {PRODUCTS.map((_product, index) => {
              const _selected = selectedPrice === _product.id;

              return (
                <div
                  className={classNames(
                    "bg-edenPink-100 custom-radio border-2 first:rounded-t-2xl last:rounded-b-2xl",
                    _selected
                      ? "border-edenGreen-500 border-b-2"
                      : "border-edenPink-500 border-b-0 last:border-b-2"
                  )}
                  key={index}
                >
                  <input
                    type="radio"
                    id={_product.id}
                    name="product"
                    value={_product.name}
                    className="peer hidden"
                    onChange={(e) => {
                      if (e.currentTarget.checked) {
                        setSelectedPrice(_product.id);
                      }
                    }}
                  />

                  <label
                    htmlFor={_product.id}
                    className="flex w-full cursor-pointer items-center justify-between px-5 py-4"
                  >
                    {_selected ? (
                      <div className="bg-edenGreen-600 mr-4 flex h-8 w-8 items-center justify-center rounded-full">
                        <IoCheckmarkSharp
                          color="#FFFFFF"
                          size={20}
                          className="block"
                        />
                      </div>
                    ) : (
                      <div className="bg-edenGray-500 mr-4 block h-8 w-8 rounded-full"></div>
                    )}
                    <h3 className="font-Moret text-edenGreen-600 mr-auto">
                      {_product.name}
                    </h3>

                    {_product.saves && (
                      <div className="bg-edenGreen-600 rounded-md px-4 py-1 text-white">
                        Saves {_product.saves}%
                      </div>
                    )}

                    <div className="ml-auto flex flex-col items-center">
                      <span className="font-Moret text-edenGreen-600 text-lg font-bold">
                        ${_product.monthlyPrice}
                      </span>
                      <span className="text-edenGray-700 text-sm">
                        per job-slot
                      </span>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <Link href={getLink()} aria-disabled={!selectedPrice}>
              <Button className="mx-auto px-8" disabled={!selectedPrice}>
                Post Now
              </Button>
            </Link>
          </div>
        </section>

        <h2 className="font-clash-display mb-6 text-center text-2xl font-medium">
          {"What's included in your Developer DAO magic job-post?"}
        </h2>
        <section className="mb-8 grid w-full grid-cols-12 gap-y-6 px-8 md:gap-x-10">
          {DDBenefits.map((_benefit, index) => (
            <div
              key={index}
              className="relative col-span-12 rounded-lg bg-[#F7F8F7] p-1 md:col-span-6"
            >
              <div className="bg-edenGreen-200 relative h-4/5 whitespace-normal rounded-lg p-3 pl-4 align-top">
                <h3 className="font-clash-display mb-4 text-2xl font-medium">
                  {_benefit.title}
                </h3>
                <p className="text-edenGray-700 mb-4 text-sm">
                  {_benefit.subtitle}
                </p>
                <svg
                  className="absolute right-3 top-2 w-[16px]"
                  width="27"
                  height="34"
                  viewBox="0 0 27 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.1393 20.3421C17.0711 20.8279 14.7338 21.2747 13.2988 22.7513C11.6124 24.4804 11.2129 27.6473 10.7691 33.981C10.3105 27.4142 9.89632 24.2667 8.04714 22.5764C6.61218 21.2553 4.2896 20.8279 0.398926 20.3616C4.45233 19.8758 6.80449 19.429 8.22466 17.9718C9.92591 16.2233 10.3253 13.0758 10.7691 6.72266C11.1834 12.5707 11.5532 15.6987 12.929 17.5056C14.3048 19.3124 16.7013 19.8176 21.1393 20.3421Z"
                    fill="#000000"
                  />
                  <path
                    d="M26.1105 7.42507C24.1607 7.65787 23.0404 7.87204 22.3526 8.57974C21.5444 9.4085 21.3529 10.9263 21.1402 13.962C20.9204 10.8146 20.7219 9.30607 19.8356 8.49594C19.1478 7.86273 18.0347 7.65787 16.1699 7.43438C18.1127 7.20159 19.24 6.98742 19.9207 6.28903C20.7361 5.45096 20.9275 3.94244 21.1402 0.897461C21.3387 3.70033 21.516 5.19954 22.1754 6.06554C22.8348 6.93154 23.9834 7.17365 26.1105 7.42507Z"
                    fill="#000000"
                  />
                </svg>
                <ul className="text-edenGray-700 list-disc pl-2 text-sm">
                  {_benefit.features.map((_feat, index) => (
                    <li className="mb-2" key={"li-" + index}>
                      {_feat.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center p-2 pt-3">
                <div className="bg-edenGreen-600 mr-2 flex h-10 w-10 items-center justify-center rounded-md">
                  {_benefit.footer.icon}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-edenGray-700 text-sm font-medium">
                    {_benefit.footer.title}
                  </h4>
                  <p className="text-edenGray-700 text-sm">
                    {_benefit.footer.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="flex items-center justify-center">
          <p>Got questions? Schedule a call!</p>
          <Link
            href={"https://calendly.com/tomhusson/eden-user-feedback"}
            target="_blank"
          >
            <Button className="ml-4" size="sm">
              Schedule a call
            </Button>
          </Link>
        </section>
      </div>
    </>
  );
};

SubscribePage.getLayout = (page) => (
  <BrandedAppUserLayout>{page}</BrandedAppUserLayout>
);

export default SubscribePage;
