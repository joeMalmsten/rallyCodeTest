/*****************************************************************************\
  Title: rallyTestScript.js
 Author: Joseph Malmsten
Purpose: coding test for Rally Software
   Date: 2/23/2014
\*****************************************************************************/

//--------------------------- Object definitions ----------------------------\\ 

/*****************************************************************************\
 Object: CurrencyContainer
Purpose: converts a given number to a english worded currency
Members: conversionList - a list containing objects with information on all previous
                   queries
\*****************************************************************************/
function CurrencyContainer() {
   // Contains all previous function calls(input, output)
   this.conversionList = [];
   this.MIN_BOUNDARY = -1000000000000000;
   this.MAX_BOUNDARY = 1000000000000000;
}

// converts the given number to an english worded currency, main workhorse function
CurrencyContainer.prototype.convertToCurrency = function(value) {
	// Check for bad values
	if (typeof(value) !== "number" || value < this.MIN_BOUNDARY || value > this.MAX_BOUNDARY) {
		return -1;
	}

	return value;
}

// This function will call the main conversion function, log the result in our array and return the result object
CurrencyContainer.prototype.logCurrencyQuery = function(index) {
	var currencyWords = this.convertToCurrency(index);
	var result = {number: index, currencyWords: currencyWords};
	this.conversionList.push(result);
    return result;
}

// This function will return all previous queries into a string for us to dump into a log
CurrencyContainer.prototype.dumpPrevQueries = function() {
	// If we have no entries in our history return an empty string
	if (this.conversionList.length <= 0) {
		return "";
	}

	// Let the user know in the logs when the conversion history begins, indent all entries belonging to it
	var ret = "CurrencyContainer queries\n";
	for (var x = 0; x < this.conversionList.length; ++x) {
		ret += "\t#" + x + ". " + "{value = " + this.conversionList[x].number + ", currency = " + this.conversionList[x].currencyWords + "}\n";
	}
	return ret;
}

/*****************************************************************************\
 Object: MyContent
Purpose: container for all helper Objects and functions, leaves less on 
         global scope
Members: currencyContainer - a instantiation of the CurrencyContainer object
\*****************************************************************************/
function MyContent() {
  // Contains the currency object
  this.currencyContainer = new CurrencyContainer();
}

MyContent.prototype.logComment = function(textInput) {

	// Do not attempt to log a comment if it is empty
	if (textInput.length == 0) {
		return;
	}

	// If we have our own debug log element put the message there, otherwise use the base console.log
	var debugLog = document.getElementById("debugLog");
	if (debugLog != null) { 
		debugLog.innerHTML += textInput + "\n";
	} else {
		console.log(textInput);
	}
}

// This helper function checks to make sure we have a valid input, then logs and stores the result for the user
MyContent.prototype.attemptConversion = function() {
	var currencyNumber = document.getElementById("currencyNumber");
	var value = -1;

	// Check to make sure the input element exists and was grabbed correctly
	if (currencyNumber != null) {
		value = currencyNumber.valueAsNumber;
	} else {
		this.logComment("currencyNumber is NULL");
	}

	// Make sure that the value > 0, otherwise let them know in the logs
	if (value >= this.currencyContainer.MIN_BOUNDARY && value <= this.currencyContainer.MAX_BOUNDARY) {
		var conversionResult = this.currencyContainer.logCurrencyQuery(value);
		this.logComment("Currency Query: {value = " + conversionResult.number + ", currency = " + conversionResult.currencyWords + "}");
	} else {
		this.logComment("value is not valid!");
	}
}

// This will dump every previous query stored in our helper objects
MyContent.prototype.dumpHistory = function() {
	var conversionHistory = this.currencyContainer.dumpPrevQueries();
	this.logComment(conversionHistory);
}

// This will clear the table we are using as a debug log or tells us we don't have one
MyContent.prototype.clearLog = function() {
	var debugLog = document.getElementById("debugLog");
	if (debugLog != null) {
		debugLog.innerHTML = "";
	} else {
		console.log("debugLog textarea is NULL, nothing to clear!");
	}
}

// This is the only real function call inside the "main" of the javascript,
//   everything else should be Handled through event listeners
MyContent.prototype.initTestPage = function() {
	// This is here to make unit testing possible without having to comment out any code
	if(typeof(document) == "undefined"){
		return;
	}

	var convertButton = document.getElementById("currencyNumberButton");
	if (convertButton != null) { 
		convertButton.addEventListener("click", this.attemptConversion.bind(this));
	} else {
		this.logComment("currencyNumberButton is NULL");
	}

	var historyButton = document.getElementById("dumpHistoryButton");
	if (historyButton != null) { 
		historyButton.addEventListener("click", this.dumpHistory.bind(this));
	} else {
		this.logComment("dumpHistoryButton is NULL");
	}

	var clearLogButton = document.getElementById("clearLogButton");
	if (clearLogButton != null) { 
		clearLogButton.addEventListener("click", this.clearLog.bind(this));
	} else {
		this.logComment("clearLogButton is NULL");
	}
}
//----------------------------- End definitions ----------------------------\\

//------------------------------- Start code -------------------------------\\
var myContent = new MyContent();
myContent.initTestPage();
//------------------------------- End code ----------------------------------\\

/********* Comment this section out when we want to run our website **********\
//-------------------------- Start unit testing -----------------------------\\
var assert = require("assert");
describe ("CurrencyContainer.convertToCurrency():", function() {
	it ("should return the english string of a given number [-1 * 10^18, 10^18]", function() {
		// An array containing possible converstion values and thier converted currency
		var currencyTestArray = [[0, "zero dollars 00/100 cents"], [0.15, "zero dollars 15/100 cents"], [0.154, "zero dollars 15/100 cents"], [0.159, "zero dollars 15/100 cents"],
		[1, "one dollar 00/100 cents"], [1.01, "one dollar 01/100 cent"], [0.01, "zero dollars 01/100 cent"],];

		var retval = -1;
		for (var i = 0; i < currencyTestArray.length; ++i) {
			retval = myContent.currencyContainer.convertToCurrency(currencyTestArray[i][0]);
			assert.equal(retval, currencyTestArray[i][0]);
		}
	});

	it ("should return -1 at any index not a non-number or number outside of our bounds [-1 * 10^18, 10^18]", function() {
		// An array containing all invalid inputs
		var currencyInputArray = ["test", "djflsj;df", "12x2", "0x", "", null, "0", "1", false, true, 10000000000000001, -10000000000000001];

		var retval = -1;
		for (var i = 0; i < currencyInputArray.length; ++i) {
			retval = myContent.currencyContainer.convertToCurrency(currencyInputArray[i]);
			assert.equal(retval, -1);
		}
	});
});
//---------------------------- End unit testing -----------------------------\\
\*****************************************************************************/
