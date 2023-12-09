import Grid from "../components/Grid";
import styles from "../styles/MapPage.module.css";

interface MapPageProps {
  storeId: string;
}

const MapPage = ({ storeId }: MapPageProps) => {
  return (
    <div className={styles.main}>
      <Grid rows={10} cols={10} storeId={storeId} edit />;
    </div>
  );
};

export default MapPage;
