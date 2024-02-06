import { UserContext } from "@eden/package-context";
import { SaasUserLayout } from "@eden/package-ui";
import { getCookieFromContext } from "@eden/package-ui/utils";
import { IncomingMessage, ServerResponse } from "http";
import { useContext } from "react";

import ConnectTelegramContainer from "@/components/interview/ConnectTelegramContainer";

import type { NextPageWithLayout } from "../../_app";

const ConnectTGPage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <>
      <ConnectTelegramContainer
        candidateTelegramID={currentUser?.conduct?.telegramChatID || undefined}
      />
    </>
  );
};

ConnectTGPage.getLayout = (page) => <SaasUserLayout>{page}</SaasUserLayout>;

export default ConnectTGPage;

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
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

  return {
    props: {},
  };
}
