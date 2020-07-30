const express = require('express');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const formValidations = [
  check('name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('name is required'),
  check('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .escape()
    .withMessage('Valid Email is required'),
  check('title')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('Title is required'),
  check('message')
    .trim()
    .isLength({ min: 5 })
    .escape()
    .withMessage('Message is required'),
];

module.exports = (params) => {
  const { feedbackService } = params;
  router.get('/', async (req, res) => {
    const errors = req.session.feedback ? req.session.feedback.errors : false;
    const successMessage = req.session.feedback ? req.session.feedback.message : false;
    req.session.feedback = {};
    const feedbackList = await feedbackService.getList();

    res.render('./layout/index', {
      pageTitle: 'Feedback', template: 'feedback', feedbackList, errors, successMessage,
    });
  });

  router.post('/',
    formValidations,
    async (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          req.session.feedback = {
            errors: errors.array(),
          };
          return res.redirect('/feedback');
        }
        const {
          email, name, message, title,
        } = req.body;

        await feedbackService.addEntry(email, name, message, title);
        req.session.feedback = {
          message: 'Thank you for your feedback',
        };
        return res.redirect('/feedback');
      } catch (err) {
        return next(err);
      }
    });

  router.post('/api', formValidations, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          errors: errors.array(),
        });
      }
      const {
        email, name, message, title,
      } = req.body;

      await feedbackService.addEntry(name, email, title, message);
      const feedbackList = await feedbackService.getList();
      return res.json({
        feedbackList,
        successMessage: 'Thank you',
      });
    } catch (err) {
      next(err);
    }
  });
  return router;
};
