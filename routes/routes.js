const express = require('express');

const router = express.Router();
const controller = require('../controllers/my_controllers');
const {requireAuthentication} = require('../middleware/authMiddleware');


router.get('/',controller.get_redirect);
router.get('/list',requireAuthentication,controller.get_list);
router.get('/new-task',requireAuthentication,controller.get_create);
router.get('/important',requireAuthentication,controller.get_important);
router.post('/list',requireAuthentication,controller.post_list);
router.get('/completed',requireAuthentication,controller.get_completed);
router.delete('/list/:id',requireAuthentication,controller.delete_task);
router.patch('/list/:id',requireAuthentication,controller.update_star);
router.patch('/list/completed/:id',requireAuthentication,controller.update_important );
router.get('/overdue',requireAuthentication,controller.get_missed);
router.get('/signup',controller.get_signup);
router.post('/signup',controller.post_signup);
router.get('/login',controller.get_login);
router.post('/login',controller.post_login);
router.get('/homepage',controller.get_home);
router.get('/logout',controller.get_logout);

module.exports = router;