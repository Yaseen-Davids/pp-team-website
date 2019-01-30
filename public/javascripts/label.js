$(document).ready(function(){

    $(".label_main").hover(function(){

        var labelNo = $(this).data("label");

        if ($(".the_label").hasClass(labelNo)){
            var left = $(this).offset().left - 50;
            var top = $(this).offset().top + 30;
            $("."+labelNo).fadeIn("fast");
            $(".the_label").css("left", left);
            $(".the_label").css("top", top);
        }

    }, function(){
        $(".the_label").css("display", "none");
        $(".the_label").attr("style", "");
    });

    $('.label_main').mouseleave(function(){
        $(".the_label").css("display", "none");
    })
    
})