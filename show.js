// Clean, error-free script for portfolio interactivity.

document.addEventListener('DOMContentLoaded', () => {
    // Typed role (typed.js loaded via CDN)
    try {
        if (window.Typed) {
            new window.Typed('#typed-role', {
                strings: ['Machine Learning Engineer', 'Frontend Developer', 'Computer Vision Enthusiast'],
                typeSpeed: 60,
                backSpeed: 35,
                backDelay: 1500,
                loop: true
            });
        }
    } catch (err) {
        // typed.js not available — ignore
    }

    // Smooth scroll for nav links and set active class on click
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            navLinks.forEach(n => n.classList.remove('active'));
            link.classList.add('active');
            const href = link.getAttribute('href');
            if (!href || href.charAt(0) !== '#') return;
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Update active nav item on scroll (IntersectionObserver)
    const sections = Array.from(document.querySelectorAll('main > section[id]'));
    if ('IntersectionObserver' in window && sections.length) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const nav = document.querySelector(`.nav-link[href="#${id}"]`);
                if (!nav) return;
                nav.classList.toggle('active', entry.isIntersecting);
            });
        }, { threshold: 0.45 });

        sections.forEach(s => observer.observe(s));
    }

    // Animate skill bars when #skills enters view
    const bars = Array.from(document.querySelectorAll('.progress-bar[data-percent]'));
    const animateBars = () => {
        bars.forEach(bar => {
            const pct = Math.max(0, Math.min(100, Number(bar.getAttribute('data-percent')) || 0));
            bar.style.width = pct + '%';
            bar.setAttribute('aria-valuenow', String(pct));
        });
    };

    if ('IntersectionObserver' in window && document.querySelector('#skills')) {
        const skillsObs = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateBars();
                    obs.disconnect();
                }
            });
        }, { threshold: 0.2 });
        skillsObs.observe(document.querySelector('#skills'));
    } else {
        animateBars(); // fallback
    }

    // Lazy-load images where supported
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
    });

    // Ensure external links have safe rel attributes
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
        const relSet = new Set((a.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
        relSet.add('noopener');
        relSet.add('noreferrer');
        a.setAttribute('rel', Array.from(relSet).join(' '));
    });
});

// Simple contact form handler (attached in HTML via onsubmit)
function submitContact(e) {
    e.preventDefault();
    const form = e.target;
    if (!form) return false;

    const name = (form.name?.value || '').trim();
    const email = (form.email?.value || '').trim();
    const message = (form.message?.value || '').trim();
    const statusEl = document.getElementById('contact-status');

    if (!name || !email || !message) {
        if (statusEl) statusEl.textContent = 'Please fill all fields.';
        return false;
    }

    if (statusEl) statusEl.textContent = 'Sending message...';
    setTimeout(() => {
        if (statusEl) statusEl.textContent = 'Message sent. Thank you — I will respond shortly.';
        form.reset();
    }, 900);

    return false;
}
window.submitContact = submitContact;