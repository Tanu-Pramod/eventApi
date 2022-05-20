var express = require('express');
var router = express.Router();
const guestCtrl = require('../controllers/guestCtrl');
const auth = require('../helper/auth');
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {

    cb(null, Date.now()+file.originalname)
  }
});

// to convert file to base64 multer.memoryStorage is used
// const storage = multer.memoryStorage()

const upload = multer({
  storage: storage
});


router.get('/', function (req, res) {
  guestCtrl.save(req, res);
});

router.post('/addGuest', upload.single('image'), function (req, res) {
  guestCtrl.save(req, res);
});

router.get('/guestlist', function(req,res){
  guestCtrl.guestlist(req,res);
});

router.get('/details/:id', function(req,res){
  console.log("Route")
  guestCtrl.guestDetails(req,res);
});


router.get('/edit/:id',function(req,res){
  guestCtrl.editGuestForm(req,res);
});

router.post('/edit/:id',upload.single('image'),function(req,res){
  guestCtrl.editGuest(req,res);
});


router.get('/delete/:id',function(req,res){
  guestCtrl.deleteGuest(req,res);
});


router.get('/delete/event/:id/:guest',function(req,res){
  guestCtrl.deleteEvent(req,res);
});


module.exports = router;