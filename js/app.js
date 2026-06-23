const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const searchBar = document.getElementById('search-bar');

const matchSelect = document.getElementById('task-title');       
const userInput = document.getElementById('task-user');
const userConfirmInput = document.getElementById('task-user-confirm');          
const forecastSelect = document.getElementById('task-priority');   
const amountInput = document.getElementById('task-date');         

let partidosDisponibles = []; 
let ticketsApuestas = [];

function cargarPartidosMundial() {
    fetch('js/partidos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al leer el archivo de partidos');
            }
            return response.json();
        })
        .then(data => {
            partidosDisponibles = data;
            poblarSelectPartidos();
        })
        .catch(error => {
            console.error('Error crítico en Fetch:', error);
            matchSelect.innerHTML = '<option value="">Error al cargar fixture</option>';
        });
}

function poblarSelectPartidos() {
    matchSelect.innerHTML = '<option value="">-- Seleccione el encuentro --</option>';
    
    partidosDisponibles.forEach(partido => {
        const option = document.createElement('option');
        option.value = partido.id;
        
        option.text = `${partido.equipo_local} (Local) vs ${partido.equipo_visita} (Visita)`;
        
        matchSelect.appendChild(option);
    });
}

function validateForm() {
    let isValid = true;

    if (matchSelect.value === "") {
        showError(matchSelect, 'error-title', 'Debes seleccionar un partido del fixture.');
        isValid = false;
    } else {
        showSuccess(matchSelect, 'error-title');
    }

    const nameRegex = /^[a-zA-ZÀ-ÿ]+\s[a-zA-ZÀ-ÿ]+$/;
    if (userInput.value.trim() === "") {
        showError(userInput, 'error-user', 'El nombre del jugador es obligatorio.');
        isValid = false;
    } 
    else if (userInput.value.trim().length < 8) {
        showError(userInput, 'error-user', 'El nombre completo debe tener al menos 8 caracteres.');
        isValid = false;
    } 
    else if (!nameRegex.test(userInput.value.trim())) {
        showError(userInput, 'error-user', 'Escribe tu Nombre y Apellido (ej. Arturo Vidal).');
        isValid = false;
    } else {
        showSuccess(userInput, 'error-user');
    }

    if (userConfirmInput.value.trim() === "") {
        showError(userConfirmInput, 'error-user-confirm', 'Por favor, confirma el nombre del jugador.');
        isValid = false;
    } else if (userInput.value.trim() !== userConfirmInput.value.trim()) {
        showError(userConfirmInput, 'error-user-confirm', 'Los nombres ingresados no coinciden.');
        isValid = false;
    } else {
        showSuccess(userConfirmInput, 'error-user-confirm');
    }

    if (forecastSelect.value === "") {
        showError(forecastSelect, 'error-priority', 'Elige una de las predicciones.');
        isValid = false;
    } else {
        showSuccess(forecastSelect, 'error-priority');
    }

    const monto = parseInt(amountInput.value);
    if (isNaN(monto) || amountInput.value.trim() === "") {
        showError(amountInput, 'error-date', 'El monto a apostar es obligatorio.');
        isValid = false;
    } else if (monto < 1000) {
        showError(amountInput, 'error-date', 'El monto mínimo permitido es de $1.000 CLP.');
        isValid = false;
    } else if (monto > 200000) {
        showError(amountInput, 'error-date', 'Por seguridad, el monto máximo es de $200.000 CLP.');
        isValid = false;
    } else {
        showSuccess(amountInput, 'error-date');
    }

    return isValid;
}

function showError(element, idError, mensaje) {
    element.classList.add('invalid');
    element.classList.remove('valid');
    document.getElementById(idError).textContent = mensaje;
}

function showSuccess(element, idError) {
    element.classList.remove('invalid');
    element.classList.add('valid');
    document.getElementById(idError).textContent = '';
}

function renderTickets(filterText = '') {
    taskList.innerHTML = ''; 

    const filtrados = ticketsApuestas.filter(ticket => 
        ticket.matchText.toLowerCase().includes(filterText.toLowerCase()) ||
        ticket.user.toLowerCase().includes(filterText.toLowerCase())
    );

    filtrados.forEach(ticket => {
        const li = document.createElement('li');
        const classFormat = ticket.forecast.toLowerCase().replace(/\s+/g, '-');
        li.className = `task-item ${classFormat}`;

        const gananciaEstimada = Math.round(ticket.amount * ticket.cuotaUsada);

        li.innerHTML = `
            <div class="ticket-info">
                <span class="ticket-match"> ${ticket.matchText}</span>
                <div class="ticket-details-row">
                    <div>Jugador: <span class="ticket-badge"> ${ticket.user}</span></div>
                    <div>Predicción: <span class="ticket-badge ticket-badge-prediction">${ticket.forecast}</span></div>
                </div>
            </div>
            <div class="ticket-financials">
                <div class="ticket-amount-box">
                    <span>Monto Apostado</span>
                    <strong>$${ticket.amount.toLocaleString('es-CL')}</strong>
                </div>
                <div class="ticket-actions">
                    <div class="ticket-return-box">
                        <span>Retorno Estimado</span>
                        <em>$${gananciaEstimada.toLocaleString('es-CL')}</em>
                    </div>
                    <button class="btn-delete" data-id="${ticket.id}">Quitar</button>
                </div>
            </div>
        `;

        taskList.appendChild(li);
    });
}


taskForm.addEventListener('submit', function(e) {
    e.preventDefault(); 

    if (validateForm()) {

        const partidoSeleccionado = partidosDisponibles.find(p => p.id === parseInt(matchSelect.value));
        
        let cuotaAsignada = 2.00; 
        if (forecastSelect.value === "Gana Local") cuotaAsignada = partidoSeleccionado.cuota_local;
        if (forecastSelect.value === "Gana Visita") cuotaAsignada = partidoSeleccionado.cuota_visita;

        const nuevoTicket = {
            id: Date.now(),
            matchText: `${partidoSeleccionado.equipo_local} vs ${partidoSeleccionado.equipo_visita}`,
            user: userInput.value.trim(),
            forecast: forecastSelect.value,
            amount: parseInt(amountInput.value),
            cuotaUsada: cuotaAsignada
        };

        ticketsApuestas.push(nuevoTicket);
        
        renderTickets();
        taskForm.reset();

        [matchSelect, userInput, forecastSelect, amountInput].forEach(el => el.classList.remove('valid'));
    }
});

searchBar.addEventListener('input', function(e) {
    renderTickets(e.target.value);
});

taskList.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const idEliminar = parseInt(e.target.getAttribute('data-id'));
        
        ticketsApuestas = ticketsApuestas.filter(t => t.id !== idEliminar);
        
        renderTickets();
    }
});

document.addEventListener('DOMContentLoaded', cargarPartidosMundial);