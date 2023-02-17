import React from "react";

// interface Props {}

// interface Props {
//   selectedOption: string;
//   setSelectedOption: (newValue: string) => void;
//   setSelectedOption: (newValue: string) => void;
// }

const presetNodesID = [
  "637a9133b8953f12f501e0d6",
  // "637a9135b8953f12f501e118",
  // "637a9134b8953f12f501e0f7",
  "637a914ab8953f12f501e1ca",
  "637a9151b8953f12f501e2aa",
  "637a913fb8953f12f501e1af",
  "63d1ad93a90f12cef67a7c7b",
];

const MenuOption = (props: any) => {
  // console.log("props.settingsGraphs.simpleDetail = ", props.settingsGraphs);
  return (
    <div>
      <div>
        <label style={{ margin: "10px" }}>
          <input
            type="radio"
            name="menuOption"
            value="Option 1"
            checked={props.selectedOption === "Option 1"}
            onChange={(e) => props.setSelectedOption(e.target.value)}
          />
          Test Graph
        </label>
        <label style={{ margin: "10px" }}>
          <input
            type="radio"
            name="menuOption"
            value="Option 2"
            checked={props.selectedOption === "Option 2"}
            onChange={(e) => props.setSelectedOption(e.target.value)}
          />
          Member to Project Graph
        </label>
        <label style={{ margin: "10px" }}>
          <input
            type="radio"
            name="menuOption"
            value="Option 3"
            checked={props.selectedOption === "Option 3"}
            onChange={(e) => props.setSelectedOption(e.target.value)}
          />
          Member Graph
        </label>
        <label style={{ margin: "10px" }}>
          <input
            type="radio"
            name="menuOption"
            value="Option 4"
            checked={props.selectedOption === "Option 4"}
            onChange={(e) => props.setSelectedOption(e.target.value)}
          />
          Project Graph
        </label>
        <label style={{ margin: "10px" }}>
          <input
            type="radio"
            name="menuOption"
            value="Option 5"
            checked={props.selectedOption === "Option 5"}
            onChange={(e) => props.setSelectedOption(e.target.value)}
          />
          Big Graph
        </label>
        <label style={{ margin: "10px" }}>
          <input
            type="radio"
            name="menuOption"
            value="Option 6"
            checked={props.selectedOption === "Option 6"}
            onChange={(e) => props.setSelectedOption(e.target.value)}
          />
          Dynamic Search to Project Graph
        </label>
        <label style={{ margin: "10px" }}>
          <input
            type="radio"
            name="menuOption"
            value="Option 7"
            checked={props.selectedOption === "Option 7"}
            onChange={(e) => props.setSelectedOption(e.target.value)}
          />
          Dynamic Search to Member Graph
        </label>
        <label style={{ margin: "10px" }}>
          <input
            type="radio"
            name="menuOption"
            value="Option 8"
            checked={props.selectedOption === "Option 8"}
            onChange={(e) => props.setSelectedOption(e.target.value)}
          />
          Dynamic Search Graph
        </label>
        {props.selectedOption === "Option 1" && (
          <div>
            <label htmlFor="checkbox" style={{ paddingRight: "10px" }}>
              Show Avatar:
            </label>
            <input
              style={{ padding: "10px" }}
              id="checkbox"
              type="checkbox"
              checked={props.settingsGraphs.useAvatar}
              onChange={() =>
                props.updateSettings({
                  ...props.settingsGraphs,
                  useAvatar: !props.settingsGraphs.useAvatar,
                  updateGraph: true,
                })
              }
            />
          </div>
        )}
        {props.selectedOption === "Option 2" && (
          <div>
            <div>
              <label htmlFor="checkbox" style={{ paddingRight: "10px" }}>
                Show Avatar:
              </label>
              <input
                style={{ padding: "10px" }}
                id="checkbox"
                type="checkbox"
                checked={props.settingsGraphs.useAvatar}
                onChange={() =>
                  props.updateSettings({
                    ...props.settingsGraphs,
                    useAvatar: !props.settingsGraphs.useAvatar,
                    updateGraph: true,
                  })
                }
              />
            </div>
            <br />
            <label htmlFor="input1" style={{ paddingRight: "10px" }}>
              Member ID:
            </label>
            <input
              id="input1"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid gray",
                fontSize: "0.8em",
                width: "200px",
              }}
              type="text"
              value={props.settingsGraphs.memberID1}
              onChange={(e) =>
                props.updateSettings({
                  ...props.settingsGraphs,
                  memberID1: e.target.value,
                  updateGraph: false,
                })
              }
            />
            <br />
            <label htmlFor="input1" style={{ paddingRight: "10px" }}>
              Project ID:
            </label>
            <input
              id="input1"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid gray",
                fontSize: "0.8em",
                width: "200px",
              }}
              type="text"
              value={props.settingsGraphs.projectID1}
              onChange={(e) =>
                props.updateSettings({
                  ...props.settingsGraphs,
                  projectID1: e.target.value,
                  updateGraph: false,
                })
              }
            />
          </div>
        )}
        {props.selectedOption === "Option 3" && (
          <div>
            <div>
              <label htmlFor="checkbox" style={{ paddingRight: "10px" }}>
                Show Avatar:
              </label>
              <input
                style={{ padding: "10px" }}
                id="checkbox"
                type="checkbox"
                checked={props.settingsGraphs.useAvatar}
                onChange={() =>
                  props.updateSettings({
                    ...props.settingsGraphs,
                    useAvatar: !props.settingsGraphs.useAvatar,
                    updateGraph: true,
                  })
                }
              />
            </div>
            <br />
            <label htmlFor="input1" style={{ paddingRight: "10px" }}>
              MemberID:
            </label>
            <input
              id="input1"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid gray",
                fontSize: "0.8em",
                width: "200px",
              }}
              type="text"
              value={props.settingsGraphs.memberID1}
              onChange={(e) =>
                props.updateSettings({
                  ...props.settingsGraphs,
                  memberID1: e.target.value,
                })
              }
            />
            {/* <div>
              <form>
                <div>
                  <input
                    type="radio"
                    id="Simple"
                    value="Simple"
                    checked={props.settingsGraphs.simpleDetail == "Simple"}
                    onChange={(e) =>
                      props.updateSettings({
                        ...props.settingsGraphs,
                        simpleDetail: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="option1">Simple</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="Detailed"
                    value="Detailed"
                    checked={props.settingsGraphs.simpleDetail == "Detailed"}
                    onChange={(e) =>
                      props.updateSettings({
                        ...props.settingsGraphs,
                        simpleDetail: e.target.value,
                      })
                    }
                  />
                  <label htmlFor="option2">Detailed</label>
                </div>
              </form>
            </div> */}
          </div>
        )}
        {props.selectedOption === "Option 4" && (
          <div>
            <br />
            <div>
              <label htmlFor="checkbox" style={{ paddingRight: "10px" }}>
                Show Avatar:
              </label>
              <input
                style={{ padding: "10px" }}
                id="checkbox"
                type="checkbox"
                checked={props.settingsGraphs.useAvatar}
                onChange={() =>
                  props.updateSettings({
                    ...props.settingsGraphs,
                    useAvatar: !props.settingsGraphs.useAvatar,
                    updateGraph: true,
                  })
                }
              />
            </div>
            <br />
            <label htmlFor="input1" style={{ paddingRight: "10px" }}>
              Project ID:
            </label>
            <input
              id="input1"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid gray",
                fontSize: "0.8em",
                width: "200px",
              }}
              type="text"
              value={props.settingsGraphs.projectID1}
              onChange={(e) =>
                props.updateSettings({
                  ...props.settingsGraphs,
                  projectID1: e.target.value,
                })
              }
            />
          </div>
        )}
        {props.selectedOption === "Option 5" && (
          <div>
            <label htmlFor="checkbox" style={{ paddingRight: "10px" }}>
              Show Avatar:
            </label>
            <input
              style={{ padding: "10px" }}
              id="checkbox"
              type="checkbox"
              checked={props.settingsGraphs.useAvatar}
              onChange={() =>
                props.updateSettings({
                  ...props.settingsGraphs,
                  useAvatar: !props.settingsGraphs.useAvatar,
                  updateGraph: true,
                })
              }
            />
          </div>
        )}
        {props.selectedOption === "Option 6" && (
          <div>
            <label htmlFor="input1" style={{ paddingRight: "10px" }}>
              Project ID:
            </label>
            <input
              id="input1"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid gray",
                fontSize: "0.8em",
                width: "200px",
              }}
              type="text"
              value={props.settingsGraphs.projectID1}
              onChange={(e) =>
                props.updateSettings({
                  ...props.settingsGraphs,
                  projectID1: e.target.value,
                  updateGraph: false,
                })
              }
            />
            <button
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white shadow hover:bg-blue-700"
              onClick={() => {
                const nodesIDnew = props.settingsGraphs.nodesID;

                console.log(
                  "nodesIDnew = ",
                  nodesIDnew,
                  props.settingsGraphs.nodePresetPos,
                  presetNodesID[props.settingsGraphs.nodePresetPos]
                );
                if (presetNodesID.length > props.settingsGraphs.nodePresetPos) {
                  nodesIDnew.push(
                    presetNodesID[props.settingsGraphs.nodePresetPos]
                  );

                  console.log("nodesIDnew = ", nodesIDnew);
                }
                props.updateSettings({
                  ...props.settingsGraphs,
                  nodesID: nodesIDnew,
                  nodePresetPos: props.settingsGraphs.nodePresetPos + 1,
                });
              }}
            >
              Add Nodes
            </button>
          </div>
        )}
        {props.selectedOption === "Option 7" && (
          <div>
            <label htmlFor="input1" style={{ paddingRight: "10px" }}>
              Member ID:
            </label>
            <input
              id="input1"
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid gray",
                fontSize: "0.8em",
                width: "200px",
              }}
              type="text"
              value={props.settingsGraphs.memberID1}
              onChange={(e) =>
                props.updateSettings({
                  ...props.settingsGraphs,
                  memberID1: e.target.value,
                  updateGraph: false,
                })
              }
            />
            <button
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white shadow hover:bg-blue-700"
              onClick={() => {
                const nodesIDnew = props.settingsGraphs.nodesID;

                console.log(
                  "nodesIDnew = ",
                  nodesIDnew,
                  props.settingsGraphs.nodePresetPos,
                  presetNodesID[props.settingsGraphs.nodePresetPos]
                );
                if (presetNodesID.length > props.settingsGraphs.nodePresetPos) {
                  nodesIDnew.push(
                    presetNodesID[props.settingsGraphs.nodePresetPos]
                  );

                  console.log("nodesIDnew = ", nodesIDnew);
                }
                props.updateSettings({
                  ...props.settingsGraphs,
                  nodesID: nodesIDnew,
                  nodePresetPos: props.settingsGraphs.nodePresetPos + 1,
                });
              }}
            >
              Add Nodes
            </button>
          </div>
        )}
        {props.selectedOption === "Option 8" && (
          <div>
            <button
              className="rounded bg-blue-500 py-2 px-4 font-bold text-white shadow hover:bg-blue-700"
              onClick={() => {
                const nodesIDnew = props.settingsGraphs.nodesID;

                console.log(
                  "nodesIDnew = ",
                  nodesIDnew,
                  props.settingsGraphs.nodePresetPos,
                  presetNodesID[props.settingsGraphs.nodePresetPos]
                );
                if (presetNodesID.length > props.settingsGraphs.nodePresetPos) {
                  nodesIDnew.push(
                    presetNodesID[props.settingsGraphs.nodePresetPos]
                  );

                  console.log("nodesIDnew = ", nodesIDnew);
                }
                props.updateSettings({
                  ...props.settingsGraphs,
                  nodesID: nodesIDnew,
                  nodePresetPos: props.settingsGraphs.nodePresetPos + 1,
                });
              }}
            >
              Add Nodes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuOption;
