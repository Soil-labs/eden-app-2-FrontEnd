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
  "Skill|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Skill",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 100,
          strength: 0.5,
        },
      },
    },
  },
  "Skill|Expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Skill",
        nodeTypeTarget: "Expertise",
        style: {
          color: "#E0E0E0",
          distance: 100,
          strength: 0.5,
        },
      },
    },
  },
  "dynamicSearch|Combo": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Combo",
        style: {
          color: "#F5F5F5",
          distance: 170,
          strength: 0.5,
        },
      },
    },
  },
  "Skill|Combo": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Skill",
        nodeTypeTarget: "Combo",
        style: {
          color: "#F5F5F5",
          distance: 200,
          strength: 0.5,
        },
      },
    },
  },
  "Expertise|Combo": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Expertise",
        nodeTypeTarget: "Combo",
        style: {
          color: "#F5F5F5",
          distance: 200,
          strength: 0.5,
        },
      },
    },
  },
  "Role|Combo": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Role",
        nodeTypeTarget: "Combo",
        style: {
          color: "#F5F5F5",
          distance: 200,
          strength: 0.5,
        },
      },
    },
  },
  "Member|Combo": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "Combo",
        style: {
          color: "#F5F5F5",
          distance: 160,
          strength: 0.5,
        },
      },
    },
  },
  "Role|Expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Role",
        nodeTypeTarget: "Expertise",
        style: {
          color: "#E0E0E0",
          distance: 100,
          strength: 0.5,
        },
      },
    },
  },
  "Skill|Skill": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Skill",
        nodeTypeTarget: "Skill",
        style: {
          color: "#E0E0E0",
          distance: 100,
          strength: 0.5,
        },
      },
    },
  },
  "Expertise|Expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Expertise",
        nodeTypeTarget: "Expertise",
        style: {
          color: "#E0E0E0",
          distance: 100,
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
          distance: 85,
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
          distance: 110,
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
    expertise_close: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "Member",
        style: {
          color: "#E0E0E0",
          distance: 90,
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
    edge_close: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "dynamicSearch",
        style: {
          color: "#E0E0E0",
          distance: 85,
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
  "Member|Skill": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "Skill",
        style: {
          color: "#E0E0E0",
          distance: 90,
          strength: 0.5,
        },
      },
    },
    long: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "Skill",
        style: {
          color: "#E0E0E0",
          distance: 170,
          strength: 0.5,
        },
      },
    },
  },
  "Member|Expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "Expertise",
        style: {
          color: "#E0E0E0",
          distance: 90,
          strength: 0.5,
        },
      },
    },
    long: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "Expertise",
        style: {
          color: "#E0E0E0",
          distance: 170,
          strength: 0.5,
        },
      },
    },
  },
  "Member|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 90,
          strength: 0.5,
        },
      },
    },
    long: {
      mainEdge: {
        nodeTypeSource: "Member",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 160,
          strength: 0.5,
        },
      },
    },
  },
  "dynamicSearch|SubSector": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "SubSector",
        style: {
          color: "#E0E0E0",
          distance: 70,
          strength: 0.5,
        },
      },
    },
    longEdge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "SubSector",
        style: {
          color: "#E0E0E0",
          distance: 135,
          strength: 0.5,
        },
      },
    },
  },
  "dynamicSearch|Sector": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Sector",
        style: {
          color: "#E0E0E0",
          distance: 70,
          strength: 0.5,
        },
      },
    },
    longEdge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Sector",
        style: {
          color: "#E0E0E0",
          distance: 135,
          strength: 0.5,
        },
      },
    },
  },
  "dynamicSearch|Industry": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Industry",
        style: {
          color: "#E0E0E0",
          distance: 70,
          strength: 0.5,
        },
      },
    },
    longEdge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Industry",
        style: {
          color: "#E0E0E0",
          distance: 135,
          strength: 0.5,
        },
      },
    },
  },
  "dynamicSearch|Skill": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Skill",
        style: {
          color: "#E0E0E0",
          distance: 70,
          strength: 0.5,
        },
      },
    },
    longEdge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Skill",
        style: {
          color: "#E0E0E0",
          distance: 118,
          strength: 0.5,
        },
      },
    },
  },
  "dynamicSearch|Expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Expertise",
        style: {
          color: "#E0E0E0",
          distance: 70,
          strength: 0.5,
        },
      },
    },
    longEdge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Expertise",
        style: {
          color: "#E0E0E0",
          distance: 118,
          strength: 0.5,
        },
      },
    },
  },
  "dynamicSearch|Category": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Category",
        style: {
          color: "#E0E0E0",
          distance: 70,
          strength: 0.5,
        },
      },
    },
    longEdge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Category",
        style: {
          color: "#E0E0E0",
          distance: 118,
          strength: 0.5,
        },
      },
    },
  },
  "dynamicSearch|Role": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 70,
          strength: 0.5,
        },
      },
    },
    longEdge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Role",
        style: {
          color: "#E0E0E0",
          distance: 118,
          strength: 0.5,
        },
      },
    },
  },
  "dynamicSearch|Group": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Group",
        style: {
          color: "#E0E0E0",
          distance: 70,
          strength: 0.5,
        },
      },
    },
    longEdge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Group",
        style: {
          color: "#E0E0E0",
          distance: 118,
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
    edge_close: {
      mainEdge: {
        nodeTypeSource: "sub_typeProject",
        nodeTypeTarget: "dynamicSearch",
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
  "sub_expertise|sub_expertise": {
    edge: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
        nodeTypeTarget: "sub_expertise",
        style: {
          color: "#E0E0E0",
          distance: 110,
          strength: 0.5,
        },
      },
    },
    hiddenEdge: {
      mainEdge: {
        nodeTypeSource: "sub_expertise",
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
  "dynamicSearch|Member": {
    edge: {
      mainEdge: {
        nodeTypeSource: "dynamicSearch",
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
        nodeTypeSource: "dynamicSearch",
        nodeTypeTarget: "Member",
        style: {
          color: "#FFFFFF",
          distance: 280,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
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
          distance: 330,
          strength: 0.5,
        },
      },
      hiddenEdge: true,
    },
  },
};
