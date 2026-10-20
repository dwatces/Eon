import { describe, expect, it } from "vitest";
import { formatNZD } from "../lib/money.js";

describe("formatNZD", () => {
  it("formats cents as New Zealand dollars", () => {
    expect(formatNZD(2000)).toBe("$20.00");
    expect(formatNZD(500)).toBe("$5.00");
    expect(formatNZD(6500)).toBe("$65.00");
    expect(formatNZD(0)).toBe("$0.00");
    expect(formatNZD(123456)).toBe("$1,234.56");
  });
});
