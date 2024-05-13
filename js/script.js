
const productos = [
    {name:"Aceite Sintetico", id:"1001", type:"Lubricantes", price:100000, stock:10, description:"5w-30"},
    {name:"Aceite SemiSintetico", id:"1002", type:"Lubricantes", price:85000, stock:10, description:"10w-40"},
    {name:"Aceite Mineral", id:"1003", type:"Lubricantes", price:65000, stock:10, description:"SAE 40"},
    {name:"Filtro de Aire Auto", id:"2001", type:"Filtros", price:10000, stock:10, description:"CA11222"},
    {name:"Cubierta Auto", id:"3001", type:"Cubiertas", price:150000, stock:10, description:"255/455R17"},
    {name:"Cubierta Auto", id:"3002", type:"Cubiertas", price:140000, stock:10, description:"205/55R16"}
];


let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

let contadorProdsCart = JSON.parse(localStorage.getItem("contadorProdsCart"));


const contCart = () => {
    let contadorCart = document.querySelector("#contadorCart");
    contadorCart.innerHTML = `
    <span class="badge" id="contadorCart">${contadorProdsCart}</span>
    `;
};

const totalCarrito = ()=>{
    let total = carrito.reduce((acumulador, {price, quantity})=>{
            return acumulador + (price*quantity);
        }, 0
    );
    return total;
};

const mostrarTotalCarrito = ()=>{
    const carritoTotal = document.getElementById("carritoTotal");
    carritoTotal.innerHTML=`Total Carrito: $ ${totalCarrito()}`;
};

const agregarCarrito = (objetoCarrito)=>{
    const verificar = carrito.some((elemento)=>{
            return elemento.id === objetoCarrito.id
        }
    );
    if (verificar){
        const indice = carrito.findIndex((elemento)=> elemento.id === objetoCarrito.id)
        carrito[indice].quantity = parseInt(carrito[indice].quantity) + parseInt(objetoCarrito.quantity)
    } else{
        carrito.push(objetoCarrito);
    }
    mostrarTotalCarrito();
};

function contadorProdsCarrito(prods) {
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
            elementoLista.innerHTML=`Producto:${name} <br> Precio: ${price} <br> Cant.:${quantity} <button type="button" class=" btn-custom btn btn-danger" style="--bs-btn-padding-y: .1rem; --bs-btn-padding-x: .2rem; --bs-btn-font-size: .65rem;" id="eliminarCarrito${id}">X</button>`;
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
                                        
                    let contadorCart = document.querySelector("#contadorCart");
                    contadorCart.innerHTML = `
                    <span class="badge" id="contadorCart">${contadorProdsCarrito(carrito)}</span>
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
            const prodCard = document.createElement("div");
            prodCard.classList.add("col-sm-");
            prodCard.classList.add("card");
            prodCard.style = "width: 270px; margin: 1px;";
            prodCard.id = id;
            prodCard.innerHTML = `
                    <img src="./img/${name+id}.png" class="card-img-top" alt="${name}">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <h6>${type}</h6>
                        <p class="card-text">${description}</p>
                        <span>Stock: ${stock}</span>
                        <span>$ ${price}</span>
                        <form class="formAgregar" id="form${id}">
                            <label for="contador${id}">Cantidad</label>
                            <input type="number" placeholder="0" id="contador${id}">
                            <button class="btn btn-primary" id="botonProd${id}">Agregar</button>
                        </form>
                    </div>`;
            contenedorProductos.appendChild(prodCard);
            const btn = document.getElementById(`botonProd${id}`);
                btn.addEventListener("click",(evento)=>{
                    evento.preventDefault();
                    const contadorQuantity = Number(document.getElementById(`contador${id}`).value);
                    if(contadorQuantity>0){
                        agregarCarrito({name, id, type, price, stock, description, quantity:contadorQuantity});
                        mostrarCarrito();
                        const form = document.getElementById(`form${id}`);
                        form.reset();
                    };

                    let contadorCart = document.querySelector("#contadorCart");
                    contadorCart.innerHTML = `
                    <span class="badge" id="contadorCart">${contadorProdsCarrito(carrito)}</span>
                    `;

                    localStorage.setItem("contadorProdsCart", contadorProdsCarrito(carrito));
                }
            );

        }
    );
};

const finalizarCompra = (event)=>{
    borrarCarrito();
    let mensaje = document.getElementById("carritoTotal");
    mensaje.innerHTML = "Muchas gracias por su compra, los esperamos pronto";
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
    mostrarProductos(productos);
    mostrarCarrito();
    mostrarTotalCarrito();
};

ecomm();