import { styled } from "../seams.config";

export const Link = styled("a", {
  color: "$link",
  textDecoration: "none",
  transition: "color 0.15s ease",
  "&:hover": { color: "$linkHover" },
  variants: {
    style: {
      inline: {},
      nav: {
        display: "block",
        padding: "$1 $3",
        borderRadius: "$sm",
        color: "$textMuted",
        "&:hover": { color: "$text" },
      },
      standalone: {
        display: "inline-flex",
        alignItems: "center",
        gap: "$2",
        padding: "$3 $5",
        borderRadius: "$md",
        border: "1px solid $border",
        fontWeight: "$medium",
        color: "$textSecondary",
        "&:hover": {
          borderColor: "$textMuted",
          backgroundColor: "$bgMuted",
        },
      },
    },
  },
  defaultVariants: {
    style: "inline",
  },
});
