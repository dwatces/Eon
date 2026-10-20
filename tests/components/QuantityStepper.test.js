// @vitest-environment jsdom
import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import QuantityStepper from "../../components/QuantityStepper";

function Controlled({ initial = 1, onChange = () => {}, ...props }) {
  const [value, setValue] = useState(initial);
  return (
    <QuantityStepper
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange(next);
      }}
      {...props}
    />
  );
}

describe("QuantityStepper", () => {
  it("is a group labelled Quantity with named buttons and the value", () => {
    render(<Controlled initial={3} />);
    const group = screen.getByRole("group", { name: "Quantity" });
    expect(group.querySelector("output").textContent).toBe("3");
    expect(
      screen.getByRole("button", { name: "Decrease quantity" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Increase quantity" }),
    ).toBeTruthy();
  });

  it("names its buttons after the item when given one", () => {
    render(<Controlled itemName="Love candle" label="Quantity of Love" />);
    expect(
      screen.getByRole("group", { name: "Quantity of Love" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Increase quantity of Love candle" }),
    ).toBeTruthy();
  });

  it("steps up and down", () => {
    const onChange = vi.fn();
    render(<Controlled initial={2} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    fireEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    fireEvent.click(screen.getByRole("button", { name: "Decrease quantity" }));
    expect(onChange.mock.calls.map(([value]) => value)).toEqual([3, 4, 3]);
    expect(screen.getByRole("group").querySelector("output").textContent).toBe(
      "3",
    );
  });

  it("stops at 1 and at 10, and marks the button at the limit", () => {
    const onChange = vi.fn();
    const { unmount } = render(<Controlled initial={1} onChange={onChange} />);
    const decrease = screen.getByRole("button", { name: "Decrease quantity" });
    expect(decrease.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(decrease);
    expect(onChange).not.toHaveBeenCalled();
    unmount();

    render(<Controlled initial={9} onChange={onChange} />);
    const increase = screen.getByRole("button", { name: "Increase quantity" });
    expect(increase.getAttribute("aria-disabled")).toBe("false");
    fireEvent.click(increase);
    fireEvent.click(increase);
    expect(onChange.mock.calls).toEqual([[10]]);
    expect(increase.getAttribute("aria-disabled")).toBe("true");
    // Still focusable at the limit.
    expect(increase.hasAttribute("disabled")).toBe(false);
  });
});
