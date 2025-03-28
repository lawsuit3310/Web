//여기에 ISIN 저장
stock_context = "";
ShowInfo = async (x, type = "") => {}
$('.index').on('click', function() {ContextSwitch('.stock_home'); console.log(true)});

function ContextSwitch(context)
{
	$('.content').css("height", "auto");
	
	$('.footer').removeClass('active');
	
	var contexts = $(".context");
		for (i = 0; i < contexts.length; i++)
		{
			//contexts[i].style.opacity = '0%';
			contexts[i].classList.remove("active");
		}
		setTimeout ( x =>
		{
			var contexts = $(".context");
			for (i = 0; i < contexts.length; i++)
			{
				contexts[i].classList.remove("active");
			}
			$(x).addClass("active");
			
			//setTimeout( x => {$(x).css("opacity", "100%");}, 100, x);
		}, 1, context);
}