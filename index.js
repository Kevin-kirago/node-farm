const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

// core modules
const replaceTemplate = require("./modules/replaceTemplates");

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

const server = http.createServer((req, res) => {
	const { pathname, query } = url.parse(req.url, true);

	//Overview Page
	if (pathname === "/overview" || pathname === "/") {
		res.writeHead(200, { "content-type": "text/html" });
		const cardHtml = dataObj.map((el) => replaceTemplate(templatecardPage, el)).join("");
		const output = templateOverviewPage.replace("{%PRODUCT_CARD%}", cardHtml);
		res.end(output);
	}

	// Product Page
	else if (pathname === "/product" && query.id < dataObj.length) {
		res.writeHead(200, { "content-type": "text/html" });
		const product = dataObj[query.id];
		const productOutput = replaceTemplate(templateProductPage, product);
		res.end(productOutput);
	}

	//API
	else if (pathname === "/api") {
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
