"use strict";

class Function
{
	constructor(v, l, r)
	{
		if(typeof v === 'string')
			this.value = v;
		else
			this.value = null;
		
		if(isFunction(l))
			this.left = l;
		else
			this.left = null;
		
		if(isFunction(r))
			this.right = r;
		else
			this.right = null;
	}
	
	solve(x)
	{
		if(typeof x === 'number')
		{
			if(isEndpoint(this))
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
			else if(isOperator(this.value))
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
		if(isEndpoint(this))
		{
			if(this.value === 'x')
				return new Function('1');
			else
				return new Function('0');
		}
		else if(isOperator(this.value))
		{
			switch(this.value)
			{
				case '+': return new Function('+', this.left.derivative(), this.right.derivative());
				case '-': return new Function('-', this.left.derivative(), this.right.derivative());
				case '*': return new Function('+', new Function('*', this.left.derivative(), this.right), new Function('*', this.left, this.right.derivative()));
				case '/': return new Function('/', new Function('-', new Function('*', this.left.derivative(), this.right), new Function('*', this.left, this.right.derivative())), new Function('^', this.right, new Function('2')));
				case '^': return new Function('*', this.right, new Function('^', this.left, new Function('-', this.right, new Function('1'))));
				//ERRONEOUS - case '^': return new Function('^', new Function('*', this.left, this.right), new Function('-', this.right, new Function('1')));
				case 'o': return new Function('o', new Function('*', this.left.derivative(), this.right.derivative()), this.right);
			}
		}
	}
	
	simplify()
	{
		if(isOperator(this.value))
		{
			switch(this.value)
			{
				case '+':
					// General Addition:
					// c1 + c2, given c =/= x
					if(isConstant(this.left) && isConstant(this.right))
						return new Function((Number(this.left.value) + Number(this.right.value)).toString());
					// Addition Rule #1A:
					// 0 + a = a
					if(isEndpoint(this.left) && this.left.value === '0')
						return this.right;
					// Addition Rule #1B:
					// a + 0 = a
					else if(isEndpoint(this.right) && this.right.value === '0')
						return this.left;
					break;
				
				case '-':
					// General Subtraction:
					// c1 - c2, given c =/= x
					if(isConstant(this.left) && isConstant(this.right))
						return new Function((Number(this.left.value) - Number(this.right.value)).toString());
					// Subtraction Rule #1:
					// 0 - a = -1 * a
					else if(isEndpoint(this.left) && this.left.value === '0')
						return new Function('*', new Function('-1'), this.right) ;
					// Subtraction Rule #2:
					// a - 0 = a
					else if(isEndpoint(this.right) && this.right.value === '0')
						return this.left;
					break;
				
				case '*':
					// Preference:
					// 5*x > x*5
					//if()
						//
					
					// General Multiplication:
					// c1 * c2, given c =/= x
					if(isConstant(this.left) && isConstant(this.right))
						return new Function((Number(this.left.value) * Number(this.right.value)).toString());
					// General Variable Multiplication A:
					// c1 * (c2 * x) = (c1*c2)x
					//else if(isConstant(this.left) && ( || ))
						//return ;
					// Multiplication Rule #1A:
					// 1 * a = a
					else if(isEndpoint(this.left) && this.left.value === '1')
						return this.right;
					// Multiplication Rule #1B:
					// a * 1 = a
					else if(isEndpoint(this.right) && this.right.value === '1')
						return this.left;
					// Multiplication Rule #2A:
					// 0 * a = 0
					else if(isEndpoint(this.left) && this.left.value === '0')
						return new Function('0');
					// Multiplication Rule #2B:
					// a * 0 = 0
					else if(isEndpoint(this.right) && this.right.value === '0')
						return new Function('0');
					break;
					// Multiplication Rule #3A:
					// 5*2x = 10x
					//else if()
				
				case '/':
					// General Division:
					// c1 / c2, given c =/= x
					/*if(isConstant(this.left) && isConstant(this.right))
						return new Function((Number(this.left.value) / Number(this.right.value)).toString(), null, null);*/
					// Division Rule #1:
					// a / 1 = a
					if(isEndpoint(this.right) && this.right.value === '1')
						return this.left;
					// Division Rule #2:
					// 0 / a = 0
					else if(isEndpoint(this.left) && this.left.value === '0')
						return new Function('0');
					// Division Rule #3:
					// a / 0 = NaN
					else if(isEndpoint(this.right) && this.right.value === '0')
						return NaN;
					break;
				
				case '^':
					// Exponentiation Rule #1:
					// a ^ 1 = a
					if(isEndpoint(this.right) && this.right.value === '1')
						return this.left;
					// Exponentiation Rule #2:
					// a ^ 0 = 1
					else if(isEndpoint(this.right) && this.right.value === '0')
						return new Function('1');
					// Exponentiation Rule #3:
					// 1 ^ a = 1
					else if(isEndpoint(this.left) && this.left.value === '1')
						return new Function('1');
					break;
			}
		}
		
		if(!isEndpoint(this))
			return new Function(this.value, this.left.simplify(), this.right.simplify());
		else
			return new Function(this.value);
	}
	
	simplified()
	{
		var loop = true;
		var f = this;
		var g;
		
		while(loop)
		{
			g = f.simplify();
			loop = f.toString() !== g.toString();
			
			if(loop)
				f = g;
		}
		
		return f;
	}
	
	toStringInfix()
	{
		var output = "";
		
		if(this.left !== null)
		{
			if(isEndpoint(this.left))
				output += this.left.toStringInfix();
			else
				output += "(" + this.left.toStringInfix() + ")";
		}
		if(this.value !== null && this.value !== '*') // Multiplication is the key issue here: 5*(2*x) = 5(2x)
		{
			output += this.value;
		}
		if(this.right !== null)
		{
			if(isEndpoint(this.right))
				output += this.right.toStringInfix();
			else
				output += "(" + this.right.toStringInfix() + ")";
		}
		
		return output.replace(/ /g,'');
	}
	
	toString()
	{
		var output = "";
		
		if(this.value !== null)
			output += this.value;
		if(this.left !== null)
			output += " " + this.left;
		if(this.right !== null)
			output += " " + this.right;
		
		return output;
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
		if(isOperator(f[0]))
		{
			var separator = 2;
			
			for(var i = 1; i < separator; i++)
			{
				if(isOperator(f[i]))
					separator += 2;
			}
			
			return new Function(f[0], createFunction(f.slice(1,separator)), createFunction(f.slice(separator)));
		}
		else
		{
			return new Function(f[0]);
		}
	}
}

function isFunction(f) {return f !== undefined && f !== null && f.constructor === Function;}
function isEndpoint(f) {return isFunction(f) && f.left === null && f.right === null;}
function isConstant(f) {return isFunction(f) && isEndpoint(f) && f.value !== 'x' && f.value !== 'e' && f.value !== 'pi';} // Technically, e and pi are constants, but we're treating them like variables to preserve accuracy.
function isVariable(f) {return isFunction(f) && isEndpoint(f) && f.value === 'x';}
function isOperator(v) {return v !== undefined && '+-*/^o'.includes(v);}

function toPrefix(f)
{
	// Recursive String Return Function
	// ********************************
	// (3x^2+45)/(5x+7/2)
	// / (3x^2+45) (5x+7/2)
	// / + 3x^2 45 (5x+7/2)
	// / + * 3 x^2 45 (5x+7/2)
	// / + * 3 ^ x 2 45 (5x+7/2)
	// / + * 3 ^ x 2 45 + 5x 7/2
	// / + * 3 ^ x 2 45 + * 5 x 7/2
	// / + * 3 ^ x 2 45 + * 5 x / 7 2
	
	if(typeof f === 'string')
	{
		f = f.replace(/ /g,'');
		
		
		
		return f;
	}
	
	// (3x^2+45)/(5x+7/2)
	// / + * 3 ^ x 2 45 + * 5 x / 7 2
	
	// x^2+x+5
	// + ^ x 2 + x 5
	
	// If recursion is going inside to the bottom, then building is going outside to the top. That means that instead of starting off with your core element, build the leaves first.
	
	// x^2+x+5
	// [x^2] --> [^ x 2]
	// [[x^2]+x] --> [+ [^ x 2] x]
	// [[[x^2]+x]+5] --> [+ [+ [^ x 2] x] 5]
	// + + ^ x 2 x 5
	
	// Parentheses = Preemptive Measures, ie deciding "val 1" of [val 1][operator][val 2] first.
	// (3x^2+45)/(5x+7/2)
	// [? [] []]
	
	f = f.replace(/ /g,'');
	
	//for(var c of f)
		//console.log(c);
	
	return f;
}