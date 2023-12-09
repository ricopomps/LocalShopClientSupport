import { Container, Nav, Navbar } from "react-bootstrap";
import { UserType } from "../../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";
import styles from "../../styles/navbar.module.css";
import { useUser } from "../../context/UserContext";
import RoutesEnum from "../../utils/routesEnum";

interface NavBarProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  toggleNotifications: () => void;
}
const NavBar = ({
  onLoginClicked,
  onSignUpClicked,
  toggleNotifications,
}: NavBarProps) => {
  const { user } = useUser();
  return (
    <Navbar
      className={styles.navbar}
      bg="dark"
      variant="dark"
      expand="sm"
      sticky="top"
    >
      <Container className={styles.navbar}>
        {user?.userType === UserType.shopper ? (
          <Navbar.Brand
            className={styles.textNavbar}
            as={Link}
            to={RoutesEnum.SHOPPER}
          >
            Lojas
          </Navbar.Brand>
        ) : (
          <Navbar.Brand
            className={styles.textNavbar}
            as={Link}
            to={RoutesEnum.PRODUCTS}
          >
            Produtos
          </Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav>
            <Nav.Link
              className={styles.textNavbar}
              onClick={toggleNotifications}
            >
              Notificações
            </Nav.Link>
          </Nav>
          {user?.userType === UserType.store && (
            <Nav>
              <Nav.Link
                className={styles.textNavbar}
                as={Link}
                to={RoutesEnum.REPORTS}
              >
                Relatórios
              </Nav.Link>
            </Nav>
          )}
          {user?.store && (
            <>
              <Nav>
                <Nav.Link
                  className={styles.textNavbar}
                  as={Link}
                  to={RoutesEnum.MAP}
                >
                  Mapa
                </Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link
                  className={styles.textNavbar}
                  as={Link}
                  to={RoutesEnum.STORE}
                >
                  Loja
                </Nav.Link>
              </Nav>
            </>
          )}
          <Nav className="ms-auto">
            {user ? (
              <NavBarLoggedInView user={user} />
            ) : (
              <NavBarLoggedOutView
                onLoginClicked={onLoginClicked}
                onSignUpClicked={onSignUpClicked}
              />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
