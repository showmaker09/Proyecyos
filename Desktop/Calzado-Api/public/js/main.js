
// public/js/main.js
// Este código es el archivo JavaScript principal para la gestión de usuarios y dueños en una aplicación web
// Permite crear, editar, eliminar y listar usuarios y dueños a través de una API RESTful

document.addEventListener('DOMContentLoaded', () => 
    {

    // --- Variables y Elementos del DOM para USUARIOS (Nombres originales del usuario) ---
    const userForm = document.getElementById('userForm');
    const userIdInput = document.getElementById('userId');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submitBtn'); // Mantenido como solicitado
    const clearFormBtn = document.getElementById('clearForm'); // Mantenido como solicitado
    const usersTableBody = document.getElementById('usersTableBody');
    const messageDisplay = document.getElementById('message'); // Mantenido como solicitado
    const loadUsersBtn = document.getElementById('loadUsersBtn'); // Nuevo botón para cargar usuarios

    const USER_API_URL = 'http://localhost:3000/api/users'; // URL de tu API para usuarios

    // --- Variables y Elementos del DOM para DUEÑOS (Nuevas variables) ---
    const ownerForm = document.getElementById('ownerForm');
    const ownerIdInput = document.getElementById('ownerId');
    const ownerNombreInput = document.getElementById('ownerNombre');
    const ownerGananciaInput = document.getElementById('ownerGanancia');
    const submitOwnerBtn = document.getElementById('submitOwnerBtn');
    const clearOwnerFormBtn = document.getElementById('clearOwnerForm');
    const ownersTableBody = document.getElementById('ownersTableBody');
    const ownerMessageDisplay = document.getElementById('ownerMessage'); // Mensaje específico para dueños

    const OWNER_API_URL = 'http://localhost:3000/api/duenos'; // ¡URL CORREGIDA para dueños!


    // --- Funciones de Utilidad Comunes ---
    // Esta función ahora acepta el elemento donde se mostrará el mensaje
    function showMessage(displayElement, msg, isError = false) {
        displayElement.textContent = msg;
        displayElement.className = 'message ' + (isError ? 'error' : 'success');
        displayElement.style.display = 'block';
        setTimeout(() => {
            displayElement.style.display = 'none';
        }, 3000);
    }

    // --- Lógica para USUARIOS ---
    function initUserCRUD() 
    {
        // Función para limpiar el formulario de usuario
        function clearUserForm() {
            userIdInput.value = '';
            nombreInput.value = '';
            emailInput.value = '';
            submitBtn.textContent = 'Crear Usuario';
            clearFormBtn.style.display = 'none';
        }

        // Cargar todos los usuarios
        async function fetchUsers() {
            try {
                const response = await fetch(USER_API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const users = await response.json();
                displayUsers(users);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
                // Usamos messageDisplay para mostrar el mensaje de error de usuario
                showMessage(messageDisplay, 'Error al cargar usuarios. La API podría no estar funcionando.', true);
                usersTableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos.</td></tr>';
            }
        }

        // Mostrar usuarios en la tabla
        function displayUsers(users) 
        {
            usersTableBody.innerHTML = ''; // Limpiar tabla
            if (users.length === 0) {
                usersTableBody.innerHTML = '<tr><td colspan="4">No hay usuarios registrados.</td></tr>';
                return;
            }
            users.forEach(user => {
                const row = usersTableBody.insertRow();
                row.insertCell().textContent = user.id;
                row.insertCell().textContent = user.nombre;
                row.insertCell().textContent = user.email;
                const actionsCell = row.insertCell();
                actionsCell.className = 'action-buttons';

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.className = 'edit-btn';
                editBtn.addEventListener('click', () => {
                    // Rellenar formulario para edición
                    userIdInput.value = user.id;
                    nombreInput.value = user.nombre;
                    emailInput.value = user.email;
                    submitBtn.textContent = 'Actualizar Usuario';
                    clearFormBtn.style.display = 'inline-block';
                });
                actionsCell.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => deleteUser(user.id));
                actionsCell.appendChild(deleteBtn);
            });
        }

        // Crear o Actualizar usuario
        userForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = userIdInput.value;
            const nombre = nombreInput.value;
            const email = emailInput.value;

            const userData = { nombre, email };

            try {
                let response;
                let method;
                let url;

                if (id) { // Actualizar
                    method = 'PUT';
                    url = `${USER_API_URL}/${id}`;
                } else { // Crear
                    method = 'POST';
                    url = USER_API_URL;
                }

                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const result = await response.json();
                if (!response.ok) 
                {
                    throw new Error(result.message || 'Error en la operación');
                }


                 // --- Lógica añadida para mostrar la sección de Dueños ---
                if (method === 'POST') 
                { // Solo si se creó un nuevo usuario
                    ownerSection.style.display = 'block';
                    currentUserNameSpan.textContent = result.nombre;
                    userIdForOwnerInput.value = result.id;
                    showMessage(messageDisplay, `Usuario creado. Ahora asigna un dueño a ${result.nombre}.`);
                } else 
               
              {
                    // Si se actualiza, simplemente muestra el mensaje y no afecta la sección de dueños
                    showMessage(messageDisplay, result.message || 'Usuario actualizado exitosamente.');
                }

                // Usamos messageDisplay para mostrar el mensaje de éxito/error de usuario
                showMessage(messageDisplay, result.message || 'Operación exitosa');
                clearUserForm();
                fetchUsers(); // Recargar la lista de usuarios
            } catch (error) {
                console.error('Error al guardar usuario:', error);
                showMessage(messageDisplay, `Error al guardar usuario: ${error.message}`, true);
            }
        });

        // Eliminar usuario
        async function deleteUser(id) {
            if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                return;
            }
            try {
                const response = await fetch(`${USER_API_URL}/${id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Error al eliminar');
                }
                showMessage(messageDisplay, result.message || 'Usuario eliminado');
                fetchUsers();
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                showMessage(messageDisplay, `Error al eliminar usuario: ${error.message}`, true);
            }
        }

        // Event listeners para los botones de usuario
        clearFormBtn.addEventListener('click', clearUserForm); // Mantenido como solicitado
        loadUsersBtn.addEventListener('click', fetchUsers); // Evento para el botón "Cargar Usuarios"

        // Carga inicial de usuarios (se mantiene para que se muestren al cargar la página)
        //fetchUsers();
    }

    // --- Lógica para DUEÑOS ---
    function initOwnerCRUD() 
    {
        // Función para limpiar el formulario de dueño
        function clearOwnerForm() {
            ownerIdInput.value = '';
            ownerNombreInput.value = '';
            ownerGananciaInput.value = '';
            submitOwnerBtn.textContent = 'Crear Dueño';
            clearOwnerFormBtn.style.display = 'none';
        }

        // Cargar todos los dueños
        async function fetchOwners() {
            try {
                const response = await fetch(OWNER_API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const owners = await response.json();
                displayOwners(owners);
            } catch (error) {
                console.error('Error al cargar dueños:', error);
                // Usamos ownerMessageDisplay para mostrar el mensaje de error de dueño
                showMessage(ownerMessageDisplay, 'Error al cargar dueños. La API podría no estar funcionando.', true);
                ownersTableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos.</td></tr>';
            }
        }

        // Mostrar dueños en la tabla
        function displayOwners(owners) {
            ownersTableBody.innerHTML = ''; // Limpiar tabla
            if (owners.length === 0) {
                ownersTableBody.innerHTML = '<tr><td colspan="4">No hay dueños registrados.</td></tr>';
                return;
            }
            owners.forEach(owner => {
                const row = ownersTableBody.insertRow();
                row.insertCell().textContent = owner.id;
                row.insertCell().textContent = owner.Nombre; // Usar 'Nombre' con N mayúscula
                row.insertCell().textContent = parseFloat(owner.Ganancia).toFixed(2); // Formatear Ganancia a 2 decimales
                const actionsCell = row.insertCell();
                actionsCell.className = 'action-buttons';

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.className = 'edit-btn';
                editBtn.addEventListener('click', () => {
                    ownerIdInput.value = owner.id;
                    ownerNombreInput.value = owner.Nombre; // Usar 'Nombre' con N mayúscula
                    ownerGananciaInput.value = owner.Ganancia; // Rellenar campo de Ganancia
                    submitOwnerBtn.textContent = 'Actualizar Dueño';
                    clearOwnerFormBtn.style.display = 'inline-block';
                });
                actionsCell.appendChild(editBtn);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => deleteOwner(owner.id));
                actionsCell.appendChild(deleteBtn);
            });
        }

        // Crear o Actualizar dueño
        ownerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = ownerIdInput.value;
            const Nombre = ownerNombreInput.value; // Usar 'Nombre' con N mayúscula
            const Ganancia = parseFloat(ownerGananciaInput.value); // Convertir a número flotante

            const ownerData = { Nombre, Ganancia }; // Objeto con los datos correctos para la API

            try {
                let response;
                let method;
                let url;

                if (id) { // Actualizar
                    method = 'PUT';
                    url = `${OWNER_API_URL}/${id}`;
                } else { // Crear
                    method = 'POST';
                    url = OWNER_API_URL;
                }

                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ownerData)
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Error en la operación de dueño');
                }

                // Usamos ownerMessageDisplay para mostrar el mensaje de éxito/error de dueño
                showMessage(ownerMessageDisplay, result.message || 'Operación de dueño exitosa');
                clearOwnerForm();
                fetchOwners(); // Recargar la lista de dueños
            } catch (error) {
                console.error('Error al guardar dueño:', error);
                showMessage(ownerMessageDisplay, `Error al guardar dueño: ${error.message}`, true);
            }
        });

        // Eliminar dueño
        async function deleteOwner(id) {
            if (!confirm('¿Estás seguro de que quieres eliminar este dueño?')) {
                return;
            }
            try {
                const response = await fetch(`${OWNER_API_URL}/${id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Error al eliminar dueño');
                }
                showMessage(ownerMessageDisplay, result.message || 'Dueño eliminado');
                fetchOwners();
            } catch (error) {
                console.error('Error al eliminar dueño:', error);
                showMessage(ownerMessageDisplay, `Error al eliminar dueño: ${error.message}`, true);
            }
        }

        // Event listener para el botón de limpiar formulario de dueño
        clearOwnerFormBtn.addEventListener('click', clearOwnerForm);

        // Carga inicial de dueños (se mantiene para que se muestren al cargar la página)
       // fetchOwners();
    }

    // --- Inicializar ambas lógicas CRUD al cargar el DOM ---
    initUserCRUD();
    initOwnerCRUD();
});
