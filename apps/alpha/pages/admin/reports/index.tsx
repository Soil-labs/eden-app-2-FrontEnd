import { AdminLayout, AdminReportsContainer, SEO } from "@eden/package-ui";

import type { NextPageWithLayout } from "../../_app";

const ReportsPage: NextPageWithLayout = () => {
  return (
    <>
      <SEO />
      <AdminReportsContainer />
    </>
  );
};

ReportsPage.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default ReportsPage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

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
