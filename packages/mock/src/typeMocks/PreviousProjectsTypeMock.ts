import { PreviousProjectsType } from "@eden/package-graphql/generated";
import { faker } from "@faker-js/faker";

export const getPreviousProjectsTypeMock = (): PreviousProjectsType => ({
  title: faker.name.firstName(),
  positionName: faker.name.jobTitle(),
  description: faker.lorem.paragraph(),
  link: "https://www.google.com",
  startDate: "1669870800000",
  endDate: "1659326400000",
  picture: faker.image.image(),
});

export const getPreviousProjectsTypeMockArray = (
  total: number
): PreviousProjectsType[] =>
  Array.from({ length: total }, () => getPreviousProjectsTypeMock());
