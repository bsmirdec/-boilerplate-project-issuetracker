const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  const testProject = "test";
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
        .end((req, res) => {
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
        .end((req, res) => {
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
        .end((req, res) => {
          assert.deepEqual(res.body, { error: "required field(s) missing" });
          done();
        });
    });
  });
});
