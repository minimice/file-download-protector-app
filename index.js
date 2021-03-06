'use strict';
const express = require('express');
const controllers = require('./controllers');
const app = express();
const port = process.env.PORT || 4001;

app.use('/', controllers);
app.listen(port, function() {
  console.log('Running on port %s', port);
});
