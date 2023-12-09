import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Form } from "react-bootstrap";
import { IoStorefrontOutline, IoStorefrontSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Product as ProductModel } from "../models/product";
import * as ProductsApi from "../network/products_api";
import * as StoreApi from "../network/storeApi";
import styles from "../styles/ProductsPage.module.css";
import InfiniteScroll from "../components/InfiniteScroll";
import ShoppingList from "../components/ShoppingList";
import Product from "../components/Product";
import { ProductItem, useShoppingList } from "../context/ShoppingListContext";
import TextInputField from "../components/form/TextInputField";
import { ListProducts } from "../network/products_api";
import magnifying_glass from "../assets/magnifying_glass.svg";
import filter from "../assets/filter.svg";
import filterCheio from "../assets/filtercheio.svg";
import CheckInputField from "../components/form/CheckInputField";
import { useUser } from "../context/UserContext";
import RoutesEnum from "../utils/routesEnum";

interface ProductListPageProps {}

const ProductListPage = ({}: ProductListPageProps) => {
  const {
    user,
    addFavoriteProduct,
    removeFavoriteProduct,
    addFavoriteStore,
    removeFavoriteStore,
  } = useUser();

  const { addProduct } = useShoppingList();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [productsSelected, setProductsSelected] = useState<ProductItem[]>([]);
  const [showProductsLoadingError, setshowProductsLoadingError] =
    useState(false);
  const [page, setPage] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

  const queryParameters = new URLSearchParams(location.search);
  const storeId = queryParameters.get("store");

  async function loadProducts(initial?: boolean) {
    try {
      if (!storeId) throw Error("Loja não encontrada");
      setshowProductsLoadingError(false);
      setProductsLoading(true);
      const products = await ProductsApi.fetchProducts(storeId, page);
      if (initial) setProducts(products);
      else setProducts((prevItems) => [...prevItems, ...products]);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
      setshowProductsLoadingError(true);
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts(true);
    getStoreName();
    if (!cartOpen) toggleCart();
  }, []);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleFilter = () => {
    setValue("category", undefined);
    setValue("priceFrom", undefined);
    setValue("priceTo", undefined);
    setValue("favorite", undefined);
    setFilterOpen(!filterOpen);
  };

  const removeProductFromShoppingCart = (id: string) => {
    setProductsSelected(
      productsSelected.filter((item) => item.product._id !== id)
    );
  };

  const goToStoreMap = () => {
    navigate(`${RoutesEnum.MAP}?store=${storeId}`);
  };

  const goToProductPageMap = (productId: string) => {
    navigate(
      `${RoutesEnum.PRODUCT_PAGE}?store=${storeId}&product=${productId}`
    );
  };

  const productsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.productsGrid}`}>
      {products.map((product) => (
        <Col key={product._id}>
          <Product
            addProduct={() => {
              if ((product.stock && product.stock <= 0) || !product.stock) {
                toast.error("Produto sem estoque");
                return;
              }
              addProduct(product);
            }}
            product={product}
            onProductClicked={() => goToProductPageMap(product._id)}
            className={styles.product}
            loggedUser={user}
            addProductFavorite={addFavoriteProduct}
            removeProductFavorite={removeFavoriteProduct}
          ></Product>
        </Col>
      ))}
    </Row>
  );

  const getStoreName = async () => {
    if (storeId) {
      const store = await StoreApi.getStore(storeId);
      setStoreName(store.name);
    }
  };

  const [categories, setCategories] = useState<string[]>([""]);

  const loadCategories = async () => {
    const a: string[] = (await ProductsApi.getCategories()).categories;
    setCategories(a);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const [sortOptions, setSortOptions] = useState<string[]>([""]);

  const loadSortOptions = async () => {
    const a: string[] = (await ProductsApi.getSortOptions()).sortOptions;
    setSortOptions(a);
  };

  useEffect(() => {
    loadSortOptions();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<ListProducts>({});

  const onSubmit = async (input: ListProducts) => {
    try {
      let listResponse;
      if (!storeId) throw Error("Loja não encontrada");
      listResponse = await ProductsApi.listProducts(storeId, input);
      setProducts(listResponse);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  return (
    <>
      <div className={styles.conteiner}>
        <h1 className={styles.storeTitle}>{storeName}</h1>
        <div className={styles.header}>
          <Button className={styles.btnMapa} onClick={goToStoreMap}>
            Ir para o mapa
          </Button>
          {storeId && (
            <>
              {user.favoriteStores?.includes(storeId) ? (
                <IoStorefrontSharp
                  className={styles.favIcon}
                  onClick={() => removeFavoriteStore(storeId)}
                />
              ) : (
                <IoStorefrontOutline
                  className={styles.favIcon}
                  onClick={() => addFavoriteStore(storeId)}
                />
              )}
            </>
          )}
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.filterAlign}>
            <TextInputField
              name="productName"
              label=""
              type="text"
              placeholder="Pesquisar Produto"
              register={register}
              className={styles.inputFilter}
            ></TextInputField>
            <TextInputField
              name="sort"
              type="text"
              as="select"
              options={sortOptions.map((c) => {
                return { value: c, key: c };
              })}
              hasDefaultValue={true}
              placeholder="Ordenar Por"
              nullable={true}
              register={register}
              className={styles.selectFilter}
            />
            <div className={styles.bntAlign}>
              {filterOpen ? (
                <img
                  onClick={toggleFilter}
                  src={filterCheio}
                  alt="filter"
                  className={styles.bntFilter}
                />
              ) : (
                <img
                  onClick={toggleFilter}
                  src={filter}
                  alt="filter"
                  className={styles.bntFilter}
                />
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={styles.bntFilterGlass}
              >
                <img src={magnifying_glass} alt="lupa" />
              </Button>
            </div>
          </div>
          <div className={styles.filterAlign}>
            {filterOpen && (
              <>
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
                <TextInputField
                  name="priceFrom"
                  type="number"
                  placeholder="Valor Mínimo"
                  register={register}
                  className={styles.inputNumberFilter}
                ></TextInputField>
                <TextInputField
                  name="priceTo"
                  type="number"
                  placeholder="Valor Máximo"
                  register={register}
                  className={styles.inputNumberFilter}
                ></TextInputField>
                <CheckInputField
                  className={styles.checkFilter}
                  classNameLabel={styles.labelInput}
                  name="favorite"
                  label="Favoritos"
                  type="checkbox"
                  register={register}
                />
              </>
            )}
          </div>
        </Form>
      </div>
      {!showProductsLoadingError && (
        <>
          {products.length > 0 ? (
            productsGrid
          ) : (
            <p>Não existem produtos cadastrados</p>
          )}
        </>
      )}
      {productsLoading && <Spinner animation="border" variant="primary" />}
      {showProductsLoadingError && (
        <p>Erro inesperado. Favor recarregar a página</p>
      )}
      <InfiniteScroll onLoadMore={loadProducts} isLoading={productsLoading} />
      <ShoppingList
        storeId={storeId}
        onDelete={removeProductFromShoppingCart}
      />
    </>
  );
};

export default ProductListPage;
