import { Database } from "./internal/db"

// @ts-ignore
import selectProfitByDaySql from "./sql/dashboard/selectProfitByDay.sql"
import selectSaleCountByProductSql from "./sql/dashboard/selectSaleCountByProduct.sql"

export interface DashboardApi {
  selectProfitByDay(start: Date, end: Date): Object[];
};

export default function initDashboardApi(db: Database): DashboardApi {
  return {
    selectProfitByDay: (start: Date, end: Date) => db.select<Object>(selectProfitByDaySql, { $start: start, $end: end }),
    selectSaleCountByProduct: () => db.select(selectSaleCountByProductSql),
  };
};
