import { Box, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, Textarea, IconButton } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import { useRef, useState } from 'react';


function App() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isCharacterName, setIsCharacterName] = useState(false);
  const [isLineDescription, setIsLineDescription] = useState(false);
  const [importText, setImportText] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const applySpanStyles = (span: HTMLSpanElement) => {
    span.style.backgroundColor = "lightblue";
    span.style.borderRadius = "12px";
    span.style.color = "black";
    span.style.padding = "2px 5px";
    span.style.marginLeft = "30px";
    span.style.marginRight = "5px";
  };

  const exportScript = () => {
    const contentDiv = contentRef.current;
    let scriptText = '';
  
    const traverseNode = (node: Node) => {
      if (node.nodeType === 3) { // Text node
        scriptText += node.textContent;
      } else if (node.nodeType === 1) { // HTML element
        const element = node as HTMLElement;
  
        if (element.tagName === 'SPAN') {
          scriptText += `\t[${element.textContent}] `;
        } else if (element.tagName === 'DIV') {
          // Recurse into the div to check its children
          Array.from(element.childNodes).forEach(traverseNode);
          // Add a newline after exiting each div to separate lines
          scriptText += '\n';
        } else if (element.tagName === 'BR') {
          // Add a newline when a br tag is encountered
          scriptText += '\n';
        }
      }
    };
  
    if (contentDiv) {
      Array.from(contentDiv.childNodes).forEach(traverseNode);
    }
  
    // Trigger a download of the script
    const blob = new Blob([scriptText], {type: "text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importScript = (text: string) => {
    const contentDiv = contentRef.current;
    
    if (contentDiv) {
      contentDiv.innerHTML = ''; // Clear existing content
  
      let lines = text.split('\n');
      
      lines.forEach((line) => {
        const tabIndex = line.indexOf('\t');
        
        if (tabIndex !== -1) {
          const character = line.slice(tabIndex + 2, line.indexOf(']'));
          const span = document.createElement("span");
          span.textContent = character;
          applySpanStyles(span);
  
          contentDiv.appendChild(span);
          const remainingText = document.createTextNode(line.slice(line.indexOf(']') + 2));
          contentDiv.appendChild(remainingText);
        } else {
          const textNode = document.createTextNode(line);
          contentDiv.appendChild(textNode);
        }
  
        const linebreakNode = document.createElement('br');
        contentDiv.appendChild(linebreakNode);
      });
    }
  };
  

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const contentDiv = contentRef.current;
    if (!contentDiv) return;
  
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);
  
    if (event.key === '[' || event.key === 'Tab') {
      event.preventDefault();
    
      setIsCharacterName(true);
    
      const span = document.createElement("span");
      applySpanStyles(span);
      range?.insertNode(span);
      range?.setStart(span, 0); // Place the cursor inside the span for typing the character name
    }
    
  
    if (event.key === ']' && isCharacterName) {
      event.preventDefault();
  
      setIsCharacterName(false);
      setIsLineDescription(true);
  
      const span = range?.commonAncestorContainer?.parentNode;
      if (span && span.nextSibling) {
        range?.setStartBefore(span.nextSibling); // Move cursor outside the span
      } else if (span && span.parentNode) {
        range?.setStartAfter(span); // If no next sibling exists, place cursor at the end
      }
      // add a space and open brack after the span
      const spaceNode = document.createTextNode(' (');
      range?.insertNode(spaceNode);
      range?.setStartAfter(spaceNode);
    }

    if (event.key === 'Enter' && isCharacterName) {
      event.preventDefault();
  
      setIsCharacterName(false);
      setIsLineDescription(false);
  
      const span = range?.commonAncestorContainer?.parentNode;
      if (span && span.nextSibling) {
        range?.setStartBefore(span.nextSibling); // Move cursor outside the span
      } else if (span && span.parentNode) {
        range?.setStartAfter(span); // If no next sibling exists, place cursor at the end
      }
      // add a space and open brack after the span
      const linebreakNode = document.createElement('br');
      range?.insertNode(linebreakNode);
      range?.setStartAfter(linebreakNode);
    }

    if (event.key === ')' && isLineDescription) {
      event.preventDefault();

      setIsLineDescription(false);
      // Move the cursor after the closing bracket
      const spaceNode = document.createTextNode(')');
      range?.insertNode(spaceNode);
      range?.setStartAfter(spaceNode);
      const linebreakNode = document.createElement('br');
      range?.insertNode(linebreakNode);
      range?.setStartAfter(linebreakNode);
    }
  };
  

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
      {/* Button Area */}
      <Box position="fixed" left="1em" top="50%" transform="translateY(-50%)">
        <IconButton aria-label="Download script" icon={<DownloadIcon />} onClick={onOpen} />
      </Box>
      <VStack spacing={4} p={5} flex='1' height="100vh" alignItems="center" justifyContent="center">
        <Box flex='1' width='100%' height='100%' display="flex" alignItems="center" justifyContent="center">
          <div
            contentEditable
            placeholder="Type your script here..."
            style={{ height: '100%', minHeight: '100vh', width: '1000px', overflowY: 'auto', backgroundColor: 'gray', color: 'white', padding: '1em', borderRadius: '0.25em' }}
            ref={contentRef}
            onKeyDown={handleKeyDown}
          ></div>
        </Box>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import/Export Script</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea placeholder="Paste your script here to import..." value={importText} onChange={(event) => setImportText(event.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={() => {
            importScript(importText);
            onClose();
          }}>
            Import
          </Button>
          <Button variant="ghost" onClick={() => {
            exportScript();
            onClose();
          }}>
            Export
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </Box>
  );
  
}

export default App;