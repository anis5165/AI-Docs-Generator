const fs = require("fs");
const Documentation = require("../models/docsModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Upload file and generate documentation
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileContent = fs.readFileSync(req.file.path, "utf-8");

    // AI Model - Updated model name to the current version
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    try {
      const prompt = `You are an expert technical writer and software engineer. Generate comprehensive, structured documentation for the following code file following this exact format:

# [Component/File Name] Documentation

This document provides a detailed explanation of the [Component/File Name], a [brief description of what it does].

## 1. Overview
[2-3 sentences describing the main purpose, key features, and what makes this component/file unique]

## 2. Dependencies
List all external dependencies with brief descriptions:
- **[Dependency Name]**: Brief description of what it's used for
- **[Dependency Name]**: Brief description of what it's used for

## 3. Component/Class: [Name]
[Brief description of the main component/class and its role]

### 3.1. State Management
[If applicable, describe state variables and their purposes]
- **[stateName]** ([type]): [Description]
- **[stateName]** ([type]): [Description]

### 3.2. Props/Parameters
[If applicable, describe props or function parameters]
- **[propName]** ([type]): [Description]
- **[propName]** ([type]): [Description]

### 3.3. Core Functions/Methods

#### **[functionName]**([parameters])
[Description of what this function does]
- **Purpose**: [Why this function exists]
- **Parameters**: 
  - **[paramName]** ([type]): [Description]
  - **[paramName]** ([type]): [Description]
- **Returns**: ([type]) [Description of return value]
- **Usage**: [Brief usage example if helpful]

#### **[functionName]**([parameters])
[Description of what this function does]
- **Purpose**: [Why this function exists]
- **Parameters**: 
  - **[paramName]** ([type]): [Description]
- **Returns**: ([type]) [Description of return value]

### 3.4. Event Handlers
[If applicable, describe event handling functions]
- **[handlerName]**: [Description of what event it handles and what it does]

### 3.5. Utility Functions
[If applicable, describe helper/utility functions]
- **[functionName]**: [Description and purpose]

## 4. Usage Examples
[Provide practical examples of how to use this component/code]

\`\`\`[language]
[Code example showing typical usage]
\`\`\`

## 5. Key Features
- [Feature 1]: [Brief description]
- [Feature 2]: [Brief description]
- [Feature 3]: [Brief description]

## 6. Implementation Notes
[Any important implementation details, considerations, or gotchas]

---

**File to document:**
\`\`\`
${fileContent}
\`\`\`

Generate documentation that is professional, comprehensive, and follows this exact structure. Make sure to:
1. Use proper markdown formatting
2. Include code blocks with appropriate language tags
3. Be thorough but concise
4. Focus on practical usage and understanding
5. Highlight important functions and their purposes clearly
`;

      // Continue with sending the prompt to API...

      const result = await model.generateContent(prompt);
      const aiGeneratedDoc = result.response.text();

      // Save to MongoDB
      const userId = req.body.userId; // For JWT, send userId in body; for NextAuth, send session user id
      const doc = new Documentation({
        filename: req.file.originalname,
        content: aiGeneratedDoc,
        userId: userId, // <-- Save userId
      });
      await doc.save();

      // Clean up the temporary file
      fs.unlinkSync(req.file.path);

      res.json({ message: "Documentation created successfully!", data: doc });
    } catch (aiError) {
      console.error("AI processing error:", aiError);
      res.status(500).json({
        error: "Failed to generate documentation with AI: " + aiError.message,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });

    // Clean up the temporary file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};

// Fetch all generated documentation
const getAllDocs = async (req, res) => {
  try {
    const docs = await Documentation.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadFile, getAllDocs };
