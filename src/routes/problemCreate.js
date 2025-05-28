const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, getAllProblemSolvedByUser, userSubmissionOfProblem } = require('../controllers/problemHandle');
const userMiddleware = require('../middleware/userMiddleware');

problemRouter.post("/create",adminMiddleware ,createProblem);
problemRouter.put("/update/:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware, deleteProblem);
problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblem",userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser",userMiddleware, getAllProblemSolvedByUser);
problemRouter.get("submittedProblem/:pid",userMiddleware,userSubmissionOfProblem);

module.exports = problemRouter;
