const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { authenticateToken, authenticateTokenAdmin } = require('../utils/authUtils');


// user routes
router.post('/',authenticateToken, urlController.addURL);
router.delete('/:urlId',authenticateToken, urlController.deleteURL);
router.post('/scrape/:urlId',authenticateToken, urlController.scrapeURL);
router.get('/',authenticateToken, urlController.getUserURLs);

// admin routes
router.post('/admin/',authenticateToken, urlController.addURLById);
router.get('/admin',authenticateTokenAdmin, urlController.getAllURLs);
router.get('/admin/:userId',authenticateTokenAdmin, urlController.getUserURLsById);
router.delete('/admin/:userId/:urlId',authenticateTokenAdmin, urlController.deleteURLByUserID);

module.exports = router;