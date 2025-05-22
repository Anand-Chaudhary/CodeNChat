import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateContent(prompt) {
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }],
            config: {
                responseMimeType: "application/json",
                temperature: 0.4,
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        type: {
                            type: Type.STRING,
                            description: "The type of response - 'simple' for text-only responses or 'project' for full project responses",

                            enum: ["simple", "project"]
                        },
                        text: {
                            type: Type.STRING,
                            description: "The explanation or response text"
                        },
                        // ...
                        fileTree: {
                          type: Type.OBJECT,
                          description: "The file tree structure containing multiple files",
                          properties: {
                            files: {
                              type: Type.ARRAY,
                              description: "Array of files in the project",
                              items: {
                                type: Type.OBJECT,
                                properties: {
                                  contents: {
                                    type: Type.STRING,
                                    description: "The actual text content of the file"
                                  },
                                  path: {
                                    type: Type.STRING,
                                    description: "The full path of the file (e.g., 'src/components/MyComponent.js')"
                                  }
                                },
                                required: ["contents", "path"]
                              }
                            }
                          }
                        },
// ...
                            buildCommand: {
                                type: Type.OBJECT,
                                properties: {
                                    mainItem: {
                                        type: Type.STRING,
                                        description: "The main command to run"
                                    },
                                    commands: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.STRING
                                        }
                                    }
                                }
                            },
                            startCommand: {
                                type: Type.OBJECT,
                                properties: {
                                    mainItem: {
                                        type: Type.STRING,
                                        description: "The main command to run"
                                    },
                                    commands: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.STRING
                                        }
                                    }
                                }
                            }
                        },
                        required: ["type", "text"]
                    }
                },
                systemInstructions: `
      You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.

    Examples:

    <example>
    user: Hello
    response: {
      "type": "simple",
      "text": "Hello! How can I help you today?"
    }
    </example>

    <example>
    user: Create an express application
    response: {
      "type": "project",
      "text": "I'll help you create an Express application with a basic structure.",
      "fileTree": {
        "files": [
          {
            "contents": "const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n    res.send('Hello World!');\n});\n\napp.listen(3000, () => {\n    console.log('Server is running on port 3000');\n})",
            "path": "app.js"
          },
          {
            "contents": "{\n  \"name\": \"temp-server\",\n  \"version\": \"1.0.0\",\n  \"main\": \"app.js\",\n  \"scripts\": {\n    \"start\": \"node app.js\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.21.2\"\n  }\n}",
            "path": "package.json"
          }
        ]
      },
      "buildCommand": {
          mainItem: "npm",
          commands: [ "install" ]
      },
      "startCommand": {
          mainItem: "node",
          commands: [ "app.js" ]
      }
    }
    </example>

    IMPORTANT:
    1. For simple text responses (like greetings or questions), use type: "simple" and only include the text field
    2. For project-related responses, use type: "project" and include all necessary fields
    3. Don't use file names like routes/index.js
      `
            });

        const response = result.candidates[0].content.parts[0].text;
        const parsedResponse = JSON.parse(response);

        if (parsedResponse.type === "project" && parsedResponse.fileTree && parsedResponse.fileTree.files) {
            const webContainerFiles = {};
            parsedResponse.fileTree.files.forEach(file => {
                webContainerFiles[file.path] = {
                    file: {
                        contents: file.contents
                    }
                };
            });
            parsedResponse.webContainerFiles = webContainerFiles; // Add the new format
            delete parsedResponse.fileTree; // Remove the old format
        }

        return parsedResponse;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}