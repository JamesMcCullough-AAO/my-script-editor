import { Box, Textarea, VStack } from '@chakra-ui/react';

function App() {
  return (
    <VStack spacing={4} p={5}>
      <Box flex='1' width='100%' backgroundColor='tomato'>
        <Textarea
          placeholder="Type your script here..."
          size="md"
          height="1900px"
          width="100%"
          overflowY="auto"
        />
      </Box>
    </VStack>
  );
}

export default App;
