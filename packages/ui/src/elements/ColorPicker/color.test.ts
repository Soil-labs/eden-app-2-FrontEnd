import { hexRgb, rgbHex } from "./color";

test("rgbHex", () => {
  expect(rgbHex("rgb(0,255,0)")).toEqual("#00ff00");
  expect(rgbHex("rgb(255,0,255)")).toEqual("#ff00ff");

  expect(rgbHex("rgb(0, 255, 0)")).toEqual("#00ff00");
  expect(rgbHex("rgb(255, 0, 255)")).toEqual("#ff00ff");
});

describe("hexRgb", () => {
  test("with 3-digit hex (#fff)", () => {
    expect(hexRgb("#fff")).toEqual("rgb(255,255,255)");
    expect(hexRgb("#f0f")).toEqual("rgb(255,0,255)");
  });

  test("with 6-digit hex", () => {
    expect(hexRgb("#ff00ff")).toEqual("rgb(255,0,255)");
    expect(hexRgb("#00ff00")).toEqual("rgb(0,255,0)");
  });
});
