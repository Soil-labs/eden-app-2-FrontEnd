import { AppUserLayout } from "@eden/package-ui";
import dynamic from "next/dynamic";

import MenuOption from "./MenuOption";
const G6component = dynamic(
  () => import("../../../src/components/G6component"),
  {
    ssr: false,
  }
);

import { gql, useQuery } from "@apollo/client";
import React, { RefObject, useEffect, useRef, useState } from "react";

const FIND_MEMBER_GRAPH = gql`
  query ($fields: findMemberGraphInput!) {
    findMemberGraph(fields: $fields) {
      nodes {
        _id
        name
        type
        avatar
        originalNode
        extraDistanceRation
      }
      edges {
        source
        target
        distanceRation
      }
    }
  }
`;

const FIND_MEMBER_PROJECT_GRAPH = gql`
  query ($fields: findMemberToProjectGraphInput!) {
    findMemberToProjectGraph(fields: $fields) {
      nodes {
        _id
        name
        type
        avatar
        originalNode
        extraDistanceRation
      }
      edges {
        source
        target
        distanceRation
      }
    }
  }
`;

const FIND_PROJECT_GRAPH = gql`
  query ($fields: findProjectGraphInput!) {
    findProjectGraph(fields: $fields) {
      nodes {
        _id
        name
        type
        avatar
        originalNode
        extraDistanceRation
      }
      edges {
        source
        target
        distanceRation
      }
    }
  }
`;

const FIND_MULTIPLE_MEMBERS_PROJECTS_GRAPH = gql`
  query ($fields: findMultipleMembersProjectsGraphInput!) {
    findMultipleMembersProjectsGraph(fields: $fields) {
      nodes {
        _id
        name
        type
        avatar
        # originalNode
        # extraDistanceRation
      }
      edges {
        source
        target
        # distanceRation
      }
    }
  }
`;

// import React, { useEffect, useState } from "react";
// import { NextPageWithLayout } from "../../_app";

interface Node {
  id: string;
  size: number;
  label?: string;
  style?: {
    fill: string;
    stroke: string;
    lineWidth: number;
  };
}

interface DataState {
  nodes: Node[];
  edges: { source: string; target: string }[];
}

const data2: any = {
  nodes: [
    {
      id: "node0",
      size: 80,
      x: 5,
      y: 5,
      label: "eloi",
      // style: {
      //   fill: "#bae637",
      //   stroke: "#eaff8f",
      //   lineWidth: 5,
      // },

      // // ----------- Shwow Avatar User ---------
      // type: "image",
      // img: "https://cdn.discordapp.com/avatars/961730944170090516/e5844ca759a74e995027a0e50c5cb1bf.png",
      // clipCfg: {
      //   show: true,
      //   type: "circle",
      //   r: 25,
      // },
      // style: {
      //   height: 50,
      //   width: 50,
      // },
      // // ----------- Shwow Avatar User ---------
    },
    { id: "node1", x: 100, y: 150, size: 50, label: "sbelka" },
    { id: "node2", x: 10, y: 10, size: 50, label: "waxy" },
    { id: "node3", x: 20, y: 10, size: 50, label: "figma" },
    { id: "node4", x: 30, y: 10, size: 50, label: "UX" },
    { id: "node5", x: 40, y: 10, size: 50, label: "ImpactBilli" },
    { id: "node6", x: 500, y: 100, size: 30 },
    { id: "node7", x: 600, y: 100, size: 30 },
    { id: "node8", x: 700, y: 100, size: 30 },
    { id: "node9", x: 800, y: 100, size: 30 },
    { id: "node10", x: 900, y: 100, size: 30 },
    { id: "node11", x: 1000, y: 100, size: 30 },
  ],
  edges: [
    { source: "node0", target: "node1" },
    { source: "node0", target: "node2" },
    { source: "node0", target: "node3" },
    { source: "node0", target: "node4" },
    { source: "node0", target: "node5" },
    { source: "node1", target: "node6" },
    { source: "node1", target: "node7" },
    { source: "node2", target: "node8" },
    { source: "node2", target: "node9" },
    { source: "node9", target: "node10" },
    { source: "node9", target: "node11" },
  ],
};

const TestPage = () => {
  const refContainer = useRef<HTMLDivElement>();

  const [width, setWidth] = useState<number>(0);

  const [selectedOption, setSelectedOption] = useState<string>("Option 1");
  const [settingsGraphs, setSettingsGraphs] = useState<any>({
    useAvatar: true,
    updateGraph: false,
    memberID1: "961730944170090516",
    projectID1: "637ad5a6f0f9c427e03a03a8",
    // memberID1: "908392557258604544",
    // projectID1: "637ad5a6f0f9c427e03a03a8",
  });
  const updateSettings = (settingsNew: any) => {
    setSettingsGraphs({
      ...settingsNew,
      updateGraph: false,
    });
    // console.log("settingsNew = ", settingsNew);

    if (settingsNew.updateGraph == true) {
      updateGraph(settingsNew);
    }

    // refetchDataGraphAPImember();
  };

  // create a function that handle a click and will pass on G6component component

  const { data: dataGraphAPImember } = useQuery(FIND_MEMBER_GRAPH, {
    variables: {
      fields: {
        memberID: settingsGraphs.memberID1,
        showAvatar: true,
      },
    },
    context: { serviceName: "soilservice" },
  });

  const { data: dataGraphAPImemberProject } = useQuery(
    FIND_MEMBER_PROJECT_GRAPH,
    {
      variables: {
        fields: {
          memberID: settingsGraphs.memberID1,
          projectID: settingsGraphs.projectID1,
          showAvatar: true,
        },
      },
      context: { serviceName: "soilservice" },
    }
  );

  const { data: dataGraphAPIProject } = useQuery(FIND_PROJECT_GRAPH, {
    variables: {
      fields: {
        projectID: settingsGraphs.projectID1,
        showAvatar: true,
      },
    },
    context: { serviceName: "soilservice" },
  });

  const { data: dataGraphAPIMultipleMembersProjects } = useQuery(
    FIND_MULTIPLE_MEMBERS_PROJECTS_GRAPH,
    {
      variables: {
        fields: {
          membersID: [
            // "730282901576482826",
            "935999176393781258",
            "908392557258604544",
          ],
          projectsID: [
            "63c6ca5de3538042bff317fb",
            "63b21094de31eaa8c95d27e2",
            "63b7fb9703003f7d3efd07d3",
          ],
          showAvatar: true,
        },
      },
      context: { serviceName: "soilservice" },
    }
  );

  const updateGraph = (settingsGraphNow: any) => {
    let dataGraphAPI;

    if (selectedOption == "Option 1") {
      if (settingsGraphNow.useAvatar == true) {
        data2.nodes[0] = {
          ...data2.nodes[0],
          // ----------- Shwow Avatar User ---------
          type: "image",
          img: "https://cdn.discordapp.com/avatars/961730944170090516/e5844ca759a74e995027a0e50c5cb1bf.png",
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
      } else {
        data2.nodes[0] = {
          ...data2.nodes[0],
          // ----------- Shwow Avatar User ---------
          type: "",
          img: "",
          clipCfg: {},
          style: {},
          // ----------- Shwow Avatar User ---------
        };
      }
      setData({
        nodes: data2.nodes,
        edges: data2.edges,
      });
    } else if (
      selectedOption == "Option 2" &&
      dataGraphAPImemberProject &&
      dataGraphAPImemberProject.findMemberToProjectGraph
    ) {
      dataGraphAPI = dataGraphAPImemberProject.findMemberToProjectGraph;
    } else if (
      selectedOption == "Option 3" &&
      dataGraphAPImember &&
      dataGraphAPImember.findMemberGraph
    ) {
      dataGraphAPI = dataGraphAPImember.findMemberGraph;
    } else if (
      selectedOption == "Option 4" &&
      dataGraphAPIProject &&
      dataGraphAPIProject.findProjectGraph
    ) {
      dataGraphAPI = dataGraphAPIProject.findProjectGraph;
    } else if (
      selectedOption == "Option 5" &&
      dataGraphAPIMultipleMembersProjects &&
      dataGraphAPIMultipleMembersProjects.findMultipleMembersProjectsGraph
    ) {
      dataGraphAPI =
        dataGraphAPIMultipleMembersProjects.findMultipleMembersProjectsGraph;
    }

    if (dataGraphAPI != undefined && selectedOption != "Option 1") {
      const nodeDataObj: any = {};
      const edgesDataGraph = dataGraphAPI.edges.map(
        (edge: { source: any; target: any; distanceRation: any }) => {
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
          };
        }
      );

      // console.log("edgesDataGraph = ", edgesDataGraph);

      let nodesDataGraph = dataGraphAPI.nodes.map(
        (node: {
          _id: any;
          name: any;
          type: string;
          avatar: string;
          extraDistanceRation: Number;
        }) => {
          let extraStyle = {};

          // if (node._id == "637a914ab8953f12f501e1ca") {
          //   // extraStyle = {
          //   //   disabledNode: true,
          //   // };
          // }

          // console.log(
          //   "change = ",
          //   settingsGraphNow.useAvatar,
          //   node.avatar,
          //   node
          // );
          if (settingsGraphNow.useAvatar == true && node.avatar != undefined) {
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
            // if (node._id == "961730944170090516") {
            //   extraStyle = {
            //     ...extraStyle,
            //     x: 100,
            //     y: 100,
            //   };
            // }
          }
          if (settingsGraphNow.useAvatar == false && node.avatar != undefined) {
            extraStyle = {
              // ----------- Shwow Avatar User ---------
              type: node.type,
              // img: "",
              clipCfg: {},
              style: {},
              // ----------- Shwow Avatar User ---------
            };
          }

          // console.log("node = ", node);
          // if (node._id == "961730944170090516") {
          //   console.log("change = ----------", extraStyle);
          // }

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
            ...extraStyle,
          };
        }
      );

      if (nodesDataGraph.length == 0) {
        nodesDataGraph = [{ id: "node1", size: 50 }];
      }

      setData({
        nodes: nodesDataGraph,
        edges: edgesDataGraph,
      });
    }
  };

  useEffect(() => {
    updateGraph(settingsGraphs);
  }, [selectedOption]);
  // }, [dataGraphAPImember, dataGraphAPImemberProject, selectedOption]);

  // const [data, setData] = React.useState<DataState>(data2);
  const [data, setData] = React.useState<DataState>({
    nodes: [{ id: "node1", size: 50 }],
    edges: [],
  });

  // const [disable]

  useEffect(() => {
    const getwidth = () => {
      setWidth(refContainer.current?.offsetWidth!);
    };

    // when the component gets mounted
    setWidth(refContainer.current?.offsetWidth!);

    // to handle page resize
    window.addEventListener("resize", getwidth);
    // remove the event listener before the component gets unmounted
    return () => window.removeEventListener("resize", getwidth);
  }, []);

  return (
    <>
      {/* {data && data.nodes && data.nodes.length > 0 ? (
        <G6component data2={data} handleClick={handleClick} />
      ) : (
        <p>Don't have Graph Data Yet</p>
      )} */}
      <div
        style={{
          flexDirection: "column",
          alignItems: "center",
          padding: "10",
          width: "100%",
        }}
      >
        <div
        // className="fixed-top top-0 left-0 z-50 h-16 w-full bg-white"
        // style={{ height: "500", width: "500" }}
        >
          <MenuOption
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            settingsGraphs={settingsGraphs}
            updateSettings={updateSettings}
          />
        </div>
        <div
          className={`flex h-screen w-full gap-4`}
          // style={{
          //   flexDirection: "column",
          //   alignItems: "center",
          //   padding: "10",
          // }}
        >
          <div
            className={`h-screen 
            px-2 py-1 text-center`}
          ></div>
          {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          width: "100%",
          padding: "10",
        }}
        style={{
          flexDirection: "column",
          alignItems: "center",
          padding: "10",
        }}
      > */}

          {refContainer && (
            <div
              className="w-full"
              ref={refContainer as RefObject<HTMLDivElement>}
            >
              {data && data.nodes && data.nodes.length > 0 ? (
                <G6component
                  width={width}
                  height={refContainer.current?.offsetHeight!}
                  // height={500}
                  // height={(1.3 * width) / 4}
                  data2={data}
                  // data2={data2}
                  // handleClick={handleClick}
                />
              ) : (
                <p>Dont have Graph Data Yet</p>
              )}
            </div>
          )}
        </div>
      </div>
      {/* {dataGraphAPImember &&
      dataGraphAPImember.findMemberGraph &&
      dataGraphAPImember.findMemberGraph.nodes &&
      dataGraphAPImember.findMemberGraph.nodes.length > 0 ? (
        <G6component
          data2={dataGraphAPImember.findMemberGraph}
          handleClick={handleClick}
        />
      ) : (
        <p>Don't have Graph Data Yet</p>
      )} */}
    </>
  );
};

TestPage.getLayout = (
  page:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined
) => <AppUserLayout>{page}</AppUserLayout>;

export default TestPage;
