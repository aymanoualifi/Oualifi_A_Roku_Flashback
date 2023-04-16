const express = require('express');
const server = express();
const port = process.env.PORT || 5000; 
// 5000 for the backend

// configure the back end to accept incoming data
// either as a JSON payload or as form data (encoded url strings)

server.use(express.json());
server.use(express.urlencoded({ extended: false })); //url?key=value&&key=value

// this route manage user data
server.use('/ums', require('./routes/api'));

server.listen(port, () => {
    console.log(`server is running on ${port}`);
})