var http = require('http');
var fs = require('fs');

var contentMap = {
	'/': './index.html',
	'/view/dashboard.html': './Piliana/1.0.0/view/dashboard.html',
	'/view/comment.html': './Piliana/1.0.0//view/comment.html',
	'/view/reply.html' : './Piliana/1.0.0//view/reply.html'
};

http.createServer(function(request, response) {
	//console.log(request.url.toString());
	if (contentMap[request.url]) {
		renderFile(response, contentMap[request.url], "text/html");
	}
	else if (/Piliana\/1.0.0\/js\/piliana.js/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "text/javascript");
	}
	else if (/Piliana\/1.0.0\/css\/piliana.css/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "text/css");
	}
	else if (/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString()) || /^\/[a-zA-Z0-9\/]*.min.js$/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "text/javascript");
	}
	else if (/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "text/css");
	}
	else if (/Piliana\/1.0.0\/media\/sprites\/icons.png/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "image/png");
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
