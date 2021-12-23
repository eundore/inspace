var express = require("express");
var router = express.Router({});
const hashPassword = require("../utils/hash-password");
const asyncHandler = require("../utils/async-handler");
const { User, Ticket, Seat } = require("../models/index");
const generateRandomPassword = require("../utils/generate-random-password");
const sendMail = require("../utils/send-mail");
const passport = require("passport");

router.post(

    "/signup",
    asyncHandler(async(req, res, next) => {
        const { name, userId, password } = req.body;
        const hashedPassword = hashPassword(password);
        const existId = await User.findOne({ userId });
        if (existId) {
            throw new Error("사용중인 아이디입니다.");
            return;
        }
        // if (password != checkPassword) {
        //     throw new Error("비밀번호가 일치하지 않습니다.");
        //     return;
        // }
        //test



        await User.create({
            name,
            userId,
            password: hashedPassword,
        });

        res.status(201).json({ message: "success" });
    })
);

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/fail",

    }),
    function(req, res) {
        res.status(200).json({ message: "success" });
        console.log("세션1", req.session.passport.user.id)
        console.log("세션2", req.session)
    }
);

router.get(

    "/login",
    asyncHandler(async(req, res, next) => {
        // console.log("req.session1212", req.session);
        // const { id } = req.query;
        const id = req.session.passport.user.id;
        console.log("세션1", req.session.passport.user.id)
        console.log("세션2", req.session)
        const user = await User.findOne({ _id: id }).populate("userSeat");
        const { name, userId } = user;
        const checkIn = !user.userSeat.isempty;
        res.json({ checkIn, id: id, name, userId });
    })
);

//기존에 있던 로그아웃 파일
// router.get("/logout", (req, res, next) => {
//   req.logout();
//   res.status(204).json({ message: "success" });
// });


router.get(
    "/logout",
    asyncHandler(async(req, res, next) => {
        console.log('req.user ', req.user)
        const user = await User.findOne({ _id: req.user._id });
        console.log(req.user)
        req.logout();

        res.status(204).json({ message: "success" });
    })
);

router.post(
    "/reset-password",
    asyncHandler(async(req, res) => {
        const { userId } = req.body;
        const user = await User.findOne({ userId });
        if (!user) {
            throw new Error("해당 메일로 가입된 아이디가 없습니다.");
        }

        const password = generateRandomPassword();
        await User.updateOne({ userId }, {
            password: hashPassword(password),
        });

        await sendMail(
            userId,
            "비밀번호가 변경되었습니다.",
            `변경된 비밀번호는 : ${password} 입니다.`
        );
        res.status(200).json({ message: "success" });
    })
);

// router.post('/change-password', asyncHandler(async(req, res) => {
//     const { currentPassword, password } = req.body;
//     const user = await User.findOne({ _id: req.user.id });

//     if (user.password !== hashPassword(currentPassword)) {
//         throw new Error('임시 비밀번호가 일치하지 않습니다.');
//     }

//     await User.updateOne({ _id: user.id }, {
//         password: hashPassword(password),
//         passwordReset: false,

//     });

//     res.status(200).json({ message: "success" });
// }))

router.post(

    "/info-change-name",
    asyncHandler(async(req, res, next) => {
        const { name } = req.body;
        const user = await User.findOne({ _id: req.user.id });
        console.log("인포체인지네임에서 req.user", req.user);
        console.log("인포체인지에서 user", user);
        if (user.name == name) {
            throw new Error("변경 전 이름과 같습니다.");
        }
        await User.updateOne({ _id: user._id }, {
            name,
        });
        res.status(200).json({ message: "success" });
    })
);

router.post(
    "/info-change-password",
    asyncHandler(async(req, res, next) => {
        const { password, newpassword, confirmpassword } = req.body;
        const user = await User.findOne({ _id: req.user.id });
        // console.log("인포체인지에서 req.user", req.user);
        // console.log("인포체인지에서 user", user);
        if (user.isModified("password")) {
            throw new Error("기존 비밀번호를 다시 입력해주세요");
        } else if (hashPassword(password) == hashPassword(newpassword)) {
            throw new Error("기존비밀번호와 새 비밀번호를 다르게 입력해주세요");
        }
        if (newpassword != confirmpassword) {
            throw new Error("새비밀번호를 다시 확인해주세요.");
        }
        await User.updateOne({ _id: user._id }, {
            password: hashPassword(newpassword),
        });
        res.status(200).json({ message: "success" });
    })

);

module.exports = router;