
exports.index = function(req, res) {
    if (res.locals.access == false) {
        console.log("error: forbidden");
        res.redirect('/admin/restrict');
    } else {
        res.render('admin/viewTickets', {activeMenu: 'viewTickets'});
    }
};