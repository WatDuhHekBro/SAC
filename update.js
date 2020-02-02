"use strict";

function updateFunctionOutput(input)
{
	let block = new Block(input.parentNode.parentNode),
		value = evalFunction(input.value),
		output = 'Not a valid function expression.';
	
	if(exists(value))
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
	let block = new Block(input.parentNode.parentNode),
		num = evalFunction(input.value),
		output = '';
	
	if(isType(num, Number))
	{
		num = Math.trunc(num);
		let f = factors(num);
		
		if(num < 0)
			output += 'Apply negatives where necessary.<br>';
		
		for(let i = 0; i < f.length; i += 2)
		{
			output += f[i] + ' × ';
			output += (i+1 === f.length) ? f[i] + '<br>' : f[i+1] + '<br>';
		}
	}
	else
		output = 'Input must be a number!';
	
	block[1].val(output);
}

function updateRatio(input, setting)
{
	let block = new Block(input.parentNode),
		a = block[0],
		b = block[1],
		c = block[3],
		d = block[4],
		av = a.val(),
		bv = b.val(),
		cv = c.val(),
		dv = d.val(),
		factor = block[6][0],
		fraction = block[7][0],
		decimal = block[8][0],
		mode = block[5][0].val(),
		gcf = GCF(av, bv);
	
	if(setting === 1 || setting === 2)
		setting = mode ? setting : 0;
	
	// Update A (Pivot Mode) //
	if(setting === 1 && cv !== 0 && dv !== 0)
		c.val(av*dv/bv);
	// Update B (Pivot Mode) //
	else if(setting === 2 && cv !== 0 && dv !== 0)
		d.val(av*cv/bv);
	// Update Base //
	else if(setting === 0 && av !== 0 && bv !== 0)
	{
		c.val(av/gcf);
		d.val(bv/gcf);
		factor.val(gcf);
		fraction.val((av/gcf) + '/' + (bv/gcf));
		decimal.val(av/bv);
	}
	// Update C //
	else if(setting === 3)
	{
		if(cv === 0 || av === 0 || bv === 0)
		{
			a.val(0);
			b.val(0);
			c.val(0);
			d.val(0);
		}
		else
		{
			d.val(bv*(cv/av));
			factor.val(av/cv);
			fraction.val((av/gcf) + '/' + (bv/gcf));
			decimal.val(av/bv);
		}
	}
	// Update D //
	else if(setting === 4)
	{
		if(dv === 0 || av === 0 || bv === 0)
		{
			a.val(0);
			b.val(0);
			c.val(0);
			d.val(0);
		}
		else
		{
			c.val(av*(dv/bv));
			factor.val(bv/dv);
			fraction.val((av/gcf) + '/' + (bv/gcf));
			decimal.val(av/bv);
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
	let block = new Block(input.parentNode.parentNode),
		dividend = Math.trunc(block[0][0].val()),
		divisor = Math.trunc(block[1][0].val());
	block[2].val(Math.trunc(dividend / divisor) + ' with a remainder of ' + Math.trunc(dividend % divisor));
}

// If you want to apply this to other conversions, you need to have a better method.
function updateConvTime(input, setting)
{
	let block = new Block(input.parentNode.parentNode),
		num = Number(input.value),
		nanoseconds = block[0][0],
		microseconds = block[1][0],
		milliseconds = block[2][0],
		seconds = block[3][0],
		minutes = block[4][0],
		hours = block[5][0],
		days = block[6][0],
		weeks = block[7][0],
		months = block[8][0],
		years = block[9][0];
	
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
	let block = new Block(input.parentNode.parentNode),
		radicand = Math.trunc(input.value),
		output = '√';
	
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