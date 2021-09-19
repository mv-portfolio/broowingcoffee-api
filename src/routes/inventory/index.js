const router = require('express')();
const {
  peek_inventory,
  push_inventory,
  set_inventory,
  pop_inventory,
} = require('../../controller');

router.get('/', peek_inventory);
router.post('/push', push_inventory);
router.put('/set', set_inventory);
router.delete('/pop', pop_inventory);

module.exports = router;
