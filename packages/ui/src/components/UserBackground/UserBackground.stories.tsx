import {
  getEndorsementsTypeMockArray,
  getPreviousProjectsTypeMockArray,
} from "@eden/package-mock";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useState } from "react";

import { UserBackground } from "./UserBackground";

export default {
  title: "Components/UserBackground",
  component: UserBackground,
  argTypes: {},
} as ComponentMeta<typeof UserBackground>;

const Template: ComponentStory<typeof UserBackground> = (args) => {
  const [experienceOpen, setExperienceOpen] = useState<number | null>(null);

  return (
    <UserBackground
      {...args}
      experienceOpen={experienceOpen}
      setExperienceOpen={setExperienceOpen}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  background: getPreviousProjectsTypeMockArray(3),
  initialEndorsements: getEndorsementsTypeMockArray(3),
};
