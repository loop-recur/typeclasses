Monad = function(type, defs) {
  type.prototype.mresult = defs.mresult;
  type.prototype.mbind = defs.mbind.autoCurry();
}

mbind = function(mv, f) {
  f.mresult = mv.mresult;
  return mv.mbind(f);
}

ap = function(mf, m) {
  return mbind(mf, function(f){
    return mbind(m, function(x) {
      return m.mresult.call(this, f(x));
    })
  })
}.autoCurry();

mcompose = function(f, g) {
  return function(x) {
    return mbind(g(x), f);
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

var _lines = split('\n');

var _getToken = compose(map(compose(replace(/;$/, ''), strip)), split("<-"), last, split('\t'));

var _tokenize = compose(map(_getToken), match(/\s?(.*?)\s+<-\s+(.*);?/g));

var _secondTolastLine = function(xs) { return xs[xs.length - 2]; }

var _lastLine = compose(replace(/;$/, ""), replace(/return/, ""), _secondTolastLine, _lines);

var _getArgNames = compose(filter('x'), map(strip), split(','), last, match(/\((.*)\)/), first, _lines);

var runMonad = function(fun) {
	var monad = function() {
		var string_fun = fun.toString();
		var tokens = _tokenize(string_fun);
		var resultFun = _lastLine(string_fun);
		var arg_names = _getArgNames(string_fun);
		
		var builder = function(str, tuple) {
			var new_str;
			var v = tuple[0];
			var mv = tuple[1];
	
			if(tuple == tokens[tokens.length-1]) {
				new_str = str + mv + ", function("+v+") {\n return this.mresult("+resultFun+")";
				new_str = reduce("x + '\\n});'", new_str, repeat(1, tokens.length));
				return new Function(arg_names, new_str);
			}
			
			new_str = str + mv + ", function("+v+") {\n return mbind(";
			return builder(new_str, tokens[tokens.indexOf(tuple)+1]);
		}
		
		return builder("return mbind(", first(tokens));
	}
	
	return monad;
}


doMonad = function(f) {
  return runMonad(f)();
}
