import { describe, expect, it } from "vitest";
import { validateProfileInput } from "./profileValidation";

describe("validateProfileInput", () => {
  it("accepts valid input and passes it through", () => {
    const result = validateProfileInput({
      studentName: "Jane Doe",
      gradYear: 2024,
      location: "State College, PA",
      occupation: "Engineer",
      industry: "Tech",
      company: "Acme",
      bio: "Hello world",
      lookingFor: "Mentorship",
      linkedinUrl: "https://linkedin.com/in/janedoe",
      websiteUrl: "https://janedoe.com",
      isPublic: true,
    });

    expect(result).toEqual({
      data: {
        studentName: "Jane Doe",
        gradYear: 2024,
        location: "State College, PA",
        occupation: "Engineer",
        industry: "Tech",
        company: "Acme",
        bio: "Hello world",
        lookingFor: "Mentorship",
        linkedinUrl: "https://linkedin.com/in/janedoe",
        websiteUrl: "https://janedoe.com",
        isPublic: true,
      },
    });
  });

  it("converts empty and whitespace-only strings to null", () => {
    const result = validateProfileInput({
      studentName: "   ",
      location: "",
      occupation: undefined,
      industry: null,
      company: "Acme",
      bio: "",
      lookingFor: "  ",
      linkedinUrl: "",
      websiteUrl: "",
      isPublic: false,
    });

    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.studentName).toBeNull();
      expect(result.data.location).toBeNull();
      expect(result.data.occupation).toBeNull();
      expect(result.data.industry).toBeNull();
      expect(result.data.company).toBe("Acme");
      expect(result.data.bio).toBeNull();
      expect(result.data.lookingFor).toBeNull();
      expect(result.data.linkedinUrl).toBeNull();
      expect(result.data.websiteUrl).toBeNull();
    }
  });

  it("rejects an over-length studentName", () => {
    const result = validateProfileInput({
      studentName: "a".repeat(101),
    });
    expect(result).toEqual({
      error: "studentName must be 100 characters or fewer",
    });
  });

  it("rejects an over-length location", () => {
    const result = validateProfileInput({ location: "a".repeat(101) });
    expect(result).toEqual({
      error: "location must be 100 characters or fewer",
    });
  });

  it("rejects an over-length occupation", () => {
    const result = validateProfileInput({ occupation: "a".repeat(101) });
    expect(result).toEqual({
      error: "occupation must be 100 characters or fewer",
    });
  });

  it("rejects an over-length industry", () => {
    const result = validateProfileInput({ industry: "a".repeat(101) });
    expect(result).toEqual({
      error: "industry must be 100 characters or fewer",
    });
  });

  it("rejects an over-length company", () => {
    const result = validateProfileInput({ company: "a".repeat(101) });
    expect(result).toEqual({
      error: "company must be 100 characters or fewer",
    });
  });

  it("rejects an over-length bio", () => {
    const result = validateProfileInput({ bio: "a".repeat(1001) });
    expect(result).toEqual({
      error: "bio must be 1000 characters or fewer",
    });
  });

  it("rejects an over-length lookingFor", () => {
    const result = validateProfileInput({ lookingFor: "a".repeat(1001) });
    expect(result).toEqual({
      error: "lookingFor must be 1000 characters or fewer",
    });
  });

  it("accepts fields at exactly the max length boundary", () => {
    const result = validateProfileInput({
      studentName: "a".repeat(100),
      bio: "a".repeat(1000),
    });
    expect("data" in result).toBe(true);
  });

  it("rejects a gradYear below the valid range", () => {
    const result = validateProfileInput({ gradYear: 1899 });
    expect(result).toEqual({
      error: "gradYear must be a valid year between 1900 and 2100",
    });
  });

  it("rejects a gradYear above the valid range", () => {
    const result = validateProfileInput({ gradYear: 2101 });
    expect(result).toEqual({
      error: "gradYear must be a valid year between 1900 and 2100",
    });
  });

  it("rejects a non-integer gradYear", () => {
    const result = validateProfileInput({ gradYear: 2024.5 });
    expect(result).toEqual({
      error: "gradYear must be a valid year between 1900 and 2100",
    });
  });

  it("rejects a non-numeric gradYear", () => {
    const result = validateProfileInput({ gradYear: "not-a-year" });
    expect(result).toEqual({
      error: "gradYear must be a valid year between 1900 and 2100",
    });
  });

  it("allows gradYear to be omitted", () => {
    const result = validateProfileInput({});
    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.gradYear).toBeNull();
    }
  });

  it("allows gradYear to be an empty string (treated as omitted)", () => {
    const result = validateProfileInput({ gradYear: "" });
    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.gradYear).toBeNull();
    }
  });

  it("rejects a malformed linkedinUrl", () => {
    const result = validateProfileInput({ linkedinUrl: "not a url" });
    expect(result).toEqual({
      error: "linkedinUrl must be a valid URL",
    });
  });

  it("rejects a malformed websiteUrl", () => {
    const result = validateProfileInput({ websiteUrl: "not a url" });
    expect(result).toEqual({
      error: "websiteUrl must be a valid URL",
    });
  });

  it("accepts a valid linkedinUrl and websiteUrl", () => {
    const result = validateProfileInput({
      linkedinUrl: "https://www.linkedin.com/in/example",
      websiteUrl: "https://example.com",
    });
    expect("data" in result).toBe(true);
    if ("data" in result) {
      expect(result.data.linkedinUrl).toBe(
        "https://www.linkedin.com/in/example"
      );
      expect(result.data.websiteUrl).toBe("https://example.com");
    }
  });

  it("sets isPublic based on truthiness of the input", () => {
    const truthy = validateProfileInput({ isPublic: 1 });
    const falsy = validateProfileInput({ isPublic: 0 });
    if ("data" in truthy) expect(truthy.data.isPublic).toBe(true);
    if ("data" in falsy) expect(falsy.data.isPublic).toBe(false);
  });
});
