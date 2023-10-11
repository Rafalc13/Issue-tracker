const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Issue',
        issue_text: 'Functional Test',
        created_by: 'fcc',
        assigned_to: 'tester',
        status_text: 'test'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Issue');
        assert.equal(res.body.issue_text, 'Functional Test');
        assert.equal(res.body.created_by, 'fcc');
        assert.equal(res.body.assigned_to, 'tester');
        assert.equal(res.body.status_text, 'test');
        done();
      });
  });
  test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Issue',
        issue_text: 'Functional Test',
        created_by: 'fcc'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Issue');
        assert.equal(res.body.issue_text, 'Functional Test');
        assert.equal(res.body.created_by, 'fcc');
        done();
      });
  });
  test('Create an issue with missing required fields: POST request to /api/issues/{project', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing' );
        done();
      });
  });
  test('View issues on a project: GET request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .get('/api/issues/apitest')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });
  test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .get('/api/issues/apitest?open=true')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .get('/api/issues/apitest?open=true&assigned_to=Joe')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        done();
      });
  });
  test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: '65266aaa3039af0a520dcdd4',
        issue_title: 'Issue'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '65266aaa3039af0a520dcdd4');
        done();
      });
  });
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: '65266aaa3039af0a520dcdd4',
        issue_title: 'Issue',
        issue_text: 'Functional Test',
        created_by: 'fcc'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, '65266aaa3039af0a520dcdd4');
        done();
      });
  });
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: '65266aaa3039af0a520dcdd4',
        issue_title: '',
        issue_text: '',
        created_by: ''
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.equal(res.body._id, '65266aaa3039af0a520dcdd4');
        done();
      });
  });
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .put('/api/issues/apitest')
      .send({
        _id: '1326283868ad544284abc405',
        issue_title: 'Updated Issue'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id, '1326283868ad544284abc405');
        done();
      });
  });
  test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/issues/apitest')
      .send({
        issue_title: 'Issue',
        issue_text: 'text',
        created_by: 'fcc'      
      })
      .end((err, res) => {
        const id = res.body._id;
        chai.request(server)
          .keepOpen()
          .delete('/api/issues/apitest')
          .send({
            _id: id
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body.result, 'successfully deleted');
            done();            
          });
      });
  });
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .send({
        _id: '1326283868ad544284abc405'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, '1326283868ad544284abc405');
        done();
      });
  });
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
    chai.request(server)
      .keepOpen()
      .delete('/api/issues/apitest')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
});
