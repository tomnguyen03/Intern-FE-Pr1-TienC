const cartTotalMoney = document.querySelector(".cartTotalMoney");
const cartVAT = document.querySelector(".cartVAT");
const cartTotal = document.querySelector(".cartTotal");
const cartList = document.querySelector(".cartList");
const cartCount = document.querySelector(
  ".header__menu-right__card-count"
);

let cart = [];
let cartItemEvent = [];

function toMoney(data) {
  return data.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

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

class View {
  initialApp() {
    cart = Storage.getCart();
  }

  renderCartQuantity() {
    let total = cart.reduce((total, item) => total + item.amount, 0);
    cartCount.textContent = total;
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    Storage.saveCart(cart);
    this.renderCart();
    this.totalMoney();
  }

  totalMoney() {
    let temp = 0;
    let total = 0;
    cart.map((item) => {
      temp = item.price * item.amount;
      total += temp;
    });
    let vat = (total * 10) / 100;
    let pay = total + vat;
    cartTotalMoney.textContent = toMoney(total) + "Đ";
    cartVAT.textContent = toMoney(vat) + "Đ";
    cartTotal.textContent = toMoney(pay) + "Đ";
  }

  renderCart() {
    cartList.innerHTML = "";
    cart.map((item, index) => {
      const html = `
      <tr> 
        <th class="cartIndex" scope="row">${index + 1}</th>
        <td class="table-image cartImg"><img src=${item.image} alt=${
        item.title
      }/></td>
        <td class="cartName">${item.title}</td>
        <td class="cartPrice">${toMoney(item.price)} Đ</td>
        <td>
          <input class="cartQuantity" type="text" value=${
            item.amount
          } disabled></input>
        </td>
        <td class="cartItemTotal">${toMoney(
          item.price * item.amount
        )} Đ</td>
        <td><button class="cartDelete" data-id=${
          item.id
        }><i class="bx bx-x"></i></button></td>
      </tr>
      `;
      cartList.innerHTML += html;
    });
    this.renderRemoveItem();
  }

  renderRemoveItem() {
    const cartDelete = [...document.querySelectorAll(".cartDelete")];
    cartDelete.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.removeItem(button.dataset.id);
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const view = new View();

  view.initialApp();
  view.renderCart();
  view.totalMoney();
  view.renderCartQuantity();
});
