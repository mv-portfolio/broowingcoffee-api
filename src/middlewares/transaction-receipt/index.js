const Log = require('../../utility/Log');

const Transactions = require('../../schemas/transactions');

module.exports = async (req, res, next) => {
  const {payload} = res.locals;
  try {
    const transaction = await Transactions.findOne({_id: payload._id})
      .populate('products.addons')
      .populate('products._id_product');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    Log.show(`/GET/transaction-receipt SUCESS`);
    res.status(200).json({status: true, res: transaction});
  } catch (err) {
    Log.show(`/GET/transaction-receipt FAILED: ${err.message}`);
    res.status(400).json({status: false, err: err.message});
  }
};
