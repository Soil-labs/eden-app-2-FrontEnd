import { AppUserLayout, SEO } from "@eden/package-ui";

import type { NextPageWithLayout } from "../_app";

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <SEO />
      <div className="w-full p-8">
        <h2>Quick directory</h2>
        <ul className="list-disc">
          <li>
            <Link href={"/companyCRM/644e052ca7177f51e7c27b77"}>
              Company CRM
            </Link>
          </li>
          <li>
            <Link href={"/companyCRM/TrainQuestionsEdenAI"}>
              Company CRM Train questions
            </Link>
          </li>
          <li>
            <Link href={"/interviewEdenAIpage"}>Interview</Link>
          </li>
          <li>
            <Link href={"/interviewEdenAIpage/644e052ca7177f51e7c27b77"}>
              Interview Company
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

import { IncomingMessage, ServerResponse } from "http";
import Link from "next/link";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
