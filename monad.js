Monad = function(type, defs) {
  var mbindViaJoin = function(f, mv) {
    return mjoin(mv.fmap(f));
  }.autoCurry();
  
  var joinViaMbind = function(mmv) { return mmv.mbind(id); }
  
  type.prototype.mresult = defs.mresult;
  type.prototype.mbind = (defs.mbind && defs.mbind.autoCurry()) || mbindViaJoin;
  type.prototype.mjoin = defs.mjoin || joinViaMbind;
}

mjoin = function(mmv) {
  return mmv.mjoin();
}

mbind = function(mv, f) {
  f.mresult = mv.mresult;
  return mv.mbind(f, mv);
}.autoCurry();

ap = function(mf, m) {
  return mbind(mf, function(f){
    return mbind(m, function(x) {
      return m.mresult.call(this, f(x));
    })
  })
}.autoCurry();

// takes variable args like compose does though.
//+ _mcompose :: (b -> m c) -> (a -> m b) -> (a -> m c)
mcompose = function(){
  var fns= map(Function.toFunction,arguments),
      arglen=fns.length;
  return function() {
    var restlen = arglen-1;
    arguments = [fns[arglen-1].apply(this, arguments)];
    for(var i=restlen;--i>=0;) arguments = [arguments[0].mbind(fns[i], arguments[0])];
    return arguments[0];
  }
}

// liftM2 and on, but needs to work with ap.
_liftApplicative = function(f) {
  return function() {
    var args = Array.prototype.slice.apply(arguments)
    , arg_length = args.length
    , result = args[0].mresult.call(this, f)
    , current_arg_idx = 0;
    
    while(current_arg_idx < arg_length) {
      result = ap(result, args[current_arg_idx]);
      current_arg_idx++;
    }

    return result;
  }
}

_liftFunctor = function(f) {
  return function(m) {
    return mbind(m, function(x){
      return m.mresult.call(this, f(x));
    });
  }
}

liftM = function(f) {
  f = f.toFunction();
  return f.curried ? _liftApplicative(f) : _liftFunctor(f);
}


