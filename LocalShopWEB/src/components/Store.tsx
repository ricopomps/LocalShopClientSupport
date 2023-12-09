import { Card } from "react-bootstrap";
import styles from "../styles/Store.module.css";
import stylesUtils from "../styles/utils.module.css";
import { Store as StoreModel } from "../models/store";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

interface StoreProps {
  store: StoreModel;
  onStoreClicked: (store: StoreModel) => void;
  onDeleteStoreClicked?: (store: StoreModel) => void;
  className?: string;
}

const Store = ({
  store,
  onStoreClicked,
  onDeleteStoreClicked,
  className,
}: StoreProps) => {
  const { name, description, createdAt, updatedAt } = store;

  let createdUpdatedText: string;
  if (updatedAt > createdAt) {
    createdUpdatedText = "Atualizado: " + formatDate(updatedAt);
  } else {
    createdUpdatedText = "Criado: " + formatDate(createdAt);
  }

  return (
    <Card
      onClick={() => onStoreClicked(store)}
      className={`${styles.storeCard} ${className}`}
    >
      {store.image && (
        <Card.Img
          variant="top"
          src={store.image}
          alt=""
          className={styles.storeImage}
        />
      )}
      <Card.Body className={styles.cardBody}>
        <Card.Title className={`${stylesUtils.flexCenter} ${styles.titleText}`}>
          {name}
          {onDeleteStoreClicked && (
            <MdDelete
              className="text-muted ms-auto"
              onClick={(e) => {
                onDeleteStoreClicked(store);
                e.stopPropagation();
              }}
            />
          )}
        </Card.Title>
        <Card.Text className={`${stylesUtils.flexCenter}${styles.storeText}`}>
          {description}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
    </Card>
  );
};

export default Store;
