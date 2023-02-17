import { Card } from "@eden/package-ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface INavItems {
  title: string;
  href: string;
  bgColor: string;
  description: string;
  display: boolean | undefined;
}

export interface IHomeHeroSectionProps {
  opportunityPage?: boolean;
  launchPage?: boolean;
  grantsPage?: boolean;
  projectsPage?: boolean;
  usersPage?: boolean;
  profilePage?: boolean;
}

export const HomeHeroSection = ({
  opportunityPage,
  launchPage,
  grantsPage,
  projectsPage,
  usersPage,
  profilePage,
}: IHomeHeroSectionProps) => {
  const router = useRouter();
  const [displayNav, setDisplayNav] = useState<INavItems[]>([]);

  useEffect(() => {
    const navItems = [
      {
        title: "Find Users",
        href: "/discover",
        bgColor: "rgba(116, 250, 109, 0.3)",
        description:
          "Find Members of Eden to collaborate, create projects, and apply for grants!",
        display: usersPage,
      },
      {
        title: "Find Projects",
        href: "/projects",
        bgColor: "rgba(155, 103, 255, 0.3)",
        description: "Find a project, and apply for it!",
        display: projectsPage,
      },
      {
        title: "Create Profile",
        href: "/profile",
        bgColor: "rgba(255, 242, 104, 0.3)",
        description:
          "Finish your profile to get discovered by people in your community!",
        display: profilePage,
      },
      {
        title: "Launch new Project",
        href: "/create-project",
        bgColor: "rgba(116, 250, 109, 0.3)",
        description:
          "Become a Champion of your own adventure! + gather a team of your dreams :)",
        display: launchPage,
      },
      {
        title: "Discover Grants",
        href: "/grants",
        bgColor: "rgba(155, 103, 255, 0.3)",
        description: "Find a grant and apply for it!",
        display: grantsPage,
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
      className={`h-85 scrollbar-hide m-auto flex flex-col overflow-scroll bg-white py-8`}
    >
      {displayNav.map((item, index: number) => (
        <div key={index} className={`group my-8 grid grid-cols-3 `}>
          <div className={`font-Gloria text-md p-4 text-zinc-400 md:text-2xl`}>
            {index % 2 === 0 && (
              <span className={`group-hover:text-blue-500`}>
                {item.description}
              </span>
            )}
          </div>
          <button
            onClick={() => router.push(`${item?.href}`)}
            style={{ backgroundColor: item.bgColor }}
            className={`rounded-xl shadow-md hover:shadow-sm`}
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
          <div
            className={`font-Gloria text-md py-4 px-8 text-zinc-400 md:text-2xl`}
          >
            {index % 2 !== 0 && (
              <span className={`group-hover:text-blue-500`}>
                {item.description}
              </span>
            )}
          </div>
        </div>
      ))}
    </Card>
  );
};
