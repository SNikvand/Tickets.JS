
/*
 * GET home page.
 */

exports.index = function(req, res){
  var role = req.session.role;
  if (role == "Admin" || role == "Manager" || role == "IT User") {
      // user is already logged in
      res.redirect('/admin');
  } else {
      res.render('index', { title: 'Express' });
  }
};

