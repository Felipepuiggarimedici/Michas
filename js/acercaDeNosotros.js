window.addEventListener("load", function() {
    $(".pantallaDeCarga").fadeOut("slow");
    $("body").removeClass("preload");
})
$(".botonParaIrATienda").click(function () {
    location.href = "tienda.html";
});