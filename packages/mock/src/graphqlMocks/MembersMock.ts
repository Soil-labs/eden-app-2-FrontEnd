import { Members } from "@eden/package-graphql/generated";
import { faker } from "@faker-js/faker";

import { memberBio } from "../data";
import {
  getEndorsementsTypeMockArray,
  getLinkTypeMock,
  getNodesTypeMockArray,
  getPreviousProjectsTypeMockArray,
  getProjectMemberTypeMockArray,
  getRoleTemplateTypeMock,
  getSkillTypeMemberMockArray,
} from "../typeMocks";

export const getMember = (): Members => ({
  _id: "12345",
  // _id: String(faker.random.numeric(5)),
  attributes: {
    Coordinator: Number(faker.random.numeric(1)),
    Director: Number(faker.random.numeric(1)),
    Helper: Number(faker.random.numeric(1)),
    Inspirer: Number(faker.random.numeric(1)),
    Motivator: Number(faker.random.numeric(1)),
    Observer: Number(faker.random.numeric(1)),
    Reformer: Number(faker.random.numeric(1)),
    Supporter: Number(faker.random.numeric(1)),
  },
  bio: faker.helpers.uniqueArray(memberBio, 1)[0].bio,
  content: {
    interest: faker.lorem.lines(),
    mostProud: faker.lorem.sentences(5),
    showCaseAbility: faker.lorem.sentences(4),
  },
  discordAvatar: faker.internet.avatar(),
  discordName: faker.internet.userName(),
  discriminator: faker.random.numeric(4),
  hoursPerWeek: faker.datatype.number({ min: 5, max: 36, precision: 1 }),
  interest: faker.lorem.paragraph(),
  links: getLinkTypeMock,
  memberRole: getRoleTemplateTypeMock(),
  previousProjects: getPreviousProjectsTypeMockArray(3),
  projects: getProjectMemberTypeMockArray(14),
  serverID: Array.from(
    { length: faker.datatype.number({ min: 2, max: 8, precision: 1 }) },
    () => faker.random.numeric(12)
  ),
  skills: getSkillTypeMemberMockArray(
    faker.datatype.number({ min: 2, max: 36, precision: 1 })
  ),
  nodes: getNodesTypeMockArray(
    faker.datatype.number({ min: 2, max: 24, precision: 1 })
  ),
  endorsements: getEndorsementsTypeMockArray(
    faker.datatype.number({ min: 2, max: 20, precision: 1 })
  ),
  timeZone: faker.address.timeZone(),
});

export const getMemberArray = (total: number): Members[] =>
  Array.from({ length: total }, () => getMember());

export const getMemberLite = (): Members => ({
  _id: String(faker.random.numeric(5)),
  bio: faker.helpers.uniqueArray(memberBio, 1)[0].bio,
  discordAvatar: faker.internet.avatar(),
  discordName: faker.internet.userName(),
  discriminator: faker.random.numeric(4),
  hoursPerWeek: faker.datatype.number({ min: 5, max: 36, precision: 1 }),
  interest: faker.lorem.paragraph(),
  links: getLinkTypeMock,
  memberRole: getRoleTemplateTypeMock(),
  previousProjects: getPreviousProjectsTypeMockArray(3),
  projects: getProjectMemberTypeMockArray(
    faker.datatype.number({ min: 2, max: 5, precision: 1 })
  ),
  serverID: Array.from(
    { length: faker.datatype.number({ min: 2, max: 8, precision: 1 }) },
    () => faker.random.numeric(12)
  ),
  nodes: getNodesTypeMockArray(
    faker.datatype.number({ min: 2, max: 24, precision: 1 })
  ),
  endorsements: getEndorsementsTypeMockArray(
    faker.datatype.number({ min: 2, max: 6, precision: 1 })
  ),
  timeZone: faker.address.timeZone(),
});

export const getMemberLiteArray = (total: number): Members[] =>
  Array.from({ length: total }, () => getMemberLite());
