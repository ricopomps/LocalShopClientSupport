import {
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { toast } from "react-toastify";
import { Product } from "../models/product";
import { User, UserType } from "../models/user";
import * as UsersApi from "../network/notes_api";
import ApiService from "../network/api";
import { useNavigate } from "react-router-dom";
import RoutesEnum from "../utils/routesEnum";

export interface ProductItem {
  product: Product;
  quantity: number;
}

enum REDUCER_ACTION_TYPE {
  SET_USER,
  LOGOUT,
  ADD_FAVORITE_PRODUCT,
  REMOVE_FAVORITE_PRODUCT,
  ADD_FAVORITE_STORE,
  REMOVE_FAVORITE_STORE,
  SET_ACCESS_TOKEN,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: any;
};

type StateType = {
  user: User;
  accessToken: string;
};

export const initialState: StateType = {
  user: {
    cpf: "",
    email: "",
    username: "",
    userType: UserType.shopper,
    favoriteProducts: [],
    favoriteStores: [],
  },
  accessToken: "",
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SET_USER: {
      return {
        ...state,
        user: action.payload,
      };
    }
    case REDUCER_ACTION_TYPE.LOGOUT: {
      return {
        ...state,
        user: initialState.user,
        accessToken: initialState.accessToken,
      };
    }
    case REDUCER_ACTION_TYPE.ADD_FAVORITE_PRODUCT: {
      return {
        ...state,
        user: {
          ...state.user,
          favoriteProducts: state.user.favoriteProducts
            ? [...state.user.favoriteProducts, action.payload]
            : [action.payload],
        },
      };
    }
    case REDUCER_ACTION_TYPE.REMOVE_FAVORITE_PRODUCT: {
      return {
        ...state,
        user: {
          ...state.user,
          favoriteProducts: state.user.favoriteProducts.filter(
            (id) => id !== action.payload
          ),
        },
      };
    }
    case REDUCER_ACTION_TYPE.ADD_FAVORITE_STORE: {
      return {
        ...state,
        user: {
          ...state.user,
          favoriteStores: [...state.user.favoriteStores, action.payload],
        },
      };
    }
    case REDUCER_ACTION_TYPE.REMOVE_FAVORITE_STORE: {
      return {
        ...state,
        user: {
          ...state.user,
          favoriteStores: state.user.favoriteStores.filter(
            (id) => id !== action.payload
          ),
        },
      };
    }
    case REDUCER_ACTION_TYPE.SET_ACCESS_TOKEN: {
      return {
        ...state,
        accessToken: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

const useUserContext = (initialState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const setUser = useCallback((user: User) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_USER,
      payload: user,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await UsersApi.logout();
    } catch (error) {
    } finally {
      navigate(RoutesEnum.HOME);
      dispatch({
        type: REDUCER_ACTION_TYPE.LOGOUT,
      });
    }
  }, []);

  const addFavoriteProduct = useCallback(async (productId: string) => {
    try {
      await UsersApi.favoriteProduct(productId);
      toast.success("Produto favoritado com sucesso!");
      dispatch({
        type: REDUCER_ACTION_TYPE.ADD_FAVORITE_PRODUCT,
        payload: productId,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }, []);

  const removeFavoriteProduct = useCallback(async (productId: string) => {
    try {
      await UsersApi.unfavoriteProduct(productId);
      toast.success("Produto removido com sucesso dos favoritos!");
      dispatch({
        type: REDUCER_ACTION_TYPE.REMOVE_FAVORITE_PRODUCT,
        payload: productId,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }, []);

  const addFavoriteStore = useCallback(async (storeId: string) => {
    try {
      await UsersApi.favoriteStore(storeId);
      toast.success("Loja favoritada com sucesso!");
      dispatch({
        type: REDUCER_ACTION_TYPE.ADD_FAVORITE_STORE,
        payload: storeId,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }, []);

  const removeFavoriteStore = useCallback(async (storeId: string) => {
    try {
      await UsersApi.unfavoriteStore(storeId);
      toast.success("Loja removida com sucesso dos favoritos!");
      dispatch({
        type: REDUCER_ACTION_TYPE.REMOVE_FAVORITE_STORE,
        payload: storeId,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }, []);

  const setAccessToken = useCallback((accessToken: string) => {
    const apiService = ApiService.getInstance();
    apiService.setAccessToken(accessToken, setAccessToken);
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_ACCESS_TOKEN,
      payload: accessToken,
    });
  }, []);

  return {
    state,
    setUser,
    logout,
    addFavoriteProduct,
    removeFavoriteProduct,
    addFavoriteStore,
    removeFavoriteStore,
    setAccessToken,
  };
};

type UseUserContextType = ReturnType<typeof useUserContext>;

const initialContextState: UseUserContextType = {
  state: initialState,
  setUser: (user: User) => {},
  logout: async () => {},
  addFavoriteProduct: async (productId: string) => {},
  removeFavoriteProduct: async (productId: string) => {},
  addFavoriteStore: async (productId: string) => {},
  removeFavoriteStore: async (productId: string) => {},
  setAccessToken: (accessToken: string) => {},
};

export const UserContext =
  createContext<UseUserContextType>(initialContextState);

type ChildrenType = {
  children?: ReactElement;
};

export const UserProvider = ({
  children,
  ...initialState
}: ChildrenType & StateType): ReactElement => {
  return (
    <UserContext.Provider value={useUserContext(initialState)}>
      {children}
    </UserContext.Provider>
  );
};

type UseUserHookType = {
  user: User;
  accessToken: string;
  setUser: (user: User) => void;
  logout: () => void;
  addFavoriteProduct: (productId: string) => void;
  removeFavoriteProduct: (productId: string) => void;
  addFavoriteStore: (productId: string) => void;
  removeFavoriteStore: (productId: string) => void;
  setAccessToken: (accessToken: string) => void;
};

export const useUser = (): UseUserHookType => {
  const {
    state: { user, accessToken },
    setUser,
    logout,
    addFavoriteProduct,
    removeFavoriteProduct,
    addFavoriteStore,
    removeFavoriteStore,
    setAccessToken,
  } = useContext(UserContext);
  return {
    user,
    accessToken,
    setUser,
    logout,
    addFavoriteProduct,
    removeFavoriteProduct,
    addFavoriteStore,
    removeFavoriteStore,
    setAccessToken,
  };
};
