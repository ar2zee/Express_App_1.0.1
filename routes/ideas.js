const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth')




require('../models/Idea');
const Idea = mongoose.model('ideas')

router.get('/', ensureAuthenticated, (req, res) => {
	Idea.find({user: req.user.id})
	.sort({date: 'desc'})
	.then((ideas) => {
		res.render('ideas/index', {
			ideas: ideas
		})
	})
})
router.post('/', ensureAuthenticated, (req, res) => {
	let errors = [];

	if(!req.body.title) {
		errors.push({text: 'Please Tittle'})
	}
	if(!req.body.details) {
		errors.push({text: 'Please Details'})
	}

	if(errors.length > 0) {
		res.render('ideas/add', {
			errors: errors,
			title: req.body.title,
			details: req.body.details
		})
	} else {
		const newUser = {
			title: req.body.title,
			details: req.body.title,
			user: req.user.id
		}
		new Idea(newUser)
		.save()
		.then((idea) => {
			req.flash('success_msg', 'Idea Added!');
			res.redirect('/ideas')
		})
	}
})
router.get('/add', ensureAuthenticated ,(req, res) => {
	res.render('ideas/add');
})

router.put('/:id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params.id
	})
	.then(idea => {
		idea.title = req.body.title;
		idea.details = req.body.details;

		idea.save()
		.then(idea => {
			req.flash('success_msg', 'Idea updated!');
			res.redirect('/ideas')
		})
	})
})
router.delete('/:id', ensureAuthenticated, (req, res) => {
	Idea.remove({_id: req.params.id})
	.then(() => {
		req.flash('success_msg', 'Idea Removed!');
		res.redirect('/ideas')
	})
})
router.get('/edit/:_id', ensureAuthenticated, (req, res) => {
	Idea.findOne({
		_id: req.params._id
	})
	.then((idea) => {
		if(idea.user != req.user.id){
			req.flash('error_msg', 'Not Authorized');
			res.redirect('/ideas');
		} else {
			res.render('ideas/edit', {
			idea: idea
			});
		}
		
	})
})

module.exports = router;