require('../support/functional');
require('../support/prelude');
require('../support/types');
require('../monoid');
require('../functor');
require('../applicative');

//+ getZip :: Address -> String
var getZip = pluck('zip')

//+ joinArgs :: [String] -> String
var joinArgs = compose( join(', ')
                      , Array )

//+ getCityState :: Address -> String
var getCityState = liftA( joinArgs
                        , pluck('state')
                        , pluck('city') )

//+ getStreet :: Address -> String
var getStreet = pluck('street')

//+ formatAddress :: Address -> String
var formatAddress = mconcat( getStreet
                           , getCityState
                           , getZip )

var r = formatAddress({street: "344 Blah Tr", city: "Humbolt", state: "TX", zip: "75023"})
console.log('r', r);