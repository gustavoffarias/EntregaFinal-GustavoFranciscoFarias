class Producto{
    constructor(name, id, type, price, stock, description){
        this.name = name;
        this.id = id;
        this.type = type;
        this.price = price;
        this.stock = stock;
        this.description = description;
    }
}

localStorage.removeItem("productos");
const productos = JSON.parse(localStorage.getItem("productos")) || [] 
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let contadorProdsCart = JSON.parse(localStorage.getItem("contadorProdsCart"));

const agregarProducto = ({name, id, type, price, stock, description})=>{
    if(productos.some(prod=>prod.id===id)){
        console.warn("Ya existe un producto con ese id")
    } else {
        const productoNuevo = new Producto(name, id, type, price, stock, description)
        productos.push(productoNuevo)
        localStorage.setItem('productos', JSON.stringify(productos))
    }
}

const contCart = () => {
    let contadorCarrito = document.querySelector("#contadorCarrito");
    contadorCarrito.innerHTML = `
    <span class="badge" id="contadorCarrito">${contadorProdsCart}</span>
    `;
};

const totalCarrito = ()=>{
    //calcula la sumatoria de cantidad por precio de los productos
    //con reduce obtenemos el total en base a price y quantity acumulados en "acumulador"
    let total = carrito.reduce((acumulador, {price, quantity})=>{
            return acumulador + (price*quantity);
        }, 0
    );
    return total;
};

const mostrarTotalCarrito = ()=>{
    //muestra el total del carrito, sumatoria de cantidad por precio de los productos
    const carritoTotal = document.getElementById("carritoTotal");
    carritoTotal.innerHTML=`Total Carrito: $ ${new Intl.NumberFormat("de-DE").format(totalCarrito())}`;
};

const agregarCarrito = (objetoCarrito)=>{
    //verificamos que al querer agregar un producto, este ya exista o no en el carrito
    const verificar = carrito.some((elemento)=>{
            return elemento.id === objetoCarrito.id
        }
    );
    if (verificar){
        //si es true, es decir, si existe el producto, acumulamos la cantidad
        const indice = carrito.findIndex((elemento)=> elemento.id === objetoCarrito.id)
        carrito[indice].quantity = parseInt(carrito[indice].quantity) + parseInt(objetoCarrito.quantity)
    } else{
        //si es false, es decir, no existe el producto, hacemos un push para agregarlo al carrito
        carrito.push(objetoCarrito);
    }
    mostrarTotalCarrito();
};

function contadorProdsCarrito(prods) {
    //cuenta la cantidad de productos en el carrito por id, no por quantity sino por producto
    let contador = 0;
    for (const entrada of prods) {
      contador += 1;
    }
    return contador;

  };

const mostrarCarrito = ()=>{
    const listaCarrito = document.getElementById("listaCarrito")
    listaCarrito.innerHTML=""
    carrito.forEach(({name, price, quantity, id}) =>{
            let elementoLista = document.createElement("li");
            elementoLista.innerHTML=`
                <img src="./img/${name+id}.png" style="width: 25%;" alt="${name}"> 
                <div>
                    Producto: ${name} <br> 
                    Precio: $${new Intl.NumberFormat("de-DE").format(price)} <br> 
                    Cant.: ${quantity} 
                    <button type="button" class=" btn-custom btn btn-danger" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .2rem; --bs-btn-font-size: .65rem;" id="eliminarCarrito${id}">X</button>
                </div>
            `;
            listaCarrito.appendChild(elementoLista);
            const botonBorrar = document.getElementById(`eliminarCarrito${id}`);
            botonBorrar.addEventListener("click",()=>{
                        carrito = carrito.filter((elemento)=>{
                            if(elemento.id !== id){
                                return elemento;
                            }
                        }
                    )

                    let carritoString = JSON.stringify(carrito);
                    localStorage.setItem("carrito", carritoString);
                    mostrarCarrito();
                    mostrarTotalCarrito();
                                        
                    let contadorCarrito = document.querySelector("#contadorCarrito");
                    contadorCarrito.innerHTML = `
                    <span class="badge" id="contadorCarrito">${contadorProdsCarrito(carrito)}</span>
                    `;

                    localStorage.setItem("contadorProdsCart", contadorProdsCarrito(carrito));
                }
            )
            let carritoString = JSON.stringify(carrito);
            localStorage.setItem("carrito", carritoString);
        }
    );
};

const borrarCarrito = ()=>{
    carrito.length = 0;
    let carritoString = JSON.stringify(carrito);
    localStorage.setItem("carrito", carritoString);
    mostrarCarrito();
}

const mostrarProductos = (arrayRendProds)=>{
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    arrayRendProds.forEach(({name, id, type, price, stock, description})=>{
            const cartaProducto = document.createElement("div");
            cartaProducto.classList.add("col-sm-");
            cartaProducto.classList.add("card");
            cartaProducto.style = "width: 270px; margin: 1px;";
            cartaProducto.id = id;
            cartaProducto.innerHTML = `
                    <img src="./img/${name+id}.png" class="card-img-top" alt="${name}">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <h6>${type}</h6>
                        <span>${description}</span><br>
                        <span>Precio: $${new Intl.NumberFormat("de-DE").format(price)}</span><br>
                        <button class="btn btn-primary" id="botonComprar${id}" style="width: 100%; margin-top:5%;" >Comprar</button>

                    </div>`;
            contenedorProductos.appendChild(cartaProducto);
            const btnComprar = document.getElementById(`botonComprar${id}`);
            btnComprar.addEventListener("click",(evento)=>{
                    evento.preventDefault();
                    const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                          confirmButton: "btn btn-primary btn-lg",
                        },
                        buttonsStyling: false
                    });
                    swalWithBootstrapButtons.fire({
                        title: "<p>Elegí los detalles del producto que seleccionaste</p>",
                        html: `
                            <span>Precio: $${new Intl.NumberFormat("de-DE").format(price)}</span><br>
                            <span>Stock: ${stock}</span><br>

                            <form class="formAgregar" id="formAgregar${id}">
                                <label for="contador${id}">Cantidad</label>
                                <input type="number" class="form-control" placeholder="0" id="contadorAgregar${id}">
                            </form>
                        `,
                        showCloseButton: true,
                        showConfirmButton: true,
                        confirmButtonText: "Agregar al carrito  "
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const cantProdAgregando = ()=>{
                                const verificar = carrito.find((elemento)=>{
                                        return elemento.id === id
                                    }
                                );
                                if (verificar){
                                    let cantidadProdAgregando = verificar.quantity
                                    return cantidadProdAgregando;
                                } else{
                                    let cantidadProdAgregando = 0;
                                    return cantidadProdAgregando;
                                }
                                
                            };
        
                            let controlCantProdAgregando = cantProdAgregando(carrito);

                            const contadorQuantity = Number(document.getElementById(`contadorAgregar${id}`).value);

                            if(contadorQuantity<=stock && controlCantProdAgregando<=stock){
                                if(contadorQuantity>0){
                                    agregarCarrito({name, id, type, price, stock, description, quantity:contadorQuantity});
                                    mostrarCarrito();
                                    const form = document.getElementById(`formAgregar${id}`);
                                    form.reset();
                                };    
                            } else {
                                const swalWithBootstrapButtonsError = Swal.mixin({
                                    customClass: {
                                      confirmButton: "btn btn-outline-danger",
                                    },
                                    buttonsStyling: false
                                });
                                swalWithBootstrapButtonsError.fire({
                                    icon: "error",
                                    confirmButtonText: 'No tenemos sufiente stock para la cantidad deseada'
                                });
                            }
    
                            let contadorCarrito = document.querySelector("#contadorCarrito");
                            contadorCarrito.innerHTML = `
                                <span class="badge" id="contadorCarrito">${contadorProdsCarrito(carrito)}</span>
                            `;
              
                            localStorage.setItem("contadorProdsCart", contadorProdsCarrito(carrito));
                        }
                    });
                }
            );
        }
    );
};

const productosCargados = async () => {
    if(productos.length === 0){
        try {
            const urlProductos = "./productos.json";
            const productosBasePura = await fetch(urlProductos);
            const productosBase = await productosBasePura.json();
            productosBase.forEach(prod => {
                    agregarProducto(prod);
                }
            );
        } catch(err) {
            console.error("se produjo un error obteniendo los productos");
        } finally {
            mostrarProductos(productos);
        }
    } else {
        mostrarProductos(productos);
    };
};

const finalizarCompra = (event)=>{
    borrarCarrito();
    let mensaje = document.getElementById("carritoTotal");
    let nombreForm = document.getElementById("formCompraFinalNombre").value;
    mensaje.innerHTML = "Muchas gracias "+nombreForm+" por tu compra, los esperamos pronto";

    document.getElementById("formCompraFinal").reset();

    let contadorCarrito = document.querySelector("#contadorCarrito");
    contadorCarrito.innerHTML = `
    <span class="badge" id="contadorCarrito">${contadorProdsCarrito(carrito)}</span>
    `;

    localStorage.setItem("contadorProdsCart", contadorProdsCarrito(carrito));
};

const compraFinal = document.getElementById("formCompraFinal");

compraFinal.addEventListener("submit",(event)=>{
        event.preventDefault();
        if(carrito.length>0){
            finalizarCompra(event);
        } else {
            let mensaje = document.getElementById("carritoTotal");
            mensaje.innerHTML = "El carrito esta vacio";
        };
    }
);

let botonFiltroPrecio = document.getElementById("botonFiltroPrecio");
botonFiltroPrecio.addEventListener("click", (evento)=>{
        evento.preventDefault();
        const precioMin = Number(document.getElementById('precioMin').value);
        const precioMax = Number(document.getElementById('precioMax').value);
        const rangoPrecio = [precioMin, precioMax];
        if(precioMin === 0 && precioMax === 0) {
            mostrarProductos(productos);
        }else{
            mostrarProductos(productos.filter(prod=>prod.price >= precioMin && prod.price <= precioMax));
        }
    }
);

const selectorTipo = document.getElementById("tipoProducto");

selectorTipo.onchange = (evt)=>{
    const tipoSeleccionado =  evt.target.value;
    if(tipoSeleccionado === "0"){
        mostrarProductos(productos);
    } else {
        mostrarProductos(productos.filter(prod=>prod.type === tipoSeleccionado));
    };
};

const ecomm = ()=>{
    contCart();
    productosCargados();
    mostrarCarrito();
    mostrarTotalCarrito();
};

ecomm();