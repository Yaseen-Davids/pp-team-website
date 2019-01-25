$(document).ready(function(){

    $(".modal_btn").on('click', function(){

        var modalNo = $(this).data("modal");

        // OPEN MODAL BOX
        if ($(".modal_wrapper").hasClass(modalNo)){
            modalClass = "." + modalNo
            $(modalClass).fadeIn("fast");
        }

        var confirmDelete = $(this).attr("data-delete");
        var confirmAdmin = $(this).attr("data-confirm");
        var id = $(this).attr("data-id")

        $("#delete_button").addClass(confirmDelete);
        $("#delete_button").attr("data-id", id);

        $("#confirm_button").addClass(confirmAdmin);
        $("#confirm_button").attr("data-id", id);

    })

    // CLOSE MODAL BOX
    $(".close_modal").on('click', function(){

        if ($("#delete_button").attr("class") != undefined || $("#confirm_button").attr("class") != undefined){
            var deleteClass = $("#delete_button")[0].className;

            $("#delete_button").removeClass(deleteClass);
            $("#delete_button").attr("data-id", "");

            var confirmClass = $("#confirm_button")[0].className;

            $("#confirm_button").removeClass(confirmClass);
            $("#confirm_button").attr("data-id", "");

            $(modalClass).fadeOut("fast");
        }

        else{
            $(modalClass).fadeOut("fast");
        }

    })

})