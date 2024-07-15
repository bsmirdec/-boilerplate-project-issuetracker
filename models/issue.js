const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const IssueSchema = new mongoose.Schema({
  project_id: { type: String, required: true },
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  created_on: String,
  updated_on: String,
  created_by: { type: String, required: true, default: true },
  assigned_to: { type: String, default: "" },
  open: Boolean,
  status_text: { type: String, default: "" },
});

IssueSchema.pre("save", function (next) {
  if (!this.created_on) {
    this.created_on = new Date().toISOString();
  }
  this.updated_on = new Date().toISOString();
  next();
});

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = Issue;
