import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Product as ProductModel } from "../models/product";
import * as ProductsApi from "../network/products_api";
import styles from "../styles/ProductsPage.module.css";
import stylesUtils from "../styles/utils.module.css";
import AddProductDialog from "./AddEditProductDialog";
import Product from "./Product";
import { Store } from "../models/store";
import { setSessionStoreId } from "../network/storeApi";
import InfiniteScroll from "./InfiniteScroll";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RoutesEnum from "../utils/routesEnum";

interface ProductsPageLoggedInViewProps {
  store: Store;
}

const ProductsPageLoggedInView = ({ store }: ProductsPageLoggedInViewProps) => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductModel | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const navigate = useNavigate();
  const [showProductsLoadingError, setshowProductsLoadingError] =
    useState(false);
  const [page, setPage] = useState(0);
  async function loadProducts(initial?: boolean) {
    try {
      setshowProductsLoadingError(false);
      setProductsLoading(true);
      await setSessionStoreId(store._id);
      const products = await ProductsApi.fetchProducts(store._id, page);
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
  }, []);

  const [categories, setCategories] = useState<string[]>([""]);

  async function loadCategories() {
    const a: string[] = (await ProductsApi.getCategories()).categories;
    setCategories(a);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function deleteProduct(product: ProductModel) {
    try {
      await ProductsApi.deleteProduct(product._id);
      setProducts(
        products.filter(
          (existingProduct) => existingProduct._id !== product._id
        )
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }

  const productsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.productsGrid}`}>
      {products.map((product) => (
        <Col key={product._id}>
          <Product
            product={product}
            onProductClicked={setProductToEdit}
            onDeleteProductClicked={deleteProduct}
            className={styles.product}
          ></Product>
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      <Button
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => navigate(RoutesEnum.ADICIONAR_EDITAR_PRODUTO)}
      >
        <FaPlus />
        Adicionar novo produto
      </Button>

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
      {showAddProductDialog && (
        <AddProductDialog
          storeId={store._id}
          onDismiss={() => setShowAddProductDialog(false)}
          categoryList={categories}
          onProductSaved={(newProduct) => {
            setProducts([...products, newProduct]);
            setShowAddProductDialog(false);
          }}
        />
      )}
      {productToEdit && (
        <AddProductDialog
          storeId={store._id}
          onDismiss={() => setProductToEdit(null)}
          productToEdit={productToEdit}
          categoryList={categories}
          onProductSaved={(updatedProduct) => {
            setProducts(
              products.map((existingProduct) =>
                existingProduct._id === updatedProduct._id
                  ? updatedProduct
                  : existingProduct
              )
            );
            setProductToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default ProductsPageLoggedInView;
