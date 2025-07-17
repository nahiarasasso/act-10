// Establecer fecha actual por defecto
        document.getElementById('date').valueAsDate = new Date();

        async function generateReport() {
            // Validar campos requeridos
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            
            if (!name || !email) {
                alert("Por favor completa al menos el nombre y el correo electrónico.");
                return;
            }

            // Mostrar loading
            const loading = document.getElementById("loading");
            const placeholder = document.getElementById("placeholder");
            const reportContainer = document.getElementById("reportContainer");
            
            loading.style.display = "flex";
            placeholder.style.display = "none";
            reportContainer.innerHTML = '';
            reportContainer.appendChild(loading);

            try {
                // Esperar un poco para mostrar el loading
                await new Promise(resolve => setTimeout(resolve, 1000));

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                // Obtener valores del formulario
                const age = document.getElementById("age").value;
                const course = document.getElementById("course").value;
                const project = document.getElementById("project").value;
                const projectLink = document.getElementById("projectLink").value;
                const description = document.getElementById("description").value;
                const date = document.getElementById("date").value;

                // Configurar fuente y colores
                doc.setFontSize(20);
                doc.setTextColor(40, 40, 40);

                // Título principal
                doc.text("INFORME DE ESTUDIANTE", 20, 30);
                
                // Línea decorativa
                doc.setDrawColor(102, 126, 234);
                doc.setLineWidth(2);
                doc.line(20, 35, 190, 35);

                // Información de la escuela
                doc.setFontSize(12);
                doc.setTextColor(100, 100, 100);
                doc.text('EEST N.º 1 "Eduardo Ader" - Vicente López', 20, 45);
                doc.text('Proyecto de Implementación de Sitios web Dinámicos', 20, 52);

                // Información del estudiante
                doc.setFontSize(14);
                doc.setTextColor(40, 40, 40);
                let yPosition = 70;

                doc.text("DATOS PERSONALES", 20, yPosition);
                yPosition += 15;

                doc.setFontSize(12);
                doc.text(`Nombre: ${name}`, 25, yPosition);
                yPosition += 10;

                doc.text(`Correo Electrónico: ${email}`, 25, yPosition);
                yPosition += 10;

                if (age) {
                    doc.text(`Edad: ${age} años`, 25, yPosition);
                    yPosition += 10;
                }

                if (course) {
                    doc.text(`Curso: ${course}`, 25, yPosition);
                    yPosition += 10;
                }

                yPosition += 10;
                doc.setFontSize(14);
                doc.text("INFORMACIÓN DEL PROYECTO", 20, yPosition);
                yPosition += 15;

                doc.setFontSize(12);
                if (project) {
                    doc.text(`Proyecto: ${project}`, 25, yPosition);
                    yPosition += 10;
                }

                if (projectLink) {
                    doc.text(`Link: ${projectLink}`, 25, yPosition);
                    yPosition += 10;
                }

                if (description) {
                    doc.text(`Descripción:`, 25, yPosition);
                    yPosition += 7;
                    
                    // Dividir la descripción en líneas para que quepa en el PDF
                    const lines = doc.splitTextToSize(description, 160);
                    for (let i = 0; i < lines.length; i++) {
                        doc.text(lines[i], 25, yPosition);
                        yPosition += 7;
                    }
                    yPosition += 3;
                }

                if (date) {
                    const formattedDate = new Date(date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    doc.text(`Fecha: ${formattedDate}`, 25, yPosition);
                    yPosition += 10;
                }

                // Información adicional
                yPosition += 20;
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`Informe generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES')}`, 20, yPosition);

                // Pie de página
                doc.setFontSize(8);
                doc.text('Documento generado automáticamente por la aplicación web de informes PDF', 20, 280);

                // Generar vista previa
                const pdfDataUri = doc.output("datauristring");
                
                // Ocultar loading y mostrar PDF
                loading.style.display = "none";
                reportContainer.innerHTML = `
                    <iframe width="100%" height="600px" src="${pdfDataUri}"></iframe>
                    <div style="margin-top: 15px;">
                        <button onclick="downloadPDF()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                            📥 Descargar PDF
                        </button>
                        <button onclick="clearForm()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                            🗑️ Limpiar Formulario
                        </button>
                    </div>
                `;

                // Guardar PDF para descarga
                window.currentPDF = doc;

            } catch (error) {
                console.error("Error generando PDF:", error);
                loading.style.display = "none";
                reportContainer.innerHTML = `
                    <p style="color: red;">❌ Error al generar el informe. Por favor, intenta nuevamente.</p>
                `;
            }
        }

        function downloadPDF() {
            if (window.currentPDF) {
                const name = document.getElementById("name").value.trim();
                const filename = `informe_${name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
                window.currentPDF.save(filename);
            }
        }

        function clearForm() {
            document.getElementById("reportForm").reset();
            document.getElementById('date').valueAsDate = new Date();
            document.getElementById("reportContainer").innerHTML = `
                <p id="placeholder">📋 Aquí aparecerá la vista previa de tu informe PDF</p>
            `;
            window.currentPDF = null;
        }

        // Validación en tiempo real
        document.getElementById("email").addEventListener("input", function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = "#dc3545";
            } else {
                this.style.borderColor = "#e0e0e0";
            }
        });

        // Validación para el link del proyecto
        document.getElementById("projectLink").addEventListener("input", function() {
            const link = this.value;
            const urlRegex = /^https?:\/\/.+/;
            
            if (link && !urlRegex.test(link)) {
                this.style.borderColor = "#dc3545";
            } else {
                this.style.borderColor = "#e0e0e0";
            }
        });