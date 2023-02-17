import { RoleType } from "@eden/package-graphql/generated";
import { faker } from "@faker-js/faker";

import { roleTemplates } from "../data";
import { getNodesTypeMockArray, getSkillRoleTypeMockArray } from "./";

export const getRoleTypeMock = (): RoleType => ({
  _id: String(faker.random.numeric(5)),
  archive: faker.datatype.boolean(),
  budget: {
    perHour: faker.finance.amount(0, 100, 2),
    token: "CODE",
    totalBudget: faker.finance.amount(0, 100, 2),
  },
  dateRangeEnd: "1662161995158",
  dateRangeStart: "1662161995158",
  description: faker.lorem.sentences(5),
  shortDescription: faker.lorem.sentences(1),
  keyResponsibilities: faker.lorem.sentences(4),
  openPositions: faker.datatype.number({ min: 1, max: 6, precision: 1 }),
  skills: getSkillRoleTypeMockArray(
    faker.datatype.number({ min: 1, max: 10, precision: 1 })
  ),
  benefits: Array.from(
    { length: faker.datatype.number({ min: 1, max: 5, precision: 1 }) },
    () => faker.lorem.sentences(1)
  ),
  expectations: Array.from(
    { length: faker.datatype.number({ min: 1, max: 5, precision: 1 }) },
    () => faker.lorem.sentences(1)
  ),
  title: faker.helpers.uniqueArray(roleTemplates, 1)[0].title,
  hoursPerWeek: faker.datatype.number({ min: 1, max: 40, precision: 1 }),
  ratePerHour: faker.datatype.number({ min: 30, max: 90, precision: 1 }),
  nodes: getNodesTypeMockArray(
    faker.datatype.number({ min: 2, max: 20, precision: 1 })
  ),
});

export const getRoleTypeMockArray = (total: number): RoleType[] =>
  Array.from({ length: total }, () => getRoleTypeMock());
