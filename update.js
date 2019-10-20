function update_factors()
{
	var num = Number(document.getElementById('input_factors').value);
	document.getElementById('factors').innerHTML = "";
	if(num < 0)
		document.getElementById('factors').innerHTML += "Apply negatives when necessary.<br>";
	document.getElementById('factors').innerHTML += factors(num);
}

function update_ratio_base()
{
	var a = parseInt(document.getElementById('input_ratio_a').value);
	var b = parseInt(document.getElementById('input_ratio_b').value);
	var gcf = GCF(a,b);
	document.getElementById('input_ratio_c').value = a/gcf;
	document.getElementById('input_ratio_d').value = b/gcf;
}

function update_ratio_c()
{
	var a = parseInt(document.getElementById('input_ratio_a').value);
	var b = parseInt(document.getElementById('input_ratio_b').value);
	var c = parseInt(document.getElementById('input_ratio_c').value);
	document.getElementById('input_ratio_d').value = b*(c/a);
}

function update_ratio_d()
{
	var a = parseInt(document.getElementById('input_ratio_a').value);
	var b = parseInt(document.getElementById('input_ratio_b').value);
	var d = parseInt(document.getElementById('input_ratio_d').value);
	document.getElementById('input_ratio_c').value = a*(d/b);
}

function updateConvTime(setting)
{
	if(setting === -3)
	{
		var num = parseInt(document.getElementById('input_nanoseconds').value);
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
		var num = parseInt(document.getElementById('input_microseconds').value);
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
		var num = parseInt(document.getElementById('input_milliseconds').value);
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
		var num = parseInt(document.getElementById('input_seconds').value);
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
		var num = parseInt(document.getElementById('input_minutes').value);
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
		var num = parseInt(document.getElementById('input_hours').value);
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
		var num = parseInt(document.getElementById('input_days').value);
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
		var num = parseInt(document.getElementById('input_weeks').value);
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
		var num = parseInt(document.getElementById('input_months').value);
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
		var num = parseInt(document.getElementById('input_years').value);
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