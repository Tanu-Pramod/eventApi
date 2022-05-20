var express = require('express');
var router = express.Router();
const eventCtrl = require('../controllers/eventCtrl');
const mailerCtrl = require('../controllers/mailerCtrl')


router.get('/',function(req, res, next) {
  res.render('index', { title: 'Express', event_name: '', description: '',olddate:'', venue:'' });
});

router.get('/details/:id',function(req, res){
  eventCtrl.event_details(req, res);
});

router.get('/mailer',function(req, res){
  mailerCtrl.dropdown(req, res);
});
router.post('/mailer/',function(req, res){
  eventCtrl.mailer(req, res);
});

router.get('/mailer/:id/:guest_Id',function(req, res){
  eventCtrl.status(req, res);
});
router.get('/not/:id/:guest_Id',function(req, res){
  eventCtrl.cancel(req, res);
});

router.post('/addEvent',function(req, res){
  eventCtrl.save(req, res);
  
});

router.get('/list',function(req,res){
  eventCtrl.list(req,res);
});

router.get('/listAPI',function(req,res){
  eventCtrl.listAPI(req,res);
});

router.get('/page',function(req,res){
  eventCtrl.page(req,res);
});

router.get('/sorting',function(req,res){
  eventCtrl.sorting(req,res);
});

router.get('/filter',function(req,res){
  eventCtrl.filter(req,res);
});

router.get('/edit/:id',function(req,res){
  eventCtrl.editEventForm(req,res);
});


router.post('/edit/:id',function(req,res,next){
  eventCtrl.editEvent(req,res);
});

router.get('/delete/:id',function(req,res){
   eventCtrl.deleteEvent(req,res);
});

router.get('/delete/guest/:id/:guest',function(req,res){
  eventCtrl.deleteGuest(req,res);
});

module.exports = router;
