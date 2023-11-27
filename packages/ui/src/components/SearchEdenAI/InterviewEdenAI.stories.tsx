import { ComponentMeta, ComponentStory } from "@storybook/react";

import { AI_INTERVIEW_SERVICES, SearchEdenAI } from "./SearchEdenAI";

export default {
  title: "Components/SearchEdenAI",
  component: SearchEdenAI,
  argTypes: {},
} as ComponentMeta<typeof SearchEdenAI>;

const Template: ComponentStory<typeof SearchEdenAI> = (args) => (
  <SearchEdenAI {...args} />
);

export const Default = Template.bind({});
Default.args = { aiReplyService: AI_INTERVIEW_SERVICES.EDEN_GPT_REPLY };
