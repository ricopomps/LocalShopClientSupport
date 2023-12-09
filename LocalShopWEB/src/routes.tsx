import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar/NavBar";
import NotificationBar from "./components/NotificationBar";
import ProductsPageLoggedInView from "./components/ProductsPageLoggedInView";
import SignUpModal from "./components/SignUpModal";
import { Store } from "./models/store";
import { UserType } from "./models/user";
import AddEditProductPage from "./pages/AddEditProductPage";
import HistoricPage from "./pages/HistoricPage";
import HomePage from "./pages/HomePage";
import LoginDesktopPage from "./pages/LoginDesktopPage";
import MapPage from "./pages/MapPage";
import MapViewPage from "./pages/MapViewPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProductListPage from "./pages/ProductListPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import styles from "./styles/App.module.css";
import RecoverPasswordPage from "./pages/RecoverPasswordPage";
import ReportsPage from "./pages/ReportsPage";
import SendRecoverPasswordEmailPage from "./pages/SendRecoverPasswordEmailPage";
import SignUpPage from "./pages/SignUpPage";
import StoreListPage from "./pages/StoreListPage";
import StorePage from "./pages/StorePage";
import { useEffect, useState } from "react";
import * as AuthApi from "./network/authApi";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import RoutesEnum from "./utils/routesEnum";
import { useUser } from "./context/UserContext";

const AppRoutes = () => {
  const { user, setUser } = useUser();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const { user } = await AuthApi.refresh();
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLoggedInUser();
  }, []);

  return (
    <div>
      {user?.username && (
        <>
          <NavBar
            onLoginClicked={() => setShowLoginModal(true)}
            onSignUpClicked={() => setShowSignUpModal(true)}
            toggleNotifications={() => setOpenNotification(!openNotification)}
          />
          <NotificationBar
            open={openNotification}
            close={() => setOpenNotification(false)}
          />
        </>
      )}
      <Container className={styles.pageContainer}>
        <Routes>
          <Route path={RoutesEnum.HOME} element={<HomePage />} />
          <Route path={RoutesEnum.LOGIN} element={<LoginDesktopPage />} />
          <Route
            path={RoutesEnum.SIGN_UP_STORE}
            element={
              <SignUpPage
                onSignUpSuccessful={(user) => setUser(user)}
                userType={UserType.store}
              />
            }
          />
          <Route
            path={RoutesEnum.SIGN_UP_SHOPPER}
            element={
              <SignUpPage
                onSignUpSuccessful={(user) => setUser(user)}
                userType={UserType.shopper}
              />
            }
          />
          <Route
            path={RoutesEnum.FORGOT_PASSWORD}
            element={<SendRecoverPasswordEmailPage />}
          />
          <Route
            path={RoutesEnum.RECOVER_PASSWORD}
            element={<RecoverPasswordPage />}
          />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route
                path={RoutesEnum.PRODUCT_LIST_PAGE}
                element={<ProductListPage />}
              />
              <Route path={RoutesEnum.PRODUCT_PAGE} element={<ProductPage />} />

              <Route path={RoutesEnum.HISTORIC} element={<HistoricPage />} />

              <Route path={RoutesEnum.SHOPPER} element={<StoreListPage />} />

              <Route
                path={RoutesEnum.STORE}
                element={
                  <StorePage
                    onCreateStoreSuccessful={(store: Store) =>
                      setUser({ ...user, store: store })
                    }
                    store={user?.store}
                  />
                }
              />
              <Route path={RoutesEnum.PRIVACY} element={<PrivacyPage />} />
              {user?.userType === UserType.store && (
                <Route path={RoutesEnum.REPORTS} element={<ReportsPage />} />
              )}
              <Route
                path={RoutesEnum.PROFILE}
                element={<ProfilePage user={user} updateUser={setUser} />}
              />
              {user.store && (
                <>
                  <Route
                    path={RoutesEnum.PRODUCTS}
                    element={<ProductsPageLoggedInView store={user.store} />}
                  />
                  <Route
                    path={RoutesEnum.MAP}
                    element={<MapPage storeId={user?.store._id} />}
                  />
                  <Route
                    path={RoutesEnum.ADICIONAR_EDITAR_PRODUTO}
                    element={<AddEditProductPage storeId={user.store._id} />}
                  />
                </>
              )}
              <Route path={RoutesEnum.MAP} element={<MapViewPage />} />
            </Route>
          </Route>

          <Route path={RoutesEnum.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </Container>
      {showSignUpModal && (
        <SignUpModal
          onDismiss={() => setShowSignUpModal(false)}
          onSignUpSuccessful={(user) => {
            setUser(user);
            setShowSignUpModal(false);
          }}
        />
      )}
      {showLoginModal && (
        <LoginModal
          onDismiss={() => setShowLoginModal(false)}
          onLoginSuccessful={(user) => {
            setUser(user);
            setShowLoginModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AppRoutes;
