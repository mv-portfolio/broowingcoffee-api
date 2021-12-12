module.exports.onMultiThread = threads => {
  return Promise.all(
    threads.map(thread => {
      return thread
        .then(data => {
          return {
            status: true,
            res: data,
          };
        })
        .catch(err => {
          return {
            status: false,
            err: err,
          };
        });
    }),
  );
};

//schemas
module.exports.onCreate = (schema, payload) => {
  return new Promise(async (res, rej) => {
    await schema
      .create(payload)
      .then(data => res(data))
      .catch(err => rej(err));
  });
};
module.exports.onFind = (schema, selector, refs) => {
  let references = {ref1: '', ref2: ''};
  if (refs) {
    references = {
      ref1: refs.ref1,
      ref2: refs.ref2,
    };
  }
  return new Promise((res, rej) => {
    schema
      .find(selector)
      .populate(references.ref1)
      .populate(references.ref2)
      .exec((err, schema) => {
        if (err) rej(err);
        res(schema);
      });
  });
};
module.exports.onFindOne = (schema, selector, refs) => {
  let references = {ref1: '', ref2: ''};
  if (refs) {
    references = {
      ref1: refs.ref1,
      ref2: refs.ref2,
    };
  }
  return new Promise((res, rej) => {
    schema
      .findOne(selector)
      .populate(references.ref1)
      .populate(references.ref2)
      .exec((err, schema) => {
        if (err) rej(err);
        res(schema);
      });
  });
};
module.exports.onDelete = (schema, selector) => {
  return new Promise(async (res, rej) => {
    await schema
      .deleteOne(selector)
      .then(data => res(data))
      .catch(err => rej(err));
  });
};
module.exports.onUpdateOne = (schema, selector, payload) => {
  return new Promise((res, rej) => {
    schema
      .updateOne(selector, payload)
      .then(data => res(data))
      .catch(err => rej(err));
  });
};
