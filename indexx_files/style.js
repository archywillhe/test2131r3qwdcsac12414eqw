
(function ($) {

	//var viewport = $.viewportDetect();

	Drupal.behaviors.MyStyles= {

			attach: function (context) {


				jQuery("#user-login").submit(function(e) {
				     var self = this;
				     e.preventDefault();
				     $('.navbar-brand').addClass("fadeOutLeft");
				     self.submit();
				     return true; //is superfluous, but I put it here as a fallback
				});


				if(Drupal.settings.justLoggedIn=="true"){
					$('#navigation').addClass("visibleAnim");
	  				$('#navigation').addClass("animated");
	  				$('#navigation').addClass("fadeInLeft");
				}else $('#navigation').removeClass("hiddenAnim");

				//$.viewportDetect(function (currentViewport, previousViewport) {
				  //  console.log("viewport changed from " + previousViewport+ " to " + currentViewport);
				//});
				/*window.onresize = function () {
					console.log($.viewportDetect());
				  };*/

	    	/*$(".navbar-toggle").click(function(){
	    		//alert('dinog')
	    		$("<div class='overlay'></div>").appendTo($(".content, .footer").css("position", "relative"));
	    	});*/



   }

 };})(jQuery);
