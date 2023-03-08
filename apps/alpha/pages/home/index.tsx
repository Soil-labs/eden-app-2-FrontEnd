import { AppUserSubmenuLayout, Card, MemberGraph, SEO } from "@eden/package-ui";

import type { NextPageWithLayout } from "../_app";

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <SEO />
      <HomeHeroSection
        grantsPage
        projectsPage
        usersPage
        // launchPage
        profilePage
      />
    </>
  );
};

interface INavItems {
  title: string;
  href: string;
  bgColor: string;
  description: string;
  display: boolean | undefined;
  style: string;
}

interface IHomeHeroSectionProps {
  opportunityPage?: boolean;
  launchPage?: boolean;
  grantsPage?: boolean;
  projectsPage?: boolean;
  usersPage?: boolean;
  profilePage?: boolean;
}

const HomeHeroSection = ({
  opportunityPage,
  launchPage,
  grantsPage,
  projectsPage,
  usersPage,
  profilePage,
}: IHomeHeroSectionProps) => {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);
  const [displayNav, setDisplayNav] = useState<INavItems[]>([]);

  useEffect(() => {
    const navItems = [
      {
        title: "Find Friends",
        href: "/discover",
        bgColor: "rgba(116, 250, 109, 0.3)",
        description:
          "Find Members of Eden to collaborate, create projects, and apply for grants!",
        display: usersPage,
        style: "absolute left-8 top-24",
      },
      {
        title: "Explore Projects",
        href: "/projects",
        bgColor: "rgba(155, 103, 255, 0.3)",
        description: "Find a project, and apply for it!",
        display: projectsPage,
        style: "absolute left-8 bottom-8",
      },
      {
        title: "Add Skills",
        href: "/profile",
        bgColor: "rgba(255, 242, 104, 0.3)",
        description:
          "Finish your profile to get discovered by people in your community!",
        display: profilePage,
        style: "absolute right-8 top-24",
      },
      {
        title: "Launch new Project",
        href: "/create-project",
        bgColor: "rgba(116, 250, 109, 0.3)",
        description:
          "Become a Champion of your own adventure! + gather a team of your dreams :)",
        display: launchPage,
        style: "",
      },
      {
        title: "Find Grants & Bounties",
        href: "/grants",
        bgColor: "rgb(255,211,235)",
        description: "Find a grant and apply for it!",
        display: grantsPage,
        style: "absolute right-8 bottom-8",
      },
    ];
    const showNavItems = navItems.filter((item) => item.display);

    setDisplayNav(showNavItems);
  }, [
    opportunityPage,
    launchPage,
    grantsPage,
    projectsPage,
    usersPage,
    profilePage,
  ]);

  return (
    <Card
      shadow
      className={`h-85 scrollbar-hide m-auto flex w-1/2 min-w-[720px] flex-col overflow-scroll bg-white py-8`}
    >
      <h1 className="text-center text-2xl">{`Now, let's get you connected to the graph!`}</h1>
      <div className="flex h-full w-full items-center">
        {currentUser?._id && <MemberGraph memberId={currentUser?._id!} />}
      </div>
      {displayNav.map((item, index: number) => (
        <button
          key={index}
          onClick={() => router.push(`${item?.href}`)}
          style={{ backgroundColor: item.bgColor }}
          className={`rounded-xl shadow-md hover:shadow-sm ${item.style}`}
        >
          <Card className={`px-6`}>
            <div
              className={`font-Inter text-center text-xl font-medium md:text-3xl`}
            >
              {item.title}

              <div className="ml-8 flex flex-col justify-between"></div>
            </div>
          </Card>
        </button>
      ))}
    </Card>
  );
};

HomePage.getLayout = (page) => (
  <AppUserSubmenuLayout showSubmenu={false}>{page}</AppUserSubmenuLayout>
);

export default HomePage;

import { UserContext } from "@eden/package-context";
import { IncomingMessage, ServerResponse } from "http";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

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

  return {
    props: {},
  };
}
