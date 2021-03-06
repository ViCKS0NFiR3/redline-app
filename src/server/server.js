const http = require('http');
const express = require('express');

const app = express();
const clientPath = `${__dirname}/../../public`;
console.log(`Serving static from ${clientPath}`)

app.use(express.static(clientPath));

const server = http.createServer(app);

server.on('error',(err) => {
    console.error('Server Error: ',err);
});

server.listen(8080, () => {
    console.log('Server started on Port 8080');
});