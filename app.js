// App Initialization and Event Listeners

document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Login & Session Logic
    UI.checkLogin();

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-user').value;
        const pass = document.getElementById('login-pass').value;
        const errorMsg = document.getElementById('login-error');
        
        errorMsg.style.display = 'none';

        if (user === 'Admin' && pass === 'Admin') {
            localStorage.setItem('currentUser', 'Administrador');
            localStorage.setItem('userRole', 'admin');
            UI.handleLoginSuccess('Administrador', 'admin');
        } else if (user === 'Barberosadmin' && pass === '12345678') {
            localStorage.setItem('currentUser', 'Barbero Admin');
            localStorage.setItem('userRole', 'barbero');
            UI.handleLoginSuccess('Barbero Admin', 'barbero');
        } else if (user === 'David' && pass === '12345678') {
            localStorage.setItem('currentUser', 'David (Cliente)');
            localStorage.setItem('userRole', 'cliente');
            UI.handleLoginSuccess('David', 'cliente');
        } else {
            errorMsg.style.display = 'block';
        }
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        UI.logout();
    });

    // 1. Navigation Logic
    const links = document.querySelectorAll('.nav-links a');
    const views = document.querySelectorAll('.view');
    const viewTitle = document.getElementById('view-title');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active link
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show selected view
            const targetView = link.getAttribute('data-view');
            views.forEach(v => v.classList.remove('active'));
            document.getElementById(targetView).classList.add('active');

            // Update title
            viewTitle.innerText = link.innerText;
        });
    });

    // 2. Initialize Data
    UI.displayClientes();
    UI.displayBarberos();
    UI.displayServicios();
    UI.displayReservaciones();
    UI.populateSelects();

    // 3. Form Event Listeners

    // Auto-select preferred barber
    document.getElementById('res-cliente').addEventListener('change', (e) => {
        const clienteId = parseInt(e.target.value);
        if (!clienteId) return;
        const clientes = Store.getClientes();
        const cliente = clientes.find(c => c.IdCliente === clienteId);
        if (cliente && cliente.IdBarberoPreferido) {
            document.getElementById('res-barbero').value = cliente.IdBarberoPreferido;
        }
    });

    // Add Cliente
    document.getElementById('form-cliente').addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('cliente-nombre').value;
        const telefono = document.getElementById('cliente-telefono').value;
        const barberoPrefVal = document.getElementById('cliente-barbero-pref').value;
        const barberoPref = barberoPrefVal ? parseInt(barberoPrefVal) : null;
        
        const id = Store.getNextId('Clientes');
        const cliente = new Cliente(id, nombre, telefono, barberoPref);
        
        Store.addCliente(cliente);
        UI.displayClientes();
        UI.populateSelects();
        UI.closeModal('modal-cliente');
        e.target.reset();
    });

    // Add Barbero
    document.getElementById('form-barbero').addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('barbero-nombre').value;
        const edad = parseInt(document.getElementById('barbero-edad').value);
        const exp = parseInt(document.getElementById('barbero-exp').value);
        const telefono = document.getElementById('barbero-telefono').value;
        
        const id = Store.getNextId('Barberos');
        const barbero = new Barbero(id, nombre, edad, exp, telefono);
        
        Store.addBarbero(barbero);
        UI.displayBarberos();
        UI.populateSelects();
        UI.closeModal('modal-barbero');
        e.target.reset();
    });

    // Add Servicio
    document.getElementById('form-servicio').addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('servicio-nombre').value;
        const precio = parseFloat(document.getElementById('servicio-precio').value);
        
        const id = Store.getNextId('Servicios');
        const servicio = new Servicio(id, nombre, precio);
        
        Store.addServicio(servicio);
        UI.displayServicios();
        UI.populateSelects();
        UI.closeModal('modal-servicio');
        e.target.reset();
    });

    // Add Reservacion
    document.getElementById('form-reservacion').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const idCliente = parseInt(document.getElementById('res-cliente').value);
        const idBarbero = parseInt(document.getElementById('res-barbero').value);
        
        // Handle Multi-select for Services
        const selectServicios = document.getElementById('res-servicios');
        const idsServicios = Array.from(selectServicios.selectedOptions).map(opt => parseInt(opt.value));
        
        const fecha = document.getElementById('res-fecha').value;
        const hora = document.getElementById('res-hora').value;
        const estado = document.getElementById('res-estado').value;

        // Calculate Total Price
        const todosServicios = Store.getServicios();
        let precioTotal = 0;
        idsServicios.forEach(id => {
            const serv = todosServicios.find(s => s.IdServicios === id);
            if(serv) precioTotal += serv.Precio;
        });

        const id = Store.getNextId('Reservaciones');
        const reservacion = new Reservacion(id, idCliente, idBarbero, idsServicios, fecha, hora, estado, precioTotal);
        
        Store.addReservacion(reservacion);
        UI.displayReservaciones();
        UI.closeModal('modal-reservacion');
        e.target.reset();
    });

    // Click outside modal to close
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
        }
    }
});
