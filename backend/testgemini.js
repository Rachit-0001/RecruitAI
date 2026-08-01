const ai = require("./config/gemini");

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: "Say hello in one sentence.",
    });

    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}

test();