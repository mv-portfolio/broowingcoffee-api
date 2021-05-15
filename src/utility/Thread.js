module.exports.onMultiThread = (threads) => {
    return Promise.all(
        threads.map(thread => {
            return thread
                .then(data => {
                    return {
                        status: true,
                        res: data
                    }
                })
                .catch(err => {
                    return {
                        status: false,
                        err: err
                    }
                })
        })
    )
}

//chunks
module.exports.onCreate = (chunk, payload) => {
    return new Promise(async (res, rej) => {
        await chunk.create(payload)
            .then(data => res(data))
            .catch(err => rej(err));
    })
}
module.exports.onFind = (chunk, selector, refs) => {
    let references = { ref1: '', ref2: '' }
    if (refs) {
        references = {
            ref1: refs.ref1,
            ref2: refs.ref2
        }
    }
    return new Promise((res, rej) => {
        chunk.find(selector)
            .populate(references.ref1)
            .populate(references.ref2)
            .exec((err, chunk) => {
                if (err) rej(err);
                res(chunk);
            })
    })
}
module.exports.onFindOne = (chunk, selector, refs) => {
    let references = { ref1: '', ref2: '' }
    if (refs) {
        references = {
            ref1: refs.ref1,
            ref2: refs.ref2
        }
    }
    return new Promise((res, rej) => {
        chunk.findOne(selector)
            .populate(references.ref1)
            .populate(references.ref2)
            .exec((err, chunk) => {
                if (err) rej(err);
                res(chunk);
            })
    })
}
module.exports.onDelete = (chunk, selector) => {
    return new Promise(async (res, rej) => {
        await chunk.findByIdAndDelete(selector._id)
            .then(data => res(data))
            .catch(err => rej(err));
    })
}
module.exports.onUpdate = (chunk, selector, payload) => {
    return new Promise((res, rej) => {
        chunk.findByIdAndUpdate(selector._id, payload)
            .then(data => res(data))
            .catch(err => rej(err));
    })
}