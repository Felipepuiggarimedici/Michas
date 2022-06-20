/*Archivo que almacenara los productos disponibles con sus respectivos nombres,precios, codigos y nombres de las imagenes
    Si se quiere agregar productos en el futuro o si se quiere remover productos, se podrá editar este archivo directamente
    Se usa en el caso de que no se este utilizando liveServer*/

const productos = [
    {nombre: "Cheesecake", precio: 100, codigoDeProducto: 0, imagen: "cheesecake.jpg"},
    {nombre: "Torta de crema pastelera", precio: 120, codigoDeProducto: 1, imagen: "pastelera.jpg"},
    {nombre: "Crumble de manzana", precio: 130, codigoDeProducto: 2, imagen: "appleCrumble.jpg"}];

function guardarProductosDisponibles() {
    let productosString = JSON.stringify(productos);
    localStorage.setItem("productos", productosString);
}
function actualizarListaDeProductosDisponibles(productosEnStorage) {

    if (productos.length != productosEnStorage.length) {
        guardarProductosDisponibles();
        return JSON.parse(localStorage.getItem("productos"));
    }
    else {
        return productosEnStorage;
    }
}
function instanciarProductosSinJSON() {
    let listaDeProductos = [];
    let productosEnStorage;
    //Si tira un error, es porque nunca se guardaron los productos en el JSON.
    try {
        productosEnStorage = JSON.parse(localStorage.getItem("productos"));
        productosEnStorage = actualizarListaDeProductosDisponibles(productosEnStorage);
    }
    catch {
        guardarProductosDisponibles();
        productosEnStorage = JSON.parse(localStorage.getItem("productos"));
        productosEnStorage = actualizarListaDeProductosDisponibles(productosEnStorage);
    }
    for (let i = 0; i < productosEnStorage.length; i++) {
        listaDeProductos.push(new Productos(productosEnStorage[i].nombre, productosEnStorage[i].precio, productosEnStorage[i].codigoDeProducto, productosEnStorage[i].imagen, productosEnStorage[i].textoDescriptivo));
    }
    return listaDeProductos;
}