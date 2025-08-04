
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
  

   // 


    // variables y elementos para anticipo
    // ¡URL CORREGIDA para anticipos!



    




    // variables y elementos para clientes

    

    // variables y elementos para materiales

   
    
    
    // variables y elementos para montos

   
    
    
    // variables y elementos para pagos
    const pagoForm = document.getElementById('pagoForm');
    const pagoIdInput = document.getElementById('pagoId');
    const pagoMontoInput = document.getElementById('pagoMonto');
    const submitPagoBtn = document.getElementById('submitPagoBtn');
    const clearPagoFormBtn = document.getElementById('clearPagoForm');
    const pagosTableBody = document.getElementById('pagosTableBody');
    const pagoMessageDisplay = document.getElementById('pagoMessage'); // Mensaje específico para pagos

    const PAGO_API_URL = 'http://localhost:3000/api/pagos'; // ¡URL CORREGIDA para pagos!

   
    // variables y elementos para reparaciones
    const reparacionForm = document.getElementById('reparacionForm');
    const reparacionIdInput = document.getElementById('reparacionId');
    const reparacionDescripcionInput = document.getElementById('reparacionDescripcion');
    const reparacionCostoInput = document.getElementById('reparacionCosto');
    const submitReparacionBtn = document.getElementById('submitReparacionBtn');
    const clearReparacionFormBtn = document.getElementById('clearReparacionForm');
    const reparacionesTableBody = document.getElementById('reparacionesTableBody');
    const reparacionMessageDisplay = document.getElementById('reparacionMessage'); // Mensaje específico para reparaciones

    const REPARACION_API_URL = 'http://localhost:3000/api/reparaciones'; // ¡URL CORREGIDA para reparaciones!

    // variables y elementos para servicios
    const servicioForm = document.getElementById('servicioForm');
    const servicioIdInput = document.getElementById('servicioId');
    const servicioDescripcionInput = document.getElementById('servicioDescripcion');
    const servicioCostoInput = document.getElementById('servicioCosto');
    const submitServicioBtn = document.getElementById('submitServicioBtn');
    const clearServicioFormBtn = document.getElementById('clearServicioForm');
    const serviciosTableBody = document.getElementById('serviciosTableBody');
    const servicioMessageDisplay = document.getElementById('servicioMessage'); // Mensaje específico para servicios

    const SERVICIO_API_URL = 'http://localhost:3000/api/servicios'; // ¡URL CORREGIDA para servicios!




    // variables y elementos para tipos
    const tipoForm = document.getElementById('tipoForm');
    const tipoIdInput = document.getElementById('tipoId');
    const tipoNombreInput = document.getElementById('tipoNombre');
    const submitTipoBtn = document.getElementById('submitTipoBtn');
    const clearTipoFormBtn = document.getElementById('clearTipoForm');
    const tiposTableBody = document.getElementById('tiposTableBody');
    const tipoMessageDisplay = document.getElementById('tipoMessage'); // Mensaje específico para tipos

    const TIPO_API_URL = 'http://localhost:3000/api/tipos'; // ¡URL CORREGIDA para tipos!

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
        function clearUserForm()
         {
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
        userForm.addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            const id = userIdInput.value;
            const nombre = nombreInput.value;
            const email = emailInput.value;

            const userData = { nombre, email };

            try {
                let response;
                let method;
                let url;

                if (id) 
                { // Actualizar
                    method = 'PUT';
                    url = `${USER_API_URL}/${id}`;
                }
                 else 

                { // Crear
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
    function initOwnerCRUD()  // ESTA ES FUNCIÓN PARA LA LÓGICA DE DUEÑOS
    {
        // Función para limpiar el formulario de dueño
        function clearOwnerForm() 
        {
            ownerIdInput.value = '';
            ownerNombreInput.value = '';
            ownerGananciaInput.value = '';
            submitOwnerBtn.textContent = 'Crear Dueño';
            clearOwnerFormBtn.style.display = 'none';
        }

        // Cargar todos los dueños
        async function fetchOwners() 
        {
            try 
            {
                const response = await fetch(OWNER_API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const owners = await response.json();
                displayOwners(owners);
            }
             catch (error) 
            {
                console.error('Error al cargar dueños:', error);
                // Usamos ownerMessageDisplay para mostrar el mensaje de error de dueño
                showMessage(ownerMessageDisplay, 'Error al cargar dueños. La API podría no estar funcionando.', true);
                ownersTableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos.</td></tr>';
            }
        }

        // Mostrar dueños en la tabla
        function displayOwners(owners) 
        {
            ownersTableBody.innerHTML = ''; // Limpiar tabla
            if (owners.length === 0) {
                ownersTableBody.innerHTML = '<tr><td colspan="4">No hay dueños registrados.</td></tr>';
                return;
            }
            owners.forEach(owner => 
            {
                const row = ownersTableBody.insertRow();
                row.insertCell().textContent = owner.id;
                row.insertCell().textContent = owner.Nombre; // Usar 'Nombre' con N mayúscula
                row.insertCell().textContent = parseFloat(owner.Ganancia).toFixed(2); // Formatear Ganancia a 2 decimales
                const actionsCell = row.insertCell(); // Crear celda para acciones que realizarán los botones
                actionsCell.className = 'action-buttons'; // Añadir clase para estilos que realizan los botones

                const editBtn = document.createElement('button'); //  esto realiza el botón de editar que encontramos en la tabla
                editBtn.textContent = 'Editar'; // esto es el texto que se muestra en el botón
                editBtn.className = 'edit-btn'; // Añadir clase para estilos del botón que es editar
                editBtn.addEventListener('click', () => // Añadir evento de clic al botón de editar
                {
                    ownerIdInput.value = owner.id;
                    ownerNombreInput.value = owner.Nombre; // Usar 'Nombre' con N mayúscula
                    ownerGananciaInput.value = owner.Ganancia; // Rellenar campo de Ganancia
                    submitOwnerBtn.textContent = 'Actualizar Dueño'; // Cambiar texto del botón a "Actualizar Dueño"    
                    clearOwnerFormBtn.style.display = 'inline-block'; // Mostrar botón de limpiar formulario
                });
                actionsCell.appendChild(editBtn); // Crear botón de editar esto realiza el botón de editar que encontramos en la tabla

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => deleteOwner(owner.id));
                actionsCell.appendChild(deleteBtn);
            });
        }

        // Crear o Actualizar dueño
        ownerForm.addEventListener('submit', async (e) => 
            {
            e.preventDefault(); // ESTO PREVIENE QUE SE RECARGUE LA PÁGINA AL ENVIAR EL FORMULARIO
            const Nombre = ownerNombreInput.value; // Usar 'Nombre' con N mayúscula
            const Ganancia = parseFloat(ownerGananciaInput.value); // Convertir a número flotante

            const ownerData = { Nombre, Ganancia }; // Objeto con los datos correctos para la API

            try 
            {
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

                response = await fetch(url, 
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(ownerData)
                });

                const result = await response.json();
                if (!response.ok) 
                {
                    throw new Error(result.message || 'Error en la operación de dueño');
                }

                // Usamos ownerMessageDisplay para mostrar el mensaje de éxito/error de dueño
                showMessage(ownerMessageDisplay, result.message || 'Operación de dueño exitosa');
                clearOwnerForm();
                fetchOwners(); // Recargar la lista de dueños
            } 
           catch (error) 
            
            {
                console.error('Error al guardar dueño:', error);
                showMessage(ownerMessageDisplay, `Error al guardar dueño: ${error.message}`, true);
            }
        });

        // Eliminar dueño
        async function deleteOwner(id) 
        {
            if (!confirm('¿Estás seguro de que quieres eliminar este dueño?')) 
            {
                return;
            }
            try 
            {
                const response = await fetch(`${OWNER_API_URL}/${id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Error al eliminar dueño');
                }
                showMessage(ownerMessageDisplay, result.message || 'Dueño eliminado');
                fetchOwners();
            } 
            catch (error) 
            {
                console.error('Error al eliminar dueño:', error);
                showMessage(ownerMessageDisplay, `Error al eliminar dueño: ${error.message}`, true);
            }
        }

        // Event listener para el botón de limpiar formulario de dueño
        clearOwnerFormBtn.addEventListener('click', clearOwnerForm);

        // Carga inicial de dueños (se mantiene para que se muestren al cargar la página)
       // fetchOwners();
    }


    // --- Lógica para ANTICIPOS ---
    function initAnticipoCRUD() 
    {   
    const anticipoForm = document.getElementById('anticipoForm');
    const anticipoIdInput = document.getElementById('anticipoId');
    const anticipoCantidadInput = document.getElementById('anticipoCantidad'); // Cambiado a cantidad
    const submitAnticipoBtn = document.getElementById('submitAnticipoBtn');
    const clearAnticipoFormBtn = document.getElementById('clearAnticipoForm');
    const anticiposTableBody = document.getElementById('anticiposTableBody');
    const anticipoMessageDisplay = document.getElementById('anticipoMessage'); // Mensaje específico para anticipos

    const ANTICIPO_API_URL = 'http://localhost:3000/api/anticipos';

        
        // Función para limpiar el formulario de anticipo
        function clearAnticipoForm() 
        {
            anticipoIdInput.value = '';
            anticipoCantidadInput.value = '';
            submitAnticipoBtn.textContent = 'Crear Anticipo';
            clearAnticipoFormBtn.style.display = 'none';
        }

        // Cargar todos los anticipos
        async function fetchAnticipos() 
        {
            try {
                const response = await fetch(ANTICIPO_API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const anticipos = await response.json();
                displayAnticipos(anticipos);
            } catch (error) {
                console.error('Error al cargar anticipos:', error);
                showMessage(anticipoMessageDisplay, 'Error al cargar anticipos. La API podría no estar funcionando.', true);
                anticiposTableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos.</td></tr>';
            }
        }

        // Mostrar anticipos en la tabla
        function displayAnticipos(anticipos) 
        {
            anticiposTableBody.innerHTML = ''; // Limpiar tabla
            if (anticipos.length === 0) 
            {
                anticiposTableBody.innerHTML = '<tr><td colspan="4">No hay anticipos registrados.</td></tr>';
                return;
            }
            anticipos.forEach(anticipo => 
           {
                const row = anticiposTableBody.insertRow();
                row.insertCell().textContent = anticipo.id_anticipo; // Usar id_anticipo
                row.insertCell().textContent = parseInt(anticipo.Monto).toFixed(2); // A dos decimales
                const actionsCell = row.insertCell();
                actionsCell.className = 'action-buttons';

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.className = 'edit-btn'; // Añadir clase para estilos del botón que es editar

           
                editBtn.addEventListener('click', () => // Añadir evento de clic al botón de editar
                    {
                    anticipoIdInput.value = anticipo.id_anticipo; // Usar id_anticipo para el campo de ID
                    anticipoCantidadInput.value = anticipo.cantidad; // Rellenar campo de Cantidad
                    submitAnticipoBtn.textContent = 'Actualizar Anticipo'; // Cambiar texto del botón a "Actualizar Anticipo"
                    clearAnticipoFormBtn.style.display = 'inline-block'; // Mostrar botón de limpiar formulario
           
                     });
                actionsCell.appendChild(editBtn); // Crear botón de editar esto realiza el botón de editar que encontramos en la tabla
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.className = 'delete-btn';
                deleteBtn.addEventListener('click', () => deleteAnticipo(anticipo.id_anticipo)); // Usar id_anticipo para eliminar
                actionsCell.appendChild(deleteBtn);
                

            });

        }




        // Crear o Actualizar anticipo
        anticipoForm.addEventListener('submit', async (e) =>
        {
           e.preventDefault();
           const id = anticipoIdInput.value; // REVISAR SI LA ID PERMANECE DE ESTA FORMA O SE CAMBIA EN anticipoData
           const cantidad = parseFloat(anticipoCantidadInput.value); // Convertir a número flotante
           const anticipoData = { id_anticipo: id, cantidad: cantidad }; // !ATENCION AQUI SI HAY ERROR REVISA AQUI   


         // Objeto con los datos correctos para la API
            try 
            {
                let response;
                let method;
                let url;

                if (id) 
                { // Actualizar
                    method = 'PUT';
                    url = `${ANTICIPO_API_URL}/${id}`; // Siempre actualizar la url 
                } else { // Crear
                    method = 'POST';
                    url = ANTICIPO_API_URL;
                }
                
                response = await fetch(url, 
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(anticipoData)
                });

                const result = await response.json();
                if (!response.ok) 
                {
                    throw new Error(result.message || 'Error en la operación de anticipo');
                }

              // Usamos anticipoMessageDisplay para mostrar el mensaje de éxito/error de anticipo
                showMessage(anticipoMessageDisplay, result.message || 'Operación de anticipo exitosa');
                clearAnticipoForm();
                fetchAnticipos(); // Recargar la lista de anticipos

            }

            catch (error)

            {
              console.error('Error al guardar anticipo:', error);
              showMessage(anticipoMessageDisplay, `Error al guardar anticipo: ${error.message}`, true);
            }

        });
        // Eliminar anticipo
        async function deleteAnticipo(id)
        {
            try
            {
                const response = await fetch(`${ANTICIPO_API_URL}/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();
                if (!response.ok)
                {
                    throw new Error(result.message || 'Error al eliminar anticipo');
                }

                showMessage(anticipoMessageDisplay, result.message || 'Anticipo eliminado con éxito');
                fetchAnticipos(); // Recargar la lista de anticipos
            }
            catch (error)
            {
                console.error('Error al eliminar anticipo:', error);
                showMessage(anticipoMessageDisplay, `Error al eliminar anticipo: ${error.message}`, true);
            }
        }

        
    }



    // --- Lógica para ARTICULOS ---

    // --- Lógica para ARTICULOS ---
function initArticuloCRUD() 
{ 

    // Variables y Elementos del DOM para ARTICULOS
    const articuloForm = document.getElementById('articuloForm');
    const articuloIdInput = document.getElementById('articuloId');
    const articuloTipoInput = document.getElementById('articuloTipo');
    const articuloClienteInput = document.getElementById('articuloCliente');
    const articuloDescripcionInput = document.getElementById('articuloDescripcion');
    const submitArticuloBtn = document.getElementById('submitArticuloBtn');
    const clearArticuloFormBtn = document.getElementById('clearArticuloForm');
    const articulosTableBody = document.getElementById('articulosTableBody');
    const articuloMessageDisplay = document.getElementById('articuloMessage');

    const ARTICULO_API_URL = 'http://localhost:3000/api/articulos'; // URL de la API para artículos

    
    // Función para limpiar el formulario de artículo
    function clearArticuloForm() 
    {
        articuloIdInput.value = '';
        articuloTipoInput.value = '';
        articuloClienteInput.value = '';
        articuloDescripcionInput.value = '';
        submitArticuloBtn.textContent = 'Crear Artículo';
        clearArticuloFormBtn.style.display = 'none';
    }

    // Cargar todos los artículos
    async function fetchArticulos() 
    {
        try 
        {
            const response = await fetch(ARTICULO_API_URL);
            if (!response.ok) 
            {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const articulos = await response.json();
            displayArticulos(articulos);
        } catch (error) 
        {
            console.error('Error al cargar artículos:', error);
            showMessage(articuloMessageDisplay, 'Error al cargar artículos. La API podría no estar funcionando.', true);
            articulosTableBody.innerHTML = '<tr><td colspan="5">Error al cargar los datos.</td></tr>';
        }
    }

    // Mostrar artículos en la tabla
    function displayArticulos(articulos) 
    {
        articulosTableBody.innerHTML = ''; // Limpiar tabla
        if (articulos.length === 0) 
        {
            articulosTableBody.innerHTML = '<tr><td colspan="5">No hay artículos registrados.</td></tr>';
            return;
        }
        articulos.forEach(articulo => 
        {
            const row = articulosTableBody.insertRow();
            row.insertCell().textContent = articulo.id_Articulo;
            row.insertCell().textContent = articulo.id_Tipo;
            row.insertCell().textContent = articulo.id_cliente; // debe estasr en minúscula porque es el nombre de la columna en la base de datos
            row.insertCell().textContent = articulo.Descripcion;
            const actionsCell = row.insertCell();
            actionsCell.className = 'action-buttons';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => 
            {
                articuloIdInput.value = articulo.id_Articulo;
                articuloTipoInput.value = articulo.id_Tipo;
                articuloClienteInput.value = articulo.id_cliente;
                articuloDescripcionInput.value = articulo.Descripcion;
                submitArticuloBtn.textContent = 'Actualizar Artículo';
                clearArticuloFormBtn.style.display = 'inline-block';
            });
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteArticulo(articulo.id_Articulo));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Crear o Actualizar artículo
    articuloForm.addEventListener('submit', async (e) => 
    {
        e.preventDefault();
        const id = articuloIdInput.value;
        const id_Tipo = articuloTipoInput.value;
        const id_cliente = articuloClienteInput.value;
        const Descripcion = articuloDescripcionInput.value;

        // El objeto de datos se crea con los nuevos campos
        const articuloData = { id_Tipo, id_cliente, Descripcion };

        try 
        {
            let response;
            let method;
            let url;

            if (id) { // Actualizar
                method = 'PUT';
                url = `${ARTICULO_API_URL}/${id}`;
            } else { // Crear
                method = 'POST';
                url = ARTICULO_API_URL;
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(articuloData)
            });

            const result = await response.json();
            if (!response.ok) 
            {
                throw new Error(result.message || 'Error en la operación de artículo');
            }

            showMessage(articuloMessageDisplay, result.message || 'Operación de artículo exitosa');
            clearArticuloForm();
            fetchArticulos(); // Recargar la lista de artículos
        } catch (error) 
        {
            console.error('Error al guardar artículo:', error);
            showMessage(articuloMessageDisplay, `Error al guardar artículo: ${error.message}`, true);
        }
    });

    // Eliminar artículo
    async function deleteArticulo(id) 
    {
        if (!confirm('¿Estás seguro de que quieres eliminar este artículo?')) 
        {
            return;
        }
        try 
        {
            const response = await fetch(`${ARTICULO_API_URL}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!response.ok) 
            {
                throw new Error(result.message || 'Error al eliminar artículo');
            }
            showMessage(articuloMessageDisplay, result.message || 'Artículo eliminado con éxito');
            fetchArticulos(); // Recargar la lista de artículos
        } catch (error) 
        {
            console.error('Error al eliminar artículo:', error);
            showMessage(articuloMessageDisplay, `Error al eliminar artículo: ${error.message}`, true);
        }
    }

    // Event listener para el botón de limpiar formulario de artículo
    clearArticuloFormBtn.addEventListener('click', clearArticuloForm);

    // Carga inicial de artículos
    fetchArticulos();
}




 // --- Lógica para CLIENTES ---
function initClienteCRUD() 
{
    // Variables y Elementos del DOM para CLIENTES
    const clienteForm = document.getElementById('clienteForm');
    const clienteIdInput = document.getElementById('clienteId');
    const clienteNombreInput = document.getElementById('clienteNombre');
    const clienteAnticipoInput = document.getElementById('clienteAnticipo'); // Nuevo campo id_Anticipo
    const submitClienteBtn = document.getElementById('submitClienteBtn');
    const clearClienteFormBtn = document.getElementById('clearClienteForm');
    const clientesTableBody = document.getElementById('clientesTableBody');
    const clienteMessageDisplay = document.getElementById('clienteMessage');

    const CLIENTE_API_URL = 'http://localhost:3000/api/clientes'; // URL de la API para clientes

    // Función para limpiar el formulario de cliente
    function clearClienteForm()
    {
        clienteIdInput.value = '';
        clienteNombreInput.value = '';
        clienteAnticipoInput.value = ''; // Limpiar el nuevo campo
        submitClienteBtn.textContent = 'Crear Cliente';
        clearClienteFormBtn.style.display = 'none';
    }

    // Cargar todos los clientes
    async function fetchClientes() 
    {
        try {
            const response = await fetch(CLIENTE_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const clientes = await response.json();
            displayClientes(clientes);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            showMessage(clienteMessageDisplay, 'Error al cargar clientes. La API podría no estar funcionando.', true);
            clientesTableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos.</td></tr>';
        }
    }

    // Mostrar clientes en la tabla
    function displayClientes(clientes) {
        clientesTableBody.innerHTML = ''; // Limpiar tabla
        if (clientes.length === 0) {
            clientesTableBody.innerHTML = '<tr><td colspan="4">No hay clientes registrados.</td></tr>';
            return;
        }
        clientes.forEach(cliente => 
        {
            const row = clientesTableBody.insertRow();
            // Los campos que se muestran en la tabla coinciden con el nuevo modelo
            row.insertCell().textContent = cliente.id_Cliente;
            row.insertCell().textContent = cliente.Nombre;
            row.insertCell().textContent = cliente.id_Anticipo;
            const actionsCell = row.insertCell();
            actionsCell.className = 'action-buttons';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => 
            {
                // Rellenar el formulario con los datos del nuevo modelo
                clienteIdInput.value = cliente.id_Cliente;
                clienteNombreInput.value = cliente.Nombre;
                clienteAnticipoInput.value = cliente.id_Anticipo;
                submitClienteBtn.textContent = 'Actualizar Cliente';
                clearClienteFormBtn.style.display = 'inline-block';
            });
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteCliente(cliente.id_Cliente));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Crear o Actualizar cliente
    clienteForm.addEventListener('submit', async (e) => 
    {
        e.preventDefault();
        const id = clienteIdInput.value;
        const Nombre = clienteNombreInput.value;
        const id_Anticipo = clienteAnticipoInput.value; // Obtener el nuevo campo

        // Se crea un objeto con la nueva estructura del cliente
        const clienteData = { Nombre, id_Anticipo };

        try {
            let response;
            let method;
            let url;

            if (id) { // Actualizar
                method = 'PUT';
                url = `${CLIENTE_API_URL}/${id}`;
            } else { // Crear
                method = 'POST';
                url = CLIENTE_API_URL;
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error en la operación de cliente');
            }

            showMessage(clienteMessageDisplay, result.message || 'Operación de cliente exitosa');
            clearClienteForm();
            fetchClientes(); // Recargar la lista de clientes
        } catch (error) {
            console.error('Error al guardar cliente:', error);
            showMessage(clienteMessageDisplay, `Error al guardar cliente: ${error.message}`, true);
        }
    });

    // Eliminar cliente
    async function deleteCliente(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            return;
        }
        try {
            const response = await fetch(`${CLIENTE_API_URL}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar cliente');
            }
            showMessage(clienteMessageDisplay, result.message || 'Cliente eliminado con éxito');
            fetchClientes(); // Recargar la lista de clientes
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            showMessage(clienteMessageDisplay, `Error al eliminar cliente: ${error.message}`, true);
        }
    }

    // Event listener para el botón de limpiar formulario de cliente
    clearClienteFormBtn.addEventListener('click', clearClienteForm);

    // Carga inicial de clientes
    fetchClientes();
}
   
   // --- Lógica para MATERIALES ---
function initMaterialCRUD()
 {
    // Variables y Elementos del DOM para MATERIALES
    const materialForm = document.getElementById('materialForm');
    const materialIdInput = document.getElementById('materialId');
    const materialNombreInput = document.getElementById('materialNombre');
    const materialCantidadInput = document.getElementById('materialCantidad');
    const submitMaterialBtn = document.getElementById('submitMaterialBtn');
    const clearMaterialFormBtn = document.getElementById('clearMaterialForm');
    const materialesTableBody = document.getElementById('materialesTableBody');
    const materialMessageDisplay = document.getElementById('materialMessage');

    const MATERIAL_API_URL = 'http://localhost:3000/api/materiales'; // URL de la API para materiales

    // Función para limpiar el formulario de material
    function clearMaterialForm() 
    {
        materialIdInput.value = '';
        materialNombreInput.value = '';
        materialCantidadInput.value = '';
        submitMaterialBtn.textContent = 'Crear Material';
        clearMaterialFormBtn.style.display = 'none';
    }

    // Cargar todos los materiales
    async function fetchMateriales() 
    {
        try {
            const response = await fetch(MATERIAL_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const materiales = await response.json();
            displayMateriales(materiales);
        } catch (error) {
            console.error('Error al cargar materiales:', error);
            showMessage(materialMessageDisplay, 'Error al cargar materiales. La API podría no estar funcionando.', true);
            materialesTableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos.</td></tr>';
        }
    }

    // Mostrar materiales en la tabla
    function displayMateriales(materiales) 
    {
        materialesTableBody.innerHTML = ''; // Limpiar tabla
        if (materiales.length === 0) {
            materialesTableBody.innerHTML = '<tr><td colspan="4">No hay materiales registrados.</td></tr>';
            return;
        }
            materiales.forEach(material => 
        {
            const row = materialesTableBody.insertRow();
            row.insertCell().textContent = material.id_Material;
            row.insertCell().textContent = material.Nombre;
            row.insertCell().textContent = material.Cantidad;
            const actionsCell = row.insertCell();
            actionsCell.className = 'action-buttons';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => 
            {
                materialIdInput.value = material.id_Material;
                materialNombreInput.value = material.Nombre;
                materialCantidadInput.value = material.Cantidad;
                submitMaterialBtn.textContent = 'Actualizar Material';
                clearMaterialFormBtn.style.display = 'inline-block';
            });
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteMaterial(material.id_Material));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Crear o Actualizar material
    materialForm.addEventListener('submit', async (e) => 
    {
        e.preventDefault();
        const id = materialIdInput.value;
        const Nombre = materialNombreInput.value;
        const Cantidad = materialCantidadInput.value;

        // Se crea un objeto con la estructura del modelo de material
        const materialData = { Nombre, Cantidad };

        try {
            let response;
            let method;
            let url;

            if (id) { // Actualizar
                method = 'PUT';
                url = `${MATERIAL_API_URL}/${id}`;
            } else { // Crear
                method = 'POST';
                url = MATERIAL_API_URL;
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(materialData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error en la operación de material');
            }

            showMessage(materialMessageDisplay, result.message || 'Operación de material exitosa');
            clearMaterialForm();
            fetchMateriales(); // Recargar la lista de materiales
        } catch (error) {
            console.error('Error al guardar material:', error);
            showMessage(materialMessageDisplay, `Error al guardar material: ${error.message}`, true);
        }
    });

    // Eliminar material
    async function deleteMaterial(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este material?')) {
            return;
        }
        try {
            const response = await fetch(`${MATERIAL_API_URL}/${id}`, 
            {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar material');
            }
            showMessage(materialMessageDisplay, result.message || 'Material eliminado con éxito');
            fetchMateriales(); // Recargar la lista de materiales
        } catch (error) {
            console.error('Error al eliminar material:', error);
            showMessage(materialMessageDisplay, `Error al eliminar material: ${error.message}`, true);
        }
    }

    // Event listener para el botón de limpiar formulario de material
    clearMaterialFormBtn.addEventListener('click', clearMaterialForm);

    // Carga inicial de materiales
    fetchMateriales();
}
   

  // --- Lógica para MONTO  ---
function initMontoCRUD() 
{
    // Variables y Elementos del DOM para MONTO
    const montoPagoForm = document.getElementById('montoPagoForm'); // ATENCION REVISAR SI AFECTA MONTO PAGO Y SOLO EL NOMBRE MONTO
    const montoIdInput = document.getElementById('montoId');
    const montoPagoInput = document.getElementById('montoPago');
    const submitMontoBtn = document.getElementById('submitMontoBtn');
    const clearMontoFormBtn = document.getElementById('clearMontoForm');
    const montosTableBody = document.getElementById('montosTableBody');
    const montoMessageDisplay = document.getElementById('montoMessage');

    const MONTO_API_URL = 'http://localhost:3000/api/montos'; // URL de la API para montos de pago

    // Función para limpiar el formulario de monto
    function clearMontoForm() 
    {
        montoIdInput.value = '';
        montoPagoInput.value = '';
        submitMontoBtn.textContent = 'Crear Monto';
        clearMontoFormBtn.style.display = 'none';
    }

    // Cargar todos los montos de pago
    async function fetchMontos() 
    {
        try {
            const response = await fetch(MONTO_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const montos = await response.json();
            displayMontos(montos);
        } catch (error) {
            console.error('Error al cargar montos:', error);
            showMessage(montoMessageDisplay, 'Error al cargar montos. La API podría no estar funcionando.', true);
            montosTableBody.innerHTML = '<tr><td colspan="3">Error al cargar los datos.</td></tr>';
        }
    }

    // Mostrar montos de pago en la tabla
    function displayMontos(montos)
     {
        montosTableBody.innerHTML = ''; // Limpiar tabla
        if (montos.length === 0) 
        {
            montosTableBody.innerHTML = '<tr><td colspan="3">No hay montos de pago registrados.</td></tr>';
            return;
        }
        montos.forEach(monto => 
        {
            const row = montosTableBody.insertRow();
            row.insertCell().textContent = monto.id_Monto_Pago;
            row.insertCell().textContent = monto.monto_pago;
            const actionsCell = row.insertCell();
            actionsCell.className = 'action-buttons';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => 
            {
                montoIdInput.value = monto.id_Monto_Pago;
                montoPagoInput.value = monto.monto_pago;
                submitMontoBtn.textContent = 'Actualizar Monto';
                clearMontoFormBtn.style.display = 'inline-block';
            });
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteMonto(monto.id_Monto_Pago));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Crear o Actualizar monto de pago
    montoPagoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = montoIdInput.value;
        const monto_pago = montoPagoInput.value;

        // Se crea un objeto con la estructura del modelo de monto
        const montoData = { monto_pago };

        try {
            let response;
            let method;
            let url;

            if (id) { // Actualizar
                method = 'PUT';
                url = `${MONTO_API_URL}/${id}`;
            } else { // Crear
                method = 'POST';
                url = MONTO_API_URL;
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(montoData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error en la operación de monto');
            }

            showMessage(montoMessageDisplay, result.message || 'Operación de monto exitosa');
            clearMontoForm();
            fetchMontos(); // Recargar la lista de montos
        } catch (error) {
            console.error('Error al guardar monto:', error);
            showMessage(montoMessageDisplay, `Error al guardar monto: ${error.message}`, true);
        }
    });

    // Eliminar monto
    async function deleteMonto(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este monto?')) {
            return;
        }
        try {
            const response = await fetch(`${MONTO_API_URL}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar monto');
            }
            showMessage(montoMessageDisplay, result.message || 'Monto eliminado con éxito');
            fetchMontos(); // Recargar la lista de montos
        } catch (error) {
            console.error('Error al eliminar monto:', error);
            showMessage(montoMessageDisplay, `Error al eliminar monto: ${error.message}`, true);
        }
    }

    // Event listener para el botón de limpiar formulario de monto
    clearMontoFormBtn.addEventListener('click', clearMontoForm);

    // Carga inicial de montos
    fetchMontos();
}
   
  // --- Lógica para PAGOS ---
function initPagoCRUD() 
{
    // Variables y Elementos del DOM para PAGOS
    const pagoForm = document.getElementById('pagoForm');
    const pagoIdInput = document.getElementById('pagoId');
    const pagoReparacionInput = document.getElementById('pagoReparacion');
    const pagoclienteInput = document.getElementById('pagocliente');
    const pagoFechaInput = document.getElementById('pagoFecha');
    const pagoMontoInput = document.getElementById('pagoMonto');
    const submitPagoBtn = document.getElementById('submitPagoBtn');
    const clearPagoFormBtn = document.getElementById('clearPagoForm');
    const pagosTableBody = document.getElementById('pagosTableBody');
    const pagoMessageDisplay = document.getElementById('pagoMessage');

    const PAGO_API_URL = 'http://localhost:3000/api/pagos'; // URL de la API para pagos

    // Función para limpiar el formulario de pago
    function clearPagoForm() 
    {
        pagoIdInput.value = '';
        pagoReparacionInput.value = '';
        pagoclienteInput.value = '';
        pagoFechaInput.value = '';
        pagoMontoInput.value = '';
        submitPagoBtn.textContent = 'Crear Pago';
        clearPagoFormBtn.style.display = 'none';
    }

    // Cargar todos los pagos
    async function fetchPagos() 
    {
        try {
            const response = await fetch(PAGO_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const pagos = await response.json();
            displayPagos(pagos);
        } catch (error) {
            console.error('Error al cargar pagos:', error);
            showMessage(pagoMessageDisplay, 'Error al cargar pagos. La API podría no estar funcionando.', true);
            pagosTableBody.innerHTML = '<tr><td colspan="6">Error al cargar los datos.</td></tr>';
        }
    }

    // Mostrar pagos en la tabla
    function displayPagos(pagos) 
    {
        pagosTableBody.innerHTML = ''; // Limpiar tabla
        if (pagos.length === 0) {
            pagosTableBody.innerHTML = '<tr><td colspan="6">No hay pagos registrados.</td></tr>';
            return;
        }
        pagos.forEach(pago => 
        {
            const row = pagosTableBody.insertRow();
            row.insertCell().textContent = pago.id_Pago;
            row.insertCell().textContent = pago.id_Reparacion;
            row.insertCell().textContent = pago.id_cliente;
            row.insertCell().textContent = pago.Fecha_Pago;
            row.insertCell().textContent = pago.id_Monto;
            const actionsCell = row.insertCell();
            actionsCell.className = 'action-buttons';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => {
                pagoIdInput.value = pago.id_Pago;
                pagoReparacionInput.value = pago.id_Reparacion;
                pagoclienteInput.value = pago.id_cliente; // debe estar en minúscula porque es el nombre de la columna en la base de datos
                pagoFechaInput.value = pago.Fecha_Pago;
                pagoMontoInput.value = pago.id_Monto;
                submitPagoBtn.textContent = 'Actualizar Pago';
                clearPagoFormBtn.style.display = 'inline-block';
            });
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deletePago(pago.id_Pago));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Crear o Actualizar pago
    pagoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = pagoIdInput.value;
        const id_Reparacion = pagoReparacionInput.value;
        const id_cliente = pagoclienteInput.value;
        const Fecha_Pago = pagoFechaInput.value;
        const id_Monto = pagoMontoInput.value;

        // Se crea un objeto con la estructura del modelo de pago
        const pagoData = { id_Reparacion, id_cliente, Fecha_Pago, id_Monto };

        try {
            let response;
            let method;
            let url;

            if (id) { // Actualizar
                method = 'PUT';
                url = `${PAGO_API_URL}/${id}`;
            } else { // Crear
                method = 'POST';
                url = PAGO_API_URL;
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pagoData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error en la operación de pago');
            }

            showMessage(pagoMessageDisplay, result.message || 'Operación de pago exitosa');
            clearPagoForm();
            fetchPagos(); // Recargar la lista de pagos
        } catch (error) {
            console.error('Error al guardar pago:', error);
            showMessage(pagoMessageDisplay, `Error al guardar pago: ${error.message}`, true);
        }
    });

    // Eliminar pago
    async function deletePago(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este pago?')) {
            return;
        }
        try {
            const response = await fetch(`${PAGO_API_URL}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar pago');
            }
            showMessage(pagoMessageDisplay, result.message || 'Pago eliminado con éxito');
            fetchPagos(); // Recargar la lista de pagos
        } catch (error) {
            console.error('Error al eliminar pago:', error);
            showMessage(pagoMessageDisplay, `Error al eliminar pago: ${error.message}`, true);
        }
    }

    // Event listener para el botón de limpiar formulario de pago
    clearPagoFormBtn.addEventListener('click', clearPagoForm);

    // Carga inicial de pagos
    fetchPagos();
}
   

// --- Lógica para REPARACIONES ---
function initReparacionCRUD() 
{
    // Variables y Elementos del DOM para REPARACIONES
    const reparacionForm = document.getElementById('reparacionForm');
    const reparacionIdInput = document.getElementById('reparacionId');
    const reparacionFechaIngresoInput = document.getElementById('reparacionFechaIngreso');
    const reparacionFechaEntregaInput = document.getElementById('reparacionFechaEntrega');
    const reparacionObservacionesInput = document.getElementById('reparacionObservaciones');
    const reparacionServicioInput = document.getElementById('reparacionServicio');
    const reparacionArticuloInput = document.getElementById('reparacionArticulo');
    const submitReparacionBtn = document.getElementById('submitReparacionBtn');
    const clearReparacionFormBtn = document.getElementById('clearReparacionForm');
    const reparacionesTableBody = document.getElementById('reparacionesTableBody');
    const reparacionMessageDisplay = document.getElementById('reparacionMessage');

    const REPARACION_API_URL = 'http://localhost:3000/api/reparaciones'; // URL de la API para reparaciones

    // Función para limpiar el formulario de reparación
    function clearReparacionForm() {
        reparacionIdInput.value = '';
        reparacionFechaIngresoInput.value = '';
        reparacionFechaEntregaInput.value = '';
        reparacionObservacionesInput.value = '';
        reparacionServicioInput.value = '';
        reparacionArticuloInput.value = '';
        submitReparacionBtn.textContent = 'Crear Reparación';
        clearReparacionFormBtn.style.display = 'none';
    }

    // Cargar todas las reparaciones
    async function fetchReparaciones() {
        try {
            const response = await fetch(REPARACION_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const reparaciones = await response.json();
            displayReparaciones(reparaciones);
        } catch (error) {
            console.error('Error al cargar reparaciones:', error);
            showMessage(reparacionMessageDisplay, 'Error al cargar reparaciones. La API podría no estar funcionando.', true);
            reparacionesTableBody.innerHTML = '<tr><td colspan="7">Error al cargar los datos.</td></tr>';
        }
    }

    // Mostrar reparaciones en la tabla
    function displayReparaciones(reparaciones) {
        reparacionesTableBody.innerHTML = ''; // Limpiar tabla
        if (reparaciones.length === 0) {
            reparacionesTableBody.innerHTML = '<tr><td colspan="7">No hay reparaciones registradas.</td></tr>';
            return;
        }
        reparaciones.forEach(reparacion => {
            const row = reparacionesTableBody.insertRow();
            row.insertCell().textContent = reparacion.id_Reparacion;
            row.insertCell().textContent = reparacion.Fecha_ingreso;
            row.insertCell().textContent = reparacion.Fecha_entrega;
            row.insertCell().textContent = reparacion.Observaciones;
            row.insertCell().textContent = reparacion.id_Servicio;
            row.insertCell().textContent = reparacion.id_Articulo;
            const actionsCell = row.insertCell();
            actionsCell.className = 'action-buttons';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => {
                reparacionIdInput.value = reparacion.id_Reparacion;
                reparacionFechaIngresoInput.value = reparacion.Fecha_ingreso;
                reparacionFechaEntregaInput.value = reparacion.Fecha_entrega;
                reparacionObservacionesInput.value = reparacion.Observaciones;
                reparacionServicioInput.value = reparacion.id_Servicio;
                reparacionArticuloInput.value = reparacion.id_Articulo;
                submitReparacionBtn.textContent = 'Actualizar Reparación';
                clearReparacionFormBtn.style.display = 'inline-block';
            });
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteReparacion(reparacion.id_Reparacion));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Crear o Actualizar reparación
    reparacionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = reparacionIdInput.value;
        const Fecha_ingreso  = reparacionFechaIngresoInput.value;
        const Fecha_entrega = reparacionFechaEntregaInput.value;
        const Observaciones = reparacionObservacionesInput.value;
        const id_Servicio = reparacionServicioInput.value;
        const id_Articulo = reparacionArticuloInput.value;

        // Se crea un objeto con la estructura del modelo de reparación
        const reparacionData = { Fecha_ingreso, Fecha_entrega, Observaciones, id_Servicio, id_Articulo };

        try {
            let response;
            let method;
            let url;

            if (id) { // Actualizar
                method = 'PUT';
                url = `${REPARACION_API_URL}/${id}`;
            } else { // Crear
                method = 'POST';
                url = REPARACION_API_URL;
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reparacionData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error en la operación de reparación');
            }

            showMessage(reparacionMessageDisplay, result.message || 'Operación de reparación exitosa');
            clearReparacionForm();
            fetchReparaciones(); // Recargar la lista de reparaciones
        } catch (error) {
            console.error('Error al guardar reparación:', error);
            showMessage(reparacionMessageDisplay, `Error al guardar reparación: ${error.message}`, true);
        }
    });

    // Eliminar reparación
    async function deleteReparacion(id) 
    {
        if (!confirm('¿Estás seguro de que quieres eliminar esta reparación?')) 
        {
            return;
        }
        try 
        {
            const response = await fetch(`${REPARACION_API_URL}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar reparación');
            }
            showMessage(reparacionMessageDisplay, result.message || 'Reparación eliminada con éxito');
            fetchReparaciones(); // Recargar la lista de reparaciones
        } 
        catch (error)
        {
            console.error('Error al eliminar reparación:', error);
            showMessage(reparacionMessageDisplay, `Error al eliminar reparación: ${error.message}`, true);
        }
    }

    // Event listener para el botón de limpiar formulario de reparación
    clearReparacionFormBtn.addEventListener('click', clearReparacionForm);

    // Carga inicial de reparaciones
    fetchReparaciones();
}
 
// --- Lógica para SERVICIOS ---
function initServicioCRUD() 
{
    // Variables y Elementos del DOM para SERVICIOS
    const servicioForm = document.getElementById('servicioForm');
    const servicioIdInput = document.getElementById('servicioId');
    const servicioTipoInput = document.getElementById('servicioTipo');
    const servicioPrecioInput = document.getElementById('servicioPrecio');
    const submitServicioBtn = document.getElementById('submitServicioBtn');
    const clearServicioFormBtn = document.getElementById('clearServicioForm');
    const serviciosTableBody = document.getElementById('serviciosTableBody');
    const servicioMessageDisplay = document.getElementById('servicioMessage');

    const SERVICIO_API_URL = 'http://localhost:3000/api/servicios'; // URL de la API para servicios

    // Función para limpiar el formulario de servicio
    function clearServicioForm() 
    {
        servicioIdInput.value = '';
        servicioTipoInput.value = '';
        servicioPrecioInput.value = '';
        submitServicioBtn.textContent = 'Crear Servicio';
        clearServicioFormBtn.style.display = 'none';
    }

    // Cargar todos los servicios
    async function fetchServicios() {
        try {
            const response = await fetch(SERVICIO_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const servicios = await response.json();
            displayServicios(servicios);
        } catch (error) {
            console.error('Error al cargar servicios:', error);
            showMessage(servicioMessageDisplay, 'Error al cargar servicios. La API podría no estar funcionando.', true);
            serviciosTableBody.innerHTML = '<tr><td colspan="4">Error al cargar los datos.</td></tr>';
        }
    }

    // Mostrar servicios en la tabla
    function displayServicios(servicios) {
        serviciosTableBody.innerHTML = ''; // Limpiar tabla
        if (servicios.length === 0) {
            serviciosTableBody.innerHTML = '<tr><td colspan="4">No hay servicios registrados.</td></tr>';
            return;
        }
        servicios.forEach(servicio => {
            const row = serviciosTableBody.insertRow();
            row.insertCell().textContent = servicio.id;
            row.insertCell().textContent = servicio.Tipo;
            row.insertCell().textContent = servicio.Precio;
            const actionsCell = row.insertCell();
            actionsCell.className = 'action-buttons';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => {
                servicioIdInput.value = servicio.id;
                servicioTipoInput.value = servicio.Tipo;
                servicioPrecioInput.value = servicio.Precio;
                submitServicioBtn.textContent = 'Actualizar Servicio';
                clearServicioFormBtn.style.display = 'inline-block';
            });
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteServicio(servicio.id));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Crear o Actualizar servicio
    servicioForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = servicioIdInput.value;
        const Tipo = servicioTipoInput.value;
        const Precio = servicioPrecioInput.value;

        // Se crea un objeto con la estructura del modelo de servicio
        const servicioData = { Tipo, Precio };

        try {
            let response;
            let method;
            let url;

            if (id) { // Actualizar
                method = 'PUT';
                url = `${SERVICIO_API_URL}/${id}`;
            } else { // Crear
                method = 'POST';
                url = SERVICIO_API_URL;
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(servicioData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error en la operación de servicio');
            }

            showMessage(servicioMessageDisplay, result.message || 'Operación de servicio exitosa');
            clearServicioForm();
            fetchServicios(); // Recargar la lista de servicios
        } catch (error) {
            console.error('Error al guardar servicio:', error);
            showMessage(servicioMessageDisplay, `Error al guardar servicio: ${error.message}`, true);
        }
    });

    // Eliminar servicio
    async function deleteServicio(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            return;
        }
        try {
            const response = await fetch(`${SERVICIO_API_URL}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar servicio');
            }
            showMessage(servicioMessageDisplay, result.message || 'Servicio eliminado con éxito');
            fetchServicios(); // Recargar la lista de servicios
        } catch (error) {
            console.error('Error al eliminar servicio:', error);
            showMessage(servicioMessageDisplay, `Error al eliminar servicio: ${error.message}`, true);
        }
    }

    // Event listener para el botón de limpiar formulario de servicio
    clearServicioFormBtn.addEventListener('click', clearServicioForm);

    // Carga inicial de servicios
    fetchServicios();
}
  

// --- Lógica para TIPOS ---
function initTipoCRUD() {
    // Variables y Elementos del DOM para TIPOS
    const tipoForm = document.getElementById('tipoForm');
    const tipoIdInput = document.getElementById('tipoId');
    const tipoTipoInput = document.getElementById('tipoTipo');
    const submitTipoBtn = document.getElementById('submitTipoBtn');
    const clearTipoFormBtn = document.getElementById('clearTipoForm');
    const tiposTableBody = document.getElementById('tiposTableBody');
    const tipoMessageDisplay = document.getElementById('tipoMessage');

    const TIPO_API_URL = 'http://localhost:3000/api/tipos'; // URL de la API para tipos

    // Función para limpiar el formulario de tipo
    function clearTipoForm() {
        tipoIdInput.value = '';
        tipoTipoInput.value = '';
        submitTipoBtn.textContent = 'Crear Tipo';
        clearTipoFormBtn.style.display = 'none';
    }

    // Cargar todos los tipos
    async function fetchTipos() {
        try {
            const response = await fetch(TIPO_API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tipos = await response.json();
            displayTipos(tipos);
        } catch (error) {
            console.error('Error al cargar tipos:', error);
            showMessage(tipoMessageDisplay, 'Error al cargar tipos. La API podría no estar funcionando.', true);
            tiposTableBody.innerHTML = '<tr><td colspan="3">Error al cargar los datos.</td></tr>';
        }
    }

    // Mostrar tipos en la tabla
    function displayTipos(tipos) {
        tiposTableBody.innerHTML = ''; // Limpiar tabla
        if (tipos.length === 0) {
            tiposTableBody.innerHTML = '<tr><td colspan="3">No hay tipos registrados.</td></tr>';
            return;
        }
        tipos.forEach(tipo => {
            const row = tiposTableBody.insertRow();
            row.insertCell().textContent = tipo.id_Tipo;
            row.insertCell().textContent = tipo.Tipo;
            const actionsCell = row.insertCell();
            actionsCell.className = 'action-buttons';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => {
                tipoIdInput.value = tipo.id_Tipo;
                tipoTipoInput.value = tipo.Tipo;
                submitTipoBtn.textContent = 'Actualizar Tipo';
                clearTipoFormBtn.style.display = 'inline-block';
            });
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteTipo(tipo.id_Tipo));
            actionsCell.appendChild(deleteBtn);
        });
    }

    // Crear o Actualizar tipo
    tipoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = tipoIdInput.value;
        const Tipo = tipoTipoInput.value;

        // Se crea un objeto con la estructura del modelo de tipo
        const tipoData = { Tipo };

        try {
            let response;
            let method;
            let url;

            if (id) { // Actualizar
                method = 'PUT';
                url = `${TIPO_API_URL}/${id}`;
            } else { // Crear
                method = 'POST';
                url = TIPO_API_URL;
            }

            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tipoData)
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error en la operación de tipo');
            }

            showMessage(tipoMessageDisplay, result.message || 'Operación de tipo exitosa');
            clearTipoForm();
            fetchTipos(); // Recargar la lista de tipos
        } catch (error) {
            console.error('Error al guardar tipo:', error);
            showMessage(tipoMessageDisplay, `Error al guardar tipo: ${error.message}`, true);
        }
    });

    // Eliminar tipo
    async function deleteTipo(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este tipo?')) {
            return;
        }
        try {
            const response = await fetch(`${TIPO_API_URL}/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || 'Error al eliminar tipo');
            }
            showMessage(tipoMessageDisplay, result.message || 'Tipo eliminado con éxito');
            fetchTipos(); // Recargar la lista de tipos
        } catch (error) {
            console.error('Error al eliminar tipo:', error);
            showMessage(tipoMessageDisplay, `Error al eliminar tipo: ${error.message}`, true);
        }
    }

    // Event listener para el botón de limpiar formulario de tipo
    clearTipoFormBtn.addEventListener('click', clearTipoForm);

    // Carga inicial de tipos
    fetchTipos();
}
  


    // --- Inicializar ambas lógicas CRUD al cargar el DOM ---
    initUserCRUD();
    initOwnerCRUD();
    initAnticipoCRUD();
    initArticuloCRUD();
    initClienteCRUD();
    initMaterialCRUD();
    initMontoCRUD();
    initPagoCRUD();
    initReparacionCRUD();
    initServicioCRUD();
    initTipoCRUD();

});
