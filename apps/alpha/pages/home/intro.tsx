import {
  AppPublicLayout,
  Button,
  // Card,
  // MemberGraph,
  // Modal,
} from "@eden/package-ui";

import type { NextPageWithLayout } from "../_app";

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <HomeTutorialModalContainer />
    </>
  );
};

// interface INavItems {
//   title: string;
//   href: string;
//   bgColor: string;
//   description: string;
//   display: boolean | undefined;
//   style: string;
// }

// interface IHomeHeroSectionProps {
//   opportunityPage?: boolean;
//   launchPage?: boolean;
//   grantsPage?: boolean;
//   projectsPage?: boolean;
//   usersPage?: boolean;
//   profilePage?: boolean;
// }

// const HomeHeroSection = ({
//   opportunityPage,
//   launchPage,
//   grantsPage,
//   projectsPage,
//   usersPage,
//   profilePage,
// }: IHomeHeroSectionProps) => {
//   const router = useRouter();
//   const { currentUser } = useContext(UserContext);
//   const [displayNav, setDisplayNav] = useState<INavItems[]>([]);

//   useEffect(() => {
//     const navItems = [
//       {
//         title: "Find Friends",
//         href: "/discover",
//         bgColor: "rgba(116, 250, 109, 0.3)",
//         description:
//           "Find Members of Eden to collaborate, create projects, and apply for grants!",
//         display: usersPage,
//         style: "absolute left-8 top-8",
//       },
//       {
//         title: "Explore Projects",
//         href: "/projects",
//         bgColor: "rgba(155, 103, 255, 0.3)",
//         description: "Find a project, and apply for it!",
//         display: projectsPage,
//         style: "absolute left-8 bottom-8",
//       },
//       {
//         title: "Add Skills",
//         href: "/profile",
//         bgColor: "rgba(255, 242, 104, 0.3)",
//         description:
//           "Finish your profile to get discovered by people in your community!",
//         display: profilePage,
//         style: "absolute right-8 top-8",
//       },
//       {
//         title: "Launch new Project",
//         href: "/create-project",
//         bgColor: "rgba(116, 250, 109, 0.3)",
//         description:
//           "Become a Champion of your own adventure! + gather a team of your dreams :)",
//         display: launchPage,
//         style: "",
//       },
//       {
//         title: "Find Grants & Bounties",
//         href: "/grants",
//         bgColor: "rgba(155, 103, 255, 0.3)",
//         description: "Find a grant and apply for it!",
//         display: grantsPage,
//         style: "absolute right-8 bottom-8",
//       },
//     ];
//     const showNavItems = navItems.filter((item) => item.display);

//     setDisplayNav(showNavItems);
//   }, [
//     opportunityPage,
//     launchPage,
//     grantsPage,
//     projectsPage,
//     usersPage,
//     profilePage,
//   ]);

//   return (
//     <Card
//       shadow
//       className={`h-85 scrollbar-hide m-auto flex flex-col overflow-scroll bg-white py-8`}
//     >
//       <div className="w-full">
//         {currentUser?._id && <MemberGraph memberId={currentUser?._id!} />}
//       </div>
//       {displayNav.map((item, index: number) => (
//         <button
//           key={index}
//           onClick={() => router.push(`${item?.href}`)}
//           style={{ backgroundColor: item.bgColor }}
//           className={`rounded-xl shadow-md hover:shadow-sm ${item.style}`}
//         >
//           <Card className={`px-6`}>
//             <div
//               className={`font-Inter text-center text-xl font-medium md:text-3xl`}
//             >
//               {item.title}

//               <div className="ml-8 flex flex-col justify-between"></div>
//             </div>
//           </Card>
//         </button>
//       ))}
//     </Card>
//   );
// };

HomePage.getLayout = (page) => <AppPublicLayout>{page}</AppPublicLayout>;

export default HomePage;

// import { UserContext } from "@eden/package-context";
import { IncomingMessage, ServerResponse } from "http";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
// import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
// import { useContext, useEffect, useState } from "react";

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

export enum HomeTutorialSteps {
  // eslint-disable-next-line no-unused-vars
  STEP_1 = "step 1",
  // eslint-disable-next-line no-unused-vars
  STEP_2 = "step 2",
  // eslint-disable-next-line no-unused-vars
  STEP_3 = "step 3",
  // eslint-disable-next-line no-unused-vars
  STEP_4 = "step 4",
}

const GraphVisual2 = dynamic(
  () => import("@eden/package-ui/g6/GraphVisual2/GraphVisual2"),
  {
    ssr: false,
  }
);

const HomeTutorialModalContainer = () => {
  const [openModal, setOpenModal] = useState<HomeTutorialSteps | null>(
    HomeTutorialSteps.STEP_1
  );
  const [data, setData] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    switch (openModal) {
      case HomeTutorialSteps.STEP_1:
        setData(updateGraph(dataMember));
        break;
      case HomeTutorialSteps.STEP_2:
        setData(updateGraph(dataMemberToProject));
        break;
      case HomeTutorialSteps.STEP_3:
        setData(updateGraph(dataBig));
        break;
      default:
    }
  }, [openModal]);

  const [graph2, setGraph2] = useState<any>();

  return (
    <>
      <section className="flex h-screen w-full flex-col items-center justify-center">
        {openModal === HomeTutorialSteps.STEP_1 && (
          <div>
            <h1 className="text-center text-2xl">Welcome to Eden!</h1>
            <p className="text-center">This is how the network sees you</p>
            <p className="text-center">{`It's a bit empty, don't you think?`}</p>
            <Button
              className="absolute right-10 bottom-12 z-20"
              radius="rounded"
              variant={`secondary`}
              onClick={() => setOpenModal(HomeTutorialSteps.STEP_2)}
            >
              Next
            </Button>
          </div>
        )}
        {openModal === HomeTutorialSteps.STEP_2 && (
          <div>
            <h1 className="text-center text-2xl">In Eden you are a node</h1>
            <p className="text-center">{`And this is how it's all connected`}</p>
            <Button
              className="absolute right-3 bottom-3 z-20"
              radius="rounded"
              variant={`secondary`}
              onClick={() => setOpenModal(HomeTutorialSteps.STEP_3)}
            >
              Next
            </Button>
          </div>
        )}
        {openModal === HomeTutorialSteps.STEP_3 && (
          <div>
            <h1 className="text-center text-2xl">
              This is our ✨Knowledge Graph✨ today
            </h1>
            <div className="flex justify-center">
              <ul className="">
                <li>190 members</li>
                <li>6 projects</li>
                <li>3 grants</li>
              </ul>
            </div>
            <p className="text-center">
              <span className="bg-[#DEFEFF] px-2">{`Connect to Eden Network to get a match`}</span>
            </p>
            <Button
              className="absolute right-3 bottom-3 z-20"
              radius="rounded"
              variant={`secondary`}
              onClick={() => {
                router.push("/home");
              }}
            >
              Next
            </Button>
          </div>
        )}
        {/* {openModal === HomeTutorialSteps.STEP_4 && (
          <div>
            <h1 className="text-center text-2xl">{`Now, let's get you connected to the graph!`}</h1>
            <Button
              className="absolute right-3 bottom-3 z-20"
              radius="rounded"
              variant={`secondary`}
              onClick={() => router.push("/home")}
            >
              Next
            </Button>
          </div>
        )} */}
        {openModal !== HomeTutorialSteps.STEP_4 && (
          <div className="flex justify-center">
            <GraphVisual2
              hasMenu={false}
              data2={data}
              width={720}
              height={400}
              graph2={graph2}
              setGraph2={setGraph2}
            />
          </div>
        )}
      </section>
    </>
  );
};

const updateGraph = (data: any) => {
  const dataGraphAPI = data;

  console.log("dataGraphAPI = ", dataGraphAPI);
  const nodeDataObj: any = {};
  const edgesDataGraph = dataGraphAPI.edges.map(
    (edge: { source: any; target: any; distanceRation: any; style: any }) => {
      if (!nodeDataObj[edge.source]) {
        nodeDataObj[edge.source] = {
          numberConnections: 1,
        };
      } else {
        nodeDataObj[edge.source].numberConnections += 1;
      }
      if (!nodeDataObj[edge.target]) {
        nodeDataObj[edge.target] = {
          numberConnections: 1,
        };
      } else {
        nodeDataObj[edge.target].numberConnections += 1;
      }
      return {
        source: edge.source,
        target: edge.target,
        distanceRation: edge.distanceRation,
        style: edge.style,
      };
    }
  );

  let nodesDataGraph = dataGraphAPI.nodesVisual.map(
    (node: {
      _id: any;
      name: any;
      type: string;
      avatar: string;
      extraDistanceRation: Number;
      style: any;
    }) => {
      let extraStyle = {};

      if (node.avatar && node.avatar != undefined) {
        extraStyle = {
          // ----------- Shwow Avatar User ---------
          type: "image",
          img: node.avatar,
          clipCfg: {
            show: true,
            type: "circle",
            r: 25,
          },
          style: {
            height: 50,
            width: 50,
          },
          // ----------- Shwow Avatar User ---------
        };
      }
      if (!node.avatar && node.avatar != undefined) {
        extraStyle = {
          // ----------- Shwow Avatar User ---------
          type: node.type,
          // img: "",
          clipCfg: {},
          style: {},
          // ----------- Shwow Avatar User ---------
        };
      }

      return {
        id: node._id,
        label: node.name,
        nodeType: node.type,
        extraDistanceRation: node.extraDistanceRation,
        size: 50,
        numberConnections: nodeDataObj[node._id]
          ? nodeDataObj[node._id].numberConnections
          : 0,
        propertise: {
          name: node.name,
        },
        style: node.style,
        ...extraStyle,
      };
    }
  );

  if (nodesDataGraph.length == 0) {
    nodesDataGraph = [{ id: "node1", size: 50 }];
  }

  return {
    nodes: nodesDataGraph,
    edges: edgesDataGraph,
  };
};

const dataMember: any = {
  __typename: "Graph",
  nodesVisual: [
    {
      __typename: "NodeVisual",
      _id: "63eaefb64862b62edc303774",
      name: "",
      type: "expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        __typename: "StyleNodeOut",
        fill: "#dddddd",
        stroke: "#888888",
        size: 60,
      },
    },
    {
      __typename: "NodeVisual",
      _id: "901188444057907310",
      name: "BluePanda",
      type: "Member",
      avatar:
        "https://cdn.discordapp.com/avatars/908392557258604544/5472104b88b4876e3ad06803da45bee6.png",
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        __typename: "StyleNodeOut",
        fill: "#C5947C",
        stroke: "#C5947C",
        size: 20,
      },
    },
    {
      __typename: "NodeVisual",
      _id: "63eb074cdf71c82f61c1d18c",
      name: "",
      type: "typeProject",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        __typename: "StyleNodeOut",
        fill: "#dddddd",
        stroke: "#888888",
        size: 55,
      },
    },
  ],
  edges: [
    {
      __typename: "Edge",
      source: "63eaf009df71c82f61c1784b",
      target: "63eaefb44862b62edc30376e",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 95,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefb44862b62edc30376e",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefc44862b62edc3037b4",
      target: "63eaefb44862b62edc30376e",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 95,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefb44862b62edc30376e",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaf045df71c82f61c1793c",
      target: "63eaefb44862b62edc30376e",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 95,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefb44862b62edc30376e",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaeffadf71c82f61c1781b",
      target: "63eaefb44862b62edc30376e",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 95,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefb44862b62edc30376e",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaf063df71c82f61c1799c",
      target: "63eaefb44862b62edc30376e",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 95,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefb44862b62edc30376e",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaf027df71c82f61c178dc",
      target: "63eaefb44862b62edc30376e",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 95,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefb44862b62edc30376e",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaf018df71c82f61c178ac",
      target: "63eaefb44862b62edc30376e",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 95,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefb44862b62edc30376e",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefebdf71c82f61c177eb",
      target: "63eaefb44862b62edc30376e",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 95,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefb44862b62edc30376e",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eb077fdf71c82f61c1d826",
      target: "63eb074cdf71c82f61c1d18c",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eb074cdf71c82f61c1d18c",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eb0772df71c82f61c1d7fe",
      target: "63eb074cdf71c82f61c1d18c",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eb074cdf71c82f61c1d18c",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefc64862b62edc3037bc",
      target: "63eaefb64862b62edc303774",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 95,
        strength: 0.5,
      },
    },
    {
      __typename: "Edge",
      source: "63eaefb64862b62edc303774",
      target: "901188444057907310",
      distanceRation: null,
      style: {
        __typename: "StyleEdgeOut",
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 170,
        strength: 0.5,
      },
    },
  ],
};

const dataMemberToProject = {
  nodesVisual: [
    {
      _id: "908392557258604544",
      name: "BluePanda",
      type: "Member",
      avatar:
        "https://cdn.discordapp.com/avatars/908392557258604544/5472104b88b4876e3ad06803da45bee6.png",
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C5947C",
        stroke: "#C5947C",
        size: 20,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaefc44862b62edc3037b4",
      name: "Wireframe implementation",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8F6F9",
        stroke: "#49A7CD",
        size: 45,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63ebca723f719753b8adbd22",
      name: "FrontEnd",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#FCF8ED",
        stroke: "#F4BC67",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63ebca723f7197ebd2adbd21",
      name: "Soil",
      type: "Project",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#F9FEE6",
        stroke: "#CBFD50",
        size: 75,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaefeedf71c82f61c177f3",
      name: "Develop REST API",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8F6F9",
        stroke: "#49A7CD",
        size: 45,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63ebca723f7197e22fadbd23",
      name: "BackEnd",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#FCF8ED",
        stroke: "#F4BC67",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
  ],
  edges: [
    {
      source: "908392557258604544",
      target: "63eaefc44862b62edc3037b4",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaefc44862b62edc3037b4",
      target: "63ebca723f719753b8adbd22",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 130,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f719753b8adbd22",
      target: "63ebca723f7197ebd2adbd21",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 90,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "908392557258604544",
      target: "63eaefeedf71c82f61c177f3",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaefeedf71c82f61c177f3",
      target: "63ebca723f7197e22fadbd23",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 130,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f7197e22fadbd23",
      target: "63ebca723f7197ebd2adbd21",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 90,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f7197ebd2adbd21",
      target: "908392557258604544",
      distanceRation: null,
      style: {
        fill: "#FFFFFF",
        stroke: "#FFFFFF",
        distance: 500,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
  ],
  __typename: "Graph",
};

const dataBig = {
  nodesVisual: [
    {
      _id: "961730944170090516",
      name: "Milo",
      type: "Member",
      avatar:
        "https://cdn.discordapp.com/avatars/961730944170090516/e5844ca759a74e995027a0e50c5cb1bf.png",
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C5947C",
        stroke: "#C5947C",
        size: 20,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf0aedf71c82f61c17a8c",
      name: "General PM Support",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "518418233968295940",
      name: "waxy",
      type: "Member",
      avatar:
        "https://cdn.discordapp.com/avatars/518418233968295940/f8c73e47234dc4a365b236ca7e7fc029.png",
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C5947C",
        stroke: "#C5947C",
        size: 20,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "901188444057907310",
      name: "eloigil",
      type: "Member",
      avatar:
        "https://cdn.discordapp.com/avatars/901188444057907310/99a904b9733bf9263feb7a73c7e0608f.png",
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C5947C",
        stroke: "#C5947C",
        size: 20,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63ef46fce8ab5a32b803fe3c",
      name: "My personal project",
      type: "Project",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#FDFFDC",
        stroke: "#FAE289",
        size: 75,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63ef46fce8ab5aceee03fe3e",
      name: "BackEnd Developer",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8FBDA",
        stroke: "#C8F4A4",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "1076290633028861953",
      name: "Oleni",
      type: "Member",
      avatar:
        "https://cdn.discordapp.com/avatars/1076290633028861953/34a16ec81067172e72152fd12166d679.png",
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C5947C",
        stroke: "#C5947C",
        size: 20,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaefb94862b62edc30377a",
      name: "Product Manager",
      type: "expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C2F7FF",
        stroke: "#9AECFE",
        size: 70,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaefebdf71c82f61c177eb",
      name: "Responsive web-apps",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63f1155ccb4c1c8007b09ffa",
      name: "Sweetheart speaker",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8FBDA",
        stroke: "#C8F4A4",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63f1079bcb4c1c71c3b08e2f",
      name: "FrontEnd Developer",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8FBDA",
        stroke: "#C8F4A4",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63ebca723f719753b8adbd22",
      name: "FrontEnd",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8FBDA",
        stroke: "#C8F4A4",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaefb44862b62edc30376e",
      name: "Frontend Developer",
      type: "expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C2F7FF",
        stroke: "#9AECFE",
        size: 70,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf009df71c82f61c1784b",
      name: "Improve Website Performance",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf0a9df71c82f61c17a7c",
      name: "General Frontend Support",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63ef46fce8ab5ae80003fe3d",
      name: "FrontEnd Developer",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8FBDA",
        stroke: "#C8F4A4",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "908392557258604544",
      name: "BluePanda",
      type: "Member",
      avatar:
        "https://cdn.discordapp.com/avatars/908392557258604544/5472104b88b4876e3ad06803da45bee6.png",
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C5947C",
        stroke: "#C5947C",
        size: 20,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaefc44862b62edc3037b4",
      name: "Wireframe implementation",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf0acdf71c82f61c17a84",
      name: "Architect App",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaefb64862b62edc303774",
      name: "Backend Developer",
      type: "expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C2F7FF",
        stroke: "#9AECFE",
        size: 70,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf057df71c82f61c17974",
      name: "Optimize Performance",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf048df71c82f61c17944",
      name: "Debug & Fix",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaefeedf71c82f61c177f3",
      name: "Develop REST API",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63ebca723f7197e22fadbd23",
      name: "BackEnd",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8FBDA",
        stroke: "#C8F4A4",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63ebca723f7197ebd2adbd21",
      name: "Soil",
      type: "Project",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#FDFFDC",
        stroke: "#FAE289",
        size: 75,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63f04f1bcb4c1cc2e0b0680e",
      name: "g3",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8FBDA",
        stroke: "#C8F4A4",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "971147333414842408",
      name: "Nala",
      type: "Member",
      avatar:
        "https://cdn.discordapp.com/avatars/971147333414842408/4af3b2d4f773b0970f9fbc15d7eb7787.png",
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#C5947C",
        stroke: "#C5947C",
        size: 20,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf027df71c82f61c178dc",
      name: "Back-end integration",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf045df71c82f61c1793c",
      name: "Debug, troubleshoot code",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaeffadf71c82f61c1781b",
      name: "Cross-browser compatability",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf063df71c82f61c1799c",
      name: "Animations, transitions",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaf018df71c82f61c178ac",
      name: "Accessibility compliance",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63f1079bcb4c1c57d0b08e2d",
      name: "Gasless blockchain",
      type: "Project",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#FDFFDC",
        stroke: "#FAE289",
        size: 75,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63f1079bcb4c1ce34eb08e2e",
      name: "Blockchain Developer",
      type: "Role",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#E8FBDA",
        stroke: "#C8F4A4",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
    {
      _id: "63eaefc64862b62edc3037bc",
      name: "Provide Backend Support",
      type: "sub_expertise",
      avatar: null,
      fakeID: null,
      originalNode: null,
      extraDistanceRation: null,
      style: {
        fill: "#EBFCFF",
        stroke: "#9AECaE",
        size: 50,
        __typename: "StyleNodeOut",
      },
      __typename: "NodeVisual",
    },
  ],
  edges: [
    {
      source: "961730944170090516",
      target: "63eaf0aedf71c82f61c17a8c",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf0aedf71c82f61c17a8c",
      target: "518418233968295940",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ef46fce8ab5a32b803fe3c",
      target: "63ef46fce8ab5aceee03fe3e",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 90,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "1076290633028861953",
      target: "63eaf0aedf71c82f61c17a8c",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "901188444057907310",
      target: "63eaefebdf71c82f61c177eb",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaefebdf71c82f61c177eb",
      target: "518418233968295940",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1155ccb4c1c8007b09ffa",
      target: "63eaefebdf71c82f61c177eb",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1079bcb4c1c71c3b08e2f",
      target: "63eaefebdf71c82f61c177eb",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f719753b8adbd22",
      target: "63eaefebdf71c82f61c177eb",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "901188444057907310",
      target: "63eaf009df71c82f61c1784b",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf009df71c82f61c1784b",
      target: "518418233968295940",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1155ccb4c1c8007b09ffa",
      target: "63eaf009df71c82f61c1784b",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f719753b8adbd22",
      target: "63eaf009df71c82f61c1784b",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1155ccb4c1c8007b09ffa",
      target: "63eaf0a9df71c82f61c17a7c",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf0a9df71c82f61c17a7c",
      target: "518418233968295940",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1079bcb4c1c71c3b08e2f",
      target: "63eaf0a9df71c82f61c17a7c",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ef46fce8ab5a32b803fe3c",
      target: "63ef46fce8ab5ae80003fe3d",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 90,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "518418233968295940",
      target: "63eaefebdf71c82f61c177eb",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaefebdf71c82f61c177eb",
      target: "901188444057907310",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "518418233968295940",
      target: "63eaf009df71c82f61c1784b",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf009df71c82f61c1784b",
      target: "901188444057907310",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "908392557258604544",
      target: "63eaefc44862b62edc3037b4",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaefc44862b62edc3037b4",
      target: "901188444057907310",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf0acdf71c82f61c17a84",
      target: "908392557258604544",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf057df71c82f61c17974",
      target: "908392557258604544",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ef46fce8ab5aceee03fe3e",
      target: "63eaf048df71c82f61c17944",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf048df71c82f61c17944",
      target: "908392557258604544",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ef46fce8ab5aceee03fe3e",
      target: "63eaefeedf71c82f61c177f3",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaefeedf71c82f61c177f3",
      target: "908392557258604544",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f7197e22fadbd23",
      target: "63eaefeedf71c82f61c177f3",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f7197e22fadbd23",
      target: "63ebca723f7197ebd2adbd21",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 90,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f719753b8adbd22",
      target: "63ebca723f7197ebd2adbd21",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 90,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "908392557258604544",
      target: "63eaf048df71c82f61c17944",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf048df71c82f61c17944",
      target: "63ef46fce8ab5aceee03fe3e",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ef46fce8ab5aceee03fe3e",
      target: "63ef46fce8ab5a32b803fe3c",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 90,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "901188444057907310",
      target: "63eaefc44862b62edc3037b4",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaefc44862b62edc3037b4",
      target: "908392557258604544",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1079bcb4c1c71c3b08e2f",
      target: "63eaefc44862b62edc3037b4",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1155ccb4c1c8007b09ffa",
      target: "63eaefc44862b62edc3037b4",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f719753b8adbd22",
      target: "63eaefc44862b62edc3037b4",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f04f1bcb4c1cc2e0b0680e",
      target: "63eaefc44862b62edc3037b4",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "971147333414842408",
      target: "63eaefc44862b62edc3037b4",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "908392557258604544",
      target: "63eaefeedf71c82f61c177f3",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaefeedf71c82f61c177f3",
      target: "63ef46fce8ab5aceee03fe3e",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "901188444057907310",
      target: "63eaf027df71c82f61c178dc",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf027df71c82f61c178dc",
      target: "63ef46fce8ab5aceee03fe3e",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1155ccb4c1c8007b09ffa",
      target: "63eaf045df71c82f61c1793c",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf045df71c82f61c1793c",
      target: "901188444057907310",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1155ccb4c1c8007b09ffa",
      target: "63eaeffadf71c82f61c1781b",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaeffadf71c82f61c1781b",
      target: "901188444057907310",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1155ccb4c1c8007b09ffa",
      target: "63eaf063df71c82f61c1799c",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf063df71c82f61c1799c",
      target: "901188444057907310",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1155ccb4c1c8007b09ffa",
      target: "63eaf018df71c82f61c178ac",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaf018df71c82f61c178ac",
      target: "901188444057907310",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63ebca723f719753b8adbd22",
      target: "63eaf018df71c82f61c178ac",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 70,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1079bcb4c1c71c3b08e2f",
      target: "63f1079bcb4c1c57d0b08e2d",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 90,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63f1079bcb4c1ce34eb08e2e",
      target: "63f1079bcb4c1c57d0b08e2d",
      distanceRation: 0.5,
      style: {
        fill: "#E0E0E0",
        stroke: "#E0E0E0",
        distance: 90,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
    {
      source: "63eaefc64862b62edc3037bc",
      target: "901188444057907310",
      distanceRation: 0.5,
      style: {
        fill: "#F4F6F8",
        stroke: "#F4F6F8",
        distance: 200,
        strength: 0.5,
        __typename: "StyleEdgeOut",
      },
      __typename: "Edge",
    },
  ],
  __typename: "Graph",
};
