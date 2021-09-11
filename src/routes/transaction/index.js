const router = require('express')();
const {get_transaction, push_transaction} = require('../../controller');

router.get('/', get_transaction);
router.post('/push', push_transaction);

module.exports = router;
