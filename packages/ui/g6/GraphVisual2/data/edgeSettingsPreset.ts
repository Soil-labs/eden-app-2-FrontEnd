/* eslint-disable camelcase */
export const edgeSettingsPreset = {
  "skill|Member": {
    edge: {
      mainEdge: {
        nodeTypeSource: "skill",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 170,
          strength: 0.5,
        },
      },
    },
    sub_expertise: {
      mainEdge: {
        nodeTypeSource: "skill",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 200,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "skill",
          nodeTypeMiddle: "sub_expertise",
          nodeTypeTarget: "Member",
        },
      ],
    },
    doubleSplitEdge: {
      mainEdge: {
        nodeTypeSource: "skill",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 200,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "skill",
          nodeTypeMiddle: "sub_expertise",
          nodeTypeTarget: "expertise",
        },
        {
          nodeTypeSource: "sub_expertise",
          nodeTypeMiddle: "expertise",
          nodeTypeTarget: "Member",
        },
      ],
    },
  },
  "skill|dynamicSearch": {
    edge: {
      mainEdge: {
        nodeTypeSource: "skill",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 170,
          strength: 0.5,
        },
      },
    },
    sub_expertise: {
      mainEdge: {
        nodeTypeSource: "skill",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 200,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "skill",
          nodeTypeMiddle: "sub_expertise",
          nodeTypeTarget: "dynamicSearch",
        },
      ],
    },
    doubleSplitEdge: {
      mainEdge: {
        nodeTypeSource: "skill",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 200,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "skill",
          nodeTypeMiddle: "sub_expertise",
          nodeTypeTarget: "expertise",
        },
        {
          nodeTypeSource: "sub_expertise",
          nodeTypeMiddle: "expertise",
          nodeTypeTarget: "dynamicSearch",
        },
      ],
    },
  },
  "skill|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "skill",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 170,
          strength: 0.5,
        },
      },
    },
  },
  "skill|sub_expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "skill",
        nodeTypeTarget: "sub_expertise",
        style: {
          color: "#E0E0E0",
          distance: 60,
          strength: 0.5,
        },
      },
    },
  },
  "sub_expertise|expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "expertise",
        style: {
          color: "#E0E0E0",
          distance: 95,
          strength: 0.5,
        },
      },
    },
  },
  "expertise|Member": {
    edge: {
      mainEdge: {
        nodeTypeSource: "expertise",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 170,
          strength: 0.5,
        },
      },
    },
  },
  "expertise|dynamicSearch": {
    edge: {
      mainEdge: {
        nodeTypeSource: "expertise",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 170,
          strength: 0.5,
        },
      },
    },
  },
  "sub_expertise|Member": {
    edge: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 200,
          strength: 0.5,
        },
      },
    },
    expertise: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 200,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "sub_expertise",
          nodeTypeMiddle: "expertise",
          nodeTypeTarget: "Member",
        },
      ],
    },
  },
  "sub_expertise|dynamicSearch": {
    edge: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 200,
          strength: 0.5,
        },
      },
    },
    expertise: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 200,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "sub_expertise",
          nodeTypeMiddle: "expertise",
          nodeTypeTarget: "dynamicSearch",
        },
      ],
    },
  },
  "sub_typeProject|typeProject": {
    edge: {
      mainEdge: {
        nodeTypeSource: "sub_typeProject",
        nodeTypeTarget: "typeProject",
        style: {
          color: "#E0E0E0",
          distance: 70,
          strength: 0.5,
        },
      },
    },
  },
  "Project|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 90,
          strength: 0.5,
        },
      },
    },
    edgeXL: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
  },
  "expertise|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "expertise",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 160,
          strength: 0.5,
        },
      },
    },
  },
  "sub_expertise|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 130,
          strength: 0.5,
        },
      },
    },
    expertise: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 200,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "sub_expertise",
          nodeTypeMiddle: "expertise",
          nodeTypeTarget: "Role",
        },
      ],
    },
  },
  "sub_typeProject|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "sub_typeProject",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    typeProject: {
      mainEdge: {
        nodeTypeSource: "sub_typeProject",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "sub_typeProject",
          nodeTypeMiddle: "typeProject",
          nodeTypeTarget: "Role",
        },
      ],
    },
  },
  "typeProject|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "typeProject",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 160,
          strength: 0.5,
        },
      },
    },
  },
  "typeProject|Member": {
    edge: {
      mainEdge: {
        nodeTypeSource: "typeProject",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 170,
          strength: 0.5,
        },
      },
    },
  },
  "typeProject|dynamicSearch": {
    edge: {
      mainEdge: {
        nodeTypeSource: "typeProject",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 170,
          strength: 0.5,
        },
      },
    },
  },
  "sub_typeProject|Member": {
    edge: {
      mainEdge: {
        nodeTypeSource: "sub_typeProject",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 110,
          strength: 0.5,
        },
      },
    },
    typeProject: {
      mainEdge: {
        nodeTypeSource: "sub_typeProject",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 110,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "sub_typeProject",
          nodeTypeMiddle: "typeProject",
          nodeTypeTarget: "Member",
        },
      ],
    },
  },
  "sub_typeProject|dynamicSearch": {
    edge: {
      mainEdge: {
        nodeTypeSource: "sub_typeProject",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 110,
          strength: 0.5,
        },
      },
    },
    typeProject: {
      mainEdge: {
        nodeTypeSource: "sub_typeProject",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 110,
          strength: 0.5,
        },
      },
      moreThanSplit: 2,
      splitEdge: [
        {
          nodeTypeSource: "sub_typeProject",
          nodeTypeMiddle: "typeProject",
          nodeTypeTarget: "dynamicSearch",
        },
      ],
    },
  },
  "Project|Member": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 110,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "Member",
        style: {
          color: "#FFFFFF",
          distance: 600,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "Project|dynamicSearch": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 110,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#FFFFFF",
          distance: 500,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "Role|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Role",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 110,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "Role",
        nodeTypeTarget: "Role",
        style: {
          color: "#FFFFFF",
          distance: 250,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "typeProject|expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "typeProject",
        nodeTypeTarget: "expertise",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "typeProject",
        nodeTypeTarget: "expertise",
        style: {
          color: "#FFFFFF",
          distance: 300,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "Role|expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Role",
        nodeTypeTarget: "expertise",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "Role",
        nodeTypeTarget: "expertise",
        style: {
          color: "#FFFFFF",
          distance: 250,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "Role|typeProject": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Role",
        nodeTypeTarget: "typeProject",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "Role",
        nodeTypeTarget: "typeProject",
        style: {
          color: "#FFFFFF",
          distance: 250,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "Project|expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "expertise",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "expertise",
        style: {
          color: "#FFFFFF",
          distance: 300,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "Project|typeProject": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "typeProject",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "Project",
        nodeTypeTarget: "typeProject",
        style: {
          color: "#FFFFFF",
          distance: 300,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "expertise|expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "expertise",
        nodeTypeTarget: "expertise",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "expertise",
        nodeTypeTarget: "expertise",
        style: {
          color: "#FFFFFF",
          distance: 300,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "expertise|typeProject": {
    edge: {
      mainEdge: {
        nodeTypeSource: "expertise",
        nodeTypeTarget: "typeProject",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "expertise",
        nodeTypeTarget: "typeProject",
        style: {
          color: "#FFFFFF",
          distance: 300,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "dynamicSearch|sub_expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "sub_expertise",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "sub_expertise",
        style: {
          color: "#FFFFFF",
          distance: 200,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "typeProject|sub_expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "typeProject",
        nodeTypeTarget: "sub_expertise",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "typeProject",
        nodeTypeTarget: "sub_expertise",
        style: {
          color: "#FFFFFF",
          distance: 200,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
  "Member|dynamicSearch": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 150,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#FFFFFF",
          distance: 230,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
    hiddenEdgeFar: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#FFFFFF",
          distance: 430,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
};
