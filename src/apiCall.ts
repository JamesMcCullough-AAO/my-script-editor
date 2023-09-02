
import axios from 'axios';
import { RefObject } from 'react';
import { applySpanStyles } from './styling';

export const convertHtmlToPrompt = ({ contentRef }: { contentRef: RefObject<HTMLDivElement> }) => {
    if (!contentRef || !contentRef.current) {
      return '';
    }
  
    const contentDiv = contentRef.current;
    let prompt = '';
    let isCharacterName = false;
    let isDiv = false;
  
    Array.from(contentDiv.childNodes).forEach((child) => {
      if (child.nodeType === 3) { // Text node
        const text = child.textContent?.trim() ?? '';
        if (text.length > 0) {
          if (isCharacterName) {
            prompt += `: ${text}`;
            isCharacterName = false; // Reset the flag
            isDiv = false;
          } else {
            prompt += `${text} `;
            isDiv = false; // Reset the flag
          }
        }
      } else if (child.nodeType === 1) { // HTML element
        const element = child as HTMLElement;
        
        if (element.tagName === 'SPAN') {
          prompt += `\n${element.textContent?.trim() ?? ''}`;
          isCharacterName = true; // Flag that we're currently processing a character name
        } else if (element.tagName === 'BR' || element.tagName === 'DIV') {
          if (!isCharacterName && !isDiv) {
            prompt += ' '; // Add a space if it's within a character's line
          }
          if (element.tagName === 'DIV') {
            isDiv = true; // Flag that a new div started
          }
        }
      }
    });
  
    return prompt.trim(); // Remove any extra spaces at the beginning or the end
  };
  
  
  

  export const generateText = async ({ inputPrompt, max_length } : {inputPrompt: string, max_length?: number}) => {
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
      Authorization: `Bearer pst-me09LNUA4HhLJtUAHfLFio2AdYtbSSAMWBpVk1S1ZiaWSMjikGbN17ldJjlr32zG`,
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
  
  export const convertTextToHtml = ({ generatedText }: { generatedText: string }) => {
    const lines = generatedText.split('\n');
    let html = '';
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
    const doc = parser.parseFromString(html, 'text/html');
  
    // Apply styles to all spans
    doc.querySelectorAll('span').forEach((span: HTMLSpanElement) => {
      applySpanStyles(span);
    });
  
    // Convert the DOM fragment back to an HTML string
    return doc.body.innerHTML;
  };
  