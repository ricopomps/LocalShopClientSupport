import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Col, Spinner, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Store as StoreModel } from "../models/store";
import * as StoresApi from "../network/storeApi";
import * as HistoricApi from "../network/historicApi";
import { Historic as HistoricModel } from "../models/historic";
import styles from "../styles/StoresPage.module.css";
import AddEditProductDialog from "../components/AddEditProductDialog";
import HorizontalScroll from "../components/HorizontalScroll";
import Store from "../components/Store";
import TextInputField from "../components/form/TextInputField";
import magnifying_glass from "../assets/magnifying_glass.svg";
import { ListStores } from "../network/storeApi";
import CheckInputField from "../components/form/CheckInputField";
import Historic from "../components/Historic";
import RoutesEnum from "../utils/routesEnum";

interface StoreListPageProps {}

const StoreListPage = ({}: StoreListPageProps) => {
  const navigate = useNavigate();
  const [historic, setHistoric] = useState<HistoricModel[]>([]);
  const [stores, setStores] = useState<StoreModel[]>([]);
  const [storeToEdit, setStoreToEdit] = useState<StoreModel | null>(null);
  const [storesLoading, setStoresLoading] = useState(true);
  const [showStoresLoadingError, setshowStoresLoadingError] = useState(false);
  const [historicLoading, setHistoricLoading] = useState(true);
  const [showHistoricLoadingError, setshowHistoricLoadingError] =
    useState(false);

  useEffect(() => {
    async function loadStores() {
      try {
        setshowStoresLoadingError(false);
        setStoresLoading(true);
        const stores = await StoresApi.fetchStores();
        setStores(stores);
        const historics = await HistoricApi.getHistorics();
        setHistoric(historics);
      } catch (error) {
        console.error(error);
        setshowStoresLoadingError(true);
        setshowHistoricLoadingError(true);
      } finally {
        setStoresLoading(false);
        setHistoricLoading(false);
      }
    }

    loadStores();
  }, []);

  const goToStore = (store: StoreModel) => {
    navigate(`${RoutesEnum.PRODUCT_LIST_PAGE}?store=${store._id}`);
  };

  const storesGrid = (
    <HorizontalScroll>
      {stores.map((store) => (
        <Col key={store._id}>
          <Store
            store={store}
            onStoreClicked={goToStore}
            className={styles.store}
          ></Store>
        </Col>
      ))}
    </HorizontalScroll>
  );
  const goToHistoric = (historic: HistoricModel) => {
    navigate(`${RoutesEnum.HISTORIC}?historic=${historic._id}`);
  };
  const historicGrid = (
    <HorizontalScroll>
      {historic.map((historic) => (
        <Col key={historic._id}>
          <Historic
            historic={historic}
            onHistoricClicked={goToHistoric}
            className={styles.historic}
          ></Historic>
        </Col>
      ))}
    </HorizontalScroll>
  );

  const [categories, setCategories] = useState<string[]>([""]);

  async function loadCategories() {
    const a: string[] = (await StoresApi.getCategories()).categories;
    setCategories(a);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ListStores>({});

  const onSubmit = async (input: ListStores) => {
    try {
      let listResponse;
      listResponse = await StoresApi.listStores(input);
      setStores(listResponse);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className={styles.filterAlign}>
        <TextInputField
          name="name"
          type="text"
          placeholder="Pesquisar Loja"
          register={register}
          className={styles.inputFilter}
        ></TextInputField>
        <TextInputField
          name="category"
          type="text"
          as="select"
          options={categories.map((c) => {
            return { value: c, key: c };
          })}
          hasDefaultValue={true}
          placeholder="Categoria"
          nullable={true}
          register={register}
          className={styles.selectFilter}
        />
        <CheckInputField
          className={styles.checkFilter}
          classNameLabel={styles.labelInput}
          name="favorite"
          label="Favoritos"
          type="checkbox"
          register={register}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className={styles.bntFilterGlass}
        >
          <img src={magnifying_glass} alt="lupa" />
        </Button>
      </Form>
      <div>
        <h2 className={styles.title}>LOJAS</h2>
        {storesLoading && <Spinner animation="border" variant="primary" />}
        {showStoresLoadingError && (
          <p>Erro inesperado. Favor recarregar a página</p>
        )}
        {!storesLoading && !showStoresLoadingError && (
          <>
            {stores.length > 0 ? (
              storesGrid
            ) : (
              <p>Não existem lojas cadastradas</p>
            )}
          </>
        )}
      </div>
      <div>
        <h2 className={styles.title}>HISTÓRICO</h2>
      </div>
      {!historicLoading && !showHistoricLoadingError && (
        <>{historic.length > 0 ? historicGrid : <></>}</>
      )}

      {storeToEdit && (
        <AddEditProductDialog
          storeId=""
          categoryList={[""]}
          onDismiss={() => setStoreToEdit(null)}
          productToEdit={storeToEdit}
          onProductSaved={() => {}}
        />
      )}
    </>
  );
};

export default StoreListPage;
