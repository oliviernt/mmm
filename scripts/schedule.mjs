import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";
import { writeFileSync } from "fs";

const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
const documentId = process.env.GOOGLE_SHEETS_DOCUMENT_ID;

if (!apiKey) throw Error("Missing GOOGLE_SHEETS_API_KEY environment variable!");
if (!documentId)
  throw Error("Missing GOOGLE_SHEETS_DOCUMENT_ID environment variable!");

/**
 * Gets cell values from a Spreadsheet.
 * @param {string} spreadsheetId The spreadsheet ID.
 * @param {string} range The sheet range.
 * @return {obj} spreadsheet information
 */
async function getValues(spreadsheetId, range) {
  const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/spreadsheets",
    apiKey,
  });

  const service = google.sheets({ version: "v4", auth });
  try {
    const title =
      (await service.spreadsheets.get({ spreadsheetId })).data?.properties
        ?.title || "";
    const result = await service.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const { data, ...rest } = result;
    // console.log(rest);
    const numRows = data.values ? data.values.length : 0;
    console.log(`${numRows} rows retrieved.`);
    return { values: data?.values ?? [], title };
  } catch (err) {
    throw err;
  }
}

const { values, title } = await getValues(documentId, "A1:C50");

const html = `
<link rel="stylesheet" href="assets/css/main.css" />
<h2>${title}</h2>
<table>
${values
  .map(
    ([one, two, three]) =>
      `
  <tr>
    <td>${one}</td>
    <td>${two}</td>
    <td>${three}</td>
  </tr>
`
  )
  .join("")}
</table>
`;

writeFileSync("schedule.html", html);
