window.onerror = function(msg, url, lineNo, columnNo, error) {
	let z = document.createElement('p');
	z.innerHTML += "msg: " + msg + "<br>url: " + url + "<br>lineNo: " + lineNo + "<br>columnNo: " + columnNo + "<br>error: " + error;
	document.body.append(z);
};

function getNumber(e)
{
	if(typeof e === 'string')
		return Number(document.getElementById(e).value);
}

function getInt(e)
{
	if(typeof e === 'string')
		return parseInt(document.getElementById(e).value);
}

function induce_error()
{
	sinister(420);
}

function hide(e)
{
	document.getElementById(e).options[0].style.visibility = "hidden";
}