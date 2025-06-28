import Card from "../components/shared/Card";
import Button from "../components/shared/Button";
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div>
      <Card icon="phone" title="Login Here">
        <div>
          <Link to="/authenticate">
            <Button text="Next" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
