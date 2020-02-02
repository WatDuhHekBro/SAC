"use strict";

window.onerror = function(msg, url, lineNo, columnNo, error)
{
	let e = document.createElement('p');
	e.innerHTML = `<span class="error">Message:</span> <span class="errormsg">${msg}</span><br><span class="error">Error:</span> <span class="errormsg">${error}</span><br><span class="error">Location:</span> <span class="errormsg">${url}</span><br><span class="error">Line:</span> <span class="errormsg">${lineNo}</span> <span class="error">Column:</span> <span class="errormsg">${columnNo}</span>`;
	ERROR_MESSAGES ? ERROR_MESSAGES.append(e) : document.body.append(e);
	ERROR_HEADER.hidden = false;
};

// The two types you can't use value.constructor on are undefined and null.
// isType(5, Number) --> true
// isType(undefined, Array) --> false (and without errors)
// isType(null, null) --> true
// isType(undefined, null) --> true
function isType(value, type)
{
	if(value === undefined && type === undefined)
		return true;
	else if(value === null && type === null)
		return true;
	else
		return value !== undefined && value !== null && value.constructor === type;
}

function exists(value) {return value !== undefined && value !== null;}

/*const CONV_TIME = {
	NANOSECONDS: 1000,
	MICROSECONDS: 1000,
	MILLISECONDS: 1000,
	SECONDS: 60,
	MINUTES: 60,
	HOURS: 24,
	DAYS: 30,
	MONTHS: 12,
	YEARS: 1
};*/

/**
 * @param {Object, Number, Number} - CONV_TIME, 4, 2
 * @returns {Array} - []
 */
// Use this to generate a list of time versions like milliseconds, seconds, etc.
// unit converter
function generateConversions(definitions, offset, index)
{
	
}

function collectFunctions()
{
	let functions = {};
	
	for(let i = 0, row; row = FUNCTIONS.rows[i]; i++)
	{
		let key = row.cells[1].children[0].value,
			equation = row.cells[2].children[0].value,
			isPrefix = row.cells[3].children[0].checked,
			index = key.indexOf('(');
		
		if(index !== -1)
			key = key.substring(0, index);
		
		if(key && equation /*&& is valid function*/)
		{
			if(isPrefix)
				functions[key] = createFunction(packFunction(parseFunction(equation)));
			else
				functions[key] = createFunction(packFunctionInfix(parseFunctionInfix(equation)));
		}
	}
	
	return functions;
}

function addRow(index)
{
	let row = index ? FUNCTIONS.insertRow(index) : FUNCTIONS.insertRow();
	row.insertCell(0).innerHTML = '<button onclick="removeRow(this)">Delete</button>';
	row.insertCell(1).innerHTML = '<td><input type="text" class="small"><span> = </span></td>';
	row.insertCell(2).innerHTML = '<td><input type="text" oninput="checkRow(this)"></td>';
	row.insertCell(3).innerHTML = '<td><input type="checkbox" onchange="checkRow(this)">Prefix Equation</td>';
	row.insertCell(4).innerHTML = '<button onclick="addRow(this.parentNode.parentNode.rowIndex+1)">Add</button>';
}

function removeRow(e)
{
	let row = e.parentNode.parentNode;
	row.parentNode.removeChild(row);
}

function checkRow(e)
{
	let row = e.parentNode.parentNode,
		equation = row.cells[2].children[0].value,
		isPrefix = row.cells[3].children[0].checked,
		valid = isPrefix ? isValidFunction(parseFunction(equation)) : isValidFunctionInfix(parseFunctionInfix(equation));
	
	if(valid)
		row.className = 'valid';
	else
		row.className = 'invalid';
	
	//console.log(row.className);
}

///////////
// Usage //
///////////
// let block = new Block(input);
// block[0][0].val(7);
class Block
{
	constructor(block)
	{
		if(block)
		{
			this.block = block;
			
			for(let i = 0; i < block.children.length; i++)
				this[i] = new Block(block.children[i]);
		}
	}
	
	val(value)
	{
		if(exists(this.block))
		{
			if(this.block.nodeName === 'INPUT')
			{
				if(this.block.type === 'text')
				{
					if(isType(value, String))
					{
						let old = this.block.value;
						this.block.value = value;
						return old;
					}
					else
						return this.block.value;
				}
				else if(this.block.type === 'number')
				{
					if(isType(value, Number))
					{
						let old = Number(this.block.value);
						this.block.value = value;
						return old;
					}
					else
						return Number(this.block.value);
				}
				else if(this.block.type === 'checkbox')
				{
					if(isType(value, Boolean))
					{
						let old = this.block.checked;
						this.block.checked = value;
						return old;
					}
					else
						return this.block.checked;
				}
			}
			else if(this.block.nodeName === 'SPAN')
			{
				if(exists(value))
				{
					let old = this.block.innerHTML;
					this.block.innerHTML = value;
					return old;
				}
				else
					return this.block.innerHTML;
			}
		}
	}
}