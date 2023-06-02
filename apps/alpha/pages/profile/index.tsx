import { UserContext } from "@eden/package-context";
import {
  AppUserSubmenuLayout,
  Button,
  Card,
  GridItemSix,
  GridItemThree,
  GridLayout,
  MemberInfoWithDynamicGraph2,
  SEO,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext } from "react";

import type { NextPageWithLayout } from "../_app";

const ProfilePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  // const [view, setView] = useState<"grants" | "profile">("grants");

  // const [activeIndex, setActiveIndex] = useState(0);
  // const submenu = [
  //   {
  //     Icon: <FaUserAlt size={20} />,
  //     FunctionName: "My Profile",
  //     onFunctionCallback: () => setActiveIndex(0),
  //   },
  //   {
  //     Icon: <FaUserEdit size={25} />,
  //     FunctionName: "Edit Profile",
  //     onFunctionCallback: () => setView("profile"),
  //   },
  // ];

  // const [userState, setUserState] = useState<Members>();
  // const [step, setStep] = useState(STEPS.ROLE);
  // const [experienceOpen, setExperienceOpen] = useState<number | null>(null);

  // useEffect(() => {
  //   if (currentUser) {
  //     setUserState(currentUser);
  //   }
  // }, [currentUser]);
  const router = useRouter();
  const { endorseFlag } = router.query;

  console.log(typeof endorseFlag);

  if (!currentUser) return null;

  return (
    <>
      <SEO />
      {/* {view === "grants" && (
        <AppUserSubmenuLayout submenu={submenu} activeIndex={activeIndex}>
          <Card
            shadow
            className={`h-85 scrollbar-hide overflow-y-scroll bg-white`}
          >
            <div className={`p-4 md:p-8`}>
              <MemberInfo member={currentUser} />
            </div>
          </Card>
        </AppUserSubmenuLayout>
      )} */}
      {/* {view === "profile" && ( */}
      <AppUserSubmenuLayout showSubmenu={false}>
        <GridLayout>
          {/* <GridItemSix>
              <Card shadow className={"h-85 bg-white"}>
                <FillUserProfileContainer
                  step={step}
                  state={userState}
                  setState={setUserState}
                  setStep={setStep}
                  setExperienceOpen={setExperienceOpen}
                  setView={setView}
                  percentage={getFillProfilePercentage(currentUser)}
                />
              </Card>
            </GridItemSix> */}
          <GridItemThree>
            {endorseFlag === "true" && (
              <Card shadow className={"shadow-accentColor bg-white p-4 py-6"}>
                <p className="mb-4 font-bold">
                  Jumpstart your reputation in Eden!
                </p>
                <p className="mb-8">
                  Invite friends & colleagues to endorse your skills.
                </p>
                <Button
                  className="mx-auto"
                  variant="primary"
                  onClick={() => {
                    router.push("/test/flow/endorsement-link");
                  }}
                >
                  <span className="!font-bold">Get endorsed</span>
                </Button>
              </Card>
            )}
          </GridItemThree>
          <GridItemSix>
            <Card
              shadow
              className={"scrollbar-hide h-[88vh] overflow-scroll bg-white p-4"}
            >
              {/* <ViewUserProfileContainer
                  step={step}
                  user={userState}
                  experienceOpen={experienceOpen}
                  setExperienceOpen={setExperienceOpen}
                /> */}
              <Button
                variant="default"
                className="absolute right-4 top-4"
                onClick={() => {
                  router.push("/create-profile");
                }}
              >
                Edit Profile
              </Button>
              <MemberInfoWithDynamicGraph2
                // step={step}
                member={currentUser}
                nodesID={currentUser?.nodes?.map((node) => node?.nodeData?._id)}
              />
            </Card>
          </GridItemSix>
          <GridItemThree> </GridItemThree>
        </GridLayout>
      </AppUserSubmenuLayout>
      {/* )} */}
    </>
  );
};

export default ProfilePage;

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

  return {
    props: {},
  };
}
