'use strict';

const router = require('express').Router();
const fs = require('fs');
const downloader = require('../services/downloader');

// parameters
const allowedEmails = process.env.ALLOWEDEMAILSLOCAL || 'whiteList.txt';
const customerEmailsRemoteUrl = process.env.ALLOWEDEMAILSREMOTE || ''; // Your fake list here
const approvedFileToSend = process.env.SECUREDZIPFILE || './products/sample.zip';

var customerEmails = [];
downloader.download(customerEmailsRemoteUrl, allowedEmails)
            .then((msg) => {
              //console.log(msg);
              customerEmails = fs.readFileSync(allowedEmails)
                                 .toString()
                                 .toLowerCase()
                                 .split("\n")
                                 .filter(e => e.indexOf("@") !== -1);
              //only show emails
              //var arrayLength = customerEmails.length;
              //for (var i = 0; i < arrayLength; i++) {
              //    console.log(customerEmails[i]);
              //}
            });

router.get('/:email', function(req, res) {
  //var myemail = 'hello@world.com';
  const email = req.params['email'];
  console.log(email);
  if (customerEmails.includes(email.trim())) {
    //res.send('Approved to send file');
    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-disposition': 'attachment; filename=' + email + '.zip'
    });
    // name of the download to send if approved
    fs.createReadStream(approvedFileToSend).pipe(res);
  } else {
    res.send('NOT Approved to send file');
  }
});

router.get('/api/monitoring/ping', function(req, res) {
	res.send('PONG!');
});

module.exports = router;