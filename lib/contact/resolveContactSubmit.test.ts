import { describe, expect, it } from "vitest";
import {
  getContactFormConfigError,
  getContactFormFallbackError,
  resolveContactSubmitMode,
} from "./resolveContactSubmit";

describe("resolveContactSubmitMode", () => {
  it("uses an explicit submitMode override", () => {
    expect(
      resolveContactSubmitMode({
        submitMode: "api",
        web3formsKey: "key",
      })
    ).toBe("api");
    expect(
      resolveContactSubmitMode({
        submitMode: "web3forms",
        web3formsKey: "",
      })
    ).toBe("web3forms");
  });

  it("prefers web3forms when a key is set", () => {
    expect(resolveContactSubmitMode({ web3formsKey: " abc " })).toBe("web3forms");
  });

  it("falls back to api when no key is set", () => {
    expect(resolveContactSubmitMode({})).toBe("api");
    expect(resolveContactSubmitMode({ web3formsKey: "  " })).toBe("api");
  });
});

describe("getContactFormConfigError", () => {
  it("requires a Web3Forms key for web3forms mode", () => {
    expect(getContactFormConfigError("web3forms", "")).toMatch(/WEB3FORMS/);
    expect(getContactFormConfigError("web3forms", "key")).toBeNull();
  });

  it("defers api mode validation to the server", () => {
    expect(getContactFormConfigError("api")).toBeNull();
  });
});

describe("getContactFormFallbackError", () => {
  it("points static hosts at Web3Forms for api failures", () => {
    expect(getContactFormFallbackError("api")).toMatch(/WEB3FORMS/);
  });

  it("keeps a generic message for web3forms failures", () => {
    expect(getContactFormFallbackError("web3forms")).toMatch(/configuration/);
  });
});
