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
  },
  // eslint-disable-next-line camelcase
  sub_typeProject: {
    fill: "#faffef",
    stroke: "#cdff52",
    size: 40,
    displayName: "Type Project",
  },
  // eslint-disable-next-line camelcase
  sub_expertise: {
    fill: "#f0fdff",
    stroke: "#9AECFE",
    size: 50,
    displayName: "Expertise",
  },
  Project: {
    fill: "#FDFFDC",
    stroke: "#FAE289",
    size: 70,
    displayName: "Project",
  },
  Role: {
    fill: "#E8FBDA",
    stroke: "#C8F4A4",
    size: 60,
    displayName: "Role",
  },
  disabledNode: {
    fill: "#E8EBED",
    stroke: "#505C68",
    size: 25,
    displayName: "Disabled Nodes",
  },
};
//  -------------- Graph Node Settings ------------

//  -------------- Graph Functions ------------
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
      outDiv.innerHTML = `name：${model.propertise.name}<br/>type：${model.type}`;

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
          default: ["drag-canvas", "zoom-canvas", "activate-relations"],
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
          type: "force",
          edgeStrength: 0.6,
          preventOverlap: true,
          linkDistance: (d) => {
            // Change dinamicaloly the distance based on the number of connections
            let numConnections = 0;

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
            // return 150;
            return initDistance + Math.floor(Math.random() * randomDistance);
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
      if (data2.nodes.length != 1) updateNodes(data2);

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

    data.nodes.forEach(function (node) {
      if (!node) return;

      let nodeType = node.type;

      if (node.disabledNode == true) {
        nodeType = "disabledNode";
      }

      // -------- Change stype based on Type of Node -------
      if (nodeType && nodeTypeStyle[nodeType]) {
        graph.updateItem(node.id, {
          size: nodeTypeStyle[nodeType].size,
          style: {
            fill: nodeTypeStyle[nodeType].fill,
            stroke: nodeTypeStyle[nodeType].stroke,
            lineWidth: 1,
          },
        });
      }
      // -------- Change stype based on Type of Node -------

      // -------- Change label of Node -------
      if (node) {
        prepareLabelOfNode(node, globalFontSize);
      }
      // -------- Change label of Node -------

      const typeNowStyle = nodeTypeStyle[nodeType];

      // -------- Create the Menue of Graph -------
      if (itemsObj[nodeType] == undefined) {
        itemsObj[nodeType] = {
          res: typeNowStyle,
        };
        items.push({
          id: items.length,
          name: typeNowStyle?.displayName,
          fill: typeNowStyle?.fill,
          stroke: typeNowStyle?.stroke,
          type: nodeType,
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

    const type = checkedItems[itemId].type;

    const addNodesObj = {};

    data2.nodes.forEach(function (node) {
      let nodeType = node.type;

      if (node.disabledNode == true) {
        nodeType = "disabledNode";
      }
      if (nodeType == type) {
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

  return (
    <>
      {data2.nodes.length == 1 ? <div>loading</div> : true}
      <div ref={ref}></div>
      <div className="flex flex-col">
        {items.map((item, idx) => (
          <div key={item.id} className="flex items-center my-2">
            <button
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
                <span style={{ color: item.fill }}> N</span>
              )}
            </button>
            <div className={`ml-2 text-${item.colorsa}-500`}>{item.name}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default G6component;
