import axios from "axios";

// Define the OpenAI API endpoint and your API key
const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

export async function sendToChatGPT(
  code: string,
  rules: string,
  apiKey: string
) {
  console.groupCollapsed("=== REQUEST ==================");
  console.log("=== CODE ==================");
  console.log(code);
  console.log("=== RULES ==================");
  console.log(rules);
  console.groupEnd();

  const result = await generateSummary(code, rules, apiKey);
  const codePart = transformChatGPTResponseToJS(result);

  console.groupCollapsed("================== RESULT ===");
  console.log(result);
  console.groupEnd();

  return codePart || result;
}

// Function to generate summary using OpenAI API
async function generateSummary(text: string, rules: string, apiKey: string) {
  try {
    const response = await axios.post(
      API_ENDPOINT,
      {
        model: "gpt-3.5-turbo-0301",
        messages: [
          {
            role: "system",
            content: rules,
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 2048,
        temperature: 0.8,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
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
function transformChatGPTResponseToJS(chatGPTResponse: string) {
  if (!chatGPTResponse.includes("```")) return chatGPTResponse;

  let inCodeBlock = false;

  return chatGPTResponse
    .split("\n")
    .map((line) => {
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return "x";
      }
      return inCodeBlock ? line : `// ${line}`;
    })
    .filter((l) => l !== "x" && l.trim() !== "//")
    .join("\n")
    .trim();
}
