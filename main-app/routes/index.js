const express = require('express');
const speakersRoutes = require('./speakers');
const feedbackRoutes = require('./feedback');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/images/:type/:file', async (req, res, next) => {
    try {
      const image = await speakerService.getImage(`${req.params.type}/${req.params.file}`)
      return image.pipe(res)
    }
    catch(err) {
      return next(err)
    }
  })

  router.get('/', async (request, response) => {
    const topSpeakers = await speakerService.getList();
    const allArtwork = await speakerService.getAllArtwork();
    if (!request.session.visitcount) {
      request.session.visitcount = 0;
    }
    request.session.visitcount += 1;
    response.render('./layout/index', {
      pageTitle: 'Welcome', template: 'index', topSpeakers, allArtwork,
    });
  });

  router.use('/speakers', speakersRoutes(params));
  router.use('/feedback', feedbackRoutes(params));
  return router;
};
