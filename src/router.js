import express from 'express';
import * as userController from './controller/userController.js';
import * as taskController from './controller/taskController.js';


const router = express.Router();

// User routes
router.post('/user', userController.createUser); // create user
router.post('/verify-token', userController.verifyAndLogin); // login
router.post('/login', userController.login);      // signup


// Task routes
router.post('/task', taskController.handleCreateTask);  // Create task
router.get('/task', taskController.handleGetTasks);     // Get tasks
router.post('/task/approve', taskController.handleApproveTask); // Approve task

export default router;
