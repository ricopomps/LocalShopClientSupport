import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import styles from "../styles/Grid.module.css";
import * as MapApi from "../network/mapApi";
import * as ShoppingList from "../network/shoppingListApi";
import AlocateProductModal from "./Modal/AlocateProductModal";
import { useLocation } from "react-router-dom";
import { ProductItem, useShoppingList } from "../context/ShoppingListContext";

interface GridProps {
  rows: number;
  cols: number;
  storeId: string;
  edit?: boolean;
}

export interface CellCoordinates {
  x: number;
  y: number;
  type?: string;
  productId?: string;
}

const Grid: React.FC<GridProps> = ({ rows, cols, storeId, edit }) => {
  const {
    shoppingList,
    selectedPath,
    setProductsItems,
    setSelectedPath,
    setPath,
  } = useShoppingList();
  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search);
  const locationX = queryParameters.get("x");
  const locationY = queryParameters.get("y");
  const [selectedCells, setSelectedCells] = useState<CellCoordinates[]>([]);
  const [selectedCell, setSelectedCell] = useState<CellCoordinates | undefined>(
    undefined
  );
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [alocateProduct, setAlocateProduct] = useState(false);
  const cellSize = 50;
  const spacing = 10;

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const baseData = await MapApi.getMap(storeId);

        if (baseData) setSelectedCells(baseData.items);
      } catch (error: any) {
        toast.error(error?.response?.data?.error ?? error?.message);
      }
    };

    fetchMap();
  }, []);

  const calculatePath = async () => {
    try {
      const productsMapped = shoppingList.productsItems.map((item) => {
        return {
          product: item.product._id,
          quantity: item.quantity,
        };
      });

      if (!storeId) throw Error("Loja inválida");
      const path = await ShoppingList.getShoppingListPath({
        storeId,
        products: productsMapped,
      });
      const productsOrder = new Map<string, number>();
      path.forEach((path, index) => {
        const productId = path[0].productId;
        if (productId) {
          if (productsOrder.has(productId)) {
            productsOrder.set(productId, index);
          } else {
            productsOrder.set(productId, index);
          }
        }
      });

      reorderShoppingList(productsOrder);
      setPath(path);
      setSelectedPath(path[0]);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  const reorderShoppingList = (productsOrder: Map<string, number>) => {
    const productsItems = shoppingList.productsItems;
    let productsItemsOrdered: ProductItem[] = [];
    productsOrder.forEach((index, value) => {
      const productItem = productsItems.find(
        (item) => item.product._id === value
      );
      productItem && productsItemsOrdered.push(productItem);
    });
    setProductsItems(productsItemsOrdered);
  };

  const supportColumn = [
    { style: styles.orange, text: "Entrada" },
    { style: styles.green, text: "Prateleira" },
    { style: styles.blue, text: "Frios" },
    { style: styles.purple, text: "Caixa" },
    { style: styles.red, text: "Obstáculo" },
  ];

  const handleClick = (x: number, y: number, type: string) => {
    if (!edit) return;
    if (alocateProduct) {
      handleAlocateProduct(x, y);
    } else {
      const cellIsSelected = selectedCells.some(
        (cell) => cell.x === x && cell.y === y
      );
      const newSelectedCells = cellIsSelected
        ? selectedCells.filter((cell) => cell.x !== x || cell.y !== y)
        : [...selectedCells, { x, y, type }];

      setSelectedCells(newSelectedCells);
    }
  };

  const handleAlocateProduct = (x: number, y: number) => {
    setSelectedCell({ x, y });
  };

  const isCellSelected = (x: number, y: number) => {
    return selectedCells.some((cell) => cell.x === x && cell.y === y);
  };

  const getCellType = (x: number, y: number) => {
    const cell = selectedCells.find((cell) => cell.x === x && cell.y === y);
    return cell?.type;
  };

  const getCellSyle = (x: number, y: number) => {
    const type = getCellType(x, y);
    const selected = supportColumn.find((a) => a.text === type);
    return selected?.style;
  };

  const generateCellKey = (x: number, y: number) => {
    return `cell-${x}-${y}`;
  };

  const gridStyle = {
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
  };

  const supportColumnStyle = {
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    gridTemplateColumns: `${rows}, ${cellSize}px`,
    gap: `${spacing}px`,
  };

  const saveMap = async () => {
    try {
      await MapApi.saveMap({ items: selectedCells });
      toast.success("Mapa salvo com sucesso");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  const productSelected = (x: number, y: number) => {
    if (
      locationX &&
      locationY &&
      x === parseInt(locationX) &&
      y === parseInt(locationY)
    )
      return styles.selected;
  };

  return (
    <Row>
      <Col>
        <div className={styles.grid} style={gridStyle}>
          {Array.from({ length: rows * cols }, (_, index) => {
            const x = index % cols;
            const y = Math.floor(index / cols);
            const isPathCell = selectedPath.some(
              (coord) => coord.x === x && coord.y === y
            );
            return (
              <div
                key={generateCellKey(x, y)}
                onClick={() => handleClick(x, y, selectedStyle)}
                className={`${styles.gridCell} ${
                  isCellSelected(x, y) && getCellSyle(x, y)
                } ${productSelected(x, y)} ${isPathCell ? styles.path : ""}`}
              ></div>
            );
          })}
        </div>
      </Col>
      <Col>
        {!edit && (
          <Button className={styles.buttonMap} onClick={() => calculatePath()}>
            Calcular
          </Button>
        )}
        {edit && (
          <>
            <Button
              className={styles.buttonMap}
              onClick={() => setSelectedCells([])}
            >
              Limpar
            </Button>
            <Button className={styles.buttonMap} onClick={saveMap}>
              Salvar
            </Button>
          </>
        )}
        <div className={styles.supportColumn} style={supportColumnStyle}>
          {supportColumn.map((item, index) => (
            <div
              key={`support-cell-${index}`}
              className={styles.supportCellContainer}
              onClick={() => {
                setSelectedStyle(item.text);
                setAlocateProduct(false);
              }}
            >
              <div
                className={`${styles.gridCell} ${item.style} ${
                  selectedStyle === item.text && styles.selected
                }`}
              >
                <div className={styles.supportSquare}></div>
              </div>
              <span className={styles.supportText}>{item.text}</span>
            </div>
          ))}
          {edit && (
            <div
              className={styles.supportCellContainer}
              onClick={() => {
                setAlocateProduct(!alocateProduct);
                setSelectedStyle("");
              }}
            >
              <div
                className={`${styles.gridCell} ${
                  alocateProduct && styles.selected
                }`}
              >
                <div className={styles.supportSquare}></div>
              </div>
              <span className={styles.supportText}>Alocar produtos</span>
            </div>
          )}
        </div>
      </Col>
      {selectedCell && (
        <AlocateProductModal
          acceptText="Alocar"
          dismissText="Recusar"
          location={selectedCell}
          onAccepted={() => {
            setSelectedCell(undefined);
          }}
          onDismiss={() => {
            setSelectedCell(undefined);
          }}
        />
      )}
    </Row>
  );
};

export default Grid;
