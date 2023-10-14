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
  const names = extractCharacterNames({ contentRef });
  const updatedNotes = [...characterNotes];

  names.forEach((name) => {
    if (!updatedNotes.some((note) => note.name === name)) {
      updatedNotes.push({ name, notes: "EMPTY" });
    }
  });

  setCharacterNotes(updatedNotes);
};
