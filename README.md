# Entrega Unidad 3 - Simulador de Apuestas BETANO 2026 

### 1. Estructura del Proyecto
- separe los archivos por carpetas como la raiz (index.html) el estilo en ccs/styles.css para el estilo de la pagina y la logica de la pagina como funciona en js/app.js

### 2. DOM y Eventos
dom y eventos que utilice 
1. `submit`: Para procesar el formulario cuando se genera el ticket.
2. `input`: En la barra de búsqueda para filtrar los boletos en tiempo real.
3. `click`: En el botón de "Quitar" para borrar un boleto de la lista.
- Los elementos se crean y se eliminan de la página usando `document.createElement` y `remove`.

### 3. Formulario y las 5 Validaciones
reglas que estableci en el formulario campos obligatorios y reglas adicionales tipicas de un formulario. 
1. Campos obligatorios: No te deja avanzar si falta seleccionar el partido o vaciar los textos.
2. Formato de Nombre: Controla con una expresión regular que se ponga Nombre y Apellido (ej: Arturo Vidal).
3. Longitud Mínima: El nombre del jugador debe tener mínimo 8 caracteres.
4. Coincidencia: Agregué un campo para confirmar el nombre y revisa que ambos campos sean exactamente iguales para evitar errores.
5. Rango de Montos (Regla extra):** El monto mínimo para apostar es de $1.000 CLP y el máximo es de $200.000 CLP.

### 4. Consumo de Datos (Fetch API)
- me conecte con archivos ya definidos con el archivo que esta en `js/partidos.json` este cumple con la funcion de precargar estos datos para que se pueda rellenar el formulario con el VS de los equipos y sus cuotas predefinidas


## 📸 Capturas de Pantalla de la pagina

1. captura de la pagina al entrar ![alt text](image.png) 
2. captura de la pagina con los reglas y como se reflejan al querer generar tickets ![alt text](image-1.png)
3. captura del el tickets generado correctamente ![alt text](image-2.png)
