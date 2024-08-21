import { readFileSync, writeFileSync } from "fs";

const termine = readFileSync("termine.html");
const html = readFileSync("schedule.html");

writeFileSync(
  "termine.html",
  termine
    .toString()
    .replace(
      '<iframe src="schedule.html" style="width: 100%"></iframe>',
      html.toString()
    )
);
