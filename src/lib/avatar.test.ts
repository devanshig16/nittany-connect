import { describe, expect, it } from "vitest";
import { getInitials } from "./avatar";

describe("getInitials", () => {
  it("returns first + last initials for a two-word name", () => {
    expect(getInitials("John Smith")).toBe("JS");
  });

  it("returns first + last initials for a longer name", () => {
    expect(getInitials("John Michael Smith")).toBe("JS");
  });

  it("returns a single initial for a single-word name", () => {
    expect(getInitials("Cher")).toBe("C");
  });

  it("returns '?' for an empty string", () => {
    expect(getInitials("")).toBe("?");
  });

  it("returns '?' for null", () => {
    expect(getInitials(null)).toBe("?");
  });

  it("returns '?' for undefined", () => {
    expect(getInitials(undefined)).toBe("?");
  });

  it("returns '?' for a whitespace-only string", () => {
    expect(getInitials("   ")).toBe("?");
  });

  it("trims and collapses extra whitespace between words", () => {
    expect(getInitials("  John   Smith  ")).toBe("JS");
  });

  it("uppercases lowercase input", () => {
    expect(getInitials("john smith")).toBe("JS");
  });
});
