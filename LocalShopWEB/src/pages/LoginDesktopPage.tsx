import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
import TextInputField from "../components/form/TextInputField";
import { useUser } from "../context/UserContext";
import { UserType } from "../models/user";
import * as UsersApi from "../network/users_api";
import { LoginCredentials } from "../network/users_api";
import styles from "../styles/LoginDesktop.module.css";
import RoutesEnum from "../utils/routesEnum";

interface LoginDesktopPageProps {}
const LoginDesktopPage = ({}: LoginDesktopPageProps) => {
  const { setUser, setAccessToken } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();
  const onSubmit = async (data: LoginCredentials) => {
    try {
      const user = await UsersApi.login(data, setAccessToken);
      setUser(user);
      if (user.userType === UserType.shopper) {
        navigate(RoutesEnum.SHOPPER);
      } else {
        navigate(user.store ? RoutesEnum.PRODUCTS : RoutesEnum.STORE);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };
  return (
    <div className={styles.main}>
      <img src={logo} alt="logo" className={styles.imageLogin} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          className={styles.inputLogin}
          name="username"
          type="text"
          placeholder="Usuário"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.username}
        />
        <TextInputField
          className={styles.inputLogin}
          name="password"
          type="password"
          placeholder="Senha"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.password}
        />
        <Link to={RoutesEnum.FORGOT_PASSWORD} className={styles.cadastreLink}>
          Esqueceu a senha?
        </Link>
        <Button className={styles.btn} type="submit" disabled={isSubmitting}>
          LOGIN
        </Button>
      </Form>
      <button onClick={() => navigate(-1)} className={styles.btn}>
        VOLTAR
      </button>
    </div>
  );
};

export default LoginDesktopPage;
