import selectCategoryList from "./sql/categoryList.sql"

export interface Category {
  id: int;
  title: string;
  parentId: int;
}

export interface CategoryState {
  items: Array[Category];
  selectOptions: Array[{ key: string, value: int, text: string }];
}

const categoryListUpdated = (rows) => ({
  type: "CATEGORY_LIST_UPDATED",
  rows: rows
});

function updateCategory(category) {
  return function (dispatch, getState, { db }) {
    db.select("update category set title=$title, parentId=$parentId where id=$id", {
      $id: category.id,
      $title: category.title,
      $parentId: category.parentId,
    })
    .then(_ => {
      return db.select(selectCategoryList)
        .then(rows => dispatch(categoryListUpdated(rows)))
    })
  };
}

function addCategory() {
  return function (dispatch, getState, { db }) {
    db.select("insert into category(title) values('')")
    .then(_ => {
      return db.select(selectCategoryList)
        .then(rows => dispatch(categoryListUpdated(rows)))
    })
  };
}

const CategoryActions = {

  loadCategoryList: () => {
    return function (dispatch, getState, { db }) {
      db.select(selectCategoryList)
        .then(rows => dispatch(categoryListUpdated(rows)))
    };
  },

  updateCategory: updateCategory,
  addCategory: addCategory,

}

function CategoryReducer (state: CategoryState = {
  items: [],
  selectOptions: [],
}, action) {
  switch (action.type) {
    case 'CATEGORY_LIST_UPDATED':
      const selectOptions = action.rows.map(row => ({
        key: row.id,
        value: row.id,
        text: row.title,
      }));
      return Object.assign({}, state, { items: action.rows, selectOptions: selectOptions });
    default:
      return state
  }
}

export { CategoryActions, CategoryReducer };

