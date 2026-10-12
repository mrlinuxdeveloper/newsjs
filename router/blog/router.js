
const express = require('express');
const router = express.Router();

const { Index,Create,Edit,Delete,Update,Upload, Show} = require('../../controllers/BlogController');

router.get('/', Index);
// router.post('/create', Create);
router.post('/create', Upload.single('image'), Create);
router.get('/edit/:id', Edit);
router.get('/show/:id', Show);
router.post('/delete/:id', Delete);
router.post('/update/:id',Upload.single('image') ,Update);

module.exports = router;