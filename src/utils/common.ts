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
