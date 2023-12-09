import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Button, Card } from "react-bootstrap";
import * as ProductApi from "../network/products_api";
import { Product as ProductModel } from "../models/product";
import Product from "../components/Product";
import ShoppingList from "../components/ShoppingList";
import { useShoppingList } from "../context/ShoppingListContext";
import styles from "../styles/ProductPage.module.css";
import { useUser } from "../context/UserContext";
import RoutesEnum from "../utils/routesEnum";

interface ProductPageProps {}

const ProductPage = ({}: ProductPageProps) => {
  const { user, addFavoriteProduct, removeFavoriteProduct } = useUser();
  const {
    shoppingList: { productsItems },
    handleItemCountIncrease,
    handleItemCountDecrease,
    addProduct,
  } = useShoppingList();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(
    null
  );
  const queryParameters = new URLSearchParams(location.search);
  const store = queryParameters.get("store");
  const product = queryParameters.get("product");
  const navigate = useNavigate();
  const productId = queryParameters.get("product");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!product) throw Error("Produto inválido");
        const selectedProductResponse = await ProductApi.getProduct(product);
        setSelectedProduct(selectedProductResponse);
      } catch (error: any) {
        toast.error(error?.response?.data?.error ?? error?.message);
      }
    };
    fetchData();
  }, []);

  const goToStoreMap = () => {
    if (selectedProduct)
      navigate(
        `${RoutesEnum.MAP}?store=${store}&x=${selectedProduct.location?.x}&y=${selectedProduct.location?.y}`
      );
  };

  const goBackToStore = () => {
    navigate(`${RoutesEnum.PRODUCT_LIST_PAGE}?store=${store}`);
  };

  if (!selectedProduct) return <></>;

  return (
    <div>
      <div>
        <Button onClick={goBackToStore}>Voltar para loja</Button>
      </div>
      <div className={styles.main}>
        {productId && user.favoriteProducts.includes(productId) ? (
          <AiFillHeart
            className={styles.favIcon}
            onClick={() => removeFavoriteProduct(productId)}
          />
        ) : (
          <AiOutlineHeart
            className={styles.favIcon}
            onClick={() => productId && addFavoriteProduct(productId)}
          />
        )}
        <Button className={styles.btnProduct} onClick={goToStoreMap}>
          Ver localização
        </Button>
        <Product product={selectedProduct} onProductClicked={() => {}} />
        <h3 className={styles.descricao}>Descrição</h3>
        <Card className={styles.card}>{selectedProduct.description}</Card>
        <div className={styles.menosmais}>
          <Button
            className={styles.addRemoveButton}
            onClick={() => handleItemCountDecrease(selectedProduct._id)}
          >
            -
          </Button>
          <Card className={styles.stock}>
            <p>Estoque:</p>
            <p>{selectedProduct.stock}</p>
          </Card>
          <Button
            className={styles.addRemoveButton}
            onClick={() => {
              if (
                (selectedProduct.stock && selectedProduct.stock <= 0) ||
                !selectedProduct.stock
              ) {
                toast.error("Produto sem estoque");
                return;
              }
              const productItem = productsItems.find(
                (item) => item.product._id === selectedProduct._id
              );
              if (productItem) {
                if (
                  selectedProduct.stock &&
                  selectedProduct.stock <= productItem.quantity
                ) {
                  toast.error("Produto sem estoque suficiente");
                  return;
                }
                handleItemCountIncrease(selectedProduct);
              } else addProduct(selectedProduct);
            }}
          >
            +
          </Button>
        </div>
        <ShoppingList storeId={store} onDelete={() => {}} />
      </div>
    </div>
  );
};

export default ProductPage;
