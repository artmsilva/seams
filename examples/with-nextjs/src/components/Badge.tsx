import { css } from "../stitches.config";

/**
 * Demonstrates: standalone css() to create a class name, applied manually.
 */
const badgeStyles = css({
  display: "inline-block",
  padding: "$1 $2",
  fontSize: "12px",
  fontWeight: 600,
  fontFamily: "$body",
  borderRadius: "$sm",
  backgroundColor: "$secondary",
  color: "white",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
});

export function Badge({ children }: { children: React.ReactNode }) {
  const rendered = badgeStyles();
  return <span className={rendered.className}>{children}</span>;
}
