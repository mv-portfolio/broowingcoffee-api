const router = require('express')();
const {push_transaction, peek_transactions} = require('../../controller');

router.get('/', peek_transactions);
router.post('/push', push_transaction);

module.exports = router;
