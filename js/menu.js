/* Menu mobilne — panel wysuwany z prawej strony.
   Skrypt tylko przełącza klasy; cała animacja siedzi w css/input.css. */
(function () {
    'use strict';

    var FOCUSABLE = 'a[href], button:not([disabled])';
    /* Próg desktopu w px; panel musi znikać dokładnie tam, gdzie CSS pokazuje
       zwykłe menu. Nadpisywalny przez data-nav-breakpoint na panelu. */
    var DEFAULT_BREAKPOINT = 1024;

    document.addEventListener('DOMContentLoaded', function () {
        var toggle = document.querySelector('[data-nav-toggle]');
        var drawer = document.querySelector('[data-nav-drawer]');
        var overlay = document.querySelector('[data-nav-overlay]');

        if (!toggle || !drawer || !overlay) {
            return;
        }

        var breakpoint = parseInt(drawer.getAttribute('data-nav-breakpoint'), 10);
        if (isNaN(breakpoint)) {
            breakpoint = DEFAULT_BREAKPOINT;
        }

        var closeBtn = drawer.querySelector('[data-nav-close]');
        var desktop = window.matchMedia('(min-width: ' + breakpoint + 'px)');
        var isOpen = false;

        function openMenu() {
            if (isOpen) {
                return;
            }
            isOpen = true;
            drawer.removeAttribute('inert');
            drawer.classList.add('is-open');
            overlay.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
            document.documentElement.classList.add('nav-lock');
            document.body.classList.add('nav-lock');
            (closeBtn || drawer.querySelector(FOCUSABLE) || drawer).focus();
        }

        function closeMenu(returnFocus) {
            if (!isOpen) {
                return;
            }
            isOpen = false;
            drawer.classList.remove('is-open');
            overlay.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.documentElement.classList.remove('nav-lock');
            document.body.classList.remove('nav-lock');
            if (returnFocus !== false) {
                toggle.focus();
            }
            drawer.setAttribute('inert', '');
        }

        toggle.addEventListener('click', function () {
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener('click', function () {
            closeMenu();
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                closeMenu();
            });
        }

        /* Kliknięcie w link zamyka panel — bez oddawania focusu, bo strona się przeładowuje. */
        drawer.addEventListener('click', function (event) {
            if (event.target.closest('a[href]')) {
                closeMenu(false);
            }
        });

        document.addEventListener('keydown', function (event) {
            if (!isOpen) {
                return;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                closeMenu();
                return;
            }

            if (event.key !== 'Tab') {
                return;
            }

            var items = Array.prototype.slice.call(drawer.querySelectorAll(FOCUSABLE));
            if (items.length === 0) {
                return;
            }

            var first = items[0];
            var last = items[items.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        /* Po powiększeniu okna do desktopu panel nie ma prawa zostać otwarty. */
        function handleDesktop(event) {
            if (event.matches) {
                closeMenu(false);
            }
        }

        if (typeof desktop.addEventListener === 'function') {
            desktop.addEventListener('change', handleDesktop);
        } else if (typeof desktop.addListener === 'function') {
            desktop.addListener(handleDesktop);
        }
    });
})();
