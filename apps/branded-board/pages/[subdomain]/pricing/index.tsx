import { classNames } from "@dynamic-labs/sdk-react-core";
import { BrandedAppUserLayout, Button } from "@eden/package-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
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
}[];

const PRODUCTS: PRODUCTS_TYPE = [
  {
    name: "1 post",
    id: "1post",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 249,
    priceID: IS_PRODUCTION
      ? "price_1NxUDfBxX85c6z0CTCpGb31x"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: false,
  },
  {
    name: "3 posts",
    id: "3posts",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 149,
    priceID: IS_PRODUCTION
      ? "price_1NxUBRBxX85c6z0CgmukMjft"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: true,
  },
  {
    name: "5 posts",
    id: "5posts",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 99,
    priceID: IS_PRODUCTION
      ? "price_1NxUAHBxX85c6z0CwonUgMF5"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: false,
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
        <h1 className="mb-4 text-center">Find pioneering web3 talent, fast.</h1>
        <h4 className="text-edenGray-700 mb-8 text-center font-normal">
          Gain exposure to a network of 100.000+ professionals interested in
          building in web3 - ranging from senior web3 developers to battle
          tested product designers.
        </h4>

        <section className="mx-auto mb-8 w-full max-w-screen-sm">
          <div className="mb-8">
            {PRODUCTS.map((_product, index) => {
              const _selected = selectedPrice === _product.id;

              return (
                <div
                  className={classNames(
                    _selected
                      ? "border-edenGreen-500 border-2"
                      : "border-edenPink-400",
                    "bg-edenPink-100 custom-radio border first:rounded-t-2xl last:rounded-b-2xl"
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
                    className="flex w-full cursor-pointer items-center px-5 py-4"
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
                    <h3 className="font-Moret text-edenGreen-600">
                      {_product.name}
                    </h3>
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

        <h2 className="mb-4 text-center">
          {"What's included in your Developer DAO magic job-post?"}
        </h2>
        <section className="scrollbar-hide mb-8 w-full overflow-x-scroll px-2">
          <div className="w-fit overflow-x-scroll whitespace-nowrap pb-1">
            {DDBenefits.map((_benefit, index) => (
              <div
                key={index}
                className="bg-edenGreen-200 relative mr-4 inline-block w-80 whitespace-normal rounded-lg p-3 pl-4 align-top shadow-md"
              >
                <h3>{_benefit.title}</h3>
                <p className="text-edenGray-700 mb-4">{_benefit.subtitle}</p>
                <ul className="text-edenGray-700 list-disc pl-2 text-sm">
                  {_benefit.features.map((_feat, index) => (
                    <li className="mb-2" key={"li-" + index}>
                      {_feat.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
