import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import Product from "../components/Product";
import { listProducts } from "../actions/ProdcutActions";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../styles/Home.css";

import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@material-ui/icons/VerifiedUserOutlined";
import PaymentOutlinedIcon from "@material-ui/icons/PaymentOutlined";
import AssignmentReturnOutlinedIcon from "@material-ui/icons/AssignmentReturnOutlined";
import WhatshotOutlinedIcon from "@material-ui/icons/WhatshotOutlined";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const HERO_SLIDES = [
  {
    badge: "Limited Time Deal",
    title: "Next-Gen Computing & Laptops",
    subtitle: "High-performance ultrabooks & gaming rigs built for creators, pros, and gamers.",
    cta: "Explore Laptops",
    link: "/category/laptop",
    image: "https://m.media-amazon.com/images/S/aplus-media/vc/342b936a-69f1-4e59-89ba-7ddb98c1acda.jpg",
  },
  {
    badge: "Top Rated Peripherals",
    title: "Pro Mechanical Keyboards & Gear",
    subtitle: "Precision engineering, customizable RGB, and tactile switches for maximum productivity.",
    cta: "Shop Accessories",
    link: "/category/accessories",
    image: "https://cdn.shopify.com/s/files/1/1780/7915/files/Thermaltake_Level_20_RGB_Titanium_Gaming_Keyboard_From_The_Peripheral_Store_Banner_01.jpg?v=1598266526",
  },
  {
    badge: "Ultra-Crisp Displays",
    title: "High-Refresh Gaming Monitors",
    subtitle: "Immersive 4K and 144Hz+ IPS panels designed for esports champions and cinephiles.",
    cta: "View Monitors",
    link: "/category/monitor",
    image: "https://cdn.shopify.com/s/files/1/1780/7915/files/Game_Monitor_6a7a1deb-2d61-4307-99ac-f8c5a18d298f.jpg?8000210842524768871",
  },
];

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  const productList = useSelector((state) => state.productList);
  const { products } = productList;

  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: true,
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 680,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="home-page-container">
      {/* Hero Showcase Carousel */}
      <section className="hero-carousel-section" aria-label="Hero Highlights">
        <Slider {...heroSettings}>
          {HERO_SLIDES.map((slide, idx) => (
            <div key={idx} className="hero-slide-item">
              <div
                className="hero-slide-card"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="hero-slide-overlay">
                  <div className="hero-slide-content">
                    <span className="hero-deal-badge">{slide.badge}</span>
                    <h1 className="hero-headline">{slide.title}</h1>
                    <p className="hero-description">{slide.subtitle}</p>
                    <Link to={slide.link} className="hero-cta-btn">
                      <span>{slide.cta}</span>
                      <ArrowForwardIcon fontSize="small" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Trust & Value Proposition Features */}
      <section className="features-value-bar" aria-label="Store Guarantees">
        <div className="value-feature-card">
          <div className="feature-icon-bubble">
            <LocalShippingOutlinedIcon />
          </div>
          <div className="feature-text-block">
            <h4>Free Express Shipping</h4>
            <p>On orders above ₹499 throughout India</p>
          </div>
        </div>

        <div className="value-feature-card">
          <div className="feature-icon-bubble">
            <VerifiedUserOutlinedIcon />
          </div>
          <div className="feature-text-block">
            <h4>100% Genuine Gear</h4>
            <p>Direct manufacturer warranty backed</p>
          </div>
        </div>

        <div className="value-feature-card">
          <div className="feature-icon-bubble">
            <PaymentOutlinedIcon />
          </div>
          <div className="feature-text-block">
            <h4>Instant UPI Payments</h4>
            <p>Scan & pay with GPay, PhonePe & Paytm</p>
          </div>
        </div>

        <div className="value-feature-card">
          <div className="feature-icon-bubble">
            <AssignmentReturnOutlinedIcon />
          </div>
          <div className="feature-text-block">
            <h4>7-Day Easy Replacement</h4>
            <p>No questions asked doorstep return</p>
          </div>
        </div>
      </section>

      {/* Core Featured Products Section */}
      <ProductList />

      {/* Trending Horizontal Slider Section */}
      {products && products.length > 0 && (
        <section className="trending-carousel-section">
          <div className="trending-header-bar">
            <div>
              <div className="section-badge">
                <WhatshotOutlinedIcon fontSize="small" />
                <span>Trending Now</span>
              </div>
              <h2 className="section-title">Popular Electronics & Gear</h2>
            </div>
            <Link to="/category/laptop" className="view-more-link">
              <span>View All</span>
              <ArrowForwardIcon fontSize="small" />
            </Link>
          </div>

          <div className="trending-slider-wrapper">
            <Slider {...sliderSettings}>
              {products.map((product) => (
                <div key={product._id} className="trending-slide-cell">
                  <Product product={product} />
                </div>
              ))}
            </Slider>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
