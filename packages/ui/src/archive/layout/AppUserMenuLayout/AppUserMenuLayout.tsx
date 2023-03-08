import { useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { FIND_PROJECTS_RECOMMENDED } from "@eden/package-graphql";
import {
  AppHeader,
  Card,
  GridItemNine,
  GridItemSix,
  GridItemThree,
  GridLayout,
} from "@eden/package-ui";
// import { useRouter } from "next/router";
import { useContext } from "react";

import { UserProfileMenu } from "../../components/UserProfileMenu";
import { RecommendedList } from "../../lists/RecommendedList";

export interface IAppUserMenuLayoutProps {
  children: React.ReactNode;
  recommnededSidebar?: boolean;
}

export const AppUserMenuLayout = ({
  children,
  recommnededSidebar = true,
}: IAppUserMenuLayoutProps) => {
  // const router = useRouter();
  const { currentUser } = useContext(UserContext);

  // if (currentUser) console.log("currentUser", currentUser);
  // if (currentUser) {
  //   if (!currentUser?.onbording?.signup) router.push(`/signup`);
  // }

  const { data: dataProjectsRecommended } = useQuery(
    FIND_PROJECTS_RECOMMENDED,
    {
      variables: {
        fields: {
          memberID: currentUser?._id,
        },
      },
      skip: !currentUser,
    }
  );

  return (
    <>
      <div className="bg-background flex h-screen min-w-0 flex-col lg:overflow-y-hidden">
        <AppHeader logoLink={`/home`} inApp />
        <main className="flex flex-grow">
          <GridLayout>
            <GridItemThree>
              <Card className="bg-white p-6">
                <UserProfileMenu title={`Good Morning,`} />
              </Card>
            </GridItemThree>
            {recommnededSidebar ? (
              <>
                <GridItemSix>{children}</GridItemSix>
                <GridItemThree>
                  <RecommendedList
                    projects={
                      dataProjectsRecommended?.findProjects_RecommendedToUser
                    }
                  />
                </GridItemThree>
              </>
            ) : (
              <GridItemNine>{children}</GridItemNine>
            )}
          </GridLayout>
        </main>
      </div>
    </>
  );
};

export default AppUserMenuLayout;
