const router = require('express').Router({mergeParams: true})
const Comment = require('../models/comment')
const Campground = require('../models/campground')
const middleware = require('../middleware')


//Comments new
router.get('/new', middleware.isLoggedIn, (req, res) => {
  //find campground by id
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(`error: ${err}`)
    } else {
      res.render('comments/new', {campground})
    }
  })
})

//Comments create
router.post('/', middleware.isLoggedIn, (req, res) => {
  //lookup campground using ID
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(`error: ${err}`)
      res.redirect('/campgrounds')
    } else {
      //create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash('error', 'Something went wrong')
          console.log(`error: ${err}`)
        } else {
          //add username and id to comment
          comment.author.id = req.user.id
          comment.author.username = req.user.username
          //save comment
          comment.save()
          //connect new comment to campground
          campground.comments.push(comment)
          campground.save()
          //redirect campground show page
          req.flash('success', 'Successfully added comment')
          res.redirect(`/campgrounds/${campground._id}`)
        }
      })
    }
  })
})

//COMMENT EDIT ROUTE
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err || !foundCampground) {
      req.flash('error', 'No campground found')
      return res.redirect('back')
    }

    Comment.findById(req.params.comment_id, (error, comment) => {
      if (err) {
        console.log(`Found the following error when trying to edit a comment: ${error}`)
        res.redirect('back')
      } else {
        res.render('comments/edit', {campgroundId: req.params.id, comment})
      }
    })
  })

})

//COMMENT UPDATE ROUTE
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back')
    } else {
      res.redirect(`/campgrounds/${req.params.id}`)
    }
  })
})

//COMMENT DESTROY ROUTE
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if (err) {
      res.redirect('back')
    } else {
      req.flash('success', 'Comment deleted')
      res.redirect(`/campgrounds/${req.params.id}`)
    }
  })
})

module.exports = router
