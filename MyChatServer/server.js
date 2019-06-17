const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(express.static('public/css'));
app.use(express.static('public/html'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/chat/:id', (req, res) => {
    let data = fs.readFile('./public/data/chat.txt', 'utf8', function (err, data) {
        if (err) {
            res.status(404).send("404 File not found");
        } else {
            let lines = data.split('\n');
            if (req.params.id > 0 && req.params.id <= lines.length) {
                let line = lines[req.params.id - 1];
                let elements = line.split(';');

                if(elements[1] !== undefined) {
                    let obj = {name: elements[0], age: elements[1]};
                    res.send(JSON.stringify(obj));
                } else {
                    res.send('error');
                }
            }  else {
                res.send('error');
            }
        }
    })
});

app.post('/chat', (req, res) => {
    console.log(req.query.name);
    console.log(req.query.message);
    if (req.body.name && req.body.message) {
            let line = `${req.body.name};${req.body.message}\n`;

            fs.appendFile('./public/data/chat.txt', line, 'utf8', function(err) {
                if (err) throw err
                console.log('@file chat.txt: new data added');

                fs.readFile(`./public/html/confirm.html`, {encoding: 'utf-8'}, (err, data) => {
                    if (err) {
                        res.status(404).send('404 File not Found')
                    }
                    res.send(data)
                });
            });
        } else {
            fs.readFile(`./public/html/error.html`, {encoding: 'utf-8'}, (err, data) => {
                if (err) {
                    res.status(404).send('404 File not Found')
                }
                res.send(data)
            });
        }
});


app.get('/chat', (req, res) => {
    console.log("hllo")
    res.send("hllo")
});

app.listen(3000, () => {
    console.log('Access via localhost or IP 192.168.1.205');
    console.log('Listening to port: ' + 3000);
});

// http.createServer(function (req, res) {
//     let q = url.parse(req.url, true);
//
//     if (q.pathname === '/') {
//         respondWithFile(res, './public/html/index.html', 'text/html')
//     } else if (q.pathname === '/chat') {
//         let chat_part1 = fs.readFileSync('./public/html/chat.html', 'utf8');
//         let chat_part2 = '';
//         let data = fs.readFileSync('./public/data/chat.txt', 'utf8');
//         let chat_part3 = fs.readFileSync('./public/html/chat2.html', 'utf8')
//
//         let lines = data.split('\n');
//         lines.forEach((line) => {
//             let elements = line.split(';');
//             if(elements[1] !== undefined)
//                 chat_part2 += `<div><h3>${elements[0]}</h3><p>${elements[1]}</p></div>`
//         })
//
//         res.writeHead(200, {'Content-Type': 'text/html'})
//         res.write(`${chat_part1}${chat_part2}${chat_part3}`)
//         return res.end();
//     } else if (q.pathname === '/chat_uploud') {
//         if (q.query.name && q.query.message) {
//             let line = `${q.query.name};${q.query.message}\n`;
//
//             fs.appendFile('./public/data/chat.txt', line, 'utf8', function(err) {
//                 if (err) throw err
//                 console.log('@file chat.txt: new data added');
//
//                 fs.readFile(`./public/html/confirm.html`, {encoding: 'utf-8'}, (err, data) => {
//                     if (err) {
//                         res.writeHead(404, {'Content-Type': `text/html`});
//                         return res.end('404 Not Found')
//                     } else {
//                         res.writeHead(200, {'Content-Type': `text/html`});
//                         res.write(data)
//                         return res.end();
//                     }
//                 });
//             });
//         } else {
//             fs.readFile(`./public/html/error.html`, {encoding: 'utf-8'}, (err, data) => {
//                 if (err) {
//                     res.writeHead(404, {'Content-Type': `text/html`});
//                     return res.end('404 Not Found')
//                 }
//                 res.writeHead(200, {'Content-Type': `text/html`});
//                 res.write(data)
//                 return res.end()
//             });
//         }
//     }else if (q.pathname === '/style.css') {
//         respondWithFile(res, './public/css/style.css', "text/css")
//     } else {
//         let filename = './public/html' + q.pathname + '.html';
//         respondWithFile(res, filename, "text/html")
//     }
//
// }).listen(3000);
//
// function respondWithFile(res, path, contentType) {
//     res.writeHead(200, {'Content-Type': `${contentType}`});
//
//     fs.readFile(`${path}`, {encoding: 'utf-8'}, (err, data) => {
//         if (err) {
//             console.error(err.message);
//         } else {
//             res.write(data)
//         }
//         res.end()
//     });
// }