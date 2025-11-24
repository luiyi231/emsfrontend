import React from "react";

/**
 * Footer — diseño minimalista azul/blanco
 * Mantiene consistencia visual con el Header.
 * Siempre visible al final de la página.
 */

const Footer = () => {
    return (
        <footer className="bg-primary text-white mt-auto py-3 shadow-sm">
            <div className="container text-center small">
                <span>© {new Date().getFullYear()} Property Rights — Tito Zúñiga</span>
            </div>
        </footer>
    );
};

export default Footer;
