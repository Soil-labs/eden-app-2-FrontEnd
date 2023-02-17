import { gql, useQuery } from "@apollo/client";
import { Edge, Maybe, NodeVisual } from "@eden/package-graphql/generated";
import { edgeSettingsPreset } from "@eden/package-ui/g6/GraphVisual/data/edgeSettingsPreset";
import { nodeSettingsPreset } from "@eden/package-ui/g6/GraphVisual/data/nodeSettingsPreset";
import dynamic from "next/dynamic";
import React, { RefObject, useEffect, useRef, useState } from "react";

import type { NextPageWithLayout } from "../../_app";
// import MemberToProjectGraph from "./MemberToProjectGraph";
import MenuOption from "./MenuOption";

const FIND_MEMBER_GRAPH = gql`
  query ($fields: findMemberGraphInput!) {
    findMemberGraph(fields: $fields) {
      nodesVisual {
        _id
        name
        type
        avatar
        fakeID
        originalNode
        extraDistanceRation
        style {
          fill
          stroke
          size
        }
      }
      edges {
        source
        target
        distanceRation
        style {
          fill
          stroke
          distance
          strength
        }
      }
    }
  }
`;

const FIND_MEMBER_PROJECT_GRAPH = gql`
  query ($fields: findMemberToProjectGraphInput!) {
    findMemberToProjectGraph(fields: $fields) {
      nodesVisual {
        _id
        name
        type
        avatar
        fakeID
        originalNode
        extraDistanceRation
        style {
          fill
          stroke
          size
        }
      }
      edges {
        source
        target
        distanceRation
        style {
          fill
          stroke
          distance
          strength
        }
      }
    }
  }
`;

const FIND_PROJECT_GRAPH = gql`
  query ($fields: findProjectGraphInput!) {
    findProjectGraph(fields: $fields) {
      nodesVisual {
        _id
        name
        type
        avatar
        fakeID
        originalNode
        extraDistanceRation
        style {
          fill
          stroke
          size
        }
      }
      edges {
        source
        target
        distanceRation
        style {
          fill
          stroke
          distance
          strength
        }
      }
    }
  }
`;

const FIND_MULTIPLE_MEMBERS_PROJECTS_GRAPH = gql`
  query ($fields: findMultipleMembersProjectsGraphInput!) {
    findMultipleMembersProjectsGraph(fields: $fields) {
      nodesVisual {
        _id
        name
        type
        avatar
        fakeID
        originalNode
        extraDistanceRation
        style {
          fill
          stroke
          size
        }
      }
      edges {
        source
        target
        distanceRation
        style {
          fill
          stroke
          distance
          strength
        }
      }
    }
  }
`;

const DYNAMIC_SEARCH_TO_PROJECT_GRAPH = gql`
  query ($fields: dynamicSearchToProjectGraphInput!) {
    dynamicSearchToProjectGraph(fields: $fields) {
      nodesVisual {
        _id
        name
        type
        avatar
        fakeID
        originalNode
        extraDistanceRation
        style {
          fill
          stroke
          size
        }
      }
      edges {
        source
        target
        distanceRation
        style {
          fill
          stroke
          distance
          strength
        }
      }
    }
  }
`;

const DYNAMIC_SEARCH_GRAPH = gql`
  query ($fields: dynamicSearchGraphInput!) {
    dynamicSearchGraph(fields: $fields) {
      nodesVisual {
        _id
        name
        type
        avatar
        fakeID
        originalNode
        extraDistanceRation
        style {
          fill
          stroke
          size
        }
      }
      edges {
        source
        target
        distanceRation
        style {
          fill
          stroke
          distance
          strength
        }
      }
    }
  }
`;

const DYNAMIC_SEARCH_TO_MEMBER_GRAPH = gql`
  query ($fields: dynamicSearchToMemberGraphInput!) {
    dynamicSearchToMemberGraph(fields: $fields) {
      nodesVisual {
        _id
        name
        type
        avatar
        fakeID
        originalNode
        extraDistanceRation
        style {
          fill
          stroke
          size
        }
      }
      edges {
        source
        target
        distanceRation
        style {
          fill
          stroke
          distance
          strength
        }
      }
    }
  }
`;

interface clipCfg {
  show?: boolean;
  type?: string;
  r?: number;
}

interface style {
  fill?: string;
  stroke?: string;
  height?: number;
  width?: number;
}

export interface NodeVisualExtended extends NodeVisual {
  id?: string;
  x?: number;
  y?: number;
  size: number;
  label?: string;
  img?: string;
  clipCfg?: clipCfg;
  style?: style;
}

export interface Graph {
  edges: Maybe<Array<Maybe<Edge>>>;
  nodes: Array<Maybe<NodeVisualExtended>>;
}

const data2: any = {
  nodesVisual: [
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
    { id: "node11", x: 1000, y: 100, size: 30, label: "far" },
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
    {
      source: "node0",
      target: "node11",
      style: {
        stroke: "#FFFFFF",
      },
      size: 10,
    },
  ],
};

const GraphVisual = dynamic(
  () => import("@eden/package-ui/g6/GraphVisual/GraphVisual"),
  {
    ssr: false,
  }
);

const GraphVisualPage: NextPageWithLayout = () => {
  const refContainer = useRef<HTMLDivElement>();

  const [width, setWidth] = useState<number>(0);

  const updateSettings = (settingsNew: any) => {
    setSettingsGraphs({
      ...settingsNew,
      updateGraph: false,
    });

    updateSettingsGraph({
      ...settingsNew,
      updateGraph: false,
    });
  };

  // create a function that handle a click and will pass on G6component component

  const [nodeEdgeSettingsGraph] = useState<any>({
    dataGraphAPImember: {
      simple: {
        nodeSettings: [
          nodeSettingsPreset["Member"]["main"],
          nodeSettingsPreset["typeProject"]["main"],
          nodeSettingsPreset["expertise"]["main"],
        ],
        edgeSettings: [
          // ------ split sub_typeProject|Member -------
          edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
          edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          edgeSettingsPreset["typeProject|Member"]["edge"],
          // ------ split sub_typeProject|Member -------

          // ------ split skill|Member -------
          edgeSettingsPreset["skill|Member"]["doubleSplitEdge"],
          // edgeSettingsPreset["skill|Member"]["edge"],
          edgeSettingsPreset["skill|sub_expertise"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // ------ split skill|Member -------

          // ------ split sub_expertise|Member -------
          edgeSettingsPreset["sub_expertise|Member"]["expertise"],
          edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          edgeSettingsPreset["expertise|Member"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // ------ split sub_expertise|Member -------
        ],
      },
      detailed: {
        nodeSettings: [
          nodeSettingsPreset["Member"]["main"],
          nodeSettingsPreset["sub_typeProject"]["main"],
          nodeSettingsPreset["typeProject"]["main"],
          nodeSettingsPreset["sub_expertise"]["main"],
          nodeSettingsPreset["expertise"]["main"],
          nodeSettingsPreset["skill"]["main"],
        ],
        edgeSettings: [
          // ------ split sub_typeProject|Member -------
          edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
          edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          edgeSettingsPreset["typeProject|Member"]["edge"],
          // ------ split sub_typeProject|Member -------

          // ------ split skill|Member -------
          edgeSettingsPreset["skill|Member"]["doubleSplitEdge"],
          // edgeSettingsPreset["skill|Member"]["edge"],
          edgeSettingsPreset["skill|sub_expertise"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // ------ split skill|Member -------

          // ------ split sub_expertise|Member -------
          edgeSettingsPreset["sub_expertise|Member"]["expertise"],
          edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          edgeSettingsPreset["expertise|Member"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // ------ split sub_expertise|Member -------
        ],
      },
    },
    dataGraphAPImemberProject: {
      simple: {
        nodeSettings: [
          nodeSettingsPreset["Member"]["main"],
          nodeSettingsPreset["sub_typeProject"]["main"],
          // nodeSettingsPreset["typeProject"]["main"],
          nodeSettingsPreset["sub_expertise"]["main"],
          // nodeSettingsPreset["expertise"]["main"],
          nodeSettingsPreset["Project"]["main"],
          nodeSettingsPreset["Role"]["main"],
          // nodeSettingsPreset["skill"]["main"],
        ],
        edgeSettings: [
          // ------ split sub_typeProject|Member -------
          edgeSettingsPreset["sub_typeProject|Member"]["edge"],
          // edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
          // edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          // edgeSettingsPreset["typeProject|Member"]["edge"],
          // ------ split sub_typeProject|Member -------

          // ------ split sub_expertise|Member -------
          edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["expertise"],
          // edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          // edgeSettingsPreset["expertise|Member"]["edge"],
          // ------ split sub_expertise|Member -------

          // ------ Project Edges -------
          edgeSettingsPreset["Project|Role"]["edge"],
          edgeSettingsPreset["sub_expertise|Role"]["edge"],
          edgeSettingsPreset["sub_typeProject|Role"]["edge"],
          edgeSettingsPreset["skill|Role"]["edge"],
          // ------ Project Edges -------

          // // ------ skill Edges -------
          // edgeSettingsPreset["skill|Member"]["edge"],
          edgeSettingsPreset["skill|Member"]["doubleSplitEdge"],
          edgeSettingsPreset["skill|sub_expertise"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // // ------ skill Edges -------

          //  ------ Create Far Distance between member and project ------
          edgeSettingsPreset["Project|Member"]["hiddenEdge"],
          edgeSettingsPreset["typeProject|expertise"]["hiddenEdge"],
          edgeSettingsPreset["Role|expertise"]["hiddenEdge"],
          edgeSettingsPreset["Role|typeProject"]["hiddenEdge"],
          //  ------ Create Far Distance between member and project ------
        ],
      },
      detailed: {
        nodeSettings: [
          nodeSettingsPreset["Member"]["main"],
          nodeSettingsPreset["sub_typeProject"]["main"],
          nodeSettingsPreset["typeProject"]["main"],
          nodeSettingsPreset["sub_expertise"]["main"],
          nodeSettingsPreset["expertise"]["main"],
          nodeSettingsPreset["Project"]["main"],
          nodeSettingsPreset["Role"]["main"],
          nodeSettingsPreset["skill"]["main"],
        ],
        edgeSettings: [
          // ------ split sub_typeProject|Member -------
          edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
          edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          edgeSettingsPreset["typeProject|Member"]["edge"],
          // ------ split sub_typeProject|Member -------

          // ------ split sub_expertise|Member -------
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          edgeSettingsPreset["sub_expertise|Member"]["expertise"],
          edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          edgeSettingsPreset["expertise|Member"]["edge"],
          // ------ split sub_expertise|Member -------

          // ------ Project Edges -------
          edgeSettingsPreset["Project|Role"]["edge"],
          edgeSettingsPreset["sub_expertise|Role"]["edge"],
          edgeSettingsPreset["sub_typeProject|Role"]["edge"],
          edgeSettingsPreset["skill|Role"]["edge"],
          // ------ Project Edges -------

          // // ------ skill Edges -------
          // edgeSettingsPreset["skill|Member"]["edge"],
          edgeSettingsPreset["skill|Member"]["doubleSplitEdge"],
          edgeSettingsPreset["skill|sub_expertise"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // // ------ skill Edges -------

          //  ------ Create Far Distance between member and project ------
          edgeSettingsPreset["Project|Member"]["hiddenEdge"],
          edgeSettingsPreset["typeProject|expertise"]["hiddenEdge"],
          edgeSettingsPreset["Role|expertise"]["hiddenEdge"],
          edgeSettingsPreset["Role|typeProject"]["hiddenEdge"],
          //  ------ Create Far Distance between member and project ------
        ],
      },
    },
  });

  const [selectedOption, setSelectedOption] = useState<string>("Option 3");

  const [settingsGraphs, setSettingsGraphs] = useState<any>({
    useAvatar: true,
    updateGraph: false,
    memberID1: "961730944170090516",
    projectID1: "637ad5a6f0f9c427e03a03a8",
    // memberID1: "908392557258604544",
    // projectID1: "637ad5a6f0f9c427e03a03a8",
    simpleDetail: "simple",
    nodesID: ["637a9137b8953f12f501e156", "637a9134b8953f12f501e0f7"],
    // nodesID: ["637a9137b8953f12f501e156", "637a913ab8953f12f501e190"],
    // nodesID: [
    //   "637a9135b8953f12f501e118",
    //   "637a9134b8953f12f501e0f7",
    //   "637a9151b8953f12f501e2aa",
    //   "637a913fb8953f12f501e1af",
    //   "63d1ad93a90f12cef67a7c7b",
    // ],
    nodePresetPos: 1,
    nodeSettings:
      nodeEdgeSettingsGraph.dataGraphAPImember.detailed.nodeSettings,
    edgeSettings:
      nodeEdgeSettingsGraph.dataGraphAPImember.detailed.edgeSettings,
  });

  const updateSettingsGraph = (settingsGraphs: any) => {
    const simpleDetail = settingsGraphs.simpleDetail;

    if (selectedOption == "Option 2") {
      setSettingsGraphs({
        ...settingsGraphs,
        nodeSettings:
          nodeEdgeSettingsGraph.dataGraphAPImemberProject[simpleDetail]
            .nodeSettings,
        edgeSettings:
          nodeEdgeSettingsGraph.dataGraphAPImemberProject[simpleDetail]
            .edgeSettings,
      });
    } else if (selectedOption == "Option 3") {
      setSettingsGraphs({
        ...settingsGraphs,
        nodeSettings:
          nodeEdgeSettingsGraph.dataGraphAPImember[simpleDetail].nodeSettings,
        edgeSettings:
          nodeEdgeSettingsGraph.dataGraphAPImember[simpleDetail].edgeSettings,
      });
    } else if (selectedOption == "Option 4") {
    } else if (selectedOption == "Option 5") {
    }
  };

  useEffect(() => {
    updateSettingsGraph(settingsGraphs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption]);
  // }, [selectedOption, settingsGraphs]);

  const { data: dataGraphAPImember } = useQuery(FIND_MEMBER_GRAPH, {
    variables: {
      fields: {
        memberID: settingsGraphs.memberID1,
        showAvatar: true,
        nodeSettings: settingsGraphs.nodeSettings,
        edgeSettings: settingsGraphs.edgeSettings,
        // ...nodeEdgeSettingsGraph.dataGraphAPImember.detailed,
        // nodeSettings: [
        //   nodeSettingsPreset["Member"]["main"],
        //   nodeSettingsPreset["sub_typeProject"]["main"],
        //   nodeSettingsPreset["typeProject"]["main"],
        //   nodeSettingsPreset["sub_expertise"]["main"],
        //   nodeSettingsPreset["expertise"]["main"],
        //   nodeSettingsPreset["skill"]["main"],
        // ],
        // edgeSettings: [
        //   // ------ split sub_typeProject|Member -------
        //   edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
        //   edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
        //   edgeSettingsPreset["typeProject|Member"]["edge"],
        //   // ------ split sub_typeProject|Member -------

        // // ------ split skill|Member -------
        // edgeSettingsPreset["skill|Member"]["doubleSplitEdge"],
        // // edgeSettingsPreset["skill|Member"]["edge"],
        // edgeSettingsPreset["skill|sub_expertise"]["edge"],
        // // edgeSettingsPreset["sub_expertise|Member"]["edge"],
        // // ------ split skill|Member -------

        //   // ------ split sub_expertise|Member -------
        //   edgeSettingsPreset["sub_expertise|Member"]["expertise"],
        //   edgeSettingsPreset["sub_expertise|expertise"]["edge"],
        //   edgeSettingsPreset["expertise|Member"]["edge"],
        //   // edgeSettingsPreset["sub_expertise|Member"]["edge"],
        //   // ------ split sub_expertise|Member -------

        //   // ------ Change edge --------
        //   // {
        //   //   ...edgeSettingsPreset["typeProject|Member"]["edge"],
        //   //   mainEdge: {
        //   //     ...edgeSettingsPreset["typeProject|Member"]["edge"].mainEdge,
        //   //     style: {
        //   //       color: "#C5947C",
        //   //     },
        //   //   },
        //   // },
        //   // ------ Change edge --------
        // ],
      },
    },
    skip: selectedOption !== "Option 3",
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

          nodeSettings: settingsGraphs.nodeSettings,
          edgeSettings: settingsGraphs.edgeSettings,
          // nodeSettings: [
          //   nodeSettingsPreset["Member"]["main"],
          //   nodeSettingsPreset["sub_typeProject"]["main"],
          //   nodeSettingsPreset["typeProject"]["main"],
          //   nodeSettingsPreset["sub_expertise"]["main"],
          //   nodeSettingsPreset["expertise"]["main"],
          //   nodeSettingsPreset["Project"]["main"],
          //   nodeSettingsPreset["Role"]["main"],
          //   nodeSettingsPreset["skill"]["main"],
          // ],
          // edgeSettings: [
          //   // ------ split sub_typeProject|Member -------
          //   edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
          //   edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          //   edgeSettingsPreset["typeProject|Member"]["edge"],
          //   // ------ split sub_typeProject|Member -------

          //   // ------ split sub_expertise|Member -------
          //   // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          //   edgeSettingsPreset["sub_expertise|Member"]["expertise"],
          //   edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          //   edgeSettingsPreset["expertise|Member"]["edge"],
          //   // ------ split sub_expertise|Member -------

          //   // ------ Project Edges -------
          //   edgeSettingsPreset["Project|Role"]["edge"],
          //   edgeSettingsPreset["sub_expertise|Role"]["edge"],
          //   edgeSettingsPreset["sub_typeProject|Role"]["edge"],
          //   edgeSettingsPreset["skill|Role"]["edge"],
          //   // ------ Project Edges -------

          //   // // ------ skill Edges -------
          //   // edgeSettingsPreset["skill|Member"]["edge"],
          //   edgeSettingsPreset["skill|Member"]["doubleSplitEdge"],
          //   edgeSettingsPreset["skill|sub_expertise"]["edge"],
          //   // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          //   // // ------ skill Edges -------

          //   // // ------ split sub_expertise|Role -------
          //   // edgeSettingsPreset["sub_expertise|Role"]["expertise"],
          //   // edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          //   // edgeSettingsPreset["expertise|Role"]["edge"],
          //   // // ------ split sub_expertise|Role -------

          //   //  ------ Create Far Distance between member and project ------
          //   edgeSettingsPreset["Project|Member"]["hiddenEdge"],
          //   edgeSettingsPreset["typeProject|expertise"]["hiddenEdge"],
          //   edgeSettingsPreset["Role|expertise"]["hiddenEdge"],
          //   edgeSettingsPreset["Role|typeProject"]["hiddenEdge"],
          //   //  ------ Create Far Distance between member and project ------
          // ],
        },
      },
      skip: selectedOption !== "Option 2",
      context: { serviceName: "soilservice" },
    }
  );

  const {
    data: dataDynamicSearchToProject,
    refetch: refetchDynamicSearchToProject,
  } = useQuery(DYNAMIC_SEARCH_TO_PROJECT_GRAPH, {
    variables: {
      fields: {
        // memberID: settingsGraphs.memberID1,
        // nodesID: [
        //   // "637a9133b8953f12f501e0d6",
        //   "637a9135b8953f12f501e118",
        //   "637a9134b8953f12f501e0f7",
        //   "637a914ab8953f12f501e1ca",
        //   "637a9151b8953f12f501e2aa",
        //   "637a913fb8953f12f501e1af",
        //   "63d1ad93a90f12cef67a7c7b",
        // ],
        nodesID: settingsGraphs.nodesID,
        projectID: settingsGraphs.projectID1,
        showAvatar: true,

        nodeSettings: [
          // nodeSettingsPreset["Member"]["main"],
          nodeSettingsPreset["dynamicSearch"]["main"],
          nodeSettingsPreset["sub_typeProject"]["main"],
          nodeSettingsPreset["typeProject"]["main"],
          nodeSettingsPreset["sub_expertise"]["main"],
          nodeSettingsPreset["expertise"]["main"],
          nodeSettingsPreset["Project"]["main"],
          nodeSettingsPreset["Role"]["main"],
          // nodeSettingsPreset["skill"]["main"],
        ],
        edgeSettings: [
          // ------ split sub_typeProject|dynamicSearch -------
          edgeSettingsPreset["sub_typeProject|dynamicSearch"]["typeProject"],
          edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          edgeSettingsPreset["typeProject|dynamicSearch"]["edge"],
          // ------ split sub_typeProject|dynamicSearch -------

          // ------ split sub_expertise|dynamicSearch -------
          // edgeSettingsPreset["sub_expertise|dynamicSearch"]["edge"],
          edgeSettingsPreset["sub_expertise|dynamicSearch"]["expertise"],
          edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          edgeSettingsPreset["expertise|dynamicSearch"]["edge"],
          // ------ split sub_expertise|dynamicSearch -------

          // ------ Project Edges -------
          edgeSettingsPreset["Project|Role"]["edge"],
          edgeSettingsPreset["sub_expertise|Role"]["edge"],
          edgeSettingsPreset["sub_typeProject|Role"]["edge"],
          // edgeSettingsPreset["skill|Role"]["edge"],
          // ------ Project Edges -------

          // // // ------ skill Edges -------
          // // edgeSettingsPreset["skill|dynamicSearch"]["edge"],
          // edgeSettingsPreset["skill|dynamicSearch"]["doubleSplitEdge"],
          // edgeSettingsPreset["skill|sub_expertise"]["edge"],
          // // edgeSettingsPreset["sub_expertise|dynamicSearch"]["edge"],
          // // // ------ skill Edges -------

          // // ------ split sub_expertise|Role -------
          // edgeSettingsPreset["sub_expertise|Role"]["expertise"],
          // edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          // edgeSettingsPreset["expertise|Role"]["edge"],
          // // ------ split sub_expertise|Role -------

          //  ------ Create Far Distance between member and project ------
          edgeSettingsPreset["Project|dynamicSearch"]["hiddenEdge"],
          edgeSettingsPreset["typeProject|expertise"]["hiddenEdge"],
          edgeSettingsPreset["Role|expertise"]["hiddenEdge"],
          edgeSettingsPreset["Role|typeProject"]["hiddenEdge"],
          //  ------ Create Far Distance between member and project ------
        ],
      },
    },
    skip: selectedOption !== "Option 6",
    context: { serviceName: "soilservice" },
  });

  const { data: dataDynamicSearch, refetch: refetchDynamicSearch } = useQuery(
    DYNAMIC_SEARCH_GRAPH,
    {
      variables: {
        fields: {
          nodesID: settingsGraphs.nodesID,
          showAvatar: true,

          nodeSettings: [
            // nodeSettingsPreset["Member"]["main"],
            nodeSettingsPreset["dynamicSearch"]["main"],
            nodeSettingsPreset["sub_typeProject"]["main"],
            nodeSettingsPreset["typeProject"]["main"],
            nodeSettingsPreset["sub_expertise"]["main"],
            nodeSettingsPreset["expertise"]["main"],
            // nodeSettingsPreset["Project"]["main"],
            // nodeSettingsPreset["Role"]["main"],
            // nodeSettingsPreset["skill"]["main"],
          ],
          edgeSettings: [
            // // ------ split sub_typeProject|dynamicSearch -------
            edgeSettingsPreset["sub_typeProject|dynamicSearch"]["typeProject"],
            edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
            edgeSettingsPreset["typeProject|dynamicSearch"]["edge"],
            // // ------ split sub_typeProject|dynamicSearch -------

            // ------ split sub_expertise|dynamicSearch -------
            // edgeSettingsPreset["sub_expertise|dynamicSearch"]["edge"],
            edgeSettingsPreset["sub_expertise|dynamicSearch"]["expertise"],
            edgeSettingsPreset["sub_expertise|expertise"]["edge"],
            edgeSettingsPreset["expertise|dynamicSearch"]["edge"],
            // ------ split sub_expertise|dynamicSearch -------

            // // ------ Project Edges -------
            // edgeSettingsPreset["Project|Role"]["edge"],
            // edgeSettingsPreset["sub_expertise|Role"]["edge"],
            // edgeSettingsPreset["sub_typeProject|Role"]["edge"],
            // // edgeSettingsPreset["skill|Role"]["edge"],
            // // ------ Project Edges -------

            // // // ------ skill Edges -------
            // // edgeSettingsPreset["skill|dynamicSearch"]["edge"],
            // edgeSettingsPreset["skill|dynamicSearch"]["doubleSplitEdge"],
            // edgeSettingsPreset["skill|sub_expertise"]["edge"],
            // // edgeSettingsPreset["sub_expertise|dynamicSearch"]["edge"],
            // // // ------ skill Edges -------

            // // ------ split sub_expertise|Role -------
            // edgeSettingsPreset["sub_expertise|Role"]["expertise"],
            // edgeSettingsPreset["sub_expertise|expertise"]["edge"],
            // edgeSettingsPreset["expertise|Role"]["edge"],
            // // ------ split sub_expertise|Role -------

            // //  ------ Create Far Distance between member and project ------
            // edgeSettingsPreset["Project|dynamicSearch"]["hiddenEdge"],
            // edgeSettingsPreset["typeProject|expertise"]["hiddenEdge"],
            // edgeSettingsPreset["Role|expertise"]["hiddenEdge"],
            // edgeSettingsPreset["Role|typeProject"]["hiddenEdge"],
            // //  ------ Create Far Distance between member and project ------
          ],
        },
      },
      skip: selectedOption !== "Option 8",
      context: { serviceName: "soilservice" },
    }
  );

  const {
    data: dataDynamicSearchToMember,
    refetch: refetchDynamicSearchToMember,
  } = useQuery(DYNAMIC_SEARCH_TO_MEMBER_GRAPH, {
    variables: {
      fields: {
        // memberID: settingsGraphs.memberID1,
        // nodesID: [
        //   // "637a9133b8953f12f501e0d6",
        //   "637a9135b8953f12f501e118",
        //   "637a9134b8953f12f501e0f7",
        //   "637a914ab8953f12f501e1ca",
        //   "637a9151b8953f12f501e2aa",
        //   "637a913fb8953f12f501e1af",
        //   "63d1ad93a90f12cef67a7c7b",
        // ],
        nodesID: settingsGraphs.nodesID,
        memberID: settingsGraphs.memberID1,
        showAvatar: true,

        nodeSettings: [
          nodeSettingsPreset["Member"]["main"],
          nodeSettingsPreset["dynamicSearch"]["main"],
          nodeSettingsPreset["sub_typeProject"]["main"],
          nodeSettingsPreset["typeProject"]["main"],
          nodeSettingsPreset["sub_expertise"]["main"],
          nodeSettingsPreset["expertise"]["main"],
          // nodeSettingsPreset["Project"]["main"],
          // nodeSettingsPreset["Role"]["main"],
          // nodeSettingsPreset["skill"]["main"],
        ],
        edgeSettings: [
          // ------ split sub_typeProject|dynamicSearch -------
          edgeSettingsPreset["sub_typeProject|dynamicSearch"]["edge"],
          // edgeSettingsPreset["sub_typeProject|dynamicSearch"]["typeProject"],
          // edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          // edgeSettingsPreset["typeProject|dynamicSearch"]["edge"],
          // ------ split sub_typeProject|dynamicSearch -------

          // ------ split skill|Member -------
          // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          edgeSettingsPreset["sub_expertise|Member"]["expertise"],
          edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          //  edgeSettingsPreset["skill|sub_expertise"]["edge"],
          edgeSettingsPreset["expertise|Member"]["edge"],
          // ------ split skill|Member -------

          // ------ split sub_typeProject|Member -------
          edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
          edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          edgeSettingsPreset["typeProject|Member"]["edge"],
          // ------ split sub_typeProject|Member -------

          // ------ split sub_expertise|dynamicSearch -------
          edgeSettingsPreset["sub_expertise|dynamicSearch"]["edge"],
          // edgeSettingsPreset["sub_expertise|dynamicSearch"]["expertise"],
          // edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          // edgeSettingsPreset["expertise|dynamicSearch"]["edge"],
          // ------ split sub_expertise|dynamicSearch -------

          // // ------ Project Edges -------
          // edgeSettingsPreset["Project|Role"]["edge"],
          // edgeSettingsPreset["sub_expertise|Role"]["edge"],
          // edgeSettingsPreset["sub_typeProject|Role"]["edge"],
          // // edgeSettingsPreset["skill|Role"]["edge"],
          // // ------ Project Edges -------

          // // // ------ skill Edges -------
          // // edgeSettingsPreset["skill|dynamicSearch"]["edge"],
          // edgeSettingsPreset["skill|dynamicSearch"]["doubleSplitEdge"],
          // edgeSettingsPreset["skill|sub_expertise"]["edge"],
          // // edgeSettingsPreset["sub_expertise|dynamicSearch"]["edge"],
          // // // ------ skill Edges -------

          // // ------ split sub_expertise|Role -------
          // edgeSettingsPreset["sub_expertise|Role"]["expertise"],
          // edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          // edgeSettingsPreset["expertise|Role"]["edge"],
          // // ------ split sub_expertise|Role -------

          //  ------ Create Far Distance between member and project ------
          edgeSettingsPreset["Project|dynamicSearch"]["hiddenEdge"],
          edgeSettingsPreset["typeProject|expertise"]["hiddenEdge"],
          edgeSettingsPreset["Role|expertise"]["hiddenEdge"],
          edgeSettingsPreset["Role|typeProject"]["hiddenEdge"],
          //  ------ Create Far Distance between member and project ------
        ],
      },
    },
    skip: selectedOption !== "Option 7",
    context: { serviceName: "soilservice" },
  });

  const { data: dataGraphAPIProject } = useQuery(FIND_PROJECT_GRAPH, {
    variables: {
      fields: {
        projectID: settingsGraphs.projectID1,
        showAvatar: true,
        nodeSettings: [
          // nodeSettingsPreset["Member"]["main"],
          nodeSettingsPreset["sub_typeProject"]["main"],
          nodeSettingsPreset["typeProject"]["main"],
          nodeSettingsPreset["sub_expertise"]["main"],
          nodeSettingsPreset["expertise"]["main"],
          // nodeSettingsPreset["Project"]["main"],
          {
            ...nodeSettingsPreset["Project"]["main"],
            style: {
              ...nodeSettingsPreset["Project"]["main"].style,
              size: 90,
            },
          },
          {
            ...nodeSettingsPreset["Role"]["main"],
            style: {
              ...nodeSettingsPreset["Role"]["main"].style,
              size: 70,
            },
          },
          // nodeSettingsPreset["skill"]["main"],
        ],
        edgeSettings: [
          // // ------ split sub_typeProject|Member -------
          // edgeSettingsPreset["sub_typeProject|Member"]["typeProject"],
          // edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          // edgeSettingsPreset["typeProject|Member"]["edge"],
          // // ------ split sub_typeProject|Member -------

          // // ------ split sub_expertise|Member -------
          // // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // edgeSettingsPreset["sub_expertise|Member"]["expertise"],
          // edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          // edgeSettingsPreset["expertise|Member"]["edge"],
          // // ------ split sub_expertise|Member -------

          // ------ Project Edges -------
          edgeSettingsPreset["Project|Role"]["edgeXL"],
          edgeSettingsPreset["sub_expertise|Role"]["edge"],
          edgeSettingsPreset["sub_typeProject|Role"]["edge"],
          // edgeSettingsPreset["skill|Role"]["edge"],
          // ------ Project Edges -------

          // // // ------ skill Edges -------
          // // edgeSettingsPreset["skill|Member"]["edge"],
          // edgeSettingsPreset["skill|Member"]["doubleSplitEdge"],
          // edgeSettingsPreset["skill|sub_expertise"]["edge"],
          // // edgeSettingsPreset["sub_expertise|Member"]["edge"],
          // // // ------ skill Edges -------

          // ------ split sub_expertise|Role -------
          edgeSettingsPreset["sub_expertise|Role"]["expertise"],
          edgeSettingsPreset["sub_expertise|expertise"]["edge"],
          edgeSettingsPreset["expertise|Role"]["edge"],
          // ------ split sub_expertise|Role -------

          // ------ split sub_typeProject|Role -------
          edgeSettingsPreset["sub_typeProject|Role"]["typeProject"],
          edgeSettingsPreset["sub_typeProject|typeProject"]["edge"],
          edgeSettingsPreset["typeProject|Role"]["edge"],
          // ------ split sub_typeProject|Role -------

          // //  ------ Create Far Distance between member and project ------
          edgeSettingsPreset["Role|Role"]["hiddenEdge"],
          edgeSettingsPreset["Project|expertise"]["hiddenEdge"],
          // edgeSettingsPreset["Projet|typeProject"]["hiddenEdge"],
          // edgeSettingsPreset["expertise|expertise"]["hiddenEdge"],
          // // edgeSettingsPreset["Project|Member"]["hiddenEdge"],
          // edgeSettingsPreset["typeProject|expertise"]["hiddenEdge"],
          // //  ------ Create Far Distance between member and project ------
        ],
      },
    },
    skip: selectedOption !== "Option 4",
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
      skip: selectedOption !== "Option 5",
      context: { serviceName: "soilservice" },
    }
  );

  const updateGraph = (settingsGraphNow: any) => {
    let dataGraphAPI;

    console.log("dataDynamicSearchToMember = ", dataDynamicSearchToMember);

    if (selectedOption == "Option 1") {
      if (settingsGraphNow.useAvatar == true && data2.nodesVisual.length > 0) {
        // data2?.nodesVisual?[0] = {
        //   ...data2.nodesVisual[0],
        //   // ----------- Shwow Avatar User ---------
        //   type: "image",
        //   img: "https://cdn.discordapp.com/avatars/961730944170090516/e5844ca759a74e995027a0e50c5cb1bf.png",
        //   clipCfg: {
        //     show: true,
        //     type: "circle",
        //     r: 25,
        //   },
        //   style: {
        //     height: 50,
        //     width: 50,
        //   },
        //   // ----------- Shwow Avatar User ---------
        // };
      } else {
        data2.nodesVisual[0] = {
          ...data2.nodesVisual[0],
          // ----------- Shwow Avatar User ---------
          type: "",
          img: "",
          clipCfg: {},
          style: {},
          // ----------- Shwow Avatar User ---------
        };
      }
      setData({
        nodes: data2.nodesVisual,
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
    } else if (
      selectedOption == "Option 6" &&
      dataDynamicSearchToProject &&
      dataDynamicSearchToProject.dynamicSearchToProjectGraph
    ) {
      console.log("change = 6");
      dataGraphAPI = dataDynamicSearchToProject.dynamicSearchToProjectGraph;
    } else if (
      selectedOption == "Option 7" &&
      dataDynamicSearchToMember &&
      dataDynamicSearchToMember.dynamicSearchToMemberGraph
    ) {
      console.log("change = 7");
      dataGraphAPI = dataDynamicSearchToMember.dynamicSearchToMemberGraph;
    } else if (
      selectedOption == "Option 8" &&
      dataDynamicSearch &&
      dataDynamicSearch.dynamicSearchGraph
    ) {
      console.log("change = 8");
      dataGraphAPI = dataDynamicSearch.dynamicSearchGraph;
    }

    if (dataGraphAPI != undefined && selectedOption != "Option 1") {
      console.log("dataGraphAPI = ", dataGraphAPI);
      const nodeDataObj: any = {};
      const edgesDataGraph = dataGraphAPI.edges.map(
        (edge: {
          source: any;
          target: any;
          distanceRation: any;
          style: any;
        }) => {
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

      console.log("edgesDataGraph = ", edgesDataGraph);

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
            style: node.style,
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
    if (
      dataGraphAPImemberProject?.findMemberToProjectGraph ||
      dataGraphAPImember?.findMemberGraph ||
      dataGraphAPIProject?.findProjectGraph ||
      dataGraphAPIMultipleMembersProjects?.findMultipleMembersProjectsGraph ||
      dataDynamicSearchToProject?.dynamicSearchToProjectGraph ||
      dataDynamicSearchToMember?.dynamicSearchToMemberGraph ||
      dataDynamicSearch?.dynamicSearchGraph
    ) {
      console.log("dataDynamicSearchToMember = ", dataDynamicSearchToMember);
      if (selectedOption == "Option 6") {
        refetchDynamicSearchToProject();
        updateGraph(settingsGraphs);
      } else if (selectedOption == "Option 7") {
        refetchDynamicSearchToMember();
        updateGraph(settingsGraphs);
      } else if (selectedOption == "Option 8") {
        refetchDynamicSearchToMember();
        updateGraph(settingsGraphs);
      } else {
        updateGraph(settingsGraphs);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedOption,
    settingsGraphs,
    dataGraphAPImemberProject?.findMemberToProjectGraph,
    dataGraphAPImember?.findMemberGraph,
    dataGraphAPIProject?.findProjectGraph,
    dataGraphAPIMultipleMembersProjects?.findMultipleMembersProjectsGraph,
    dataDynamicSearchToProject?.dynamicSearchToProjectGraph,
    dataDynamicSearchToMember?.dynamicSearchToMemberGraph,
    dataDynamicSearch?.dynamicSearchGraph,
  ]);
  // }, [dataGraphAPImember, dataGraphAPImemberProject, selectedOption]);

  // const [data, setData] = React.useState<Graph>(data2);
  const [data, setData] = React.useState<Graph>({
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
      <div
        style={{
          flexDirection: "column",
          alignItems: "center",
          padding: "10",
          width: "100%",
        }}
      >
        <div>
          <MenuOption
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            settingsGraphs={settingsGraphs}
            updateSettings={updateSettings}
          />
        </div>

        {/* <MemberToProjectGraph
          settingsGraphs={settingsGraphs}
          selectedOption={selectedOption}
        /> */}

        {/* {(() => {
          switch (selectedOption) {
            case "Option 1":
              return "Case 1";
            case "Option 2":
              return (
                <p>asdf</p>
                // <MemberToProjectGraph
                //   settingsGraphs={settingsGraphs}
                //   selectedOption={selectedOption}
                // />
              );
            case "Option 3":
              return (
                <MemberToProjectGraph
                  settingsGraphs={settingsGraphs}
                  selectedOption={selectedOption}
                />
              );
            case "Option 4":
              return "Case 4";
            case "Option 5":
              return "Case 5";
            default:
              return "Unknown case";
          }
        })()} */}
        <div className={`flex h-screen w-full gap-4`}>
          <div
            className={`h-screen
             py-1 text-center`}
          ></div>

          {refContainer && (
            <div
              className="w-full"
              ref={refContainer as RefObject<HTMLDivElement>}
            >
              {data && data.nodes && data.nodes.length > 0 ? (
                <GraphVisual
                  data2={data}
                  width={width}
                  height={refContainer.current?.offsetHeight!}
                  settingsGraphs={settingsGraphs}
                  updateSettings={updateSettings}
                />
              ) : (
                <p>Dont have Graph Data Yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GraphVisualPage;
