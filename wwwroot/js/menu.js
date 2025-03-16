isMenuOpen = false;
function menuToggle()
{
	menu = $('.menu');
	if (!isMenuOpen)
	{
		menu.addClass('active');
	}
	else
	{
		menu.removeClass('active');
	}
	isMenuOpen = !isMenuOpen;
}