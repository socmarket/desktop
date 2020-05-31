import Product from "./product.ts"
import selectProductWithPrice from "./sql/selectProductWithPrice.sql"
import consignmentInsertItem from "./sql/consignmentInsertItem.sql"
import consignmentListSimple from "./sql/consignmentListSimple.sql"

import selectConsignmentList     from "./sql/consignment/journal/selectConsignmentList.sql"
import selectConsignmentItemsFor from "./sql/consignment/journal/selectConsignmentItemsFor.sql"
import selectByProductId         from "./sql/consignment/selectByProductId.sql"

export interface ConsignmentJournal {
  items: Array
}

export interface ConsignmentItem {
  productId: int;
  quantity: long;
  price: long;
  unitId: int;
  unitTitle: string;
  unitNotation: string;
  categoryTitle: string;
  currencyId: int;
  createdAt: datetime;
}

export interface ConsignmentState {
  summaryByCategory: Array;
  items: Array[ConsignmentItem];
  itemsCost: number;
  currentConsignmentItem: ConsignmentItem;
  currentProduct: Product;
  journal: ConsignmentJournal;
  currentReport: string;
  summaryByProduct: object;
}

const currentConsignmentProductFound = (product) => ({
  type: "CONSIGNMENT_PRODUCT_FOUND",
  product: product,
});

const currentConsignmentProductNotFound = () => ({
  type: "CONSIGNMENT_PRODUCT_NOT_FOUND",
});

const consignmentClosed = () => ({
  type: "CONSIGNMENT_CLOSED",
});

const addConsignmentItem = (item) => ({
  type: "CONSIGNMENT_ADD_ITEM",
  item: item,
})

const consignmentListUpdated = (summaryByCategory) => ({
  type: "CONSIGNMENT_LIST_UPDATED",
  summaryByCategory: summaryByCategory,
})

const updateConsignmentJournal = (items) => ({
  type: "CONSIGNMENT_JOURNAL_UPDATE",
  items: items,
})

const summaryByProductUpdated = (summaryByProduct) => ({
  type: "CONSIGNMENT_SUMMARY_BY_PRODUCT_UPDATED",
  summaryByProduct: summaryByProduct,
})

function reloadConsignmentJournal() {
  return function (dispatch, getState, { db }) {
    return db.select(selectConsignmentList)
      .then(items =>
        Promise.all(
          items.map(consignment => new Promise((resolve, reject) => {
            db.select(selectConsignmentItemsFor, { $consignmentId: consignment.id })
              .then(items => {
                resolve({ ...consignment, items: items })
              })
              .catch(err => reject(err))
          }))
        )
      )
      .then(items => dispatch(updateConsignmentJournal(items)))
    ;
  };
}

function findProduct(barcode) {
  return function (dispatch, getState, { db }) {
    if (barcode.length > 0) {
      db.selectOne(selectProductWithPrice, [ barcode ])
        .then(foundProduct => {
          if (foundProduct) {
            dispatch(currentConsignmentProductFound(foundProduct));
          } else {
            dispatch(currentConsignmentProductNotFound());
          }
          return db.select(selectByProductId, { $productId: foundProduct.id })
            .then(rows => {
              dispatch(summaryByProductUpdated({
                product: foundProduct,
                items: rows,
              }));
            });
        })
    } else {
      dispatch(currentConsignmentProductNotFound());
    }
  };
}

function toMoney(num) {
  return Math.round(num * 100 + Number.EPSILON);
}

function closeConsignment(supplierId) {
  return function (dispatch, getState, { db }) {
    const { consignment: { items } } = getState();
    return Promise.resolve()
      .then(_ => db.exec("begin"))
      .then(_ => db.exec("insert into consignment(supplierId) values(?)", [ supplierId ]))
      .then(_ => db.selectOne("select id as consignmentId from consignment where id in (select max(id) from consignment)"))
      .then(({ consignmentId }) => (
        Promise.all(items.map(item => (
          db.exec(consignmentInsertItem, {
            $consignmentId: consignmentId,
            $productId: item.productId,
            $quantity: item.quantity,
            $price: toMoney(item.price),
            $unitId: item.unitId,
            $currencyId: item.currencyId
          }).then(_ => consignmentId)
        )))))
      .then(consignmentId => db.exec("update consignment set closed = true where id = ?", [ consignmentId ]))
      .then(_ => db.exec("commit"))
      .then(_ => dispatch(consignmentClosed()))
      .then(_ => reloadSummaryByCategory()(dispatch, getState, { db: db }))
      .then(_ => reloadConsignmentJournal()(dispatch, getState, { db: db }))
      .catch(err => {
        console.log(err);
        return db.exec("rollback");
      })
  };
}

function reloadSummaryByCategory() {
  return function (dispatch, getState, { db }) {
    return Promise.resolve()
      .then(_ => db.select(consignmentListSimple))
      .then(list => {
        const summary = list.reduce((a, b) => ({
          categoryTitle: "",
          uniqueQuantity: a.uniqueQuantity + b.uniqueQuantity,
          quantity: a.quantity + b.quantity,
          cost: a.cost + b.cost
        }));
        dispatch(consignmentListUpdated({
          items: list,
          summary: summary,
        }))
      })
      .catch(err => {
        console.log(err);
      })
  };
}

function decConsignmentItemQuantity(barcode) {
  return {
    type: "CONSIGNMENT_ITEM_DEC",
    barcode: barcode,
  };
}

function incConsignmentItemQuantity(barcode) {
  return {
    type: "CONSIGNMENT_ITEM_INC",
    barcode: barcode,
  };
}

function openReport(name) {
  return {
    type: "CONSIGNMENT_OPEN_REPORT",
    name: name,
  };
}

const ConsignmentActions = {
  addConsignmentItem: addConsignmentItem,
  incConsignmentItemQuantity: incConsignmentItemQuantity,
  decConsignmentItemQuantity: decConsignmentItemQuantity,
  closeConsignment: closeConsignment,
  findProduct: findProduct,
  reloadSummaryByCategory: reloadSummaryByCategory,
  reloadConsignmentJournal: reloadConsignmentJournal,
  openReport: openReport,
}

const emptyConsignmentItem = {
  productId: -1,
  quantity: 0,
  price: 0,
  unitId: -1,
  unitTitle: "",
  unitNotation: "",
  currencyId: -1,
  createdAt: null,
};

const emptyProduct = {
  id: -1,
  barcode: "",
  title: "",
  unitId: -1,
  unitTitle: "",
  unitNotation: "",
  categoryTitle: "",
};

function ConsignmentReducer (state: ConsignmentState = {
  summaryByCategory: {
    items: [],
    summary: {
      uniqueQuantity: 0,
      quantity: 0,
      cost: 0,
    }
  },
  items: [],
  itemsCost: 0.00,
  currentConsignmentItem: emptyConsignmentItem,
  currentProduct: emptyProduct,
  journal: {
    items: []
  },
  currentReport: "journal",
  summaryByProduct: {
    product: {
      title: "",
      categoryTitle: "",
      barcode: "",
    },
    items: []
  },
}, action) {
  switch (action.type) {
    case 'CONSIGNMENT_PRODUCT_FOUND':
      const product = action.product;
      const consignmentItem = {
        productId: product.id,
        quantity: 1,
        price: Math.round((Math.random() * 1000 + Number.EPSILON) * 100) / 100,
        unitId: product.unitId,
        unitTitle: product.unitTitle,
        unitNotation: product.unitNotation,
        categoryTitle: product.categoryTitle,
        currencyId: 1,
      }
      return Object.assign({}, state, {
        currentConsignmentItem: consignmentItem,
        currentProduct: product,
      });
    case 'CONSIGNMENT_PRODUCT_NOT_FOUND':
      return Object.assign({}, state, {
        currentConsignmentItem: emptyConsignmentItem,
        currentProduct: emptyProduct,
      });
    case 'CONSIGNMENT_ADD_ITEM': {
      const items = state.items;
      const citem = action.item;
      const product = state.currentProduct;
      const consignmentItem = {
        productId: product.id,
        barcode: product.barcode,
        title: product.title,
        quantity: +citem.quantity,
        price: +citem.price,
        unitId: product.unitId,
        unitTitle: product.unitTitle,
        unitNotation: product.unitNotation,
        categoryTitle: product.categoryTitle,
        currencyId: -1,
      }
      /* If product is in the check, then just increase quantity */
      const existingIndex = items.findIndex(i => i.productId === consignmentItem.productId && i.price === consignmentItem.price);
      const newItems = (existingIndex >= 0) ?
        items.map(i => (i.productId === product.id) ? Object.assign({}, i, { quantity: i.quantity + consignmentItem.quantity }) : i) :
        [ ... items, consignmentItem ]
      ;
      const sum = newItems.map(i => i.price * i.quantity).reduce((a, b) => a + b);
      return Object.assign({}, state, {
        currentConsignmentItem: consignmentItem,
        items: newItems,
        itemsCost: Math.round((sum + Number.EPSILON) * 100) / 100,
      });
    }
    case 'CONSIGNMENT_ITEM_DEC': {
      const newItems = state.items.map(i =>
        (i.barcode == action.barcode) ?
          Object.assign({}, i, { quantity: i.quantity - 1 }) : i
      ).filter(i => (i.quantity > 0))
      const sum = (newItems.length > 0) ? newItems.map(i => i.price * i.quantity).reduce((a, b) => a + b) : 0.00;
      return Object.assign({}, state, {
        items: newItems,
        itemsCost: Math.round((sum + Number.EPSILON) * 100) / 100,
      });
    }
    case 'CONSIGNMENT_ITEM_INC': {
      const newItems = state.items.map(i =>
        (i.barcode == action.barcode) ?
          Object.assign({}, i, { quantity: i.quantity + 1 }) : i
      )
      const sum = newItems.map(i => i.price * i.quantity).reduce((a, b) => a + b);
      return Object.assign({}, state, {
        items: newItems,
        itemsCost: Math.round((sum + Number.EPSILON) * 100) / 100,
      });
    }
    case 'CONSIGNMENT_LIST_UPDATED': {
      return Object.assign({}, state, {
        summaryByCategory: action.summaryByCategory,
      });
    }
    case 'CONSIGNMENT_CLOSED': {
      return Object.assign({}, state, {
        currentProduct: emptyProduct,
        currentConsignmentItem: emptyConsignmentItem,
        items: [],
        itemsCost: 0.00,
      });
    }
    case "CONSIGNMENT_JOURNAL_UPDATE": {
      return Object.assign({}, state, {
        journal: {
          items: action.items
        }
      });
    }
    case "CONSIGNMENT_OPEN_REPORT": {
      return Object.assign({}, state, {
        currentReport: action.name
      });
    }
    case "CONSIGNMENT_SUMMARY_BY_PRODUCT_UPDATED": {
      return Object.assign({}, state, {
        summaryByProduct: action.summaryByProduct
      });
    }
    default:
      return state
  }
}

export { ConsignmentActions, ConsignmentReducer };

