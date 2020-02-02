"use strict";

function factors(num, sort = false)
{
	if(isType(num, Number) && num % 1 === 0 && isType(sort, Boolean))
	{
		if(num < 0)
			num = -num;
		
		if(num === 0)
			return [0];
		else if(num === 1)
			return [1];
		else
		{
			let factors = [1,num],
				x = (num % 2 === 0) ? 2 : 3,
				increment = (num % 2 === 0) ? 1 : 2;
			
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
	if(isType(a, Number) && a % 1 === 0 && isType(b, Number) && b % 1 === 0)
	{
		if(a === 0 || b === 0)
			return 0;
		else if(a < 0 || b < 0)
			return -1;
		else
		{
			let fa = factors(a, true),
				fb = factors(b, true);
			
			if(fb.length < fa.length)
			{
				for(let i = fb.length-1; i >= 0; i--)
					if(a % fb[i] === 0)
						return fb[i];
			}
			else
			{
				for(let i = fa.length-1; i >= 0; i--)
					if(b % fa[i] === 0)
						return fa[i];
			}
		}
	}
}