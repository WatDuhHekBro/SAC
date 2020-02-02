"use strict";

const OPERATOR = {
	ADD: 1,
	SUBTRACT: 2,
	MULTIPLY: 3,
	DIVIDE: 4,
	POWER: 5,
	COMPOSITION: 6
};

function getOperator(s)
{
	if(isType(s, String))
	{
		switch(s)
		{
			case '+': return OPERATOR.ADD;
			case '-': return OPERATOR.SUBTRACT;
			case '*': return OPERATOR.MULTIPLY;
			case '/': return OPERATOR.DIVIDE;
			case '^': return OPERATOR.POWER;
			case 'o': return OPERATOR.COMPOSITION;
		}
	}
}

class Function
{
	constructor(v, l, r)
	{
		// Send a number for pure numbers (including pi and e) and strings for everything else.
		// type: OPERATOR --> value: +-*/^o
		// type: VARIABLE --> value: x (Omitted right now since everything is in one variable only.)
		// type: NUMBER --> value: -0.5...
		// type: SPECIAL --> value: (trig), log, ... (has attributes instead of using left and right), attributes: {base: 10 or e (log/ln)}
		// If you want run of the mill composition, use evaluations which will be recursive: Soon(TM)
		if(isType(v, Object))
			this.value = v;
		else if(isType(v, Number))
			this.value = {"type": "NUMBER", "value": v};
		else if(isType(v, String))
		{
			if(isOperatorString(v))
				this.value = {"type": "OPERATOR", "value": getOperator(v)};
			else if(v === 'x')
				this.value = {"type": "VARIABLE"};
			else if(['log','ln'].includes(v))
				this.value = {"type": "SPECIAL", "value": "log", "attributes": {"base": v === 'ln' ? Math.E : 10}};
			else if(['sin','cos','tan','arcsin','arccos','arctan'].includes(v))
				this.value = {"type": "SPECIAL", "value": v};
			else
				this.value = {"type": "NUMBER", "value": Number(v)};
		}
		else
			this.value = null;
		
		// In a valid Function, variables and numbers are always endpoints, and operators always have two branches.
		this.left = isType(l, Function) && exists(this.value) && this.value.type === "OPERATOR" ? l : null;
		this.right = isType(r, Function) && exists(this.value) && this.value.type === "OPERATOR" ? r : null;
	}
	
	solve(x)
	{
		if(isType(x, Number) && exists(this.value))
		{
			if(this.value.type === "OPERATOR")
			{
				switch(this.value.value)
				{
					case OPERATOR.ADD: return this.left.solve(x) + this.right.solve(x);
					case OPERATOR.SUBTRACT: return this.left.solve(x) - this.right.solve(x);
					case OPERATOR.MULTIPLY: return this.left.solve(x) * this.right.solve(x);
					case OPERATOR.DIVIDE: return this.left.solve(x) / this.right.solve(x);
					case OPERATOR.POWER: return Math.pow(this.left.solve(x), this.right.solve(x)); // iOS does not support the ** operator
				}
			}
			else if(this.value.type === "VARIABLE")
				return x;
			else
				return this.value.value;
		}
	}
	
	pseudo_derivative(x)
	{
		if(isType(x, Number))
			return Number(((this.solve(x + 0.00000000001) - this.solve(x)) / 0.00000000001).toFixed(3));
	}
	
	// .simplified().derivative() because 2^2's derivative will still evaluate to 4 rather than 0.
	derivative()
	{
		if(exists(this.value))
		{
			if(this.value.type === "OPERATOR")
			{
				switch(this.value.value)
				{
					case OPERATOR.ADD: return new Function('+', this.left.derivative(), this.right.derivative());
					case OPERATOR.SUBTRACT: return new Function('-', this.left.derivative(), this.right.derivative());
					case OPERATOR.MULTIPLY: return new Function('+', new Function('*', this.left.derivative(), this.right), new Function('*', this.left, this.right.derivative()));
					case OPERATOR.DIVIDE: return new Function('/', new Function('-', new Function('*', this.left.derivative(), this.right), new Function('*', this.left, this.right.derivative())), new Function('^', this.right, new Function(2)));
					case OPERATOR.POWER: return new Function('*', this.right, new Function('^', this.left, new Function('-', this.right, new Function(1))));
					//ERRONEOUS - case '^': return new Function('^', new Function('*', this.left, this.right), new Function('-', this.right, new Function('1')));
					case OPERATOR.COMPOSITION: return new Function('o', new Function('*', this.left.derivative(), this.right.derivative()), this.right);
				}
			}
			else
				return this.value.type === "VARIABLE" ? new Function(1) : new Function(0);
		}
	}
	
	simplify()
	{
		if(exists(this.value) && this.value.type === "OPERATOR")
		{
			if(this.value.value === OPERATOR.ADD)
			{
				// General Addition:
				// c1 + c2, given c =/= x
				if(isConstant(this.left) && isConstant(this.right))
					return new Function(this.left.value.value + this.right.value.value);
				// Addition Rule #1A:
				// 0 + a = a
				if(isConstant(this.left, 0))
					return this.right;
				// Addition Rule #1B:
				// a + 0 = a
				else if(isConstant(this.right, 0))
					return this.left;
			}
			else if(this.value.value === OPERATOR.SUBTRACT)
			{
				// General Subtraction:
				// c1 - c2, given c =/= x
				if(isConstant(this.left) && isConstant(this.right))
					return new Function(this.left.value.value - this.right.value.value);
				// Subtraction Rule #1:
				// 0 - a = -1 * a
				else if(isConstant(this.left, 0))
					return new Function('*', new Function(-1), this.right) ;
				// Subtraction Rule #2:
				// a - 0 = a
				else if(isConstant(this.right, 0))
					return this.left;
			}
			else if(this.value.value === OPERATOR.MULTIPLY)
			{
				// Preference:
				// 5*x > x*5
				//if()
					//
				
				// General Multiplication:
				// c1 * c2, given c =/= x
				if(isConstant(this.left) && isConstant(this.right))
					return new Function(this.left.value.value * this.right.value.value);
				// General Variable Multiplication A:
				// c1 * (c2 * x) = (c1*c2)x
				//else if(isConstant(this.left) && ( || ))
					//return ;
				// Multiplication Rule #1A:
				// 1 * a = a
				else if(isConstant(this.left, 1))
					return this.right;
				// Multiplication Rule #1B:
				// a * 1 = a
				else if(isConstant(this.right, 1))
					return this.left;
				// Multiplication Rule #2A:
				// 0 * a = 0
				else if(isConstant(this.left, 0))
					return new Function(0);
				// Multiplication Rule #2B:
				// a * 0 = 0
				else if(isConstant(this.right, 0))
					return new Function(0, 0);
				// Multiplication Rule #3A:
				// 5*2x = 10x
				//else if()
			}
			else if(this.value.value === OPERATOR.DIVIDE)
			{
				// General Division:
				// c1 / c2, given c =/= x
				if(isConstant(this.left) && isConstant(this.right))
					return new Function(this.left.value.value / this.right.value.value);
				// Division Rule #1:
				// a / 1 = a
				else if(isConstant(this.right, 1))
					return this.left;
				// Division Rule #2:
				// 0 / a = 0
				else if(isConstant(this.left, 0))
					return new Function(0);
				// Division Rule #3:
				// a / 0 = NaN
				else if(isConstant(this.right, 0))
					return NaN;
			}
			else if(this.value.value === OPERATOR.POWER)
			{
				// General Exponentiation:
				// c1 ^ c2, given c =/= x
				if(isConstant(this.left) && isConstant(this.right))
					return new Function(Math.pow(this.left.value.value, this.right.value.value));
				// Exponentiation Rule #1:
				// a ^ 1 = a
				else if(isConstant(this.right, 1))
					return this.left;
				// Exponentiation Rule #2:
				// a ^ 0 = 1
				else if(isConstant(this.right, 0))
					return new Function(1);
				// Exponentiation Rule #3:
				// 1 ^ a = 1
				else if(isConstant(this.left, 1))
					return new Function(1);
			}
			/*else if(this.value.value === OPERATOR.COMPOSITION)
			{
				
			}*/
		}
		
		return isEndpoint(this) ? new Function(this.value) : new Function(this.value, this.left.simplify(), this.right.simplify());
	}
	
	simplified()
	{
		let loop = true,
			f = this,
			g;
		
		while(loop)
		{
			g = f.simplify();
			loop = f.toString() !== g.toString();
			
			if(loop)
				f = g;
		}
		
		return f;
	}
	
	// add a toLaTeX method
	
	// Fix
	toStringInfix()
	{
		let output = '';
		
		if(this.left !== null)
			output += isEndpoint(this.left) ? this.left.toStringInfix() : '(' + this.left.toStringInfix() + ')';
		if(this.value !== null && this.value !== '*') // Multiplication is the key issue here: 5*(2*x) = 5(2x)
			output += this.value.value;
		if(this.right !== null)
			output += isEndpoint(this.right) ? this.right.toStringInfix() : '(' + this.right.toStringInfix() + ')';
		
		return output.replace(/ /g,'');
	}
	
	// Fix
	toString()
	{
		let output = '';
		
		if(this.value !== null)
			output += this.value.value;
		if(this.left !== null)
			output += ' ' + this.left;
		if(this.right !== null)
			output += ' ' + this.right;
		
		return output;
	}
}

const TOKEN = {
	NUMBER: 0,
	OPERATOR: 1,
	VARIABLE: 2,
	PARENTHESES: 3,
	BRACKETS: 4,
	AIR_QUOTES: 5,
	COMMA: 6
};

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
/*function createFunction(f)
{
	if(typeof f === 'string')
		f = f.split(' ');
	
	if(f !== null && f.constructor === Array)
	{
		if(isOperatorString(f[0]))
		{
			var separator = 2;
			
			for(var i = 1; i < separator; i++)
			{
				if(isOperatorString(f[i]))
					separator += 2;
			}
			
			return new Function(f[0], createFunction(f.slice(1,separator)), createFunction(f.slice(separator)));
		}
		else
			return new Function(f[0]);
	}
}*/

function isEndpoint(f) {return isType(f, Function) && f.left === null && f.right === null && exists(f.value) && f.value.type !== "OPERATOR";}
function isConstant(f, num) {return isType(f, Function) && isEndpoint(f) && f.value.type === "NUMBER" && (isType(num, Number) ? f.value.value === num : true);}
function isVariable(f) {return isType(f, Function) && isEndpoint(f) && f.value.type === "VARIABLE";}

function isVariableString(v) {return exists(v) && ['x','e','pi'].includes(v);}
function hasVariable(v) {return exists(v) && /[x,e,pi]/g.test(v);}
function isOperatorString(v) {return exists(v) && '+-*/^o'.includes(v);}
function hasOperator(v) {return exists(v) && /[\+,-,\*,\/,\^,o]/g.test(v);}

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

/**
 * @arg String
 * @return Array
 */
/*function toPrefix(f)
{
	if(typeof f === 'string')
	{
		f = f.replace(/ /g,'');
		let list = [];
		let selection = '';
		let depth = 0;
		let trim = [0, f.length];
		
		// Split everything into an array //
		for(let i = 0; i < f.length; i++)
		{
			if(f[i] === '(')
			{
				depth++;
				
				if(depth === 1)
					trim[0] = i+1;
			}
			else if(f[i] === ')')
			{
				depth--;
				
				if(depth === 0)
				{
					trim[1] = i;
					list.push(toPrefix(f.substring(trim[0], trim[1])));
				}
			}
			else if(depth === 0)
			{
				if(isOperatorString(f[i]))
				{
					if(/(\d+)([A-z])/.test(f[i])) // 36x
					{
						
					}
					else
						list.push(selection);
					
					list.push(f[i]);
					selection = '';
				}
				else
					selection += f[i];
			}
		}
		
		list.push(selection);
		
		return list;
	}
}*/

// Assume you already have an array and that it already passed the expected amount of values test. Also assume that the array goes like [value, operator, value, operator, ...]
// It'll sweep across the array and if the value is an operator, take the left, selected, and right values and swap them around. LOR --> OLR

/*
[3,*,5,^,x,^,2]
[3,*,5,^,[^,x,2]]
[3,*,[^,5,[^,x,2]]]
[*,3,[^,5,[^,x,2]]]
On a side note, the amount of elements is 2n+1, where n is the amount of blocks.

sin(x)^2
[[sin,o,x],^,2]
[^,[sin,o,x],2]
[^,[o,sin,x],2]

Or maybe use matrices/nested arrays that already have the recursive part sorted out? Eh...
*/
/**
 * @arg - Array
 * @return - Function
 */
/*function createFunctionInfix(f)
{
	// Exponents: RTL //
	for(let i = f.length-1; i >= 0; i--)
	{
		if(f[i] === '^')
		{
			i--;
			console.log(f[i+1]);
			console.log(f[i]);
			console.log(f[i+2]);
			f.splice(i, 3, new Function(f[i+1], new Function(f[i]), new Function(f[i+2])));
		}
	}
	
	return f;
}*/

// evalFunction //
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

/*
I might be overcomplicating this. But here are the steps to sort through prefix/infix stuff.
1. Take a string and split it into operator-value segments. The end result is an array.
2. Take that array and sort it from infix to prefix, while also creating sub-arrays. This step is different in prefix mode which should gather elements based on expected lengths. The end result should be nested arrays each with lengths of 3.
3. Plug that nested array into a function which creates a Function object from it.
*/

/**
 * @param {String, Boolean}
 * @returns {String | Number | Array (Semi-Matrix) | Boolean (always false)}
 */
function evalFunction(input)
{
	/*const getType = function(v) {
		if(v === ',')
			return TOKEN.COMMA;
		else if(v === '"' || v === "'")
			return TOKEN.AIR_QUOTES;
		else if(v === '[' || v === ']')
			return TOKEN.BRACKETS;
		else if(v === '(' || v === ')')
			return TOKEN.PARENTHESES;
		else if(isVariableString(v))
			return TOKEN.VARIABLE;
		else if(isOperatorString(v))
			return TOKEN.OPERATOR;
		else if(/[-,\d,\.]/g.test(v))
			return TOKEN.NUMBER;
		else
			return null;
	};*/
	let compendium = collectFunctions(),
		output = false;
	
	if(isType(input, Number))
		return input;
	// Later work on this entire else if block.
	else if(isType(input, String))
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
/**
 * @param {Number, Number, Number}
 * @returns {Boolean}
 */
function isValidRange(start, end, step = 1)
{
	if(isType(start, Number) && isType(end, Number) && isType(step, Number) && step !== 0)
	{
		if(step < 0)
			return start >= end;
		else
			return start <= end;
	}
	else
		return false;
}

/**
 * @param {Nested Array} - [*,3,[^,5,[^,x,2]]]
 * @returns {Function} - new Function(...)
 */
function createFunction(f)
{
	if(isType(f, Array))
		return new Function(f[0], createFunction(f[1]), createFunction(f[2]));
	else
		return new Function(f);
}

/**
 * @param {Array} - ['*','3','^','5','^','x','2']
 * @returns {Nested Array} - ['*',3,['^',5,['^','x',2]]]
 */
function packFunction(f)
{
	if(isType(f, Array) && isValidFunction(f))
	{
		if(isOperatorString(f[0]))
		{
			let separator = 2;
			
			for(let i = 1; i < separator; i++)
				if(isOperatorString(f[i]))
					separator += 2;
			
			return [f[0], packFunction(f.slice(1,separator)), packFunction(f.slice(separator))];
		}
		else if(f[0] === 'x')
			return 'x';
		else if(f[0] === 'e')
			return Math.E;
		else if(f[0] === 'pi')
			return Math.PI;
		else
			return Number(f[0]);
	}
}

/**
 * @param {Array} - ['3','*','5','^','x','^','2'] or ['3','*','5','^',['x','^','2']]
 * @returns {Nested Array} - ['*',3,['^',5,['^','x',2]]]
 */
function packFunctionInfix(f)
{
	if(isType(f, Array) && isValidFunctionInfix(f))
	{
		//packFunctionInfix(parseFunctionInfix('(x^2)^3')), you have to deal with the pre-nested array case.
		// Parentheses: LTR //
		for(let i = 0; i < f.length; i++)
			if(f[i].constructor === Array)
				f[i] = packFunctionInfix(f[i]);
		
		// Placed after the recursion statement to avoid repeats.
		for(let i = 0; i < f.length; i++)
		{
			if(f[i] === 'e')
				f[i] = Math.E;
			else if(f[i] === 'pi')
				f[i] = Math.PI;
			else if(f[i] !== 'x' && !isOperatorString(f[i]) && !isType(f[i], Array))
				f[i] = Number(f[i]);
		}
		
		// Composition: LTR //
		for(let i = 0; i < f.length; i++)
		{
			if(f[i] === 'o')
			{
				f.splice(i-1, 3, [f[i], f[i-1], f[i+1]]);
				i--;
			}
		}
		
		// Exponents: RTL //
		for(let i = f.length-1; i >= 0; i--)
		{
			if(f[i] === '^')
			{
				f.splice(i-1, 3, [f[i], f[i-1], f[i+1]]);
				i--;
			}
		}
		
		// Multiplication/Division: LTR //
		for(let i = 0; i < f.length; i++)
		{
			if(f[i] === '*' || f[i] === '/')
			{
				f.splice(i-1, 3, [f[i], f[i-1], f[i+1]]);
				i--;
			}
		}
		
		// Addition/Subtraction: LTR //
		for(let i = 0; i < f.length; i++)
		{
			if(f[i] === '+' || f[i] === '-')
			{
				f.splice(i-1, 3, [f[i], f[i-1], f[i+1]]);
				i--;
			}
		}
		
		if(f.length === 1)
			f = f[0];
		
		return f;
	}
}

/**
 * @param {String} - "* 3 ^ 5 ^ x 2"
 * @returns {Array} - ['*','3','^','5','^','x','2']
 */
function parseFunction(f)
{
	if(isType(f, String))
		return f.split(' ');
}

/**
 * @param {String} - "3 * 5^(x^2)"
 * @returns {Array} - ['3','*','5','^',['x','^','2']]
 */
// Later, polish/refine this function and fix problems with empty strings and pi. //
function parseFunctionInfix(f)
{
	if(isType(f, String))
	{
		const getType = function(v) {
			if(hasVariable(v))
				return TOKEN.VARIABLE;
			else if(hasOperator(v))
				return TOKEN.OPERATOR;
			else
				return TOKEN.NUMBER;
		};
		f = f.replace(/ /g,'');
		let list = [];
		let mode = getType(f[0]);
		let selection = '';
		let depth = 0;
		let trim = [0, f.length];
		
		for(let i = 0; i < f.length; i++)
		{
			if(f[i] === '(')
			{
				selection ? list.push(selection) : null;
				selection = '';
				
				if(++depth === 1)
					trim[0] = i+1;
			}
			else if(f[i] === ')')
			{
				if(--depth === 0)
				{
					trim[1] = i;
					list.push(parseFunctionInfix(f.substring(trim[0], trim[1])));
				}
			}
			else if(depth === 0)
			{
				if(mode === TOKEN.NUMBER && getType(f[i]) !== TOKEN.NUMBER)
				{
					selection ? list.push(selection) : null;
					selection = '';
					mode = getType(f[i]);
				}
				else if(mode === TOKEN.OPERATOR && getType(f[i]) !== TOKEN.OPERATOR)
				{
					selection ? list.push(selection) : null;
					selection = '';
					mode = getType(f[i]);
				}
				else if(mode === TOKEN.VARIABLE && getType(f[i]) !== TOKEN.VARIABLE)
				{
					selection ? list.push(selection) : null;
					selection = '';
					mode = getType(f[i]);
					
					if(f.substring(i, i+2) === 'pi')
						i++;
				}
				
				selection += f[i];
			}
		}
		
		selection ? list.push(selection) : null;
		
		return list;
	}
}

/**
 * @param {Array} - ['*','3','^','5','^','x','2']
 * @returns {Boolean} - true
 */
function isValidFunction(f)
{
	if(isType(f, Array) && f.length >= 1)
	{
		// [5] is a valid function which just evaluates to the number 5. [*] is not, nor is [3,5].
		let length = 1;
		
		for(let i = 0; i < f.length; i++)
		{
			if(i >= length)
				break;
			else if(isOperatorString(f[i]))
				length += 2;
		}
		
		return f.length === length;
	}
	else
		return false;
}

/**
 * @param {Array} - ['3','*','5','^',['x','^','2']]
 * @returns {Boolean} - true
 */
function isValidFunctionInfix(f)
{
	if(isType(f, Array) && f.length > 0)
	{
		// Cannot start with an operator!
		let previous = true;
		
		for(let i = 0; i < f.length; i++)
		{
			if((isOperatorString(f[i]) && previous) || (!isOperatorString(f[i]) && !previous))
				return false;
			previous = !previous;
		}
		
		return true;
	}
	else
		return false;
}