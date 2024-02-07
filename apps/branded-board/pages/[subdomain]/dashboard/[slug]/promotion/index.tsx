// import { UserContext } from "@eden/package-context";
import { BrandedSaasUserLayout, Button } from "@eden/package-ui";
import { classNames, getCookieFromContext } from "@eden/package-ui/utils";
import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
// import { useContext } from "react";
import { BiCheck, BiInfinite } from "react-icons/bi";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { MdClose } from "react-icons/md";

import { IS_PRODUCTION } from "../../../../../constants";
import type { NextPageWithLayout } from "../../../../_app";

type PRODUCTS_TYPE = {
  name: string;
  description: string;
  icon: any;
  monthlyPrice: number;
  priceID: string;
  featured: boolean;
  features: {
    [key: string]: {
      [key: string]: {
        value: string | number | boolean;
        text: string;
      };
    };
  };
}[];

const PRODUCTS: PRODUCTS_TYPE = [
  {
    name: "Startup Promo",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 0,
    priceID: IS_PRODUCTION
      ? "price_1O2rCtBxX85c6z0CHtnLOoD1"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: false,
    icon: <HiOutlineBuildingStorefront />,
    features: {
      access: {
        magicJobPosts: { value: 2, text: "Magic job posts" },
        outreachCredits: { value: 5, text: "Outreach credits" },
        talentMatches: {
          value: 10,
          text: "AI-assisted high-precision talent matches",
        },
      },
      curation: {
        continuousLearning: {
          value: false,
          text: "Continuous learning from your talent preferences",
        },
        weeklyTalentPlaylists: {
          value: false,
          text: "Weekly talent discovery playlists curated for you by Eden & D_D talent stewards",
        },
        reputationGating: {
          value: false,
          text: "Reputation gating (coming soon) ",
        },
      },
      exposure: {
        jobBoard: {
          value: false,
          text: "A top-spot on our job board that gets 20.000 hits/month",
        },
        socials: {
          value: false,
          text: "Bi-weekly shoutouts on our socials w aggregated audience of 100.000 web3 enthusiasts & professionals",
        },
      },
    },
  },
];

const SubscribePage: NextPageWithLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  const slug = router.query.slug;
  // const { currentUser } = useContext(UserContext);

  const handleSubscribeClick = async (priceID: string) => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    const redirect = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/stripe/create-checkout-session` as string,
      {
        // eslint-disable-next-line camelcase
        price_id: priceID,
        // eslint-disable-next-line camelcase
        success_url: `${origin}/dashboard/${slug}`,
        // eslint-disable-next-line camelcase
        cancel_url: `${origin}/dashboard/${slug}/subscription`,
        companySlug: slug,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": `*`,
        },
      }
    );

    if (origin && redirect.data) window.location.assign(redirect.data);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="grid max-w-6xl grid-cols-3 gap-4">
        <div className="col-span-1"></div>
        {PRODUCTS.map((product, index) => (
          <div
            key={index}
            className={classNames(
              "relative col-span-1 rounded-md p-4 transition-all hover:scale-[1.01]",
              product.featured ? "bg-edenPink-300" : "bg-edenPink-100"
            )}
          >
            <div
              className={classNames(
                "text-edenGreen-600 mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-md text-xl",
                product.featured ? "bg-edenPink-100" : "bg-edenPink-300"
              )}
            >
              {product.icon}
            </div>
            <h1 className="text-edenGreen-600 text-center">{product.name}</h1>
            <p className="mb-4 text-center text-sm">{product.description}</p>
            <div
              className={classNames(
                "-mx-4 mb-4 w-[calc(100%+2rem)] py-1",
                product.featured ? "bg-edenGreen-500" : "bg-edenPink-300"
              )}
            >
              <p className="text-center text-xs">
                <span
                  className={classNames(
                    "font-Moret inline text-2xl font-semibold",
                    product.featured ? "text-white" : "text-edenGreen-600"
                  )}
                >
                  ${product.monthlyPrice}
                </span>{" "}
                <span
                  className={classNames(
                    product.featured ? "text-white" : "text-edenGray-700"
                  )}
                >
                  /month
                </span>
              </p>
            </div>
            <section className="mb-4">
              <h3 className="text-edenGreen-600 mb-2">Access</h3>
              <ul>
                {Object.keys(product.features.access).map(
                  (featName: string, index) => (
                    <li
                      key={index}
                      className="relative mb-2 pl-6 pr-10 text-xs"
                    >
                      <div className="bg-edenGreen-500 text-edenPink-300 absolute left-0 top-px flex h-4 w-4 items-center justify-center rounded-full pr-px">
                        <BiCheck className="" size={"1.4rem"} />
                      </div>
                      {product.features.access[featName].text}
                      <span className="absolute right-0 top-0">
                        {product.features.access[featName].value === 9999 ? (
                          <BiInfinite />
                        ) : (
                          product.features.access[featName].value
                        )}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </section>
            <section className="mb-4">
              <h3 className="text-edenGreen-600 mb-2">Curation</h3>
              <ul>
                {Object.keys(product.features.curation).map(
                  (featName: string, index) => (
                    <li
                      key={index}
                      className="relative mb-2 pl-6 pr-10 text-xs"
                    >
                      {product.features.curation[featName].value ? (
                        <div className="bg-edenGreen-500 text-edenPink-300 absolute left-0 top-px flex h-4 w-4 items-center justify-center rounded-full pr-px">
                          <BiCheck className="" size={"1.4rem"} />
                        </div>
                      ) : (
                        <MdClose className="absolute left-0 top-1" />
                      )}
                      {product.features.curation[featName].text}
                    </li>
                  )
                )}
              </ul>
            </section>
            <section className="mb-4">
              <h3 className="text-edenGreen-600 mb-2">Exposure</h3>
              <ul>
                {Object.keys(product.features.exposure).map(
                  (featName: string, index) => (
                    <li
                      key={index}
                      className="relative mb-2 pl-6 pr-10 text-xs"
                    >
                      {product.features.exposure[featName].value ? (
                        <div className="bg-edenGreen-500 text-edenPink-300 absolute left-0 top-px flex h-4 w-4 items-center justify-center rounded-full pr-px">
                          <BiCheck className="" size={"1.4rem"} />
                        </div>
                      ) : (
                        <MdClose className="absolute left-0 top-1" />
                      )}
                      {product.features.exposure[featName].text}
                    </li>
                  )
                )}
              </ul>
            </section>
            <div className="w-full pt-2">
              <Button
                className="mx-auto block"
                variant="secondary"
                onClick={() => handleSubscribeClick(product.priceID)}
              >
                Subscribe
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SubscribePage.getLayout = (page) => (
  <BrandedSaasUserLayout>{page}</BrandedSaasUserLayout>
);

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
}) {
  const session = getCookieFromContext(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel === 5 && session._id !== "113589215262737174259") {
    return {
      props: { key: url },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session._id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (res.status === 401) {
    return {
      redirect: {
        destination: `/request-access?company=${ctx.query.slug}`,
        permanent: false,
      },
    };
  }

  if (res.status === 404) {
    return {
      redirect: {
        destination: `/create-company`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}

export default SubscribePage;
