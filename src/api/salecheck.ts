import { Database } from "./internal/db"

// @ts-ignore
import insertSaleCheckItemToBufferSql from "./sql/salecheck/insertSaleCheckItemToBuffer.sql"
// @ts-ignore
import selectProductWithPriceSql from "./sql/salecheck/selectProductWithPrice.sql"
// @ts-ignore
import selectItemListFromBufferSql from "./sql/salecheck/selectItemListFromBuffer.sql"

export interface SaleCheckItem {
  id: number;
  title: string;
  barcode: string;
  unitTitle: string;
  categoryTitle: string;
  unitId: number;
  categoryId: number;
  quantity: number;
};

export interface SaleCheckApi {
  insertItem(productId: number): Promise<void>;
  selectItemList(): Promise<SaleCheckItem[]>;
};

function toNum(num) {
  return Math.round(num * 100 + Number.EPSILON);
}

export default function initSaleCheckApi(db: Database): SaleCheckApi {
  return {
    insertItem: (productId: number) => {
      return db.selectOne(selectProductWithPriceSql, { $productId: productId })
        .then(product => {
          if (product) {
            return db.exec(insertSaleCheckItemToBufferSql, {
              $saleCheckId : 0,
              $productId   : item.productId,
              $quantity    : item.quantity,
              $price       : toNum(item.price),
              $discount    : 0,
              $unitId      : item.unitId,
              $currencyId  : item.currencyId
            });
          } else {
            throw new Error("Product not found");
          }
        })
      ;
    },
    selectItemList: () => {
      return db.select(selectItemListFromBufferSql);
    }
  };
};
