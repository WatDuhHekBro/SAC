"use strict";

function collectFunctions()
{
	var table = document.getElementById('functions');
	var functions = {};
	
	for(var i = 0, row; row = table.rows[i]; i++)
	{
		var key, equation;
		var prefix_mode = false;
		
		for(var j = 0, col; col = row.cells[j]; j++)
		{
			if(col.children[0].getAttribute('type') === 'text')
			{
				if(j === 0)
				{
					var index = col.children[0].value.indexOf('(');
					
					if(index !== -1)
						key = col.children[0].value.slice(0, index);
					else
						key = col.children[0].value;
				}
				else if(j === 1)
				{
					equation = col.children[0].value;
				}
			}
			else if(col.children[0].getAttribute('type') === 'checkbox')
				prefix_mode = col.children[0].checked;
		}
		
		if(key !== '' && equation !== '')
		{
			if(prefix_mode)
				functions[key] = createFunction(equation);
			else
				functions[key] = toPrefix(equation);
		}
	}
	
	return functions;
}

function evalFunction(input)
{
	/*
	f(x)
	f'(x)
	f''(x)
	f"(x)
	d[f(x)]
	d2[f(x)]
	f([x,y])
	f([x,y,z])
	*/
	
	// My methodology here will be analyzing each character as I go through the string. Depending on the character, I'll do different things.
	
	/*
	[Default/Global Mode]
	\w - 
	'
	"
	( - Enter scope mode.
	[ - Enter step mode.
	) - Exit scope mode.
	] - Exit step mode.
	
	[Scope Mode]
	
	
	[Step Mode]
	Input is either a function or range.
	
	...
	
	[Return Types]
	The type of value you get determines what you do with it. Both in displaying HTML and using that value as an input.
	- f(x) --> String: This won't work with input types, though if you put it in the function output, it'll output the infix version of the equation.
	- f(2) or 2 --> Number: This is the standard for input types which'll yield similar output in the function output. Additionally, standard numbers that are passed through this function will just pass through unchanged.
	- f([0,2]) --> Array (Semi-Matrix): The first element is the summation of all the values, in the function output the rest of the elements are used to display each individual calculation. This is an array, where the first element is a number (the sum) and the rest of values are 2 value arrays where the first value is the input (the 2 in f(2)) and the second value is what f(2) equals.
	- null: In case this fails, null is returned, which'll either display an error or not do anything, depending on what you do with it. For input types, it does nothing as this accounts for any incomplete expression, and for the function output, it displays that there's an error;
	*/
	
	// Temporary Code //
	let compendium = collectFunctions();
	let output = null;
	
	if(input && input.constructor === Number)
		return input;
	else if(input && input.constructor === String)
	{
		if(!isNaN(Number(input)))
			return Number(input);
		else if(input.match(/\w\(x\)/)) // f(x)
			output = compendium[input.substring(0, input.indexOf('(x)'))].toStringInfix();
		else if(input.match(/\w\(-*\d(\.*\d+)*\)/g)) // f(-1.5)
		{
			var key = input.slice(0,1);
			var value = Number(input.slice(input.indexOf('(')+1, input.indexOf(')')));
			output = compendium[key].solve(value);
		}
		else if(input.match(/\w\(\[(-*\d(\.*\d+)*,-*\d(\.*\d+)*)(,-*\d(\.*\d+)*)*\]\)/g)) // f([-1.5,-0.5,-0.3]) or f([0,5,1]), meaning f(x) where x goes from 0 to 5 with a step of 1 (default: 1), meaning f(x) is calculated at 0, 1, 2, 3, 4, 5.
		{
			var key = input.slice(0,1);
			var instructions = input.slice(input.indexOf('[')+1, input.indexOf(']')).split(',');
			var start = Number(instructions[0]);
			var end = Number(instructions[1]);
			var step = 1;
			output = [null];
			var sum = 0;
			
			if(instructions[2] !== undefined)
				step = Number(instructions[2]);
			
			// MAKE SURE TO CHECK IF START, END, AND STEP WILL WORK WITHOUT AN INFINITE LOOP!!!
			
			for(var value = start; value <= end; value += step)
			{
				output.push([value, compendium[key].solve(value)]);
				sum += compendium[key].solve(value);
			}
			
			output[0] = sum;
		}
		else if(input.match(/\w'\(x\)/)) // f'(x)
		{
			var key = input.replace(/'/g,'');
			output = compendium[key.substring(0, input.indexOf('(x)'))].derivative().simplified().toStringInfix();
		}
		else if(input.match(/\w'\(-*\d(\.*\d+)*\)/g)) // f'(-1.5)
		{
			var key = input.slice(0,1);
			var value = Number(input.slice(input.indexOf('(')+1, input.indexOf(')')));
			output = compendium[key].derivative().solve(value);
		}
		else if(input.match(/\w'\(\[(-*\d(\.*\d+)*,-*\d(\.*\d+)*)(,-*\d(\.*\d+)*)*\]\)/g)) // f'([-1.5,-0.5,-0.3]) or f'([0,5,1]), meaning f'(x) where x goes from 0 to 5 with a step of 1 (default: 1), meaning f'(x) is calculated at 0, 1, 2, 3, 4, 5.
		{
			var key = input.slice(0,1);
			var instructions = input.slice(input.indexOf('[')+1, input.indexOf(']')).split(',');
			var start = Number(instructions[0]);
			var end = Number(instructions[1]);
			var step = 1;
			output = [null];
			var sum = 0;
			
			if(instructions[2] !== undefined)
				step = Number(instructions[2]);
			
			// MAKE SURE TO CHECK IF START, END, AND STEP WILL WORK WITHOUT AN INFINITE LOOP!!!
			
			for(var value = start; value <= end; value += step)
			{
				output.push([value, compendium[key].derivative().solve(value)]);
				sum += compendium[key].derivative().solve(value);
			}
			
			output[0] = sum;
		}
	}
	
	return output;
}

function update_custom_functions()
{
	let input = document.getElementById('input_custom_functions_activate').value;
	let output = evalFunction(input);
	document.getElementById('output_custom_functions_activate').innerHTML = output;
}

function updateFunctionOutput(input)
{
	let block = new Block(input.parentNode.parentNode);
	let value = evalFunction(input.value);
	let output = 'Not a valid function expression.';
	
	if(value !== undefined && value !== null)
	{
		output = 'Output: ';
		
		if(value.constructor === String || value.constructor === Number)
			output += value;
		else if(value.constructor === Array)
		{
			output += value[0] + '<br>';
			
			for(let i = 1; i < value.length; i++)
				output += 'f(' + value[i][0] + ') = ' + value[i][1] + '<br>';
		}
	}
	
	block[1].val(output);
}

function updateFactors(input)
{
	let block = new Block(input.parentNode.parentNode);
	let num = Number(input.value);
	let f = factors(num);
	let output = '';
	
	if(num < 0)
		output += 'Apply negatives where necessary.<br>';
	
	for(let i = 0; i < f.length; i += 2)
	{
		output += f[i] + ' × ';
		output += (i+1 === f.length) ? f[i] + '<br>' : f[i+1] + '<br>';
	}
	
	block[1].val(output);
}

function updateRatio(input, setting)
{
	let block = new Block(input.parentNode);
	let a = block[0];
	let b = block[1];
	let c = block[3];
	let d = block[4];
	let factor = block[6][0];
	let fraction = block[7][0];
	let decimal = block[8][0];
	let mode = block[5][0].val();
	let gcf = GCF(a.val(), b.val());
	
	// Update Base //
	if(setting === 0 && a.val() !== 0 && b.val() !== 0)
	{
		c.val(a.val() / gcf);
		d.val(b.val() / gcf);
		factor.val(gcf);
		fraction.val((a.val() / gcf) + '/' + (b.val() / gcf));
		decimal.val(a.val() / b.val());
	}
	// Update C //
	else if(setting === 1)
	{
		if(c.val() === 0 || a.val() === 0 || b.val() === 0)
		{
			a.val(0);
			b.val(0);
			c.val(0);
			d.val(0);
		}
		else
		{
			d.val(b.val() * (c.val() / a.val()));
			factor.val(a.val() / c.val());
			fraction.val((a.val() / gcf) + '/' + (b.val() / gcf));
			decimal.val(a.val() / b.val());
		}
	}
	// Update D //
	else if(setting === 2)
	{
		if(d.val() === 0 || a.val() === 0 || b.val() === 0)
		{
			a.val(0);
			b.val(0);
			c.val(0);
			d.val(0);
		}
		else
		{
			c.val(a.val() * (d.val() / b.val()));
			factor.val(b.val() / d.val());
			fraction.val((a.val() / gcf) + '/' + (b.val() / gcf));
			decimal.val(a.val() / b.val());
		}
	}
}

// This function will make it possible to refactor ratios in a future version.
// EDIT: This defeats the whole purpose of a simple ratio calculator. Use this in a ratio refactorer.
/*function update_ratio_a()
{
	var a = Number(document.getElementById('input_ratio_a').value);
	var b = Number(document.getElementById('input_ratio_b').value);
	var c = Number(document.getElementById('input_ratio_c').value);
	var d = Number(document.getElementById('input_ratio_d').value);
	
	if(c !== 0 && d !== 0)
		document.getElementById('input_ratio_c').value = a*d/b;
	else
		update_ratio_base();
}

function update_ratio_b()
{
	var a = Number(document.getElementById('input_ratio_a').value);
	var b = Number(document.getElementById('input_ratio_b').value);
	var c = Number(document.getElementById('input_ratio_c').value);
	var d = Number(document.getElementById('input_ratio_d').value);
	
	if(c !== 0 && d !== 0)
		document.getElementById('input_ratio_d').value = a*c/b;
	else
		update_ratio_base();
}*/

function updateDivision(input)
{
	let block = new Block(input.parentNode.parentNode);
	let dividend = Math.trunc(block[0][0].val());
	let divisor = Math.trunc(block[1][0].val());
	block[2].val(Math.trunc(dividend / divisor) + ' with a remainder of ' + Math.trunc(dividend % divisor));
}

// If you want to apply this to other conversions, you need to have a better method.
function updateConvTime(input, setting)
{
	let block = new Block(input.parentNode.parentNode);
	let num = Number(input.value);
	let nanoseconds = block[0][0];
	let microseconds = block[1][0];
	let milliseconds = block[2][0];
	let seconds = block[3][0];
	let minutes = block[4][0];
	let hours = block[5][0];
	let days = block[6][0];
	let weeks = block[7][0];
	let months = block[8][0];
	let years = block[9][0];
	
	if(isNaN(num))
	{
		num = 0;
		input.value = 0;
	}
	
	if(setting === -3)
	{
		microseconds.val(num/1000);
		milliseconds.val(num/1000000);
		seconds.val(num/1000000000);
		minutes.val(num/60000000000);
		hours.val(num/3600000000000);
		days.val(num/86400000000000);
		weeks.val(num/604800000000000);
		months.val(num/2592000000000000);
		years.val(num/31536000000000000);
	}
	else if(setting === -2)
	{
		nanoseconds.val(num*1000);
		milliseconds.val(num/1000);
		seconds.val(num/1000000);
		minutes.val(num/60000000);
		hours.val(num/3600000000);
		days.val(num/86400000000);
		weeks.val(num/604800000000);
		months.val(num/2592000000000);
		years.val(num/31536000000000);
	}
	else if(setting === -1)
	{
		nanoseconds.val(num*1000000);
		microseconds.val(num*1000);
		seconds.val(num/1000);
		minutes.val(num/60000);
		hours.val(num/3600000);
		days.val(num/86400000);
		weeks.val(num/604800000);
		months.val(num/2592000000);
		years.val(num/31536000000);
	}
	else if(setting === 0)
	{
		nanoseconds.val(num*1000000000);
		microseconds.val(num*1000000);
		milliseconds.val(num*1000);
		minutes.val(num/60);
		hours.val(num/3600);
		days.val(num/86400);
		weeks.val(num/604800);
		months.val(num/2592000);
		years.val(num/31536000);
	}
	else if(setting === 1)
	{
		nanoseconds.val(num*60000000000);
		microseconds.val(num*60000000);
		milliseconds.val(num*60000);
		seconds.val(num*60);
		hours.val(num/60);
		days.val(num/1440);
		weeks.val(num/10080);
		months.val(num/43200);
		years.val(num/525600);
	}
	else if(setting === 2)
	{
		nanoseconds.val(num*3600000000000);
		microseconds.val(num*3600000000);
		milliseconds.val(num*3600000);
		seconds.val(num*3600);
		minutes.val(num*60);
		days.val(num/24);
		weeks.val(num/168);
		months.val(num/720);
		years.val(num/8760);
	}
	else if(setting === 3)
	{
		nanoseconds.val(num*86400000000000);
		microseconds.val(num*86400000000);
		milliseconds.val(num*86400000);
		seconds.val(num*86400);
		minutes.val(num*1440);
		hours.val(num*24);
		weeks.val(num/7);
		months.val(num/30);
		years.val(num/365);
	}
	else if(setting === 4)
	{
		nanoseconds.val(num*604800000000000);
		microseconds.val(num*604800000000);
		milliseconds.val(num*604800000);
		seconds.val(num*604800);
		minutes.val(num*10080);
		hours.val(num*168);
		days.val(num*7);
		months.val(num/(30/7));
		years.val(num/(365/7));
	}
	else if(setting === 5)
	{
		nanoseconds.val(num*2592000000000000);
		microseconds.val(num*2592000000000);
		milliseconds.val(num*2592000000);
		seconds.val(num*2592000);
		minutes.val(num*43200);
		hours.val(num*720);
		days.val(num*30);
		weeks.val(num*(30/7));
		years.val(num/(365/30));
	}
	else if(setting === 6)
	{
		nanoseconds.val(num*31536000000000000);
		microseconds.val(num*31536000000000);
		milliseconds.val(num*31536000000);
		seconds.val(num*31536000);
		minutes.val(num*525600);
		hours.val(num*8760);
		days.val(num*365);
		weeks.val(num*(365/7));
		months.val(num*(365/30));
	}
}

// Note: Breaks down when the input is 5.
function updateRationalization(input)
{
	let block = new Block(input.parentNode.parentNode);
	let radicand = Math.trunc(input.value);
	let output = '√';
	
	if(Math.sqrt(radicand) % 1 === 0)
		output += Math.sqrt(radicand);
	else
	{
		for(let n = parseInt(Math.sqrt(radicand)); n >= 2; n--)
		{
			if(radicand % Math.pow(n,2) === 0)
				output = n + '*' + output + (radicand / Math.pow(n,2));
		}
	}
	
	block[1].val(output);
}

function update_time_hours()
{
	var start = parseInt(document.getElementById("input_time_hours_start").value);
	var add = parseInt(document.getElementById("input_time_hours_displacement").value);
	var end = start + add;
	var days = 0;
	if(end >= 24)
	{
		days = parseInt(end / 24);
		end %= 24;
	}
	document.getElementById("output_time_hours").innerHTML = end + " hours, +" + days + " days";
	//console.log(start+" "+add+" "+end+" "+days);
}

function update_days()
{
	// input_days_start, input_days_displacement, input_days_end
}