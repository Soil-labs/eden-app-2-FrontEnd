import { AppUserLayout, Button } from "@eden/package-ui";
import { useRouter } from "next/router";
import { BiCheck, BiInfinite } from "react-icons/bi";
import { MdClose } from "react-icons/md";

import type { NextPageWithLayout } from "../_app";

type PRODUCTS_TYPE = {
  name: string;
  description: string;
  monthlyPrice: number;
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
    name: "Startup",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 500,
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
  {
    name: "Scaleup",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 500,
    features: {
      access: {
        magicJobPosts: { value: 5, text: "Magic job posts" },
        outreachCredits: { value: 25, text: "Outreach credits" },
        talentMatches: {
          value: 100,
          text: "AI-assisted high-precision talent matches",
        },
      },
      curation: {
        continuousLearning: {
          value: true,
          text: "Continuous learning from your talent preferences",
        },
        weeklyTalentPlaylists: {
          value: true,
          text: "Weekly talent discovery playlists curated for you by Eden & D_D talent stewards",
        },
        reputationGating: {
          value: true,
          text: "Reputation gating (coming soon) ",
        },
      },
      exposure: {
        jobBoard: {
          value: true,
          text: "A top-spot on our job board that gets 20.000 hits/month",
        },
        socials: {
          value: true,
          text: "Bi-weekly shoutouts on our socials w aggregated audience of 100.000 web3 enthusiasts & professionals",
        },
      },
    },
  },
  {
    name: "Head of platform @ VC",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 500,
    features: {
      access: {
        magicJobPosts: { value: 9999, text: "Magic job posts" },
        outreachCredits: { value: 9999, text: "Outreach credits" },
        talentMatches: {
          value: 9999,
          text: "AI-assisted high-precision talent matches",
        },
      },
      curation: {
        continuousLearning: {
          value: true,
          text: "Continuous learning from your talent preferences",
        },
        weeklyTalentPlaylists: {
          value: true,
          text: "Weekly talent discovery playlists curated for you by Eden & D_D talent stewards",
        },
        reputationGating: {
          value: true,
          text: "Reputation gating (coming soon) ",
        },
      },
      exposure: {
        jobBoard: {
          value: true,
          text: "A top-spot on our job board that gets 20.000 hits/month",
        },
        socials: {
          value: true,
          text: "Bi-weekly shoutouts on our socials w aggregated audience of 100.000 web3 enthusiasts & professionals",
        },
      },
    },
  },
];

const SubscribePage: NextPageWithLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="max-w-6xl grid grid-cols-3 gap-8">
        {PRODUCTS.map((product, index) => (
          <div
            key={index}
            className="col-span-1 bg-edenPink-100 rounded-md p-4 hover:scale-[1.01] transition-all"
          >
            <h1 className="text-edenGreen-600">{product.name}</h1>
            <p className="mb-8">{product.description}</p>
            <p className="text-xs mb-4">
              <span className="font-bold text-normal">
                ${product.monthlyPrice}
              </span>{" "}
              per month
            </p>
            <hr className="w-full text-edenGray-500 mb-4" />
            <h3>What you get?</h3>
            <section className="pl-4 mb-4">
              <h4 className="mb-2">Access</h4>
              <ul>
                {Object.keys(product.features.access).map(
                  (featName: string, index) => (
                    <li
                      key={index}
                      className="relative pl-6 pr-10 text-xs mb-2"
                    >
                      <BiCheck className="absolute left-0 top-1" />
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
            <section className="pl-4 mb-4">
              <h4 className="mb-2">Curation</h4>
              <ul>
                {Object.keys(product.features.curation).map(
                  (featName: string, index) => (
                    <li
                      key={index}
                      className="relative pl-6 pr-10 text-xs mb-2"
                    >
                      {product.features.curation[featName].value ? (
                        <BiCheck className="absolute left-0 top-1" />
                      ) : (
                        <MdClose className="absolute left-0 top-1" />
                      )}
                      {product.features.curation[featName].text}
                    </li>
                  )
                )}
              </ul>
            </section>
            <section className="pl-4 mb-4">
              <h4 className="mb-2">Exposure</h4>
              <ul>
                {Object.keys(product.features.exposure).map(
                  (featName: string, index) => (
                    <li
                      key={index}
                      className="relative pl-6 pr-10 text-xs mb-2"
                    >
                      {product.features.exposure[featName].value ? (
                        <BiCheck className="absolute left-0 top-1" />
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
              <Button className="block mx-auto" variant="secondary">
                Subscribe
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

SubscribePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default SubscribePage;
