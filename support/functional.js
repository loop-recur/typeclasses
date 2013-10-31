var toArray = function(x) {
  return Array.prototype.slice.call(x);
}

// curry/auto is from wu.js
(function() {

  var curry = function (fn /* variadic number of args */) {
    var args = Array.prototype.slice.call(arguments, 1);
    var f = function () {
      return fn.apply(this, args.concat(toArray(arguments)));
    };
    return f;
  };

  var autoCurry = function (fn, numArgs) {
    numArgs = numArgs || fn.length;
    var f = function () {
      if (arguments.length < numArgs) {
        return numArgs - arguments.length > 0 ?
          autoCurry(curry.apply(this, [fn].concat(toArray(arguments))), numArgs - arguments.length) :
          curry.apply(this, [fn].concat(toArray(arguments)));
      }
      else {
        return fn.apply(this, arguments);
      }
    };
    f.toString = function(){ return fn.toString(); };
    f.curried = true;
    f.arity = fn.length;
    return f;
  };

  Function.prototype.autoCurry = function(n) {
    return autoCurry(this, n);
  }
})();


compose = function() {
  var fns = toArray(arguments),
      arglen = fns.length;

  return function(){
    for(var i=arglen;--i>=0;) {
      var fn = fns[i]
        , args = fn.length ? Array.prototype.slice.call(arguments, 0, fn.length) : arguments
        , next_args = Array.prototype.slice.call(arguments, (fn.length || 1)); //not right with *args
      next_args.unshift(fn.apply(this,args));
      arguments = next_args;
    }
    return arguments[0];
  }
}
