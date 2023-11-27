// import { UserContext } from "@eden/package-context";
import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { EmployeeTypeInput } from "@eden/package-graphql/generated";
import {
  Button,
  EdenAiProcessingModal,
  Modal,
  SaasUserLayout,
} from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiCheck, BiInfinite } from "react-icons/bi";
import { BsCreditCard } from "react-icons/bs";
import {
  HiOutlineBuildingOffice,
  HiOutlineBuildingOffice2,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import { IS_PRODUCTION } from "../../constants";
import type { NextPageWithLayout } from "../_app";

const UPDATE_COMPANY = gql`
  mutation ($fields: updateCompanyInput!) {
    updateCompany(fields: $fields) {
      _id
      name
      type
      slug
      description
    }
  }
`;
const ADD_EMPLOYEES_COMPANY = gql`
  mutation ($fields: addEmployeesCompanyInput!) {
    addEmployeesCompany(fields: $fields) {
      _id
      name
      slug
      employees {
        typeT
        user {
          _id
          discordName
        }
      }
    }
  }
`;

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
    name: "Startup",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 249,
    priceID: IS_PRODUCTION
      ? "price_1NxUDfBxX85c6z0CTCpGb31x"
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
  {
    name: "Scaleup",
    description:
      "For those looking to build the future with likeminded people.",
    monthlyPrice: 499,
    priceID: IS_PRODUCTION
      ? "price_1NxUBRBxX85c6z0CgmukMjft"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: true,
    icon: <HiOutlineBuildingOffice />,
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
    monthlyPrice: 999,
    priceID: IS_PRODUCTION
      ? "price_1NxUAHBxX85c6z0CwonUgMF5"
      : "price_1NnKzqBxX85c6z0CuUKA0uku",
    featured: false,
    icon: <HiOutlineBuildingOffice2 />,
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
  const router = useRouter();

  const { currentUser } = useContext(UserContext);
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  useEffect(() => {
    const reRoute = async () => {
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
      }
    };

    reRoute();
  }, [currentUser, router]);

  const [openCreateCompanyId, setOpenCreateCompanyId] = useState<String | null>(
    null
  );

  // eslint-disable-next-line no-unused-vars
  const handleSubscribeClick = async (slug: String) => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    const redirect = await axios.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/stripe/create-checkout-session` as string,
      {
        // eslint-disable-next-line camelcase
        price_id: openCreateCompanyId,
        // eslint-disable-next-line camelcase
        success_url: `${origin}/${slug}/dashboard`,
        // eslint-disable-next-line camelcase
        cancel_url: `${origin}/${slug}/dashboard/subscription`,
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
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="grid max-w-6xl grid-cols-3 gap-4">
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
                  onClick={() => setOpenCreateCompanyId(product.priceID)}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        open={!!openCreateCompanyId}
        onClose={() => setOpenCreateCompanyId(null)}
      >
        <CreateCompany onSubmit={handleSubscribeClick} />
      </Modal>
      <EdenAiProcessingModal open={loadingSpinner} title="Redirecting..." />
    </>
  );
};

SubscribePage.getLayout = (page) => <SaasUserLayout>{page}</SaasUserLayout>;

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
}) {
  const session = await getSession(ctx);
  //removes the next error in the url
  const url = (ctx as any).resolvedUrl;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${encodeURIComponent(url)}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel === 5) {
    return {
      props: { key: url },
    };
  }

  return {
    props: { key: url },
  };
}

export default SubscribePage;

interface ICreateCompany {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (slug: String) => {};
}

const CreateCompany = ({ onSubmit }: ICreateCompany) => {
  const router = useRouter();
  const communityIDs = router.query.community
    ? [router.query.community].flat(1)
    : [];

  // eslint-disable-next-line no-unused-vars
  const [formData, setFormData] = useState<FormData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { register, handleSubmit } = useForm();
  const { currentUser } = useContext(UserContext);

  const [addEmployeesCompany] = useMutation(ADD_EMPLOYEES_COMPANY, {
    onCompleted(data) {
      if (data.addEmployeesCompany) {
        onSubmit(data.addEmployeesCompany.slug);
      }
    },
    onError() {
      setSubmitting(false);
    },
  });

  const [updateCompany, { data: updateCompanyData }] = useMutation(
    UPDATE_COMPANY,
    {
      // eslint-disable-next-line no-unused-vars
      onCompleted({ data }) {
        console.log("completed add company");
      },
      onError(err) {
        toast.error(`An error occurred while submitting.\n${err.message}`);
        setSubmitting(false);
      },
    }
  );

  useEffect(() => {
    if (updateCompanyData)
      addEmployeesCompany({
        variables: {
          fields: {
            companyID: updateCompanyData.updateCompany._id,
            employees: [
              { typeT: "ADMIN", status: "ACTIVE", userID: currentUser!._id },
            ] as EmployeeTypeInput[],
          },
        },
      });
  }, [updateCompanyData]);

  const submitHandler = (data: any) => {
    setFormData(data);
    // console.log("data from handler:", data);
    setSubmitting(true);
    updateCompany({
      variables: {
        fields: {
          name: data.companyName,
          slug: toKebabCase(data.companyName),
          type: "COMPANY",
          description: data.companyDescription,
          communitiesSubscribedID: communityIDs,
        },
      },
    });
  };

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <form
          className="w-full max-w-2xl"
          onSubmit={handleSubmit(submitHandler)}
        >
          <section className="mb-4 inline-block w-full space-y-6 p-4 pr-12">
            <h2 className="text-edenGreen-600">
              {"Let's get your company profile set up!"}
            </h2>
            <p>
              {
                "This will give you access to your magic job-board's dashboard, where all your candidates will show up."
              }
            </p>
            <div className="space-y-1">
              <p className="text-xs">Company Name</p>
              <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
                <input
                  type="text"
                  id="Name"
                  className="h-[34px] w-full bg-transparent p-2"
                  required
                  {...register("companyName")}
                />
              </div>
            </div>

            {/* <div className="space-y-1">
              <p className=" text-xs">Company Abbreviation</p>
              <div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    id="Abbreviation"
                    className="border-EdenGray-100 flex h-[34px] w-full items-center rounded-md  border bg-transparent bg-white p-2 text-xs"
                    required
                    {...register("companyAbbreviation", {
                      pattern: /^[a-z0-9-]+$/,
                    })}
                  />
                  {errors.companyAbbreviation && (
                    <span className="ml-1 text-sm font-bold text-red-400">
                      Invalid Input: Please ensure your input contains only
                      lowercase letters (a-z), numbers (0-9), and the hyphen (-)
                      character.
                    </span>
                  )}
                </div>
              </div>
            </div> */}

            <div className="space-y-1">
              <p className="text-xs">Description of the Company</p>
              <div>
                <textarea
                  className="border-EdenGray-100 w-full border p-2 text-xs"
                  rows={6}
                  id="Description"
                  required
                  {...register("companyDescription")}
                />
              </div>
            </div>

            <Button type="submit" variant="secondary" className="mx-auto block">
              Checkout
              <BsCreditCard size={16} className="mb-px ml-2 inline" />
            </Button>
          </section>
        </form>
        <EdenAiProcessingModal
          title="Creating your company"
          open={submitting}
        />
      </div>
    </>
  );
};

function toKebabCase(inputString: string): string {
  // Replace all non-alphanumeric characters with hyphens
  const kebabCaseString = inputString.replace(/[^a-zA-Z0-9]/g, "-");

  // Convert the string to lowercase
  return kebabCaseString.toLowerCase();
}
