import { extractCharacterNames } from "../updateCharacterNameStyling";

type populateCharacterNotesProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  characterNotes: { name: string; notes: string }[];
  setCharacterNotes: React.Dispatch<
    React.SetStateAction<{ name: string; notes: string }[]>
  >;
};

export const populateCharacterNotes = ({
  contentRef,
  characterNotes,
  setCharacterNotes,
}: populateCharacterNotesProps) => {
  // Remove all EMPTY notes
  const updatedNotes = characterNotes.filter((note) => note.notes !== "EMPTY");

  const names = extractCharacterNames({ contentRef });

  names.forEach((name) => {
    if (!updatedNotes.some((note) => note.name === name)) {
      updatedNotes.push({ name, notes: "EMPTY" });
    }
  });

  setCharacterNotes(updatedNotes);
};
