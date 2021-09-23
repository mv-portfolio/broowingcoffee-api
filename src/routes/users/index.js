const router = require('express')();
const {peek_user, push_user, set_user, pop_user} = require('../../controller/user');

router.get('/', peek_user);
router.post('/push', push_user);
router.put('/set', set_user);
router.delete('/pop', pop_user);

module.exports = router;
