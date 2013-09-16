var fs = require('fs');

function parseCSVLine (line){
	line = line.split(',');
	var chunk,quote,i, j;

	// check for splits performed inside quoted strings and correct if needed
	for (i = 0; i < line.length; i += 1){
		chunk = line[i].replace(/^[\s]*|[\s]*$/g, "");
		quote = "";
		if (chunk.charAt(0) === '"' || chunk.charAt(0) === "'") quote = chunk.charAt(0);
		if (quote !== "" && chunk.charAt(chunk.length - 1) === quote) quote = "";
		
		if (quote !== ""){
			j = i + 1;			
			if (j < line.length){ chunk = line[j].replace(/^[\s]*|[\s]*$/g, "");}
			
			while (j < line.length && chunk.charAt(chunk.length - 1) != quote){
				line[i] += ',' + line[j];
				line.splice(j, 1);
				chunk = line[j].replace(/[\s]*$/g, "");
			}
			
			if (j < line.length){
				line[i] += ',' + line[j];
				line.splice(j, 1);
			}
		}
	}
	for (i = 0; i < line.length; i += 1){
		// remove leading/trailing whitespace
		line[i] = line[i].replace(/^[\s]*|[\s]*$/g, "");
		
		// remove leading/trailing quotes
		if (line[i].charAt(0) === '"') line[i] = line[i].replace(/^"|"$/g, "");
		else if (line[i].charAt(0) === "'") line[i] = line[i].replace(/^'|'$/g, "");
	}
	
	return line;
}

function convert(csv){
	var json,
		objArr,
		row,
		csvRows = [];
	if (csv && csv !== ""){
		csvRows = csv.split(/[\r\n]/g); // split into rows		
		// get rid of empty rows
		for (var i = 0; i < csvRows.length; i++){
			if (csvRows[i].replace(/^[\s]*|[\s]*$/g, '') == "")csvRows.splice(i--, 1);			
		}

		objArr = [];			
		for (var i = 0; i < csvRows.length; i++){
			csvRows[i] = parseCSVLine(csvRows[i]);
		}
					
		for (var i = 1; i < csvRows.length; i++){
			if (csvRows[i].length > 0) objArr.push({});			
			for (var j = 0; j < csvRows[i].length; j++){
				objArr[i - 1][csvRows[0][j]] = csvRows[i][j];
			}
		}
		json = JSON.stringify(objArr, null, "\t");
	}
	return json;
}


function csvToJson(csv, callback){
	var json = convert(csv);
	callback.call(undefined, json);
}

//exports.parseCSVLine = parseCSVLine;
exports.csvToJson = csvToJson;