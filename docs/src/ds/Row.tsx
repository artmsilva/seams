import { styled } from "../seams.config";

export const Row = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  variants: {
    gap: {
      0: { gap: "0" },
      1: { gap: "$1" },
      2: { gap: "$2" },
      3: { gap: "$3" },
      4: { gap: "$4" },
      5: { gap: "$5" },
      6: { gap: "$6" },
      7: { gap: "$7" },
      8: { gap: "$8" },
    },
    align: {
      start: { alignItems: "flex-start" },
      center: { alignItems: "center" },
      end: { alignItems: "flex-end" },
      stretch: { alignItems: "stretch" },
      baseline: { alignItems: "baseline" },
    },
    justify: {
      start: { justifyContent: "flex-start" },
      center: { justifyContent: "center" },
      end: { justifyContent: "flex-end" },
      between: { justifyContent: "space-between" },
      around: { justifyContent: "space-around" },
    },
    wrap: {
      true: { flexWrap: "wrap" },
    },
  },
});
