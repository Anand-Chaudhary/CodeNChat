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
                          type: Type.ARRAY,
                          description: "A list of files in the project. Each item in the array represents a file.",
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              path: { // e.g., "src/app.js", "package.json"
                                type: Type.STRING,
                                description: "The full path of the file (e.g., 'src/components/MyComponent.js')"
                              },
                              content: { // To simplify from { file: { contents: "..." } }
                                type: Type.STRING,
                                description: "The actual text content of the file"
                              }
                              // Or, if you want to keep a structure closer to your original value structure:
                              // name: { type: Type.STRING, description: "Filename or path" },
                              // file: {
                              //   type: Type.OBJECT,
                              //   properties: {
                              //     contents: { type: Type.STRING, description: "The contents of the file" }
                              //   },
                              //   required: ["contents"]
                              // }
                            },
                            required: ["path", "content"] // Or ["name", "file"] if using the nested structure
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
          "app.js": {
              file: {
                  contents: "
                  const express = require('express');
                  const app = express();

                  app.get('/', (req, res) => {
                      res.send('Hello World!');
                  });

                  app.listen(3000, () => {
                      console.log('Server is running on port 3000');
                  })
                  "
              }
          },
          "package.json": {
              file: {
                  contents: "
                  {
                      "name": "temp-server",
                      "version": "1.0.0",
                      "main": "index.js",
                      "scripts": {
                          "test": "echo \"Error: no test specified\" && exit 1"
                      },
                      "keywords": [],
                      "author": "",
                      "license": "ISC",
                      "description": "",
                      "dependencies": {
                          "express": "^4.21.2"
                      }
                  }
                  "
              }
          }
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
        return JSON.parse(response);
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}