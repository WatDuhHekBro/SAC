/*
Since the goal is to use binary trees and not stacks for describing functions (because we're symbolically managing these functions, not just using them to evaluate functions), we're using prefix notation. And the ultimate goal here is to isolate constants and single variables (ie "5" and "x" instead of "5x").

For my prefix notation, I'll use space-separated arguments so I can easily split it along the spaces into an array/list. And when converting it into a tree, every operator will signal a new branch, more examples upcoming.

[List of Operators]
+
-
*
/
^ (you also use this to specify any roots)
o (composition of functions, used for trig for example)

[Example: x^2]
 ^
x 2

-= Derivative =-
   ^
2*x 2-1

So the tree system will fundamentally be used with nodes connecting with each other.

[Example: sin(5x) = o sin * 5 x]
   o
sin *
   5 x

-= Derivative =-
     o
5*cos *
     5 x
*/

import java.util.Arrays;

public class Function
{
	/**
	 * List of Operators (Defunct)
	 * =================
	 * 0 null operator
	 * 1 +
	 * 2 -
	 * 3 *
	 * 4 /
	 * 5 ^
	 * 6 o
	 */
	static final String operators = "+-*/^o";
	private String value;
	private Function left,right;
	
	// Default case, meaning the function has no operators.
	// Also, as of right now, this assumes that you have this function in a simplified state.
	public Function()
	{
		value = null;
		left = right = null;
	}
	
	public Function(String v, Function l, Function r)
	{
		value = v;
		left = l;
		right = r;
	}
	
	/*public Function(String notation)
	{
		convert(notation);
	}*/
	
	private static Function convert(String notation)
	{
		String[] list = notation.split(" ");
		
		for(int i = 0; i < list.length; i++)
		{
			
		}
	}
	
	private String getValue() {return value;}
	private Function getLeft() {return left;}
	private Function getRight() {return right;}
	
	public double eval(double x)
	{
		if(left == null && right == null)
		{
			if(value.equals("x"))
				return x;
			else
				return Double.parseDouble(value);
		}
		else if(operators.indexOf(value) != -1)
		{
			switch(value)
			{
				case "+": return left.eval(x) + right.eval(x);
				case "-": return left.eval(x) - right.eval(x);
				case "*": return left.eval(x) * right.eval(x);
				case "/": return left.eval(x) / right.eval(x);
				case "^": return Math.pow(left.eval(x), right.eval(x));
			}
		}
		
		System.out.println("Something went wrong.");
		return 0;
	}
	
	//public Function derivative()
	
	public static String derivative(String func)
	{
		return "";
	}
	
	public String toString()
	{
		String output = "";
		
		if(value != null)
			output += value + " ";
		if(left != null)
			output += left + " ";
		if(right != null)
			output += right;
		
		return output;
	}
}