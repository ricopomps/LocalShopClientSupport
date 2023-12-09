import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ProductInput } from "../network/products_api";
import * as ProductsApi from "../network/products_api";
import { Product } from "../models/product";
import TextInputField from "../components/form/TextInputField";
import { useNavigate } from "react-router-dom";
import styles from "../styles/AddEditProductDialog.module.css";
import { toast } from "react-toastify";
import RoutesEnum from "../utils/routesEnum";

interface AddEditProductPageProps {
  //productToEdit?: Product;
  //  onDismiss: () => void;
  onProductSaved?: (product: Product) => void;
  storeId: string;
}

const AddEditProductPage = ({
  onProductSaved,
  storeId,
}: AddEditProductPageProps) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<string[]>([""]);

  async function loadCategories() {
    const a: string[] = (await ProductsApi.getCategories()).categories;
    setCategories(a);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({});

  async function onSubmit(input: ProductInput) {
    try {
      const productToEdit = false;
      let productResponse: Product;
      if (productToEdit) {
        /*productResponse = await ProductsApi.updateProduct(productToEdit._id, {
          ...input,
          storeId,
        });*/
        productResponse = await ProductsApi.createProduct({
          ...input,
          storeId,
        });
      } else {
        productResponse = await ProductsApi.createProduct({
          ...input,
          storeId,
        });
      }
      toast.success("Produto cadastrado com sucesso!");
      navigate(RoutesEnum.PRODUCTS);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }
  return (
    <div className={styles.conteiner}>
      <Form id="addEditProductForm" onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          name="name"
          label="Nome do produto"
          type="text"
          placeholder="Nome do produto"
          classNameLabel={styles.labelProduct}
          register={register}
          registerOptions={{ required: "Campo obrigatório" }}
          className={styles.inputProduct}
          error={errors.name}
        />
        <TextInputField
          name="description"
          label="Descrição do produto"
          as="textarea"
          rows={5}
          placeholder="Descrição do produto"
          register={register}
          className={styles.inputTextareaProduct}
        />
        <TextInputField
          name="image"
          label="Imagem"
          type="text"
          placeholder="Imagem"
          register={register}
          className={styles.inputProduct}
        />
        <TextInputField
          name="category"
          label="Categoria"
          type="text"
          as="select"
          options={categories.map((c) => {
            return { value: c, key: c };
          })}
          hasDefaultValue={true}
          placeholder="Categoria"
          register={register}
          className={styles.selectProduct}
        />
        <TextInputField
          name="price"
          label="Preço"
          type="text"
          placeholder="Preço"
          register={register}
          className={styles.inputProduct}
        />
        <Button
          type="submit"
          form="addEditProductForm"
          disabled={isSubmitting}
          className={styles.bntProduct}
        >
          SALVAR
        </Button>
      </Form>
      <button className={styles.bntProduct} onClick={() => navigate(-1)}>
        VOLTAR
      </button>
    </div>
  );
};

export default AddEditProductPage;
