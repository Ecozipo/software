const router = require('express').Router();
const userController =  require("../controllers/user.controller");
const  authController =  require("../controllers/auth.controller");
const multer = require("multer");
const upload = multer();



//authController
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.signOut);


//userController
router.get('/', userController.getAllUser);
router.get('/:id', userController.userInfo);
router.put('/:id' , upload.single("file") , userController.updateUser);
router.delete('/:id' , userController.deleteUser);


module.exports = router;