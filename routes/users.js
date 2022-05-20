var express = require('express');
var router = express.Router();
const userCtrl = require('../controllers/userCtrl');
const eventCtrl = require('../controllers/eventCtrl');
const verify = require('../helper/verify')


/* GET home page. */
router.get('/login', function (req, res, next) {
    userCtrl.login(req, res);
});

router.post('/login', function (req, res, next) {
    userCtrl.login(req, res);
});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.send("logout success!");
});

router.get('/loginAPI', function (req, res, next) {
    userCtrl.authorize(req, res);
});

router.get('/listAPI', verify ,(req, res) => {
    eventCtrl.listAPI(req,res);
})
    


    

module.exports = router;