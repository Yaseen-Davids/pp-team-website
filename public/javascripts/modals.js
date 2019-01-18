$(document).ready(function(){

    $(".modal_btn").on('click', function(){

        var modalNo = $(this).data("modal");

        // OPEN MODAL BOX
        if ($(".modal_wrapper").hasClass(modalNo)){
            modalClass = "." + modalNo
            $(modalClass).fadeIn("fast");
        }

        var confirm = $(this).data("delete");
        var id = $(this).attr("data-id")

        $("#delete_button").addClass(confirm);
        $("#delete_button").attr("data-id", id);

    })

    // CLOSE MODAL BOX
    $(".close_modal").on('click', function(){

        var theClass = $("#delete_button")[0].className;

        $("#delete_button").removeClass(theClass);
        $("#delete_button").attr("data-id", "");

        $(modalClass).fadeOut("fast");
    })

})