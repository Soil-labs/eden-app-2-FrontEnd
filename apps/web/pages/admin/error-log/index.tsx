import { gql, useMutation, useQuery } from "@apollo/client";
import { ErrorLog, Maybe } from "@eden/package-graphql/generated";
import { AdminLayout, Avatar, Card, SEO } from "@eden/package-ui";
import { BsTrash } from "react-icons/bs";

import type { NextPageWithLayout } from "../../_app";

const FIND_ERRORS = gql`
  query ($fields: errorsInput) {
    errors(fields: $fields) {
      errorsData {
        _id
        errorType
        createdAt
        name
        component
        message
        path
        url
        memberInfo {
          _id
          discordName
          discordAvatar
          discriminator
        }
        code
        stacktrace
      }
      pageInfo {
        totalResults
      }
    }
  }
`;

const DELETE_ERROR = gql`
  mutation ($fields: deleteErrorInput!) {
    deleteError(fields: $fields) {
      _id
    }
  }
`;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ErrorLogPage: NextPageWithLayout = () => {
  const [typeSelected, setTypeSelected] = useState<string | null>("FRONTEND");
  const { data: dataErrors, refetch: refetchErrors } = useQuery(FIND_ERRORS, {
    variables: {
      fields: {
        errorType: typeSelected,
      },
    },
  });

  const { errorsData, pageInfo } = dataErrors?.errors || {};

  //   if (errorsData) console.log("errorsData", errorsData);
  //   if (pageInfo) console.log("pageInfo", pageInfo);

  const [deleteError, {}] = useMutation(DELETE_ERROR, {
    onCompleted({ deleteError }) {
      if (!deleteError) console.log("deleteError is null");
      //   console.log("deleteError", deleteError);
      refetchErrors();
    },
  });

  const handleDeleteError = (_id: string) => {
    deleteError({
      variables: {
        fields: {
          _id: _id,
        },
      },
    });
  };

  const formatDate = (date: any) => {
    const offset = 0;

    // const currentDate = new Date();
    // const offset2 = currentDate.getTimezoneOffset() / 100;

    // console.log(offset2); // -300

    var d = new Date(date * 1);
    var utc = d.getTime() + d.getTimezoneOffset() * 60000; //This converts to UTC 00:00
    var nd = new Date(utc + 3600000 * offset);

    return nd.toLocaleString();
  };

  const tabs = [
    {
      name: "FRONTEND",
      value: "FRONTEND",
      current: typeSelected === "FRONTEND",
    },
    { name: "BOT", value: "BOT", current: typeSelected === "BOT" },
    { name: "SERVER", value: "SERVER", current: typeSelected === "SERVER" },
    { name: "ALL", value: null, current: typeSelected === null },
  ];

  return (
    <>
      <SEO />
      <Card shadow className={`h-85 m-4 w-full bg-white p-4`}>
        <div className={`md:flex md:justify-between`}>
          <nav className="flex space-x-4" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setTypeSelected(tab.value)}
                className={classNames(
                  tab.current
                    ? "bg-gray-200 text-gray-800"
                    : "text-gray-600 hover:text-gray-800",
                  "rounded-md px-3 py-2 text-sm font-medium"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
          <div className={`font-medium text-gray-600`}>
            {pageInfo?.totalResults} Total
          </div>
        </div>
        <Card className={`scrollbar-hide h-75 overflow-scroll`}>
          {errorsData &&
            errorsData.map((error: ErrorLog) => (
              <Card
                key={error._id}
                border
                className={`my-2 p-4 font-medium text-gray-600`}
              >
                <div className={`flex justify-between font-semibold`}>
                  <span className={`rounded bg-green-200 px-2`}>
                    {error.errorType}
                  </span>
                  <button
                    className={`hover:text-red-800`}
                    onClick={() => handleDeleteError(error._id)}
                  >
                    <BsTrash size={20} />
                  </button>
                </div>
                <div className={`mt-2 flex justify-between`}>
                  <div className={`flex`}>
                    <div>
                      <Avatar
                        src={error?.memberInfo?.discordAvatar || ""}
                        size={`sm`}
                      />
                    </div>
                    <div
                      className={`mx-4 flex text-lg font-semibold text-gray-700`}
                    >
                      <div>{error.memberInfo?.discordName}</div>
                      <span className={`mt-2 text-xs text-gray-500`}>
                        #{error.memberInfo?.discriminator}
                      </span>
                    </div>
                  </div>
                  <div> {formatDate(error.createdAt)} - UTC</div>
                </div>
                <div className={`text-red-800`}>Message: {error.message}</div>
                {error.name && <div>Name: {error.name}</div>}
                {error.component && <div>Component: {error.component}</div>}
                {error?.path && error?.path.length > 0 && (
                  <div className={`flex`}>
                    Mutations
                    {error?.path.map((item: Maybe<string>, index: number) => (
                      <div className={`ml-2`} key={index}>
                        : {item ? item : "null"}
                      </div>
                    ))}
                  </div>
                )}

                {error.url && <div>URL: {error.url}</div>}
                {error.code && <div>Code: {error.code}</div>}
                {error?.stacktrace && error?.stacktrace?.length > 0 && (
                  <div className={``}>
                    Stacktrace:
                    {error?.stacktrace.map(
                      (item: Maybe<string>, index: number) => (
                        <ul className={`ml-4 text-xs`} key={index}>
                          - {item}
                        </ul>
                      )
                    )}
                  </div>
                )}
              </Card>
            ))}
        </Card>
      </Card>
    </>
  );
};

ErrorLogPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default ErrorLogPage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";
import { useState } from "react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session || session.error === "RefreshAccessTokenError") {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  if (session.accessLevel && session.accessLevel > 5) {
    return {
      redirect: {
        destination: `/home`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
