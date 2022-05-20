
var auth = function(req, res, next) {
    if (req.session && req.session.isLoggedIn){
      return next();
    }
    else
      return res.redirect('/user/login');
};

module.exports =  auth ; 