$(document).ready(function(){

    var usernameInput = $("input[name=username]"),
    emailInput = $("input[name=email]"),
    passwordInput = $("input[name=password]"),
    confirmInput = $("input[name=confPassword]"),
    passInput = $("#password"),
    submitBtn = $("button[type=submit]"),
    numbers = ["1","2","3","4","5","6","7","8","9","0"];

    function lockButton(){
        $(submitBtn).prop('disabled', true);
        $(submitBtn).css('background', '#cecece');
        console.log("LOCKED");
        console.log($(confirmInput).val())
    }
    function unlockButton(){
        $(submitBtn).prop('disabled', false);
        $(submitBtn).css('background', '#57b846');
        console.log("UNLOCKED");
    }

    $("#username").on('keyup', function() {
        if ($(this).val().length > 5){
            $(".user_error").text("");
            $(".fa-user").css("color", "green");
            if ($(".register_err_msg").text() == "" && $(usernameInput).val() != "" && $(emailInput).val() != "" && $(passwordInput).val() != "" && $(confirmInput).val() != ""){
                unlockButton();
            }
        }
        else if ($(this).val() == null || $(this).val() == "" || $(this).val().length == 0){
            $(".fa-user").css("color", "black");
            $(".user_error").text("");
        }
        else{
            $(".user_error").text("Username too short");
            $(".fa-user").css("color", "red");
            lockButton();
            return;
        }
    })

    $("#email").on('keyup', function() {
        if ($(this).val().includes("@")){
            $(".email_error").text("");
            $(".fa-envelope").css("color", "green");
            if ($(".register_err_msg").text() == "" && $(usernameInput).val() != "" && $(emailInput).val() != "" && $(passwordInput).val() != "" && $(confirmInput).val() != ""){
                unlockButton();
            }
        }
        else if ($(this).val() == null || $(this).val() == "" || $(this).val().length == 0){
            $(".fa-envelope").css("color", "black");
        }
        else{
            $(".email_error").text("Email not valid");
            $(".fa-envelope").css("color", "red");
            lockButton();
            return;
        }
    })

    $("#password").on('keyup', function() {
        if ($(this).val().length > 5 && numbers.some(substring=>$(this).val().includes(substring))){
            $(".pass_valid").text("");
            $(".lock_1").css("color", "green");
            if ($(".register_err_msg").text() == "" && $(usernameInput).val() != "" && $(emailInput).val() != "" && $(passwordInput).val() != "" && $(confirmInput).val() != ""){
                unlockButton();
            }
        }
        else if ($(this).val() == null || $(this).val() == ""){
            $(".lock_1").css("color", "black");
        }
        else if ($(this).val().length < 5){
            $(".pass_valid").text("Password is too short");
            $(".lock_1").css("color", "red");
            lockButton();
            return;
        }
        else if(numbers.some(substring=>$(this).val().includes(substring)) == false){
            $(".pass_valid").text("Passwords must contain a number");
            $(".lock_1").css("color", "red");
            lockButton();
            return;
        }
    })

    $(confirmInput).on('keyup', function() {
        if ($(passInput).val() != $(confirmInput).val()){
            $(".pass_error").text("Passwords do not match");
            $(".lock_2").css("color", "red");
            lockButton();
            return;
        }
        else if ($(passInput).val() == null || $(passInput).val() == ""){
            $(".lock_2").css("color", "black");
        }
        else{
            $(".pass_error").text("");
            $(".lock_2").css("color", "green");
            if ($(".register_err_msg").text() == "" && $(usernameInput).val() != "" && $(emailInput).val() != "" && $(passwordInput).val() != "" && $(confirmInput).val() != ""){
                unlockButton();
            }
        }
    });
    
})