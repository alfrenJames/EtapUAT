import React, { useEffect, useState } from 'react';
import './css/style.css';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ScrollReveal from 'scrollreveal';

const LandingPage = ({ onLogin }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalRegisterVisible, setModalRegisterVisible] = useState(false);
    

  // Function to toggle the visibility of FAQ answers
    const toggleAnswer = (index) => {
        const answer = document.getElementById(`answer-${index}`);
        if (answer) {
            answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
        }
    };
     

    // Function to handle scroll active link
    const scrollActive = () => {
        const scrollY = window.pageYOffset;
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 50;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
            } else {
                document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
            }
        });
    };

    // Function to change header background on scroll
    const scrollHeader = () => {
        const nav = document.getElementById('header');
        if (window.scrollY >= 200) nav.classList.add('scroll-header');
        else nav.classList.remove('scroll-header');
    };

    // Function to show scroll top button
    const scrollTop = () => {
        const scrollTop = document.getElementById('scroll-top');
        if (window.scrollY >= 560) scrollTop.classList.add('show-scroll');
        else scrollTop.classList.remove('show-scroll');
    };

    // Function to handle theme change
    const handleThemeChange = () => {
        console.log("change-theme");
        const themeButton = document.getElementById('theme-button');
        const darkTheme = 'dark-theme';
        const iconTheme = 'bx-sun';
    
        const selectedTheme = localStorage.getItem('selected-theme');
        const selectedIcon = localStorage.getItem('selected-icon');
    
        if (selectedTheme) {
            document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
            if (themeButton) { // Check if themeButton is not null
                themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme);
            }
        }
    
        if (themeButton) { // Check if themeButton is not null
            // Remove any existing event listener to prevent multiple bindings
            themeButton.removeEventListener('click', toggleTheme);
            themeButton.addEventListener('click', toggleTheme);
        }
    };

    const toggleTheme = () => {
        const themeButton = document.getElementById('theme-button');
        const darkTheme = 'dark-theme';
        const iconTheme = 'bx-sun';
        
        document.body.classList.toggle(darkTheme);
        themeButton.classList.toggle(iconTheme);
        localStorage.setItem('selected-theme', getCurrentTheme());
        localStorage.setItem('selected-icon', getCurrentIcon());
    };

    // Get current theme
    const getCurrentTheme = () => document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const getCurrentIcon = () => document.getElementById('theme-button').classList.contains('bx-sun') ? 'bx-moon' : 'bx-sun';

    useEffect(() => {
        window.addEventListener('scroll', scrollActive);
        window.addEventListener('scroll', scrollHeader);
        window.addEventListener('scroll', scrollTop);
        handleThemeChange();

        return () => {
            window.removeEventListener('scroll', scrollActive);
            window.removeEventListener('scroll', scrollHeader);
            window.removeEventListener('scroll', scrollTop);
        };
    }, []);
    
    const FAQItem = ({ question, answer, index, toggleAnswer }) => (
        <div className="faq__content" onClick={() => toggleAnswer(index)}>
            <h3 className="faq__question">{question}</h3>
            <p className="faq_answer" id={`answer-${index}`} style={{ display: 'none' }}>
                {answer}
            </p>
        </div>
    );

    useEffect(() => {
      
        /*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
        const sections = document.querySelectorAll('section[id]');
        const scrollActive = () => {
            const scrollY = window.pageYOffset;

            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute('id');

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
                } else {
                    document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
                }
            });
        };
        window.addEventListener('scroll', scrollActive);

        /*==================== CHANGE BACKGROUND HEADER ====================*/
        const scrollHeader = () => {
            const nav = document.getElementById('header');
            if (window.scrollY >= 200) nav.classList.add('scroll-header');
            else nav.classList.remove('scroll-header');
        };
        window.addEventListener('scroll', scrollHeader);

        /*==================== SHOW SCROLL TOP ====================*/
        const scrollTop = () => {
            const scrollTop = document.getElementById('scroll-top');
            if (window.scrollY >= 560) scrollTop.classList.add('show-scroll');
            else scrollTop.classList.remove('show-scroll');
        };
        window.addEventListener('scroll', scrollTop);

        /*==================== DARK LIGHT THEME ====================*/
        const themeButton = document.getElementById('theme-button');
        const darkTheme = 'dark-theme';
        const iconTheme = 'bx-sun';

        const selectedTheme = localStorage.getItem('selected-theme');
        const selectedIcon = localStorage.getItem('selected-icon');

        const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
        const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun';

        if (selectedTheme) {
            document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
            themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme);
        }

        themeButton.addEventListener('click', () => {
            document.body.classList.toggle(darkTheme);
            themeButton.classList.toggle(iconTheme);
            localStorage.setItem('selected-theme', getCurrentTheme());
            localStorage.setItem('selected-icon', getCurrentIcon());
        });

        /*==================== SCROLL REVEAL ANIMATION ====================*/
        const sr = ScrollReveal({
            origin: 'top',
            distance: '30px',
            duration: 2000,
            reset: true
        });

        sr.reveal(`.home__data, .home__img,
                    .about__data, .about__img,
                    .services__content, .menu__content,
                    .app__data, .app__img,
                    .contact__data, .contact__button,
                    .footer__content`, {
            interval: 200
        });

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener('scroll', scrollActive);
            window.removeEventListener('scroll', scrollHeader);
            window.removeEventListener('scroll', scrollTop);
        };
    }, []);
    return (
        <div>
            {/* <!--========== SCROLL TOP ==========--> */}
            <a href="#" className="scrolltop" id="scroll-top">
                <i className='bx bx-chevron-up scrolltop__icon'></i>
            </a>

            {/* <!--========== HEADER ==========--> */}
            <header className="l-header" id="header">
                <nav className="nav bd-container">
                    <a href="#" className="nav__logo">ETap</a>
                    <li id="loginShow" className="nav__item nav__link" onClick={() => setModalVisible(true)} style={{cursor: 'pointer'}}>Login</li>
                    <li id="registerShow" className="nav__item nav__link" onClick={() => setModalRegisterVisible(true)} style={{cursor: 'pointer'}}>Register</li>
                    
            
                    <div className="nav__menu" id="nav-menu">
                        <ul className="nav__list">
                            <li className="nav__item"><a href="#home" className="nav__link active-link">Home</a></li>
                            <li className="nav__item"><a href="#about" className="nav__link">About</a></li>
                            <li className="nav__item"><a href="#services" className="nav__link">Pricing</a></li>
                            <li className="nav__item"><a href="#menu" className="nav__link">How To</a></li>
                            <li className="nav__item"><a href="#faq" className="nav__link">FAQ's</a></li>
                            <li><i className='bx bx-moon change-theme' id="theme-button"></i></li>
                        </ul>
                    </div>

                    <div className="nav__toggle" id="nav-toggle">
                        <ul>
                            <li onClick={() => setModalVisible(true)} style={{cursor: 'pointer'}}><i className='bx bxs-user-circle'></i></li>
                            <li onClick={() => setModalRegisterVisible(true)} style={{cursor: 'pointer'}}><i className='bx bx-user-plus'></i></li>
                        </ul>
                    </div>
                </nav>
            </header>

            <main className="l-main">
                {/* hero section */}
                <section className="home" id="home">
                    <div className="home__container bd-container bd-grid">
                        <div className="home__data">
                            <h1 className="home__title">ETap</h1>
                           
                            <h2 className="home__subtitle">
                            <i className='bx-pull-left bx bxs-quote-alt-left bx-lg'/>
                                Har-E ng kalsada
                                <i className='bx-pull-right bx bxs-quote-alt-right bx-lg'/>
                            </h2>
                            
                            <a href="#" className="button" id="start-modal-button" onClick={() => setModalVisible(true)}>Start ETap Experience</a>
                        </div>
                        <img src="assets/img/ETap.png" alt="" className="home__img" style={{ borderRadius: '100%', width: '50vw' }} />
                    </div>
                </section>
                {/* <!--========== ABOUT ==========--> */}
                <section className="about section bd-container" id="about">
                    <div className="about__container bd-grid">
                        <div className="about__data">
                            <span className="section-subtitle about__initial">About us</span>
                            <h2 className="section-title about__initial">We-Tap is a group of dedicated students</h2>
                            <p className="about__description">
                                Working together to make a positive impact. Our goal is to use our combined skills and experience to create an improved innovation of e-bike to provide transportation inside the school campus with the goal of reducing carbon footprints by utilizing practical solutions for improved processes, and to achieve great results. We believe in teamwork, innovation, and always striving to do better.
                            </p>
                            <a href="#" className="button">Learn More</a>
                        </div>

                        <img src="assets/img/Our_Team.jpg" alt="" className="about__img" />
                    </div>
                </section>
                {/* <!--========== SERVICES ==========--> */}
                <section className="services section bd-container" id="services">
                    <span className="section-subtitle">Offering</span>
                    <h2 className="section-title">Our amazing services</h2>

                    <div className="services__container bd-grid">
                        <div className="services__content">
                            <h3 className="services__title">✅Real Time Ebike Rent Monitoring</h3>
                            <h3 className="services__title">✅Easy Approval</h3> {/* Fixed typo: "Apporval" to "Approval" */}
                            <h3 className="services__title">✅Account Management</h3> {/* Fixed typo: "Acount" to "Account" */}
                        </div>
                        <div className="services__content">
                            <h3 className="services__title">🛵PHP 100 = 20 Rides</h3>
                            <h3 className="services__title">🛵PHP 80 = 15 Rides</h3>
                            <h3 className="services__title">🛵PHP 60 = 10 Rides</h3>
                            <h3 className="services__title">🛵PHP 40 = 5 Rides</h3>
                        </div>
                    </div>
                </section>
                {/* <!--========== How to ==========--> */}
                <section className="menu section bd-container" id="menu">
                    <span className="section-subtitle">How TO</span>
                    <h2 className="section-title">Let's Get Started</h2>

                    <div className="menu__container bd-grid">
                        <div className="menu__content">
                            <img src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7865.jpg?t=st=1727578453~exp=1727582053~hmac=0b7d6994b737368e4eb6f0bb3881e1189a230940745ab07b2884d71e360421aa&w=740" alt="" className="menu__img" />
                            <h3 className="menu__name">Create Account</h3>
                            <i className='bx bx-arrow-from-left'></i>
                        </div>

                        <div className="menu__content">
                            <img src="https://img.freepik.com/free-vector/flat-design-installment-illustration_23-2149409058.jpg?t=st=1727578651~exp=1727582251~hmac=c73c7d954986a86f7d32b8c6ae9c4b6bfe7f77f023aa9166292cc3263166ac7d&w=740" alt="" className="menu__img" />
                            <h3 className="menu__name">Scan Gcash Payment to Add Ride Credits and Topup amount</h3>
                            <i className='bx bx-arrow-from-left'></i>
                        </div>
                        
                        <div className="menu__content">
                            <img src="https://img.freepik.com/free-vector/hands-holding-tablet-with-forefinger-clicking-start-button-new-application-launch-flat-illustration_74855-20595.jpg?t=st=1727579065~exp=1727582665~hmac=535611219af21274b044787723531b344f2d12d0a5efaa048a86f2f4662de351&w=740" alt="" className="menu__img" />
                            <h3 className="menu__name">Start ETaP</h3>
                            <i className='bx bx-arrow-from-left'></i>
                        </div>

                        <div className="menu__content">
                            <img src="https://img.freepik.com/free-vector/colorful-bike-parking-concept_1284-38068.jpg?t=st=1727579288~exp=1727582888~hmac=f7050ea20e30d205bc4c85dde0e2ef988e0a707f3d97f5d6d37145f5f99fb5cc&w=740" alt="" className="menu__img" />
                            <h3 className="menu__name">Park in Designated Area</h3>
                            <i className='bx bxs-flag-checkered'></i>
                        </div>
                    </div>
                </section>

                {/* <!--========== FAQ ==========--> */}
                <section className="faq section bd-container" id="faq">
                <span className="section-subtitle">Frequently Asked Questions</span>
                <h2 className="section-title">FAQ</h2>

                <div className="faq__container bd-grid">
                <FAQItem 
                    question="Q1: Does E-Tap come with a driver?" 
                    answer="A1: The E-Tap does not include a designated driver. Instead, when you Use the E-Tap, you have the flexibility and responsibility to drive it yourself to your destination on campus. This allows for more convenience and control over your schedule, ensuring you can get to where you need to be without having to wait for a driver. It’s a simple, user-friendly option for those who prefer autonomy while navigating the campus." 
                    index={0} 
                    toggleAnswer={toggleAnswer} 
                />
                <FAQItem 
                    question="Q2: How will customers make payments?" 
                    answer="A2: Customers can make payments through GCash, a convenient and secure mobile payment method. After completing the payment, users will need to upload their proof of payment on the E-Tap website for verification. This ensures a smooth and hassle-free process, allowing customers to confirm their payments quickly and efficiently." 
                    index={1} 
                    toggleAnswer={toggleAnswer} 
                />
                <FAQItem 
                    question="Q3: What is the maximum passenger capacity of the E-Tap?" 
                    answer="A3: The E-Tap has a maximum capacity of 3 people, including the driver. This setup is perfect for small groups or individuals who need a quick and efficient way to get around campus, offering a comfortable and eco-friendly mode of transportation." 
                    index={2} 
                    toggleAnswer={toggleAnswer} 
                />
                <FAQItem 
                    question="Q4: Does the web application require an internet connection to work?" 
                    answer="A4: Yes, the web application requires an internet connection to connect to E-Tap. The bike also has internet connectivity." 
                    index={3} 
                    toggleAnswer={toggleAnswer} 
                />
                <FAQItem 
                    question="Q5: How do I create an account?" 
                    answer="A5: The user would have to scan the QR code located in the e-tap unit, they will then be re-directed to a page. In this page, the user would have to fill out the provided questions, submit all the necessary info and then create the account." 
                    index={4} 
                    toggleAnswer={toggleAnswer} 
                />
                <FAQItem 
                    question="Q6: How do I use the E-Tap?" 
                    answer="A6: The users are required to create an account in order to avail the service. The users would be re-directed to a website upon scanning of a QR code in the unit. In this website, users would have to register their account, upload their ID for validity and add load via gcash to start the unit." 
                    index={5} 
                    toggleAnswer={toggleAnswer} 
                />
                <FAQItem 
                    question="Q7: Does etap have a security measure?" 
                    answer="A7: Yes, for our security measure we have camera that provides the front and back perspective of E-tap, we also have the data of users information." 
                    index={6} 
                    toggleAnswer={toggleAnswer} 
                />
                <FAQItem 
                    question="Q8: Who is liable if etap encounters an accident?" 
                    answer="A8: If E-tap encounters an accident, the one who is using E-tap will be liable for the damage, but if the other party is the one who caused the accident, we can give footage where the accident occurred." 
                    index={7} 
                    toggleAnswer={toggleAnswer} 
                />
                </div>
            </section>

            {/* <!--========== FOOTER ==========--> */}
            <footer className="footer section bd-container">
            <div className="footer__container bd-grid">
                <div className="footer__content">
                    <a href="#" className="footer__logo">ETap</a>
                    <span className="footer__description">Ebike Rental System</span>
                    <div>
                        <a href="https://www.facebook.com/people/E-Tap/61566478507769/" className="footer__social"><i className='bx bxl-facebook'></i></a>
                        <a href="#" className="footer__social"><i className='bx bxl-instagram'></i></a>
                        <a href="#" className="footer__social"><i className='bx bxl-twitter'></i></a>
                    </div>
                </div>

                <div className="footer__content">
                    <h3 className="footer__title">Information</h3>
                    <ul>
                        <li><a href="#" className="footer__link">EBike Rental</a></li>
                        <li><a href="#" className="footer__link">Pricing</a></li>
                        <li><a href="#" className="footer__link">How To</a></li>
                        <li><a href="#" className="footer__link">About Us</a></li>
                    </ul>
                </div>

                <div className="footer__content">
                    <h3 className="footer__title">Know More</h3>
                    <ul>
                        <li><a href="#" className="footer__link">Event</a></li>
                        <li><a href="#" className="footer__link">Contact us</a></li>
                        <li><a href="#" className="footer__link">Privacy policy</a></li>
                        <li><a href="#" className="footer__link">Terms of services</a></li>
                    </ul>
                </div>

                <div className="footer__content">
                    <h3 className="footer__title">Address</h3>
                    <ul>
                        <li>WCC AeroTech Bldg</li>
                        <li>Brgy Linmansangan</li>
                        <li>Binalonan - 2436</li>
                        <li>Pangasinan</li>
                        <li>ETapRental@gmail.com</li>
                    </ul>
                </div>
            </div>

            <p className="footer__copy">&#169; 2024 ETap. All right reserved</p>
            </footer>
            </main>
        <LoginModal 
        isVisible={isModalVisible} 
        onClose={() => setModalVisible(false)} 
        onLogin={onLogin} // Pass onLogin to the modal
        />
        <RegisterModal 
        isVisible={isModalRegisterVisible} 
        onClose={() => setModalRegisterVisible(false)} 
        />
        </div>
        
    );
};

export default LandingPage;