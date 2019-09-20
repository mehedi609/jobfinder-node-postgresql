const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const Gig = require('./../models/Gig');
const db = require('./../config/database');
const Op = Sequelize.Op;

// GET gig list
// PATH /gigs
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.findAll();
    res.render('gigs', { gigs });
  } catch (e) {
    console.log(e.msg);
    res.sendStatus(500);
  }
});

// Display add gig form
// GET "/gigs/add"
router.get('/add', (req, res) => res.render('add'));

// Add a gig
// POST "/gigs/add"
router.post('/add', async (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;

  let errors = [];
  if (!title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!technologies) {
    errors.push({ text: 'Please add some technologies' });
  }
  if (!description) {
    errors.push({ text: 'Please add a description' });
  }
  if (!contact_email) {
    errors.push({ text: 'Please add a contact_email' });
  }

  // check for errors
  if (errors.length > 0) {
    res.render('add', {
      errors,
      technologies,
      description,
      contact_email,
      budget
    });
  } else {
    if (!budget) {
      budget = 'Unknown';
    } else {
      budget = `$${budget}`;
    }

    // Make lowercase and remove coma
    technologies = technologies.toLowerCase().replace(/, /g, ',');

    try {
      await Gig.create({
        title,
        technologies,
        budget,
        description,
        contact_email
      });
      res.redirect('/gigs');
    } catch (e) {
      console.log(e.msg);
      res.sendStatus(500);
    }
  }
});

// Search for gigs
router.get('/search', async (req, res) => {
  const { term } = req.query;

  try {
    const gigs = await Gig.findAll({
      where: { technologies: { [Op.like]: `%${term.toLowerCase()}%` } }
    });

    res.render('gigs', { gigs });
  } catch (e) {
    console.log(e.msg);
    res.sendStatus(500);
  }
});

module.exports = router;
