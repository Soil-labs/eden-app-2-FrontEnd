import { BrandedAppUserLayout, SEO } from "@eden/package-ui";

import type { NextPageWithLayout } from "../_app";

const AdminPage: NextPageWithLayout = () => {
  return (
    <>
      <SEO />
      <div>home</div>
    </>
  );
};

AdminPage.getLayout = (page) => (
  <BrandedAppUserLayout>{page}</BrandedAppUserLayout>
);
export default AdminPage;

import { getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = getCookieFromContext(ctx);

  const url = ctx.req.url;

  if (!session || session.error === "RefreshAccessTokenError") {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
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
