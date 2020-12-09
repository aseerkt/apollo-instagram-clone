"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const graphql_upload_1 = require("graphql-upload");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
const User_1 = require("../entities/User");
const isAuth_1 = require("../middlewares/isAuth");
const postTypes_1 = require("../types/postTypes");
let PostResolver = class PostResolver {
    getPosts() {
        return Post_1.Post.find();
    }
    addPost(caption, file, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (caption.length < 5) {
                return { error: 'Caption must be at least 5 characters long' };
            }
            const { filename, createReadStream } = file;
            console.log('Hero goes file', file);
            const uploadTime = new Date().toISOString();
            return new Promise((resolve) => {
                createReadStream()
                    .pipe(fs_1.createWriteStream(path_1.default.join(__dirname, `../../images/${uploadTime}_${filename}`)))
                    .on('finish', () => __awaiter(this, void 0, void 0, function* () {
                    console.log('finished upload');
                    const user = yield User_1.User.findOne({ id: req.session.userId });
                    const post = Post_1.Post.create({
                        caption,
                        imgURL: `${req.headers.host}/images/${uploadTime}_${filename}`,
                        user,
                    });
                    yield post.save();
                    resolve({ post });
                }))
                    .on('error', (err) => {
                    console.log(err);
                    resolve({ error: err.message });
                });
            });
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Post_1.Post]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "getPosts", null);
__decorate([
    type_graphql_1.Mutation(() => postTypes_1.PostResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('caption')),
    __param(1, type_graphql_1.Arg('image', () => graphql_upload_1.GraphQLUpload)),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "addPost", null);
PostResolver = __decorate([
    type_graphql_1.Resolver()
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=PostResolver.js.map