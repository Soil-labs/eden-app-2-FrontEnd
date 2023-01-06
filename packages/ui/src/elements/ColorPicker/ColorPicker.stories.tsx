import { ComponentMeta } from "@storybook/react";
import { useState } from "react";

import { ColorPicker } from "./ColorPicker";

export default {
  title: "Elements/ColorPicker",
  component: ColorPicker,
  argTypes: {},
} as ComponentMeta<typeof ColorPicker>;

export const Default = () => {
  const [value, setValue] = useState("rgb(255,0,0)");

  return <ColorPicker onChange={(color) => setValue(color)} value={value} />;
};
