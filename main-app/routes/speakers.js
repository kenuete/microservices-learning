const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (req, res) => {
    const speakers = await speakerService.getList();
    const allArtwork = await speakerService.getAllArtwork();
    res.render('./layout/index', {
      pageTitle: 'Speakers', template: 'speakers', speakers, allArtwork,
    });
  });

  router.get('/:shortname', async (req, res) => {
    const speakerDetail = await speakerService.getSpeaker(req.params.shortname);
    const allArtwork = await speakerService.getArtworkForSpeaker(req.params.shortname);
    res.render('./layout/index', {
      pageTitle: 'Speakers', template: 'speaker-detail', speakerDetail, allArtwork,
    });
  });
  return router;
};
