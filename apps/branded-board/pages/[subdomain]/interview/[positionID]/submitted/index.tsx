import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Position } from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  AskEdenPopUp,
  Button,
} from "@eden/package-ui";
import { getCookieFromContext } from "@eden/package-ui/utils";
import mixpanel from "mixpanel-browser";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useContext, useEffect } from "react";

import type { NextPageWithLayout } from "../../../../_app";

const ThanksPage: NextPageWithLayout = ({
  position,
}: {
  position: Position;
}) => {
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    mixpanel.track("Interview > Email confirmed");
  }, []);

  return (
    <>
      <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col justify-center p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-edenGreen-600 mb-3">
            🎉 Application for {position.name} at {position.company?.name}
            confirmed! 🎉
          </h2>
          <h3 className="text-edenGreen-600 mb-8 font-medium">
            🤞 Good luck 🤞
          </h3>
          <p className="text-edenGray-500 mb-20">
            Most Hiring managers get back to you <u>within 2 weeks</u> so keep
            an eye on your e-mails for additional questions / an invite for the
            next step.
          </p>
          <div className="flex justify-center">
            <Link href="/">
              <Button>Explore more opportunities</Button>
            </Link>
          </div>
        </div>
        {currentUser?._id && (
          <AskEdenPopUp
            memberID={currentUser?._id}
            service={
              AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION_AFTER_INTERVIEW
            }
            title="Ask Eden about this opportunity"
            className="!bottom-[0.35rem] !right-2"
          />
        )}
      </div>
    </>
  );
};

ThanksPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default ThanksPage;

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
    credentials: "same-origin",
  }),
  cache: new InMemoryCache(),
});

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const positionID = ctx.params?.positionID;

  const { data } = await client.query({
    query: gql`
      query ($fields: findPositionInput!) {
        findPosition(fields: $fields) {
          _id
          name
          company {
            _id
            name
          }
        }
      }
    `,
    variables: {
      fields: {
        _id: positionID,
      },
      ssr: true,
    },
  });

  const session = getCookieFromContext(ctx);
  // if not session ask for login

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${ctx.req.url}`,
        permanent: false,
      },
    };
  }

  return {
    props: { position: data.findPosition || null },
  };
}
