// Step 1 - Load libraries
const path = require('path');
const express = require('express');
const fs = require('fs');
const resources = ['public', 'images'];
var fileList = ['mane.jpg', 'coutinho.jpg', 'firmino.jpeg', 'salah.jpeg' , 'wijnaldum.jpeg'];

console.log('hello');
const randomFile = (array) => {
    const randomNum = Math.floor(Math.random() * array.length)
    return array[randomNum];
}

const imageDir = path.resolve(__dirname, 'images')
function getRandFile() {
    var fileList = [];
    fs.readdir(imageDir, (err, files) => {
        files.forEach(file => {
            fileList.push(file); //add file name to an array
        });
        console.log(fileList);
        var len = fileList.length;
        var randomNum = Math.floor(Math.random() * len)
        var randomFile = fileList[randomNum];
        console.info(randomFile);
        return randomFile;
    });
}

// Step 2 - Create instance of Express
const app = express();

// Step 3 - Declare rules
app.get('/image', (req, resp) => {
    resp.status(200);
    resp.type('text/html');
    resp.send(`<img src='/${randomFile(fileList)}'>`);
});

app.get('/random-image', (req, resp) => {
    resp.status(200);
    resp.type('image/jpg');
    resp.sendFile(path.join(__dirname, 'images', randomFile(fileList)));
});

for (let res of resources) {
    console.info(`Adding ${res} to static `)
    app.use(express.static(path.join(__dirname, res)));
}


app.use((req, resp) => {
    resp.status(404);
    resp.sendFile(path.join(__dirname, 'public', '404.html'));
});

// Step 4 - assign port and Start Server
const PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) || 3000;
app.listen(PORT, () => {
    console.info(`App started on port ${PORT} at ${new Date()}`);
});