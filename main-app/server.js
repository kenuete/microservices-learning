const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const speakerService = new SpeakerService('./data/speakers.json');
const feedbackService = new FeedbackService('./data/feedback.json');

const server = express();
const port = 0;


// middlewares are called first every request.
// these will be called in an order.
server.set('trust cookie', 1);

server.use(cookieSession({
  name: 'session',
  keys: ['dfhjdfh', 'dfhjdf'],
}));

server.use(bodyParser.urlencoded({
  extended: true,
}));

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

server.use(express.static(path.join(__dirname, 'static')));

server.locals.siteName = 'ROUX meetups';
server.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    next();
  } catch (err) {
    next(err);
  }
});

server.use('/', routes({
  speakerService,
  feedbackService,
}));

server.use((req, res, next) => {
  next(createError(404, 'Not found'));
});

server.use((err, req, res, next) => {
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
});

const serverInstance = server.listen(port, () => {
  console.log('Server is running at',serverInstance.address().port);
});


/* middlewares accept a callback with req, res, next as arguments.
They will be executed in the below order. next() is a must to go to next middleware.
use()
use()
get('/', () =>)
get('/path: qstring', () =>)
get('/path: qstring: ', () =>) -> optional qstring
*/
