"use client";
import { motion } from "framer-motion";
import { Mountain, Instagram, Facebook, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-white py-12 overflow-hidden">
      {/* Ligne d'accent en haut */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-500 to-blue-500" />
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Structure principale */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand - Votre version améliorée */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">CVAV</h3>
                <p className="text-gray-600 text-sm">Communauté d'Aventuriers</p>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed max-w-md mb-6">
              Une communauté qui transforme chaque rencontre en aventure mémorable 
              et chaque paysage en souvenir éternel.
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex space-x-3">
              {[
                { icon: Instagram, testId: "link-instagram", color: "hover:text-pink-500" },
                { icon: Facebook, testId: "link-facebook", color: "hover:text-blue-600" },
                { icon: Linkedin, testId: "link-linkedin", color: "hover:text-blue-700" },
              ].map((social) => (
                <a
                  key={social.testId}
                  href="#" 
                  data-testid={social.testId}
                  className={`w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 transition-all duration-300 ${social.color} hover:bg-gray-200`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
              
              {/* WhatsApp */}
              <a
                href="#"
                data-testid="link-whatsapp"
                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 transition-all duration-300 hover:text-green-600 hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.586z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6 text-lg">Navigation</h4>
            <ul className="space-y-3 text-gray-600">
              {[
                { href: "#about", testId: "link-about", label: "À propos" },
                { href: "#services", testId: "link-services", label: "Expériences" },
                { href: "#testimonials", testId: "link-testimonials", label: "Témoignages" },
                { href: "#contact", testId: "link-contact", label: "Contact" },
              ].map((link) => (
                <li key={link.testId}>
                  <a 
                    href={link.href} 
                    data-testid={link.testId}
                    className="hover:text-blue-600 transition-colors duration-300 block py-1"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6 text-lg">Contact</h4>
            <ul className="space-y-4 text-gray-600">
              {[
                { 
                  icon: Phone, 
                  content: "+225 07 07 07 07 07", 
                  testId: "link-phone" 
                },
                { 
                  icon: Mail, 
                  content: "contact@cvav.ci", 
                  testId: "link-email" 
                },
                { 
                  icon: MapPin, 
                  content: "Daloa, Côte d'Ivoire", 
                  testId: "link-location" 
                },
              ].map((contact) => (
                <li key={contact.testId} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <contact.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{contact.content}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bas de footer */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-500 text-sm">
            © 2025 CVAV Daloa. Tous droits réservés.
          </p>
          
          <div className="flex space-x-6 text-gray-500 text-sm">
            {[
              { href: "#", testId: "link-privacy", label: "Confidentialité" },
              { href: "#", testId: "link-terms", label: "Conditions" },
              { href: "#", testId: "link-crp", label: "Mentions légales" },
            ].map((link) => (
              <a
                key={link.testId}
                href={link.href}
                data-testid={link.testId}
                className="hover:text-gray-700 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}