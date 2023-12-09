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
  VStack,
} from "@chakra-ui/react";
import { designColors } from "../utils/general/constants";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import PhotoIcon from "@mui/icons-material/Photo";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import IosShareIcon from "@mui/icons-material/IosShare";
import { handleNewScript } from "../handlers/handleNewScript";
import { exportScript } from "../utils/scriptManagement/exportScript";
import { handleOpenRenameModal } from "../handlers/handleOpenRenameModal";
import { handleShowVersionsModal } from "../handlers/handleShowVersionModal";
import { SelectScript } from "../components/selectScript";
import { loadScript } from "../utils/scriptManagement/loadScript";
import React, { SetStateAction } from "react";
import { characterNote } from "../utils/general/types";
import { ScriptVersion } from "../utils/scriptManagement/getScriptVersions";
import { shareScript } from "../utils/supabase/supabaseConnect";
import { scriptSpacingTypes } from "../styling";

type MenuModalProps = {
  isOpen: boolean;
  onClose: () => void;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  onNameModalOpen: () => void;
  isGenerating: boolean;
  onUploadModalOpen: () => void;
  title: string;
  scriptUUID: string;
  setScriptUUID: React.Dispatch<React.SetStateAction<string>>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  characterNotes: characterNote[];
  onRenameModalOpen: () => void;
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
  setScriptShareLink: React.Dispatch<SetStateAction<string>>;
  scriptSpacing: scriptSpacingTypes;
  setScriptTags: React.Dispatch<SetStateAction<string[]>>;
  scriptTags: string[];
};

export const MenuModal = ({
  isOpen,
  onClose,
  notes,
  setNotes,
  onNameModalOpen,
  isGenerating,
  onUploadModalOpen,
  title,
  scriptUUID,
  setScriptUUID,
  contentRef,
  characterNotes,
  onRenameModalOpen,
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
  setScriptShareLink,
  scriptSpacing,
  setScriptTags,
  scriptTags,
}: MenuModalProps) => {
  const [isEditPopupOpen, setIsEditPopupOpen] = React.useState(false);

  // set isEditPopupOpen to false when the menu is closed
  React.useEffect(() => {
    setIsEditPopupOpen(false);
  }, [isOpen]);

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
                    onNameModalOpen,
                  });
                  onClose();
                }}
                colorScheme="green"
                isDisabled={isGenerating}
                title="Create New Script"
              />
              <IconButton
                aria-label="Edit script"
                icon={<EditIcon />}
                onClick={() => {
                  setIsEditPopupOpen(!isEditPopupOpen);
                }}
                isDisabled={isGenerating || !title}
                colorScheme="yellow"
                title="Edit Script"
              />
              {isEditPopupOpen && (
                <VStack
                  // Positioned just below the previous button
                  position="absolute"
                  transform="translate(-48px, calc(50% - 28px))"
                  border="1px solid white"
                  borderRadius="md"
                  spacing="2"
                  p="2"
                  zIndex="1"
                  backgroundColor={designColors.darkblue}
                >
                  <IconButton
                    // Close the popup
                    aria-label="Close edit popup"
                    icon={<CloseIcon />}
                    onClick={() => {
                      setIsEditPopupOpen(false);
                    }}
                    colorScheme="transparent"
                    _hover={{ color: "gray" }}
                    title="Close"
                  />
                  <IconButton
                    aria-label="Rename script"
                    icon={<DriveFileRenameOutlineIcon />}
                    colorScheme="yellow"
                    onClick={() =>
                      handleOpenRenameModal({
                        onMenuClose: onClose,
                        onRenameModalOpen,
                      })
                    }
                    isDisabled={isGenerating || !title}
                    title="Rename Script"
                  />
                  <IconButton
                    aria-label="Update Script Icon"
                    icon={<PhotoIcon />}
                    colorScheme="yellow"
                    onClick={onIconModalOpen}
                    isDisabled={isGenerating || !title}
                    title="Update Script Icon"
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
                </VStack>
              )}
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
                aria-label="Share Script"
                colorScheme="pink"
                icon={<IosShareIcon />}
                onClick={() => {
                  shareScript({
                    title,
                    scriptUUID,
                    contentRef,
                    notes,
                    characterNotes,
                    setScriptShareLink,
                  });
                  onClose();
                }}
                isDisabled={isGenerating || !title}
                title="Share Script"
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
                scriptUUID,
                setScriptUUID,
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
                scriptSpacing,
                setScriptTags,
                scriptTags,
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
