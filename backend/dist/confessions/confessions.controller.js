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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfessionsController = void 0;
const common_1 = require("@nestjs/common");
const confessions_service_1 = require("./confessions.service");
const create_confession_dto_1 = require("./dto/create-confession.dto");
let ConfessionsController = class ConfessionsController {
    confessionsService;
    constructor(confessionsService) {
        this.confessionsService = confessionsService;
    }
    async findAll(page, limit, search) {
        const safeLimit = Math.min(Math.max(limit, 1), 50);
        const safePage = Math.max(page, 1);
        return this.confessionsService.findPaginated(safePage, safeLimit, search);
    }
    async findOne(id) {
        const confession = await this.confessionsService.findOne(id);
        if (!confession) {
            throw new common_1.NotFoundException(`Confession #${id} not found`);
        }
        return confession;
    }
    async create(dto) {
        return this.confessionsService.create(dto);
    }
};
exports.ConfessionsController = ConfessionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(12), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], ConfessionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfessionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_confession_dto_1.CreateConfessionDto]),
    __metadata("design:returntype", Promise)
], ConfessionsController.prototype, "create", null);
exports.ConfessionsController = ConfessionsController = __decorate([
    (0, common_1.Controller)('confessions'),
    __metadata("design:paramtypes", [confessions_service_1.ConfessionsService])
], ConfessionsController);
//# sourceMappingURL=confessions.controller.js.map