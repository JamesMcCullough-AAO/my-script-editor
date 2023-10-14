import * as React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { getSharedScript } from "./utils/supabase/supabaseConnect";

const LoadScript = () => {
  const { uuid } = useParams();

  if (!uuid) return <div>Invalid script</div>;

  return <App scriptId={uuid} />;
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/loadscript/:uuid" element={<LoadScript />} />
        </Routes>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
