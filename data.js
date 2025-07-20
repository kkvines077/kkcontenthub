function generateSuggestions(text) {
  const emojiMap = {
    "😊": ["You look happy!", "Glad to hear that!", "Stay cheerful!"],
    "😢": ["I'm here for you.", "Don't be sad!", "Things will get better."],
    "❤️": ["Love you too!", "Sending hugs!", "So sweet!"],
    "😂": ["Haha!", "That was funny!", "LOL!"],
    "👍": ["Got it!", "Sounds good!", "Okay!"]
  };

  if (emojiMap[text]) return emojiMap[text];

  const input = text.toLowerCase();
  if (input.includes("hello")) return ["Hi!", "Hello there!", "How are you?"];
  if (input.includes("how are you")) return ["I'm good! You?", "Doing great, thanks!"];
  if (input.includes("bye")) return ["Bye!", "Take care!", "See you soon!"];
  return ["Interesting!", "Really?", "Tell me more!"];
}
