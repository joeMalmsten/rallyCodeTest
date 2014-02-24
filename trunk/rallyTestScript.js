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
	this.MIN_BOUNDARY = -10000000000000;
	this.MAX_BOUNDARY = 10000000000000;
	this.QUADRILLION = 1000000000000;
	this.BILLION = 1000000000;
	this.MILLION = 1000000;
	this.THOUSAND = 1000;
	this.ONES_INDEX_ARRAY = [ 
   		'',
   		'one',
   		'two',
   		'three',
   		'four',
   		'five',
   		'six',
   		'seven',
   		'eight',
   		'nine'
   	];
   	this.TEENS_INDEX_ARRAY = [
   		'ten',
   		'eleven',
   		'twelve',
   		'thirteen',
   		'fourteen',
   		'fifteen',
   		'sixteen',
   		'seventeen',
   		'eighteen',
   		'nineteen'
   	];
   	this.TENS_INDEX_ARRAY = [
   		'',
   		'',
   		'twenty',
   		'thirty',
   		'forty',
   		'fifty',
   		'sixty',
   		'seventy',
   		'eighty',
   		'ninety'
   	]; 
}

// converts the given number to an english worded currency, main workhorse function
CurrencyContainer.prototype.convertToCurrency = function(value) {
	// Check for bad values
	if (typeof(value) !== "number" || value < this.MIN_BOUNDARY || value > this.MAX_BOUNDARY) {
		return -1;
	}

	var result = "";
	if (value < 0) {
		value *= -1;
		result += "negative ";
	}

	result += this.convertNumber(Math.floor(value));

	// This calculation gets any numbers right of the decimal and multiplies them by 100 to make them whole numbers
	// The toFixed call is added to removed any floating point errors we might get
	var centsValue = Math.floor((value % 1).toFixed(2) * 100);
	if (centsValue >= 10) {
		result += "and " + centsValue + "/100";
	} else {
		result += "and 0" +  centsValue + "/100";
	}
	result += " dollars";

	return result;
}

CurrencyContainer.prototype.convertQuadrillion = function(value){
    if (value >= this.QUADRILLION) {
        return this.convertQuadrillion(Math.floor(value / this.QUADRILLION)) + "quadrillion " + this.convertBillions(value % this.QUADRILLION);
    }
    else {
        return this.convertBillions(value);
    }
}

CurrencyContainer.prototype.convertBillions = function(value){
    if (value >= this.BILLION) {
        return this.convertBillions(Math.floor(value / this.BILLION)) + "billion " + this.convertMillions(value % this.BILLION);
    }
    else {
        return this.convertMillions(value);
    }
}

CurrencyContainer.prototype.convertMillions = function(value){
    if (value >= this.MILLION) {
        return this.convertMillions(Math.floor(value / this.MILLION)) + "million " + this.convertThousands(value % this.MILLION);
    }
    else {
        return this.convertThousands(value);
    }
}

CurrencyContainer.prototype.convertThousands = function(value){
    if (value >= this.THOUSAND) {
        return this.convertThousands(Math.floor(value / this.THOUSAND)) + "thousand " + this.convertHundreds(value % this.THOUSAND);
    }
    else{
        return this.convertHundreds(value);
    }
}

CurrencyContainer.prototype.convertHundreds = function(value) {
    if (value >= 100) {
        return this.convertTens(Math.floor(value / 100)) + "hundred " + this.convertTens(value % 100);
    } else {
        return this.convertTens(value);
    }
}

CurrencyContainer.prototype.convertTens = function(value){
    if ( value < 10) {
    	var ret = this.ONES_INDEX_ARRAY[value];
    	if (value > 0){
    		ret += " ";
    	}
		return ret;
	} else if (value>=10 && value<20) {
		return this.TEENS_INDEX_ARRAY[value - 10] + " ";
	} else {
        var ret = this.TENS_INDEX_ARRAY[Math.floor(value / 10)] + " " + this.ONES_INDEX_ARRAY[value % 10];
        if ((value % 10) > 0){
    		ret += " ";
    	}
		return ret;
    }
}

CurrencyContainer.prototype.convertNumber = function(value){
    if (value === 0) {
    	return "zero ";
    }
    return this.convertQuadrillion(value);
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
	it ("should return the english string of a given number [-1 * 10^14, 10^14]", function() {
		// An array containing possible converstion values and thier converted currency
		var currencyTestArray = [[0, "zero and 00/100 dollars"], [0.00, "zero and 00/100 dollars"], [0.15, "zero and 15/100 dollars"], [0.154, "zero and 15/100 dollars"], 
		[0.159, "zero and 16/100 dollars"], [1, "one and 00/100 dollars"], [1.01, "one and 01/100 dollars"], [0.01, "zero and 01/100 dollars"], [11.01, "eleven and 01/100 dollars"], 
		[111.01, "one hundred eleven and 01/100 dollars"],  [221.01, "two hundred twenty one and 01/100 dollars"], [911.01, "nine hundred eleven and 01/100 dollars"], 
		[-0, "zero and 00/100 dollars"], [-0.00, "zero and 00/100 dollars"], [-0.15, "negative zero and 15/100 dollars"], [-0.154, "negative zero and 15/100 dollars"], 
		[-0.159, "negative zero and 16/100 dollars"], [-1, "negative one and 00/100 dollars"], [-1.01, "negative one and 01/100 dollars"], [-0.01, "negative zero and 01/100 dollars"], 
		[-11.01, "negative eleven and 01/100 dollars"], [-111.01, "negative one hundred eleven and 01/100 dollars"], [-221.01, "negative two hundred twenty one and 01/100 dollars"], 
		[-911.01, "negative nine hundred eleven and 01/100 dollars"], 
		[999.99, "nine hundred ninety nine and 99/100 dollars"], 
		[9999.99, "nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[99999.99, "ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[999999.99, "nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[9999999.99, "nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[99999999.99, "ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"],
		[999999999.99, "nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[9999999999.99, "nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"],
		[99999999999.99, "ninety nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[999999999999.99, "nine hundred ninety nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"],
		[9999999999999.99, "nine quadrillion nine hundred ninety nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"],
		[1234567890123.38, "one quadrillion two hundred thirty four billion five hundred sixty seven million eight hundred ninety thousand one hundred twenty three and 38/100 dollars"],
		[10000000000000, "ten quadrillion and 00/100 dollars"],
		[-999.99, "negative nine hundred ninety nine and 99/100 dollars"],
		[-9999.99, "negative nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[-99999.99, "negative ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[-999999.99, "negative nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[-9999999.99, "negative nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[-99999999.99, "negative ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"],
		[-999999999.99, "negative nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[-9999999999.99, "negative nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"],
		[-99999999999.99, "negative ninety nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"], 
		[-999999999999.99, "negative nine hundred ninety nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"],
		[-9999999999999.99, "negative nine quadrillion nine hundred ninety nine billion nine hundred ninety nine million nine hundred ninety nine thousand nine hundred ninety nine and 99/100 dollars"],
		[-1234567890123.38, "negative one quadrillion two hundred thirty four billion five hundred sixty seven million eight hundred ninety thousand one hundred twenty three and 38/100 dollars"],
		[-10000000000000, "negative ten quadrillion and 00/100 dollars"]];

		//test our actual value to the value stored in the second index od each test array, the first index is the input for each test
		var retval = -1;
		for (var i = 0; i < currencyTestArray.length; ++i) {
			retval = myContent.currencyContainer.convertToCurrency(currencyTestArray[i][0]);
			assert.equal(retval, currencyTestArray[i][1]);
		}
	});

	it ("should return -1 at any index not a non-number or number outside of our bounds [-1 * 10^14, 10^14]", function() {
		// An array containing all invalid inputs
		var currencyInputArray = ["test", "djflsj;df", "12x2", "0x", "", null, "0", "1", false, true, 
		                          100000000000001, -100000000000001, "99..99", "99.9qq", 
		                          ";;;;::::;;;aaajkjkljlnckjsdnjd nhdkshjvlsdahldsa", [0,0,0,0,1,2,2]];

		//make sure we get -1 for all these invalid inputs
		var retval = -1;
		for (var i = 0; i < currencyInputArray.length; ++i) {
			retval = myContent.currencyContainer.convertToCurrency(currencyInputArray[i]);
			assert.equal(retval, -1);
		}
	});
});
//---------------------------- End unit testing -----------------------------\\
\*****************************************************************************/
