var http = require('http');
var fs = require('fs');

var contentMap = {
	'/': './view/dashboard.html',
	'/comment': './view/comment.html',
	'/reply' : './view/reply.html'
}

http.createServer(function(request, response) {
	console.log(request.url.toString());
	if (contentMap[request.url]) {
		renderFile(response, contentMap[request.url], "text/html");
	} else if(request.url === "/index"){
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
	}
	else if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString()) || /^\/[a-zA-Z0-9\/]*.min.js$/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "text/javascript");
	}
	else if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "text/css");
	}
	else if(/^\/[a-zA-Z0-9\/]*.png$/.test(request.url.toString())){
		renderFile(response, request.url.toString().substring(1), "image/png");
	}
	else if(request.url.toString().includes('comment?id=')){
		renderFile(response, contentMap['/comment'], "text/html");
	}
	else if(request.url.toString().includes('reply?id=')){
		renderFile(response, contentMap['/reply'], "text/html");
	}
	else{
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
