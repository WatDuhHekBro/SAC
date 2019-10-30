"use strict";

function update_factors()
{
	var num = Number(document.getElementById('input_factors').value);
	document.getElementById('output_factors').innerHTML = "";
	var f = factors(num,false);
	document.getElementById('output_factors').innerHTML += String(factors(num,true)).replace(/,/g,', ');
	if(num < 0)
		document.getElementById('output_factors').innerHTML += "<br>Apply negatives when necessary.";
	document.getElementById('output_factors').innerHTML += "<br><br>";
	for(var i = 0; i < f.length; i += 2)
	{
		document.getElementById('output_factors').innerHTML += f[i]+" × ";
		document.getElementById('output_factors').innerHTML += (i+1 === f.length) ? f[i]+"<br>" : f[i+1]+"<br>";
	}
}

function update_ratio_base()
{
	var a = Number(document.getElementById('input_ratio_a').value);
	var b = Number(document.getElementById('input_ratio_b').value);
	
	if(a !== 0 && b !== 0)
	{
		var gcf = GCF(a,b);
		document.getElementById('input_ratio_c').value = a/gcf;
		document.getElementById('input_ratio_d').value = b/gcf;
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

function update_ratio_c()
{
	var a = Number(document.getElementById('input_ratio_a').value);
	var b = Number(document.getElementById('input_ratio_b').value);
	var c = Number(document.getElementById('input_ratio_c').value);
	
	if(c === 0 || a === 0 || b === 0)
	{
		document.getElementById('input_ratio_a').value = 0;
		document.getElementById('input_ratio_b').value = 0;
		document.getElementById('input_ratio_c').value = 0;
		document.getElementById('input_ratio_d').value = 0;
	}
	else
		document.getElementById('input_ratio_d').value = b*(c/a);
}

function update_ratio_d()
{
	var a = Number(document.getElementById('input_ratio_a').value);
	var b = Number(document.getElementById('input_ratio_b').value);
	var d = Number(document.getElementById('input_ratio_d').value);
	
	if(d === 0 || a === 0 || b === 0)
	{
		document.getElementById('input_ratio_a').value = 0;
		document.getElementById('input_ratio_b').value = 0;
		document.getElementById('input_ratio_c').value = 0;
		document.getElementById('input_ratio_d').value = 0;
	}
	else
		document.getElementById('input_ratio_c').value = a*(d/b);
}

function update_division()
{
	var dividend = parseInt(document.getElementById('input_dividend').value);
	var divisor = parseInt(document.getElementById('input_divisor').value);
	document.getElementById('quotient').innerHTML = parseInt(dividend/divisor) + " with a remainder of " + parseInt(dividend%divisor);
}

function update_function()
{
	var f = createFunction(document.getElementById('input_function').value);
	var g = f.derivative().simplified();
	var val = getNumber('input_function_value');
	
	document.getElementById('output_function_value').innerHTML = f.solve(val);
	document.getElementById('output_function_derivative').innerHTML = g.toStringInfix();
	document.getElementById('input_function_value_derivative').value = val;
	document.getElementById('input_function_value_derivative_pseudo').value = val;
	document.getElementById('output_function_derivative_value').innerHTML = g.solve(val);
	document.getElementById('output_function_derivative_value_pseudo').innerHTML = f.pseudo_derivative(val);
}

/*function update_notation()
{
	document.getElementById('output_notation').value = infix_prefix(document.getElementById('input_notation').value);
}*/

function updateConvTime(setting)
{
	if(setting === -3)
	{
		var num = Number(document.getElementById('input_nanoseconds').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_nanoseconds').value = 0;}
		document.getElementById('input_microseconds').value = num/1000;
		document.getElementById('input_milliseconds').value = num/1000000;
		document.getElementById('input_seconds').value = num/1000000000;
		document.getElementById('input_minutes').value = num/60000000000;
		document.getElementById('input_hours').value = num/3600000000000;
		document.getElementById('input_days').value = num/86400000000000;
		document.getElementById('input_weeks').value = num/604800000000000;
		document.getElementById('input_months').value = num/2592000000000000;
		document.getElementById('input_years').value = num/31536000000000000;
	}
	else if(setting === -2)
	{
		var num = Number(document.getElementById('input_microseconds').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_microseconds').value = 0;}
		document.getElementById('input_nanoseconds').value = num*1000;
		document.getElementById('input_milliseconds').value = num/1000;
		document.getElementById('input_seconds').value = num/1000000;
		document.getElementById('input_minutes').value = num/60000000;
		document.getElementById('input_hours').value = num/3600000000;
		document.getElementById('input_days').value = num/86400000000;
		document.getElementById('input_weeks').value = num/604800000000;
		document.getElementById('input_months').value = num/2592000000000;
		document.getElementById('input_years').value = num/31536000000000;
	}
	else if(setting === -1)
	{
		var num = Number(document.getElementById('input_milliseconds').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_milliseconds').value = 0;}
		document.getElementById('input_nanoseconds').value = num*1000000;
		document.getElementById('input_microseconds').value = num*1000;
		document.getElementById('input_seconds').value = num/1000;
		document.getElementById('input_minutes').value = num/60000;
		document.getElementById('input_hours').value = num/3600000;
		document.getElementById('input_days').value = num/86400000;
		document.getElementById('input_weeks').value = num/604800000;
		document.getElementById('input_months').value = num/2592000000;
		document.getElementById('input_years').value = num/31536000000;
	}
	else if(setting === 0)
	{
		var num = Number(document.getElementById('input_seconds').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_seconds').value = 0;}
		document.getElementById('input_nanoseconds').value = num*1000000000;
		document.getElementById('input_microseconds').value = num*1000000;
		document.getElementById('input_milliseconds').value = num*1000;
		document.getElementById('input_minutes').value = num/60;
		document.getElementById('input_hours').value = num/3600;
		document.getElementById('input_days').value = num/86400;
		document.getElementById('input_weeks').value = num/604800;
		document.getElementById('input_months').value = num/2592000;
		document.getElementById('input_years').value = num/31536000;
	}
	else if(setting === 1)
	{
		var num = Number(document.getElementById('input_minutes').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_minutes').value = 0;}
		document.getElementById('input_nanoseconds').value = num*60000000000;
		document.getElementById('input_microseconds').value = num*60000000;
		document.getElementById('input_milliseconds').value = num*60000;
		document.getElementById('input_seconds').value = num*60;
		document.getElementById('input_hours').value = num/60;
		document.getElementById('input_days').value = num/1440;
		document.getElementById('input_weeks').value = num/10080;
		document.getElementById('input_months').value = num/43200;
		document.getElementById('input_years').value = num/525600;
	}
	else if(setting === 2)
	{
		var num = Number(document.getElementById('input_hours').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_hours').value = 0;}
		document.getElementById('input_nanoseconds').value = num*3600000000000;
		document.getElementById('input_microseconds').value = num*3600000000;
		document.getElementById('input_milliseconds').value = num*3600000;
		document.getElementById('input_seconds').value = num*3600;
		document.getElementById('input_minutes').value = num*60;
		document.getElementById('input_days').value = num/24;
		document.getElementById('input_weeks').value = num/168;
		document.getElementById('input_months').value = num/720;
		document.getElementById('input_years').value = num/8760;
	}
	else if(setting === 3)
	{
		var num = Number(document.getElementById('input_days').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_days').value = 0;}
		document.getElementById('input_nanoseconds').value = num*86400000000000;
		document.getElementById('input_microseconds').value = num*86400000000;
		document.getElementById('input_milliseconds').value = num*86400000;
		document.getElementById('input_seconds').value = num*86400;
		document.getElementById('input_minutes').value = num*1440;
		document.getElementById('input_hours').value = num*24;
		document.getElementById('input_weeks').value = num/7;
		document.getElementById('input_months').value = num/30;
		document.getElementById('input_years').value = num/365;
	}
	else if(setting === 4)
	{
		var num = Number(document.getElementById('input_weeks').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_weeks').value = 0;}
		document.getElementById('input_nanoseconds').value = num*604800000000000;
		document.getElementById('input_microseconds').value = num*604800000000;
		document.getElementById('input_milliseconds').value = num*604800000;
		document.getElementById('input_seconds').value = num*604800;
		document.getElementById('input_minutes').value = num*10080;
		document.getElementById('input_hours').value = num*168;
		document.getElementById('input_days').value = num*7;
		document.getElementById('input_months').value = num/(30/7);
		document.getElementById('input_years').value = num/(365/7);
	}
	else if(setting === 5)
	{
		var num = Number(document.getElementById('input_months').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_months').value = 0;}
		document.getElementById('input_nanoseconds').value = num*2592000000000000;
		document.getElementById('input_microseconds').value = num*2592000000000;
		document.getElementById('input_milliseconds').value = num*2592000000;
		document.getElementById('input_seconds').value = num*2592000;
		document.getElementById('input_minutes').value = num*43200;
		document.getElementById('input_hours').value = num*720;
		document.getElementById('input_days').value = num*30;
		document.getElementById('input_weeks').value = num*(30/7);
		document.getElementById('input_years').value = num/(365/30);
	}
	else if(setting === 6)
	{
		var num = Number(document.getElementById('input_years').value);
		if(isNaN(num)) {num = 0; document.getElementById('input_years').value = 0;}
		document.getElementById('input_nanoseconds').value = num*31536000000000000;
		document.getElementById('input_microseconds').value = num*31536000000000;
		document.getElementById('input_milliseconds').value = num*31536000000;
		document.getElementById('input_seconds').value = num*31536000;
		document.getElementById('input_minutes').value = num*525600;
		document.getElementById('input_hours').value = num*8760;
		document.getElementById('input_days').value = num*365;
		document.getElementById('input_weeks').value = num*(365/7);
		document.getElementById('input_months').value = num*(365/30);
	}
}