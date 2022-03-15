import toast from "../js/common/toast.js";
import AbstractView from "./AbstractView.js";
import { baseURL } from "../js/common/baseURL.js";
export default class extends AbstractView {
  content;

  constructor(params) {
    super(params);
    this.setTitle("InSpace");
  }

  async getHtml() {
    return await super.getHtml("find");
  }

  defaultFunc() {
    const $passwordReqBtn = document.querySelector(".btn-signup");

    $passwordReqBtn.addEventListener("click", () => {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;

      const user = {
        userName: name,
        userId: email,
      };

      const URL =
        "http://elice-kdt-sw-1st-vm08.koreacentral.cloudapp.azure.com:5000/reset-password";
      fetch(URL, {
        method: "POST",
        body: JSON.stringify(user),
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        console.log(res);
        if (res.ok) {
          toast("임시 비밀번호가 발급되었습니다.");
        } else {
          toast("정보를 입력해주세요.");
        }
      });
    });
  }
}
