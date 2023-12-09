import { useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styles from "../styles/ShoppingList.module.css";
import * as ShoppingListApi from "../network/shoppingListApi";
import { toast } from "react-toastify";
import cart from "../assets/cart.svg";
import { ProductItem, useShoppingList } from "../context/ShoppingListContext";
import { useNavigate } from "react-router-dom";
import { Product } from "../models/product";
import RoutesEnum from "../utils/routesEnum";

interface ShoppingListProps {
  storeId: string | null;
  onDelete: (id: string) => void;
}

interface ShoppingListItemProps {
  className?: string;
  productItem: ProductItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onIncrease: (product: Product) => void;
  onDecrease: (id: string) => void;
  onDelete: (id: string) => void;
  handlePath: () => void;
}

const ShoppingList = ({ storeId, onDelete }: ShoppingListProps) => {
  const {
    shoppingList: { productsItems, selectedItemIds, storeId: storeIdContext },
    open: cartOpen,
    path,
    setSelectedItemIds,
    clearShoppingList,
    setProductsItems,
    setStoreId,
    handleItemCountIncrease,
    handleItemCountDecrease,
    openShoppingList,
    closeShoppingList,
    setSelectedPath,
    clearPaths,
  } = useShoppingList();
  const navigate = useNavigate();

  const toggleCart = () => {
    if (cartOpen) closeShoppingList();
    else openShoppingList();
  };

  useEffect(() => {
    clearPaths();
    const getPreviousShoppingList = async () => {
      try {
        if (!storeId) throw Error("Loja não encontrada");
        const shoppingList = await ShoppingListApi.getShoppingList(storeId);

        if (shoppingList?.products) {
          setProductsItems(shoppingList.products);
        } else if (storeIdContext && storeId !== storeIdContext) {
          clearShoppingList();
        }
        openShoppingList();
      } catch (error) {}
    };
    if (storeId) setStoreId(storeId);
    if (productsItems.length === 0 || storeId !== storeIdContext)
      getPreviousShoppingList();
  }, []);

  const handleItemSelect = (itemId: string) => {
    const prevSelectedItems = selectedItemIds;
    let selectedItems;
    if (prevSelectedItems.includes(itemId)) {
      selectedItems = prevSelectedItems.filter((id) => id !== itemId);
    } else {
      selectedItems = [...prevSelectedItems, itemId];
    }
    setSelectedItemIds(selectedItems);
  };

  const handlePathChange = (itemId: string, index: number) => {
    const prevSelectedItems = selectedItemIds;
    let currentPath;
    if (prevSelectedItems.includes(itemId)) {
      currentPath = path[index];
    } else {
      currentPath = path[index + 1];
    }
    currentPath && setSelectedPath(currentPath);
  };

  const handleItemDelete = (itemId: string) => {
    setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
    const updatedProductsItems = productsItems.filter(
      (item) => item.product._id !== itemId
    );
    setProductsItems(updatedProductsItems);
    onDelete(itemId);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    for (const productItem of productsItems) {
      total += (productItem.product.price || 10) * productItem.quantity;
    }
    return total;
  };

  const goToStoreMap = (product: Product) => {
    navigate(
      `${RoutesEnum.MAP}?store=${storeId}&x=${product.location?.x}&y=${product.location?.y}`
    );
  };

  const ShoppingItem = ({
    className,
    productItem,
    isSelected,
    onSelect,
    onIncrease,
    onDecrease,
    onDelete,
    handlePath,
  }: ShoppingListItemProps) => {
    const handleCheckboxChange = () => {
      onSelect(productItem.product._id);
      handlePath();
    };

    return (
      <div className={`${styles.shoppingItem} ${className}`}>
        <Form.Check
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
        <div
          className={styles.itemInfo}
          onClick={() => goToStoreMap(productItem.product)}
        >
          <p className={styles.itemText}>{productItem.product.name}</p>
          <p className={styles.itemPrice}>
            R${productItem.product.price?.toFixed(2)}
          </p>
        </div>
        <div className={styles.itemControls}>
          <button
            onClick={() => onDecrease(productItem.product._id)}
            className={styles.itemControlButton}
          >
            -
          </button>
          <span className={styles.itemCount}>{productItem.quantity}</span>
          <button
            onClick={() => onIncrease(productItem.product)}
            className={styles.itemControlButton}
          >
            +
          </button>
          <button
            onClick={() => onDelete(productItem.product._id)}
            className={styles.itemDeleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const onSave = async () => {
    try {
      const productsMapped = productsItems.map((item) => {
        return {
          product: item.product._id,
          quantity: item.quantity,
        };
      });

      if (!storeId) throw Error("Loja inválida");
      const shoppingList = { storeId, products: productsMapped };
      await ShoppingListApi.createShoppingList(shoppingList);
      toast.success("Lista de compras salva com sucesso!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  const onFinish = async () => {
    try {
      const productsMapped = productsItems.map((item) => {
        return {
          product: item.product._id,
          quantity: item.quantity,
        };
      });

      if (!storeId) throw Error("Loja inválida");
      const shoppingList = { storeId, products: productsMapped };
      await ShoppingListApi.finishShoppingList(shoppingList);
      toast.success("Lista de compras finalizada com sucesso!");
      clearShoppingList();
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  return (
    <>
      <img
        onClick={(e) => {
          e.stopPropagation();
          toggleCart();
        }}
        src={cart}
        alt="cart"
        className={styles.toggleButton}
      />

      <Container
        className={`${styles.cartSidebar} ${cartOpen ? styles.open : ""}`}
      >
        <h1 className={styles.cartText}> Carrinho </h1>
        {productsItems.map((item, index) => (
          <ShoppingItem
            className={styles.textoCarrinho}
            key={item.product._id}
            productItem={item}
            isSelected={selectedItemIds.includes(item.product._id)}
            onSelect={handleItemSelect}
            onIncrease={() => {
              const productItem = productsItems.find(
                (productItem) => productItem.product._id === item.product._id
              );
              if (
                (item.product.stock &&
                  productItem &&
                  item.product.stock <= productItem.quantity) ||
                !item.product.stock
              ) {
                toast.error("Produto sem estoque suficiente");
                return;
              }
              handleItemCountIncrease(item.product);
            }}
            onDecrease={handleItemCountDecrease}
            onDelete={handleItemDelete}
            handlePath={() => handlePathChange(item.product._id, index)}
          />
        ))}
        <div className={styles.totalPrice}>
          Preço total: R${calculateTotalPrice().toFixed(2)}
        </div>
        <Button className={styles.btnSalvar} onClick={onSave}>
          Salvar
        </Button>
        <Button className={styles.btnFinalizar} onClick={onFinish}>
          Finalizar
        </Button>
      </Container>
    </>
  );
};

export default ShoppingList;
