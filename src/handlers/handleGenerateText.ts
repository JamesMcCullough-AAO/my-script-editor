import {
  convertHtmlToPrompt,
  convertTextToHtml,
  generateText,
} from "../apiCall";

type handleGenerateTextProps = {
  contentRef: React.RefObject<HTMLDivElement>;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  apiToken: string;
};

export const handleGenerateText = async ({
  contentRef,
  setIsGenerating,
  apiToken,
}: handleGenerateTextProps) => {
  setIsGenerating(true);
  const prompt = convertHtmlToPrompt({ contentRef });
  console.log("Prompt: " + prompt);
  const generatedText = await generateText({ inputPrompt: prompt, apiToken });
  console.log("Generated Text: " + generatedText);
  const html = convertTextToHtml({ generatedText });
  console.log("HTML: " + html);

  const contentDiv = contentRef.current;
  if (contentDiv) {
    contentDiv.innerHTML += html;
  }
  setIsGenerating(false);
};
