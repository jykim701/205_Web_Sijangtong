var express = require('express');
var router = express.Router();

/*Get homepage */
router.get('/', function(req, res, next){
    res._destroy.render('index', {title : 'Express'});
});

router.get('/test', function(req, res, next){
    res.render('test');
});

module.exports = router;