import React from 'react';
import './landingpage.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import heroImg from '../images/Premium Photo _ A hamburger with a smokey background and the words.jpeg'
import restaurant from '../images/restaurant.png'
import tracking from '../images/tracking.png'
import sale from '../images/sale.png'
import burgimg from '../images/download (22).jpeg'
import search from '../images/search (1).png'
import cloche from '../images/cloche.png'
import complete from '../images/complete.png'
import plate from '../images/plate.png'
import mobile from '../images/Food Mobile App Design.jpeg'
import { Link } from 'react-router-dom';
const LandingPage = () => {
  return (
    <div className='land'>
      <header>
        <div className="landing-container">
          <div className="logo">
            <h1>HungryHub</h1>
          </div>
          <nav>
            <ul>
              <li><Link to={'/home'}>Home</Link></li>
              {/* <li><a href="#">Menu</a></li> */}
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
          <div className="auth-options">
            <Link to={'/restaurant-register'} className="button add-restaurant">Add Restaurant</Link>
            <Link to={'/login'} className="button sign-in">Sign In</Link>
          </div>
        </div>
      </header>
      
      <section className="hero">
        <div className="landing-container">
          <div className="hero-content">
            <h1>Your Favorite Food Delivered Hot & Fresh</h1>
            <p>Order food from the best restaurants in your area with just a few clicks.</p>
            <Link to={'/home'} className="cta-button">Order Now</Link>
          </div>
          <div className="hero-image">
            <img src={heroImg} alt="Delicious Food" />
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="landing-container">
          <div className="feature">
            <img src={restaurant} alt="Feature Icon 1" />
            <h3>Diverse Restaurants</h3>
            <p>Choose from diverse cuisines to satisfy your cravings.</p>
          </div>
          <div className="feature">
            <img src={tracking} alt="Feature Icon 2" />
            <h3>Real-Time Tracking</h3>
            <p>Track your order in real-time from the restaurant to your doorstep.</p>
          </div>
          <div className="feature">
            <img src={sale} alt="Feature Icon 3" />
            <h3>Exclusive Offers</h3>
            <p>Enjoy exclusive deals and discounts on your favorite meals.</p>
          </div>
        </div>
      </section>
      
      <section className="popular-restaurants">
        <div className="landing-container">
          <h2>Popular Restaurants</h2>
          <div className="restaurant-cards">
            <div className="restaurant-card">
              <img src={burgimg} alt="Restaurant 1" className="restaurant-image" />
              <div className="restaurant-info">
                <h3>Italiano Pizzeria</h3>
                <p>Authentic Italian pizzas and pastas</p>
                <a href="#" className="btn">Order Now</a>
              </div>
            </div>
            <div className="restaurant-card">
              <img src={burgimg} alt="Restaurant 2" className="restaurant-image" />
              <div className="restaurant-info">
                <h3>Sushi Master</h3>
                <p>Delicious sushi rolls and Japanese cuisine</p>
                <a href="#" className="btn">Order Now</a>
              </div>
            </div>
            <div className="restaurant-card">
              <img src={burgimg} alt="Restaurant 3" className="restaurant-image" />
              <div className="restaurant-info">
                <h3>Mexican Fiesta</h3>
                <p>Spicy tacos and authentic Mexican flavors</p>
                <a href="#" className="btn">Order Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="how-it-works">
        <div className="landing-container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <img src={search} alt="Step 1 Icon" className="step-icon" />
              <h3>Browse Restaurants</h3>
              <p>Explore diverse restaurants and cuisines available in your area.</p>
            </div>
            <div className="blank"></div>
            <div className="blank"></div>
            <div className="step">
              <img src={cloche} alt="Step 2 Icon" className="step-icon" />
              <h3>Choose Your Meal</h3>
              <p>Select your favorite dishes and add them to your cart.</p>
            </div>
            <div className="step">
              <img src={complete} alt="Step 3 Icon" className="step-icon" />
              <h3>Place Your Order</h3>
              <p>Checkout with a few simple steps and track your order in real-time.</p>
            </div>
            <div className="blank"></div>
            <div className="blank"></div>
            <div className="step">
              <img src={plate} alt="Step 4 Icon" className="step-icon" />
              <h3>Enjoy Your Food</h3>
              <p>Receive your food at your doorstep and enjoy your meal.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="download-app">
        <div className="landing-container">
          <div className="landing-row">
            <div className="col">
              <div className="app-content">
                <h2>Download the HungryHub App</h2>
                <p>Get easy access to your favorite restaurants with the HungryHub mobile app.</p>
                <div className="app-buttons">
                  <a href="#" className="btn btn-appstore">Download on the App Store</a>
                  <a href="#" className="btn btn-playstore">Get it on Google Play</a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="app-preview">
                <img src={mobile} alt="App Preview" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer>
        <div className="landing-container">
          <div className="footer-sections">
            <div className="footer-section">
              <h3>About Us</h3>
              <p>HungryHub is your go-to platform for ordering delicious food from the best restaurants in your area.</p>
            </div>
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Menu</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Follow Us</h3>
              <div className="social-icons">
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
              </div>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: support@hungryhub.com</p>
              <p>Phone: (123) 456-7890</p>
              <p>Address: 123 Foodie Lane, Flavor Town, USA</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 HungryHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;