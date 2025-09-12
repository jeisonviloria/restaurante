// Datos de las mesas
let tables = [
    { id: 1, number: 1, capacity: 2 },
    { id: 2, number: 2, capacity: 2 },
    { id: 3, number: 3, capacity: 4 },
    { id: 4, number: 4, capacity: 4 },
    { id: 5, number: 5, capacity: 6 },
    { id: 6, number: 6, capacity: 6 },
    { id: 7, number: 7, capacity: 4 },
    { id: 8, number: 8, capacity: 4 },
    { id: 9, number: 9, capacity: 8 },
    { id: 10, number: 10, capacity: 2 },
    { id: 11, number: 11, capacity: 2 },
    { id: 12, number: 12, capacity: 4 },
];

// Almacena las reservas por fecha
let reservations = [];

// Fecha seleccionada para mostrar las reservas (por defecto es hoy)
let selectedDate = new Date().toISOString().split('T')[0];

// Estructura del menú
const menu = {
    entrantes: [
        { name: "CARPACCIO DE RES", price: 32000, description: "Finas láminas de res madurada, aceite de oliva, alcaparras y parmesano" },
        { name: "PULPO AL CARBÓN", price: 42000, description: "Pulpo cocinado lentamente y finalizado al carbón con papas crujientes y pimentón ahumado" },
        { name: "BURRATA ARTESANAL", price: 36000, description: "Queso burrata con tomates cherry confitados, rúgula y reducción balsámica" }
    ],
    principales: [
        { name: "COSTILLA BBQ", price: 58000, description: "Costilla de cerdo cocida por 12 horas con salsa BBQ casera y puré de papa trufado" },
        { name: "TOMAHAWK", price: 120000, description: "Corte premium de res madurada (800g) cocinada al carbón con papas rústicas y chimichurri" },
        { name: "SALMÓN A LA PIEDRA", price: 54000, description: "Lomo de salmón sobre piedra caliente con vegetales salteados y salsa de eneldo" }
    ],
    postres: [
        { name: "COULANT DE CHOCOLATE", price: 22000, description: "Bizcocho caliente de chocolate con interior fundido y helado de vainilla" },
        { name: "PAVLOVA DE FRUTOS ROJOS", price: 19000, description: "Merengue crujiente con crema montada y selección de frutos rojos" }
    ],
    bebidas: [
        { name: "VINO TINTO MALBEC", price: 28000, description: "Copa de vino argentino con notas de frutas negras y especias" },
        { name: "COCTEL BÁRBARO", price: 32000, description: "Whisky bourbon, naranja ahumada, angostura y jarabe de canela" },
        { name: "LIMONADA DE COCO", price: 16000, description: "Refrescante mezcla de limón, crema de coco y hierbabuena" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // Establecer la fecha de hoy como predeterminada en el formulario
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservationDate').value = today;
    document.getElementById('reservationDate').min = today;
    
    // Actualizar la fecha seleccionada para mostrar las reservas
    selectedDate = today;
    
    renderTables();
    renderMenu();
    document.getElementById('reserveButton').addEventListener('click', reserveTable);
    document.getElementById('reportButton').addEventListener('click', generateReport);
    
    // Añadir efectos de scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Añadir evento para cambiar la fecha de visualización
    document.getElementById('reservationDate').addEventListener('change', function() {
        selectedDate = this.value;
        renderTables();
    });
});

function renderTables() {
    const availableTablesDiv = document.getElementById('availableTables');
    const occupiedTablesDiv = document.getElementById('occupiedTables');
    availableTablesDiv.innerHTML = '';
    occupiedTablesDiv.innerHTML = '';
    
    // Actualizar el indicador de fecha seleccionada
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedSelectedDate = new Date(selectedDate).toLocaleDateString('es-ES', dateOptions);
    selectedDateDisplay.textContent = `- ${formattedSelectedDate}`;
    
    // Filtrar reservas para la fecha seleccionada
    const reservationsForDate = reservations.filter(res => res.rawDate === selectedDate);

    // Mostrar todas las mesas, algunas estarán reservadas según la fecha
    tables.forEach(table => {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table';
        
        // Verificar si la mesa está reservada en la fecha seleccionada
        const isReserved = reservationsForDate.some(res => res.tableNumber === table.number);
        
        if (isReserved) {
            // Mesa reservada para esta fecha
            const reservation = reservationsForDate.find(res => res.tableNumber === table.number);
            tableDiv.innerHTML = `
                <img src="img/mesa-reservada.jpg" alt="Mesa ${table.number}">
                <div class="table-name">Mesa ${table.number} - ${reservation.customerName}</div>
                <div class="table-time">${reservation.formattedTime}</div>
            `;
            occupiedTablesDiv.appendChild(tableDiv);
        } else {
            // Mesa disponible para esta fecha
            tableDiv.innerHTML = `
                <img src="img/mesa.jpg" alt="Mesa ${table.number}">
                <div class="table-name">Mesa ${table.number}</div>
                <div class="table-capacity">${table.capacity} personas</div>
            `;
            availableTablesDiv.appendChild(tableDiv);
        }
    });
}

function reserveTable() {
    const customerName = document.getElementById('customerName').value.trim();
    const tableNumber = parseInt(document.getElementById('tableNumber').value);
    const reservationDate = document.getElementById('reservationDate').value;
    const reservationTime = document.getElementById('reservationTime').value;
    
    if (!customerName || isNaN(tableNumber)) {
        alert('Por favor ingresa el nombre y el número de mesa.');
        return;
    }
    
    if (!reservationDate) {
        alert('Por favor selecciona una fecha para tu reserva.');
        return;
    }
    
    if (!reservationTime) {
        alert('Por favor selecciona una hora para tu reserva.');
        return;
    }
    
    // Verificar si la fecha es válida (no pasada)
    const reservationDateTime = new Date(reservationDate + 'T' + reservationTime);
    const now = new Date();
    
    if (reservationDateTime < now) {
        alert('Por favor selecciona una fecha y hora futura para tu reserva.');
        return;
    }
    
    // Verificar si la mesa existe
    const tableExists = tables.some(t => t.number === tableNumber);
    if (!tableExists) {
        alert('El número de mesa no es válido.');
        return;
    }
    
    // Verificar si la mesa ya está reservada para esa fecha
    const isReserved = reservations.some(
        r => r.tableNumber === tableNumber && r.rawDate === reservationDate
    );
    
    if (isReserved) {
        alert(`Lo sentimos, la Mesa ${tableNumber} ya está reservada para esa fecha. Por favor selecciona otra mesa o fecha.`);
        return;
    }
    
    // Formatear fecha y hora para mostrar
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(reservationDate).toLocaleDateString('es-ES', dateOptions);
    const formattedTime = reservationTime.split(':')[0] >= 12 ? 
                         (reservationTime.split(':')[0] > 12 ? 
                          (reservationTime.split(':')[0] - 12) : reservationTime.split(':')[0]) + ':' + 
                          reservationTime.split(':')[1] + ' PM' : 
                          reservationTime + ' AM';
    
    // Crear la nueva reserva
    reservations.push({ 
        id: Date.now(), // ID único para la reserva
        tableNumber: tableNumber,
        customerName: customerName,
        formattedDate: formattedDate,
        formattedTime: formattedTime,
        rawDate: reservationDate,
        rawTime: reservationTime
    });
    
    // Actualizar la visualización de las mesas
    renderTables();
    
    // Limpiar campos del formulario
    document.getElementById('customerName').value = '';
    document.getElementById('tableNumber').value = '';
    
    // Mantener la fecha seleccionada para que el usuario pueda hacer más reservas en la misma fecha
    
    alert(`¡Reserva exitosa!\nMesa ${tableNumber} reservada para ${customerName}\nFecha: ${formattedDate}\nHora: ${formattedTime}`);
}

function generateReport() {
    let report = '';
    
    if (reservations.length === 0) {
        report = 'No hay reservas activas.';
    } else {
        // Ordenar reservas por fecha y hora
        const sortedReservations = [...reservations].sort((a, b) => {
            const dateA = new Date(a.rawDate + 'T' + a.rawTime);
            const dateB = new Date(b.rawDate + 'T' + b.rawTime);
            return dateA - dateB;
        });
        
        // Agrupar reservas por fecha
        const reservationsByDate = {};
        
        sortedReservations.forEach(reservation => {
            if (!reservationsByDate[reservation.rawDate]) {
                reservationsByDate[reservation.rawDate] = [];
            }
            reservationsByDate[reservation.rawDate].push(reservation);
        });
        
        // Crear reporte agrupado por fecha
        const reportParts = [];
        
        for (const [date, dateReservations] of Object.entries(reservationsByDate)) {
            const formattedDate = dateReservations[0].formattedDate;
            
            const reservationsText = dateReservations.map(res => 
                `   Mesa ${res.tableNumber}: ${res.customerName} - ${res.formattedTime}`
            ).join('\n');
            
            reportParts.push(`FECHA: ${formattedDate}\n${reservationsText}`);
        }
        
        report = reportParts.join('\n\n');
    }
    
    document.getElementById('reportOutput').textContent = report;
}

// Función para renderizar el menú
function renderMenu() {
    const menuContainer = document.getElementById('menuContainer');
    if (!menuContainer) return;
    
    menuContainer.innerHTML = '';
    
    // Crear secciones del menú
    for (const [category, items] of Object.entries(menu)) {
        // Crear encabezado de categoría
        const categorySection = document.createElement('div');
        categorySection.className = 'menu-section';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'menu-category';
        
        // Traducir nombres de categorías
        let categoryName;
        switch(category) {
            case 'entrantes': categoryName = 'ENTRANTES'; break;
            case 'principales': categoryName = 'PLATOS PRINCIPALES'; break;
            case 'postres': categoryName = 'POSTRES'; break;
            case 'bebidas': categoryName = 'BEBIDAS'; break;
            default: categoryName = category.toUpperCase();
        }
        
        categoryTitle.textContent = categoryName;
        categorySection.appendChild(categoryTitle);
        
        // Crear lista de platos
        const menuItemsList = document.createElement('div');
        menuItemsList.className = 'menu-items';
        
        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            
            const itemHeader = document.createElement('div');
            itemHeader.className = 'menu-item-header';
            
            const itemName = document.createElement('h4');
            itemName.textContent = item.name;
            
            const itemPrice = document.createElement('span');
            itemPrice.className = 'price';
            itemPrice.textContent = `$${item.price.toLocaleString()}`;
            
            itemHeader.appendChild(itemName);
            itemHeader.appendChild(itemPrice);
            
            const itemDescription = document.createElement('p');
            itemDescription.textContent = item.description;
            
            menuItem.appendChild(itemHeader);
            menuItem.appendChild(itemDescription);
            
            menuItemsList.appendChild(menuItem);
        });
        
        categorySection.appendChild(menuItemsList);
        menuContainer.appendChild(categorySection);
    }
}
