import { Button } from "react-bootstrap";

interface NavBarLoggedOutViewProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
}
const NavBarLoggedOutView = ({
  onLoginClicked,
  onSignUpClicked,
}: NavBarLoggedOutViewProps) => {
  return (
    <>
      <Button onClick={onSignUpClicked}>Cadastrar</Button>
      <Button onClick={onLoginClicked}>Entrar</Button>
    </>
  );
};

export default NavBarLoggedOutView;
