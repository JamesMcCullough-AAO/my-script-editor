import axios from "axios";
import { RefObject } from "react";
import { applySpanStyles } from "./styling";

type convertHtmlToPromptProps = {
  contentRef: React.RefObject<HTMLDivElement>;
};

type generateTextProps = {
  inputPrompt: string;
  max_length?: number;
  apiToken: string;
};

type convertTextToHtmlProps = {
  generatedText: string;
};

const processNode = (node: Node): string => {
  let result = "";

  if (node.nodeType === 3) {
    // Text node
    const text = node.textContent?.trim() ?? "";
    if (text.length > 0) {
      result += text;
    }
  } else if (node.nodeType === 1) {
    // HTML element
    const element = node as HTMLElement;

    if (element.tagName === "SPAN") {
      result += `\n${element.textContent?.trim() ?? ""}: `;
    } else if (element.tagName === "BR") {
      result += " ";
    } else if (element.tagName === "DIV") {
      result += `\n`;
      // Process child nodes of the div
      Array.from(element.childNodes).forEach((child) => {
        result += processNode(child);
      });
    }
  }

  return result;
};

export const convertHtmlToPrompt = ({
  contentRef,
}: convertHtmlToPromptProps) => {
  if (!contentRef || !contentRef.current) {
    alert("Error: No content ref");
    return "";
  }

  // Console log the HTML of the content div for debugging
  console.log(contentRef.current.innerHTML);

  const contentDiv = contentRef.current;
  let prompt = "";

  Array.from(contentDiv.childNodes).forEach((child) => {
    prompt += processNode(child);
  });

  return prompt.trim(); // Return the processed string, removing any leading or trailing whitespace
};

export const generateText = async ({
  inputPrompt,
  apiToken,
  max_length,
}: generateTextProps) => {
  const apiUrl = "https://api.novelai.net/ai/generate";
  const imageDescriptionRequest = {
    input: inputPrompt,
    model: "kayra-v1",
    parameters: {
      use_string: true,
      temperature: 1,
      min_length: 10,
      max_length: 100, // Adjust as needed
      top_p: 0.95,
      top_a: 0.02,
      typical_p: 0.95,
      tail_free_sampling: 0.95,
      repetition_penalty: 1.625,
      repetition_penalty_range: 2016,
      repetition_penalty_frequency: 0,
      repetition_penalty_presence: 0,
      phrase_rep_pen: "very_aggressive",
      mirostat_tau: 5,
      mirostat_lr: 0.25,
      generate_until_sentence: true,
    },
  };
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiToken}`,
  };

  try {
    const imageDescriptionResponse = await axios.post(
      apiUrl,
      imageDescriptionRequest,
      {
        headers: headers,
      }
    );
    return imageDescriptionResponse.data.output.trim();
  } catch (error) {
    console.error("Error generating text:", error);
  }
};

export const convertTextToHtml = ({
  generatedText,
}: convertTextToHtmlProps) => {
  const lines = generatedText.split("\n");
  let html = "";
  const parser = new DOMParser();

  lines.forEach((line) => {
    const match = line.match(/^([^:]+): (.*)$/);
    if (match) {
      const preDialogue = match[1].trim();
      const dialogue = match[2].trim();

      let characterName = "";
      let lineDescription = "";

      const descriptionMatch = preDialogue.match(/(.*) \((.*)\)/);
      if (descriptionMatch) {
        characterName = descriptionMatch[1];
        lineDescription = `(${descriptionMatch[2]})`;
      } else {
        characterName = preDialogue;
      }

      html += `<div><span>${characterName}</span>${lineDescription}<br/> ${dialogue}</div>`;
    } else {
      // For lines without a character name or description (could be stage directions or actions)
      html += `<div>${line.trim()}</div>`;
    }
  });

  // Convert the HTML string to an actual DOM fragment
  const doc = parser.parseFromString(html, "text/html");

  // Apply styles to all spans
  doc.querySelectorAll("span").forEach((span: HTMLSpanElement) => {
    applySpanStyles(span);
  });

  // Convert the DOM fragment back to an HTML string
  return doc.body.innerHTML;
};
