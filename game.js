var mineArea  = [];
var remainingMine;
var remainingBlock;
var gameStatus;
var begTime;
var blockEdge = 30;

$(function()
{
	$('#gamemain').mouseup(function(e)
	{
		var clickBlock = $(e.target);
		var id = clickBlock.attr('id');
		var	x = parseInt(id.substring(1, id.indexOf('-'))); 
		var	y = parseInt(id.substring(id.indexOf('-') + 1));
		if(gameStatus == 1)
		{
			if(e.which == 1)
			{
				if(clickBlock.hasClass('hidden') && !clickBlock.hasClass('flag'))
					sweepBlock(x, y);
				else if(!clickBlock.hasClass('hidden'))
				{
					sweepBlockAround(x, y);
					for(var i = x - 1; i <= x + 1; i++)
					{
						for(var j = y - 1; j <= y + 1; j++)
						{
							var block = $('#b' + i + '-' + j);
							if(block.hasClass('hint')) block.removeClass('hint');
						}
					}
				}
			}
			else if(e.which == 3 && clickBlock.hasClass('hidden'))
			{
				if(clickBlock.hasClass('flag'))
				{
					clickBlock.removeClass('flag');
					if($('#gamecheck').attr('checked')) clickBlock.addClass('check');
					remainingMine++;
					remainingBlock++;
				}
				else if(clickBlock.hasClass('check')) clickBlock.removeClass('check');
				else
				{
					clickBlock.addClass('flag');
					remainingMine--;
					remainingBlock--;
				}
				$('#gamelastnum').text(remainingMine);
			}
			if(remainingMine == remainingBlock) gameover(true);
		}
		else if(gameStatus == 2)
		{
			if(e.which == 1)
			{
				sweepBlock(x, y);
				gameStatus = 1;
				begTime = (new Date()).getTime();
				startTimer();
			}
		}
	});
	$('#gamemain').mousedown(function(e)
	{
		var clickBlock = $(e.target);
		var id = clickBlock.attr('id');
		var	x = parseInt(id.substring(1, id.indexOf('-'))); 
		var	y = parseInt(id.substring(id.indexOf('-') + 1));
		if(gameStatus == 1)
		{
			if(e.which == 1)
			{
				if(!clickBlock.hasClass('hidden'))
				{
					for(var i = x - 1; i <= x + 1; i++)
					{
						for(var j = y - 1; j <= y + 1; j++)
						{
							var block = $('#b' + i + '-' + j);
							if(block.hasClass('hidden') && !block.hasClass('flag') && !block.hasClass('check')) 
								block.addClass('hint');
						}
					}
				}
			}
		}
	});
	$('#gamemain').bind('contextmenu', function() {return false;});
	$('#gamehelp').click(function() {$(this).hide();});
});


function init(lenX, lenY, numMine)
{
	remainingBlock = lenX * lenY;
	gameStatus = 2;
	remainingMine = numMine;
	mineArea = new Array(lenX + 2);
	$.each(mineArea, function(row) {mineArea[row] = new Array(lenY + 2);});
	for(var i = 1; i <= lenX; i++)
		for(var j = 1; j <= lenY; j++)
			mineArea[i][j] = 0;
	while(numMine > 0)
	{
		var i = Math.ceil(Math.random() * lenX);
		var j = Math.ceil(Math.random() * lenY);
		if(mineArea[i][j] != -1)
		{
			mineArea[i][j] = -1;
			numMine--;
		}
	}
	for(var x = 1; x <= lenX; x++)
		for(var y = 1; y <= lenY; y++)
			if(mineArea[x][y] != -1)
				for(var i = x - 1; i <= x + 1; i++)
					for(var j = y - 1; j <= y + 1; j++)
						if(i >= 1 && i <= lenX && j >= 1 && j <= lenY && mineArea[i][j] == -1)
							mineArea[x][y]++;
	var area = '';
	for(var i = 1; i <= lenX; i++)
		for(var j = 1; j <= lenY; j++)
			area += "<div id = 'b" + i + '-' + j + 
				"' style = 'left: " + (i - 1) * blockEdge + 
				"px; top: " + (j - 1) * blockEdge + "px;' class = 'hidden'></div>";
	$('#gamemain').html(area).width(lenX * blockEdge).height(lenY * blockEdge).show();
	$('#gamewarning').html('');
	$('#gamesubmenu').show();
	$('#gamelastnum').text(remainingMine);
}

function sweepBlock(x, y)
{
	var lenX = mineArea.length - 2, lenY = mineArea[0].length - 2;
	var block = $('#b' + x + '-' + y);
	if(mineArea[x][y] == -1)
	{
		switch(gameStatus)
		{
		case 1:
			block.addClass('bomb');
			gameover(false);
			break;
		case 2:
			init(lenX, lenY, remainingMine);
			sweepBlock(x, y);
			break;
		default:
			if(!block.hasClass('flag')) block.addClass('bomb');
			break;
		}
	}
	else if(mineArea[x][y] >= 0)
	{
		if(gameStatus == 2 && mineArea[x][y] != 0)
		{
			init(lenX, lenY, remainingMine);
			sweepBlock(x, y);
			return;
		}
		if(block.hasClass('flag'))
		{
			block.addClass('wrong');
			if(gameStatus == 1) gameover(false);
		}
		else if(mineArea[x][y] > 0)
		{
			block.html(mineArea[x][y]).addClass('num' + mineArea[x][y])
				.addClass('clear').removeClass('hidden');
			if(block.hasClass('check')) block.removeClass('check');
			if(gameStatus == 1) remainingBlock--;
		}
		else
		{
			block.addClass('clear').removeClass('hidden');
			if(block.hasClass('check')) block.removeClass('check');
			if(gameStatus == 1 || gameStatus == 2)
			{
				gameStatus = 1;
				remainingBlock--;
				for(var i = x - 1; i <= x + 1; i++)
					for(var j = y - 1; j <= y + 1; j++)
						if(i >= 1 && i <= lenX &&
							j >= 1 && j <= lenY &&
							$('#b' + i + '-' + j).hasClass('hidden'))
							sweepBlock(i, j);
			}
		}
	}
}

function sweepBlockAround(x, y)
{
	var numFlag = 0, numHidden = 0;
	for(var i = x - 1; i <= x + 1; i++)
	{
		for(var j = y - 1; j <= y + 1; j++)
		{
			if(mineArea[i][j] != undefined)
			{
				var blockId = '#b' + i + '-' + j;
				if($(blockId).hasClass('flag')) numFlag++;
				if($(blockId).hasClass('hidden')) numHidden++;
			}
		}
	}
	if(numFlag == mineArea[x][y] && numHidden > numFlag)
	{
		for(var i = x - 1; i <= x + 1; i++)
		{
			for(var j = y - 1; j <= y + 1; j++)
			{
				var blockId = '#b' + i + '-' + j;
				if(mineArea[i][j] >= 0 && $(blockId).hasClass('hidden'))
					sweepBlock(i, j);
			}
		}
	}
}

function startTimer()
{
	if(gameStatus == 1)
	{
		var timeNow = (new Date()).getTime();
		$('#gametime').text(Math.ceil((timeNow - begTime) / 1000));
		setTimeout('startTimer()', 500);
	} 
	else if(gameStatus == 2) $('#gametime').text('0');
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
				if($(blockId).hasClass('hidden') && !$(blockId).hasClass('flag'))
					$(blockId).addClass('flag');
			}
			else sweepBlock(i, j);
		}
	}
	$('#gamewarning').text(win ? 'Congratulation! You win!' : 'Sorry, you lose.');
}