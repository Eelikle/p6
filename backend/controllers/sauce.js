// in controllers/stuff.js

const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceBody = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host');
  const sauce = new sauce({
    name: sauceBody.name,
    description: sauceBody.description,
    imageUrl: url + '/images/' + req.file.filename,
    manufacturer : sauceBody.manufacturer,
    userId: sauceBody.userId,
    heat : sauceBody.heat,
    mainPepper : sauceBody.mainPepper,
    likes : 0 ,
    dislikes : 0 , 
    usersLiked : [],
    usersDisliked : [],
  });
  Sauce.save().then(
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



// exports.createsauce = (req, res, next) => {
//   const sauce = new sauce({
//     title: req.body.title,
//     description: req.body.description,
//     imageUrl: req.body.imageUrl,
//     price: req.body.price,
//     userId: req.body.userId
//   });
//   sauce.save().then(
//     () => {
//       res.status(201).json({
//         message: 'Post saved successfully!'
//       });
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// };

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

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      title: req.body.sauce.title,
      description: req.body.sauce.description,
      imageUrl: url + '/images/' + req.file.filename,
      price: req.body.sauce.price,
      userId: req.body.sauce.userId
    };
  } else {
    sauce = {
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      userId: req.body.userId
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
exports.likes = (req,res,next )=>{

const foundSauce = Sauce.findOne({_id: req.params.id})

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

}