import selectProductPieSql       from "./sql/report/selectProductPie.sql"
import selectCategoryPieSql      from "./sql/report/selectCategoryPie.sql"
import selectProfitByDaySql      from "./sql/report/selectProfitByDay.sql"
import selectLowCountProductsSql from "./sql/report/selectLowCountProducts.sql"
import selectTurnoverSql         from "./sql/report/selectTurnover.sql"

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
            return { items: items, summary: summary }
          } else {
            return {
              items: [],
              summary: {
                revenue: 0,
                cost: 0,
                credit: 0,
                profit: 0,
              }
            }
          }
        })
    },
    selectProductPie: () => {
      return db.select(selectProductPieSql)
        .then(items => {
          if (items) {
            return { items: items }
          } else {
            return { items: [] }
          }
        })
      
    },
    selectCategoryPie: () => {
      return db.select(selectCategoryPieSql)
        .then(items => {
          if (items) {
            return { items: items }
          } else {
            return { items: [] }
          }
        })
      
    },
    selectLowCountProducts: (start, end) => {
      return db.select<Object>(selectLowCountProductsSql)
        .then(items => {
          if (items) {
            return { items: items }
          } else {
            return { items: [] }
          }
        })
    },
    turnover: (start, end) => (
      db.select(selectTurnoverSql)
        .then(items => {
          return {
            items       : items,
            inQuantity  : items.map(x => x.inQuantity ).reduce((a, b) => a + b, 0),
            outQuantity : items.map(x => x.outQuantity).reduce((a, b) => a + b, 0),
            invQuantity : items.map(x => x.invQuantity).reduce((a, b) => a + b, 0),
            inCost      : items.map(x => x.inCost     ).reduce((a, b) => a + b, 0),
            outCost     : items.map(x => x.outCost    ).reduce((a, b) => a + b, 0),
            invCost     : items.map(x => x.invCost    ).reduce((a, b) => a + b, 0),
            total       : items.map(x => x.total      ).reduce((a, b) => a + b, 0),
          }
        })
    ),
  }
}
