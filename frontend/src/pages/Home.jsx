import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/shared/Card";
import Button from "../components/shared/Button";

const Home = () => {
  return (
    <div>
      <Card title="Welcome to Coders House" icon="logo">
        <div className="text-center mt-9">
          <p className="text-[#c4c5c5]">
            We’re working hard to get Codershouse ready for everyone! While we
            wrap up the finishing touches, we’re adding people gradually to make
            sure nothing breaks :)
          </p>

          <Link to = "/authenticate">
            <Button text = "Lets Go" />
          </Link>
          
          <div className=" space-x-1 text-[#0077ff] cursor-pointer">
            <span>Have an invite text?</span>
            <Link to="/login">
              <span>Login</span>
            </Link>
          </div>
          
        </div>
      </Card>
    </div>
  );
};

export default Home;
