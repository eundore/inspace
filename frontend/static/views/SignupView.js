import AbstractView from "./AbstractView.js";
import userData from "../js/data.js";
import toast from "../js/common/toast.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("InSpace");
  }
  async getHtml() {
    return await super.getHtml("signup");
  }

  defaultFunc() {
    // const script = document.createElement("script");
    // script.src =
    //   "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
    // document.getElementById("root").appendChild(script);

    const $signUp = document.getElementById("signUp");
    const error = sessionStorage.getItem("error");
    const errorMessage = [
      "이름을 입력해주세요.",
      "이메일을 입력해주세요.",
      "비밀번호를 정확히 입력해주세요.",
      "비밀번호가 맞지 않습니다.",
    ];

    if (error) {
      toast(errorMessage[error]);
      sessionStorage.clear();
    }

    $signUp.addEventListener("click", () => {
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const passwordconfirm = document.getElementById("passwordconfirm").value;
      // 이메일 정규표현식
      const regEmail =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
      const regPassword = /^[a-zA-Z0-9]{8,30}$/;

      // 이름, 이메일 , 비밀번호 검증
      if (name === "") {
        $signUp.parentElement.href = "";
        sessionStorage.setItem("error", 0);
      } else if (regEmail.test(email) !== true) {
        $signUp.parentElement.href = "";
        sessionStorage.setItem("error", 1);
      } else if (regPassword.test(password) !== true) {
        $signUp.parentElement.href = "";
        sessionStorage.setItem("error", 2);
      } else if (password !== passwordconfirm) {
        $signUp.parentElement.href = "";
        sessionStorage.setItem("error", 3);
      } else {
        // 회원가입 유저 요청 데이터
        const createdUser = {
          name: name,
          userId: email,
          password: password,
          checkPassword: passwordconfirm,
        };
        // const dd = JSON.stringify(createdUser);
        // console.log(dd);
        const signupURL =
          "http://elice-kdt-sw-1st-vm08.koreacentral.cloudapp.azure.com:5000/signup";
        // `http://localhost:8080/signup;`;
        // 서버 전달
        fetch(signupURL, {
          method: "POST",
          body: JSON.stringify(createdUser),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              alert("에러");
              console.log(response);
            } else {
              localStorage.setItem("signup", true);
              response.json();
            }
          })
          .then((res) => console.log(res))
          .catch((e) => console.log(e));
      }
    });
  }
}
