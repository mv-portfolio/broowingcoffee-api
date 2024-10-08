const Reports = require('../schemas/reports');
const Accounts = require('../schemas/users/accounts');

const Log = require('../utility/Log');
const Thread = require('../utility/Thread');

const errorHandler = require('./errorHandler');

module.exports.peek_reports = (req, res) => {
  const {date} = req.query;

  const json = JSON.parse(date);
  Thread.onFind(
    Reports,
    {
      date_created: {
        $gte: json.min,
        $lt: json.max,
      },
    },
    {ref1: '_id_account'},
  )
    .then(data => {
      Log.show(`/GET/reports SUCCESS`);
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const error = errorHandler(err);
      Log.show(`/GET/reports FAILED`, error);
      err.status(400).json({status: false, error});
    });
};

module.exports.push_report = (req, res) => {
  const {module, email, action, reference, date_created} = req.body;
  Thread.onFindOne(Accounts, {email}, null)
    .then(({_id}) => {
      Thread.onCreate(Reports, {
        module,
        _id_account: _id,
        action,
        reference,
        date_created,
      })
        .then(data => {
          Log.show(`/POST/reports SUCCESS`);
          res.status(200).json({status: true, res: data});
        })
        .catch(err => {
          const error = errorHandler(err);
          Log.show(`/POST/reports FAILED`, error);
          res.status(400).json({status: false, err: error});
        });
    })
    .catch(err => {
      const error = errorHandler(err);
      Log.show(`/POST/reports FAILED`, error);
      res.status(400).json({status: false, err: error});
    });
};
