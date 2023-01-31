import G6 from "@antv/g6";
import React, { useEffect, useState } from "react";

const globalFontSize = 10;

//  -------------- Graph Node Settings ------------
const nodeTypeStyle = {
  Member: {
    fill: "#f9efff",
    stroke: "#bf55ff",
    size: 90,
    displayName: "Member",
    sizeRatio: 0.3,
  },
  // eslint-disable-next-line camelcase
  sub_typeProject: {
    fill: "#faffef",
    stroke: "#cdff52",
    size: 20,
    displayName: "Sub Project Type",
    sizeRatio: 0.05,
  },
  typeProject: {
    fill: "#f0fdaf",
    stroke: "#9AECaE",
    size: 40,
    displayName: "Project Type",
    sizeRatio: 0.15,
  },
  // eslint-disable-next-line camelcase
  sub_expertise: {
    fill: "#EBFCFF",
    stroke: "#9AECaE",
    size: 25,
    displayName: "Skill",
    sizeRatio: 0.15,
  },
  expertise: {
    fill: "#C2F7FF",
    stroke: "#9AECFE",
    size: 40,
    displayName: "Expertise",
    sizeRatio: 0.25,
  },
  Project: {
    fill: "#FDFFDC",
    stroke: "#FAE289",
    size: 75,
    displayName: "Project",
    sizeRatio: 1,
  },
  Role: {
    fill: "#E8FBDA",
    stroke: "#C8F4A4",
    size: 50,
    displayName: "Project Role",
    sizeRatio: 0.8,
  },
  disabledNode: {
    fill: "#E8EBED",
    stroke: "#505C68",
    size: 25,
    displayName: "Disabled Nodes",
    sizeRatio: 0,
  },
};
//  -------------- Graph Node Settings ------------

//  -------------- Graph Functions ------------
function remapValue(value, fromLow, fromHigh, toLow, toHigh) {
  return ((value - fromLow) * (toHigh - toLow)) / (fromHigh - fromLow) + toLow;
}

const tooltip = new G6.Tooltip({
  offsetX: 10,
  offsetY: 10,
  fixToNode: [1, 0.5],
  // the types of items that allow the tooltip show up
  itemTypes: ["node"],
  // custom the tooltip's content
  getContent: (e) => {
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

const prepareLabelOfNode = (node, fontSize) => {
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

    let parsDiff = parseInt(node.size) - parseInt(maxEllipsisLength);

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

    let parsDiff = parseInt(node.size) - parseInt(ellipsisLength);

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

function refreshDragedNodePosition(e) {
  const model = e.item.get("model");

  model.fx = e.x;
  model.fy = e.y;
}

//  -------------- Graph Functions ------------

let graph;

const G6component = ({ width, height, data2 }) => {
  const ref = React.useRef(null);

  //  -------------- Graph Setup ----------------
  useEffect(() => {
    if (!graph) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      graph = new G6.Graph({
        container: ref.current,
        width: width,
        height: height,
        modes: {
          default: ["drag-canvas", "zoom-canvas"],
          // default: ["drag-canvas", "zoom-canvas", "activate-relations"],
        },
        animate: true, // Boolean, whether to activate the animation when global changes happen
        defaultNode: {
          type: "circle",
          labelCfg: {
            style: {
              fill: "#000000A6",
              fontSize: 10,
            },
          },
          style: {
            stroke: "#72CC4A",
            width: 150,
          },
        },
        defaultEdge: {
          type: "line",
        },
        layout: {
          // type: "grid",
          // begin: [0, 0],
          // preventOverlap: true, // nodeSize or size in data is required for preventOverlap: true
          // preventOverlapPdding: 20,
          // nodeSize: 30,
          // condense: false,
          // rows: 5,
          // cols: 5,
          // sortBy: "degree",
          type: "force",
          edgeStrength: 0.6,
          preventOverlap: true,
          strictRadial: true,
          linkDistance: (d) => {
            // Change dinamicaloly the distance based on the number of connections
            let numConnections = 0;

            // console.log("d = ", d);

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
            // console.log("d = ", d);
            if (d.distanceRation) {
              let extraDistanceRation = 0;

              if (d.source.extraDistanceRation) {
                extraDistanceRation =
                  extraDistanceRation + d.source.extraDistanceRation;
                // console.log("d.source.label = ", d.source.label);
              } else if (d.target.extraDistanceRation) {
                extraDistanceRation =
                  extraDistanceRation + d.target.extraDistanceRation;
                // console.log("d.target.label = ", d.target.label);
              }
              // console.log(
              //   "d.distanceRation + extraDistanceRation = ",
              //   d.distanceRation + extraDistanceRation
              // );
              return remapValue(
                d.distanceRation + extraDistanceRation,
                0,
                1,
                25,
                230
              );
            } else {
              // console.log("change =---------- ");
              // return 200;
              return initDistance + Math.floor(Math.random() * randomDistance);
            }
          },
          edgeStrength: (d) => {
            if (d.distanceRation) {
              let extraDistanceRation = 0;

              if (d.source.extraDistanceRation) {
                extraDistanceRation =
                  extraDistanceRation + d.source.extraDistanceRation;
              } else if (d.target.extraDistanceRation) {
                extraDistanceRation =
                  extraDistanceRation + d.target.extraDistanceRation;
              }
              return d.distanceRation + extraDistanceRation;
            }
            return 1;
          },
        },
        plugins: [tooltip],
      });

      if (data2.nodes.length != 1 || data2.nodes[0].id != "node1")
        updateNodes(data2);

      graph.on("node:dragstart", (e) => {
        graph.layout();
        refreshDragedNodePosition(e);
      });
      graph.on("node:drag", (e) => {
        const forceLayout = graph.get("layoutController").layoutMethods[0];

        forceLayout.execute();
        refreshDragedNodePosition(e);
      });
      graph.on("node:dragend", function (e) {
        e.item.get("model").fx = null;
        e.item.get("model").fy = null;
      });
      graph.on("node:click", (e) => {
        const nodeConnectID = e.item._cfg.id;

        addNodeAndEdge(nodeConnectID, {});
        // addNodeAndEdge(nodeConnectID, { id: "node88", size: 55 } as Node);
      });
    }
  }, []);

  useEffect(() => {
    if (graph && (data2.nodes.length != 1 || data2.nodes[0].id != "node1")) {
      if (data2.nodes.length != 1) {
        updateNodes(data2);
        console.log("data2.nodes = ", data2.nodes);
      }

      // updateNodes(data2);
    }
  }, [data2]);
  //  -------------- Graph Setup ----------------

  // ---------- Update Nodes -----------

  function addNodeAndEdge(nodeConnectID, newNode) {
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

  function addNode(newNode) {
    const model = {
      ...newNode,
    };

    graph.addItem("node", model);

    graph.layout();
  }

  function addEdge(newEdge) {
    const model2 = {
      source: newEdge.source,
      target: newEdge.target,
    };

    graph.addItem("edge", model2);

    graph.layout();
  }

  function updateNodes(data) {
    graph.data(data);
    graph.render();

    const items = [];
    const itemsObj = {};

    // find max and min sizeRation
    let maxNodeSizeRatio = -0.1;

    let minNodeSizeRation = 1.1;

    data.nodes.forEach(function (node) {
      const nodeType = node.nodeType;

      if (nodeTypeStyle[nodeType] == undefined) return null;

      if (nodeTypeStyle[nodeType].sizeRatio > maxNodeSizeRatio) {
        maxNodeSizeRatio = nodeTypeStyle[nodeType].sizeRatio;
      }
      if (nodeTypeStyle[nodeType].sizeRatio < minNodeSizeRation) {
        minNodeSizeRation = nodeTypeStyle[nodeType].sizeRatio;
      }
    });

    data.nodes.forEach(function (node) {
      if (!node) return;

      let nodeType = node.nodeType;

      if (node.disabledNode == true) {
        nodeType = "disabledNode";
      }

      // -------- Change stype based on Type of Node -------
      if (nodeType && nodeTypeStyle[nodeType]) {
        // SOS 🆘 you cant chanege the style of the member node because the visualisation breaks
        if (nodeType != "Member") {
          graph.updateItem(node.id, {
            size: remapValue(
              nodeTypeStyle[nodeType].sizeRatio,
              minNodeSizeRation,
              maxNodeSizeRatio,
              30,
              80
            ),
            // size: nodeTypeStyle[nodeType].size,
            style: {
              fill: nodeTypeStyle[nodeType].fill,
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
        prepareLabelOfNode(node, globalFontSize);
      }
      // -------- Change label of Node -------

      const typeNowStyle = nodeTypeStyle[nodeType];

      // -------- Create the Menue of Graph -------
      if (itemsObj[nodeType] == undefined && typeNowStyle != undefined) {
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
      setItems(items);
      setCheckedItems(items);
    }

    graph.layout();
  }
  // ---------- Update Nodes -----------

  // ---------- Menue Nodes, Check UnCheck -------------
  const [checkedItems, setCheckedItems] = useState([]);
  const [items, setItems] = useState([]);

  const handleCheckboxChange = (itemId) => {
    const flagChange = !checkedItems[itemId].checked;

    const nodeTypeNow = checkedItems[itemId].nodeType;

    const addNodesObj = {};

    data2.nodes.forEach(function (node) {
      let nodeType = node.nodeType;

      if (node.disabledNode == true) {
        nodeType = "disabledNode";
      }

      if (nodeType == nodeTypeNow) {
        if (flagChange == true) {
          addNodesObj[node.id] = node;
          addNode(node);
        } else {
          const itemDel = graph.findById(node.id);

          graph.removeItem(itemDel);
        }
      }
    });

    data2.edges.forEach(function (edge) {
      if (addNodesObj[edge.source] || addNodesObj[edge.target]) {
        addEdge(edge);
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
  // ---------- Menue Nodes, Check UnCheck -------------

  useEffect(() => {
    if (graph) {
      graph.changeSize(width, height);
      graph.refresh();
    }
  }, [width, height]);

  return (
    <div className="relative w-full">
      {data2.nodes.length == 1 ? <div>loading</div> : true}
      <div ref={ref}></div>
      <div className="fixed bottom-0 right-0 p-10">
        {/* <div className="absolute right-2 bottom-0 flex flex-col"> */}
        {items.map((item, idx) => (
          <div key={item.id} className="mb-2 flex items-center justify-end">
            <div className={`ml-2 text-${item.colorsa}-500`}>{item.name}</div>
            <button
              className="ml-2"
              style={{
                backgroundColor: checkedItems[idx].checked
                  ? item.fill
                  : item.fill,
                color: "black",
                fontSize: "small",
                padding: "5px 12px",
                borderRadius: "200px",
                // border: item.stroke,
                border: checkedItems[idx].checked
                  ? `2px solid ${item.stroke}`
                  : `2px solid ${item.stroke}`,
                cursor: "pointer",
                width: "fit-content",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => handleCheckboxChange(idx)}
              value={idx}
            >
              {checkedItems[idx].checked ? (
                // {checkedItems[idx].checked ? (
                <span>&#10003;</span>
              ) : (
                <span style={{ color: item.fill }}>N</span>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default G6component;
