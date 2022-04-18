const sidebar = document.querySelector("#sidebar-product");
const listpage = document.querySelector("#list");
const gridpage = document.querySelector("#grid");
const showItem = document.querySelector("#show");
const paginationE1 = document.querySelector("#pagination");
const sortFilter = document.querySelector("#sortFilter");
const cartCount = document.querySelector(
  ".header__menu-right__card-count"
);

let products = [];
let countProduct = 0;
let categories = [];
let categoriesPrice = [];
let categoriesColor = [];
var limit = 9;
var page = 1;
var sort = "name";
let currentPage = 1;
let buttonDOM = [];
let cart = [];
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
  getProduct = async function (page = 1, limit = 9, sort = "title") {
    this.getLimit();
    this.sorting();
    try {
      const res = await axios.get("http://localhost:3000/products", {
        params: {
          _page: page,
          _limit: limit,
          _sort: sort,
        },
      });
      const data = await res.data;
      countProduct = res.headers["x-total-count"];
      products = data;
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

  getLimit = function () {
    showItem.addEventListener("change", (e) => {
      const view = new View();
      const viewCart = new ViewCart();

      limit = e.target.value;
      view.pagination(countProduct, (limit = limit));
      this.getProduct(page, (limit = limit)).then((products) => {
        view.renderProductListPage(products);
        view.renderProductGridPage(products);
        viewCart.addToCart();
      });
    });
  };

  sorting = function () {
    sortFilter.addEventListener("change", (e) => {
      const view = new View();
      const viewCart = new ViewCart();

      sort = e.target.value;
      this.getProduct(page, limit, (sort = sort)).then((products) => {
        view.renderProductListPage(products);
        view.renderProductGridPage(products);
        viewCart.addToCart();
      });
    });
  };
}

class View {
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
            <p class="product-price">${product.price
              .toString()
              .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")} đ</p>
            <div class="product-button"><button class="btn btn__primary bag-button" data-id=${
              product.id
            } data-img=${product.image} data-title=${product.title
      .split(" ")
      .join(",")} data-price=${
      product.price
    } href="#">mua ngay</button><a class="btn btn__secondary" href="/product-detail.html">xem chi tiết</a></div>
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
        <p class="product-price">${product.price
          .toString()
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")} đ</p>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-rate">${this.rating(product)}</div>
        <div class="product-button"><button class="btn btn__primary bag-button" data-id=${
          product.id
        } data-img=${product.image} data-title=${product.title
      .split(" ")
      .join(",")} data-price=${
      product.price
    } href="#">mua ngay</button><a class="btn btn__secondary" href="/product-detail.html">xem chi tiết</a></div>
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

class ViewCart {
  initialApp() {
    cart = Storage.getCart();
    this.renderCartQuantity();
  }

  renderCartQuantity() {
    let total = cart.reduce((total, item) => total + item.amount, 0);
    cartCount.textContent = total;
  }

  addToCart() {
    const bagButton = [...document.querySelectorAll(".bag-button")];
    buttonDOM = bagButton;
    bagButton.forEach((button) => {
      const productId = button.dataset.id;
      const productTitle = button.dataset.title;
      const price = button.dataset.price;
      const productImg = button.dataset.img;
      button.addEventListener("click", (e) => {
        const title = productTitle.split(",").join(" ");
        const inCart = Storage.getCart().find(
          (item) => item.id === productId
        );
        if (inCart) {
          let tempItem = cart.find((item) => item.id === productId);
          tempItem.amount += 1;
          Storage.saveCart(cart);
        } else {
          const cartItem = {
            id: productId,
            title: title,
            price: price,
            image: productImg,
            amount: 1,
          };
          cart = [...cart, cartItem];
          Storage.saveCart(cart);
        }
        this.renderCartQuantity();
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const model = new Model();
  const view = new View();
  const viewCart = new ViewCart();

  viewCart.initialApp();

  model
    .getProduct()
    .then((products) => {
      view.renderProductListPage(products);
      view.renderProductGridPage(products);
    })
    .then(() => {
      viewCart.addToCart();
      view.pagination(countProduct, limit);
    });
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
