import { gql, useQuery } from "@apollo/client";
import { Edge, Maybe, NodeVisual } from "@eden/package-graphql/generated";
import { edgeSettingsPreset } from "@eden/package-ui/g6/GraphVisual/data/edgeSettingsPreset";
import { nodeSettingsPreset } from "@eden/package-ui/g6/GraphVisual/data/nodeSettingsPreset";
import dynamic from "next/dynamic";
import React, { RefObject, useEffect, useRef, useState } from "react";

const GraphVisual = dynamic(
  () => import("@eden/package-ui/g6/GraphVisual/GraphVisual"),
  {
    ssr: false,
  }
);

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

const MemberToProjectGraph = (props: any) => {
  const refContainer = useRef<HTMLDivElement>();

  const { data: dataGraphAPImember } = useQuery(FIND_MEMBER_GRAPH, {
    variables: {
      fields: {
        memberID: "961730944170090516",
        // memberID: props.settingsGraphs.memberID1,
        showAvatar: true,
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

          // ------ Change edge --------
          // {
          //   ...edgeSettingsPreset["typeProject|Member"]["edge"],
          //   mainEdge: {
          //     ...edgeSettingsPreset["typeProject|Member"]["edge"].mainEdge,
          //     style: {
          //       color: "#C5947C",
          //     },
          //   },
          // },
          // ------ Change edge --------
        ],
      },
    },
    skip: props.selectedOption !== "Option 3",
  });

  console.log("dataGraphAPImember = ", dataGraphAPImember);

  const [data, setData] = React.useState<Graph>({
    nodes: [{ id: "node1", size: 50 }],
    edges: [],
  });

  const [width, setWidth] = useState<number>(0);

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
  }, [dataGraphAPImember]);

  useEffect(() => {
    if (dataGraphAPImember) {
      const dataGraphAPI = dataGraphAPImember.findMemberGraph;

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
          //   settingsGraphs.useAvatar,
          //   node.avatar,
          //   node
          // );
          if (
            props.settingsGraphs.useAvatar == true &&
            node.avatar != undefined
          ) {
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
          if (
            props.settingsGraphs.useAvatar == false &&
            node.avatar != undefined
          ) {
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
  }, [dataGraphAPImember]);

  console.log("data = ", data);

  console.log("width = ", width);
  console.log(
    "refContainer.current?.offsetHeight! = ",
    refContainer.current?.offsetHeight!
  );

  const [graph, setGraph] = useState<any>();

  return (
    <div>
      <p>boom</p>
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
            {data && data.nodes && data.nodes.length > 0 && width > 0 ? (
              <GraphVisual
                data2={data}
                width={width}
                height={refContainer.current?.offsetHeight!}
                graph={graph}
                setGraph={setGraph}
              />
            ) : (
              <p>Dont have Graph Data Yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberToProjectGraph;
