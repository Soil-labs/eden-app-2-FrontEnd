export const backendGraphToVisualGraph = (
  dataGraphAPI: any,
  useAvatar: boolean
) => {
  if (dataGraphAPI == undefined) return {};

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

  const nodesDataGraph = dataGraphAPI.nodesVisual.map(
    (node: {
      _id: any;
      name: any;
      type: string;
      avatar: string;
      extraDistanceRation: Number;
      style: any;
    }) => {
      let extraStyle = {};

      if (useAvatar == true && node.avatar != undefined) {
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
      if (useAvatar == false && node.avatar != undefined) {
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

  return {
    nodes: nodesDataGraph,
    edges: edgesDataGraph,
  };
};
