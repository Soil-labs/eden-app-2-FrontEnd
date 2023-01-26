import { AppUserLayout } from "@eden/package-ui";
import dynamic from "next/dynamic";
const G6component = dynamic(
  () => import("../../../src/components/G6component"),
  {
    ssr: false,
  }
);

import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";

const FIND_MEMBER_GRAPH = gql`
  query ($fields: findMemberGraphInput!) {
    findMemberGraph(fields: $fields) {
      nodes {
        _id
        name
        type
      }
      edges {
        source
        target
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
      }
      edges {
        source
        target
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

const data2 = {
  nodes: [
    {
      id: "node0",
      size: 80,
      // x: 100,
      // y: 100,
      label: "eloi\nasdf",
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
    { id: "node1", size: 50, label: "sbelka" },
    { id: "node2", size: 50, label: "waxy" },
    { id: "node3", size: 50, label: "figma" },
    { id: "node4", size: 50, label: "UX" },
    { id: "node5", size: 50, label: "ImpactBilli" },
    { id: "node6", size: 30 },
    { id: "node7", size: 30 },
    { id: "node8", size: 30 },
    { id: "node9", size: 30 },
    { id: "node10", size: 30 },
    { id: "node11", size: 30 },
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
  // create a function that handle a click and will pass on G6component component

  const { data: dataGraphAPImember } = useQuery(
    // const { data: dataGraphAPImember, refetch: refetchDataGraphAPI } = useQuery(
    FIND_MEMBER_GRAPH,
    {
      variables: {
        fields: {
          // memberID: "908392557258604544",
          // memberID: "812342397790191638",
          memberID: "961730944170090516",
        },
      },
      // skip: !nodesID || !selectedServerID,
      context: { serviceName: "soilservice" },
    }
  );

  const { data: dataGraphAPImemberProject } = useQuery(
    // const { data: dataGraphAPImember, refetch: refetchDataGraphAPI } = useQuery(
    FIND_MEMBER_PROJECT_GRAPH,
    {
      variables: {
        fields: {
          memberID: "908392557258604544",
        },
      },
      // skip: !nodesID || !selectedServerID,
      context: { serviceName: "soilservice" },
    }
  );

  useEffect(() => {
    let dataGraphAPI;

    // Use One of them!
    if (dataGraphAPImemberProject) {
      dataGraphAPI = dataGraphAPImemberProject.findMemberToProjectGraph;
    }
    // Use One of them!
    // if (dataGraphAPImember) {
    //   dataGraphAPI = dataGraphAPImember.findMemberGraph;
    // }

    if (dataGraphAPI) {
      console.log("dataGraphAPImember = ", dataGraphAPImember);

      const nodeDataObj: any = {};
      const edgesDataGraph = dataGraphAPI.edges.map(
        (edge: { source: any; target: any }) => {
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
          };
        }
      );

      // console.log("edgesDataGraph = ", edgesDataGraph);

      const nodesDataGraph = dataGraphAPI.nodes.map(
        (node: { _id: any; name: any; type: string }) => {
          const extraStyle = {};

          if (node._id == "637a914ab8953f12f501e1ca") {
            // extraStyle = {
            //   disabledNode: true,
            // };
          }
          return {
            id: node._id,
            label: node.name,
            type: node.type,
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

      console.log("nodesDataGraph = ", nodesDataGraph);

      setData({
        nodes: nodesDataGraph,
        edges: edgesDataGraph,
      });
    }
  }, [dataGraphAPImember, dataGraphAPImemberProject]);

  // const [data, setData] = React.useState<DataState>(data2);
  const [data, setData] = React.useState<DataState>({
    nodes: [{ id: "node1", size: 50 }],
    edges: [],
  });

  // const [disable]

  return (
    <>
      {/* {data && data.nodes && data.nodes.length > 0 ? (
        <G6component data2={data} handleClick={handleClick} />
      ) : (
        <p>Don't have Graph Data Yet</p>
      )} */}
      {data && data.nodes && data.nodes.length > 0 ? (
        <G6component
          width={900}
          height={900}
          // data2={data}
          data2={data2}
          // handleClick={handleClick}
        />
      ) : (
        <p>Dont have Graph Data Yet</p>
      )}
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
