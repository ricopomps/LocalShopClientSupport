import {
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { Product } from "../models/product";
import { CellCoordinates } from "../components/Grid";

export interface ShoppingList {
  storeId?: string;
  productsItems: ProductItem[];
  selectedItemIds: string[];
}

export interface ProductItem {
  product: Product;
  quantity: number;
}

enum REDUCER_ACTION_TYPE {
  SET_SHOPPING_LIST,
  CLEAR_SHOPPING_LIST,
  SET_SELECTED_ITEMS,
  SET_PRODUCT_ITEMS,
  SET_STORE_ID,
  INCREASE_COUNT,
  DECREASE_COUNT,
  ADD_PRODUCT,
  OPEN_SHOPPING_LIST,
  CLOSE_SHOPPING_LIST,
  SET_SELECTED_PATH,
  SET_PATH,
  CLEAR_PATHS,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: any;
};

type StateType = {
  shoppingList: ShoppingList;
  open: boolean;
  selectedPath: CellCoordinates[];
  path: CellCoordinates[][];
};

export const initialState: StateType = {
  shoppingList: { productsItems: [], selectedItemIds: [] },
  open: false,
  selectedPath: [],
  path: [[]],
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SET_SHOPPING_LIST: {
      return {
        ...state,
        shoppingList: action.payload,
      };
    }
    case REDUCER_ACTION_TYPE.CLEAR_SHOPPING_LIST: {
      return {
        ...state,
        shoppingList: { productsItems: [], selectedItemIds: [] },
      };
    }
    case REDUCER_ACTION_TYPE.SET_SELECTED_ITEMS: {
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          selectedItemIds: action.payload,
        },
      };
    }
    case REDUCER_ACTION_TYPE.SET_PRODUCT_ITEMS: {
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          productsItems: action.payload,
        },
      };
    }
    case REDUCER_ACTION_TYPE.SET_STORE_ID: {
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          storeId: action.payload,
        },
      };
    }
    case REDUCER_ACTION_TYPE.INCREASE_COUNT: {
      const stock = action.payload.stock;
      if (!stock || stock < 0) {
        return state;
      }

      const productInState = state.shoppingList.productsItems.find(
        (item) => item.product._id === action.payload._id
      );

      if (productInState && productInState.quantity >= stock) {
        return state;
      }
      const itemId = action.payload._id;

      const updatedProductItems = state.shoppingList.productsItems.map(
        (item) => {
          if (item.product._id === itemId) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        }
      );

      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          productsItems: updatedProductItems,
        },
      };
    }
    case REDUCER_ACTION_TYPE.DECREASE_COUNT: {
      const itemId = action.payload;

      const updatedProductItems = state.shoppingList.productsItems
        .map((item) => {
          if (item.product._id === itemId) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          productsItems: updatedProductItems,
        },
      };
    }
    case REDUCER_ACTION_TYPE.ADD_PRODUCT: {
      const stock = action.payload.stock;
      if (!stock || stock < 0) {
        return state;
      }
      const productInState = state.shoppingList.productsItems.find(
        (item) => item.product._id === action.payload._id
      );
      if (productInState) {
        if (productInState.quantity >= stock) {
          return state;
        }
      }
      if (productInState) {
        return {
          ...state,
          shoppingList: {
            ...state.shoppingList,
            productsItems: [
              ...state.shoppingList.productsItems.filter(
                (item) => item.product._id !== action.payload._id
              ),
            ],
          },
        };
      }
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          productsItems: [
            ...state.shoppingList.productsItems,
            { product: action.payload, quantity: 1 },
          ],
        },
      };
    }
    case REDUCER_ACTION_TYPE.OPEN_SHOPPING_LIST: {
      return {
        ...state,
        open: true,
      };
    }
    case REDUCER_ACTION_TYPE.CLOSE_SHOPPING_LIST: {
      return {
        ...state,
        open: false,
      };
    }
    case REDUCER_ACTION_TYPE.SET_SELECTED_PATH: {
      return {
        ...state,
        selectedPath: action.payload,
      };
    }
    case REDUCER_ACTION_TYPE.SET_PATH: {
      return {
        ...state,
        path: action.payload,
      };
    }
    case REDUCER_ACTION_TYPE.CLEAR_PATHS: {
      return {
        ...state,
        selectedPath: [],
        path: [[]],
      };
    }
    default: {
      return state;
    }
  }
};

const useShoppingListContext = (initialState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setShoppingList = useCallback((shoppingList: ShoppingList) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_SHOPPING_LIST,
      payload: { ...shoppingList, shoppingList },
    });
  }, []);

  const clearShoppingList = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.CLEAR_SHOPPING_LIST,
    });
  }, []);

  const setSelectedItemIds = useCallback((selectedItemIds: string[]) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_SELECTED_ITEMS,
      payload: selectedItemIds,
    });
  }, []);

  const setProductsItems = useCallback((selectedItemIds: ProductItem[]) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_PRODUCT_ITEMS,
      payload: selectedItemIds,
    });
  }, []);

  const setStoreId = useCallback((storeId: string) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_STORE_ID,
      payload: storeId,
    });
  }, []);

  const handleItemCountIncrease = useCallback((product: Product) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.INCREASE_COUNT,
      payload: product,
    });
  }, []);

  const handleItemCountDecrease = useCallback((itemId: string) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.DECREASE_COUNT,
      payload: itemId,
    });
  }, []);

  const addProduct = useCallback((product: Product) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.ADD_PRODUCT,
      payload: product,
    });
  }, []);

  const openShoppingList = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.OPEN_SHOPPING_LIST,
    });
  }, []);

  const closeShoppingList = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.CLOSE_SHOPPING_LIST,
    });
  }, []);

  const setSelectedPath = useCallback((path: CellCoordinates[]) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_SELECTED_PATH,
      payload: path,
    });
  }, []);

  const setPath = useCallback((path: CellCoordinates[][]) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_PATH,
      payload: path,
    });
  }, []);

  const clearPaths = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.CLEAR_PATHS,
    });
  }, []);

  return {
    state,
    setShoppingList,
    clearShoppingList,
    setSelectedItemIds,
    setProductsItems,
    setStoreId,
    handleItemCountIncrease,
    handleItemCountDecrease,
    addProduct,
    openShoppingList,
    closeShoppingList,
    setSelectedPath,
    setPath,
    clearPaths,
  };
};

type UseShoppingListContextType = ReturnType<typeof useShoppingListContext>;

const initialContextState: UseShoppingListContextType = {
  state: initialState,
  setShoppingList: (shoppingList: ShoppingList) => {},
  clearShoppingList: () => {},
  setSelectedItemIds: (selectedItemIds: string[]) => {},
  setProductsItems: (selectedProducts: ProductItem[]) => {},
  setStoreId: (storeId: string) => {},
  handleItemCountIncrease: (product: Product) => {},
  handleItemCountDecrease: (itemId: string) => {},
  addProduct: (product: Product) => {},
  openShoppingList: () => {},
  closeShoppingList: () => {},
  setSelectedPath: (path: CellCoordinates[]) => {},
  setPath: (path: CellCoordinates[][]) => {},
  clearPaths: () => {},
};

export const ShoppingListContext =
  createContext<UseShoppingListContextType>(initialContextState);

type ChildrenType = {
  children?: ReactElement;
};

export const ShoppingListProvider = ({
  children,
  ...initialState
}: ChildrenType & StateType): ReactElement => {
  return (
    <ShoppingListContext.Provider value={useShoppingListContext(initialState)}>
      {children}
    </ShoppingListContext.Provider>
  );
};

type UseShoppingListHookType = {
  shoppingList: ShoppingList;
  open: boolean;
  selectedPath: CellCoordinates[];
  path: CellCoordinates[][];
  setShoppingList: (shoppingList: ShoppingList) => void;
  clearShoppingList: () => void;
  setSelectedItemIds: (selectedItemIds: string[]) => void;
  setProductsItems: (selectedProducts: ProductItem[]) => void;
  setStoreId: (storeId: string) => void;
  handleItemCountIncrease: (product: Product) => void;
  handleItemCountDecrease: (itemId: string) => void;
  addProduct: (product: Product) => void;
  openShoppingList: () => void;
  closeShoppingList: () => void;
  setSelectedPath: (path: CellCoordinates[]) => void;
  setPath: (path: CellCoordinates[][]) => void;
  clearPaths: () => void;
};

export const useShoppingList = (): UseShoppingListHookType => {
  const {
    state: { shoppingList, open, selectedPath, path },
    setShoppingList,
    clearShoppingList,
    setSelectedItemIds,
    setProductsItems,
    setStoreId,
    handleItemCountIncrease,
    handleItemCountDecrease,
    addProduct,
    openShoppingList,
    closeShoppingList,
    setSelectedPath,
    setPath,
    clearPaths,
  } = useContext(ShoppingListContext);
  return {
    shoppingList,
    open,
    selectedPath,
    path,
    setShoppingList,
    clearShoppingList,
    setSelectedItemIds,
    setProductsItems,
    setStoreId,
    handleItemCountIncrease,
    handleItemCountDecrease,
    addProduct,
    openShoppingList,
    closeShoppingList,
    setSelectedPath,
    setPath,
    clearPaths,
  };
};
