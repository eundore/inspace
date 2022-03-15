import AbstractView from "./AbstractView.js";
//import loginHandler from "../js/handler/loginHandler.js";
// import jwt from "../../../backend/passport/strategies/jwt.js";
import parseJwt from "../js/handler/tokenHandler.js";
// import jwt_decode from "jwt-decode";
import toast from "../js/common/toast.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("InSpace");
  }
  async getHtml() {
    return await super.getHtml("login");
  }

  defaultFunc() {
    if (localStorage.getItem("token")) {
      document.getElementById("login-Btn").parentElement.href = "/main";
      document.getElementById("login-Btn").click();
    } else {
      sessionStorage.clear();
      // const script = document.createElement("script");
      // script.src =
      //   "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
      // document.getElementById("root").appendChild(script);

      setTimeout(() => {
        const signup = localStorage.getItem("signup");
        if (signup) {
          toast("회원가입이 완료되었습니다! 로그인 해주세요.");
          localStorage.removeItem("signup");
        }
      }, 500);

      // @@@@@ 로그인 기능 @@@@@@
      const $loginBtn = document.getElementById("login-Btn");
      $loginBtn.addEventListener("click", (e) => {
        const target = $loginBtn.parentElement;
        const href = target.getAttribute("href");
        if (href === null) {
          // id, password 입력값 받기

          // let loginSuccess = false;

          let ID = document.getElementById("ID").value;
          let PASSWORD = document.getElementById("password").value;

          // 예외처리
          if (ID.length < 6) {
            toast("6자 이상 아이디를 입력해주세요.");
          } else if (PASSWORD.length < 8) {
            toast("8자 이상 비밀번호를 입력해주세요.");
          } else {
            // 전달할 유저 데이터
            const loginUser = {
              userId: ID,
              password: PASSWORD, // 유저스키마에 패스워드 저장할 때 해시값 사용하면 해시값으로 변경후 password 전송
            };

            const loginURL =
              "http://elice-kdt-sw-1st-vm08.koreacentral.cloudapp.azure.com:5000/login";
            //서버 fetch
            fetch(loginURL, {
              method: "POST",
              body: JSON.stringify(loginUser),
              cache: "no-cache",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((res) => {
                if (res.ok) {
                  return res.json();
                } else {
                  toast("존재하지 않는 회원이거나 아이디 비밀번호가 틀립니다.");
                  throw new Error("아이디가 틀립니다.");
                }
              })
              .then((data) => {
                const token = data.token;
                const tokenKey = "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";
                const decoded = parseJwt(token);
                // const decoded = jwt_decode(token);
                //console.log(decoded);
                localStorage.setItem("token", data.token);
                localStorage.setItem("checkIn", decoded.checkIn);
                localStorage.setItem("id", decoded.id);
                localStorage.setItem("userId", decoded.userId);
                localStorage.setItem("name", decoded.name);

                target.setAttribute("href", "/main");
                target.setAttribute("data-link", "true");
                $loginBtn.click();
              })
              .catch((err) => {
                console.log(err);
              });
            // sessionStorage.setItem("history", "login");
            // function movePage() {
            //   $loginBtn.parentElement.href = "/main"
            //}
          }
        }
      });
    }
  }
}
