import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaPhone, FaTwitter, FaPinterest, FaEnvelope, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-wrapper">
            <div className="footer-overlay" />

            <div className="footer-content">
                <div className="footer-grid">

                    {/* Brand Column */}
                    <div className="footer-col brand-col">
                        <Image
                            src="/Zinnie-logo.png"
                            alt="Zinnie Logo"
                            className="footer-logo"
                            width={140}
                            height={100}
                        />
                        <p className="brand-tagline">
                            SHREE BALAJI FOODS
                        </p>
                        <div className="social-icons">
                            <a href="https://x.com/zinniezeera" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <FaTwitter size={20} />
                            </a>
                            <a href="https://www.linkedin.com/in/zinniezeera/" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <FaLinkedin size={20} />
                            </a>
                            <a href="https://www.instagram.com/zinniezeera/" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <FaInstagram size={20} />
                            </a>
                            <a href="https://in.pinterest.com/zinniezeera/" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <FaPinterest size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Column */}
                    <div className="footer-col">
                        <h4 className="footer-heading">About</h4>
                        <ul className="footer-links">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/faqs">Faqs</Link></li>
                            <li><Link href="/become-a-distributor/">Distributor</Link></li>
                            <li><Link href="/blog/">Blog</Link></li>
                            <li><Link href="/contact-us/">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4 className="footer-heading">Products</h4>
                        <ul className="footer-links">
                            <li><Link href="/product/">All Products</Link></li>
                            <li><Link href="/product/chilli-guava-drink/">Chilli Guava Drink</Link></li>
                            <li><Link href="/product/nimbu-zeera-drink/">Nimbu Zeera</Link></li>
                            <li><Link href="/product/ginger-lemon-drink/">Ginger Lemon</Link></li>
                            <li><Link href="/product/zeera-masala-soda/">Zinnie Zeera</Link></li>
                            <li><Link href="/product/mango-drink/">Zinnie Mango</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div className="footer-col">
                        <h4 className="footer-heading">Contact Us</h4>
                        <ul className="contact-list">
                            <li>
                                <FaPhone className="contact-icon" />
                                <span>+91-8432221711</span>
                            </li>
                            <li>
                                <FaEnvelope className="contact-icon" />
                                <span>info@balajibeverages.com</span>
                            </li>
                            {/* <li>
                                <FaMapMarkerAlt className="contact-icon" />
                                <span>Mumbai, Maharashtra, India</span>
                            </li> */}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p className="copyright">
                        © {new Date().getFullYear()} <span>Zinnie</span>. All rights reserved.
                    </p>

                    <p className="Developed">
                        <Link href="/sitemap"> Sitemap </Link> | Developed By
                        <a href="https://lensclickerdigital.com" target="_blank" rel="noopener noreferrer"> LensClickerDigital </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;