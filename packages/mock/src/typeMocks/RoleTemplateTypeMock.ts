import { RoleTemplate } from "@eden/package-graphql/generated";
import { faker } from "@faker-js/faker";

import { roleTemplates } from "../data";
import { getSkillsTypeMockArray } from "./";

export const getRoleTemplateTypeMock = (): RoleTemplate => ({
  _id: String(faker.random.numeric(5)),
  description: faker.lorem.paragraph(),
  // title: faker.name.firstName(),
  title: faker.helpers.uniqueArray(roleTemplates, 1)[0].title,
  skills: getSkillsTypeMockArray(Number(faker.random.numeric(1))),
});

export const getRoleTemplateTypeMockArray = (total: number): RoleTemplate[] =>
  Array.from({ length: total }, () => getRoleTemplateTypeMock());
