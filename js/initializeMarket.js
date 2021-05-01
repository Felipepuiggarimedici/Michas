/*Crea el carrito, con sus metodos y la clase productos*/

class Productos {
    constructor(nombre, precio, codigoDeProducto, imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.codigoDeProducto = codigoDeProducto;
        this.imagen = imagen;
    }
    initializeButtonsOfProductPurchase(carrito) {
        let productoActual = this;
        $(`.botonParaAgregarAlCarritoProducto${productoActual.codigoDeProducto}`).click(function(){
            carrito.anadirProducto(productoActual.codigoDeProducto);
            let cantidadAnteriorDeProducto = parseInt($(`.cantidadDeProducto${productoActual.codigoDeProducto}EnCarrito`).text());
            $(`.cantidadDeProducto${productoActual.codigoDeProducto}EnCarrito`).html(cantidadAnteriorDeProducto + 1);
            carrito.crearAnimacionEnBannerEnTienda(`${productoActual.nombre} agregada al carrito`);                  
        });                   
    }
    initializeButtonsOfProductRemoval(carrito) {
        let productoActual = this;
        $(`.botonParaRemoverDelCarritoProducto${productoActual.codigoDeProducto}`).click(function(){
            let cantidadAnteriorDeProducto = parseInt($(`.cantidadDeProducto${productoActual.codigoDeProducto}EnCarrito`).text());
            if (cantidadAnteriorDeProducto == 0) {
                carrito.crearAnimacionEnBannerEnTienda("No tienes este producto en el carrito");
            }
            else {
                carrito.removerProducto(productoActual.codigoDeProducto);
                $(`.cantidadDeProducto${productoActual.codigoDeProducto}EnCarrito`).html(cantidadAnteriorDeProducto - 1);
                carrito.crearAnimacionEnBannerEnTienda(`${productoActual.nombre} quitada/o del carrito`);
            }
        });
    }
    initializeButtonsOfExpandEnTienda() {
        let productoActual = this;
        $("#botonParaVerDetallesDeProducto" + productoActual.codigoDeProducto).click(function(){
            window.location.replace("productos.html"); 
            localStorage.setItem("productoExpandido", JSON.stringify(productoActual));                       
        });
    }
    assignQuantityOfEachProduct(carrito) {
        let productoActual = this;
        let display = carrito.getListToDisplay();
        let quantityOfProduct;
        //truco para extraer la parte numerica del texto
        quantityOfProduct = display[productoActual.codigoDeProducto].match(/\d+/)[0];
        $(`.cantidadDeProducto${productoActual.codigoDeProducto}EnCarrito`).html(quantityOfProduct);
    }
    initializeButtonsOfProductsEnCarrito(carrito) {
        let productoActual = this;
        let cantidadDeProductoActual;
        let anteriorTotalAPagar;
        $("#botonEnCarritoParaRemoverProducto" + productoActual.codigoDeProducto).click(function() {
            carrito.removerProducto(productoActual.codigoDeProducto);
            cantidadDeProductoActual = $(`#cantidadCompradaDeProducto${productoActual.codigoDeProducto}`).text();
            if (cantidadDeProductoActual == 1) {
                $(`#productoDeCodigo${productoActual.codigoDeProducto}EnCarrito`).remove();
            }
            else {
                $(`#cantidadCompradaDeProducto${productoActual.codigoDeProducto}`).html(cantidadDeProductoActual - 1);
            }
            anteriorTotalAPagar = $("#casillaParaTotalAPagarPrecio").text().match(/\d+/)[0];
            $("#casillaParaTotalAPagarPrecio").html(anteriorTotalAPagar - productoActual.precio + "$")
            if(carrito.elementosSeleccionados == 0) {
                $("tbody").append(`<tr>
                                    <th class="border-0">
                                        <div class="p-2">
                                            <div class="ml-3 d-inline-block align-middle">
                                                <h5 class="mb-0">El carrito está vacío</h5>
                                            </div>
                                        </div>
                                    </th>
                                </tr>`);
                $("#seccionDeForm").fadeOut();
            }
        });
    }
    getImageFile() {
        return "imagenes/" + this.imagen;
    }
}

class Carrito {
    constructor(listaDeProductos) {
        this.lista = [];
        this.costoTotal = 0;
        this.elementosSeleccionados = 0;

        /*Esta lista debe coincidir en terminos de orden con el codigo de cada producto*/
        /*Esta lista debe coincidir en terminos de orden con el codigo de cada producto*/
        if(isValidHttpUrl()) {
            this.tiposDeProductosDisponibles = listaDeProductos;
        }
        else {
            this.tiposDeProductosDisponibles = instanciarProductosSinJSON();
        }
        this.reestablecerCarrito();
        this.createBannerForCarrito();
        this.precioTotal = 0;
        this.productosDisponibles = this.tiposDeProductosDisponibles.length;
    }

    reestablecerCarrito() {
        /*Reestablece los productos comprados previamente en el localstorage*/
        let listaAsString = localStorage.getItem("Lista de productos");
        let listaDesarmada = JSON.parse(listaAsString);
        if (listaDesarmada == null) {
            return;
        }
        for (var obj of listaDesarmada) {
            this.anadirProducto(obj.codigoDeProducto, true);
        }
    }

    anadirProducto(codigo, reestableciendo = false) {
        this.lista.push(Object.assign(this.tiposDeProductosDisponibles[codigo]));
        this.elementosSeleccionados++;

        if (!reestableciendo) {
            let carritoAsString = JSON.stringify(this.lista);
            localStorage.setItem("Lista de productos", carritoAsString);
        }
    }

    removerProducto(codigo) {
        //Remueve un producto del carrito segun el codigo insertado. Si el producto con este codigo no esta en el carrito se retorna -1//
        let elementosAntesDeRemover = this.elementosSeleccionados;
        for (var i = 0; i < this.elementosSeleccionados; i++) {
            if (this.lista[i].codigoDeProducto == codigo) {
                this.lista.splice(i, 1);
                this.elementosSeleccionados -= 1;
                let carritoAsString = JSON.stringify(this.lista);
                localStorage.setItem("Lista de productos", carritoAsString);
                break;
            }
        }
        if (elementosAntesDeRemover == this.elementosSeleccionados) {
            return -1;
        }
    }

    getListToDisplay () {
        let display = [];
        let currentItemToAppend;
        let quantityOfCurrentItems;
        
        for (let i = 0; i < this.tiposDeProductosDisponibles.length; i++) {
            quantityOfCurrentItems = 1;
            currentItemToAppend = this.tiposDeProductosDisponibles[i].nombre + " (0)";
            for (let z = 0; z < this.lista.length; z++) {
                if (this.lista[z].nombre == this.tiposDeProductosDisponibles[i].nombre){
                    currentItemToAppend = currentItemToAppend.substring(0, currentItemToAppend.length - 2 - getLength(quantityOfCurrentItems -1)) + "(" + quantityOfCurrentItems + ")";
                    quantityOfCurrentItems++;
                }
            }
            display.push(currentItemToAppend)
        }
        return display;
    }

    getProductCodes () {
        let mensaje = "";
        for (let obj of this.tiposDeProductosDisponibles) {
            mensaje += (obj.codigoDeProducto) + " para " + obj.nombre + "\n";
        }
        return mensaje;
    }

    createBannerForCarrito(){
        //Creará una alerta debajo del link al carrito avisando que el usuario tiene items en el carrito (en caso de que los tenga) y retornara -1 si el aviso no es compatible con el html de la pagina actual
        if (this.elementosSeleccionados != 0){
            $(".bannerDeComprasEnElCarrito").slideDown();
        }
    }

    createMarket(){
        //Creará el codigo de html para cada producto presente en el mercado
        let main = $("main");
        let agregarAlCarrito = [];

        for (var producto of this.tiposDeProductosDisponibles) {
            this.createHtmlForMarket(producto, main, agregarAlCarrito)
        }
        this.initializeButtonOfProductPurchase();
        this.initializeButtonOfExpandEnTienda();
        this.initializeButtonsOfProductRemoval();
        this.assignQuantityOfEachProduct();
    }
    
    createHtmlForMarket(producto) {

        //Separa por clases dependiendo si va a estar en la columna 1 o en la 2 el producto
        let claseDeSeccion;
        if ((producto.codigoDeProducto + 1)%2 != 0) {
            claseDeSeccion = "productosColumna1";
        }
        else {
            claseDeSeccion = "productosColumna2";
        }
        $("#productos").append(`<section id="sectionOfProducto${producto.codigoDeProducto}" class="containerDeCartaDeProducto container-fluid ${claseDeSeccion}"> 
                                    <div class="card cartaDeProducto"> 
                                        <div class="containerDeImagenEnTienda">
                                            <img class="productoImagenEnTienda img-thumbnail" src="../${producto.getImageFile()}">
                                        </div>
                                        <div class="containerDeBotonParaExpandirProducto">
                                            <button id="botonParaVerDetallesDeProducto${producto.codigoDeProducto}" class="btn px-auto botonParaVerDetallesDelProducto"><i class="bi bi-arrows-angle-expand"></i></button>
                                        </div>
                                        <div id="contenidoDeTarjetaDe${producto.codigoDeProducto}" class="containerDeTextoEnTarjeta card-body text-center">
                                            <div class="containerDeNombreDeProducto">
                                                <h3 class="card-title font-weight-bold productoNombreEnTienda">${producto.nombre}</h3>
                                            </div> 
                                            <p class="card-text prouctoPrecioEnTienda"> ${producto.precio}$</p>
                                            <div class="containerDeBotonesParaCompra">
                                                <div class="blankSpace"></div>
                                                <button class="btn botonParaEditarCarrito px-auto botonParaAgregarAlCarrito botonParaAgregarAlCarritoProducto${producto.codigoDeProducto}"><i class="bi bi-cart-plus"></i></button>
                                                <div class="containerDeCantidadDeProductoEnCarrito">
                                                    <p class="cantidadDeProductoEnCarrito cantidadDeProducto${producto.codigoDeProducto}EnCarrito"></p>
                                                </div>
                                                <button class="btn botonParaEditarCarrito px-auto botonParaRemoverDelCarrito botonParaRemoverDelCarritoProducto${producto.codigoDeProducto}"><i class="bi bi-cart-x"></i></button>
                                                <div class="blankSpace"></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>`);
    }
    initializeButtonOfProductPurchase() {
        for (let obj of this.tiposDeProductosDisponibles) {
            obj.initializeButtonsOfProductPurchase(this);
        }
    }
    assignQuantityOfEachProduct() {
        for (let obj of this.tiposDeProductosDisponibles) {
            obj.assignQuantityOfEachProduct(this);
        }
    }
    initializeButtonsOfProductRemoval() {
        for (let obj of this.tiposDeProductosDisponibles) {
            obj.initializeButtonsOfProductRemoval(this);
        }
    }
    initializeButtonOfExpandEnTienda() {
        for (let obj of this.tiposDeProductosDisponibles) {
            obj.initializeButtonsOfExpandEnTienda(this);
        }
    }
    crearAnimacionEnBannerEnTienda(mensaje) {
        let carrito = this;
        $(".bannerDeComprasEnElCarrito").slideUp();
        if(!$(".bannerDeProductoComprado").is(":empty")) {
            $(".bannerDeProductoComprado").hide();
        }
        $(`.bannerDeProductoComprado`).empty();
        $(`.bannerDeProductoComprado`).append(`<div class="containerDeBanner">
                                                    <p>${mensaje}</p>
                                                </div>`);
        $(`.bannerDeProductoComprado`).slideDown();
        setTimeout(function(){
            $(".bannerDeProductoComprado").slideUp();
            carrito.createBannerForCarrito();
            $(`.bannerDeProductoComprado`).empty();
        }, 3000);                  
    }

    createCarritoHtml() {

        let display = this.getListToDisplay();
        let nameOfProduct;
        let quantityOfProduct;
        let productoParaAgregar;
        let precioDeProductoActual;
        let tabla;

        tabla =`
            <div class="containerParaCarrito">
    
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th class="px-3 headerDeItemsEnCarrito">
                        <div class="textoEnHeaderDelCarrito text-uppercase"><p class="textoEnCarritoEnHeader">Producto</p><i class="bi bi-handbag iconoParaPantallasChicas"></i></div>
                      </th>
                      <th class="headerDeItemsEnCarrito">
                        <div class="textoEnHeaderDelCarrito text-uppercase"><p class="textoEnCarritoEnHeader">Precio por unidad</p><i class="iconoParaPantallasChicas bi bi-tag"></i></div>
                      </th>
                      <th class="headerDeItemsEnCarrito headerDeCantidad">
                        <div class="textoEnHeaderDelCarrito text-uppercase divDeCantidad"><p class="textoEnCarritoEnHeader">Cantidad</p><i class="bi bi-arrow-down-short iconoParaPantallasChicas"></i></div>
                      </th>
                      <th class="headerDeItemsEnCarrito">
                        <div class="textoEnHeaderDelCarrito text-uppercase"></div>
                      </th>
                    </tr>
                  </thead>`;

        for (let itemAsString of display) {
            //truco para extraer la parte numerica del texto
            quantityOfProduct = itemAsString.match(/\d+/)[0];
            nameOfProduct = itemAsString.substr(0, itemAsString.length - 2 - getLength(quantityOfProduct - 1)).trim();
            if(quantityOfProduct == 0) {
                continue;
            }
            for (let producto of this.tiposDeProductosDisponibles) {
                if (producto.nombre == nameOfProduct) {
                    productoParaAgregar = producto;
                    break;
                }
            }
            this.precioTotal = this.precioTotal + quantityOfProduct * productoParaAgregar.precio;
            precioDeProductoActual = productoParaAgregar.precio + "x" + quantityOfProduct;

            tabla = `${tabla}      
                    <tr id="productoDeCodigo${productoParaAgregar.codigoDeProducto}EnCarrito">
                      <th class="border-0">
                        <div>
                          <img src="../${productoParaAgregar.getImageFile()}" class="img-fluid rounded shadow-sm imagenEnCarrito">
                          <div class="ml-3 d-inline-block align-middle">
                            <h5 class="mb-0 nombreDeProductos">${productoParaAgregar.nombre}</h5>
                          </div>
                        </div>
                      </th>
                      <td class="border-0 align-middle precioDeProductoEnCarrito"><strong>${productoParaAgregar.precio + "$"}</strong></td>
                      <td class="border-0 align-middle unidadesDeCadaProducto"><strong id="cantidadCompradaDeProducto${productoParaAgregar.codigoDeProducto}">${quantityOfProduct}</strong></td>
                      <td class="border-0 align-middle containerDeBotonEnCarrito"><button id="botonEnCarritoParaRemoverProducto${productoParaAgregar.codigoDeProducto}" class="textoClaro btn cart px-auto botonParaRemoverDelCarrito"><i class="bi bi-trash"></i></button></td>
                    </tr>`;
        }
        if (display.length == 0) {
            tabla = `${tabla} 
            <tr>
                <th class="border-0">
                    <div>
                        <div class="ml-3 d-inline-block align-middle">
                            <h5 class="mb-0">El carrito está vacío</h5>
                        </div>
                    </div>
                </th>
            </tr>`
        }
        tabla= `${tabla}
                    </tbody>
                    <thead id="casillaParaTotalAPagar">
                        <tr>
                            <th class="headerDeItemsEnCarrito">
                                <div class="px-3 text-uppercase">Total:</div>
                            <th id="casillaParaTotalAPagarPrecio" class="px-3 headerDeItemsEnCarrito"><strong class="align-middle">${this.precioTotal + "$"}</strong></td>
                            <th class="headerDeItemsEnCarrito"><strong></strong></td>
                            <th class="headerDeItemsEnCarrito"><strong></strong></td>
                        </tr>
                    </thead>
                </table>
                </div>
                </div>`;
        $("#tablaDeCarrito").append(tabla);

        this.initilializeCarritoButtons();
    }

    initilializeCarritoButtons() {
        for (let obj of this.tiposDeProductosDisponibles) {
            obj.initializeButtonsOfProductsEnCarrito(this);
        }
    }
}