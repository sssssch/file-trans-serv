# File Upload and Download App

This is a simple file upload and download application built with Node.js and Express. It allows users to upload files to the server and download them later. The application also keeps track of the number of downloads for each file and the IP addresses of the users who downloaded them.

## Installation

To install the application, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Start the server by running `npm start`.

## Usage

To use the application, follow these steps:

1. Open your web browser and navigate to `http://localhost:5000`.
2. To upload a file, click the "Choose File" button and select a file from your computer. Then click the "Upload" button.
3. To download a file, click the file name in the list of recent files. The file will be downloaded to your computer.
4. To view the admin page, navigate to `http://localhost:5000/admin`. You will be prompted to enter a username and password. The default username is `admin` and the default password is `passw0rd`.
5. On the admin page, you can view the IP addresses of users who downloaded each file and clear all files from the server.

## Dependencies

The application uses the following dependencies:

- [Express](https://expressjs.com/) - A web framework for Node.js
- [Multer](https://github.com/expressjs/multer) - A middleware for handling file uploads
- [Iconv-lite](https://github.com/ashtuchkin/iconv-lite) - A library for character encoding conversion
- [Express-basic-auth](https://github.com/LionC/express-basic-auth) - A middleware for basic authentication
- [Chardet](https://github.com/runk/node-chardet) - A library for character encoding detection

## How to use

### run
Use the start.sh, do `sh start.sh` to start this application

### upload 
Use the commit.sh, do `sh commit.sh` to push it to github

### docker package
Use the docker-start.sh, do `sh docker-start.sh` to run with docker

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project was inspired by the [File Upload and Download App](https://github.com/bradtraversy/node_file_uploader) by Brad Traversy.