Applicative = function(type, defs) {
  type.prototype.pure = defs.pure;
  type.prototype.ap = defs.ap.autoCurry();
}

ap = function(o1, o2) {
  return o1.ap(o2);
}.autoCurry();


pure = function(f) {
  f = f.toFunction();
  f.ap = fmap(f);
  return f;
}

liftA = function(f) {
  f = f.toFunction();
  return function() {
    var args = Array.prototype.slice.apply(arguments)
    , arg_length = args.length
    , result = pure(f)
    , current_arg_idx = 0;

    while(current_arg_idx < arg_length) {
      result = result.ap(args[current_arg_idx]);
      current_arg_idx++;
    }

    return result;
  }
}
