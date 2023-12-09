import { useLocation, useNavigate } from "react-router-dom";
import Grid from "../components/Grid";
import { Button } from "react-bootstrap";
import ShoppingList from "../components/ShoppingList";
import styles from "../styles/MapPage.module.css";

const MapViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(location.search);
  const store = queryParameters.get("store");
  return (
    <div className={styles.page}>
      <Button className={styles.btnVoltar} onClick={() => navigate(-1)}>
        Voltar
      </Button>
      <div className={styles.main}>
        {store ? (
          <Grid rows={10} cols={10} storeId={store} />
        ) : (
          <p>Loja não encontrada</p>
        )}
        <ShoppingList storeId={store} onDelete={() => {}} />
      </div>
    </div>
  );
};

export default MapViewPage;
