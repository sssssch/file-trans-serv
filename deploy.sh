#!/bin/bash

# Install dependencies
npm install

# Start server
node -e "const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;
const upload = multer({ dest: 'uploads/' });

let files = [];
let storageMap = new Map();

app.use(express.static('public'));

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const fileName = file.originalname;
  const encodedFileName = encodeURIComponent(fileName);
  files.unshift({ name: encodedFileName, downloads: 0 });
  storageMap.set(encodedFileName, file.filename);
  if (files.length > 5) {
    files.pop();
  }
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
              <a href="/download/${file.name}">${decodeURIComponent(file.name)}</a>
              (${file.downloads} downloads)
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
  const fileName = decodeURIComponent(req.params.name);
  const file = files.find(file => file.name === fileName);
  if (file) {
    file.downloads++;
    const encodedFileName = encodeURIComponent(file.name);
    const path = `uploads/${storageMap.get(encodedFileName)}`;
    const originalFileName = storageMap.get(encodedFileName);
    res.download(path, originalFileName, () => {
      fs.unlinkSync(path);
    });
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
"