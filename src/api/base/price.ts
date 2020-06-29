import selectLastPriceByProductIdSql from "./sql/price/selectLastPriceByProductId.sql"
import selectPriceListByProductIdSql from "./sql/price/selectPriceListByProductId.sql"

export default function initPriceApi(db) {
  return {
    setPrice: ({ productId, price, currencyId }) => (
      db.selectOne("select price from price where productId = $productId and currencyId = $currencyId order by setAt desc", {
        $productId  : productId,
        $currencyId : currencyId,
      }).then(currentPrice => {
        if (currentPrice && String(currentPrice.price) === String(price * 100)) {
          return Promise.resolve()
        } else {
          return db.exec("insert into price(productId, price, currencyid) values(?, ?, ?)", [
            productId,
            price * 100,
            currencyId,
          ])
        }
      })
    ),
    getPriceFor: ({ productId, currencyId, margin }) => (
      db.selectOne(selectLastPriceByProductIdSql, {
        $productId  : productId,
        $currencyId : currencyId,
        $margin     : margin,
      })
    ),
    getPriceHistoryFor: (productId) => (
      db.select(selectPriceListByProductIdSql, { $productId: productId })
    )
  }
}

