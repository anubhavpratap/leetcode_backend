const Problem = require("../models/problem");
const { getLanguageById, submitBatch } = require("../utils/problemRequest");

const createProblem = async (req, res) => {
  const { visibleTestCases, referenceSolution } = req.body;

  try {
    for (const ref of referenceSolution) {
      const langId = getLanguageById(ref.language);
      const batch = visibleTestCases.map((test) => ({
        source_code: ref.completeCode,
        language_id: langId,
        stdin: test.input,
        expected_output: test.output,
      }));

      const submissions = await submitBatch(batch);
      const tokens = submissions.map((r) => r.token);
      const results = await submitToken(tokens);

      for (const result of results) {
        if (result.status_id !== 3) {
          return res.status(400).send("Error occurred while validating.");
        }
      }
    }

    const problem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id,
    });

    res.status(201).send("Problem saved successfully.");
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const updateProblem = async (req, res) => {
  const { id } = req.params;
  const { visibleTestCases, referenceSolution } = req.body;

  try {
    if (!id) return res.status(400).send("Missing problem ID.");

    const existing = await Problem.findById(id);
    if (!existing) return res.status(404).send("Problem not found.");

    for (const ref of referenceSolution) {
      const langId = getLanguageById(ref.language);
      const batch = visibleTestCases.map((test) => ({
        source_code: ref.completeCode,
        language_id: langId,
        stdin: test.input,
        expected_output: test.output,
      }));

      const submissions = await submitBatch(batch);
      const tokens = submissions.map((r) => r.token);
      const results = await submitToken(tokens);

      for (const result of results) {
        if (result.status_id !== 3) {
          return res.status(400).send("Error occurred while validating.");
        }
      }
    }

    const updated = await Problem.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });

    res.status(201).send(updated);
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("Problem ID is required.");

    const deleted = await Problem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send("Problem not found.");

    res.status(200).send("Deleted successfully.");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).send("Problem ID is required.");

    const problem = await Problem.findById(id).select(
      "_id title description difficulty tags visibleTestCases startCode referenceSolution"
    );

    if (!problem) return res.status(404).send("Problem not found.");

    res.status(200).send(problem);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getAllProblem = async (req, res) => {
  try {
    const problems = await Problem.find({}).select("_id title difficulty tags");

    if (problems.length === 0)
      return res.status(404).send("No problems available.");

    res.status(200).send(problems);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
};

const getAllProblemSolvedByUser = async (req, res) => {
  try {
    const user = await User.findById(req.result._id).populate({
      path: "problemSolved",
      select: "_id title difficulty tags",
    });

    res.status(200).send(user.problemSolved);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const userSubmissionOfProblem = async (req, res) => {
  try {
    const { _id: userId } = req.result;
    const { pid: problemId } = req.params;

    const submissions = await Submission.find({ userId, problemId });

    if (submissions.length === 0)
      return res.status(200).send("No submissions available.");

    res.status(200).send(submissions);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getAllProblem,
  getAllProblemSolvedByUser,
  userSubmissionOfProblem,
};
