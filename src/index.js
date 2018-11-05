
module.exports.createStub = (objectToStub, { renameCalls = 'calls' } = {}) => {
  if (typeof objectToStub !== 'object') {
    throw new Error('Argument to create a stub has to be an object.');
  }

  const stub = {};
  stub[renameCalls] = {};

  Object.keys(objectToStub).forEach((key) => {
    if (typeof objectToStub[key] !== 'function') {
      // if property value is not a function it is just copied to the stub.
      stub[key] = objectToStub[key];
    } else {
      stub[renameCalls][key] = [];
      // else it is spied and then add to the stub

      stub[key] = (...args) => {
        let result = null;
        let err = null;
        try {
          result = objectToStub[key](...args);
        } catch (error) {
          err = error;
        }

        stub[renameCalls][key].push({
          args,
          result,
          err,
        });

        if (err) throw err;
        return result;
      };
    }
  });

  return stub;
};
