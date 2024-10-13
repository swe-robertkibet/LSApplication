const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);
router.patch('/:id/archive', customerController.archiveCustomer);
router.post('/bulk-archive', customerController.bulkArchiveCustomers);
router.get('/check-email', customerController.checkEmailExists);

module.exports = router;
