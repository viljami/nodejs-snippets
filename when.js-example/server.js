/*
   Copyright 2013  Viljami Peltola

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var when = require('when');

function aTask () {
	var counter = 0;
	while( counter <= 1000 ) {
		counter++;
	}
	return 'A task competed.';
}

console.log( 'Log 1 - Before calling a task.' );

var value = when( aTask(),
	function ( returnValue ) {
		console.log( 'Result value: ', returnValue );
		var processedValue = returnValue + ' Well done!';
		console.log( "Processed value: ", processedValue );
		return processedValue;
	}).then ( function ( returnValue2 ) {
		returnValue2 += ' The end.';
		console.log( "Double processed value: ", returnValue2);
	});

console.log( 'Log 2 - After calling a task.');


/*
// Returns a promise for the result of onFulfilled or onRejected depending
// on the promiseOrValue's outcome
var promise = when( promiseOrValue, onFulfilled, onRejected );

// Always returns a trusted promise, so it is guaranteed to be chainable:
when( promiseOrValue, onFulfilled, onRejected, onProgress )
    .then( anotherOnFulfilled, anotherOnRejected, anotherOnProgress );

// All parameters except the first are optional
// For example, you can register only an onFulfilled handler
when( promiseOrValue, onFulfilled );

promise.then( onFulfilled )
promise.otherwise( onRejected );
*/