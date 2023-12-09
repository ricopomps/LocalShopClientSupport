import { Card } from "react-bootstrap";
import styles from "../styles/Product.module.css";
import { Product as ProductModel } from "../models/product";
import { FaTrashAlt } from "react-icons/fa";
import add from "../assets/add.svg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { User } from "../models/user";

interface ProductProps {
  loggedUser?: User;
  product: ProductModel;
  addProduct?: (product: ProductModel) => void;
  onProductClicked: (product: ProductModel) => void;
  onDeleteProductClicked?: (product: ProductModel) => void;
  addProductFavorite?: (productId: string) => void;
  removeProductFavorite?: (productId: string) => void;

  className?: string;
}

const Product = ({
  loggedUser,
  product,
  addProduct,
  onProductClicked,
  onDeleteProductClicked,
  addProductFavorite,
  removeProductFavorite,
  className,
}: ProductProps) => {
  const { name, category } = product;
  const price = product.price ?? 0;
  const oldPrice = product.oldPrice ?? 0;
  return (
    <Card
      onClick={() => onProductClicked(product)}
      className={`${styles.productCard} ${className}`}
      style={{ width: "350px", height: "400px" }}
    >
      {product.image && (
        <Card.Img
          variant="top"
          src={product.image}
          alt=""
          className={styles.productImage}
        />
      )}
      <div className={styles.cardBody}>
        <div className={styles.productDetails}>
          <p className={styles.productName}>{name}</p>
          {onDeleteProductClicked && (
            <FaTrashAlt
              className={styles.trashIcon}
              onClick={(e) => {
                onDeleteProductClicked(product);
                e.stopPropagation();
              }}
            />
          )}
          {product.sale && (
            <p className={styles.oldPrice}>R$ {oldPrice.toFixed(2)}</p>
          )}
          <p className={styles.productPrice}>R$ {price.toFixed(2)}</p>
          <p className={styles.productCategory}>{category}</p>
          {loggedUser && (
            <>
              {loggedUser.favoriteProducts?.includes(product._id) &&
              removeProductFavorite ? (
                <AiFillHeart
                  className={styles.favIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProductFavorite(product._id);
                  }}
                />
              ) : (
                <AiOutlineHeart
                  className={styles.favIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    addProductFavorite && addProductFavorite(product._id);
                  }}
                />
              )}
            </>
          )}
          {addProduct && (
            <img
              onClick={(e) => {
                e.stopPropagation();
                addProduct(product);
              }}
              src={add}
              alt="Add"
              className={styles.addImage}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default Product;
