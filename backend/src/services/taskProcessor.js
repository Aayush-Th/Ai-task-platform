const processTaskOperation = (inputText, operation) => {
  switch (operation) {
    case "uppercase":
      return inputText.toUpperCase();
    case "lowercase":
      return inputText.toLowerCase();
    case "reverse":
      return inputText.split("").reverse().join("");
    case "wordcount":
      return String(inputText.length);
    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
};

module.exports = {
  processTaskOperation
};
