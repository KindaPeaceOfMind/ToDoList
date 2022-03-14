const express = require('express');
const app = express();
const jsonParser = express.json()
const fs = require('fs');

const host = '127.0.0.1'
const port = 7000

function notFound(res) {
  res.statusCode = 404
  res.setHeader('Content-Type', 'text/plain')
  res.end('Not found\n')
}
app.use(jsonParser, async function (req, res) {
  switch (req.method) {
    case 'GET': {
      switch (req.url) {
        case '/': {
          res.statusCode = 200
          res.sendFile(__dirname + '/html.html')
          break
        }
        case '/css.css': {
          res.statusCode = 200
          res.sendFile(__dirname + '/css.css')
          break
        }
        case '/js.js': {
          res.statusCode = 200
          res.sendFile(__dirname + '/js.js')
          break
        }
        case '/mini_db.json': {
          res.statusCode = 200
          res.sendFile(__dirname + '/mini_db.json')
          break
        }
        default: {
          notFound(res)
          break
        }
      }
      break
    }
    case 'POST': {
      switch (req.url) {
        case '/post': {
          fs.writeFileSync('mini_db.json', JSON.stringify(req.body));
          res.statusCode = 200
          res.end('Created user request')
          break
        }
        case '/': {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end('Create user request\n')
          break
        }
        default: {
          notFound(res)
          break
        }
      }

      break
    }
    default: {
      notFound(res)
      break
    }
  }
})

app.listen(port, host, () => {
  console.log(`Server listens http://${host}:${port}`)
})