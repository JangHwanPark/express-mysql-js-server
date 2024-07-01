// 모듈 임포트
import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// 라우터 임포트
import booksRouter from "./routes/products/books.js";
import authRouter from "./routes/auth/auth.js";
import adminRouter from "./routes/users.js";
import coupangRouter from "./routes/products/coupang.js";
import {retryMiddleware, timeoutMiddleware} from "./middlewares/retry.js";
import githubRouter from "./routes/github/issue.js"

// __dirname 및 __filename 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// 서버 설정
const app = express();
dotenv.config();         // 환경변수 읽어오기
app.use(cors());         // 모든 프론트 서버 허용
app.use(express.json()); // JSON 형식의 요청 본문을 파싱


// ejs 를 사용자 뷰 엔진으로 설정
app.set('view engine', 'ejs');

// 뷰 파일의 디렉토리 설정
app.set('views', path.join(__dirname, 'views'));

// 정적파일 적용 - 정적 파일을 서빙할 디렉토리 설정
app.use(express.static(path.join(__dirname, 'public')));

// Index page
app.get("/", (req, res) => {
    const data = {
        title: "학술",
        message: "MOCK",
        endpoints: [
            { method: "GET", url: `${process.env.DOMAIN}/admin/users`, description: "전체 유저 조회", id: "user-count" },
            { method: "GET", url: `${process.env.DOMAIN}/books/books`, description: "전체 책 조회", id: "book-count" },
            { method: "GET", url: `${process.env.DOMAIN}/coupang_products/all`, description: "전체 쿠팡 제품 조회", id: "coupang-count" }
        ],
        specificEndpoints: [
            { method: "GET", url: `${process.env.DOMAIN}/admin/user/000043c2-b919-4281-9dab-f2a5b446973b`, description: "특정 유저 조회" },
            { method: "GET", url: `${process.env.DOMAIN}/books/info/1`, description: "특정 책 조회" },
            { method: "GET", url: `${process.env.DOMAIN}/coupang_products/product/1`, description: "특정 제품 조회" },
            { method: "GET", url: `${process.env.DOMAIN}/coupang_products/food`, description: "특정 카테고리 조회" }
        ],
        inputSections: [
            { type: "users", label: "/admin/user/", placeholder: "유저의 ID를 입력하세요" },
            { type: "books", label: "/books/info/", placeholder: "책의 ID를 입력하세요" },
            { type: "products", label: "/coupang_products/product/", placeholder: "제품의 ID를 입력하세요" },
            { type: "github", label: "/github/repos/", placeholder: "유저 ID/레포지트리 이름" }
        ]
    };

    res.render("index", data);
});

// Router
app.use("/auth", authRouter)
app.use("/books", booksRouter);
app.use("/users", adminRouter)
app.use("/coupang-products", coupangRouter);
app.use("/github", githubRouter);
// Timeout
app.use(timeoutMiddleware);
app.use(retryMiddleware);

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`서버 시작 Port: ${process.env.PORT}`)
})