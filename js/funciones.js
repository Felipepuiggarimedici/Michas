/*archivo con funciones a utilizar en los otros archivos de js*/

/*obtiene la lista de productos del API y los instancia*/
/*En caso de no tener liveServer, los productos se obtienen de otra manera*/
function instanciarProductosYCarrito() {
    let listaDeProductos = [];
    $.getJSON("../data/productos.json", (productosEnJSON) => {
            productosNoInstanciados = productosEnJSON;
            for (let i = 0; i < productosNoInstanciados.length; i++) {
                listaDeProductos.push(new Productos(productosNoInstanciados[i].nombre, productosNoInstanciados[i].precio, productosNoInstanciados[i].codigoDeProducto, productosNoInstanciados[i].imagen));
            }
            crearCarrito(listaDeProductos);
    });
}
function crearCarrito(listaDeProductos) {
  let carrito = new Carrito(listaDeProductos);
  $(document).ready(function () {
    /*Se crea el html con la funcion en el main de cada pagina. Dentro del ready para esperar a que se cargue el html para hacer el nuevo html*/ 
    crearHTMLConCarrito(carrito);
    return carrito;
  });
}

function getLength(number) {
    return number.toString().length;
}

function manejarPantallaDeCarga() {
  window.addEventListener("load", function() {
    $("*").css("animation-play-state", "running")
    $(".pantallaDeCarga").fadeOut("slow");
    $("body").removeClass("preload");
  });
} 

function crearHtmlParaNombreIncorrectoEnFormulario(mensajeDeError) {
  /*Crea el html para hacerle saber al usuario que el nombre fue insertado incorrectamente. Devuelve falso por defecto*/
  $(".casillaParaNombreEnForm").css("border", "1px solid red");
  $(".redAlertDeNombre").text(mensajeDeError);
  $(".redAlertDeNombre").css("display", "block");
  return false;
}
function crearHtmlParaMailIncorrectoEnFormulario(mensajeDeError) {
  /*Crea el html para hacerle saber al usuario que el nombre fue insertado incorrectamente. Devuelve falso por defecto*/
  $(".casillaParaMailEnForm").css("border", "1px solid red");
  $(".redAlertDeMail").text(mensajeDeError);
  $(".redAlertDeMail").css("display", "block");
  return false;
}
function quitarAlertasDeDatosMalIngresados(mailValido, nombreValido) {
  if (mailValido) {
    $(".casillaParaMailEnForm").css("border", "none");
    $(".redAlertDeMail").css("display", "none");
  }
  if (nombreValido) {
    $(".casillaParaNombreEnForm").css("border", "none");
    $(".redAlertDeNombre").css("display", "none");
  }
}
function isValidHttpUrl() {
  let url;
  
  try {
    url = new URL(window.location.href);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
function validarMailYNombreCompleto(nombre, mail) {
  /*Valida el mail y el nombre. En caso de que alguno de los dos esté en un formato erroneo, se devuelve falso. En caso contrario, se devuelve verdadero*/
  let mensajeDeError, posicionDeArroba, posicionDePunto, nombreYMailValido, nombreValido, mailValido;
  nombreYMailValido = true;
  nombreValido = true;
  mailValido = true;

  if (nombre == null || nombre == ""){  
      mensajeDeError = "Este campo es obligatorio";
      nombreYMailValido = crearHtmlParaNombreIncorrectoEnFormulario(mensajeDeError);
      nombreValido = false;  
  }
  else if (!(nombre.includes(" "))) {
      mensajeDeError = "El nombre completo debe tener al menos dos palabras (nombre y apellido)";
      nombreYMailValido = crearHtmlParaNombreIncorrectoEnFormulario(mensajeDeError);
      nombreValido = false;  
  }

  posicionDeArroba = mail.indexOf("@");
  posicionDePunto = mail.lastIndexOf(".");
  if((mail == null || mail == "")) {
    mensajeDeError = "Este campo es obligatorio";
    nombreYMailValido = crearHtmlParaMailIncorrectoEnFormulario(mensajeDeError);
    mailValido = false;
  }
  else if (posicionDeArroba == -1 || posicionDePunto == -1) {
      mensajeDeError = `El mail debe contener "@" y "."`;
      nombreYMailValido = crearHtmlParaMailIncorrectoEnFormulario(mensajeDeError);
      mailValido = false;
  }
  else if (posicionDeArroba == 0) {
      mensajeDeError = "El arroba no puede ser el primer caracter de un mail";
      nombreYMailValido = crearHtmlParaMailIncorrectoEnFormulario(mensajeDeError);
      mailValido = false;
  }
  else if (posicionDePunto - posicionDeArroba< 0) {
      console.log(posicionDeArroba - posicionDePunto)
      mensajeDeError = "El punto no puede estar antes del arroba";
      nombreYMailValido = crearHtmlParaMailIncorrectoEnFormulario(mensajeDeError);
      mailValido = false;
  }
  else if (posicionDePunto - posicionDeArroba == 1 || mail.substring(posicionDePunto + 1).length < 2) {
      mensajeDeError = "El dominio del mail (lo que va después del arroba) debe tener al menos un caracter antes del punto y dos caracteres después del punto.";
      nombreYMailValido = crearHtmlParaMailIncorrectoEnFormulario(mensajeDeError);
      mailValido = false;
  }
  quitarAlertasDeDatosMalIngresados(mailValido, nombreValido);
  return nombreYMailValido;
}