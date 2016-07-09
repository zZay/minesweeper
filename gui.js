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
		$('#gamehelp').show();
	});
});

function custom_init()
{
	var x = $("#widthnum").attr("value") - 0;
	var y = $("#heightnum").attr("value") - 0;
	var m = $("#minenum").attr("value") - 0;
	//some judgements
	init(10, 10, 10);
	scroll2bottom();
}

function scroll2bottom()
{
	$('html, body').animate(
		{scrollTop: ($(document).height() - $(window).height())}, 'slow'
	);
}