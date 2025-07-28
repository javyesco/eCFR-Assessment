// src/theme.js
import { extendTheme } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Define keyframes for the gradient animation using Emotion's keyframes function.
const gradientAnimationKeyframes = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// Extend your theme and override global styles
const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        // Set the animated gradient background
        bg: "linear-gradient(45deg, #1b263b, #403d39, #778da9, #eb5e28)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimationKeyframes} 20s ease infinite`,
        margin: 0,
        padding: 0,
      },
    },
  },
});

export default theme;
