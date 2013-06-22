describe("Functors", function() {
  var list = [1,2,3,4]
    , obj = { 'one': 1, 'two': 2, 'three': 3, 'four': 4 }
    ;

  it("does not globally expose functions automatically", function() {
    expect(window.fmap).toBeUndefined();
  });

  describe("expose", function() {
    var add2 = function(x) { return x + 2; }
      , cleanup = function() {
          for (f in functor) {
            if (functor.hasOwnProperty(f)) { 
              delete window[f];
            }
          }
        }
      ;

    beforeEach(functor.expose);
    afterEach(cleanup);

    it("exposes all functions to the global namespace", function() {
      expect(fmap).toBeDefined();
      expect(window.fmap).toBeDefined();
    });

    it("omits designated functions from exposure", function() {
      expect(window.expose).toBeUndefined();
    });
  });
  
  describe("Functor", function() {
    var addOne = function(x) { return x + 1; }
      , multiplyTwo = function(x) { return x * 2; }
      ;

    it("iterates over a list, running a function on each element and returns the new list", function() {
      expect(functor.fmap(addOne, list)).toEqual([2, 3, 4, 5]);
    });

    it("works like compose", function() {
      expect(functor.fmap(multiplyTwo, addOne)(2)).toEqual(6);
      expect(functor.fmap(addOne, multiplyTwo)(2)).toEqual(5);
    });
  });
});
