function factors(num)
{
	if(typeof num === 'number' && num % 1 === 0)
	{
		if(num < 0)
		{
			num = -num;
		}
		
		if(num === 0)
		{
			return [0];
		}
		else if(num === 1)
		{
			return [1];
		}
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
			
			return factors.sort((a,b) => a - b);
		}
	}
}

function GCF(a,b)
{
	if(typeof a === 'number' && typeof b === 'number' && a % 1 === 0 && b % 1 === 0)
	{
		if(a === 0 || b === 0)
			return 0;
		else if(a < 0 || b < 0)
			return -1;
		else
		{
			var fa = factors(a);
			var fb = factors(b);
			
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