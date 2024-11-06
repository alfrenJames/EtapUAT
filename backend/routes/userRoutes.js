const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createUser, getAllUsers, deactivateUser, activateUser, updateUser, getUserCounts, updateCredits, getUserById} = require('../controllers/userController');
router.use(protect);

router.get('/counts', getUserCounts);
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.put('/:id/deactivate', deactivateUser)
router.put('/:id/activate', activateUser);
router.put('/:id/update-credits', updateCredits);
module.exports = router;