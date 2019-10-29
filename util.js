function hide(e)
{
	document.getElementById(e).options[0].style.visibility = "hidden";
}

function induce_error()
{
	sinister(420);
}

window.onerror = function(msg, url, lineNo, columnNo, error) {
	let z = document.createElement('p');
	z.innerHTML += "msg: " + msg + "<br>url: " + url + "<br>lineNo: " + lineNo + "<br>columnNo: " + columnNo + "<br>error: " + error;
	document.body.append(z);
};