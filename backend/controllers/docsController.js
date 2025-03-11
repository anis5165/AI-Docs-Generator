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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    try {
      const prompt = `Generate comprehensive documentation for this code:
      
    ${fileContent}
    
    Please include the following sections in Markdown format:
    
    ## Overview
    - Provide a detailed explanation of what this code does
    - Explain the purpose and primary functionality of this component/module
    - Describe where it fits in the overall application architecture
    
    ## Component Structure
    - Break down the major parts of the code
    - Explain the component lifecycle (if applicable)
    - Detail the state management approach used
    
    ## Functions and Methods
    For each function or method:
    - Name and purpose
    - Detailed explanation of what it does and how it works
    - Complete parameter list with types and descriptions
    - Return value type and description
    - Edge cases handled
    - Any side effects
    
    ## Props (if applicable)
    - List all props with their types
    - Explain what each prop does
    - Note which props are required vs. optional
    - Document default values
    
    ## Dependencies
    - List all imports and dependencies
    - Explain why each dependency is needed
    - Note any version requirements
    
    ## State Management
    - Document all state variables
    - Explain how state changes are handled
    - Document any context or redux usage
    
    ## Event Handlers
    - Document all event handlers
    - Explain what triggers them and what they do
    
    ## Styling
    - Explain the styling approach used
    - Document important CSS classes/Tailwind utilities
    
    ## Usage Examples
    - Provide 2-3 complete examples of how to use this component
    - Include examples with different prop combinations
    
    ## Best Practices
    - Note any performance considerations
    - Document accessibility features
    - List any known limitations or edge cases
    
    ## Related Components
    - List related components that work with this one
    - Explain how they interact
    
    Format the documentation to be easily readable with proper headings, lists, and code examples where appropriate.`;

      // Continue with sending the prompt to API...

      const result = await model.generateContent(prompt);
      const aiGeneratedDoc = result.response.text();

      // Save to MongoDB
      const doc = new Documentation({
        filename: req.file.originalname,
        content: aiGeneratedDoc,
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
