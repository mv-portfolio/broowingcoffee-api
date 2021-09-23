const router = require('express')();
const {
  peek_add_ons,
  push_add_ons,
  set_add_ons,
  pop_add_ons,
} = require('../../../controller/add-ons');

router.get('/', peek_add_ons);
router.post('/push', push_add_ons);
router.put('/set', set_add_ons);
router.delete('/pop', pop_add_ons);

module.exports = router;
