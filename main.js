// Step 1 - Load libraries
const path = require('path');
const express = require('express');
const resources = ['public', 'images'];
const hbs = require('express-handlebars');
const asciify = require('asciify-image');

var fileList = ['mane.jpg', 'coutinho.jpg', 'firmino.jpeg', 'salah.jpeg' , 'wijnaldum.jpeg'];
const randomFile = (array) => {
    const randomNum = Math.floor(Math.random() * array.length)
    return array[randomNum];
}

// Step 2 - Create instance of Express
const app = express();
app.engine('hbs', hbs());
app.set('view engine', 'hbs');
app.set('views', 'views');

// Step 3 - Declare rules
app.get('/image', (req, resp) => {
    resp.status(200);
    const imageFile = randomFile(fileList);
    resp.format({
        'text/html' : () => {
            resp.render('image', {image: imageFile});
        },
        'image/jpg' : () => {
            resp.sendFile(path.join(__dirname, 'images', imageFile));
        },
        'text/plain' : () => {
            var options = {
                fit:    'box',
                width:  200,
                height: 100
            }
            asciify(path.join(__dirname, 'images', imageFile), options, function (err, asciified) {
                if (err) {
                    resp.status(400);
                    resp.send(JSON.stringify(err));
                    return;
                }
                resp.send(asciified);
            });
        },
        'application/json' : () => {
            resp.json({imageURL: `/${imageFile}`});
        },
        'default' : () => {
            resp.status(406);
            resp.end();
        }
    });
});

// app.get('/play', (req, resp) => {
//     resp.status(200);
//     const imageFile = randomFile(fileList);
//     resp.render('image', {image: imageFile});
// });

// app.get('/json', (req, resp) => {
//      resp.status(200);
//      resp.type('application/json');
//      resp.json({filename: randomFile(fileList)});
// });

// app.get('/image', (req, resp) => {
//     resp.status(200);
//     resp.type('text/html');
//     resp.send(`<img src='/${randomFile(fileList)}'>`);
// });

// app.get('/random-image', (req, resp) => {
//     resp.status(200);
//     resp.type('image/jpg');
//     resp.sendFile(path.join(__dirname, 'images', randomFile(fileList)));
// });

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