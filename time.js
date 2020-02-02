"use strict";

// Plan: new TimeUnit(5).add(30).val() = 35 seconds

const MONTH = {
	JANUARY:
	{
		id: 1,
		days: 31
	},
	FEBRUARY:
	{
		id: 2,
		days: 28
	},
	MARCH:
	{
		id: 3,
		days: 31
	},
	APRIL:
	{
		id: 4,
		days: 30
	},
	MAY:
	{
		id: 5,
		days: 31
	},
	JUNE:
	{
		id: 6,
		days: 30
	},
	JULY:
	{
		id: 7,
		days: 31
	},
	AUGUST:
	{
		id: 8,
		days: 31
	},
	SEPTEMBER:
	{
		id: 9,
		days: 30
	},
	OCTOBER:
	{
		id: 10,
		days: 31
	},
	NOVEMBER:
	{
		id: 11,
		days: 30
	},
	DECEMBER:
	{
		id: 12,
		days: 31
	}
};

function getDays(month, isLeapYear = false)
{
	for(let m in MONTH)
	{
		if(isLeapYear && month === MONTH.FEBRUARY.id)
			return 29;
		else if(month === MONTH[m].id)
			return MONTH[m].days;
	}
}

// Rudimentary TimeUnit that tracks days and calculates upwards from there. Starts at 2020-01-01.
class TimeUnitMacro
{
	constructor(offset = 0)
	{
		this.year = 2020;
		this.month = MONTH.JANUARY.id;
		this.day = 1;
		this.addDays(offset);
	}
	
	addDays(amount = 1)
	{
		this.day += amount;
		
		if(this.day > getDays(this.month, isLeapYear(this.year)))
		{
			// Complications of adding multiple months-worth of days
			this.day %= getDays(this.month, isLeapYear(this.year));
			this.month++;
		}
	}
}

class TimeUnitMicro
{
	
}

class TimeUnitMacroIndefinite
{
	
}

class TimeUnitMicroIndefinite
{
	
}

function isLeapYear(year)
{
	if(isType(year, Number))
		return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/*
There has to be some methodology to what day of the week any given day falls on based on the year. Using my birthday as an example:
- December 9, 1999: Thursday
- Skip a day?
- December 9, 2000: Saturday
- December 9, 2001: Sunday
- December 9, 2002: Monday
- December 9, 2003: Tuesday
- Skip a day?
- December 9, 2004: Thursday
- December 9, 2005: Friday
- December 9, 2006: Saturday
- December 9, 2007: Sunday
- Skip a day?
- December 9, 2008: Tuesday
- December 9, 2009: Wednesday
- December 9, 2010: Thursday
- December 9, 2011: Friday
- Skip a day?
- December 9, 2012: Sunday
- December 9, 2013: Monday
- December 9, 2014: Tuesday
- December 9, 2015: Wednesday
- Skip a day?
- December 9, 2016: Friday
- December 9, 2017: Saturday
- December 9, 2018: Sunday
- December 9, 2019: Monday
- Skip a day?
- December 9, 2020: Wednesday
*/
function getLeapYearOffset(idk)
{
	// ...
}