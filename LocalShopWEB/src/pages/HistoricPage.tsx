import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as HistoricApi from "../network/historicApi";
import { toast } from "react-toastify";
import { Historic as HistoricModel } from "../models/historic";
import { Button, Card } from "react-bootstrap";
import * as ShoppingListApi from "../network/shoppingListApi";
import styles from "../styles/HistoricPage.module.css";
import { ProductItem, useShoppingList } from "../context/ShoppingListContext";
import stylesUtils from "../styles/utils.module.css";
import { formatDate } from "../utils/formatDate";

interface HistoricItemProps {
  productItem: ProductItem;
  index: number;
  onClick: (index: number) => void;
}

interface HistoricPageProps {}

const HistoricPage = ({}: HistoricPageProps) => {
  const { shoppingList, clearShoppingList } = useShoppingList();
  const location = useLocation();
  const [selectedHistoric, setSelectedHistoric] =
    useState<HistoricModel | null>(null);
  const queryParameters = new URLSearchParams(location.search);
  const historic = queryParameters.get("historic");
  const navigate = useNavigate();
  const [expandedCardIndex, setExpandedCardIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!historic) throw Error("Produto inválido");
        const selectedHistoricResponse = await HistoricApi.getHistoric(
          historic
        );
        setSelectedHistoric(selectedHistoricResponse);
      } catch (error: any) {
        toast.error(error?.response?.data?.error ?? error?.message);
      }
    };
    fetchData();
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  if (!selectedHistoric) return <></>;

  const copy = async () => {
    try {
      await ShoppingListApi.copyShoppingList(selectedHistoric._id);
      if (shoppingList.storeId === selectedHistoric.store._id)
        clearShoppingList();
      toast.success("Lista de compras copiada!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };
  const HistoricCard = () => {
    return (
      <Card className={`${styles.historicCard}`}>
        {selectedHistoric.store.image && (
          <Card.Img
            variant="top"
            src={selectedHistoric.store.image}
            alt=""
            className={styles.historicImage}
          />
        )}
        <Card.Body className={styles.cardBody}>
          <Card.Title
            className={`${stylesUtils.flexCenter} ${styles.titleText}`}
          >
            {selectedHistoric.store.name}
          </Card.Title>
          <Card.Text
            className={`${stylesUtils.flexCenter} ${styles.priceText}`}
          >
            {`R$${selectedHistoric.totalValue.toFixed(2)}`}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="text-muted">
          {formatDate(selectedHistoric.createdAt.toString())}
        </Card.Footer>
      </Card>
    );
  };

  const handleCardClick = (index: number) => {
    if (expandedCardIndex === index) setExpandedCardIndex(-1);
    else setExpandedCardIndex(index);
  };

  const HistoricItem = ({
    productItem: { product, quantity },
    onClick,
    index,
  }: HistoricItemProps) => {
    return (
      <Card
        onClick={() => onClick(index)}
        className={`${styles.historicItemCard}`}
      >
        <div className={`${stylesUtils.flexCenter} ${styles.item}`}>
          {product.image && (
            <Card.Img
              variant="top"
              src={product.image}
              alt=""
              className={styles.historicItemImage}
            />
          )}
          <div className={styles.cardItemBody}>
            <div className={styles.esquerda}>
              <div className={`${styles.titleProduct}`}>{product.name}</div>
              <div className={`${styles.historicText}`}>
                Quantidade: {quantity}
              </div>
            </div>
            <div className={styles.direita}>
              <div className={`${styles.historicText}`}>
                Valor unitário:{" "}
                {product.price && `R$${product.price.toFixed(2)}`}
              </div>
              <div className={`${styles.historicText}`}>
                Valor total:{" "}
                {product.price && `R$${(product.price * quantity).toFixed(2)}`}
              </div>
            </div>
          </div>
        </div>
        {index === expandedCardIndex && (
          <Card.Footer className="text-muted">
            {product.description}
          </Card.Footer>
        )}
      </Card>
    );
  };
  return (
    <div>
      <div>
        <Button onClick={goBack}>Voltar</Button>
      </div>
      <div className={styles.main}>
        <Card className={styles.itemCard}>
          {selectedHistoric.products.map((productItem, index) => (
            <>
              <HistoricItem
                onClick={handleCardClick}
                index={index}
                productItem={productItem}
              />
            </>
          ))}
        </Card>
        <div className={styles.lateral}>
          <HistoricCard />
          <Button onClick={copy}> Copiar </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoricPage;
