export default function capitalize(text) {
  // split the text into component words
  // splits the text such that delimiting letters are also kept as elements
  let wordArr = text.split(/([A-Z])/g);

  // try to join the delimiting letter to the word it came from
  for (let i = 0; i < wordArr.length; i++) {
    const word = wordArr[i];
    if (word.length === 1 && word === word.toUpperCase()) {
      const letter = wordArr.splice(i, 1);
      // the next word becomes what will be at index i since the letter word was removed
      wordArr[i] = letter + wordArr[i];
    }
  }

  // uppercase the first letter of each word
  const newWordArr = wordArr.map(
    (w) => w[0].toUpperCase() + w.slice(1, w.length)
  );
  return newWordArr.join(" ");
}
