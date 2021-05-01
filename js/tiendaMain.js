//carga el carrito de forma asyncrona, con jquery crea el  html para la tabla del carrito y administra la pantalla de carga
function crearHTMLConCarrito(carrito) {
    /*funcion que corre luego de crearse el carrito*/
    carrito.createMarket();
}
manejarPantallaDeCarga();
if (isValidHttpUrl()) {
    instanciarProductosYCarrito();
}
else {
    let carrito = new Carrito();
    $(document).ready(function () {
        crearHTMLConCarrito(carrito); 
    });
}

