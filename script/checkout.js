const stepNumber = document.querySelectorAll(".step-number");
const tabCheckoutItem = document.querySelectorAll(
  ".tab-checkout-item"
);
const notiValidate = document.querySelectorAll(".noti-validate");
const fullName = document.querySelector(".fullName");
const address = document.querySelector(".address");
const email = document.querySelector(".email");
const phone = document.querySelector(".phone");
const formCheckout = document.querySelector(".form-input-checkout");
const confirmProfile = document.querySelector(".confirm-profile");
const cartConfirm = document.querySelector(".cart-confirm");
const Step3CartTotalMoney = document.querySelector(
  ".step3-cartTotalMoney"
);
const Step3CartVAT = document.querySelector(".step3-cartVAT");
const Step3CartTotal = document.querySelector(".step3-cartTotal");
const buttonStep1 = document.querySelector("#button-step1");
const buttonStep2 = document.querySelector("#button-step2");
const buttonStep3 = document.querySelector("#button-step3");
const buttonCheckout = document.querySelector(".button-checkout");
class ViewCheckout {
  progressBarActive(n) {
    stepNumber[n].className += " active";
  }

  displayItem(n) {
    tabCheckoutItem.forEach((item) => (item.style.display = "none"));
    tabCheckoutItem[n].style.display = "block";
  }

  renderCart() {
    cartList.innerHTML = "";
    cartConfirm.innerHTML = "";

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
      </tr>
      `;
      cartList.innerHTML += html;
      cartConfirm.innerHTML += html;
    });
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
    Step3CartTotalMoney.textContent = toMoney(total) + "Đ";
    Step3CartVAT.textContent = toMoney(vat) + "Đ";
    Step3CartTotal.textContent = toMoney(pay) + "Đ";
  }

  CompleteCheckout() {
    this.progressBarActive(0);
    this.displayItem(0);
    const buttonCheckout = [
      ...document.querySelectorAll(".button-checkout"),
    ];
    buttonCheckout.forEach((button) => {
      button.addEventListener("click", () => {
        const confirmOrder = new ConfirmOrder();
        confirmOrder.ViewProfile();
        const id = button.dataset.id;
        console.log(id);
        this.progressBarActive(id);
        this.displayItem(id);
        if (id == 3) {
          localStorage.removeItem("cart");
          localStorage.removeItem("profile");
        }
      });
    });
  }
}

class InputProfile {
  ValidateForm() {
    localStorage.removeItem("profile");
    buttonStep2.addEventListener("click", function (event) {
      if (fullName.value === "") {
        event.preventDefault();
        notiValidate[0].textContent = "Họ và tên không được để trống";
      }
      if (address.value === "") {
        event.preventDefault();
        notiValidate[1].textContent = "Địa chỉ không được để trống";
      }
      if (phone.value.length != 10) {
        event.preventDefault();
        notiValidate[3].textContent = "Số điện thoại phải 10 số";
      }
      const profile = {
        fullName: fullName.value,
        address: address.value,
        email: email.value,
        phone: phone.value,
      };
      Storage.saveProfile(profile);
    });
  }
}

class ConfirmOrder {
  ViewProfile() {
    const profile = JSON.parse(localStorage.getItem("profile")) || [];
    if (profile != []) {
      let html = `
      <div class="col-md-5">
        <p>Họ và tên: ${profile.fullName}</p>
      </div>
      <div class="col-md-5">
        <p>Địa chỉ: ${profile.address}</p>
      </div>
      ${
        profile.email === ""
          ? ""
          : `<div class="col-md-5">
      <p>Email: ${profile.email}</p>
    </div>`
      }
      <div class="col-md-5">
        <p>Số điện thoại: ${profile.phone}</p>
      </div>
    `;
      confirmProfile.innerHTML = html;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const viewCheckout = new ViewCheckout();
  const inputProfile = new InputProfile();
  inputProfile.ValidateForm();
  viewCheckout.CompleteCheckout();
  viewCheckout.renderCart();
  viewCheckout.totalMoney();
});
