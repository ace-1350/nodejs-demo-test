const { isAdmin } = require('./services/adminChecker');

const router = require('express').Router();

router.get('/', async (req, res) => {
    if (await isAdmin('641298d07b2a86b2727f2f8f'))
        res.send("Hello A");
    else
        res.send("Hello U");
})

module.exports = router;