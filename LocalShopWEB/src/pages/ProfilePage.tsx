import { Button, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProfilePage.module.css";
import logo from "../assets/logo.svg";
import { User } from "../models/user";
import * as UserApi from "../network/notes_api";
import { toast } from "react-toastify";
interface ProfilePageProps {
  user: User;
  updateUser: (user: User) => void;
}

export interface ProfileForm {
  username: string;
  email: string;
  cpf: string;
  image?: string;
}
const ProfilePage = ({ user, updateUser }: ProfilePageProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      cpf: user?.cpf || "",
      image: user?.image || "",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    try {
      const response = await UserApi.updateUser(data);
      updateUser({ ...user, ...data });
      toast.success("Atualização realizada com sucesso!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };
  return (
    <div id={styles.principal}>
      <img src={user.image ?? logo} alt="logo" className={styles.imageLogin} />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          className={styles.input}
          name="username"
          label="Nome:"
          type="text"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.username}
          disabled={user?.googleUser}
        />
        <TextInputField
          className={styles.input}
          name="email"
          label="Email:"
          type="text"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
          error={errors.email}
          disabled={user?.googleUser}
        />
        {user?.cpf && (
          <TextInputField
            className={styles.input}
            name="cpf"
            label="cpf:"
            type="text"
            register={register}
            registerOptions={{ required: "Campo Obrigatório" }}
            error={errors.cpf}
            disabled
          />
        )}
        {!user?.googleUser && (
          <TextInputField
            className={styles.input}
            name="image"
            label="Imagem de perfil:"
            type="text"
            register={register}
            registerOptions={{ required: "Campo Obrigatório" }}
            error={errors.image}
          />
        )}
        <Button
          className={styles.btn}
          type="submit"
          disabled={isSubmitting || user?.googleUser}
        >
          ALTERAR
        </Button>
      </Form>
      <Button className={styles.btn} onClick={() => navigate(-1)}>
        VOLTAR
      </Button>
    </div>
  );
};

export default ProfilePage;
