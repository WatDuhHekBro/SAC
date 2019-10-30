"use strict";

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
		if(typeof x === 'number')
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
					case '^': return Math.pow(this.left.solve(x), this.right.solve(x)); // iOS does not support the ** operator
				}
			}
		}
	}
	
	pseudo_derivative(x)
	{
		if(typeof x === 'number')
			return Number(((this.solve(x + 0.00000000001) - this.solve(x)) / 0.00000000001).toFixed(3));
	}
	
	derivative()
	{
		if(this.left === null && this.right === null)
		{
			if(this.value === 'x')
				return new Function('1', null, null);
			else
				return new Function('0', null, null);
		}
		else if(operators.includes(this.value))
		{
			switch(this.value)
			{
				case '+': return new Function('+', this.left.derivative(), this.right.derivative());
				case '-': return new Function('-', this.left.derivative(), this.right.derivative());
				case '*': return new Function('+', new Function('*', this.left.derivative(), this.right), new Function('*', this.left, this.right.derivative()));
				case '/': return new Function('/', new Function('-', new Function('*', this.left.derivative(), this.right), new Function('*', this.left, this.right.derivative())), new Function('^', this.right, new Function('2', null, null)));
				case '^': return new Function('^', new Function('*', this.left, this.right), new Function('-', this.right, new Function('1', null, null)));
				case 'o': return new Function('o', new Function('*', this.left.derivative(), this.right.derivative()), this.right);
			}
		}
	}
	
	simplify()
	{
		if(operators.includes(this.value))
		{
			switch(this.value)
			{
				case '+':
					// General Addition:
					// c1 + c2, given c =/= x
					if(this.left.left === null && this.left.right === null && this.left.value !== 'x' && this.left.value !== 'e' && this.left.value !== 'pi' && this.right.left === null && this.right.right === null && this.right.value !== 'x' && this.right.value !== 'e' && this.right.value !== 'pi')
						return new Function((Number(this.left.value) + Number(this.right.value)).toString(), null, null);
					// Addition Rule #1A:
					// 0 + a = a
					if(this.left.left === null && this.left.right === null && this.left.value === '0')
						return this.right;
					// Addition Rule #1B:
					// a + 0 = a
					else if(this.right.left === null && this.right.right === null && this.right.value === '0')
						return this.left;
					break;
				
				case '-':
					// General Subtraction:
					// c1 - c2, given c =/= x
					if(this.left.left === null && this.left.right === null && this.left.value !== 'x' && this.left.value !== 'e' && this.left.value !== 'pi' && this.right.left === null && this.right.right === null && this.right.value !== 'x' && this.right.value !== 'e' && this.right.value !== 'pi')
						return new Function((Number(this.left.value) - Number(this.right.value)).toString(), null, null);
					// Subtraction Rule #1:
					// 0 - a = -1 * a
					else if(this.left.left === null && this.left.right === null && this.left.value === '0')
						return new Function('*', new Function('-1', null, null), this.right) ;
					// Subtraction Rule #2:
					// a - 0 = a
					else if(this.right.left === null && this.right.right === null && this.right.value === '0')
						return this.left;
					break;
				
				case '*':
					// Multiplication Rule #1A:
					// 1 * a = a
					if(this.left.left === null && this.left.right === null && this.left.value === '1')
						return this.right;
					// Multiplication Rule #1B:
					// a * 1 = a
					else if(this.right.left === null && this.right.right === null && this.right.value === '1')
						return this.left;
					// Multiplication Rule #2A:
					// 0 * a = 0
					else if(this.left.left === null && this.left.right === null && this.left.value === '0')
						return new Function('0', null, null);
					// Multiplication Rule #2B:
					// a * 0 = 0
					else if(this.right.left === null && this.right.right === null && this.right.value === '0')
						return new Function('0', null, null);
					break;
				
				case '/':
					// Division Rule #1:
					// a / 1 = a
					if(this.right.left === null && this.right.right === null && this.right.value === '1')
						return this.left;
					// Division Rule #2:
					// 0 / a = 0
					else if(this.left.left === null && this.left.right === null && this.left.value === '0')
						return new Function('0', null, null);
					// Division Rule #3:
					// a / 0 = NaN
					else if(this.right.left === null && this.right.right === null && this.right.value === '0')
						return NaN;
					break;
				
				case '^':
					// Exponentiation Rule #1:
					// a ^ 1 = a
					if(this.right.left === null && this.right.right === null && this.right.value === '1')
						return this.left;
					// Exponentiation Rule #2:
					// a ^ 0 = 1
					else if(this.right.left === null && this.right.right === null && this.right.value === '0')
						return new Function('1', null, null);
					// Exponentiation Rule #3:
					// 1 ^ a = 1
					else if(this.left.left === null && this.left.right === null && this.left.value === '1')
						return new Function('1', null, null);
					break;
			}
		}
		
		if(this.left !== null && this.right !== null)
			return new Function(this.value, this.left.simplify(), this.right.simplify());
		else
			return new Function(this.value, null, null);
	}
	
	static toggle_notation()
	{
		Function.notation = !Function.notation;
	}
	
	toString()
	{
		var output = "";
		
		if(Function.notation)
		{
			if(this.left !== null)
			{
				if(this.left.left === null && this.left.right === null)
					output += this.left;
				else
					output += "(" + this.left + ")";
			}
			if(this.value !== null)
			{
				output += this.value;
			}
			if(this.right !== null)
			{
				if(this.right.left === null && this.right.right === null)
					output += this.right;
				else
					output += "(" + this.right + ")";
			}
			
			output.replace(/ /g,'');
		}
		else
		{
			if(this.value !== null)
				output += this.value;
			if(this.left !== null)
				output += " " + this.left;
			if(this.right !== null)
				output += " " + this.right;
		}
		
		return output;
	}
}
Function.notation = false;

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

/*function infix_prefix(f)
{
	// (3x^2+45)/(5x+7/2)
	// / + * 3 ^ x 2 45 + * 5 x / 7 2
	
	f = f.replace(/ /g,'');
	
	
	
	return f;
}*/

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

function d()
{
	return "king ddd";
}