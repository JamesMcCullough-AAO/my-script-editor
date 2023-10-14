import {
  Box,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Textarea,
  IconButton,
  Input,
  Image,
  List,
  ListItem,
  HStack,
} from "@chakra-ui/react";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import DownloadIcon from "@mui/icons-material/Download";
import CreateIcon from "@mui/icons-material/Create";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HistoryIcon from "@mui/icons-material/History";
import EditNoteIcon from "@mui/icons-material/EditNote";
import NoteIcon from "@mui/icons-material/Note";
import Face2Icon from "@mui/icons-material/Face2";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import { useEffect, useRef, useState } from "react";
import {
  deleteAllScripts,
  deleteScript,
} from "./utils/scriptManagement/deleteScript";
import { newScript } from "./utils/scriptManagement/newScript";
import { searchSavedTitles } from "./utils/scriptManagement/searchSavedTitles";
import { saveScript } from "./utils/scriptManagement/saveScript";
import { importScript } from "./utils/scriptManagement/importScript";
import { exportScript } from "./utils/scriptManagement/exportScript";
import { formatTimestamp } from "./utils/general/formatTimestamp";
import { handleNewScript } from "./handlers/handleNewScript";
import { handleRenameScript } from "./handlers/handleRenameScript";
import { handleOpenRenameModal } from "./handlers/handleOpenRenameModal";
import { handleOpenMenu } from "./handlers/handleOpenMenu";
import { handleKeyDown } from "./handlers/handleKeyDown";
import { handleGenerateText } from "./handlers/handleGenerateText";
import PendingIcon from "@mui/icons-material/Pending";
import { set, throttle } from "lodash";
import { getScriptVersions } from "./utils/scriptManagement/getScriptVersions";
import { formatTimestampExact } from "./utils/general/formatTimestampExact";
import { loadScript } from "./utils/scriptManagement/loadScript";
import { compressImage } from "./utils/database/ImageCompressor";
import { EditDocumentIcon } from "./icons/editDocument";
import { DocumentIcon } from "./icons/DocumentIcon";
import {
  baseIconColor,
  darkIconColor,
  designColors,
} from "./utils/general/constants";
import { updateCharacterNameStyling } from "./utils/updateCharacterNameStyling";
import { characterNote } from "./utils/general/types";
import { handleSaveEditedName } from "./handlers/handleSaveEditedName";
import { handleAddNewCharacter } from "./handlers/handleAddNewCharacter";
import { populateCharacterNotes } from "./utils/general/populateCharacterNotes";
import { NotesModal } from "./modals/NotesModal";
import { UploadModal } from "./modals/UploadModal";
import { loadScriptFromSpan } from "./utils/scriptManagement/loadScriptFromSpan";
import { SelectScript } from "./components/selectScript";
import { SelectScriptModal } from "./modals/selectScriptModal";
import { addLinkSpan } from "./utils/general/createLinkFromSelection";
import { MenuModal } from "./modals/MenuModal";
import SelectOptionModal from "./modals/SelectOptionModal";
import {
  handleOptionSelect,
  typeSlashOptions,
} from "./handlers/handleOptionSelect";
import { ExternalLinkModal } from "./modals/ExternalLinkModal";
import { getSharedScript } from "./utils/supabase/supabaseConnect";

type AppProps = {
  scriptId?: string;
};

function ReadModeApp({ scriptId }: AppProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [importText, setImportText] = useState("");

  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [newScriptTitle, setNewScriptTitle] = useState("");
  const [oldScriptTitle, setOldScriptTitle] = useState("");
  const [iconImage, setIconImage] = useState("");
  const [uploadedIconImage, setUploadedIconImage] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [iconColor, setIconColor] = useState(baseIconColor as string);
  const [editCharacterModalOpen, setEditCharacterModalOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState<string | null>(null);
  const [newCharacterName, setNewCharacterName] = useState("");
  const [characterNotes, setCharacterNotes] = useState<characterNote[]>([]);
  const [savedRange, setSavedRange] = useState<Range>();
  const [scriptLinkHistory, setScriptLinkHistory] = useState<string[]>([]);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<{
    title: string;
    timestamp: number;
    iconImage?: string;
    index: number;
    iconColor: string;
    content: string;
  } | null>(null);
  const {
    isOpen: isUploadModalOpen,
    onOpen: onUploadModalOpen,
    onClose: onUploadModalClose,
  } = useDisclosure();
  const [editorSettings, setEditorSettings] = useState({
    novelAiApiKey: "",
    targetWordCount: 0,
    maxWordCount: 0,
  });
  const [wordCount, setWordCount] = useState(0);
  const [scriptVersions, setScriptVersions] = useState([]) as [
    {
      title: string;
      timestamp: number;
      iconImage?: string;
      index: number;
      iconColor: string;
      content: string;
    }[],
    any
  ];
  const {
    isOpen: isMenuOpen,
    onOpen: onMenuOpen,
    onClose: onMenuClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    isOpen: isRenameModalOpen,
    onOpen: onRenameModalOpen,
    onClose: onRenameModalClose,
  } = useDisclosure();
  const {
    isOpen: isNameModalOpen,
    onOpen: onNameModalOpen,
    onClose: onNameModalClose,
  } = useDisclosure();
  const {
    isOpen: isInfoModalOpen,
    onOpen: onInfoModalOpen,
    onClose: onInfoModalClose,
  } = useDisclosure();
  const {
    isOpen: isIconModalOpen,
    onOpen: onIconModalOpen,
    onClose: onIconModalClose,
  } = useDisclosure();
  const {
    isOpen: isSettingsModalOpen,
    onOpen: onSettingsModalOpen,
    onClose: onSettingsModalClose,
  } = useDisclosure();
  const {
    isOpen: isVersionsModalOpen,
    onOpen: onVersionsModalOpen,
    onClose: onVersionsModalClose,
  } = useDisclosure();
  const {
    isOpen: isSelectScriptModalOpen,
    onOpen: onSelectScriptModalOpen,
    onClose: onSelectScriptModalClose,
  } = useDisclosure();
  const {
    isOpen: isSelectOptionModalOpen,
    onOpen: onSelectOptionModalOpen,
    onClose: onSelectOptionModalClose,
  } = useDisclosure();
  const {
    isOpen: isExternalLinkModalOpen,
    onOpen: onExternalLinkModalOpen,
    onClose: onExternalLinkModalClose,
  } = useDisclosure();

  const {
    isOpen: isNotesModalOpen,
    onOpen: onNotesModalOpen,
    onClose: onNotesModalClose,
  } = useDisclosure();

  // if a script is passed in, load it
  useEffect(() => {
    if (scriptId) {
      getSharedScript(scriptId).then((script) => {
        setTitle(script.title);
        setNotes(script.notes);
        if (script.characterNotes) {
          setCharacterNotes(JSON.parse(script.characterNotes));
        }
        setScriptLinkHistory([script.title]);
        if (contentRef.current) {
          contentRef.current?.insertAdjacentHTML("beforeend", script.html);
          updateCharacterNameStyling({ contentRef });
          updateWordCount();
        }
      });
    }
  }, []);

  // A function that takes uploaded image, compresses it using compressImage and sets it as the icon
  const handleUploadIcon = async (event: any) => {
    const uploadedImage = event.target.files[0];
    const compressedImage = await compressImage(uploadedImage);
    const reader = new FileReader();
    reader.readAsDataURL(compressedImage);
    reader.onloadend = () => {
      setUploadedIconImage(reader.result as string);
    };
  };

  const handleBackButton = () => {
    window.history.pushState({}, "", "/");
    window.location.reload();
  };

  useEffect(() => {
    const settings = localStorage.getItem("editorSettings");
    if (settings) {
      setEditorSettings(JSON.parse(settings));
    }
  }, []);

  const updateWordCount = throttle(() => {
    if (contentRef.current) {
      const text = contentRef.current.innerText; // Split by spaces or line breaks and remove empty elements
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word !== "");
      if (words.length !== wordCount) {
        setWordCount(words.length);
      }
    }
  }, 10000);

  useEffect(() => {
    let currentlyLoadingScript = false;

    const element = contentRef.current;

    if (element) {
      element.addEventListener("click", (e: MouseEvent) => {
        if (
          (e.target as HTMLElement).classList.contains("script-link") &&
          !isLoadingScript &&
          !currentlyLoadingScript
        ) {
          // prevent default behavior
          e.preventDefault();
          // alert that script links don't work in read only mode
          alert("Script links don't work in read only mode");
        }
        if (
          (e.target as HTMLElement).classList.contains("url-link") &&
          !isLoadingScript &&
          !currentlyLoadingScript
        ) {
          e.preventDefault();
          // get url from span.dataset.linkUrl = url; and open in new tab
          currentlyLoadingScript = true;
          const url = (e.target as HTMLElement).dataset.linkUrl;
          if (url) {
            window.open(url, "_blank");
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
            }
          }

          currentlyLoadingScript = false;
        }
      });

      updateWordCount();
    }

    return () => {
      if (element) {
        element.removeEventListener("input", updateWordCount);
      }
    };
  }, []);

  useEffect(() => {
    document.title = title || "Script Editor"; // Set the title to the script title or some default title
  }, [title]); // This useEffect runs every time `title` changes

  return (
    <HStack
      // Box should fill the entire window and expand to fit the content
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="black"
      spacing={0}
      height="100vh"
    >
      {/* Button Area */}
      <VStack
        spacing={2}
        p="2"
        backgroundColor={designColors.darkblue}
        width="fit-content"
        alignItems="start"
        height="100vh"
      >
        <IconButton
          aria-label="Edit notes"
          icon={<NoteIcon />}
          onClick={() => {
            onNotesModalOpen();
          }}
          colorScheme="blue"
          isDisabled={isGenerating || !title}
          visibility={title ? "visible" : "hidden"}
          title="Edit Notes"
        />

        <IconButton
          aria-label="Edit character notes"
          icon={<Face2Icon />}
          onClick={() => {
            populateCharacterNotes({
              contentRef,
              characterNotes,
              setCharacterNotes,
            });
            setEditCharacterModalOpen(true);
          }}
          colorScheme="blue"
          isDisabled={isGenerating || !title}
          visibility={title ? "visible" : "hidden"}
          title="Edit Character Notes"
        />

        {isLoading && <PendingIcon />}
      </VStack>
      <VStack
        spacing={3}
        p={2}
        flex="1"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        {!title && (
          <VStack position="absolute">
            <Text
              color="white"
              fontWeight={600}
              fontSize="38px"
              textAlign="center"
            >
              Welcome to the Script Editor!
            </Text>
            <Text color="white" fontSize="16px" textAlign="center">
              Click the menu button in the top left to select a script or create
              a new one.
            </Text>
            {/* <Image src="favicon.png" width="300px" /> */}
            <EditDocumentIcon color={baseIconColor} width="300px" />
          </VStack>
        )}
        <VStack maxWidth="1000px" width="full" alignItems="start" height="100%">
          <HStack id="title-bar">
            {title && (
              <HStack marginRight="5px">
                <IconButton
                  aria-label="Back"
                  icon={<ArrowBackIcon />}
                  onClick={() => {
                    handleBackButton();
                  }}
                  // no background, green icon, icon goes white on hover
                  backgroundColor="transparent"
                  color="white"
                  _hover={{
                    color: iconColor,
                  }}
                  title="Back"
                />
                {iconImage && (
                  <Image src={iconImage} width="40px" borderRadius="4" />
                )}
                {!iconImage && (
                  <EditDocumentIcon color={iconColor} width="40px" />
                )}
              </HStack>
            )}
            <Text color="white" fontWeight={600} fontSize="24px">
              {title}
            </Text>
          </HStack>
          <VStack
            maxWidth="1000px"
            width="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="row"
            //Define height by parent, subtracting the height of the button area
            height={`calc(100% - ${
              (document.getElementById("title-bar")?.clientHeight || 0) + 8
            }px)`}
          >
            <div
              placeholder="Type your script here..."
              style={{
                overflowY: "auto", // Enable vertical scrolling
                width: "100%",
                height: "100%",
                backgroundColor: designColors.backgroundgray,
                color: "white",
                padding: "1em",
                borderRadius: "0.25em",
                fontSize: "18px",
              }}
              ref={contentRef}
            ></div>
          </VStack>
        </VStack>
      </VStack>
      {/* Info box in the lower right corner that shows word count, updated live*/}
      <Box
        position="absolute"
        bottom="0"
        right="0"
        width="10%"
        zIndex="100"
        padding="1em"
      >
        <Text
          fontWeight={600}
          fontSize="18px"
          textAlign="right"
          color={
            wordCount > editorSettings.maxWordCount
              ? "red"
              : wordCount > editorSettings.targetWordCount
              ? "lightgreen"
              : "white"
          }
        >
          {wordCount}
        </Text>
      </Box>
      <NotesModal
        {...{ isNotesModalOpen, onNotesModalClose, notes, setNotes }}
      />
      <Modal
        isOpen={editCharacterModalOpen}
        onClose={() => {
          setEditCharacterModalOpen(false);
        }}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent
          backgroundColor={designColors.backgroundgray}
          color="white"
        >
          <ModalHeader>Character Notes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              {characterNotes.map((charNote, index) => (
                <Box key={index} width="100%" marginBottom="4">
                  <HStack justifyContent="start">
                    {charNote.notes == "EMPTY" && (
                      <IconButton
                        colorScheme="blue"
                        aria-label="Add notes"
                        icon={<EditNoteIcon />}
                        title="Add Notes"
                        onClick={() => {
                          setCharacterNotes((prevNotes) =>
                            prevNotes.map((note, idx) =>
                              idx === index ? { ...note, notes: " " } : note
                            )
                          );
                        }}
                      />
                    )}
                    {charNote.notes != "EMPTY" && (
                      <IconButton
                        colorScheme="red"
                        aria-label="Clear notes"
                        icon={<DeleteIcon />}
                        title="Clear Notes"
                        onClick={() => {
                          setCharacterNotes((prevNotes) =>
                            prevNotes.map((note, idx) =>
                              idx === index ? { ...note, notes: "EMPTY" } : note
                            )
                          );
                        }}
                      />
                    )}

                    <Text fontWeight="bold" fontSize="18px">
                      {charNote.name}
                    </Text>
                  </HStack>

                  {charNote.notes != "EMPTY" && (
                    <Textarea
                      value={charNote.notes}
                      marginTop="2"
                      onChange={(e) =>
                        setCharacterNotes((prevNotes) =>
                          prevNotes.map((note, idx) =>
                            idx === index
                              ? { ...note, notes: e.target.value }
                              : note
                          )
                        )
                      }
                    />
                  )}
                </Box>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HStack>
  );
}

export default ReadModeApp;