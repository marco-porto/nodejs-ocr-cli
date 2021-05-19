const Tesseract = require("tesseract.js");
const fs = require("fs");
const colors = require("colors");
colors.setTheme({
  success: "green",
  help: "cyan",
  warn: "yellow",
  info: "blue",
  error: "red",
});

const args = require("minimist")(process.argv.slice(2));

function OCR(payload) {
  console.log("\n[OCR] Start job\n".info);
  Tesseract.recognize(payload.file, payload.lang, {
    logger: (m) =>
      console.log(
        ":: ",
        m.status.padEnd(45, " "),
        `[${(Math.round(m.progress * 100) / 100).toFixed(1) * 100}%]`.info
      ),
  }).then(({ data: { text } }) => {
    if (payload.output) {
      fs.writeFile("./out.txt", text, (err) => {
        if (err) return console.log(err);
        console.log(
          "\n[OCR] Success, recognized text sent to ./out.txt ".success
        );
      });
    } else {
      console.log("\n[OCR] success, recognized text:\n\n".success, text);
    }
  });
}

function handleArgs(args) {
  let payload = {};
  if (args["f"]) {
    payload.file = args["f"]; //image path for OCR
    //Lang selector (default => eng)
    if (Object.keys(args).includes("l")) {
      payload.lang = args["l"];
    } else {
      payload.lang = "eng";
    }
    //Output selector (default => console.log())
    if (Object.keys(args).includes("o")) {
      payload.output = true;
    } else {
      payload.output = false;
    }
    OCR(payload);
  } else {
    console.log("No file passed to read");
  }
}

handleArgs(args);
