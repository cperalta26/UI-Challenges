const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require('./models/comment')

const data = [
  {
      name: "Cloud's Rest",
      image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  },
  {
      name: 'Desert Mesa',
      image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  },
  {
      name: 'Canyon Floor',
      image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'
  }
]

const seedDB = () => {
  //Remove all campgrounds
  Campground.remove({}, (err) => {
    if (err) {
      console.log(`error: ${err}`)
    } else {
      console.log('removed all campgrounds!!!')

      //add a few campgrounds
      data.forEach( seed => {
        Campground.create(seed, (err, newCampground) => {
          if (err) {
            console.log(`error: ${err}`)
          } else {
            console.log(`added the following campground: ${newCampground}`)
            //create a comment
            Comment.create(
              {
                text: 'This place is great, but I wish there was internet',
                author: 'Homer'
              },
              (error, comment) => {
                if (error) {
                  console.log(`error ${error}`)
                } else {
                  newCampground.comments.push(comment)
                  newCampground.save()
                  console.log('Created a new comment')
                }
              }
            )
          }
        })
      })
    }
  })

}

module.exports = seedDB
