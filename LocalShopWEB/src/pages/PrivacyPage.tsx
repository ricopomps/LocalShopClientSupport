import { useForm } from "react-hook-form";
import TextInputField from "../components/form/TextInputField";
import { LoginCredentials } from "../network/notes_api";

const PrivacyPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();
  return (
    <div>
      <TextInputField
        name="username"
        type="text"
        placeholder="Usuário"
        register={register}
        registerOptions={{ required: "Campo Obrigatório" }}
        error={errors.username}
      />
      <TextInputField
        name="password"
        type="password"
        placeholder="Senha"
        register={register}
        registerOptions={{ required: "Campo Obrigatório" }}
        error={errors.password}
      />
    </div>
  );
};

export default PrivacyPage;
