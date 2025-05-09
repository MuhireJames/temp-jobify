import Wrapper from "../assets/wrappers/LandingPage";
import main from "../assets/images/main.svg";

import { Link } from "react-router-dom";
import { Logo } from "../components";

function Landing() {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            Job <span>tracking</span> app
          </h1>
          <p>
          With Jobify, managing job opportunities has never been easier. Create detailed job listings in just a few clicks, update them as roles evolve, and edit postings anytime to attract the right candidates. Whether you're posting your first opening or managing multiple positions, Jobify gives you full control with real-time editing and instant updates. Plus, browse and read job listings effortlessly through a clean, intuitive interface designed to save you time and keep your hiring process efficient.
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn">
            Login/Demo User
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
}

export default Landing;
