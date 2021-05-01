function crearHtmlParaPaginaDeProducto(productoExpandido, carrito) {
    $(".tituloEnProducto").append(`<h1>${productoExpandido.nombre}</h1>`);
    $(".cantidadDeProductoEnCarrito").addClass(`cantidadDeProducto${productoExpandido.codigoDeProducto}EnCarrito`);
    productoExpandido.assignQuantityOfEachProduct(carrito);
    $(".containerDeImagenDeProducto").append(`<img src="../imagenes/${productoExpandido.imagen}" class="imagenDeProductos">`);
    $(".botonParaAgregarAlCarrito").addClass(`botonParaAgregarAlCarritoProducto${productoExpandido.codigoDeProducto}`);
    $(".botonParaRemoverDelCarrito").addClass(`botonParaRemoverDelCarritoProducto${productoExpandido.codigoDeProducto}`);
    $(".precioEnProductoExpandido").append(`<p class="textoClaro">${productoExpandido.precio}$</p>`);
    $(".botonParaVolverATienda").click(function(){
        window.location.replace("tienda.html"); 
    });
}
function crearHTMLConCarrito(carrito) {
    let productoExpandido = JSON.parse(localStorage.getItem("productoExpandido"));
    productoExpandido = new Productos(productoExpandido.nombre, productoExpandido.precio, productoExpandido.codigoDeProducto, productoExpandido.imagen);
    crearHtmlParaPaginaDeProducto(productoExpandido, carrito);
    carrito.initializeButtonOfProductPurchase();
    carrito.initializeButtonsOfProductRemoval();
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


