import { gql, useMutation, useQuery } from "@apollo/client";
import { CompanyContext } from "@eden/package-context";
import { Position } from "@eden/package-graphql/generated";
import { BrandedSaasUserLayout, Button, Modal } from "@eden/package-ui";
import useAuthGate from "@eden/package-ui/src/hooks/useAuthGate/useAuthGate";
import { getCookieFromContext } from "@eden/package-ui/utils";
// import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import type { NextPageWithLayout } from "../../_app";

const UPDATE_POSITION = gql`
  mutation ($fields: updatePositionInput!) {
    updatePosition(fields: $fields) {
      _id
    }
  }
`;

const FIND_COMPANY_FROM_SLUG = gql`
  query ($fields: findCompanyFromSlugInput) {
    findCompanyFromSlug(fields: $fields) {
      _id
      name
      slug
      positions {
        _id
        name
        status
        talentList {
          _id
          name
        }
      }
    }
  }
`;

const BULK_UPDATE_POSITION = gql`
  mutation (
    $fieldsUpdatePosition: updatePositionInput!
    $fieldsWebsiteToMemoryCompany: websiteToMemoryCompanyInput!
  ) {
    updatePosition(fields: $fieldsUpdatePosition) {
      _id
    }
    websiteToMemoryCompany(fields: $fieldsWebsiteToMemoryCompany) {
      report
      interviewQuestionsForPosition {
        originalQuestionID
        originalContent
        personalizedContent
      }
    }
  }
`;

const AUTO_UPDATE_POSITION = gql`
  mutation autoUpdatePositionCompInformation_V2(
    $fields: autoUpdatePositionCompInformationInput
  ) {
    autoUpdatePositionCompInformation_V2(fields: $fields) {
      _id
      name
      whoYouAre
      company {
        _id
        name
        description
        mission
        whatsToLove
      }
    }
  }
`;

export interface CreatePositionModalProps {
  open: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: any) => void;
  submitting?: boolean;
}

const CreatePositionModal = ({
  open,
  onClose,
  onSubmit,
  submitting,
}: CreatePositionModalProps) => {
  const { register, handleSubmit } = useForm<any>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <Modal open={open} onClose={onClose} closeOnEsc>
      <h2 className="text-edenGreen-600 mb-4 text-center">
        Launch opportunity
      </h2>
      <form>
        <div className="mb-4">
          <label className="text-edenGray-700 mb-1 block text-sm">
            Title of your opportunity
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="Write a title"
            className="border-edenGray-500 block w-full rounded-md border bg-transparent px-3 py-2 focus:outline-none"
          />
        </div>
        <div className="mb-8">
          <label className="text-edenGray-700 mb-1 block text-sm">
            {
              "Paste your job description below. Don't worry about making it look pretty, we'll fix all that in a bit."
            }
          </label>
          <textarea
            {...register("description")}
            rows={5}
            placeholder="This is a sample text..."
            className="border-edenGray-500 block w-full rounded-md border bg-transparent px-3 py-2 focus:outline-none"
          />
        </div>
        <Button
          onClick={handleSubmit((data) => onSubmit(data))}
          variant="secondary"
          className="mx-auto block"
          disabled={submitting}
          loading={submitting}
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
};

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();

  useAuthGate();

  const { company, getCompanyFunc } = useContext(CompanyContext);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [updatePositionLoading, setUpdatePositionLoading] =
    useState<boolean>(false);

  const { data: findCompanyData } = useQuery(FIND_COMPANY_FROM_SLUG, {
    variables: {
      fields: {
        slug: router.query.slug,
      },
    },
    onCompleted(_findCompanyData) {
      if (
        !_findCompanyData?.findCompanyFromSlug?.positions ||
        _findCompanyData?.findCompanyFromSlug?.positions?.length === 0
      ) {
        setCompanyLoading(false);
      }
    },
  });

  const [autoUpdatePosition] = useMutation(AUTO_UPDATE_POSITION, {
    onCompleted(autoUpdatePositionData) {
      getCompanyFunc();
      router.push(
        `/jobs/${autoUpdatePositionData.autoUpdatePositionCompInformation_V2._id}?edit=true`
      );
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

  const [bulkUpdatePosition] = useMutation(BULK_UPDATE_POSITION, {
    onCompleted() {
      autoUpdatePosition({
        variables: {
          fields: {
            positionID: newPositionId,
          },
        },
      });
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

  const handleSubmitCreatePosition = (data: any) => {
    setUpdatePositionLoading(true);

    bulkUpdatePosition({
      variables: {
        fieldsUpdatePosition: {
          _id: newPositionId,
          name: data.name,
        },
        fieldsWebsiteToMemoryCompany: {
          positionID: newPositionId,
          message: data.description,
        },
      },
    });
  };

  useMemo(() => {
    if (companyLoading && findCompanyData?.findCompanyFromSlug) {
      setCompanyLoading(false);
    }
  }, [findCompanyData?.findCompanyFromSlug?.positions]);

  const [newPositionId, setNewPositionId] = useState<string | null>(null);
  const [createPositionOpen, setCreatePositionOpen] = useState<boolean>(false);

  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onCompleted(updatePositionData) {
      getCompanyFunc();
      setNewPositionId(updatePositionData.updatePosition._id);
      setUpdatePositionLoading(false);
      setCreatePositionOpen(true);

      // router
      //   .push(
      //     `/${findCompanyData?.findCompanyFromSlug?.slug}/dashboard/${updatePositionData.updatePosition._id}/train-eden-ai`
      //   )
      //   .then(() => {
      //     setUpdatePositionLoading(false);
      //   });
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

  const handleCreatePosition = () => {
    // console.log("hashafdhfadhadfs")
    const randId = uuidv4();

    setUpdatePositionLoading(true);

    updatePosition({
      variables: {
        fields: {
          name: `New Opportunity ${randId}`,
          companyID: findCompanyData?.findCompanyFromSlug?._id,
        },
      },
    });
  };

  return (
    <>
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
      <CreatePositionModal
        onClose={() => setCreatePositionOpen(false)}
        open={createPositionOpen}
        onSubmit={handleSubmitCreatePosition}
        submitting={updatePositionLoading}
      />
      {!companyLoading && (
        <div className="mx-auto max-w-4xl pt-20 text-center">
          <h1 className="text-edenGreen-500 font-clash-display mb-4 font-medium">
            Welcome to Eden
          </h1>
          {company?.positions && company?.positions.length === 0 ? (
            <p className="mb-8">
              You have no open opportunities yet!
              <br />
              Start creating your first opportunity here:
            </p>
          ) : null}
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-4 md:gap-y-8 lg:grid-cols-3">
            <div className="transition-ease-in-out group relative col-span-1 w-full cursor-pointer rounded-md bg-[#F7F8F7] p-1 shadow-sm transition-all hover:scale-[101%] hover:shadow-md">
              <span className="text-edenGray-500 absolute left-4 top-4 z-10 text-lg">
                +
              </span>
              <div className="bg-edenGreen-200 relative mb-2 flex h-56 w-full items-center rounded-md p-2">
                <h2 className="font-clash-display font-medium">
                  Add Opportunity
                </h2>
              </div>
              <Button
                onClick={handleCreatePosition}
                className="w-[90%] rounded-b-md"
                variant="primary"
              >
                Add New
              </Button>
            </div>

            {company?.positions?.map((position) => (
              <PositionCard
                key={position?._id}
                position={position as Position}
                companySlug={company.slug || ""}
              />
            ))}
          </div>
        </div>
      )}
      {/* {!companyLoading && (
        <div className="mx-auto max-w-4xl pt-20 text-center">
          <h1 className="text-edenGreen-500 mb-4">Welcome to Eden</h1>
          <p className="mb-8">
            You have no open opportunities yet!
            <br />
            Start creating your first opportunity here:
          </p>
          <Button
            className={"mx-auto flex items-center whitespace-nowrap"}
            onClick={handleCreatePosition}
          >
            <BiPlus size={"1.3rem"} className="" />
            <span className="font-Moret ml-1">Add Opportunity</span>
          </Button>

          <EdenAiProcessingModal
            title="Creating position"
            open={updatePositionLoading}
          ></EdenAiProcessingModal>
        </div>
      )} */}
    </>
  );
};

HomePage.getLayout = (page) => (
  <BrandedSaasUserLayout>{page}</BrandedSaasUserLayout>
);

export default HomePage;

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
    return { notFound: true };
  }

  const _companyAuth = await res.json();

  if (
    res.status === 200 &&
    _companyAuth.company.type !== "COMMUNITY" &&
    (!_companyAuth.company.stripe ||
      !_companyAuth.company.stripe.product ||
      !_companyAuth.company.stripe.product.ID)
  ) {
    return {
      redirect: {
        destination: `/dashboard/${_companyAuth.company.slug}/subscription`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}

type PositionCardProps = {
  companySlug: String;
  position: Position;
};

const PositionCard = ({ position, companySlug }: PositionCardProps) => {
  return (
    <Link
      className="transition-ease-in-out group relative col-span-1 w-full cursor-pointer rounded-md bg-[#F7F8F7] p-1 shadow-sm transition-all hover:scale-[101%] hover:shadow-md"
      href={`/dashboard/${companySlug}/${position._id}`}
    >
      <div className="bg-edenGreen-200 relative mb-2 flex h-56 w-full items-center rounded-md p-2">
        {(!!position?.generalDetails?.yearlySalary?.min ||
          position?.generalDetails?.yearlySalary?.min === 0) && (
          <span className="text-edenGray-500 absolute left-2 top-4 text-sm">
            ${position?.generalDetails?.yearlySalary.min / 1000 + "k"}
            {position?.generalDetails?.yearlySalary.max
              ? " - $" + position?.generalDetails.yearlySalary.max / 1000 + "k"
              : ""}
          </span>
        )}
        <h2 className="font-clash-display font-medium">{position?.name}</h2>
      </div>
      <Button className="w-[90%] rounded-b-md" variant="secondary">
        See opportunity
      </Button>
    </Link>
  );
};
