export const convertToKebabCase = spaceSeparatedString =>
  spaceSeparatedString.toLowerCase().split(" ").join("-");
