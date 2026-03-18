import { Instagram, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_SECTION_ID, scrollToContact } from '../utils/scrollToContact';

export function Footer() {
  const footerLinkClass = 'text-[#F6F3EE]/70 transition-colors hover:text-[#D6A25B]';
  const socialLinkClass =
    'flex h-10 w-10 items-center justify-center border border-[#F6F3EE]/30 transition-colors hover:border-[#D6A25B] hover:text-[#D6A25B]';

  return (
    <footer id={CONTACT_SECTION_ID} className="bg-[#2F2F2F] text-[#F6F3EE] py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Shop */}
          <div>
            <h3 className="font-['Playfair_Display'] text-xl mb-6">Shop</h3>
            <ul className="space-y-3 font-['Inter']">
              <li>
                <a href="#" className={footerLinkClass}>
                  Suits
                </a>
              </li>
              <li>
                <a href="#" className={footerLinkClass}>
                  Jackets
                </a>
              </li>
              <li>
                <a href="#" className={footerLinkClass}>
                  Shirts
                </a>
              </li>
              <li>
                <Link to="/shoes" className={footerLinkClass}>
                  Shoes
                </Link>
              </li>
              <li>
                <Link to="/accessories" className={footerLinkClass}>
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-['Playfair_Display'] text-xl mb-6">Help</h3>
            <ul className="space-y-3 font-['Inter']">
              <li>
                <a
                  href={`#${CONTACT_SECTION_ID}`}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToContact();
                  }}
                  className={footerLinkClass}
                >
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className={footerLinkClass}>
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className={footerLinkClass}>
                  Shipping
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-['Playfair_Display'] text-xl mb-6">Company</h3>
            <ul className="space-y-3 font-['Inter']">
              <li>
                <a href="#" className={footerLinkClass}>
                  About
                </a>
              </li>
              <li>
                <a href="#" className={footerLinkClass}>
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-['Playfair_Display'] text-xl mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/imperial.dilan/"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit Imperial Dilan on Instagram"
                className={socialLinkClass}
              >
                <Instagram size={20} />
              </a>
              <a href="#" className={socialLinkClass}>
                <Facebook size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@imperial.dilan?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noreferrer"
                aria-label="Visit Imperial Dilan on TikTok"
                className={socialLinkClass}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F6F3EE]/10 pt-8 text-center">
          <p className="text-[#F6F3EE]/50 font-['Inter'] text-sm">
            (c) 2026 GENTLEMAN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
