const express = require('express');
const multer = require('multer');
const fs = require('fs');
const iconv = require('iconv-lite');
const basicAuth = require('express-basic-auth');
const chardet = require('chardet');

const app = express();
const port = process.env.PORT || 5000;
const upload = multer({ dest: 'uploads/' });

let files = [];
let storageMap = new Map();
let ipMap = new Map();

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const fileName = file.originalname;
  const encoding = chardet.detect(fileName);
  const decodedFileName = iconv.decode(Buffer.from(fileName, 'binary'), encoding);
  const encodedFileName = iconv.encode(decodedFileName, 'utf8').toString('binary');
  const uploadTime = new Date();
  const ip = req.ip;
  files.unshift({ name: encodedFileName, uploadTime, downloads: 0 });
  storageMap.set(encodedFileName, file.filename);
  ipMap.set(encodedFileName, { upload: ip, downloads: [] });
  if (files.length > 5) {
    files.pop();
  }
  console.log(`File ${decodedFileName} uploaded by ${ip} at ${uploadTime}`);
  res.redirect('/');
});

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Recent Files</title>
      </head>
      <body>
        <h1>Recent Files</h1>
        <ul>
          ${files.map(file => `
            <li>
              <a href="/download/${encodeURIComponent(iconv.decode(Buffer.from(file.name, 'binary'), 'utf8'))}">${iconv.decode(Buffer.from(file.name, 'binary'), 'utf8')}</a>
              (${file.downloads} downloads, uploaded at ${file.uploadTime.toLocaleString()})
            </li>
          `).join('')}
        </ul>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file">
          <button type="submit">Upload</button>
        </form>
      </body>
    </html>`);
});

app.get('/download/:name', (req, res) => {
  const fileName = iconv.encode(decodeURIComponent(req.params.name), 'binary').toString('utf8');
  const encodedFileName = iconv.encode(fileName, 'utf8').toString('binary');
  const file = files.find(file => file.name === encodedFileName);
  if (file) {
    file.downloads++;
    const storedFileName = storageMap.get(encodedFileName);
    const path = `uploads/${storedFileName}`;
    if (fs.existsSync(path)) {
      const ip = req.ip;
      const ipInfo = ipMap.get(encodedFileName);
      ipInfo.downloads.push(ip);
      console.log(`File ${fileName} downloaded by ${ip} at ${new Date()}`);
      res.download(path, iconv.decode(Buffer.from(fileName, 'binary'), 'utf8'), () => {
        ;
      });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});

const password = process.argv.includes('-p') ? process.argv[process.argv.indexOf('-p') + 1] : 'passw0rd';

app.get('/admin', basicAuth({
  users: { admin: password },
  challenge: true,
}), (req, res) => {
  res.send(`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Admin Page</title>
      </head>
      <body>
        <h1>Admin Page</h1>
        <form action="/clear" method="post">
          <button type="submit">Clear All Files</button>
        </form>
        <br>
        <h2>IP Addresses</h2>
        <ul>
          ${Array.from(ipMap.entries()).map(([name, info]) => `
            <li>
              ${iconv.decode(Buffer.from(name, 'binary'), 'utf8')}
              <ul>
                <li>Upload: ${info.upload}</li>
                <li>Downloads: ${info.downloads.join(', ')}</li>
              </ul>
            </li>
          `).join('')}
        </ul>
      </body>
    </html>`);
});

app.post('/clear', basicAuth({
  users: { admin: password },
  challenge: true,
}), (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) throw err;
    if (files.length > 0) {
      files.forEach(file => {
        const path = `uploads/${file}`;
        fs.unlink(path, err => {
          if (err) throw err;
        });
      });
    }
    storageMap.clear();
    files.length = 0;
    ipMap.clear();
    console.log('All files cleared by admin');
    res.redirect('/admin');
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});