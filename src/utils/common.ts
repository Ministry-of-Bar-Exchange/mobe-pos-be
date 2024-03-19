export const toJSON = (csv: string) => {
  const lines: string[] = csv.split("\n");
  const formattedLines = lines.map((str) => str.replace(/\r/g, ""));
  const result = [];
  const headers = formattedLines[0]?.split(",");

  const [headersList, ...rest] = formattedLines;

  rest
    .filter((info) => info.length)
    .forEach((l) => {
      const obj = {};
      const line = l.split(",");

      headers.forEach((h, i) => {
        obj[h.toLowerCase()] = line[i];
      });
      result.push(obj);
    });

  return result;
};

export const replaceSpaceAndSpecialChars = (str: string, replacer = "") =>
  str.replace(/[\s~`!@#$%^&*()_+\-={[}\]|\\:;"'<,>.?/]+/g, replacer);

export const replaceSpecialCharsFromTax = (str: string, replacer = "") =>
  str.replace(/[@%]+/g, replacer);

export const generateRandomNumber = (length: number = 4) => {
  return Date.now()
    .toString()
    .slice(12 - (length - 1));
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
