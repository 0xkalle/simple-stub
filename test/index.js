/* global describe it */

const { expect } = require('chai');

const simpleStub = require('../src/index');

describe('simple-stub', () => {
  it('should copy non function properties.', () => {
    const obj = {
      key: 'foo',
    };

    const stubObj = simpleStub.createStub(obj);

    expect(stubObj).to.include(obj);
  });

  it('should throw if first argument is not an object.', () => {
    const obj = 'OMG';
    expect(simpleStub.createStub.bind(null, obj)).to.throw('Argument to create a stub has to be an object.');
  });

  it('should return what the objects function returns', () => {
    const obj = {
      f: () => 'test',
    };
    const stubObj = simpleStub.createStub(obj);

    expect(obj.f()).to.equal(stubObj.f());
  });

  it('should throw what the objects function throws', () => {
    const obj = {
      f: () => {
        throw new Error('omg');
      },
    };
    const stubObj = simpleStub.createStub(obj);

    expect(stubObj.f).to.throw('omg');
    expect(stubObj.calls.f[0].err.message).to.equal('omg');
  });

  it('should save arguments and results in the call order', () => {
    const obj = {
      f: a => a + 5,
    };
    const stubObj = simpleStub.createStub(obj);
    stubObj.f(1);
    stubObj.f(2);
    stubObj.f(3);

    expect(stubObj.calls.f.length).to.equal(3);
    expect(stubObj.calls.f[0].args[0]).to.equal(1);
    expect(stubObj.calls.f[0].result).to.equal(6);
    expect(stubObj.calls.f[1].args[0]).to.equal(2);
    expect(stubObj.calls.f[1].result).to.equal(7);
    expect(stubObj.calls.f[2].args[0]).to.equal(3);
    expect(stubObj.calls.f[2].result).to.equal(8);
  });

  it('should rename the calls property as given in options', () => {
    const obj = {
      f: a => a + 5,
    };
    const stubObj = simpleStub.createStub(obj, { renameCalls: 'myCalls' });
    stubObj.f(1);
    expect(stubObj.myCalls.f.length).to.equal(1);
    expect(stubObj.myCalls.f[0].args[0]).to.equal(1);
    expect(stubObj.myCalls.f[0].result).to.equal(6);
  });

  it('should spy on empty functions', () => {
    const obj = {
      f: () => { },
    };
    const stubObj = simpleStub.createStub(obj);
    stubObj.f();
    stubObj.f();
    expect(stubObj.calls.f.length).to.equal(2);
  });

  it('should handle multiple functions', () => {
    const obj = {
      f: () => { },
      g: () => { },
      h: () => { },
    };

    const stubObj = simpleStub.createStub(obj);
    stubObj.f(1);
    stubObj.g(2);
    stubObj.h(3);
    stubObj.f(4);
    expect(stubObj.calls.f.length).to.equal(2);
    expect(stubObj.calls.f[0].args[0]).to.equal(1);
    expect(stubObj.calls.f[1].args[0]).to.equal(4);

    expect(stubObj.calls.g.length).to.equal(1);
    expect(stubObj.calls.g[0].args[0]).to.equal(2);

    expect(stubObj.calls.h.length).to.equal(1);
    expect(stubObj.calls.h[0].args[0]).to.equal(3);
  });
});
