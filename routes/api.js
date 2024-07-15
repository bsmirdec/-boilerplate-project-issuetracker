"use strict";

const Issue = require("../models/issue");
const Project = require("../models/project");

module.exports = (app) => {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      try {
        project = Project.find({ name: project });
        Issue.find({ projectId });
      } catch (err) {}
    })

    .post(async (req, res) => {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_text || !issue_title || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }

      try {
        let currentProject = await Project.findOne({ name: project });
        if (!currentProject) {
          currentProject = new Project({ name: project });
          currentProject = await currentProject.save();
        }
        let newIssue = new Issue({
          project_id: currentProject._id,
          issue_title: issue_title,
          issue_text: issue_text,
          created_by: created_by,
          assigned_to: assigned_to,
          open: true,
          status_text: status_text,
        });
        newIssue
          .save()
          .then((issue) => {
            res.json(issue);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
      }
    })

    .put(function (req, res) {
      let project = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const projectId = req.body._id;
    });
};
