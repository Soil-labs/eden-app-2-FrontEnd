import iro from "@jaames/iro";
import { IroColorPicker } from "@jaames/iro/dist/ColorPicker";
import { useCallback, useEffect, useRef } from "react";

import { hexRgb, rgbHex } from "./color";

export interface ColorPickerProps {
  className?: string;
  value?: string;
  width?: number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (color: string) => void;
}

export const ColorPicker = ({
  width = 200,
  value = "rgb(255, 0, 0)",
  onChange,
}: ColorPickerProps) => {
  const colorPickerRef = useRef<IroColorPicker | null>(null);

  const onColorChange = useCallback(
    (color: iro.Color) => {
      onChange?.(color.rgbString);
    },
    [onChange]
  );

  const elementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || colorPickerRef.current) {
        return;
      }

      const colorPicker = iro.ColorPicker(node, {
        width,
        color: value,
        layout: [{ component: iro.ui.Wheel }],
      });

      colorPicker.on("color:change", onColorChange);
      colorPickerRef.current = colorPicker;
    },
    [onColorChange, value, width]
  );

  useEffect(() => {
    colorPickerRef.current?.on("color:change", onColorChange);
    return () => {
      colorPickerRef.current?.off("color:change", onColorChange);
    };
  }, [onColorChange]);

  useEffect(() => {
    colorPickerRef.current?.color.set(value);
  }, [value]);

  return (
    <>
      <div ref={elementRef} />
      <input
        className="sr-only"
        type="color"
        aria-label="project color"
        value={rgbHex(value)}
        onChange={(event) => {
          const color = hexRgb(event.target.value);

          onChange?.(color);
        }}
      />
    </>
  );
};
