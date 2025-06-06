import React from "react";
import Card from "../components/shared/Card";
import Button from "../components/shared/Button";
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div>
      <Card icon="phone" title="Login Here">
        <div>
          {/* <input type="tel" id="phone" name="phone" placeholder="123-456-7890" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required> */}
          <Link to="/authenticate">
            <Button text="Next" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
