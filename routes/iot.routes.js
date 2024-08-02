const router = require('express').Router();
const iotControllers =  require("../controllers/iot.controller");


router.post('/publish', iotControllers.publish);
router.post('/subcribe', iotControllers.subcribes);

module.exports = router;