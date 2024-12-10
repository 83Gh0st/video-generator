const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  

    export    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "write a script to generate 30 seconds video on topic: Interesting Historical Story along with AI Image prompt in realistic format for each scene and give me result in JSON format with ImagePprompt and ContentText as field\n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n[\n  {\n    \"ImagePrompt\": \"A bustling medieval marketplace, vibrant colors, people in period clothing bartering goods, a large wooden sign reading \\\"The Golden Goose Inn\\\", realistic, detailed, 8k\",\n    \"ContentText\": \"Our story begins in 14th century Prague, a city teeming with life and mystery.  The Golden Goose Inn, a popular tavern, was the center of much intrigue.\"\n  },\n  {\n    \"ImagePrompt\": \"A close-up of a weathered, leather-bound book, open to a page filled with elegant calligraphy, a single flickering candle illuminating the text, realistic, detailed, 8k\",\n    \"ContentText\": \"A renowned alchemist, Master Elias, possessed a legendary book detailing a secret formula... a formula for creating gold!\"\n  },\n  {\n    \"ImagePrompt\": \"Master Elias, an older man with a long white beard and piercing blue eyes, intensely focused on a bubbling alembic in his dimly lit laboratory, surrounded by strange alchemical apparatus, realistic, detailed, 8k\",\n    \"ContentText\": \"For years, he toiled in secret, striving to unlock its mysteries.  Rumors of his experiments spread throughout the city.\"\n  },\n  {\n    \"ImagePrompt\": \"A shadowy figure in a dark hooded cloak observing Master Elias' laboratory from a distance through a grimy window, realistic, detailed, 8k, cinematic lighting\",\n    \"ContentText\": \"But not everyone wished him success.  A jealous rival, cloaked in secrecy, watched his every move.\"\n  },\n  {\n    \"ImagePrompt\": \"A dramatic scene: Master Elias' laboratory in chaos, smoke billowing, alchemical equipment shattered, a single golden ingot gleaming amidst the wreckage, realistic, detailed, 8k\",\n    \"ContentText\": \"One fateful night, disaster struck.  An explosion rocked the laboratory, destroying years of work...\"\n  },\n  {\n    \"ImagePrompt\": \"Master Elias, bruised but alive, clutching the single golden ingot, looking determined but weary, realistic, detailed, 8k\",\n    \"ContentText\": \"...but leaving behind one undeniable proof of his success.\"\n  },\n  {\n    \"ImagePrompt\": \"A close-up shot of the golden ingot, showcasing its intricate details and shimmering surface, realistic, detailed, 8k, macro photography\",\n    \"ContentText\": \"The Golden Goose Inn and its secrets would forever be entwined with the legend of Master Elias and his remarkable achievement.\"\n  }\n]\n```\n\n**Note:**  This JSON provides prompts and text for a story that could be approximately 30 seconds long if efficiently edited. The actual video length will depend on the pacing and editing style.  You will need to use AI image generation tools (like Midjourney, Dall-E 2, Stable Diffusion) to create the images from these prompts, and then video editing software to assemble the video.  Adjust the timing of each scene in your video editing software to fit the 30-second timeframe.  You might need to combine or shorten some scenes.  Remember to obtain the necessary licenses for any music or sound effects you incorporate.\n"},
          ],
        },
      ],
    });
  
