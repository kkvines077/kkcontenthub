function generateSuggestions(text) {
  const emojiMap = {
    "😊": ["You look happy!", "Glad to hear that!", "Spread the joy!"],
    "😢": ["Oh no! I'm here for you.", "It’ll get better!"],
    "😂": ["Haha! Good one!", "That’s hilarious!"],
    "❤️": ["Sending love!", "That’s so sweet!"],
    "👍": ["Got it!", "Awesome!", "Nice!"]
  };

  if (emojiMap[text]) return emojiMap[text];

  const input = text.toLowerCase();
  if (input.includes("hello")) return ["Hi!", "Hello there!", "How are you?"];
  if (input.includes("how are you")) return ["I'm great! You?", "Doing well, thanks!"];
  if (input.includes("bye")) return ["Bye!", "See you soon!", "Take care!"];

  return ["Interesting!", "Tell me more!", "Really?"];
}
