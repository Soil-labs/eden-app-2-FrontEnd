import { gql, useMutation, useQuery } from "@apollo/client";
import { CompanyContext } from "@eden/package-context";
import { Position } from "@eden/package-graphql/generated";
import { AppUserLayout, Button, EdenAiProcessingModal } from "@eden/package-ui";
// import axios from "axios";
import { IncomingMessage, ServerResponse } from "http";
import Head from "next/head";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useContext, useMemo, useState } from "react";
import { BiPlus } from "react-icons/bi";
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

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { getCompanyFunc } = useContext(CompanyContext);
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

  useMemo(() => {
    if (
      companyLoading &&
      findCompanyData?.findCompanyFromSlug?.positions &&
      findCompanyData?.findCompanyFromSlug?.positions?.length > 0
    ) {
      router.push(
        `/${findCompanyData?.findCompanyFromSlug?.slug}/dashboard/${
          findCompanyData?.findCompanyFromSlug?.positions.filter(
            (_position: Position) =>
              _position?.status !== "ARCHIVED" &&
              _position?.status !== "DELETED"
          )[0]?._id
        }`
      );
    } else if (companyLoading && findCompanyData?.findCompanyFromSlug) {
      setCompanyLoading(false);
    }
  }, [findCompanyData?.findCompanyFromSlug?.positions]);

  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onCompleted(updatePositionData) {
      getCompanyFunc();
      router
        .push(
          `/${findCompanyData?.findCompanyFromSlug?.slug}/dashboard/${updatePositionData.updatePosition._id}/train-eden-ai`
        )
        .then(() => {
          setUpdatePositionLoading(false);
        });
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

  const handleCreatePosition = () => {
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
      {!companyLoading && (
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
      )}
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  query: { slug: string };
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel === 5) {
    return {
      props: { key: url },
    };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/company-auth`,
    {
      method: "POST",
      body: JSON.stringify({
        userID: session.user!.id,
        companySlug: ctx.query.slug,
      }),
      headers: { "Content-Type": "application/json" },
    }
  );

  console.log(res.status);

  // if (res.status === 401) {
  //   return {
  //     redirect: {
  //       destination: `/request-access`,
  //       permanent: false,
  //     },
  //   };
  // }

  if (res.status === 404) {
    return {
      redirect: {
        destination: `/create-company`,
        permanent: false,
      },
    };
  }

  const _companyAuth = await res.json();

  if (
    res.status === 200 &&
    (!_companyAuth.company.stripe ||
      !_companyAuth.company.stripe.product ||
      !_companyAuth.company.stripe.product.ID)
  ) {
    return {
      redirect: {
        destination: `/${_companyAuth.company.slug}/dashboard/subscription`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}
