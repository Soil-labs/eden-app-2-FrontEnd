import G6 from "@antv/g6";

import { Graph, NodeVisualExtended } from "./interfaceGraph";
import { nodeTypeStyle } from "./nodeTypeStyle";

const globalFontSize = 10;

export const remapValue = (
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
) => {
  return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow;
};

export function addEdge(newEdge: any, graph: any) {
  const model2 = {
    ...newEdge,
    // source: newEdge.source,
    // target: newEdge.target,
    // style: newEdge.style,
  };

  graph.addItem("edge", model2);

  graph.layout();
}

export function addNode(newNode: any, graph: any) {
  const model = {
    ...newNode,
  };

  graph.addItem("node", model);

  graph.layout();
}

export function addNodeAndEdge(nodeConnectID: any, newNode: any, graph: any) {
  const nodeOrigin = graph.findById(nodeConnectID);

  let newNodeID;

  if (newNode == undefined || newNode.id == undefined) {
    newNodeID = Math.random().toString(36).substr(2, 9);
  } else {
    newNodeID = newNode.id;
  }

  const model = {
    id: newNodeID,
    x: nodeOrigin._cfg.bboxCache.x + Math.random() * 70 + 40,
    y: nodeOrigin._cfg.bboxCache.y + Math.random() * 70 + 40,

    size: newNode.size != undefined ? newNode.size : 15,
  };

  graph.addItem("node", model);

  const model2 = {
    source: nodeConnectID,
    target: newNodeID,
  };

  graph.addItem("edge", model2);

  graph.layout();
}

export function edgeStrength(d: any) {
  if (d.distanceRation) {
    let extraDistanceRation = 0;

    if (d.source.extraDistanceRation) {
      extraDistanceRation = extraDistanceRation + d.source.extraDistanceRation;
    } else if (d.target.extraDistanceRation) {
      extraDistanceRation = extraDistanceRation + d.target.extraDistanceRation;
    }
    return d.distanceRation + extraDistanceRation;
  }
  return 1;
}

export function linkDistance(d: any) {
  // Change dinamicaloly the distance based on the number of connections
  let numConnections = 0;

  // console.log("d = ", d);
  // SOS 🆘 delete Test
  // console.log("d = ", d);
  if (d.style?.distance) {
    return d.style.distance;
  }
  // if (d.source.id == "node0" && d.target.id == "node11") {
  //   return 600;
  // }

  if (d.source.numberConnections > d.target.numberConnections) {
    numConnections = d.source.numberConnections;
  } else {
    numConnections = d.target.numberConnections;
  }

  let initDistance = 90;

  let randomDistance = 100;

  if (numConnections > 23) {
    initDistance = 130;
  } else if (numConnections > 10) {
    initDistance = 100;
  } else {
    randomDistance = 50;
  }

  if (d.distanceRation) {
    let extraDistanceRation = 0;

    if (d.source.extraDistanceRation) {
      extraDistanceRation = extraDistanceRation + d.source.extraDistanceRation;
    } else if (d.target.extraDistanceRation) {
      extraDistanceRation = extraDistanceRation + d.target.extraDistanceRation;
    }
    return remapValue(d.distanceRation + extraDistanceRation, 0, 1, 25, 230);
  } else {
    return initDistance + Math.floor(Math.random() * randomDistance);
  }
}

export const prepareLabelOfNode = (
  node: NodeVisualExtended,
  fontSize: any,
  graph: any
) => {
  let updateObj = {};

  let flagUpdate = false;

  if (node.label == undefined) return "";

  const words = node.label.replace("& ", "").replace("| ", "").split(" ");

  let i = 0;

  let res2 = "";

  if (words.length > 1) {
    let maxEllipsisLength = 0;

    while (i < words.length && i < 3) {
      const word = words[i];

      const ellipsisLength = G6.Util.getTextSize(word, fontSize)[0];

      if (maxEllipsisLength < ellipsisLength) {
        maxEllipsisLength = ellipsisLength;
      }

      res2 = res2 + word + "\n";
      i++;
    }
    res2 = res2.slice(0, -1);

    let parsDiff = node.size - parseInt(maxEllipsisLength.toString());

    let sizeNew = node.size;

    if (parsDiff < 0) {
      parsDiff = parsDiff * 0.16;
      sizeNew = node.size * 1.2;
    } else {
      // parsDiff = parsDiff * 0.03;
      // sizeNew = node.size * 0.95;
      parsDiff = parsDiff * 0;
      sizeNew = node.size * 1;
    }
    const fontSizeNew = (fontSize + parsDiff).toFixed();

    flagUpdate = true;
    updateObj = {
      label: res2,
      size: sizeNew,
      labelCfg: {
        style: {
          fontSize: fontSizeNew,
        },
      },
    };
  } else if (words.length == 1) {
    flagUpdate = true;

    const ellipsisLength = G6.Util.getTextSize(node.label, fontSize)[0];

    let parsDiff = node.size - parseInt(ellipsisLength);

    let sizeNew = node.size;

    if (parsDiff < 0) {
      parsDiff = parsDiff * 0.18;
      sizeNew = node.size * 1.2;
    } else {
      // parsDiff = parsDiff * 0.03;
      // sizeNew = node.size * 0.95;
      parsDiff = parsDiff * 0;
      sizeNew = node.size * 1;
    }

    const fontSizeNew = (fontSize + parsDiff).toFixed();

    updateObj = {
      size: sizeNew,
      labelCfg: {
        style: {
          fontSize: fontSizeNew,
        },
      },
    };
  }

  if (flagUpdate == true) {
    graph.updateItem(node.id, {
      ...updateObj,
    });
  }

  return res2;
};

export const handleCheckboxChange = (
  itemId: any,
  data2: Graph,
  checkedItems: any,
  setCheckedItems: any,
  graph: any
) => {
  const flagChange = !checkedItems[itemId].checked;

  const nodeTypeNow = checkedItems[itemId].nodeType;

  const addNodesObj = {};

  data2?.nodes?.forEach(function (node: any) {
    let nodeType = node.nodeType;

    if (node.disabledNode == true) {
      nodeType = "disabledNode";
    }

    if (nodeType == nodeTypeNow) {
      if (flagChange == true) {
        // @ts-ignore
        addNodesObj[node.id] = node;
        addNode(node, graph);
      } else {
        const itemDel = graph.findById(node.id);

        graph.removeItem(itemDel);
      }
    }
  });

  data2?.edges?.forEach(function (edge: any) {
    // @ts-ignore
    if (addNodesObj[edge.source] || addNodesObj[edge.target]) {
      // console.log("edge Change = ", edge);
      addEdge(edge, graph);
    }
  });

  setCheckedItems({
    ...checkedItems,
    [itemId]: {
      ...checkedItems[itemId],
      checked: !checkedItems[itemId].checked,
    },
  });
};

export function updateNodes(
  data: any,
  graph: any,
  setCheckedItems: any,
  setItems: any
) {
  graph.data(data);
  graph.render();

  const items: any[] = [];
  const itemsObj = {};

  // -------- Change stype based on Type of Node -------
  let maxNodeSizeRatio = -0.1; // find max and min sizeRation

  let minNodeSizeRation = 1.1;

  data.nodes.forEach(function (node: any) {
    const nodeType = node.nodeType;

    // @ts-ignore
    if (nodeTypeStyle[nodeType] == undefined) return null;

    // @ts-ignore
    if (nodeTypeStyle[nodeType].sizeRatio > maxNodeSizeRatio) {
      // @ts-ignore
      maxNodeSizeRatio = nodeTypeStyle[nodeType].sizeRatio;
    }
    // @ts-ignore
    if (nodeTypeStyle[nodeType].sizeRatio < minNodeSizeRation) {
      // @ts-ignore
      minNodeSizeRation = nodeTypeStyle[nodeType].sizeRatio;
    }
  });

  data.nodes.forEach(function (node: any) {
    if (!node) return;

    let nodeType = node.nodeType;

    if (node.disabledNode == true) {
      nodeType = "disabledNode";
    }

    // @ts-ignore
    if (nodeType && nodeTypeStyle[nodeType]) {
      // SOS 🆘 you cant chanege the style of the member node because the visualisation breaks
      if (nodeType != "Member") {
        graph.updateItem(node.id, {
          size: remapValue(
            // @ts-ignore
            nodeTypeStyle[nodeType].sizeRatio,
            minNodeSizeRation,
            maxNodeSizeRatio,
            30,
            80
          ),
          // size: nodeTypeStyle[nodeType].size,
          style: {
            // @ts-ignore
            fill: nodeTypeStyle[nodeType].fill,
            // @ts-ignore
            stroke: nodeTypeStyle[nodeType].stroke,
            lineWidth: 1,
          },
        });
      } else {
        graph.updateItem(node.id, {
          label: "",
        });
      }
    }
    // -------- Change stype based on Type of Node -------

    // -------- Change label of Node -------
    if (node) {
      prepareLabelOfNode(node, globalFontSize, graph);
    }
    // -------- Change label of Node -------

    // -------- Create the Menue of Graph -------
    // @ts-ignore
    const typeNowStyle = nodeTypeStyle[nodeType];

    // @ts-ignore
    if (itemsObj[nodeType] == undefined && typeNowStyle != undefined) {
      // @ts-ignore
      itemsObj[nodeType] = {
        res: typeNowStyle,
      };
      items.push({
        id: items.length,
        name: typeNowStyle?.displayName,
        fill: typeNowStyle?.fill,
        stroke: typeNowStyle?.stroke,
        nodeType: nodeType,
        checked: true,
      });
    }
    // -------- Create the Menue of Graph -------
  });

  if (items.length > 1) {
    // Create the Menue of Graph
    setItems(items as any);
    setCheckedItems(items);
  }

  graph.layout();
}

export function updateNodesBackendSettings(
  data: any,
  graph: any,
  setCheckedItems: any,
  setItems: any
) {
  graph.data(data);
  graph.render();

  const items: any[] = [];
  const itemsObj = {};

  data.nodes.forEach(function (node: any) {
    if (!node) return;

    let nodeType = node.nodeType;

    if (node.disabledNode == true) {
      nodeType = "disabledNode";
    }

    // -------- Change label of Node -------
    prepareLabelOfNode(node, globalFontSize, graph);
    // -------- Change label of Node -------

    // -------- Change stype based on Type of Node -------
    if (nodeType) {
      // SOS 🆘 you cant chanege the style of the member node because the visualisation breaks
      if (nodeType != "Member" && nodeType != "dynamicSearch") {
        graph.updateItem(node.id, {
          size: node.style.size,
          style: {
            fill: node.style.fill,
            stroke: node.style.stroke,
            lineWidth: 1,
            // @ts-ignore
            // fill: nodeTypeStyle[nodeType].fill,
            // @ts-ignore
            // stroke: nodeTypeStyle[nodeType].stroke,
          },
          // size: nodeTypeStyle[nodeType].size,
          // style: node.style,
        });
      } else {
        graph.updateItem(node.id, {
          label: "",
        });
      }
    }
    // -------- Change stype based on Type of Node -------

    // -------- Create the Menue of Graph -------
    // @ts-ignore
    const typeNowStyle = nodeTypeStyle[nodeType];

    // @ts-ignore
    if (itemsObj[nodeType] == undefined && typeNowStyle != undefined) {
      // @ts-ignore
      itemsObj[nodeType] = {
        res: typeNowStyle,
      };
      items.push({
        id: items.length,
        name: typeNowStyle?.displayName,
        fill: typeNowStyle?.fill,
        stroke: typeNowStyle?.stroke,
        order: typeNowStyle?.order,
        nodeType: nodeType,
        checked: true,
      });
    }
    // -------- Create the Menue of Graph -------
  });

  //Solution
  const itemsNew = items.sort((a, b) => a.order - b.order);

  // console.log("items = ", items);
  // console.log("items_new = ", itemsNew);

  if (itemsNew.length > 1) {
    // Create the Menue of Graph
    setItems(itemsNew as any);
    setCheckedItems(itemsNew);
  }

  graph.layout();
}

export const tooltip = new G6.Tooltip({
  offsetX: 10,
  offsetY: 10,
  fixToNode: [1, 0.5],
  // the types of items that allow the tooltip show up
  itemTypes: ["node"],
  // custom the tooltip's content
  getContent: (e: any) => {
    const outDiv = document.createElement("div");

    outDiv.style.width = "fit-content";
    outDiv.style.height = "fit-content";
    const model = e.item.getModel();

    if (model.propertise && model.propertise.name != undefined) {
      outDiv.innerHTML = `name：${model.propertise.name}<br/>type：${model.nodeType}`;

      return outDiv;
    } else {
      return "";
    }
  },
});
