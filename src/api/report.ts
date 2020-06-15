import { Database } from "./internal/db"

// @ts-ignore
import selectProductPie from "./sql/report/selectProductPie.sql"
// @ts-ignore
import selectProfitByDaySql from "./sql/report/selectProfitByDay.sql"

export interface ReportApi {
  selectProductPie(): Object[];
  selectProfitByDay(start, end): Object[];
};

export default function initReportApi(db: Database): ReportApi {
  return {
    selectProfitByDay: (start, end) => {
      return db.select<Object>(selectProfitByDaySql, { $start: start, $end: end })
        .then(items => {
          if (items) {
            const summary = items.reduce((a, b) => ({
              revenue: a.revenue + b.revenue,
              cost: a.cost + b.cost,
              credit: a.credit + b.credit,
              profit: a.profit + b.profit,
            }), {
              revenue: 0,
              cost: 0,
              credit: 0,
              profit: 0,
            })
            return { items: items, summary: summary };
          } else {
            return {
              items: [],
              summary: {
                revenue: 0,
                cost: 0,
                credit: 0,
                profit: 0,
              }
            };
          }
        })
      ;
    },
    selectProductPie: () => {
      return db.select(selectProductPie)
        .then(items => {
          if (items) {
            return { items: items };
          } else {
            return { items: [] };
          }
        })
      ;
    },
  };
};
