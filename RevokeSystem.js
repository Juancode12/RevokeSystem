
        // ========== MODAL FUNCTIONS ==========
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cerrar modal al hacer clic fuera del contenido
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            closeModal(modal.id);
        });
    }
});
        // Removed full language system and kept only essential scripts
        document.addEventListener('DOMContentLoaded', function() {
            // ========== MOBILE MENU ==========
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const closeMobileMenu = document.getElementById('close-mobile-menu');
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenuButton && closeMobileMenu && mobileMenu) {
                mobileMenuButton.addEventListener('click', () => {
                    mobileMenu.classList.add('open');
                });
                closeMobileMenu.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                });
                document.querySelectorAll('#mobile-menu a').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.classList.remove('open');
                    });
                });
            }

            // ========== COOKIE BANNER ==========
            const cookieBanner = document.getElementById('cookie-banner');
            const cookieAccept = document.getElementById('cookie-accept');
            const cookieReject = document.getElementById('cookie-reject');
            if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
                setTimeout(() => {
                    cookieBanner.classList.add('show');
                }, 2000);
            }
            if (cookieAccept) {
                cookieAccept.addEventListener('click', () => {
                    localStorage.setItem('cookieAccepted', 'true');
                    cookieBanner.classList.remove('show');
                });
            }
            if (cookieReject) {
                cookieReject.addEventListener('click', () => {
                    localStorage.setItem('cookieAccepted', 'false');
                    cookieBanner.classList.remove('show');
                });
            }

            // ========== FAQ ACCORDION ==========
            document.querySelectorAll('.faq-question').forEach(question => {
                question.addEventListener('click', () => {
                    const item = question.parentElement;
                    item.classList.toggle('active');
                    const icon = question.querySelector('i');
                    if (icon) {
                        if (item.classList.contains('active')) {
                            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
                        } else {
                            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
                        }
                    }
                });
            });

            // ========== SMOOTH SCROLLING ==========
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // ========== HEADER EFFECT ON SCROLL ==========
            window.addEventListener('scroll', () => {
                const header = document.querySelector('header');
                if (header) {
                    if (window.scrollY > 50) {
                        header.classList.add('shadow-lg');
                    } else {
                        header.classList.remove('shadow-lg');
                    }
                }
            });

            // ========== SCROLL REVEAL ANIMATION ==========
            function revealOnScroll() {
                const reveals = document.querySelectorAll('.scroll-reveal');
                reveals.forEach(el => {
                    const windowHeight = window.innerHeight;
                    const elementTop = el.getBoundingClientRect().top;
                    const elementVisible = 150;
                    if (elementTop < windowHeight - elementVisible) {
                        el.classList.add('active');
                    }
                });
            }
            window.addEventListener('scroll', revealOnScroll);
            revealOnScroll();

            // ========== E-BOOK FILTERING ==========
            document.querySelectorAll('.filter-btn').forEach(button => {
                button.addEventListener('click', function () {
                    document.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('bg-accent-500', 'text-iron-900');
                    });
                    this.classList.add('bg-accent-500', 'text-iron-900');
                    const filter = this.getAttribute('data-filter');
                    document.querySelectorAll('.ebook-card').forEach(ebook => {
                        if (filter === 'all') {
                            ebook.classList.remove('hidden');
                        } else {
                            const categories = ebook.getAttribute('data-category').split(',');
                            if (categories.includes(filter)) {
                                ebook.classList.remove('hidden');
                            } else {
                                ebook.classList.add('hidden');
                            }
                        }
                    });
                });
            });

            // ========== ARTICLE SEARCH ==========
            const searchInput = document.getElementById('article-search');
            const articles = document.querySelectorAll('#articulos .grid > div');
            if (searchInput) {
                searchInput.addEventListener('input', function () {
                    const term = this.value.toLowerCase();
                    articles.forEach(article => {
                        const title = article.querySelector('h3')?.textContent.toLowerCase() || '';
                        const content = article.querySelector('p')?.textContent.toLowerCase() || '';
                        if (term === '' || title.includes(term) || content.includes(term)) {
                            article.style.display = 'block';
                        } else {
                            article.style.display = 'none';
                        }
                    });
                });
            }

            // ========== COUNTDOWN TIMER FOR EBOOK ==========
            function updateEbookCountdown() {
                const launchEnd = new Date();
                launchEnd.setDate(launchEnd.getDate() + 3); // 3 days from now
                
                const now = new Date();
                const difference = launchEnd - now;
                
                if (difference <= 0) {
                    document.getElementById('countdown-ebook1').textContent = "Offer expired!";
                    return;
                }
                
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                
                document.getElementById('countdown-ebook1').textContent = 
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }

            // Update countdown every second
            setInterval(updateEbookCountdown, 1000);
            updateEbookCountdown();

            // Activate "All" filter by default
            const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
            if (allFilter) {
                allFilter.classList.add('bg-accent-500', 'text-iron-900');
            }
        });
        
        // Form submission handler
        document.getElementById("mailForm").addEventListener("submit", function (e) {
            e.preventDefault(); // Evita que la página se recargue

            // Obtener valores
            const nombre  = document.getElementById("identifer").value.trim();
            const email   = document.getElementById("mails").value.trim();
            const topic   = document.getElementById("topic").value.trim();
            const mensaje = document.getElementById("mensaje").value.trim();

            // Validación de correo
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validaciones
            if (!nombre) {
                document.getElementById("resultado").textContent = "⚠️ El nombre es obligatorio.";
                document.getElementById("resultado").style.color = "#f87171";
                return;
            }

            if (!email) {
                document.getElementById("resultado").textContent = "⚠️ El correo es obligatorio.";
                document.getElementById("resultado").style.color = "#f87171";
                return;
            }

            if (!emailRegex.test(email)) {
                document.getElementById("resultado").textContent = "⚠️ Por favor, escribe un correo válido.";
                document.getElementById("resultado").style.color = "#f87171";
                return;
            }

            if (!topic) {
                document.getElementById("resultado").textContent = "⚠️ El asunto es obligatorio.";
                document.getElementById("resultado").style.color = "#f87171";
                return;
            }

            if (!mensaje) {
                document.getElementById("resultado").textContent = "⚠️ El mensaje no puede estar vacío.";
                document.getElementById("resultado").style.color = "#f87171";
                return;
            }

            // 🔑 Claves alineadas al DTO del backend
            const data = {
                nombre: nombre,
                email: email,
                topic: topic,
                mensaje: mensaje
            };

            // Envío al backend
            fetch("http://localhost:8080/api/mail/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    document.getElementById("resultado").textContent = "✅ Mensaje enviado con éxito.";
                    document.getElementById("resultado").style.color = "#d4af37";
                    document.getElementById("mailForm").reset(); // Limpia el formulario
                } else {
                    document.getElementById("resultado").textContent = "⚠️ Error al enviar el mensaje.";
                    document.getElementById("resultado").style.color = "#f87171";
                }
            })
            .catch(error => {
                console.error("Error de conexión:", error);
                document.getElementById("resultado").textContent = "❌ No se pudo conectar al servidor.";
                document.getElementById("resultado").style.color = "#ef4444";
            });
        });

        // Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.add('open');
        });
        
        closeMobileMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
        });
    });
    
    // Force mobile viewport fix
    function fixViewport() {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }
    
    fixViewport();
});
    