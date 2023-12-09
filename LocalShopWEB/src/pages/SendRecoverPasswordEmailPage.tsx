import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextInputField from "../components/form/TextInputField";
import * as AuthApi from "../network/authApi";
import { SendRecoverPasswordEmailForm } from "../network/authApi";
import styles from "../styles/LoginDesktop.module.css";

const SendRecoverPasswordEmailPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SendRecoverPasswordEmailForm>();

  const onSubmit = async (data: SendRecoverPasswordEmailForm) => {
    try {
      await AuthApi.sendRecoverPasswordEmail(data);
      toast.success("Email enviado com sucesso!");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.mainText}>Insira o seu e-mail:</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          className={styles.inputLogin}
          name="email"
          label=""
          type="text"
          placeholder="Email"
          register={register}
          registerOptions={{
            required: "Campo Obrigatório",
          }}
          error={errors.email}
        />
        <Button className={styles.btn} type="submit" disabled={isSubmitting}>
          ENVIAR
        </Button>
        <button className={styles.btn} onClick={() => navigate(-1)}>
          VOLTAR
        </button>
      </Form>
    </div>
  );
};

export default SendRecoverPasswordEmailPage;
