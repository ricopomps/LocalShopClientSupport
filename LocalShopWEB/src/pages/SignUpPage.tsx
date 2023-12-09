import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import logo from "../assets/logo.svg";
import styles from "../styles/SignUpPage.module.css";
import { SignUpCredentials } from "../network/notes_api";
import TextInputField from "../components/form/TextInputField";
import * as NotesApi from "../network/notes_api";
import { User, UserType } from "../models/user";
import { googleAuth } from "../network/authApi";
import google from "../assets/google.svg";
import { useUser } from "../context/UserContext";
import RoutesEnum from "../utils/routesEnum";

interface SignUpPageProps {
  onSignUpSuccessful: (user: User) => void;
  userType: UserType;
}
interface ButtonLoginProps {
  imagem?: string;
  children: ReactNode;
  path: string;
  onClick?: () => void;
}

const SignUpPage = ({ onSignUpSuccessful, userType }: SignUpPageProps) => {
  const placeholderLogin = "Login";
  const placeholderEmail = "E-mail";
  const placeholderSenha = "Senha";
  const placeholderCPF = "CPF";
  const placeholderSenhaConfirma = "Confirmação de senha";
  const { setAccessToken } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  const googleAuthCall = async () => {
    try {
      const { url } = await googleAuth(userType);
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const ButtonLogin = ({
    imagem,
    children,
    path,
    onClick,
  }: ButtonLoginProps) => {
    return (
      <button
        onClick={() => (onClick ? onClick() : navigate(path))}
        className={`btn ${styles.googleButton}`}
      >
        {imagem && <img src={imagem} alt="button logo" />}
        {children}{" "}
      </button>
    );
  };

  const onSubmit = async (data: SignUpCredentials) => {
    try {
      data.userType = userType;
      const user = await NotesApi.signUp(data, setAccessToken);
      toast.success("Cadastro realizado com sucesso!");
      onSignUpSuccessful(user);
      navigate(
        userType === UserType.shopper ? RoutesEnum.SHOPPER : RoutesEnum.STORE
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };
  return (
    <div className={styles.main}>
      <img src={logo} alt="logo" className="imageLogin" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          name="username"
          type="text"
          placeholder={placeholderLogin}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.username}
        />
        <TextInputField
          name="email"
          type="text"
          placeholder={placeholderEmail}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.email}
        />
        <TextInputField
          name="cpf"
          type="text"
          placeholder={placeholderCPF}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.cpf}
        />
        <TextInputField
          name="password"
          type="password"
          placeholder={placeholderSenha}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.password}
        />
        <TextInputField
          name="confirmedPassword"
          type="password"
          placeholder={placeholderSenhaConfirma}
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.confirmedPassword}
        />
        <ButtonLogin
          imagem={google}
          onClick={() => googleAuthCall()}
          path={RoutesEnum.LOGIN}
        >
          Cadastrar com o Google
        </ButtonLogin>
        <Button className={styles.btn} type="submit" disabled={isSubmitting}>
          CADASTRAR
        </Button>
      </Form>
      <button onClick={() => navigate(-1)} className={styles.btn}>
        VOLTAR
      </button>
    </div>
  );
};
export default SignUpPage;
