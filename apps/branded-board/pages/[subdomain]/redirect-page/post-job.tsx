// import { UserContext } from "@eden/package-context";
import { UserContext } from "@eden/package-context";
import { BrandedSaasUserLayout, Loading } from "@eden/package-ui";
import { getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

// import { useContext } from "react";
import type { NextPageWithLayout } from "../../_app";
const RedirectPostJobPage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const communityIDs = router.query.community
    ? [router.query.community].flat(1)
    : [];

  useEffect(() => {
    if (currentUser) {
      if (
        currentUser?.companies &&
        currentUser?.companies[0] &&
        currentUser?.companies[0].company?.slug
      ) {
        router.push(`/dashboard/${currentUser?.companies[0].company?.slug}`);
      } else {
        router.push(`/pricing?community=${communityIDs[0]}`);
      }
    }
  }, [currentUser]);

  return (
    <>
      <Loading title="Redirecting to company dashboard" />
    </>
  );
};

RedirectPostJobPage.getLayout = (page) => (
  <BrandedSaasUserLayout>{page}</BrandedSaasUserLayout>
);

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
  resolvedUrl: string;
  query: { slug: string };
}) {
  const session = getCookieFromContext(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  }

  return {
    props: { key: url },
  };
}

export default RedirectPostJobPage;
