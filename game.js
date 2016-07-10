var mineArea;
var remainingMine;
var remainingBlock;
var gameStatus;
//0: gameover; 
//1: running in normal mode
//2: after initializing but before running in normal mode
//3: running in loop mode
//4: after initializing but before running in loop mode
var begTime;
var blockEdge = 30;
var lastX, lastY;
var dragging = false;


$(function()
{
	$('#gamemain').mouseup(function(e)
	{
		dragging = false;
		var clickBlock = $(e.target);
		var id = clickBlock.attr('id');
		var	x = parseInt(id.substring(1, id.indexOf('-'))); 
		var	y = parseInt(id.substring(id.indexOf('-') + 1));
		if(gameStatus == 1 || gameStatus == 3)
		{
			var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
			if(e.which == 1)
			{
				if(clickBlock.hasClass('hidden'))
				{
					gameStatus == 1 ? sweepBlock(x, y) : sweepBlockLoop(x, y);
				}
				else if(!clickBlock.hasClass('flag'))
				{
					gameStatus == 1 ? sweepBlockAround(x, y) : sweepBlockAroundLoop(x, y);
					for(var i = x - 1; i <= x + 1; i++)
					{
						for(var j = y - 1; j <= y + 1; j++)
						{
							if(gameStatus == 1)
							{
								var block = $('#b' + i + '-' + j);
								if(block.hasClass('hint')) block.removeClass('hint');
							}
							else
							{
								var ii = i < 1 ? lenX : (i > lenX ? 1 : i);
								var jj = j < 1 ? lenY : (j > lenY ? 1 : j);
								var block = $('#b' + ii + '-' + jj);
								if(block.hasClass('hint')) block.removeClass('hint');
							}
						}
					}
				}
			}
			else if(e.which == 3 && (clickBlock.hasClass('hidden') || clickBlock.hasClass('flag')))
			{
				if(clickBlock.hasClass('flag'))
				{
					clickBlock.removeClass('flag');
					clickBlock.addClass('hidden');
					remainingMine++;
					remainingBlock++;
				}
				else
				{
					clickBlock.removeClass('hidden');
					clickBlock.addClass('flag');
					remainingMine--;
					remainingBlock--;
				}
				$('#gamelastnum').text(remainingMine);
			}
			if(remainingMine == remainingBlock) gameover(true);
		}
		else if(gameStatus == 2 || gameStatus == 4)
		{
			if(e.which == 1)
			{
				gameStatus == 2 ? sweepBlock(x, y) : sweepBlockLoop(x, y);
				begTime = (new Date()).getTime();
				startTimer();
			}
		}
	});
	$('#gamemain').mousedown(function(e)
	{
		if(gameStatus == 1 || gameStatus == 3)
		{
			var clickBlock = $(e.target);
			var id = clickBlock.attr('id');
			var	x = parseInt(id.substring(1, id.indexOf('-'))); 
			var	y = parseInt(id.substring(id.indexOf('-') + 1));
			lastX = x, lastY = y;
			dragging = true;
			if(e.which == 1)
			{
				var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
				if(!clickBlock.hasClass('hidden'))
				{
					for(var i = x - 1; i <= x + 1; i++)
					{
						for(var j = y - 1; j <= y + 1; j++)
						{
							if(gameStatus == 1)
							{
								var block = $('#b' + i + '-' + j);
								if(block.hasClass('hidden')) block.addClass('hint');
							}
							else
							{
								var ii = i < 1 ? lenX : (i > lenX ? 1 : i);
								var jj = j < 1 ? lenY : (j > lenY ? 1 : j);
								var block = $('#b' + ii + '-' + jj);
								if(block.hasClass('hidden')) block.addClass('hint');
							}
						}
					}
				}
			}
		}
	});
	$('#gamemain').mousemove(function(e)
	{
		if(dragging == true && gameStatus == 3)
		{
			var clickBlock = $(e.target);
			var id = clickBlock.attr('id');
			var	x = parseInt(id.substring(1, id.indexOf('-'))); 
			var	y = parseInt(id.substring(id.indexOf('-') + 1));
			var dict = {x: x - lastX, y: y - lastY};
			lastX = x, lastY = y;
			moveMineArea(dict);
		}
	});
	$('body').keydown(function(e)
	{
		if(gameStatus == 3)
		{
			var key = String.fromCharCode(e.which);
			var dict = {x: 0, y: 0};
			switch(key)
			{
			case 'W':
				dict.y = -1;
				break;
			case 'A':
				dict.x = -1;
				break;
			case 'S':
				dict.y = 1;
				break;
			case 'D':
				dict.x = 1;
				break;
			}
			moveMineArea(dict);
		}
	});
	$('#gamemain').bind('contextmenu', function() {return false;});
});

function moveMineArea(dict)
{
	if(dict.x == 0 && dict.y == 0) return;
	var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
	var temArea = new Array(lenX + 2);
	$.each(temArea, function(row) {temArea[row] = new Array(lenY + 2);});
	for(var i = 1; i <= lenX; i++)
	{
		for(var j = 1; j <= lenY; j++)
		{
			var ii = (i + dict.x - 1 + lenX) % lenX + 1;
			var jj = (j + dict.y - 1 + lenY) % lenY + 1;
			temArea[ii][jj] = mineArea[i][j];
		}
	}
	delete mineArea;
	mineArea = temArea;
	var area = '';
	for(var i = 1; i <= lenX; i++)
	{
		for(var j = 1; j <= lenY; j++)
		{
			var ii = (i - dict.x - 1 + lenX) % lenX + 1;
			var jj = (j - dict.y - 1 + lenY) % lenY + 1;
			var block = $('#b' + ii + '-' + jj);
			var number = '';
			if(block.attr('class').indexOf('num') != -1) 
				number = block.attr('class')[3];
			debugger;
			area += "<div id = 'b" + i + '-' + j + 
				"' style = 'left: " + (i - 1) * blockEdge + 
				"px; top: " + (j - 1) * blockEdge + "px;' class = '" + block.attr('class') +
				 "'>" + number + "</div>";
		}
	}
	$('#gamemain').html(area).width(lenX * blockEdge).height(lenY * blockEdge).show();
}

function startTimer()
{
	if(gameStatus == 1 || gameStatus == 3)
	{
		var timeNow = (new Date()).getTime();
		$('#gametime').text(Math.ceil((timeNow - begTime) / 1000));
		setTimeout('startTimer()', 500);
	} 
	else if(gameStatus == 2 || gameStatus == 4) $('#gametime').text('0');
}

function gameover(win)
{
	var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
	gameStatus = 0;
	if(win)
	{
		remainingMine = 0;
		$('#gamelastnum').text(remainingMine);
	}
	for(var i = 1; i <= lenX; i++)
	{
		for(var j = 1; j <= lenY; j++)
		{
			if(win)
			{
				var blockId = '#b' + i + '-' + j;
				if($(blockId).hasClass('hidden'))
				{
					$(blockId).removeClass('hidden');
					$(blockId).addClass('flag');
				}
			}
			else sweepBlock(i, j);
		}
	}
	$('#gamewarning').text(win ? 'Congratulation! You win!' : 'Sorry, you lose.');
}