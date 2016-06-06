'use strict';
var http = require("http").createServer(handleIndex)
	, io = require("socket.io").listen(http)
	, fs = require("fs")
	,path = require("path");
;

http.listen(7777,function(){
	console.log("Server has started");
});

function handleIndex(request,response){
	console.log("Request received.");
	
	var filePath = '.' + request.url;
    if (filePath == './'){
        filePath = '../pages/index.html';
    }
   
    var extname = path.extname(filePath);
    var resource = path.basename(filePath);
    console.log(resource);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
        break;
        case '.css':
            contentType = 'text/css';
            filePath = '../css/style.css';
        break;
        case '.png':
            contentType = 'text/css';
            filePath = '../images/'+resource;
        break;
    }
	console.log(filePath);
	path.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });	

}

var visits = 0;

io.on('connection', function(socket){
  
  visits++;

  socket.emit('visits', visits);

  socket.broadcast.emit('visits', visits);
  
  socket.on('disconnect', function(){
    visits--;
   socket.broadcast.emit('visits', visits);
  });

});
