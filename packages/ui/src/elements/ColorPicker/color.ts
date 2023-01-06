// Thanks to github.com/sindresorhus and the `hex-rgb`+`rgb-hex` libraries for
// inspiration and some of the code here

const rgbRe = /rgb\((\d{1,3})[, ]*(\d{1,3})[, ]+(\d{1,3})\)/;

/**
 * Converts an `rgb` string (`rgb(255, 120, 255)`) to hex
 */
export const rgbHex = (rgb: string) => {
  const match = rgb.match(rgbRe)!;
  const [, r, g, b] = [...match];

  const hex = (
    parseInt(b) |
    (parseInt(g) << 8) |
    (parseInt(r) << 16) |
    (1 << 24)
  )
    .toString(16)
    .slice(1);

  return `#${hex}`;
};

/**
 * Converts a hex string to an `rgb` string
 */
export const hexRgb = (hex: string) => {
  // remove the '#' prefix
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const number = Number.parseInt(hex, 16);
  const red = number >> 16;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgb(${red},${green},${blue})`;
};
