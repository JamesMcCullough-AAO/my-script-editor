import { characterNote } from "../utils/types";

type handleSaveEditedNameProps = {
  newName: string;
  contentRef: React.RefObject<HTMLDivElement>;
  setCharacterNotes: React.Dispatch<React.SetStateAction<characterNote[]>>;
  setEditCharacterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterToEdit: React.Dispatch<React.SetStateAction<string | null>>;
  characterToEdit: string | null;
};

export const handleSaveEditedName = ({
  newName,
  contentRef,
  setCharacterNotes,
  setEditCharacterModalOpen,
  setCharacterToEdit,
  characterToEdit,
}: handleSaveEditedNameProps) => {
  // Find and replace all mentions of the old name in the script.
  // Let's assume contentRef holds the script content:
  if (!contentRef.current) {
    console.warn("The contentRef is not attached to a DOM element.");
    return;
  }

  if (characterToEdit) {
    const updatedContent = contentRef.current.innerHTML.replace(
      new RegExp(characterToEdit, "g"),
      newName
    );
    contentRef.current.innerHTML = updatedContent;
  }

  // Update the name in characterNotes:
  setCharacterNotes((prevNotes) =>
    prevNotes.map((note) =>
      note.name === characterToEdit ? { ...note, name: newName } : note
    )
  );

  // Close the modal and reset characterToEdit:
  setEditCharacterModalOpen(false);
  setCharacterToEdit(null);
};
