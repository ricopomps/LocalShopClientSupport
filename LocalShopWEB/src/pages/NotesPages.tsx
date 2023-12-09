import { Container } from "react-bootstrap";
import ProductsPageLoggedInView from "../components/ProductsPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import styles from "../styles/NotesPage.module.css";
import { User, UserType } from "../models/user";
import StorePage from "./StorePage";
import { Store } from "../models/store";
import StoreListPage from "./StoreListPage";

interface NotesPageProps {
  loggedInUser: User | null;
  onCreateStoreSuccessful: (store: Store) => void;
  goToStorePage?: boolean;
}

const NotesPage = ({
  loggedInUser,
  onCreateStoreSuccessful,
  goToStorePage,
}: NotesPageProps) => {
  const Page = () => {
    if (!loggedInUser) return <NotesPageLoggedOutView />;

    if (!loggedInUser.userType) return <>CREATE A FAIL PAGE!</>;

    if (loggedInUser.userType === UserType.store) {
      if (!loggedInUser?.store || goToStorePage)
        return (
          <StorePage
            onCreateStoreSuccessful={onCreateStoreSuccessful}
            store={loggedInUser.store}
          />
        );
      return <ProductsPageLoggedInView store={loggedInUser.store} />;
    }

    if (loggedInUser.userType === UserType.shopper) return <StoreListPage />;

    return <>CREATE A FAIL PAGE!</>;
  };

  return (
    <Container className={styles.notesPage}>
      <Page />
    </Container>
  );
};

export default NotesPage;
