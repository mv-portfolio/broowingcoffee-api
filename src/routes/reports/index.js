const router = require('express')();
const {peek_reports, push_report} = require('../../controller/reports');

router.get('/', peek_reports);
router.post('/push', push_report);

module.exports = router;
