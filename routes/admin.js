
/*
 * GET users listing.
 */

exports.index = function(req, res) {
    var role = req.session.role;
    if (role != "Admin" && role != "IT User" && role != "Manager") {
        console.log("error: not logged in");
        res.redirect('/');
    } else {
        res.render('admin', {});
    }
};