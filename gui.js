var mode = 0;

$(document).ready(function()
{
	$("#classic").click(function()
	{
		change_mode(0);
	});
	$("#loop").click(function()
	{
		change_mode(1);
	});
	$("#easy").click(function()
	{
		if(mode == 0)
		{
			init(10, 10, 10);
			adjust(10, 10);
		}
		if(mode == 1)
		{
			initLoop(10, 10, 10);
			adjust(10, 10);
		}
	});
	$("#normal").click(function()
	{
		if(mode == 0)
		{
			init(16, 16, 40);
			adjust(16, 16);
		}
		if(mode == 1)
		{
			initLoop(16, 16, 40);
			adjust(16, 16);
		}
	});
	$("#hard").click(function()
	{
		if(mode == 0)
		{
			init(30, 16, 99);
			adjust(30, 16);
		}
		if(mode == 1)
		{
			initLoop(30, 16, 99);
			adjust(30, 16);
		}
	});
	$("#custom").click(function()
	{
		$("#option").slideToggle("slow");
	});
	$("#start").click(function()
	{
		custom_init();
	});
	$("#help").click(function()
	{
		$("#gamehelp").slideToggle("slow");
	});
});

function change_mode(m)
{
	mode = m;
	if(m == 0)
	{
		$("#classic").css("border-color", "#000000");
		$("#loop").css("border-color", "#045000");
	}
	else
	{
		$("#classic").css("border-color", "#045000");
		$("#loop").css("border-color", "#000000");
	}
}

function custom_init()
{
	var x = $("#widthnum").attr("value") - 0;
	var y = $("#heightnum").attr("value") - 0;
	var m = $("#minenum").attr("value") - 0;
	if(x < 5)
	{
		x = 5;
	}
	if(y < 5)
	{
		y = 5;
	}
	if(y > x)
	{
		var temp = y;
		y = x;
		x = temp;
	}
	if(m < x * y * 0.05)
	{
		m = Math.ceil(y * x * 0.05);
	}
	if(m > x * y * 0.3)
	{
		m = Math.floor(y * x * 0.3);
	}
	$("#widthnum").attr("value", x);
	$("#heightnum").attr("value", y);
	$("#minenum").attr("value", m);
	
	if(mode == 0)
	{
		init(x, y, m);
		adjust(x, y);
	}
	if(mode == 1)
	{
		initLoop(x, y, m);
		adjust(x, y);
	}
}

function adjust(x, y)
{
	var r = get_rate(x, y);
	$("#gamemain")[0].style.webkitTransform = "scale(" + r + ")";
	$('html, body').animate(
		{scrollTop: ($(document).height() - $(window).height())}, 'slow'
	);
	$('#gametime').text('0');
}

function get_rate(x, y)
{
	var width = $(window).width();
	var height = $(window).height();
	var rate = 1;
	if(x * 30 > width * 0.95)
	{
		rate = 1;
	}
	else if(y * 30 < height * 0.7)
	{
		rate = height * 0.7 / (y * 30);
		if(rate > 5/3)
		{
			rate = 5/3;
		}
		if(x * 30 * rate > width * 0.95)
		{
			rate = width * 0.95 / (x * 30);
		}
	}
	return rate;
}