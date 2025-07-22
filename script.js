document.addEventListener('DOMContentLoaded', () => {
    // Base de datos simulada de productos
    const productos = [
        { id: 1, nombre: "Camiseta Básica Blanca", precio: 19.99, imagen: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5da606e0-358a-46ee-a7ab-f97aa3a50692.png" },
        { id: 2, nombre: "Jeans Slim Fit", precio: 49.99, imagen: "https://placehold.co/500x500" },
        { id: 3, nombre: "Chaqueta Denim", precio: 59.99, imagen: "https://placehold.co/500x500" },
        { id: 4, nombre: "Vestido Floral", precio: 39.99, imagen: "https://placehold.co/500x500" }
    ];
    
    // Carrito inicialmente vacío
    let carrito = [];
    
    // Elementos del DOM que se van a manipular
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    const btnComprar = document.querySelector('.btn-comprar');
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    
    // Agregar evento click a cada botón "Agregar al carrito"
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
    
    // Evento para finalizar la compra
    btnComprar.addEventListener('click', finalizarCompra);
    
    /**
     * Función para agregar un producto al carrito
     * @param {Event} e - Evento del click
     */
    function agregarAlCarrito(e) {
        const boton = e.target;
        const productoElemento = boton.closest('.producto');
        const productoId = parseInt(productoElemento.getAttribute('data-id'));
        
        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === productoId);
        
        if (productoExistente) {
            // Si existe, aumentar cantidad
            productoExistente.cantidad++;
        } else {
            // Si no existe, buscar producto en base y agregar con cantidad 1
            const producto = productos.find(p => p.id === productoId);
            carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        actualizarCarrito();
    }
    
    /**
     * Actualiza el DOM del carrito con los productos actuales
     */
    function actualizarCarrito() {
        carritoItems.innerHTML = '';
        
        if (carrito.length === 0) {
            carritoItems.innerHTML = '<p>Tu carrito está vacío</p>';
            carritoTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        // Por cada producto en el carrito, crear el elemento correspondiente
        carrito.forEach(producto => {
            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'carrito-item';
            itemElement.innerHTML = `
                <div class="carrito-item-info">
                    <h4>${producto.nombre}</h4>
                    <p class="carrito-item-precio">$${producto.precio.toFixed(2)}</p>
                </div>
                <div class="carrito-item-cantidad">
                    <button class="cantidad-btn" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                    <span>${producto.cantidad}</span>
                    <button class="cantidad-btn" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                    <button class="cantidad-btn" onclick="eliminarProducto(${producto.id})">🗑️</button>
                </div>
            `;
            
            carritoItems.appendChild(itemElement);
        });
        
        carritoTotal.textContent = total.toFixed(2);
    }
    
    /**
     * Cambia la cantidad de un producto en el carrito
     * @param {number} id - ID del producto
     * @param {number} cambio - Incremento o decremento (+1 o -1)
     */
    window.cambiarCantidad = function(id, cambio) {
        const producto = carrito.find(item => item.id === id);
        if (producto) {
            producto.cantidad += cambio;
            
            // Eliminar producto si cantidad es menor a 1
            if (producto.cantidad < 1) {
                carrito = carrito.filter(item => item.id !== id);
            }
            
            actualizarCarrito();
        }
    };
    
    /**
     * Elimina un producto del carrito por su ID
     * @param {number} id - ID del producto a eliminar
     */
    window.eliminarProducto = function(id) {
        carrito = carrito.filter(item => item.id !== id);
        actualizarCarrito();
    };
    
    /**
     * Función que simula finalizar la compra
     * Limpia el carrito y muestra mensaje de confirmación
     */
    function finalizarCompra() {
        if (carrito.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }
        
        alert(`Compra finalizada por $${carritoTotal.textContent}. ¡Gracias por tu compra!`);
        carrito = [];
        actualizarCarrito();
    }
});
