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
  const characterNames = Array.from(characterNameSpans).map(
    (span) => span.textContent?.trim() ?? ""
  );

  const uniqueCharacterNames = Array.from(new Set(characterNames));

  return uniqueCharacterNames;
};
