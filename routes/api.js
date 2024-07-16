"use strict";

const Issue = require("../models/issue");
const Project = require("../models/project");

module.exports = (app) => {
  app
    .route("/api/issues/:project")

    .get(async (req, res) => {
      let projectName = req.params.project;
      let queryFilters = req.query;
      try {
        const project = await Project.findOne({ name: projectName });
        if (!project) {
          return res.status(404).json({ error: "Project not found" });
        }
        queryFilters.project_id = project._id;
        const issues = await Issue.find(queryFilters);
        res.json(issues);
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
      }
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

    .put(async (req, res) => {
      let projectName = req.params.project;
      const fields = req.body;

      if (!fields._id) {
        return res.json({ error: "missing _id" });
      }

      try {
        const issue = await Issue.findById(fields._id);

        let updated = false;
        let updatedFields = {};

        for (let property in fields) {
          if (fields.hasOwnProperty(property) && property !== "_id") {
            if (
              fields[property] !== "" &&
              fields[property] !== issue[property]
            ) {
              updatedFields[property] = fields[property];
              updated = true;
            }
          }
        }

        if (updated) {
          updatedFields.updated_on = new Date().toISOString();
          const updatedIssue = await Issue.findByIdAndUpdate(
            fields._id,
            updatedFields,
            { new: true }
          );
          return res.json({ result: "successfully updated", _id: fields._id });
        } else {
          return res.json({
            error: "no update field(s) sent",
            _id: fields._id,
          });
        }
      } catch (err) {
        return res.json({ error: "could not update", _id: fields._id });
      }
    })

    .delete(async (req, res) => {
      let projectName = req.params.project;
      const _id = req.body._id;

      if (!_id) {
        res.json({ error: "missing _id" });
        return;
      }

      try {
        const issue = await Issue.findById(_id);
        if (!issue) {
          res.json({ error: "could not delete", _id: _id });
          return;
        }

        const deletedIssue = await Issue.findByIdAndDelete(_id);
        res.json({ result: "successfully deleted", _id: _id });
      } catch (err) {
        res.json({ error: "could not delete", _id: _id });
      }
    });
};
