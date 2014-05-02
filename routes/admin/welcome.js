
exports.index = function(req, res) {
    res.render('admin/welcome', {activeMenu: 'welcome'});
};