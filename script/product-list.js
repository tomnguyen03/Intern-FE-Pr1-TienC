const sidebar = document.querySelector("#sidebar-product");
const listpage = document.querySelector("#list");
const gridpage = document.querySelector("#grid");
const show = document.querySelector("#show");
const paginationE1 = document.querySelector("#pagination");

let products = [];
let countProduct = 0;
let categories = [];
let categoriesPrice = [];
let categoriesColor = [];
let limit = 9;
let page = 1;
let currentPage = 1;

class Storage {
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

class Model {
  getProduct = async function (page = 1, limit = 9) {
    try {
      const res = await axios.get("http://localhost:3000/products", {
        params: {
          _page: page,
          _limit: limit,
        },
      });
      const data = await res.data;
      products = data;
      countProduct = res.headers["x-total-count"];
      return products;
    } catch (error) {
      console.log(error);
    }
  };

  getCategories = async function () {
    try {
      const res = await axios.get("http://localhost:3000/categories");
      const data = await res.data;
      categories = data;
      return categories;
    } catch (error) {
      console.log(error);
    }
  };

  getCategoriesPrice = async function () {
    try {
      const res = await axios.get(
        "http://localhost:3000/categoriesPrice"
      );
      const data = await res.data;
      categoriesPrice = data;
      return categoriesPrice;
    } catch (error) {
      console.log(error);
    }
  };

  getCategoriesColor = async function () {
    try {
      const res = await axios.get(
        "http://localhost:3000/categoriesColor"
      );
      const data = await res.data;
      categoriesColor = data;
      return categoriesColor;
    } catch (error) {
      console.log(error);
    }
  };
}

class View {
  initialApp() {}

  renderSidebar(categories, title) {
    let htmls = `
      <nav class="sidebar">
        <ul>
          <li class="title"><a href="#">${title}</a></li>
          ${categories
            .map(
              (category) => `<li> <a href="#">${category}</a></li>`
            )
            .join("")}
        </ul>
      </nav>
    `;
    sidebar.innerHTML += htmls;
  }

  renderSidebarProduct(categories, title) {
    let loop = categories.map(
      (category) =>
        `
      <li class="sidebar-item">
        <div class="row">
          <div class="col-4"><img src=${category.image} alt=${category.title}/></div>
          <div class="col-8">
            <h3>${category.title}</h3><span>${category.price}</span>
          </div>
        </div>
      </li>  
      `
    );
    let htmls = `
      <nav class="sidebar">
        <ul>
          <li class="title"><a href="#">${title}</a></li>
          ${loop.slice(0, 5).join("")}
        </ul>
      </nav>
    `;
    sidebar.innerHTML += htmls;
  }

  rating(product) {
    return `
      <span>
        ${[...Array(5)]
          .map((_, index) =>
            index < product.rate
              ? `<i class="bx bxs-star"></i>`
              : `<i class="bx bx-star"></i>`
          )
          .join("")}
      </span>
      <span class="reviews">(${product.reviews} Đánh giá)</span>
    `;
  }

  ProductListItem(product) {
    return `
      <div class="product-item w-100 height-big">
        <div class="product-body big-product">
          <div class="col-sm-4 col-xs-12 product-img"><img src=${
            product.image
          } alt=${product.title}/></div>
          <div class="col-sm-8 col-xs-12 product-content align-items-start">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rate">${this.rating(product)}</div>
            <p class="product-desc">${product.desc}</p>
            <p class="product-price">${product.price}</p>
            <div class="product-button"><a class="btn btn__primary" href="#">mua ngay</a><a class="btn btn__secondary" href="/product-detail.html">xem chi tiết</a></div>
          </div>
        </div>
      </div>
    `;
  }

  renderProductListPage(products) {
    let htmls = `
    <div class="product-list" id="list">
      ${products
        .map(
          (product, index) =>
            `
        <div class="col-12 px-0" key=${index}>
          <div class="product-list__item mb-4">
            ${this.ProductListItem(product)}
          </div>
        </div>
        `
        )
        .join("")}
    </div>
    `;
    listpage.innerHTML = htmls;
  }

  ProductGridItem(product) {
    return `
    <div class="product-item w-100">
      <div class="product-body">
        <div class="product-img"> <img src=${product.image} alt=${
      product.title
    }/></div>
        <p class="product-price">${product.price}đ</p>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rate">${this.rating(product)}</div>
        <div class="product-button"><a class="btn btn__primary" href="#">mua ngay</a><a class="btn btn__secondary" href="/product-detail.html">xem chi tiết</a></div>
      </div>
    </div>
    `;
  }

  renderProductGridPage(products) {
    let htmls = `
    <div class="product-list">
      ${products
        .map(
          (product, index) =>
            `
          <div class="col-lg-4 col-sm-6 pr-0 " key=${index}>
            <div class="product-list__item mb-4">
              ${this.ProductGridItem(product)}
            </div>
          </div>
        `
        )
        .join("")}
    </div>
    `;
    gridpage.innerHTML = htmls;
  }

  pagination(countProduct, limit) {
    const size = Math.ceil(countProduct / limit);
    const number = [...Array(size + 1).keys()].slice(1);
    let htmls = `
    <ul class="pagination">
      <li>
        <button type="button" value="prev" class="button-item">Trang trước</button>
      </li>
      ${number.map(
        (item) => `
      <li>
        <button type="button" value=${item} class="button-item ${
          currentPage == item ? "active" : ""
        }">${item}</button>
      </li>`
      )}
      <li>
        <button type="button" value="next" class="button-item">Trang sau</button>
      </li>
    `;
    paginationE1.innerHTML = htmls;
    this.renderProductByPage();
  }

  renderProductByPage = function () {
    const model = new Model();
    const paginationBtn = document.querySelectorAll(".button-item");
    const size = paginationBtn.length - 2;
    paginationBtn.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        let value = event.target.value;
        if (value == "prev" && currentPage == 1) currentPage = 1;
        if (value == "prev" && currentPage != 1)
          currentPage = currentPage - 1;
        if (value == "next" && currentPage == size)
          currentPage = size;
        if (value == "next" && currentPage != size)
          currentPage = currentPage + 1;
        if (value != "prev" && value != "next") currentPage = value;

        //Remove class active
        paginationBtn.forEach((btn, index) => {
          btn.className = "button-item";
          index == currentPage
            ? (btn.className += " active")
            : "button-item";
        });

        model
          .getProduct((page = currentPage), (limit = limit))
          .then((products) => {
            this.renderProductListPage(products);
            this.renderProductGridPage(products);
          });
      });
    });
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();
  const view = new View();

  model
    .getProduct()
    .then((products) => {
      view.renderProductListPage(products);
      view.renderProductGridPage(products);
    })
    .then(() => view.pagination(countProduct, limit));
  model
    .getCategories()
    .then((categories) =>
      view.renderSidebar(categories, "danh mục sản phẩm")
    );
  model
    .getCategoriesPrice()
    .then((categories) =>
      view.renderSidebar(categories, "tìm theo mức giá")
    );
  model
    .getCategoriesColor()
    .then((categories) =>
      view.renderSidebar(categories, "tìm theo màu sắc")
    );
  model
    .getProduct()
    .then((products) =>
      view.renderSidebarProduct(products, "Sản phẩm nổi bật")
    );
});
