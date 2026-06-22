import express from 'express'
import { AddSkillsToUserController, GetUserProfileByIdController, myprofileController, DeleteSkillFromUserController, UpdateProfilePicController, UpdateResumeController, UpdateUserProfileController } from '../controller/index.js';
import { isAuth } from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.get('/me', isAuth, myprofileController);
router.get('/:userId', isAuth, GetUserProfileByIdController);
router.put('/update/profile', isAuth, upload,UpdateUserProfileController);

router.put('/update/Picture', isAuth, upload, UpdateProfilePicController)
router.put('/update/resume', isAuth, upload, UpdateResumeController)
router.post('/add/skill', isAuth, upload, AddSkillsToUserController)
router.delete('/delete/skill', isAuth, DeleteSkillFromUserController)

export default router;
