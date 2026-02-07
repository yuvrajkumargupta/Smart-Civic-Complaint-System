const express = require('express');
const { getSettings, updateSetting } = require('../controllers/settings.controller');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', protect, getSettings);
router.put('/', protect, updateSetting); // Allow any auth user to read? Maybe. Admin for update.

module.exports = router;
