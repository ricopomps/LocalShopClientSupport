import { ToastContainer } from "react-toastify";
import {
  ShoppingListProvider,
  initialState,
} from "./context/ShoppingListContext";
import {
  UserProvider,
  initialState as userInitialState,
} from "./context/UserContext";
import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <ShoppingListProvider
          shoppingList={initialState.shoppingList}
          open={initialState.open}
          selectedPath={initialState.selectedPath}
          path={initialState.path}
        >
          <UserProvider
            user={userInitialState.user}
            accessToken={userInitialState.accessToken}
          >
            <AppRoutes />
          </UserProvider>
        </ShoppingListProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
