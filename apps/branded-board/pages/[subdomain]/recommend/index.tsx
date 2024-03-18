import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import { Members } from "@eden/package-graphql/generated";
import { AppUserLayout, Avatar, Button } from "@eden/package-ui";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { ReactElement } from "react";
import { FaStar } from "react-icons/fa";

import { NextPageWithLayout } from "../../_app";

const RecommendPage: NextPageWithLayout<{ user: Members }> = ({ user }) => {
  return (
    <>
      <div className={"relative h-[calc(100vh-4rem)] w-screen"}>
        <div className="mx-auto grid h-full max-w-screen-xl grid-cols-12 gap-4 p-4">
          <section className="bg-edenPink-300 col-span-5 flex h-full flex-col rounded-md p-8">
            <div className="border-edenGray-500 mb-4 flex items-center border-b pb-4">
              <div className="flex items-center gap-3">
                <Avatar size="sm" src={user.discordAvatar || ""}></Avatar>
                <p>{user.discordName}</p>
              </div>
            </div>
            <h1 className="font-Moret text-edenGreen-600 mb-4">
              Boost {user.discordName}&apos;s Chances with Your Recommendation!
            </h1>
            <p>
              Welcome, Mentor, Colleague, or Friend! Jimmy needs your support to
              secure a job. Your recommendation could make all the difference in
              helping him stand out as the perfect candidate.
            </p>

            <div className="border-edenGray-500 mt-auto border-t py-4">
              <div className="mb-3 flex items-center">
                <div className="bg-edenPink-500 mr-2 flex h-8 w-8 items-center justify-center rounded-xl">
                  <FaStar color="#00462C" />
                </div>
                <h3 className="font-Moret text-edenGreen-600">Your impact</h3>
              </div>
              <p>
                Your recommendation not only benefits Jimmy but also reflects
                positively on your own judgment and expertise, demonstrating
                your commitment to supporting talented individuals.
              </p>
            </div>
          </section>

          <section className="col-span-7 flex items-center justify-center">
            <Link href="https://joineden.deform.cc/vouch">
              <Button variant="secondary">
                Recommend {user.discordName} Now!
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </>
  );
};

const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_URL as string,
    credentials: "same-origin",
  }),
  cache: new InMemoryCache({ resultCaching: false }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

RecommendPage.getLayout = (page: ReactElement) => (
  <AppUserLayout>{page}</AppUserLayout>
);

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const userId = ctx.query.user;

  const {
    data: { findMember: user },
  } = await client.query({
    query: gql`
      query ($fields: findMemberInput!) {
        findMember(fields: $fields) {
          _id
          discordName
          discordAvatar
        }
      }
    `,
    variables: {
      fields: {
        _id: userId,
      },
      ssr: true,
      fetchPolicy: "no-cache",
    },
  });

  return {
    props: { user },
  };
};

export default RecommendPage;
