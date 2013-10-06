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
