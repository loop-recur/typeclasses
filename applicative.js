Applicative = function(type, defs) {
  type.prototype.pure = defs.pure;
  type.prototype.ap = defs.ap.autoCurry();
}

ap = function(a1, a2) {
  return a1.ap(a2);
}.autoCurry();

pure = function(f) {
  if(typeof f == "string") f = f.toFunction();
  f.ap = fmap(f);
  return f;
}

liftA = function(f) {
  if(typeof f == "string") f = f.toFunction();
  var rest = arguments.length-1
    , r = pure(f);
  for(var i = 1; i <= rest; i++) r = r.ap(arguments[i]);
  return r;
}

Applicative(Array, {
  pure: Array, // needs to be infinate to be correct ziplist
  ap: function(a2) {
    // ziplist implementation
    return map(function(f,i){ return f.toFunction()(a2[i]); }, this);
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
