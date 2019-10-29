import java.util.Arrays;

public class SAC_Blueprint
{
	public static void main(String[] args)
	{
		long start = System.nanoTime();
		
		/*TimeUnit a = new TimeUnit(32);
		TimeUnit b = new TimeUnit(30);
		System.out.println(TimeUnit.add(a,b));
		System.out.println(TimeUnit.add(new TimeUnit[] {new TimeUnit(32), new TimeUnit(30), new TimeUnit(1,2)}));*/
		/*System.out.println(Arrays.toString(factors(4096))); //and it ends at 64. that is A LOT OF NUMBERS you're skipping
		System.out.println(Arrays.toString(factors(10735987))); //in actuality, you only have to calculate do 3275 (3276-1) calculations to find the factors of this gargantuan number
		System.out.println(Arrays.toString(factors(Integer.MAX_VALUE)));
		System.out.println(Arrays.toString(factors(-2))); //do note however that this thing is not built for negative numbers (yet). But then again, it's just negatives on the same factors
		System.out.println(Arrays.toString(factors(591823745)));*/
		//System.out.println(Arrays.toString(factors(591823745)));
		//DateUnit c = new DateUnit(30);
		//System.out.println(c);
		//System.out.println(Arrays.toString(factors(12345678)));
		//System.out.println(new Function("+ 5 x"));
		//Function y = new Function("+", new Function("5", null, null), new Function("x", null, null));
		Function y = new Function("/", new Function("*", new Function("5", null, null), new Function("x", null, null)), new Function("*", new Function("2", null, null), new Function("x", null, null)));
		System.out.println(y);
		for(double i = 0; i <= 10; i += 0.5)
			System.out.println(y.eval(i));
		
		System.out.println("\nRuntime: " + String.format("%,d", System.nanoTime() - start) + " nanoseconds (for reference: 1,000,000,000 nanoseconds = 1 second)");
	}
	
	static String ratio(int num, int denom) //auto diff, meaning the target number is based on GCF, which is the same as reducing the fraction to its simplest form, aka fraction reducer. Unfortunately, GCF and LCM are a whole other beast to tackle.
	{
		int gcf = GCF(num,denom);
		return (num/gcf) + " : " + (denom/gcf);
	}
	
	static String ratio(int num, int denom, double target) //target = the target numerator, ie the destination of the numerator
	{
		return target + " : " + (denom * (target / num));
	}
	
	static int[] factors(int num)
	{
		if(num == 0)
			return new int[] {0};
		if(num < 0)
		{
			num = -num;
			System.out.print("Apply negatives where necessary.\t");
		}
		if(num == 1)
			return new int[] {1};
		
		String factors_tmp = "1 ";
		
		/*for(int x = 2; x <= (int)Math.sqrt(num); x++)
		{
			if(num % x == 0)
			{
				//System.out.println(x + " and " + num/x + " are factors of " + num);
				factors_tmp += x + " ";
				if(num/x != x)
					factors_tmp += num/x + " ";
			}
		}*/
		
		// Even-Odd Optimization, cuts out a bunch of unnecessary calculations if the number is odd.
		if(num % 2 == 0)
		{
			for(int x = 2; x <= (int)Math.sqrt(num); x++)
			{
				if(num % x == 0)
				{
					factors_tmp += x + " ";
					if(num/x != x)
						factors_tmp += num/x + " ";
				}
			}
		}
		else
		{
			for(int x = 3; x <= (int)Math.sqrt(num); x += 2)
			{
				if(num % x == 0)
				{
					factors_tmp += x + " ";
					if(num/x != x)
						factors_tmp += num/x + " ";
				}
			}
		}
		
		factors_tmp += num;
		String[] list = factors_tmp.split(" ");
		int[] factors = new int[list.length];
		
		for(int i = 0; i < list.length; i++)
			factors[i] = Integer.parseInt(list[i]);
		
		Arrays.sort(factors);
		
		return factors;
	}
	
	static int[] unoptimized_factors(int num)
	{
		String factors_tmp = "";
		
		for(int x = 1; x <= num; x++)
		{
			if(num % x == 0)
			{
				factors_tmp += x + " ";
			}
		}
		
		String[] list = factors_tmp.split(" ");
		int[] factors = new int[list.length];
		
		for(int i = 0; i < list.length; i++)
			factors[i] = Integer.parseInt(list[i]);
		
		return factors;
	}
	
	static int GCF(int a, int b) //If you think about it, you only need to use one set of factors. After all, you're seeing what the greatest common factor is between them. Of course, compare the lengths for optimization purposes.
	{
		//The reason why I set it up going backwards is because if you're trying to find the GREATEST common factor, are you going to start at 1 or the number that could potentially be the GCF? Also removes the need to keep track of a maximum.
		if(a == 0 || b == 0)
		{
			return 0;
		}
		else if(a < 0 || b < 0)
		{
			System.out.println("Negative numbers will be implemented Soon™!");
			return -1;
		}
		else
		{
			int[] fa = factors(a);
			int[] fb = factors(b);
			
			if(fb.length < fa.length)
			{
				for(int i = fb.length-1; i >= 0; i--)
				{
					if(a % fb[i] == 0)
						return fb[i];
				}
			}
			else
			{
				for(int i = fa.length-1; i >= 0; i--)
				{
					if(b % fa[i] == 0)
						return fa[i];
				}
			}
		}
		
		return -2; //this exit code means something went wrong
	}
}

class TimeUnit
{
	//while not explicitly stated, this is an INDEFINITE time unit. a DEFINITE time unit is a DateUnit because it accounts for the date as well as absolute days hours minutes and seconds.
	private int days,hours,minutes,seconds;
	
	public TimeUnit(int d, int h, int m, int s) {setTimeUnit(d,h,m,s);}
	public TimeUnit(int h, int m, int s) {setTimeUnit(0,h,m,s);}
	public TimeUnit(int m, int s) {setTimeUnit(0,0,m,s);}
	public TimeUnit(int s) {setTimeUnit(0,0,0,s);}
	public TimeUnit() {setTimeUnit(0,0,0,0);}
	
	private void setTimeUnit(int d, int h, int m, int s)
	{
		days = d;
		hours = h;
		minutes = m;
		seconds = s;
	}
	
	public int getDays() {return days;}
	public int getHours() {return hours;}
	public int getMinutes() {return minutes;}
	public int getSeconds() {return seconds;}
	
	//for the sake of avoiding redundancy, add will account for both adding and subtracting because time operations are unidirectional most of the time
	public void addDays(int d) {days += d;}
	public void addHours(int h) {hours += h;}
	public void addMinutes(int m) {minutes += m;}
	public void addSeconds(int s) {seconds += s;}
	
	public static TimeUnit add(TimeUnit a, TimeUnit b)
	{
		int d = a.getDays() + b.getDays();
		int h = a.getHours() + b.getHours();
		int m = a.getMinutes() + b.getMinutes();
		int s = a.getSeconds() + b.getSeconds();
		
		if(s > 59)
		{
			m += s / 60;
			s %= 60;
		}
		if(m > 59)
		{
			h += m / 60;
			m %= 60;
		}
		if(h > 23)
		{
			d += h / 24;
			h %= 24;
		}
		
		return new TimeUnit(d,h,m,s);
	}
	
	public static TimeUnit add(TimeUnit[] units) //indefinite addition
	{
		TimeUnit total = new TimeUnit();
		
		if(units.length >= 1)
		{
			total = units[0];
			
			if(units.length >= 2)
				for(int i = 1; i < units.length; i++)
					total = add(total,units[i]);
		}
		
		return total;
	}
	
	public String toString()
	{
		String desc = "";
		
		if(days != 0)
			desc += days + " days, ";
		if(hours != 0)
			desc += hours + " hours, ";
		if(minutes != 0)
			desc += minutes + " minutes, ";
		
		return desc + seconds + " seconds";
	}
}

class DateUnit
{
	private int years, days, hours, minutes, seconds; //days will cycle per year and the year will determine the number of days allotted to that year.
	
	public DateUnit(int y, int d, int h, int m, int s) {setDateUnit(y,d,h,m,s);}
	public DateUnit(int d, int h, int m, int s) {setDateUnit(0,d,h,m,s);}
	public DateUnit(int h, int m, int s) {setDateUnit(0,0,h,m,s);}
	public DateUnit(int m, int s) {setDateUnit(0,0,0,m,s);}
	public DateUnit(int s) {setDateUnit(0,0,0,0,s);}
	public DateUnit() {setDateUnit(0,0,0,0,0);}
	
	private void setDateUnit(int y, int d, int h, int m, int s)
	{
		years = y;
		days = d;
		hours = h;
		minutes = m;
		seconds = s;
	}
	
	//...
	
	public String toString()
	{
		String desc = "";
		
		
		
		return desc;
	}
}