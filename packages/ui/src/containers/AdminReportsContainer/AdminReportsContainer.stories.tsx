import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AdminReportsContainer } from ".";

export default {
  title: "Archive/Containers/AdminReportsContainer",
  component: AdminReportsContainer,
  argTypes: {},
} as ComponentMeta<typeof AdminReportsContainer>;

const Template: ComponentStory<typeof AdminReportsContainer> = (args) => (
  <AdminReportsContainer {...args} />
);

export const Default = Template.bind({});
Default.args = {};

// export type MatchSkillsToProjectsOutput = {
//   __typename?: "matchSkillsToProjectsOutput";
//   commonSkills?: Maybe<Array<Maybe<Skills>>>;
//   matchPercentage?: Maybe<Scalars["Float"]>;
//   project?: Maybe<Project>;
//   projectRoles?: Maybe<Array<Maybe<MatchProjectRoles>>>;
// };
