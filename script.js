const interruptorModoOscuro = document.querySelector(".interruptor");
const interruptorSvg = document.querySelector(".svg-interruptor");
const carritoDeComprasSvg = document.querySelector(".shopping-cart-svg");
const productosDiv = document.querySelector(".productos");
const main = document.querySelector("main")
const textoProductos = document.querySelector("#nav-productos-texto");
const inputNombre = document.querySelector("#nombre")
const inputEmail = document.querySelector("#email")
const inputTextArea = document.querySelector("#consulta")
const form = document.querySelector("form")


// funcionalidad modo oscuro

if (localStorage.getItem("darkmode") === "true") {
    document.body.classList.add("darkmode");
    interruptorSvg.src = "assets/sun-svgrepo-com.svg";
    carritoDeComprasSvg.src = "assets/shopping-svgrepo-com-darkmode.svg";
}

interruptorModoOscuro.addEventListener("click", () => {
    if (localStorage.getItem("darkmode") === "false" || localStorage.getItem("darkmode") === null) {
        localStorage.setItem("darkmode", true);
    } else {
        localStorage.setItem("darkmode", false);
    }

    document.body.classList.toggle("darkmode");

    if (document.body.classList.contains("darkmode")) {
        interruptorSvg.src = "assets/sun-svgrepo-com.svg";
        carritoDeComprasSvg.src = "assets/shopping-svgrepo-com-darkmode.svg";
    } else {
        interruptorSvg.src = "assets/moon-svgrepo-com.svg";
        carritoDeComprasSvg.src = "assets/shopping-svgrepo-com.svg";
    }
});

// Carrousel

const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    pagination: {
        el: '.swiper-pagination'
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    }, 
});

// renderizacion productos home

getData()
    .then(data => {
        const productos = data.productos
        productos.forEach(producto => {
            if (producto.id < 5) {
                const divCard = document.createElement("div");
                divCard.classList.add("card")
                divCard.setAttribute("data-id", producto.id)

                const imgProducto = document.createElement("img");
                imgProducto.src = producto.imagen
                imgProducto.alt = producto.nombre
                divCard.appendChild(imgProducto)

                const nombreProducto = document.createElement("p");
                nombreProducto.textContent = producto.nombre;
                divCard.appendChild(nombreProducto)

                const precioProducto = document.createElement("p")
                precioProducto.innerHTML = `<p><span style='text-decoration: line-through; color: red'>${producto.oferta ? "$" + producto.precio : ""}</span> $${producto.oferta ? Math.round(producto.precio * 0.75) : producto.precio}</p>`
                divCard.appendChild(precioProducto)
    
                const añadirCarritoBoton = document.createElement("button")
                añadirCarritoBoton.textContent = "Añadir al carrito"
                añadirCarritoBoton.classList.add("boton-añadir-carrito")
                añadirCarritoBoton.addEventListener("click", (e) => añadirAlCarrito(e))
                divCard.appendChild(añadirCarritoBoton)

                productosDiv.appendChild(divCard)
            }           
        })
    })

// página productos

function renderNavProductos(valorCheckbox, valorOrdenSelect) {
    const tituloOfertas = document.createElement("h1")
    tituloOfertas.classList.add("seccion-productos-titulo")
    tituloOfertas.textContent = "25% OFF EN PRODUCTOS DETERMINADOS! APROVECHÁ!"
    main.appendChild(tituloOfertas)

    const navProductos = document.createElement("nav")
    navProductos.classList.add("seccion-filtros-productos")

    const filtroTitulo = document.createElement("h4")
    filtroTitulo.textContent = "Filtrar por:"
    navProductos.appendChild(filtroTitulo)

    const filtrosDiv = document.createElement("div")
    filtrosDiv.classList.add("filtros")
    navProductos.appendChild(filtrosDiv)

    const labelOferta = document.createElement("label")
    labelOferta.textContent = "Ofertas: "
    labelOferta.htmlFor = "oferta"
    filtrosDiv.appendChild(labelOferta)

    const inputOferta = document.createElement("input")
    inputOferta.type = "checkbox"
    inputOferta.id = "oferta"
    inputOferta.checked = valorCheckbox
    inputOferta.addEventListener("change", (e) => checkearValorCheckbox(e))
    filtrosDiv.appendChild(inputOferta)

    const ordenarTitulo = document.createElement("h4")
    ordenarTitulo.textContent = "Ordenar por:"
    navProductos.appendChild(ordenarTitulo)

    const ordenarDiv = document.createElement("div")
    ordenarDiv.classList.add("filtros")

    const selectOrdenar = document.createElement("select")
    selectOrdenar.id = "ordenar"
    selectOrdenar.addEventListener("change", (e) => checkearValorSelect(e))
    ordenarDiv.appendChild(selectOrdenar)

    const optionAZ = document.createElement("option")
    optionAZ.value = "nombre-asc"
    optionAZ.textContent = "A-Z"
    optionAZ.selected = `${valorOrdenSelect == "asc" ? "selected" : ""}`
    selectOrdenar.appendChild(optionAZ)

    const optionZA = document.createElement("option")
    optionZA.value = "nombre-desc"
    optionZA.textContent = "Z-A"
    optionZA.selected = `${valorOrdenSelect == "desc" ? "selected" : ""}` 
    selectOrdenar.appendChild(optionZA)

    const opcionNinguno = document.createElement("option")
    opcionNinguno.value = "nombre-ninguno"
    opcionNinguno.textContent = "Ninguno"
    opcionNinguno.selected = `${valorOrdenSelect == "ninguno" ? "selected" : ""}`
    selectOrdenar.appendChild(opcionNinguno)

    navProductos.appendChild(ordenarDiv)

    main.appendChild(navProductos) 


}

function renderProductosOferta(data) {
    const listaProductos = data.productos
    const listaProductosOferta = listaProductos.filter(producto => producto.oferta == true)
    // console.log(listaProductosOferta)
    
    main.innerHTML = ""
    renderNavProductos(true, "ninguno")
    const productosDiv = document.createElement("div");
    productosDiv.classList.add("seccion-productos__div")

    listaProductosOferta.forEach(producto => {
        const productoDiv = document.createElement("div")
        productoDiv.classList.add("card")

        const nombreProducto = producto.nombre
        const precioProducto = producto.precio
        const imagenProducto = producto.imagen

        const imgProducto = document.createElement("img")
        imgProducto.src = imagenProducto // producto.imagen
        imgProducto.alt = nombreProducto // producto.nombre
        imgProducto.classList.add("seccion-productos__card__img")
        productoDiv.appendChild(imgProducto)

        const nombreProductoP = document.createElement("p")
        nombreProductoP.textContent = nombreProducto // producto.nombre
        nombreProductoP.classList.add("seccion-productos__card__nombre")
        productoDiv.appendChild(nombreProductoP)
        
        const precioProductoP = document.createElement("p")
        precioProductoP.innerHTML = `<p><span style='text-decoration: line-through; color: red'>${producto.oferta ? "$" + precioProducto : ""}</span> $${producto.oferta ? Math.round(precioProducto * 0.75) : precioProducto}</p>` // producto.precio
        precioProductoP.classList.add("seccion-productos__card__precio")
        productoDiv.appendChild(precioProductoP)

        const añadirCarritoBoton = document.createElement("button")
        añadirCarritoBoton.textContent = "Añadir al carrito"
        añadirCarritoBoton.classList.add("boton-añadir-carrito")
        productoDiv.appendChild(añadirCarritoBoton)
        
        productosDiv.appendChild(productoDiv)
    })
    main.appendChild(productosDiv)
}

function renderProductosOrden(data, orden) {
    if (orden == "asc") {
        const arrProductosOrdenado = data.sort((a, b) => {
            return a.nombre === b.nombre ? 0 : a.nombre < b.nombre ? -1 : 1
        })
        main.innerHTML = ""
        renderNavProductos(false, "asc")
        const productosDiv = document.createElement("div");
        productosDiv.classList.add("seccion-productos__div")

        arrProductosOrdenado.forEach(producto => {
            const productoDiv = document.createElement("div")
            productoDiv.classList.add("card")

            const nombreProducto = producto.nombre
            const precioProducto = producto.precio
            const imagenProducto = producto.imagen

            const imgProducto = document.createElement("img")
            imgProducto.src = imagenProducto // producto.imagen
            imgProducto.alt = nombreProducto // producto.nombre
            imgProducto.classList.add("seccion-productos__card__img")
            productoDiv.appendChild(imgProducto)

            const nombreProductoP = document.createElement("p")
            nombreProductoP.textContent = nombreProducto // producto.nombre
            nombreProductoP.classList.add("seccion-productos__card__nombre")
            productoDiv.appendChild(nombreProductoP)
        
            const precioProductoP = document.createElement("p")
            precioProductoP.innerHTML = `<p><span style='text-decoration: line-through; color: red'>${producto.oferta ? "$" + precioProducto : ""}</span> $${producto.oferta ? Math.round(precioProducto * 0.75) : precioProducto}</p>` // producto.precio
            precioProductoP.classList.add("seccion-productos__card__precio")
            productoDiv.appendChild(precioProductoP)

            const añadirCarritoBoton = document.createElement("button")
            añadirCarritoBoton.textContent = "Añadir al carrito"
            añadirCarritoBoton.classList.add("boton-añadir-carrito")
            productoDiv.appendChild(añadirCarritoBoton)
        
            productosDiv.appendChild(productoDiv)
        })
        main.appendChild(productosDiv)
    } else if (orden == "desc") {
        const arrProductosOrdenado = data.sort((a, b) => {
            return a.nombre === b.nombre ? 0 : a.nombre < b.nombre ? 1 : -1
        })
        main.innerHTML = ""
        renderNavProductos(false, "desc")
        const productosDiv = document.createElement("div");
        productosDiv.classList.add("seccion-productos__div")

        arrProductosOrdenado.forEach(producto => {
            const productoDiv = document.createElement("div")
            productoDiv.classList.add("card")

            const nombreProducto = producto.nombre
            const precioProducto = producto.precio
            const imagenProducto = producto.imagen

            const imgProducto = document.createElement("img")
            imgProducto.src = imagenProducto // producto.imagen
            imgProducto.alt = nombreProducto // producto.nombre
            imgProducto.classList.add("seccion-productos__card__img")
            productoDiv.appendChild(imgProducto)

            const nombreProductoP = document.createElement("p")
            nombreProductoP.textContent = nombreProducto // producto.nombre
            nombreProductoP.classList.add("seccion-productos__card__nombre")
            productoDiv.appendChild(nombreProductoP)
        
            const precioProductoP = document.createElement("p")
            precioProductoP.innerHTML = `<p><span style='text-decoration: line-through; color: red'>${producto.oferta ? "$" + precioProducto : ""}</span> $${producto.oferta ? Math.round(precioProducto * 0.75) : precioProducto}</p>` // producto.precio
            precioProductoP.classList.add("seccion-productos__card__precio")
            productoDiv.appendChild(precioProductoP)

            const añadirCarritoBoton = document.createElement("button")
            añadirCarritoBoton.textContent = "Añadir al carrito"
            añadirCarritoBoton.classList.add("boton-añadir-carrito")
            productoDiv.appendChild(añadirCarritoBoton)
        
            productosDiv.appendChild(productoDiv)
        })
        main.appendChild(productosDiv)
    }
}

function checkearValorCheckbox(e) {
    if (e.target.checked) {
        getData()
            .then(data => renderProductosOferta(data))
    } else {
        main.innerHTML = ""
        renderNavProductos(false, "ninguno")
        getData()
            .then(data => renderData(data))
    }
}

function checkearValorSelect(e) {
    if (e.target.value == "nombre-asc") {
        getData()
            .then(data => renderProductosOrden(data.productos, "asc"))
    } else if (e.target.value == "nombre-desc") {
        getData()
            .then(data => renderProductosOrden(data.productos, "desc"))
    } else {
        main.innerHTML = ""
        renderNavProductos(false, "ninguno")
        getData()
            .then(data => renderData(data))
    }
}

textoProductos.addEventListener("click", () => {
    main.innerHTML = ""
    renderNavProductos(false, "ninguno") 
    getData()
        .then(data => renderData(data))
})



async function getData() {
    const response = await fetch('data.json')
    return response.json()
}

const seccionProductosDiv = document.createElement("div");
seccionProductosDiv.classList.add("seccion-productos__div")

function renderData(data) {
    const productos = data.productos
    const productosDiv = document.createElement("div");
    productosDiv.classList.add("seccion-productos__div")

    productos.forEach(producto => {
        const productoDiv = document.createElement("div")
        productoDiv.classList.add("card")
        productoDiv.setAttribute("data-id", producto.id)

        const nombreProducto = producto.nombre
        const precioProducto = producto.precio
        const imagenProducto = producto.imagen

        const imgProducto = document.createElement("img")
        imgProducto.src = imagenProducto // producto.imagen
        imgProducto.alt = nombreProducto // producto.nombre
        imgProducto.classList.add("seccion-productos__card__img")
        productoDiv.appendChild(imgProducto)

        const nombreProductoP = document.createElement("p")
        nombreProductoP.textContent = nombreProducto // producto.nombre
        nombreProductoP.classList.add("seccion-productos__card__nombre")
        productoDiv.appendChild(nombreProductoP)
        
        const precioProductoP = document.createElement("p")
        precioProductoP.innerHTML = `<p><span style='text-decoration: line-through; color: red'>${producto.oferta ? "$" + precioProducto : ""}</span> $${producto.oferta ? Math.round(precioProducto * 0.75) : precioProducto}</p>` // producto.precio
        precioProductoP.classList.add("seccion-productos__card__precio")
        productoDiv.appendChild(precioProductoP)

        const añadirCarritoBoton = document.createElement("button")
        añadirCarritoBoton.textContent = "Añadir al carrito"
        añadirCarritoBoton.classList.add("boton-añadir-carrito")
        añadirCarritoBoton.addEventListener("click", (e) => añadirAlCarrito(e))
        productoDiv.appendChild(añadirCarritoBoton)
        
        productosDiv.appendChild(productoDiv)
    })
    main.appendChild(productosDiv)
}

// seccion y funcionalidad carrito de compras

let carrito = []

function añadirAlCarrito(e) {

    const productoSeleccionado = e.target.closest(".card")
    console.log(productoSeleccionado.dataset.id)

    if (localStorage.getItem("carrito") == null) {
        getData()
            .then(data => {
                const producto = data.productos.find(producto => producto.id == productoSeleccionado.dataset.id)
                carrito.push(producto)
                console.log(carrito)
            }) 
            .then(() => localStorage.setItem("carrito", JSON.stringify(carrito)))     
    } else {
        carrito = JSON.parse(localStorage.getItem("carrito"))

        getData()
            .then(data => {
                const producto = data.productos.find(producto => producto.id == productoSeleccionado.dataset.id)
                carrito.push(producto)
                console.log(carrito)
            })
            .then(() => localStorage.setItem("carrito", JSON.stringify(carrito)))
    } 
    
    Toastify({

        text: "Producto añadido al carrito",
        duration: 3000,
        close: true,
        style: {
            background: "#0CBF50"
        }

    }).showToast();
}

carritoDeComprasSvg.addEventListener("click", () => {
    main.innerHTML = ""
    
    const divCarrito = document.createElement("div")
    divCarrito.classList.add("carrito-div")
    main.appendChild(divCarrito)

    const tituloCarrito = document.createElement("h1")
    tituloCarrito.textContent = "Tu carrito"
    divCarrito.appendChild(tituloCarrito)

    const divProductosCarrito = document.createElement("div")
    divProductosCarrito.classList.add("carrito-productos-div")
    divCarrito.appendChild(divProductosCarrito)

    renderProductosCarrito(divProductosCarrito)

    if (JSON.parse(localStorage.getItem("carrito")).length !== 0) {
        const divTotalCarrito = document.createElement("div")
        divTotalCarrito.classList.add("carrito-total-div")

        const textoPrecioTotal = document.createElement("p")
        textoPrecioTotal.innerHTML = `<span>Precio total: </span>$${Math.round(calcularPrecioTotal())}`
        divTotalCarrito.appendChild(textoPrecioTotal)

        const botonPagar = document.createElement("button")
        botonPagar.textContent = "Pagar"
        botonPagar.classList.add("boton-pagar")
        botonPagar.addEventListener("click", () => {
            main.innerHTML = ""
            renderInputsTarjeta()
        })
        divTotalCarrito.appendChild(botonPagar)

        divCarrito.appendChild(divTotalCarrito)
    } else {
        const textoCarritoVacio = document.createElement("p")
        textoCarritoVacio.classList.add("texto-carrito-vacio")
        textoCarritoVacio.textContent = "Tu carrito está vacío"
        divCarrito.appendChild(textoCarritoVacio)
    }


    
})

function renderProductosCarrito(div) {
    JSON.parse(localStorage.getItem("carrito")).forEach(producto => {
        const divProductoIndividual = document.createElement("div")
        divProductoIndividual.classList.add("carrito-producto-individual")

        const productoIndividualImg = document.createElement("img")
        productoIndividualImg.src = producto.imagen
        productoIndividualImg.alt = producto.nombre
        divProductoIndividual.appendChild(productoIndividualImg)

        const productoInformacionDiv = document.createElement("div")
        productoInformacionDiv.classList.add("carrito-informacion-producto")
        divProductoIndividual.appendChild(productoInformacionDiv)

        const productoIndividualNombre = document.createElement("p")
        productoIndividualNombre.id = "nombre-producto"
        productoIndividualNombre.textContent = producto.nombre
        productoInformacionDiv.appendChild(productoIndividualNombre)

        const divPrecioEliminar = document.createElement("div")
        productoInformacionDiv.appendChild(divPrecioEliminar)

        const productoIndividualBoton = document.createElement("button")
        productoIndividualBoton.textContent = "Eliminar"
        productoIndividualBoton.classList.add("boton-eliminar-producto")
        productoIndividualBoton.addEventListener("click", (e) => eliminarProducto(e))
        divPrecioEliminar.appendChild(productoIndividualBoton)

        const productoIndividualPrecio = document.createElement("p")
        productoIndividualPrecio.innerHTML = `<span style='text-decoration: line-through; color: red'>${producto.oferta ? "$" + producto.precio : ""}</span> $${producto.oferta ? Math.round(producto.precio * 0.75) : producto.precio}`
        productoIndividualPrecio.id = "precio-producto" 
        divPrecioEliminar.appendChild(productoIndividualPrecio)

        
        div.appendChild(divProductoIndividual) 
    })
}

function eliminarProducto(e) {
    const productoAEliminar = e.target.closest(".carrito-producto-individual")
    console.log(productoAEliminar)
    const productoAEliminarId = productoAEliminar.querySelector("#nombre-producto").textContent
    console.log(productoAEliminarId)

    const carritoActual = JSON.parse(localStorage.getItem("carrito"))
    const carritoActualizado = carritoActual.filter(producto => producto.nombre != productoAEliminarId)
    console.log(carritoActualizado)
    localStorage.setItem("carrito", JSON.stringify(carritoActualizado))
    
    main.innerHTML = ""
    const divCarrito = document.createElement("div")
    divCarrito.classList.add("carrito-div")
    main.appendChild(divCarrito)

    const tituloCarrito = document.createElement("h1")
    tituloCarrito.textContent = "Tu carrito"
    divCarrito.appendChild(tituloCarrito)

    const divProductosCarrito = document.createElement("div")
    divProductosCarrito.classList.add("carrito-productos-div")
    divCarrito.appendChild(divProductosCarrito)
    console.log(JSON.parse(localStorage.getItem("carrito")))

    renderProductosCarrito(divProductosCarrito)

    if (JSON.parse(localStorage.getItem("carrito")).length !== 0) {
        const divTotalCarrito = document.createElement("div")
        divTotalCarrito.classList.add("carrito-total-div")

        const textoPrecioTotal = document.createElement("p")
        textoPrecioTotal.innerHTML = `<span>Precio total:</span> $${Math.round(calcularPrecioTotal())}`
        divTotalCarrito.appendChild(textoPrecioTotal)

        const botonPagar = document.createElement("button")
        botonPagar.textContent = "Pagar"
        botonPagar.classList.add("boton-pagar")
        botonPagar.addEventListener("click", () => {
            main.innerHTML = ""
            renderInputsTarjeta()
        })
        divTotalCarrito.appendChild(botonPagar)

        divCarrito.appendChild(divTotalCarrito)
    } else {
        const textoCarritoVacio = document.createElement("p")
        textoCarritoVacio.classList.add("texto-carrito-vacio")
        textoCarritoVacio.textContent = "Tu carrito está vacío"
        divCarrito.appendChild(textoCarritoVacio)
    }
}

function calcularPrecioTotal() {
    const productosCarrito = JSON.parse(localStorage.getItem("carrito"))
    let precioTotal = 0
    productosCarrito.forEach(producto => {
        if (producto.oferta) {
            precioTotal += producto.precio * 0.75 
        } else {
            precioTotal += producto.precio
        }
    })
    console.log(precioTotal)
    return precioTotal
}

// seccion inputs tarjeta /////////////////////////////////

function renderInputsTarjeta() {
    const tituloInputsTarjeta = document.createElement("h1")
    tituloInputsTarjeta.id = "titulo-input-tarjeta"
    tituloInputsTarjeta.textContent = "Ingrese los datos de su tarjeta: "
    main.appendChild(tituloInputsTarjeta)

    const divInputsTarjeta = document.createElement("div")
    divInputsTarjeta.classList.add("div-input-tarjeta")

    let nombreValidado = false;
    let tarjetaValidada = false;
    let fechaValidado = false;
    let codigoValidado = false;

    const labelNombreApellido = document.createElement("label")
    labelNombreApellido.htmlFor = "nombre-apellido"
    labelNombreApellido.textContent = "Nombre completo: "
    divInputsTarjeta.appendChild(labelNombreApellido)

    const inputNombreApellido = document.createElement("input")
    inputNombreApellido.placeholder = "Nombre y apellido completo"
    inputNombreApellido.oninput = () => {
        if (inputNombreApellido.value.length > 32 || inputNombreApellido.value.length <= 4 || inputNombreApellido.value === "") {
            inputNombreApellido.style.borderBottom = "3px solid red"
            nombreValidado = false;
        } else {
            inputNombreApellido.style.borderBottom = "3px solid #0CBF50"
            nombreValidado = true
        }
    }
    divInputsTarjeta.appendChild(inputNombreApellido)

    const labelTarjeta = document.createElement("label")
    labelTarjeta.htmlFor = "numero-tarjeta"
    labelTarjeta.textContent = "Numero de tarjeta: "
    divInputsTarjeta.appendChild(labelTarjeta)

    const inputTarjeta = document.createElement("input")
    inputTarjeta.placeholder = "Numero de tarjeta"
    inputTarjeta.oninput = () => {
        if (inputTarjeta.value.length !== 16 || inputTarjeta.value === "" || isNaN(inputTarjeta.value) === true) {
            inputTarjeta.style.borderBottom = "3px solid red"
            tarjetaValidada = false
        } else {
            inputTarjeta.style.borderBottom = "3px solid #0CBF50"
            tarjetaValidada = true
        }
    }
    divInputsTarjeta.appendChild(inputTarjeta)

    const labelFechaExpiracion = document.createElement("label")
    labelFechaExpiracion.htmlFor = "fecha-expiracion"
    labelFechaExpiracion.textContent = "Fecha de expiración: "
    divInputsTarjeta.appendChild(labelFechaExpiracion)

    const inputFechaExpiracion = document.createElement("input")
    inputFechaExpiracion.placeholder = "01/29"
    inputFechaExpiracion.oninput = () => {
        const regex = /^(0[1-9]|1[0-2])\/?([2-9][3-9])$/ 
        if ( inputFechaExpiracion.value === "" || inputFechaExpiracion.value.length > 5 || regex.test(inputFechaExpiracion.value) === false) {
            inputFechaExpiracion.style.borderBottom = "3px solid red"
            fechaValidado = false
        } else {
            inputFechaExpiracion.style.borderBottom = "3px solid #0CBF50"
            fechaValidado = true
        }
    }
    divInputsTarjeta.appendChild(inputFechaExpiracion)

    const labelCodigoSeguridad = document.createElement("label")
    labelCodigoSeguridad.htmlFor = "codigo-seguridad"
    labelCodigoSeguridad.textContent = "Codigo de seguridad: "
    divInputsTarjeta.appendChild(labelCodigoSeguridad)

    const inputCodigoSeguridad = document.createElement("input")
    inputCodigoSeguridad.placeholder = "123"
    inputCodigoSeguridad.oninput = () => {
        if (inputCodigoSeguridad.value.length !== 3 || inputCodigoSeguridad.value === "" || isNaN(inputCodigoSeguridad.value) === true) {
            inputCodigoSeguridad.style.borderBottom = "3px solid red"
            codigoValidado = false
        } else {
            inputCodigoSeguridad.style.borderBottom = "3px solid #0CBF50"
            codigoValidado = true
        }
    }
    divInputsTarjeta.appendChild(inputCodigoSeguridad)

    const botonPagar = document.createElement("button")
    botonPagar.textContent = "Pagar"
    botonPagar.classList.add("boton-pagar")
    botonPagar.addEventListener("click", () => {
        if (nombreValidado === true && tarjetaValidada === true && fechaValidado === true && codigoValidado === true) {
            localStorage.removeItem("carrito")
            localStorage.setItem("carrito", JSON.stringify([]))
            main.innerHTML = ""
            const textoCompra = document.createElement("h1")
            textoCompra.id = "texto-compra-exitosa"
            textoCompra.textContent = "Gracias por tu compra!"
            main.appendChild(textoCompra)
            Toastify({
                text: "Tu compra ha sido exitosa!",
                duration: 3000,
                close: true,
                gravity: "bottom",
                position: "center",
                style: {
                    background: "#0CBF50"
                }
            }).showToast();
        } else {
            Toastify({

                text: "Ha ocurrido un error. Revisa los datos ingresados",
                duration: 3000,
                close: true,
                style: {
                    background: "red"
                }

            }).showToast();
        }
    })
    divInputsTarjeta.appendChild(botonPagar)

    main.appendChild(divInputsTarjeta)
}

let nombreFooterValidado = false;
let emailValidado = false;
let textAreaValidado = false;

inputEmail.oninput = () => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (inputEmail.value === "" || regex.test(inputEmail.value) === false) {
        inputEmail.style.borderBottom = "3px solid red"
        emailValidado = false
    } else {
        inputEmail.style.borderBottom = "3px solid #0CBF50"
        emailValidado = true
    }
}

inputNombre.oninput = () => {
    if (inputNombre.value !== "") {
        nombreFooterValidado = true
        inputNombre.style.borderBottom = "3px solid #0CBF50"
    } else {
        nombreFooterValidado = false
        inputNombre.style.borderBottom = "3px solid red"
    }
}

inputTextArea.oninput = () => {
    if (inputTextArea.value !== "" && inputTextArea.value.length > 20) {
        textAreaValidado = true
        inputTextArea.style.border = "3px solid #0CBF50"
    } else {
        textAreaValidado = false
        inputTextArea.style.border = "3px solid red"
    }
}



form.onsubmit = (e) => {
    

    if (emailValidado === true && nombreFooterValidado === true && textAreaValidado === true) {
        Toastify({
            text: "Cosulta enviada!",
            duration: 3000,
            close: true,
            gravity: "bottom",
            position: "center",
            style: {
                background: "#0CBF50"
            }
        }).showToast();
    } else {
        e.preventDefault()
        Toastify({

            text: "Ha ocurrido un error. Revisa los datos ingresados",
            duration: 3000,
            close: true,
            style: {
                background: "red"
            }

        }).showToast();
    }


}


