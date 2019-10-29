var operators = "+-*/^o";

class Function
{
	constructor(v,l,r)
	{
		if(typeof v === 'string')
			this.value = v;
		else
			this.value = null;
		
		if(typeof l === 'object' && l !== null && l.constructor.name === 'Function')
			this.left = l;
		else
			this.left = null;
		
		if(typeof r === 'object' && r !== null && r.constructor.name === 'Function')
			this.right = r;
		else
			this.right = null;
	}
	
	solve(x)
	{
		if(this.left === null && this.right === null)
		{
			if(this.value === 'x')
				return x;
			else if(this.value === 'e')
				return Math.E;
			else if(this.value === 'pi')
				return Math.PI;
			else
				return Number(this.value);
		}
		else if(operators.includes(this.value))
		{
			switch(this.value)
			{
				case '+': return this.left.solve(x) + this.right.solve(x);
				case '-': return this.left.solve(x) - this.right.solve(x);
				case '*': return this.left.solve(x) * this.right.solve(x);
				case '/': return this.left.solve(x) / this.right.solve(x);
				case '^': return this.left.solve(x) ** this.right.solve(x);
			}
		}
	}
}

function createFunction(f)
{
	/*
		^ x 2
		0 1 2
		V L R

		* 5 ^ x 2
		0 1 2 3 4
		V L R R R

		* + 5 x ^ x 2
		0 1 2 3 4 5 6
		V L L L R R R
		
		* + / 5 2 x ^ x 2
		0 1 2 3 4 5 6 7 8
		V L L L L L R R R

		So what can we conclude? After an operator, there is a minimum of 2 spaces forward in its domain. If there's an operator, add 2 more spaces (assuming you format the input correctly). Just simply count which spaces are for the left function and which spaces are for the right function. For the purposes of simplicity, there'll be a separator located at the first space of R. That'll serve as the cut-off point from L and the start of R.
	*/
	
	if(typeof f === 'string')
		f = f.split(' ');
	
	if(typeof f === 'object' && f !== null && f.constructor.name === 'Array')
	{
		if(operators.includes(f[0]))
		{
			var separator = 2;
			
			for(var i = 1; i < separator; i++)
			{
				if(operators.includes(f[i]))
					separator += 2;
			}
			
			return new Function(f[0], createFunction(f.slice(1,separator)), createFunction(f.slice(separator)));
		}
		else
		{
			return new Function(f[0], null, null);
		}
	}
}

function factors(num,sort)
{
	if(typeof num === 'number' && num % 1 === 0 && typeof sort === 'boolean')
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
			
			return sort ? factors.sort((a,b) => a - b) : factors;
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
			var fa = factors(a,true);
			var fb = factors(b,true);
			
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