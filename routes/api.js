'use strict';
const mongoose = require('mongoose');

module.exports = function (app) {
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  const issueSchema = new mongoose.Schema({
    project: {
      type: String,
      required: true
    },
    issue_title: {
      type: String,
      required: true
    },
    issue_text: {
      type: String,
      required: true
    },
    created_by: {
      type: String,
      required: true
    },
    assigned_to: {
      type: String,
      default: ''
    },
    status_text: {
      type: String,
      default: ''
    },
    created_on: {
      type: Date,
      default: Date.now
    },
    updated_on: {
      type: Date,
      default: Date.now
    },
    open: {
      type: Boolean,
      default: true
    }
  });
  const Issue = mongoose.model('Issue', issueSchema);
  
  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      const query = req.query;
      query.project = project
      
      const list = await Issue.find(query);
      const reorderList = list.map((issue) => ({
        _id: issue._id,
        issue_title: issue.issue_title,
        issue_text: issue.issue_text,
        created_on: issue.created_on,
        updated_on: issue.updated_on,
        created_by: issue.created_by,
        assigned_to: issue.assigned_to,
        open: issue.open,
        status_text: issue.status_text
      }));
      res.json(reorderList);
      //console.log(reorderList)
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        return res.json({ error: 'required field(s) missing'})
      }
      const issue = new Issue({
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      });
      const result = issue.save();
      if(result) {
        return res.json({
          _id: issue._id,
          issue_title: issue.issue_title,
          issue_text: issue.issue_text,
          created_by: issue.created_by,
          assigned_to: issue.assigned_to,
          status_text: issue.status_text,
          created_on: issue.created_on,         
          updated_on: issue.updated_on,
          open: issue.open          
        });
      }
      
    })
    
    .put(async function (req, res){
      let project = req.params.project;
      const body = req.body;
      const _id = body._id;
      if(_id) {
        if(!mongoose.isValidObjectId(_id)) {
          return res.json({ error: 'could not update', '_id': _id });
        }
        if (_id && Object.keys(body).every(key => key === '_id' || !body[key])) {
          return res.json({ error: 'no update field(s) sent', '_id': _id });
        }
        const result = await Issue.findByIdAndUpdate({_id}, {...body, updated_on: new Date() }, {new: true});
        if (!result) {
          return res.json({ error: 'could not update', '_id': _id });
        }
        return res.json({ result: 'successfully updated', '_id': _id });
      }else {
        return res.json({ error: 'missing _id' });
      }
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      const { _id } = req.body;
      if(_id) {
        if(!mongoose.isValidObjectId(_id)) {
          return res.json({ error: 'could not update', '_id': _id });
        }
        const result = await Issue.findByIdAndDelete({_id});
        if (!result) {
          return res.json({ error: 'could not delete', '_id': _id });
        }
        return res.json({ result: 'successfully deleted', '_id': _id });
      }else {
        return res.json({ error: 'missing _id' });
      }
    });
    
};
