document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('landing-form');
    const volumenSelect = document.getElementById('volumen');
    const filterMessage = document.getElementById('filter-message');
    const submitBtn = document.getElementById('submit-btn');
    const heroVideo = document.getElementById('hero-video');

    // Control de tiempo del video (14s a 42s)
    if (heroVideo) {
        heroVideo.addEventListener('timeupdate', function () {
            if (this.currentTime < 14) {
                this.currentTime = 14;
            }
            if (this.currentTime > 42) {
                this.currentTime = 14;
            }
        });
        heroVideo.currentTime = 14;
    }

    // Manejo proactivo del filtro de leads (Tema Claro)
    volumenSelect.addEventListener('change', (e) => {
        if (e.target.value === 'bajo') {
            filterMessage.style.display = 'block';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.3';
            submitBtn.style.cursor = 'not-allowed';
            submitBtn.innerHTML = '<i class="fas fa-lock"></i> REQUERIMIENTO BLOQUEADO';
        } else {
            filterMessage.style.display = 'none';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.innerHTML = 'Solicitar Cotización';
        }
    });

    // Envío de formulario con nuevos campos
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (volumenSelect.value === 'bajo') return;

        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> PROCESANDO...';
        submitBtn.style.pointerEvents = 'none';

        const formData = {
            nombre: document.getElementById('nombre').value,
            empresa: document.getElementById('empresa').value,
            producto: document.getElementById('producto').value,
            mercado: document.getElementById('mercado').value,
            volumen: volumenSelect.value,
            email: document.getElementById('email').value,
            mensaje: document.getElementById('mensaje').value
        };

        fetch('send_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) throw new Error('Error en el servidor');
                return response.json();
            })
            .then(data => {
                submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> SOLICITUD ENVIADA';
                submitBtn.style.background = '#059669';

                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = 'Solicitar Cotización';
                    submitBtn.style.background = '';
                    submitBtn.style.pointerEvents = 'all';
                }, 4000);
            })
            .catch(error => {
                console.error('Error:', error);
                submitBtn.innerHTML = '<i class="fas fa-times-circle"></i> ERROR AL ENVIAR';
                submitBtn.style.background = '#dc2626';

                setTimeout(() => {
                    submitBtn.innerHTML = 'Solicitar Cotización';
                    submitBtn.style.background = '';
                    submitBtn.style.pointerEvents = 'all';
                }, 4000);
            });
    });

    // Smooth scroll optimizado
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 90,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animación simple de entrada al hacer scroll
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card, .form-box').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });
});
