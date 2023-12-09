import { useState } from "react";
import { useForm } from "react-hook-form";
import { User, UserType } from "../models/user";
import { SignUpCredentials } from "../network/notes_api";
import * as NotesApi from "../network/notes_api";
import {
  Alert,
  Button,
  Container,
  Form,
  Modal,
  Nav,
  Navbar,
} from "react-bootstrap";
import TextInputField from "./form/TextInputField";
import stylesUtils from "../styles/utils.module.css";
import { ConflictError } from "../errors/http_errors";
import { useUser } from "../context/UserContext";

interface SignUpModalProps {
  onDismiss: () => void;
  onSignUpSuccessful: (user: User) => void;
}
const SignUpModal = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
  const [errorText, setErrorText] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>(UserType.shopper);
  const { setAccessToken } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  const BaseNavBar = () => {
    return (
      <Navbar className="bg-body-tertiary" expand="sm" sticky="top">
        <Nav className={stylesUtils.width100}>
          <Container className={stylesUtils.flexCenter}>
            <Nav.Link
              active={userType === UserType.shopper}
              onClick={() => setUserType(UserType.shopper)}
            >
              Shopper
            </Nav.Link>
            <Nav.Link
              active={userType === UserType.store}
              onClick={() => setUserType(UserType.store)}
            >
              Lojista
            </Nav.Link>
          </Container>
        </Nav>
      </Navbar>
    );
  };

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      const newUser = await NotesApi.signUp(
        { ...credentials, userType },
        setAccessToken
      );
      onSignUpSuccessful(newUser);
    } catch (error) {
      if (error instanceof ConflictError) setErrorText(error.message);
      else alert(error);
      console.error(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Cadastro</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <BaseNavBar />
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
            name="email"
            label="Email"
            type="email"
            placeholder="Email"
            register={register}
            registerOptions={{ required: "Campo Obrigatório" }}
            error={errors.email}
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
            Cadastrar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SignUpModal;
