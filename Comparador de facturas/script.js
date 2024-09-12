document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos todas las entradas numéricas del formulario de la compañía actual
    const currentInputs = document.querySelectorAll('#comparisonFormCurrent input[type="number"]');
    // Seleccionamos todas las entradas numéricas del formulario de la compañía en estudio
    const newInputs = document.querySelectorAll('#comparisonFormNew input[type="number"]');

    // Añadimos un listener a cada entrada del formulario de la compañía actual
    currentInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateCalculations('current'); // Llamamos a updateCalculations con 'current' al cambiar el valor
            transferValuesToNewForm(); // Sincronizamos los campos al cambiar los valores
        });
    });

    // Añadimos un listener a cada entrada del formulario de la compañía en estudio
    newInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateCalculations('new'); // Llamamos a updateCalculations con 'new' al cambiar el valor
        });
    });

    // Añadir listener al botón de comparar
    document.getElementById('compareButton').addEventListener('click', compareCompanies);

    // Función para calcular el importe basado en kW, días y precio
    function calculateImporte(kw, dias, precio) {
        return kw * dias * precio;
    }

    // Función para calcular el importe de la energía basado en kwh y precio
    function calculateEnergyImporte(kwh, precio) {
        return kwh * precio;
    }

    // Función que calcula otros conceptos 
    function calculateConceptImporte(dias, precio) {
        return dias * precio;
    }

    // Función que calcula los impuestos
    function calculateTaxesImporte(precio, porcentaje) {
        return precio * (porcentaje / 100);
    }

    // Función que calcula otros servicios contratados
    function calculateServicesImporte(precio, iva) {
        return precio * (iva / 100);
    }

    function updateCalculations(formType) {
        let prefix = formType === 'current' ? 'current' : 'new';

        let puntaKw = parseFloat(document.getElementById(`${prefix}PuntaKw`).value) || 0;
        let puntaDias = parseFloat(document.getElementById(`${prefix}PuntaDias`).value) || 0;
        let puntaPrecio = parseFloat(document.getElementById(`${prefix}PuntaPrecio`).value) || 0;
        let valleKw = parseFloat(document.getElementById(`${prefix}ValleKw`).value) || 0;
        let valleDias = parseFloat(document.getElementById(`${prefix}ValleDias`).value) || 0;
        let vallePrecio = parseFloat(document.getElementById(`${prefix}VallePrecio`).value) || 0;

        // Calcular importes para Punta y Valle
        const puntaImporte = calculateImporte(puntaKw, puntaDias, puntaPrecio);
        const valleImporte = calculateImporte(valleKw, valleDias, vallePrecio);
        const totalPotenciaImporte = puntaImporte + valleImporte;

        // Obtener valores de consumo y precios de energía para la compañía actual o en estudio
        let consumoPuntaKwh = parseFloat(document.getElementById(`${prefix}ConsumoPuntaKwh`).value) || 0;
        let precioPuntaKwh = parseFloat(document.getElementById(`${prefix}PrecioPuntaKwh`).value) || 0;
        let consumoLlanoKwh = parseFloat(document.getElementById(`${prefix}ConsumoLlanoKwh`).value) || 0;
        let precioLlanoKwh = parseFloat(document.getElementById(`${prefix}PrecioLlanoKwh`).value) || 0;
        let consumoValleKwh = parseFloat(document.getElementById(`${prefix}ConsumoValleKwh`).value) || 0;
        let precioValleKwh = parseFloat(document.getElementById(`${prefix}PrecioValleKwh`).value) || 0;

        // Calcular importes para Energía (Punta, Llano, Valle)
        const importePunta = calculateEnergyImporte(consumoPuntaKwh, precioPuntaKwh);
        const importeLlano = calculateEnergyImporte(consumoLlanoKwh, precioLlanoKwh);
        const importeValle = calculateEnergyImporte(consumoValleKwh, precioValleKwh);
        const totalEnergiaImporte = importePunta + importeLlano + importeValle;

        // Obtener valores de otros conceptos para la compañía actual o en estudio
        let bonoSocialDias = parseFloat(document.getElementById(`${prefix}DiasBono`).value) || 0;
        let bonoSocialPrecio = parseFloat(document.getElementById(`${prefix}PrecioBono`).value) || 0;
        let alquilerEquiposDias = parseFloat(document.getElementById(`${prefix}DiasAlquiler`).value) || 0;
        let alquilerEquiposPrecio = parseFloat(document.getElementById(`${prefix}PrecioAlquiler`).value) || 0;

        // Calcular importes para Otros Conceptos (Bono social, Alquiler equipos)
        const importeBono = calculateConceptImporte(bonoSocialDias, bonoSocialPrecio);
        const importeAlquiler = calculateConceptImporte(alquilerEquiposDias, alquilerEquiposPrecio);
        const importeOthers = importeBono + importeAlquiler;

        // Obtener valores de impuestos para la compañía actual o en estudio        
        let impuestoElectricoPorcentaje = parseFloat(document.getElementById(`${prefix}PorcentajeImpuesto`).value) || 0;        
        let ivaPorcentaje = parseFloat(document.getElementById(`${prefix}PorcentajeIVA`).value) || 0;

        // Calcular importes para Impuestos (Impuesto eléctrico, IVA)
        const impuestoElectricidad = totalPotenciaImporte + totalEnergiaImporte;
        const importeImpuesto = calculateTaxesImporte(impuestoElectricidad, impuestoElectricoPorcentaje);
        const baseImponibleIVA = totalPotenciaImporte + totalEnergiaImporte + importeImpuesto + importeOthers;
        const importeIVA = calculateTaxesImporte(baseImponibleIVA, ivaPorcentaje);
        const importeTaxes = importeImpuesto + importeIVA;

        // Obtener valores de otros servicios contratados para la compañía actual o en estudio
        let servicio1Precio = parseFloat(document.getElementById(`${prefix}CostoServicios`).value) || 0;
        let servicio2Precio = parseFloat(document.getElementById(`${prefix}CostoServicios2`).value) || 0;
        let servicio3Precio = parseFloat(document.getElementById(`${prefix}CostoServicios3`).value) || 0;
        let servicio1IVA = parseFloat(document.getElementById(`${prefix}PorcentajeIVA`).value) || 0;
        let servicio2IVA = parseFloat(document.getElementById(`${prefix}PorcentajeIVA2`).value) || 0;
        let servicio3IVA = parseFloat(document.getElementById(`${prefix}PorcentajeIVA3`).value) || 0;

        // Calcular importes para Otros Servicios Contratados
        const importeTotalServicio = calculateServicesImporte(servicio1Precio, servicio1IVA);
        const importeTotalServicio2 = calculateServicesImporte(servicio2Precio, servicio2IVA);
        const importeTotalServicio3 = calculateServicesImporte(servicio3Precio, servicio3IVA);

        // Obtener descuentos
        let descuentos = parseFloat(document.getElementById(`${prefix}Descuentos`).value) || 0;

        // Calcular el total de la factura
        const totalFactura = totalPotenciaImporte + totalEnergiaImporte + importeOthers + importeTaxes;

        // Calcular el total a pagar
        const totalAPagar = totalFactura + importeTotalServicio + importeTotalServicio2 + importeTotalServicio3 - descuentos;


        // Actualizar los elementos HTML con los importes calculados para la compañía actual o en estudio
        document.getElementById(`${prefix}PuntaImporte`).textContent = `€${puntaImporte.toFixed(2)}`;
        document.getElementById(`${prefix}ValleImporte`).textContent = `€${valleImporte.toFixed(2)}`;
        document.getElementById(`${prefix}TotalPotenciaImporte`).textContent = `€${totalPotenciaImporte.toFixed(2)}`;

        document.getElementById(`${prefix}ImportePunta`).textContent = `€${importePunta.toFixed(2)}`;
        document.getElementById(`${prefix}ImporteLlano`).textContent = `€${importeLlano.toFixed(2)}`;
        document.getElementById(`${prefix}ImporteValle`).textContent = `€${importeValle.toFixed(2)}`;
        document.getElementById(`${prefix}TotalEnergiaImporte`).textContent = `€${totalEnergiaImporte.toFixed(2)}`;

        document.getElementById(`${prefix}ImporteOthers`).textContent = `€${importeOthers.toFixed(2)}`;
        document.getElementById(`${prefix}ImporteBono`).textContent = `€${importeBono.toFixed(2)}`;
        document.getElementById(`${prefix}ImporteAlquiler`).textContent = `€${importeAlquiler.toFixed(2)}`;

        document.getElementById(`${prefix}BaseImponibleIVA`).value = baseImponibleIVA.toFixed(2);
        document.getElementById(`${prefix}ImpuestoElectricidad`).value = impuestoElectricidad.toFixed(2);
        document.getElementById(`${prefix}ImporteTaxes`).value = `€${importeTaxes.toFixed(2)}`;
        document.getElementById(`${prefix}ImporteImpuesto`).textContent = `€${importeImpuesto.toFixed(2)}`;
        document.getElementById(`${prefix}ImporteIVA`).textContent = `€${importeIVA.toFixed(2)}`;

        document.getElementById(`${prefix}ImporteTotalServicio`).textContent = `€${importeTotalServicio.toFixed(2)}`;
        document.getElementById(`${prefix}ImporteTotalServicio2`).textContent = `€${importeTotalServicio2.toFixed(2)}`;
        document.getElementById(`${prefix}ImporteTotalServicio3`).textContent = `€${importeTotalServicio3.toFixed(2)}`;

        document.getElementById(`${prefix}TotalFactura`).value = totalFactura.toFixed(2);
        document.getElementById(`${prefix}TotalAPagar`).value = totalAPagar.toFixed(2);
    }
   
    
    // Función para transferir valores del formulario actual al formulario en estudio
    function transferValuesToNewForm() {
        // Transferir valores del formulario actual al formulario en estudio
        
        // Campos de potencia
        document.getElementById('newPuntaKw').value = document.getElementById('currentPuntaKw').value;
        document.getElementById('newValleKw').value = document.getElementById('currentValleKw').value;
        document.getElementById('newConsumoPuntaKwh').value = document.getElementById('currentConsumoPuntaKwh').value;
        document.getElementById('newConsumoLlanoKwh').value = document.getElementById('currentConsumoLlanoKwh').value;
        document.getElementById('newConsumoValleKwh').value = document.getElementById('currentConsumoValleKwh').value;
        document.getElementById('newPorcentajeImpuesto').value = document.getElementById('currentPorcentajeImpuesto').value;
        document.getElementById('newPorcentajeIVA').value = document.getElementById('currentPorcentajeIVA').value;
        document.getElementById('newPrecioBono').value = document.getElementById('currentPrecioBono').value;
        document.getElementById('newPrecioAlquiler').value = document.getElementById('currentPrecioAlquiler').value;

        // Campos de días
        const currentPuntaDias = document.getElementById('currentPuntaDias');

        // Agregar un event listener al campo currentPuntaDias
        currentPuntaDias.addEventListener('input', () => {
        const puntaDiasValue = currentPuntaDias.value; // Capturamos el valor ingresado

        // Asignamos el mismo valor a los otros campos del formulario actual
        document.getElementById('currentValleDias').value = puntaDiasValue;
        document.getElementById('currentDiasBono').value = puntaDiasValue;
        document.getElementById('currentDiasAlquiler').value = puntaDiasValue;

        // Asignamos el mismo valor a los campos del nuevo formulario
        document.getElementById('newPuntaDias').value = puntaDiasValue;
        document.getElementById('newValleDias').value = puntaDiasValue;
        document.getElementById('newDiasAlquiler').value = puntaDiasValue;
        document.getElementById('newDiasBono').value = puntaDiasValue;

        });
    
        // Actualizar los cálculos del nuevo formulario
        updateCalculations('new');
    }
    
    function compareCompanies() {
        let currentTotalAPagar = parseFloat(document.getElementById('currentTotalAPagar').value) || 0;
        let newTotalAPagar = parseFloat(document.getElementById('newTotalAPagar').value) || 0;
        let diferencia = newTotalAPagar - currentTotalAPagar;
    
        // Oculta el botón de comparar
        document.getElementById('compareButton').style.display = 'none';
    
        // Verificar si ya existe un recuadro de resultados para evitar duplicados
        let resultBox = document.getElementById('comparisonResultBox');
        let overlay = document.getElementById('overlay');
        
        
        // Añadir el texto del resultado al recuadro
        if (diferencia < 0) {
            resultBox.textContent = `¡Enhorabuena! Con tu nueva compañía ahorras €${Math.abs(diferencia).toFixed(2)}`;
            resultBox.className = 'saving';  // Estilo CSS específico para ahorro
        } else if (diferencia > 0) {
            resultBox.textContent = `Con la nueva compañía pagas de más €${diferencia.toFixed(2)}`;
            resultBox.className = 'additional-cost';  // Estilo CSS específico para coste adicional
        } else {
            resultBox.textContent = 'Pagas lo mismo con ambas compañías.';
            resultBox.className = 'equal-cost';  // Estilo CSS específico para coste igual
        }

        // Mostrar el modal y la capa de fondo
        overlay.style.display = 'block';
        resultBox.classList.remove('hidden');
        resultBox.style.display = 'block';
    }   

    // Ocultar el modal y la capa de fondo al hacer clic en la capa de fondo
    document.getElementById('overlay').addEventListener('click', () => {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('comparisonResultBox').style.display = 'none';
        document.getElementById('compareButton').style.display = 'block';      
        
    });

    updateCalculations('current'); // Realizar cálculos iniciales para valores predeterminados de la compañía actual
    updateCalculations('new'); // Realizar cálculos iniciales para valores predeterminados de la compañía en estudio
});
