import axios from "axios";
import { Config, loadConfig } from "./config";

// Define the OpenAI API endpoint and your API key
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function sendToChatGPT(code: string) {
  const config = loadConfig()!;

  console.groupCollapsed("=== REQUEST ==================");
  console.log("=== CODE ==================");
  console.log(code);
  console.log("=== RULES ==================");
  console.log(config.rules);
  console.groupEnd();

  const result = await generateSummary(code, config);
  const codePart = transformChatGPTResponseToJS(
    result,
    config.extractCodeFromResponse
  );

  console.groupCollapsed("================== RESULT ===");
  console.log(result);
  console.groupEnd();

  return codePart || result;
}

// Function to generate summary using OpenAI API
async function generateSummary(text: string, config: Config) {
  try {
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: "gpt-3.5-turbo-0301",
        messages: [
          {
            role: "system",
            content: config?.rules,
          },
          {
            role: "user",
            content: text,
          },
        ],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_tokens: 2048,
        temperature: 0.8,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        frequency_penalty: 0.0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        presence_penalty: 0.0,
      },
      {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          "Content-Type": "application/json",
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${config!.apiKey}`,
        },
      }
    );

    if (response.status === 200) {
      const data = response.data as any;
      return data.choices[0]?.message?.content;
    } else {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      "Something went wrong while generating the summary. Please try again later."
    );
  }
}

/**
 * Transforms a chat response from GPT to JavaScript code
 */
function transformChatGPTResponseToJS(
  chatGPTResponse: string,
  extractCode: boolean
) {
  if (!chatGPTResponse.includes("```")) {
    return chatGPTResponse;
  }

  let inCodeBlock = false;

  return chatGPTResponse
    .split("\n")
    .map((line) => {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return "";
      }
      if (extractCode && !inCodeBlock) {
        return "";
      }
      return inCodeBlock ? line : `// ${line}`;
    })
    .filter((l) => l && l.trim() !== "//")
    .join("\n")
    .trim();
}
