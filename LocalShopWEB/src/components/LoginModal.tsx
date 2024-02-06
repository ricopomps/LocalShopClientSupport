import { useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useUser } from "../context/UserContext";
import { UnathorizedError } from "../errors/http_errors";
import { User } from "../models/user";
import * as NotesApi from "../network/users_api";
import { LoginCredentials } from "../network/users_api";
import stylesUtils from "../styles/utils.module.css";
import TextInputField from "./form/TextInputField";

interface LoginModalProps {
  onDismiss: () => void;
  onLoginSuccessful: (user: User) => void;
}
const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();
  const { setAccessToken } = useUser();
  async function onSubmit(credentials: LoginCredentials) {
    try {
      const user = await NotesApi.login(credentials, setAccessToken);
      onLoginSuccessful(user);
    } catch (error) {
      if (error instanceof UnathorizedError) setErrorText(error.message);
      else alert(error);
      console.error(error);
    }
  }
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="username"
            label="Usuário"
            type="text"
            placeholder="Usuário"
            register={register}
            registerOptions={{ required: "Campo Obrigatório" }}
            error={errors.username}
          />
          <TextInputField
            name="password"
            label="Senha"
            type="password"
            placeholder="Senha"
            register={register}
            registerOptions={{ required: "Campo Obrigatório" }}
            error={errors.password}
          />
          <Button
            type="submit"
            disabled={isSubmitting}
            className={stylesUtils.width100}
          >
            Login
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
