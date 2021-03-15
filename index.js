const fs = require("fs");

// Blocking, synchronuos way
const txtIn = fs.readFileSync(`./txt/input.txt`, "utf-8");
console.log(txtIn);

const textOut = `This is what we know about the avocado, ${txtIn}. \nCreated on ${Date.now()}`;
fs.writeFileSync(`./txt/output.txt`, textOut);
console.log("File written!");

// Non-blocking asynchronous way
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
	console.log(data);
});
console.log("Will read file!");
