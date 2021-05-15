const router = require('express')();
const { peek_user, push_user, set_user } = require('../../controller');

router.get('/', peek_user);
router.post('/push', push_user);
router.post('/set', set_user);

module.exports = router;