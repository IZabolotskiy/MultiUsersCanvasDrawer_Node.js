const express = require('express');
const app = express();
const http = require('http');
//const server2 = require('http').Server(app); 

const fs = require('fs');

app.use(express.static('public'));

let drawingData = [];

const server = http.createServer((req, res, app) => {
	
  // Check the URL requested by the client
  if (req.url === '/') {
    // If the root URL is requested, send a plain text response
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, World!');
  } else if (req.url === '/html') {
    // If /html URL is requested, read and send an HTML file
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('File not found');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
  } 
  

});
const io = require('socket.io')(server);
io.on('connection', (socket) => {
    console.log(socket.request.connection.remoteAddress);
	 console.log('client IP: ',socket.handshake.address);
// this should work too
    console.log('client IP: ',socket.client.conn.remoteAddress);
// or
    console.log('client IP: ',socket.conn.remoteAddress);
 console.log('user connected');
  // Send existing drawing data for this client to the new client
  socket.emit('init', drawingData[socket.id]);

  // Broadcast new drawing data to all clients except the sender
  socket.on('draw', (data) => {
    // Add the drawing data to the correct client's data object
    if (!drawingData[socket.id]) {
      drawingData[socket.id] = [];
	  console.log('draw');
    }
    drawingData[socket.id].push(data);
    // Broadcast the new data to all clients except the sender
    socket.broadcast.emit('draw', data);
	console.log('broadcast')
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});



server.listen(3005, () => {
  console.log('Server2 running on port 3005');
});
//const port = process.env.PORT || 3005;
//server.listen(port, () => {
//console.log(Server running on port ${port});
//});