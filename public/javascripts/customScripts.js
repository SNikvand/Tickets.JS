function passwordCheck(){
    if ($('#cpassword').val() != $('#password').val()) {
        $("#passwordnotmatch").show();
    }
    else{
        $("#passwordnotmatch").hide();
    }

}

function permission(){
    $(".dropdown-menu li a").click(function(){
        $(".btn:first-child").text($(this).text());
        $(".btn:first-child").val($(this).text());
        if ($(this).text() == 'Administrator') {
            $("#depart").hide("slow");
            $("#admintext").show();
        }
        else {
            $("#depart").show();
            $("#admintext").hide("slow");
        }
    });
}