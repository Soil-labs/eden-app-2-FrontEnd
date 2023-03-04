interface styleData {
  fill: string;
  stroke: string;
  size: number;
  displayName: string;
  sizeRatio: number;
  order?: number;
}

interface mockData {
  Member: styleData;
  sub_typeProject: styleData;
  typeProject: styleData;
  sub_expertise: styleData;
  expertise: styleData;
  Project: styleData;
  Role: styleData;
  skill: styleData;
  disabledNode: styleData;
}

export const nodeTypeStyle: mockData = {
  Project: {
    fill: "#F9FEE6",
    stroke: "#CBFD50",
    size: 75,
    displayName: "Project",
    sizeRatio: 1,
    order: 1,
  },
  Member: {
    fill: "#f9efff",
    stroke: "#bf55ff",
    size: 90,
    displayName: "Member",
    sizeRatio: 0.3,
    order: 2,
  },
  Role: {
    fill: "#FCF8ED",
    stroke: "#F4BC67",
    size: 60,
    displayName: "Roles",
    sizeRatio: 0.8,
    order: 3,
  },
  typeProject: {
    fill: "#FBF1F2",
    stroke: "#EC7E8B",
    size: 40,
    displayName: "Interest Category",
    sizeRatio: 0.15,
    order: 4,
  },
  // eslint-disable-next-line camelcase
  sub_typeProject: {
    fill: "#FBEDEC",
    stroke: "#F3B8B4",
    size: 20,
    displayName: "Interest",
    sizeRatio: 0.05,
    order: 5,
  },
  // eslint-disable-next-line camelcase
  expertise: {
    fill: "#E7F1FD",
    stroke: "#3882F5",
    size: 40,
    displayName: "Expertise Category",
    sizeRatio: 0.25,
    order: 6,
  },
  // eslint-disable-next-line camelcase
  sub_expertise: {
    fill: "#E8F6F9",
    stroke: "#49A7CD",
    size: 25,
    displayName: "Expertise",
    sizeRatio: 0.15,
    order: 7,
  },
  skill: {
    fill: "#F8FCFF",
    stroke: "#C2F1FB",
    size: 25,
    displayName: "Skill",
    sizeRatio: 0.15,
    order: 8,
  },
  disabledNode: {
    fill: "#E8EBED",
    stroke: "#505C68",
    size: 25,
    displayName: "Disabled Nodes",
    sizeRatio: 0,
  },
};
