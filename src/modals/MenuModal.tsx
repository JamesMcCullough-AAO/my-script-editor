import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { designColors } from "../utils/general/constants";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import { handleNewScript } from "../handlers/handleNewScript";
import { exportScript } from "../utils/scriptManagement/exportScript";
import { handleOpenRenameModal } from "../handlers/handleOpenRenameModal";
import { handleShowVersionsModal } from "../handlers/handleShowVersionModal";
import { SelectScript } from "../components/selectScript";
import { loadScript } from "../utils/scriptManagement/loadScript";
import React, { SetStateAction } from "react";
import { characterNote } from "../utils/general/types";
import { ScriptVersion } from "../utils/scriptManagement/getScriptVersions";

type MenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  setNewScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  onNameModalOpen: () => void;
  isGenerating: boolean;
  onUploadModalOpen: () => void;
  title: string;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  characterNotes: characterNote[];
  onRenameModalOpen: () => void;
  setOldScriptTitle: React.Dispatch<React.SetStateAction<string>>;
  onIconModalOpen: () => void;
  onDeleteModalOpen: () => void;
  setScriptVersions: React.Dispatch<React.SetStateAction<ScriptVersion[]>>;
  onVersionsModalOpen: () => void;
  onInfoModalOpen: () => void;
  onSettingsModalOpen: () => void;
  setScriptLinkHistory: React.Dispatch<SetStateAction<string[]>>;
  setIsLoadingScript: React.Dispatch<SetStateAction<boolean>>;
  setTitle: React.Dispatch<SetStateAction<string>>;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  setIconImage: React.Dispatch<SetStateAction<string>>;
  iconImage: string;
  setIconColor: React.Dispatch<SetStateAction<string>>;
  iconColor: string;
  setCharacterNotes: React.Dispatch<SetStateAction<characterNote[]>>;
};

export const MenuModal = ({
  isOpen,
  onClose,
  notes,
  setNotes,
  setNewScriptTitle,
  onNameModalOpen,
  isGenerating,
  onUploadModalOpen,
  title,
  contentRef,
  characterNotes,
  onRenameModalOpen,
  setOldScriptTitle,
  onIconModalOpen,
  onDeleteModalOpen,
  setScriptVersions,
  onVersionsModalOpen,
  onInfoModalOpen,
  onSettingsModalOpen,
  setScriptLinkHistory,
  setIsLoadingScript,
  setTitle,
  setIsLoading,
  setIconImage,
  iconImage,
  setIconColor,
  iconColor,
  setCharacterNotes,
}: MenuModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent backgroundColor={designColors.backgroundgray} color="white">
        <ModalHeader>Menu</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack justifyContent="space-between" mb="4">
            <HStack justifyContent="center" spacing="2">
              <IconButton
                aria-label="Create Script"
                icon={<NoteAddIcon />}
                onClick={() => {
                  handleNewScript({
                    setNewScriptTitle,
                    onNameModalOpen,
                  });
                }}
                colorScheme="green"
                isDisabled={isGenerating}
                title="Create New Script"
              />
              <IconButton
                aria-label="Import script"
                icon={<FileUploadIcon />}
                onClick={onUploadModalOpen}
                isDisabled={isGenerating || !title}
                colorScheme="blue"
                title="Import Script"
              />
              <IconButton
                aria-label="Export script"
                icon={<DownloadIcon />}
                onClick={() => {
                  exportScript({
                    title,
                    contentRef,
                    notes,
                    characterNotes,
                  });
                  onClose();
                }}
                isDisabled={isGenerating || !title}
                colorScheme="blue"
                title="Export Script"
              />
              <IconButton
                aria-label="Rename script"
                icon={<DriveFileRenameOutlineIcon />}
                colorScheme="yellow"
                onClick={() =>
                  handleOpenRenameModal({
                    scriptTitle: title,
                    onMenuClose: onClose,
                    onRenameModalOpen,
                    setNewScriptTitle,
                    setOldScriptTitle,
                  })
                }
                isDisabled={isGenerating || !title}
                title="Rename Script"
              />
              <IconButton
                aria-label="Update Script Icon"
                icon={<AddPhotoAlternateIcon />}
                colorScheme="yellow"
                onClick={onIconModalOpen}
                isDisabled={isGenerating || !title}
                title="Update Script Icon"
              />
              <IconButton
                aria-label="Delete script"
                colorScheme="red"
                icon={<DeleteIcon />}
                onClick={() => {
                  onDeleteModalOpen();
                  onClose();
                }}
                isDisabled={isGenerating || !title}
                title="Delete Script"
              />
              <IconButton
                aria-label="Restore previous versions"
                colorScheme="pink"
                icon={<HistoryIcon />}
                onClick={async () => {
                  await handleShowVersionsModal({
                    title,
                    setScriptVersions,
                    onVersionsModalOpen,
                  });
                  onClose();
                }}
                isDisabled={isGenerating || !title}
                title="Restore Previous Versions"
              />
            </HStack>
            <HStack justifyContent="center" spacing="2">
              <IconButton
                aria-label="Info Box"
                icon={<InfoIcon />}
                colorScheme="purple"
                onClick={onInfoModalOpen}
                title="Info Box"
              />
              <IconButton
                aria-label="Settings"
                icon={<SettingsIcon />}
                colorScheme="purple"
                onClick={onSettingsModalOpen}
                title="Settings"
              />
            </HStack>
          </HStack>
          <SelectScript
            title={title}
            onSelect={(loadTitle) => {
              setScriptLinkHistory([]);
              setIsLoadingScript(true);
              loadScript({
                loadTitle,
                title,
                contentRef,
                setTitle,
                setNotes,
                notes,
                setIsLoading,
                setIconImage,
                iconImage,
                setIconColor,
                iconColor,
                setCharacterNotes,
                characterNotes,
                versionIndex: -1,
                setScriptLinkHistory,
              }).then(() => {
                setIsLoadingScript(false);
              });
              onClose();
            }}
            setIsLoading={setIsLoading}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
