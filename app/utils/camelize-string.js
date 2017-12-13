export default function camelizeString(stringToCamelize=false) {
  if (stringToCamelize && stringToCamelize.match(/_| |-/g)) {
    const separator = "?";
    let stringWithReplacedParts = stringToCamelize.replace(/_| |-/g, separator);
    let wordsArray = stringWithReplacedParts.split(separator);

    let result = "";

    wordsArray.forEach((word) => {
      if (word !== wordsArray[0]) {
        result += `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
      } else {
        result += word.toLowerCase();
      }
    });

    return result;
  }

  return stringToCamelize;
}
