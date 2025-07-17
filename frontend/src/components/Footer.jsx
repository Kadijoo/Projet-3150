import React from "react";
import "../styles/Footer.css";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-column">
        <h4>Lien rapide</h4>
        <p>Accueil</p>
        <p>Menu</p>
        <p>Se connecter</p>
      </div>
      <div className="footer-column">
        <h4>Contact/ Assistance</h4>
        <p><strong>SupportTechnique:</strong></p>
        <p style={{ color: "#52b788" }}>support@testmymenu.com</p>
        <p>FAQ</p>
        <p>Politique de confidentialite</p>
      </div>
      <div className="footer-column">
        <h4>Suivez-nous</h4>
        <div className="social-icons">
          <FaFacebookF className="icon" />
          <FaLinkedinIn className="icon" />
          <SiTiktok className="icon" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;