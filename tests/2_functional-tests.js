const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const Issue = require("../models/issue");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  const testProject = "test";
  let _idTest;
  suite("POST issue with every field at /api/issues/{project}", () => {
    test("issue with every field", (done) => {
      chai
        .request(server)
        .post(`/api/issues/${testProject}`)
        .send({
          issue_title: "Titre test",
          issue_text: "Text test",
          created_by: "Author test",
          assigned_to: "Executant test",
          status_text: "Edition",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Titre test");
          assert.equal(res.body.issue_text, "Text test");
          assert.equal(res.body.created_by, "Author test");
          assert.equal(res.body.assigned_to, "Executant test");
          assert.equal(res.body.status_text, "Edition");
          assert.equal(res.body.open, true);
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "_id");
          _idTest = res.body._id;
          done();
        });
    });

    test("issue with required field", (done) => {
      chai
        .request(server)
        .post(`/api/issues/${testProject}`)
        .send({
          issue_title: "Titre test",
          issue_text: "Text test",
          created_by: "Author test",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Titre test");
          assert.equal(res.body.issue_text, "Text test");
          assert.equal(res.body.created_by, "Author test");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.open, true);
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "_id");
          done();
        });
    });

    test("issue with missing required field", (done) => {
      chai
        .request(server)
        .post(`/api/issues/${testProject}`)
        .send({
          issue_title: "Titre test",
          issue_text: "Text test",
        })
        .end((rerr, res) => {
          assert.deepEqual(res.body, { error: "required field(s) missing" });
          done();
        });
    });
  });

  suite("GET issue at /api/issues/{project}", () => {
    test("View issues on a project", (done) => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.notEqual(res.body.length, 0);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });

    test("View issues on a project with one filter", (done) => {
      chai
        .request(server)
        .get("/api/issues/test?open=true")
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.notEqual(res.body.length, 0);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });

    test("View issues on a project with multiple filters", (done) => {
      const params = {
        open: true,
        created_by: "Author test",
      };

      chai
        .request(server)
        .get("/api/issues/test", { params })
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.notEqual(res.body.length, 0);
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          assert.property(res.body[0], "_id");
          done();
        });
    });
  });

  suite("PUT issue at /api/issues/{project}", () => {
    test("update one field", (done) => {
      const issueToUpdateId = _idTest;
      const fieldsToUpdate = { _id: issueToUpdateId, issue_title: "New Title" };

      chai
        .request(server)
        .put(`/api/issues/${testProject}`)
        .send(fieldsToUpdate)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            result: "successfully updated",
            _id: issueToUpdateId,
          });
          done();
        });
    });

    test("update multiple fields", (done) => {
      const issueToUpdateId = _idTest;
      const fieldsToUpdate = {
        _id: issueToUpdateId,
        issue_title: "New Title",
        status_text: "New status",
      };

      chai
        .request(server)
        .put(`/api/issues/${testProject}`)
        .send(fieldsToUpdate)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, {
            result: "successfully updated",
            _id: issueToUpdateId,
          });
          done();
        });
    });

    test("update issue with missing _id field", (done) => {
      chai
        .request(server)
        .put(`/api/issues/${testProject}`)
        .send({
          issue_title: "Titre test",
          issue_text: "Text test",
        })
        .end((rerr, res) => {
          assert.deepEqual(res.body, { error: "missing _id" });
          done();
        });
    });

    test("update issue with no fields to update", (done) => {
      chai
        .request(server)
        .put(`/api/issues/${testProject}`)
        .send({
          _id: _idTest,
        })
        .end((rerr, res) => {
          assert.deepEqual(res.body, {
            error: "no update field(s) sent",
            _id: _idTest,
          });
          done();
        });
    });

    test("update issue with wrong _id", (done) => {
      const _idWrong = "wrong-id";
      chai
        .request(server)
        .put(`/api/issues/${testProject}`)
        .send({
          _id: _idWrong,
        })
        .end((rerr, res) => {
          assert.deepEqual(res.body, {
            error: "could not update",
            _id: _idWrong,
          });
          done();
        });
    });
  });

  suite("DELETE issue at /api/issues/{project}", () => {
    test("delete issue", (done) => {
      chai
        .request(server)
        .delete(`/api/issues/${testProject}`)
        .send({
          _id: _idTest,
        })
        .end((rerr, res) => {
          assert.deepEqual(res.body, {
            result: "successfully deleted",
            _id: _idTest,
          });
          done();
        });
    });

    test("delete issue with missing _id", (done) => {
      chai
        .request(server)
        .delete(`/api/issues/${testProject}`)
        .send({})
        .end((rerr, res) => {
          assert.deepEqual(res.body, { error: "missing _id" });
          done();
        });
    });

    test("delete issue with wrong _id", (done) => {
      const _idWrong = "wrong-id";
      chai
        .request(server)
        .delete(`/api/issues/${testProject}`)
        .send({
          _id: _idWrong,
        })
        .end((rerr, res) => {
          assert.deepEqual(res.body, {
            error: "could not delete",
            _id: _idWrong,
          });
          done();
        });
    });
  });
});
