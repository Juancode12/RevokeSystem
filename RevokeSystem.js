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

// ========== AUTO-ABRIR MODAL DESDE URL (HASH O PARÁMETRO) ==========
document.addEventListener('DOMContentLoaded', function() {
    // Hash (#modalX)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#modal')) {
        const modalId = hash.replace('#', '');
        setTimeout(function() {
            openModal(modalId);
        }, 500);
    }

    // Parámetro ?modal=modalX
    const urlParams = new URLSearchParams(window.location.search);
    const modalParam = urlParams.get('modal');
    if (modalParam) {
        setTimeout(function() {
            openModal(modalParam);
        }, 500);
    }

    // ========== IR A TARJETA DE E-BOOK DESDE HASH ==========
    const ebookHash = window.location.hash;
    if (ebookHash && ebookHash.startsWith('#ebook-')) {
        const ebookId = ebookHash.replace('#', '');
        const targetElement = document.getElementById(ebookId);
        if (targetElement) {
            setTimeout(function() {
                // Desplazarse suavemente hasta la tarjeta
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Añadir clase de resaltado
                targetElement.classList.add('highlight');
                // Quitar el resaltado después de 3 segundos
                setTimeout(function() {
                    targetElement.classList.remove('highlight');
                }, 3000);
            }, 500);
        }
    }
});

// ========== COPIAR ENLACE DE UN E-BOOK ESPECÍFICO ==========
function copiarEnlaceEbook(ebookId) {
    const url = window.location.href.split('#')[0] + '#' + ebookId;
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            mostrarToast('✅ Enlace copiado: ' + ebookId);
        }).catch(() => {
            prompt('Copia este enlace:', url);
        });
    } else {
        prompt('Copia este enlace:', url);
    }
}

function mostrarToast(mensaje) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-2xl z-50 border border-gray-600';
    toast.innerHTML = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ========== DOMContentLoaded ==========
document.addEventListener('DOMContentLoaded', function() {
    // ========== MOBILE MENU ==========
    const mobileMenu = document.getElementById('mobile-menu');
    const openButton = document.getElementById('mobile-menu-button');
    const closeButton = document.getElementById('close-mobile-menu');
    const overlay = document.getElementById('mobile-overlay');

    function openMenu() {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = 'auto';
    }

    if (openButton) {
        openButton.addEventListener('click', openMenu);
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Cerrar al hacer clic en cualquier enlace del menú
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Cerrar al hacer clic fuera del menú
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('open')) {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickOnOpenButton = openButton && openButton.contains(e.target);
            if (!isClickInsideMenu && !isClickOnOpenButton) {
                closeMenu();
            }
        }
    });

    // Cerrar al redimensionar a escritorio
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // ========== COOKIE BANNER ==========
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieReject = document.getElementById('cookie-reject');
    if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
        setTimeout(() => cookieBanner.classList.add('show'), 2000);
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
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
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

    // ========== SCROLL REVEAL ==========
    function revealOnScroll() {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 150) {
                el.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // ========== E-BOOK FILTERING ==========
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function () {
            // Remover clase activa de todos
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active', 'bg-accent-500', 'text-iron-900');
                btn.style.backgroundColor = '';
                btn.style.color = '';
            });
            // Activar este
            this.classList.add('active');
            this.style.backgroundColor = '#d4af37';
            this.style.color = '#1a1a1a';
            this.style.borderColor = '#d4af37';

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
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const term = this.value.toLowerCase();
            document.querySelectorAll('#articulos .grid > div').forEach(article => {
                const title = article.querySelector('h3')?.textContent?.toLowerCase() || '';
                const content = article.querySelector('p')?.textContent?.toLowerCase() || '';
                if (term === '' || title.includes(term) || content.includes(term)) {
                    article.style.display = 'block';
                } else {
                    article.style.display = 'none';
                }
            });
        });
    }

    // ========== COUNTDOWN ==========
    function updateEbookCountdown() {
        const launchEnd = new Date();
        launchEnd.setDate(launchEnd.getDate() + 3);
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
    setInterval(updateEbookCountdown, 1000);
    updateEbookCountdown();

    // Activar filtro "All" por defecto
    const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilter) {
        allFilter.classList.add('active');
        allFilter.style.backgroundColor = '#d4af37';
        allFilter.style.color = '#1a1a1a';
        allFilter.style.borderColor = '#d4af37';
    }
});