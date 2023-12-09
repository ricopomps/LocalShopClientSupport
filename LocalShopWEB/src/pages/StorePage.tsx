import { Alert, Button, Card, Form } from "react-bootstrap";
import TextInputField from "../components/form/TextInputField";
import { useForm } from "react-hook-form";
import styles from "../styles/LoginDesktop.module.css";
import { StoreInput } from "../network/storeApi";
import { UnathorizedError } from "../errors/http_errors";
import { useState } from "react";
import * as StoreApi from "../network/storeApi";
import { Store } from "../models/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import RoutesEnum from "../utils/routesEnum";

interface StorePageProps {
  store?: Store;
  onCreateStoreSuccessful: (store: Store) => void;
}

const StorePage = ({ store, onCreateStoreSuccessful }: StorePageProps) => {
  const navigate = useNavigate();
  const [errorText, setErrorText] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StoreInput>({ defaultValues: store });
  async function onSubmit(credentials: StoreInput) {
    try {
      setErrorText(null);
      if (store) {
        onCreateStoreSuccessful(
          await StoreApi.updateStore(store._id, credentials)
        );
        toast.success("Loja editada com sucesso!");
      } else {
        onCreateStoreSuccessful(await StoreApi.createStore(credentials));
        toast.success("Loja criada com sucesso!");
        navigate(RoutesEnum.PRODUCTS);
      }
    } catch (error) {
      if (error instanceof UnathorizedError) setErrorText(error.message);
      else if (error instanceof Error) setErrorText(error.message);
      else alert(error);
      console.error(error);
    }
  }
  return (
    <div className={styles.main}>
      <Card.Header>
        <Card.Title className={styles.mainText}>
          {store?._id ? "Editar" : "Cadastrar"} loja
        </Card.Title>
      </Card.Header>
      <Card.Body>
        {errorText && <Alert variant="danger">{errorText}</Alert>}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            className={styles.inputLogin}
            name="name"
            label="Nome"
            type="text"
            placeholder="Nome"
            register={register}
            registerOptions={{
              required: "Campo Obrigatório",
              validate: {
                minLength: (n) => n.length > 4 || "Nome muito curto",
                // matchPattern: (n) => /^[A-Za-z]+$/.test(n) || "Nome inválido",
              },
            }}
            error={errors.name}
          />
          <TextInputField
            className={styles.inputLogin}
            name="description"
            label="Descrição"
            type="text"
            placeholder="Descrição da loja"
            register={register}
            error={errors.description}
          />
          <TextInputField
            className={styles.inputLogin}
            name="image"
            label="Link da imagem"
            type="text"
            placeholder="Link da imagem da loja"
            register={register}
            error={errors.image}
          />
          <TextInputField
            className={styles.inputLogin}
            name="category"
            label="Categoria"
            type="text"
            placeholder="Categoria"
            register={register}
            error={errors.description}
          />
          <TextInputField
            className={styles.inputLogin}
            name="cnpj"
            label="CNPJ"
            type="text"
            placeholder="cnpj"
            register={register}
            error={errors.description}
          />
          <br />
          <Button type="submit" disabled={isSubmitting} className={styles.btn}>
            {store?._id ? "EDITAR" : "CADASTRAR"}
          </Button>
        </Form>
      </Card.Body>
    </div>
  );
};

export default StorePage;
