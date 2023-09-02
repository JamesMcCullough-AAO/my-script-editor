
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
    
    Array.from(contentDiv.childNodes).forEach((child) => {
      if (child.nodeType === 3) { // Text node
        prompt += child.textContent?.trim() ?? '';
        if (isCharacterName) {
          prompt += ': '; // Add colon and space after character name
          isCharacterName = false; // Reset the flag
        } else {
          prompt += ' '; // Add a space between sentences/dialogues
        }
      } else if (child.nodeType === 1) { // HTML element
        const element = child as HTMLElement;
        
        if (element.tagName === 'SPAN') {
          prompt += `\n${element.textContent?.trim() ?? ''}`; // New line before character name
          isCharacterName = true; // Flag that we're currently processing a character name
        } else if (element.tagName === 'BR') {
          // No new line for <br>
        } else if (element.tagName === 'DIV') {
          // No new line for new div
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
  
  export const convertTextToHtml = ({generatedText}: {generatedText: string}) => {
    const lines = generatedText.split('\n');
    let html = '';
    const parser = new DOMParser();
    
    lines.forEach((line) => {
      // Identify a line description if it exists (format: [character] (description): dialogue)
      const match = line.match(/\[(.*?)\](?:\s?\((.*?)\))?/);
  
      if (match) {
        const characterName = match[1];
        const lineDescription = match[2] ? ` (${match[2]})` : '';
        const dialogue = line.replace(match[0], '').split(': ')[1];
  
        html += `<div><span>${characterName.trim()}</span>${lineDescription.trim()}: ${dialogue.trim()}</div>`;
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