import {
  applyScriptLinkSpanStyles,
  applySpanStyles,
  scriptSpacingTypes,
} from "../styling";
import { colorCharacterNameSpanDefaults } from "./general/constants";

type extractCharacterNamesProps = {
  contentRef: React.RefObject<HTMLDivElement>;
};

export const extractCharacterNames = ({
  contentRef,
}: extractCharacterNamesProps): string[] => {
  if (!contentRef || !contentRef.current) {
    console.warn("Error: No content ref");
    return [];
  }

  const characterNameSpans = contentRef.current.querySelectorAll(
    "span.character-name"
  );
  // Trim and remove zero-width spaces from character names
  const characterNames = Array.from(characterNameSpans).map(
    (span) => span.textContent?.trim().replace(/\u200B/g, "") || ""
  );

  const uniqueCharacterNames = Array.from(new Set(characterNames));

  return uniqueCharacterNames;
};

// Assuming you have the extractCharacterNames and applySpanStyles functions defined already

type updateCharacterNameStylingProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  scriptSpacing: scriptSpacingTypes;
};

export const updateCharacterNameStyling = ({
  contentRef,
  scriptSpacing,
}: updateCharacterNameStylingProps) => {
  if (!contentRef.current) {
    console.warn("The contentRef is not attached to a DOM element.");
    return;
  }

  // Extract unique character names
  const characterNames = extractCharacterNames({
    contentRef,
  });

  // Generate unique colors for each character name
  const nameToColorMapping: { [key: string]: string } = {};
  characterNames.forEach((name, index) => {
    nameToColorMapping[name] =
      colorCharacterNameSpanDefaults[
        index % colorCharacterNameSpanDefaults.length
      ];
  });

  // Go through the content and update the styling of each character name span
  const characterSpans = contentRef.current.querySelectorAll(
    "span.character-name"
  );
  characterSpans.forEach((span) => {
    applySpanStyles({ span: span as HTMLSpanElement, scriptSpacing });
    const name = span.textContent?.trim().replace(/\u200B/g, "") || "";
    if (name && nameToColorMapping[name]) {
      (span as HTMLSpanElement).style.backgroundColor =
        nameToColorMapping[name];
    }
  });

  // Go through the content and update the styling of each script-link and url-link span
  const scriptLinks = contentRef.current.querySelectorAll("span.script-link");

  scriptLinks.forEach((span) => {
    applyScriptLinkSpanStyles(span as HTMLSpanElement);
  });
};
