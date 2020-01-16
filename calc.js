"use strict";

function factors(num, sort = false)
{
	if(typeof num === 'number' && num % 1 === 0 && typeof sort === 'boolean')
	{
		if(num < 0)
			num = -num;
		
		if(num === 0)
			return [0];
		else if(num === 1)
			return [1];
		else
		{
			var factors = [1,num];
			var x = (num % 2 === 0) ? 2 : 3;
			var increment = (num % 2 === 0) ? 1 : 2;
			
			for(; x <= parseInt(Math.sqrt(num)); x += increment)
			{
				if(num % x === 0)
				{
					factors.push(x);
					if(num/x !== x)
						factors.push(num/x);
				}
			}
			
			return sort ? factors.sort((a,b) => a - b) : factors;
		}
	}
}

function GCF(a, b)
{
	if(typeof a === 'number' && typeof b === 'number' && a % 1 === 0 && b % 1 === 0)
	{
		if(a === 0 || b === 0)
			return 0;
		else if(a < 0 || b < 0)
			return -1;
		else
		{
			var fa = factors(a, true);
			var fb = factors(b, true);
			
			if(fb.length < fa.length)
			{
				for(var i = fb.length-1; i >= 0; i--)
					if(a % fb[i] === 0)
						return fb[i];
			}
			else
			{
				for(var i = fa.length-1; i >= 0; i--)
					if(b % fa[i] === 0)
						return fa[i];
			}
		}
	}
}

function leap_year(year)
{
	if(typeof year === 'number')
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

// Include some leap year thing here, either a boolean executed as the user enters their condition or the year itself, which'll use leap_year() here.
function calendar_days(month)
{
	if(typeof month === 'number')
	{
		switch(month)
		{
			case 1: return 31; break;
			case 2: return 28; break;
			case 3: return 31; break;
			case 4: return 30; break;
			case 5: return 31; break;
			case 6: return 30; break;
			case 7: return 31; break;
			case 8: return 31; break;
			case 9: return 30; break;
			case 10: return 31; break;
			case 11: return 30; break;
			case 12: return 31; break;
		}
	}
}