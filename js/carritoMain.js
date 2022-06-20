
function crearHTMLConCarrito(carrito) {
    /*funcion que corre luego de crearse el carrito*/
    carrito.createCarritoHtml();
    if (carrito.elementosSeleccionados != 0) {
        $("#seccionDeForm").slideToggle();
    }
}
manejarPantallaDeCarga();
$(document).ready(function () {
    if (isValidHttpUrl()) {
        instanciarProductosYCarrito();
    }
    else {
        let carrito = new Carrito();
        crearHTMLConCarrito(carrito);
    }
});


/*inicializa el boton del form, simulando que manda la informacion a un API. Al usuario luego le quedaria pagar con mercado pago u otra plataforma*/
$(".botonEnForm").click((e) => {
    let mail, nombre, comentario, datosDelForm;
    mail = $("#inputEmail").val().trim();
    nombre = $("#nombreCompleto").val().trim();
    comentario = $("#comentarioEnForm").val();
    if(!(validarMailYNombreCompleto(nombre, mail))) {
        return 1;
    }
    datosDelForm = {
        mailDelUsuario : mail, nombreDelUsuario : nombre, comentarioDelUsuario : comentario
    };
    datosDelForm = JSON.stringify(datosDelForm);
    $.post("https://jsonplaceholder.typicode.com/posts", datosDelForm, function (datosDelForm, status) {
        if (status != "success") {
            console.log("La pagina no fue encontrada. Intente más tarde")
        }
        Swal.fire({
            icon: "success",
            title: `Muchas gracias por tu interes en esta pagina web ${nombre}!`,
            text: `Este es un emprendimiento ficticio. Luego del envio de tus datos, se te permitiria pagar tu compra mediante mercado pago u otro metodo.`,
            iconColor: '#966E65',
            confirmButtonColor: '#966E65',
            footer: `<a href="index.html">Volver al inicio</a>`, 
        });
        /*aqui iria el codigo para mandar los datos al backend*/
        }
    );
    e.preventDefault();
});