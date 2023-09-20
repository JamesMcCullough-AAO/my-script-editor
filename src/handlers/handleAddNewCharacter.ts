type handleAddNewCharacterProps = {
  setCharacterNotes: React.Dispatch<
    React.SetStateAction<{ name: string; notes: string }[]>
  >;
  characterNotes: { name: string; notes: string }[];
};

export const handleAddNewCharacter = ({
  setCharacterNotes,
  characterNotes,
}: handleAddNewCharacterProps) => {
  setCharacterNotes([...characterNotes, { name: "New", notes: "EMPTY" }]);
};
