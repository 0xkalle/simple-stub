module.exports.createStub = (objectToStub, { renameCalls = 'calls' } = {}) => {
  if (typeof objectToStub !== 'object') {
    throw new Error('Argument to create a stub has to be an object.');
  }

  return Object.keys(objectToStub).reduce((stub, key) => {
    if (typeof objectToStub[key] !== 'function') {
      // if property value is not a function it is just copied to the stub.
      stub[key] = objectToStub[key];
    } else {
      // else it is spied and then add to the stub
      stub[renameCalls][key] = [];

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

    return stub;
  }, { [renameCalls]: {} });
};
