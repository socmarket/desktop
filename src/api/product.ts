import { Database } from "./internal/db"

// @ts-ignore
import selectProductById     from "./sql/product/selectProductById.sql"
// @ts-ignore
import selectProductBySearch from "./sql/product/selectProductBySearch.sql"

export interface Product {
  id: number;
  title: string;
  barcode: string;
  unitTitle: string;
  categoryTitle: string;
  unitId: number;
  categoryId: number;
  quantity: number;
};

export interface ProductApi {
  pick(id: number): Promise<Product>;
  find(pattern: string): Promise<Product[]>;
};

export default function initProductApi(db: Database): ProductApi {
  return {
    pick: (id: number) => db.selectOne<Product>(selectProductById, { $productId: id }),
    find: (patternRaw: string) => {
      const pattern = patternRaw.toLowerCase().trim();
      const key = pattern.split(" ").concat([ "", "", "" ]);
      return db.select<Product>(selectProductBySearch, {
        $barcode: patternRaw,
        $key0: key[0],
        $key1: key[1],
        $key2: key[2],
      });
    }
  };
};
