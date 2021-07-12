// in controllers/stuff.js

const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  console.log(req.body.sauce)
  const sauceBody = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host');
  const sauce = new Sauce({
    name: sauceBody.name,
    description: sauceBody.description,
    imageUrl: url + '/images/' + req.file.filename,
    manufacturer : sauceBody.manufacturer,
    userId: sauceBody.userId,
    heat : sauceBody.heat,
    mainPepper : sauceBody.mainPepper, // lastr vlaueto match
    likes : 0 ,
    dislikes : 0 , 
    usersLiked : [],
    usersDisliked : [],
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = async(req, res, next) => {
  let oldSauce =await Sauce.findById(req.params.id).then(saucel=> saucel)
  console.log(oldSauce)
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      name: req.body.sauce.name,
      description: req.body.sauce.description,
      imageUrl: url + '/images/' + req.file.filename,
      userId: req.body.sauce.userId,
      manufacturer : req.body.sauce.manufacturer,
      heat : req.body.sauce.heat,
      mainPepper : req.body.sauce.mainPepper
    };
  } else {
    sauce = {
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      userId: req.body.userId,
      manufacturer : req.body.manufacturer,
      heat : req.body.heat ? req.body.heat : oldSauce.heat ,
      mainPepper : req.body.mainPepper ? req.body.mainPepper : oldSauce.mainPepper,
      imageUrl : oldSauce.imageUrl
    };
  }
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}).then(
    (sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink('images/' + filename, () => {
        Sauce.deleteOne({_id: req.params.id}).then(
          () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
        ).catch(
          (error) => {
            res.status(400).json({
              error: error
            });
          }
        );
      });
    }
  );
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

// liked and disliked 
/**
 * like  = 1  the user likes the sauce 
 * like  = -1 the user dislikes the sauce 
 * like  = 0  the user unlikes or un disliked the sauce 
 * 
 * userliked is array we can push or splice from the array by uing (push  splice indexOf length)  
 */
exports.likes = async (req,res,next )=>{

const foundSauce =await Sauce.findOne({_id: req.params.id})

const userId = req.body.userId;
const like = req.body.like;



// check fo rthe likes value
if(like == 1){
  //check if the user likes the sauce before 
if(!foundSauce.usersLiked.includes(userId)){
  foundSauce.usersLiked.push(userId)
}else{
  // if user liked before we remove the user likes 
  const userIndex = foundSauce.usersLiked.indexOf(userId)
  foundSauce.usersLiked.splice(1,userIndex)
}
// we update the likes number based on the changes we made 
foundSauce.likes = foundSauce.usersLiked.length

}else if (like == -1){
  if(!foundSauce.usersDisliked.includes(userId)){
    foundSauce.usersDisliked.push(userId)
  }else{
    const userIndex = foundSauce.usersDisliked.indexOf(userId)
    foundSauce.usersDisliked.splice(1,userIndex)
  }
  foundSauce.dislikes = foundSauce.usersDisliked.length
}


foundSauce.save()
res.status(200).json({
  message: 'Form updated for likes/dislikes'
});
}

