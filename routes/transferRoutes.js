const express = require('express');
const router = express.Router();
const { createTransfer, listTransfers, getTransfer,updateTransferStatus } = require('../controllers/transferController');
const { authMiddleware, roleGuard } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// office user creates transfer request (with optional attachment)
router.post('/create', authMiddleware, roleGuard(['office_user','admin']), upload.single('attachment'), createTransfer);

// list / get
router.get('/all-transfer', authMiddleware, roleGuard(['admin','office_user','engineer']), listTransfers);
router.get('/:id', authMiddleware, roleGuard(['admin','office_user','engineer']), getTransfer);


router.put('/:id/status',  updateTransferStatus);

module.exports = router;
