var http = require('http');
var fs = require('fs');

var contentMap = {
	'/': './index.html',
	'/view/dashboard.html': './view/dashboard.html',
	'/view/comment.html': './view/comment.html',
	'/view/reply.html' : './view/reply.html'
};

http.createServer(function(request, response) {
	if (contentMap[request.url]) {
		renderFile(response, contentMap[request.url], "text/html");
	}
	else if (/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString()) || /^\/[a-zA-Z0-9\/]*.min.js$/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "text/javascript");
	}
	else if (/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "text/css");
	}
	else {
		console.log("Requested URL is: " + request.url);
		response.end();
	}
}).listen(8888);
console.log('Server has started');


function renderFile(response, fileName, contentType) {
	fs.readFile(fileName, function(error, data) {
		if (error) {
			response.writeHead(404);
			response.write('File not found!');
		} else {
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
			response.end();
	});
}
