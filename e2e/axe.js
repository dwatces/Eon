import AxeBuilder from "@axe-core/playwright";

// axe-core against WCAG 2.2 A and AA plus axe's best-practice rules.
// Returns one line per violation, so a failing test names the rule and
// the first few elements.

const TAGS = [
  "wcag2a",
  "wcag2aa",
  "wcag21a",
  "wcag21aa",
  "wcag22aa",
  "best-practice",
];

export async function axeViolations(page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(TAGS)
    .analyze();
  return violations.map(
    (v) =>
      `${v.id} (${v.impact}): ${v.nodes
        .slice(0, 5)
        .map((n) => n.target.join(" "))
        .join(", ")}`,
  );
}
