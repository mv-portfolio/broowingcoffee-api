const Reports = require('../schemas/reports');
const Accounts = require('../schemas/users/accounts');

const Thread = require('../utility/Thread');

const errorHandler = require('./errorHandler');

module.exports.peek_reports = (req, res) => {
  Thread.onFind(Reports, null, {ref1: '_id_account'})
    .then(data => {
      res.status(200).json({status: true, res: data});
    })
    .catch(err => {
      const error = errorHandler(err);
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
          res.status(200).json({status: true, res: data});
        })
        .catch(err => {
          const error = errorHandler(err);
          res.status(400).json({status: false, err: error});
        });
    })
    .catch(err => {
      const error = errorHandler(err);
      res.status(400).json({status: false, err: error});
    });
};
