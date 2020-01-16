"use strict";

window.onerror = function(msg, url, lineNo, columnNo, error)
{
	let e = document.createElement('p');
	e.innerHTML = `<span class="error">Message:</span> <span class="errormsg">${msg}</span><br><span class="error">Error:</span> <span class="errormsg">${error}</span><br><span class="error">Location:</span> <span class="errormsg">${url}</span><br><span class="error">Line:</span> <span class="errormsg">${lineNo}</span> <span class="error">Column:</span> <span class="errormsg">${columnNo}</span>`;
	document.getElementById('errors') ? document.getElementById('errors').append(e) : document.body.append(e);
	document.getElementById('error_header').hidden = false;
};

///////////
// Usage //
///////////
// let block = new Block(input);
// block[0][0].val(7);
class Block
{
	constructor(block)
	{
		if(block)
		{
			this.block = block;
			
			for(let i = 0; i < block.children.length; i++)
				this[i] = new Block(block.children[i]);
		}
	}
	
	val(value)
	{
		if(this.block)
		{
			if(this.block.nodeName === 'INPUT')
			{
				if(this.block.type === 'text')
				{
					if(value && value.constructor === String)
					{
						let old = this.block.value;
						this.block.value = value;
						return old;
					}
					else
						return this.block.value;
				}
				else if(this.block.type === 'number')
				{
					if(value && value.constructor === Number)
					{
						let old = Number(this.block.value);
						this.block.value = value;
						return old;
					}
					else
						return Number(this.block.value);
				}
				else if(this.block.type === 'checkbox')
				{
					if(value !== undefined && value.constructor === Boolean)
					{
						let old = this.block.checked;
						this.block.checked = value;
						return old;
					}
					else
						return this.block.checked;
				}
			}
			else if(this.block.nodeName === 'SPAN')
			{
				if(value)
				{
					let old = this.block.innerHTML;
					this.block.innerHTML = value;
					return old;
				}
				else
					return this.block.innerHTML;
			}
		}
	}
}