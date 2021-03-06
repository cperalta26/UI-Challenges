const router = require('express').Router()
const Campground = require('../models/campground')
const middleware = require('../middleware')

//INDEX - show all campgrounds
router.get('/', (req, res, next) => {
  //Get all campground from DB
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(`This is the error: ${err}`)
    } else {
      res.render('campgrounds/index', {allCampgrounds})
    }
  })
})

//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res, next) => {
  const {name} = req.body
  const {price} = req.body
  const {image} = req.body
  const {description} = req.body
  const author = {
    id: req.user._id,
    username: req.user.username
  }
  const newCampground = {name, price, image, description, author}

  //Create a new campground and save it to DB
  Campground.create(newCampground, (err, newlyCreated) => {
    if (err) {
      console.log(`This is the error: ${err}`)
    } else {
      console.log(`Campground was created: ${newlyCreated}`)
      res.redirect('/campgrounds')
    }
  })
})

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res, next) => {
  res.render('campgrounds/new')
})

//SHOW - shows more info about one campground
router.get('/:id', (req, res, next) => {
  //find the campground with provided ID
  const campId = req.params.id
  Campground.findById(campId).populate('comments').exec( (err, foundCampground) => {
    if (err || !foundCampground) {
      console.log(`This is the error ${err}`)
      req.flash('error', 'Campground not found')
      res.redirect('/campgrounds')
    } else {
      //render show template with that campground
      res.render('campgrounds/show', {foundCampground})
    }
  })
})

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
      if (err) {
        req.flash('error', 'Something went wrong')
      }
      res.render('campgrounds/edit', {foundCampground})
  })
})

//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
    if (err) {
      console.log(`Found the following error: ${err}`)
      res.redirect('/campgrounds')
    } else {
      //redirect back to this campground's page
      res.redirect(`/campgrounds/${req.params.id}`)
    }
  })
})

//DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(`Found the following error when trying to delete: ${err}`)
      res.redirect('/campgrounds')
    } else {
      res.redirect('/campgrounds')
    }
  })
})

module.exports = router
