// =========================================================
// D'Bayong Art — Site scripts
// Single source of truth: linked once (with defer) on every
// page. Guards added so pages missing optional elements
// (e.g. no category filter on aboutus.html) never throw.
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('.header');

    // ---- Category filtering (no-op if no buttons on this page) ----
    function switchCategory(category) {
        categoryButtons.forEach(btn => {
            const isActive = btn.dataset.category === category;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });

        const cards = document.querySelectorAll('#collectionGrid .product-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const match = category === 'all' || card.dataset.category === category;
            card.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        const emptyMsg = document.getElementById('categoryEmpty');
        if (emptyMsg) emptyMsg.hidden = visibleCount > 0;
    }

    if (categoryButtons.length) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => switchCategory(btn.dataset.category));
        });
    }

    // ---- Mobile menu (guarded: only wires up if both elements exist) ----
    if (mobileNav && mobileMenuBtn) {
        const closeMobileMenu = () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        };

        const toggleMobileMenu = () => {
            const isOpen = mobileNav.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        };

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // ---- Smooth in-page navigation (also closes mobile menu) ----
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href.length <= 1) return; // guards against a bare "#" (invalid selector)
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                closeMobileMenu();
            });
        });
    }

    // ---- Sticky header shadow on scroll (throttled via rAF) ----
    if (header) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 100);
                ticking = false;
            });
        }, { passive: true });
    }
});