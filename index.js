const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require("path");

// Blocking, synchronuos way
/*
const txtIn = fs.readFileSync(`./txt/input.txt`, "utf-8");
console.log(txtIn);

const textOut = `This is what we know about the avocado, ${txtIn}. \nCreated on ${Date.now()}`;
fs.writeFileSync(`./txt/output.txt`, textOut);
console.log("File written!");
*/

// Non-blocking asynchronous way
/*
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
	if (err) return console.log("Error !!!");
	fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
		console.log(data2);
		fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
			console.log(data3);
			fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, "utf-8", (err) => {
				console.log("Your file has been written");
			});
		});
	});
});
console.log("Will read file!");
*/

// Server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const templateOverviewPage = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const templateProductPage = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");
const templatecardPage = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const dataObj = JSON.parse(data);

const replaceTemplate = (html, data) => {
	let output = html.replace(/{%NAME%}/g, data.productName);
	output = output.replace(/{%ID%}/g, data.id);
	output = output.replace(/{%IMAGE%}/g, data.image);
	output = output.replace(/{%FROM%}/g, data.from);
	output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
	output = output.replace(/{%QUANTITY%}/g, data.quantity);
	output = output.replace(/{%PRICE%}/g, data.price);
	output = output.replace(/{%DESCRIPTION%}/g, data.description);

	// check if organic is true
	if (!data.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

	return output;
};

const server = http.createServer((req, res) => {
	const pathName = req.url;
	const id = 4;
	console.log(path.parse(req, true));

	//Overview Page
	if (pathName === "/overview" || pathName === "/") {
		res.writeHead(200, { "content-type": "text/html" });
		const cardHtml = dataObj.map((el) => replaceTemplate(templatecardPage, el)).join("");
		const output = templateOverviewPage.replace("{%PRODUCT_CARD%}", cardHtml);
		res.end(output);
	}

	// Product Page
	else if (pathName === "/product" && id < dataObj.length) {
		res.writeHead(200, { "content-type": "text/html" });

		console.log(req.url);

		res.end("This is the Product");
	}

	//API
	else if (pathName === "/api") {
		res.writeHead(200, { "content-type": "application/json" });
		res.end(data);
	}

	// Not found
	else {
		res.writeHead(404, { "content-type": "text/html", "my-own-header": "hello-world" });
		res.end("<h1>Page not found</h1>");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("listening to requests on port 8000");
});
