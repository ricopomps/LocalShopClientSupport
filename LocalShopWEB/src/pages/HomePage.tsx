import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
import google from "../assets/google.svg";
import email from "../assets/email.svg";
import styles from "../styles/HomePage.module.css";
import { getGoogleAuthUser, googleAuth } from "../network/authApi";
import { User, UserType } from "../models/user";
import { useUser } from "../context/UserContext";
import RoutesEnum from "../utils/routesEnum";

interface ButtonLoginProps {
  imagem?: string;
  children: ReactNode;
  path: string;
  onClick?: () => void;
}

interface HomePageProps {}

const HomePage = ({}: HomePageProps) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const ButtonLogin = ({
    imagem,
    children,
    path,
    onClick,
  }: ButtonLoginProps) => {
    return (
      <button
        onClick={() => (onClick ? onClick() : navigate(path))}
        className="btn"
      >
        {imagem && <img src={imagem} alt="button logo" />}
        {children}{" "}
      </button>
    );
  };

  const openGoogleOAuthPopup = async () => {
    try {
      const { url } = await googleAuth();
      const popupWidth = 450;
      const popupHeight = 600;

      const features = `
        width=${popupWidth},
        height=${popupHeight},
        top=${(window.innerHeight - popupHeight) / 2},
        left=${(window.innerWidth - popupWidth) / 2},
        menubar=no,
        toolbar=no,
        location=no,
        status=no,
        resizable=yes,
        scrollbars=yes
        `;

      const newWindow = window.open(url, "GoogleOAuthPopup", features);
      if (newWindow) handleOAuthRedirect(newWindow);

      const checkPopupClosed = setInterval(() => {
        if (newWindow && newWindow.closed) {
          clearInterval(checkPopupClosed);
        }
      }, 1000);

      if (newWindow) {
        newWindow.focus();
      }
    } catch (error) {}
  };

  const handleOAuthRedirect = (newWindow: Window) => {
    const checkPopupLocation = setInterval(() => {
      try {
        if (newWindow.location.href.includes("code")) {
          clearInterval(checkPopupLocation);
          const url = newWindow.location.href;

          const params = new URLSearchParams(url.split("?")[1]);
          const code = params.get("code");
          const userType = params.get("state");

          if (code) {
            fetchUserData(code, userType ?? undefined);
          }

          newWindow.close();
        }
      } catch (error) {
        if (!newWindow) clearInterval(checkPopupLocation);
      }
    }, 1000);
  };

  const fetchUserData = async (code: any, userType?: string) => {
    try {
      const { user, accessToken } = await getGoogleAuthUser(code, userType);
      login(user, accessToken);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
      console.error("Error fetching user data:", error);
    }
  };

  const login = async (user: User, accessToken: string) => {
    setUser(user);
    if (user.userType === UserType.shopper) {
      navigate(RoutesEnum.SHOPPER);
    } else {
      navigate(user.store ? RoutesEnum.PRODUCTS : RoutesEnum.STORE);
    }
  };

  return (
    <div className={styles.main}>
      <img src={logo} alt="logo" className="image" />
      <h1 className={styles.title}>LocalShop</h1>
      <h2 className={styles.subtitle}>Como desejar continuar?</h2>
      <ButtonLogin
        imagem={google}
        onClick={() => openGoogleOAuthPopup()}
        path={RoutesEnum.LOGIN}
      >
        Continue com Google
      </ButtonLogin>
      <ButtonLogin imagem={email} path={RoutesEnum.LOGIN}>
        Continue com E-Mail
      </ButtonLogin>
      <Link to={RoutesEnum.SIGN_UP_SHOPPER} className={styles.cadastreLink}>
        Não tem login? Cadastre-se
      </Link>
      <ButtonLogin path={RoutesEnum.SIGN_UP_STORE}>
        Deseja cadastrar sua loja?
      </ButtonLogin>
    </div>
  );
};

export default HomePage;
