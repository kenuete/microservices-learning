const express = require('express');

const service = express();

const SpeakerService = require('./lib/SpeakerService');

module.exports = (config) => {
  const log = config.log();
  const speakerService = new SpeakerService(config.data.speakers);
  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }

  service.use('/images', express.static(config.data.images));
  service.get('/list', async (req, res, next) => {
    try {
      return res.json(await speakerService.getList());
    } catch (err) {
      return next(err);
    }
  });

  service.get('/list-short', async (req, res, next) => {
    try {
      return res.json(await speakerService.getListShort());
    } catch (err) {
      return next(err);
    }
  });

  service.get('/names', async (req, res, next) => {
    try {
      return res.json(await speakerService.getNames());
    } catch (err) {
      return next(err);
    }
  });

  service.get('/speakers/:shortname', async (req, res, next) => {
    try {
      return res.json(await speakerService.getSpeaker(req.params.shortname));
    } catch (err) {
      return next(err);
    }
  });

  service.get('/artwork/:shortname', async (req, res, next) => {
    try {
      return res.json(await speakerService.getArtworkForSpeaker(req.params.shortname));
    } catch (err) {
      return next(err);
    }
  });

  service.get('/artwork', async (req, res, next) => {
    try {
      return res.json(await speakerService.getAllArtwork());
    } catch (err) {
      return next(err);
    }
  });

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
