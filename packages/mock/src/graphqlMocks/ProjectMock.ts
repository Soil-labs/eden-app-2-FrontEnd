import { PhaseType, Project } from "@eden/package-graphql/generated";
import { faker } from "@faker-js/faker";

import { phase, projectData } from "../data";
import { getRoleTypeMockArray, getTeamTypeMockArray } from "../typeMocks";
import { getMemberLite } from "./MembersMock";

export const randomTeamType = () =>
  Array.from(
    { length: faker.datatype.number({ min: 4, max: 12, precision: 1 }) },
    () => {
      return {
        _id: String(faker.random.numeric(5)),
        phase: faker.helpers.arrayElements(phase, 1)[0] as PhaseType,
        memberInfo: getMemberLite(),
      };
    }
  );

export const getProject = (): Project => ({
  _id: String(faker.random.numeric(5)),
  ...faker.helpers.uniqueArray(projectData, 1)[0],
  emoji: faker.internet.emoji(),
  backColorEmoji: faker.color.rgb({ prefix: "#" }),
  budget: {
    perHour: faker.finance.amount(0, 100, 2),
    token: faker.finance.amount(0, 100, 2),
    totalBudget: faker.finance.amount(0, 100, 2),
  },
  champion: getMemberLite(),
  collaborationLinks: [
    {
      link: "https://twitter.com/edenprotocolxyz",
      title: "twitter",
    },
    {
      link: "https://github.com",
      title: "github",
    },
    {
      link: "https://www.notion.so/",
      title: "notion",
    },
  ],
  dates: {
    complition: "1662161995158",
    kickOff: "1662161995158",
  },
  team: randomTeamType(),
  // eslint-disable-next-line camelcase
  garden_teams: getTeamTypeMockArray(Number(faker.random.numeric(1))),
  role: getRoleTypeMockArray(
    faker.datatype.number({ min: 1, max: 5, precision: 1 })
  ),
  serverID: Array.from(
    { length: faker.datatype.number({ min: 2, max: 6, precision: 1 }) },
    () => faker.random.numeric(12)
  ),
  __typename: "Project",
});

export const getProjectArray = (total: number) =>
  Array.from({ length: total }, () => getProject());
