/*

Copyright 2011 Gidi Bloch. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY Gidi Bloch ''AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Gidi Bloch OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed
or implied, of Gidi Bloch.
*/



var cacheStore = function(options){
	options = options || {}
	// default values
	this.options = {}
	this.options.cacheTTL = 600;// seconds
	this.options.negativeTTL = 100;// seconds
	this.options.gcFreq = 160;// seconds
	for(var opt in options){
		this.options[opt] = options[opt];
	}
	this.cache = {}
	
	var self = this;
	
	
	this.startGC = function(){
		self.cacheCleanup();
		setTimeout(function(){
			self.gcRecStartup();
		}, self.gcFreq)
	}
	
	this.setCache = function(eid, data){
		data.eid = eid;
		this.cache[eid] = {data: data 
			,ret : 'found'
			,atime : new Date().getTime()};
	}
	this.setNegativeCache = function(eid){
		this.cache[eid] = {ret : 'missing'
			,atime : new Date().getTime()};
	}
	
	
	this.cacheCleanup = function(){
		var now = new Date().getTime();
		for(var eid in this.cache){
			if(now - this.cache[eid].atime > this.options.cacheTTL * 1000){
				delete(this.cache[eid]);
			}
		}
	}
	
	this.getCached = function(eid){
		// looking for cache entry for eid
		if(!this.cache.hasOwnProperty(eid)){
			// cache doesnt exists;
			return 'nocache';
		}
		var now = new Date().getTime();
		// cache entry is false
		switch(this.cache[eid].ret){
			case 'found':
				if(new Date().getTime() - this.cache[eid].atime < this.options.cacheTTL * 1000){
					// we've got the entry , update atime and return cached entry'
					this.cache[eid].atime = new Date().getTime();
					return this.cache[eid].data;				
				} else {
					// this means session expired
					delete(this.cache[eid]);
					return 'nocache';
				}
			// cache entry doesnt exists
			case 'missing':
				// check negative ttl
				if(new Date().getTime() - this.cache[eid].atime < this.options.negativeTTL * 1000){
					return 'missing';

				} else {
					// negative caching expired
					delete this.cache[eid];
					return 'nocache';
				}
		}
	}
	this.get = function(eid, cb){
		var entry = this.getCached(eid);
		if(typeof entry == 'object'){
			cb.apply(this, [ false, entry ]);
		} else { 
			switch(entry){
				case 'nocache':
					this.entryGet(eid, cb);
					break;
				case 'missing':
					
					cb.apply(this, [ 'session unfound' ]);
					break;
			}
		}
	}
}

exports.CacheStore = cacheStore;

