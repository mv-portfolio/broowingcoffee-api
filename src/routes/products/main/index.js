const router = require('express')();
const {
  peek_products,
  push_products,
  set_products,
  pop_products,
} = require('../../../controller');

router.get('/', peek_products);
router.post('/push', push_products);
router.post('/set', set_products);
router.post('/pop', pop_products);

module.exports = router;
