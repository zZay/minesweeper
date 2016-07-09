$(document).ready(function()
{
	$("#easy").click(function()
	{
		init(10, 10, 10);
		scroll2bottom();
	});
	$("#normal").click(function()
	{
		init(16, 16, 40);
		scroll2bottom();
	});
	$("#hard").click(function()
	{
		init(30, 16, 99);
		scroll2bottom();
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

function custom_init()
{
	var x = $("#heightnum").attr("value") - 0;
	var y = $("#widthnum").attr("value") - 0;
	var m = $("#minenum").attr("value") - 0;
	if(x < 5)
		x = 5;
	if(y < 5)
		y = 5;
	if(m < x * y * 0.05)
		m = Math.ceil(x * y * 0.05);
	if(m > x * y * 0.3)
		m = Math.floor(x * y * 0.3);
	
	init(x, y, m);
	scroll2bottom();
}

function scroll2bottom()
{
	$('html, body').animate(
		{scrollTop: ($(document).height() - $(window).height())}, 'slow'
	);
}