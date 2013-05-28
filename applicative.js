Applicative = function(type, defs) {
  type.prototype.pure = defs.pure;
  type.prototype.ap = defs.ap.autoCurry();
}

ap = function(a1, a2) {
  return a1.ap(a2);
}.autoCurry();

// ap = function() {
//   var args = [].slice.apply(arguments)
//      , len = args.length-2
//      , r = args[0];
//   for(var i = 1; i <= len; i++) r = r.ap(r[i]);
//   return r;
// }.autoCurry(2);

pure = function(f) {
  if(typeof f == "string") f = f.toFunction();
  f.ap = fmap(f);
  return f;
}

liftA = function(f) {
  var r = pure(f)
    , args = [].slice.apply(arguments, [1])
    , arity = f.arity || f.length;

  var f = function() {
    var all_args = arguments.length ? args.concat(arguments) : args;
    var rest = all_args.length-1;
    for(var i = 0; i <= rest; i++) r = r.ap(all_args[i]);
    return r;
  };

  return (args.length >= arity) ? f() : f.autoCurry(arity);
}

Applicative(ZipList, {
  pure: ZipList, // needs to be infinite to be correct ziplist
  ap: function(a2) {
    return ZipList(map(function(f,i){return f(a2.val[i]); }, this.val));
  }
});

Applicative(Array, {
  pure: Array, // needs to be infinate to be correct ziplist
  ap: function(a2) {
    return flatten(this.map(function(f){
      return a2.map(function(a){ return f(a); })
    }));
  }
});

Applicative(Function, {
  pure: K,
  ap: function(g){
    var f = this;
    return function(x) {
      return f(x, g(x));
    }
  }
});

Applicative(Maybe, {
  pure: Maybe,
  ap: function(m){
    var f = this.val;
    return f ? fmap(f, m) : Maybe(null);
  }
});
