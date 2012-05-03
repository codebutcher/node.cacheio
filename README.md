# cacheio - cache IO #
A fully featured and configurable cache store for data coming from backend stores.
cacheio aims at boosting performance in web application.

## INSTALL ##

```bash
$ npm install cacheio
```

## FEATURES ##

The cacheio cache store features configurable cache TTL, negative TTL, and a garbage collector.
cacheio is designed to be easily dumped into existing code


## USAGE ##

# setup
	var cacheio = require("cacheio");
	var entryStore = new cacheio.CacheStore(cacheOpts);
	# implement the data retriever
	entryStore.entryGet = function(function(eid, cb){

	});
	# upon retrieving data entries the entryGet handler must call  CacheStore.setCache(eid, data) or CacheStore.setNegativeCache(eid)  and cb ,respectively 
# runtime
	entryStore.get(eid, function(err, data){
		if(!err){
			// make use of data
		}
	});


# inside 

## CONFIGURATION ##


the CacheStore constructor accepts an options object that can include the following params
* cacheTTL, cacheExpires : entry time to live in seconds (*TTL* counter is reset for an entry upon read access, *Expires* counter is reset for an entry upon cache update)
* negativeTTL, negativeExpires : negative cache for entries in seconds
* gcFreq : garbage collector frequency in seconds (GC cleans cache timedout entries)


## AUTHOR ##

Gidi Bloch

