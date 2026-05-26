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
exports.ConfessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const confession_entity_1 = require("./confession.entity");
let ConfessionsService = class ConfessionsService {
    confessionRepo;
    constructor(confessionRepo) {
        this.confessionRepo = confessionRepo;
    }
    async findPaginated(page, limit, search) {
        const skip = (page - 1) * limit;
        let where = {};
        if (search && search.trim()) {
            where = [
                { title: (0, typeorm_2.ILike)(`%${search.trim()}%`) },
                { text: (0, typeorm_2.ILike)(`%${search.trim()}%`) },
                { author: (0, typeorm_2.ILike)(`%${search.trim()}%`) },
            ];
        }
        const [data, total] = await this.confessionRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });
        return {
            data,
            total,
            page,
            limit,
            hasMore: skip + data.length < total,
        };
    }
    async findOne(id) {
        return this.confessionRepo.findOne({ where: { id } });
    }
    async create(dto) {
        const confession = this.confessionRepo.create({
            title: dto.title || 'Untitled confession',
            text: dto.text,
            author: dto.author || 'Anonymous',
        });
        return this.confessionRepo.save(confession);
    }
    async seed() {
        if (process.env.SEED_CONFESSIONS !== 'true')
            return;
        const count = await this.confessionRepo.count();
        if (count > 0)
            return;
    }
};
exports.ConfessionsService = ConfessionsService;
exports.ConfessionsService = ConfessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(confession_entity_1.Confession)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConfessionsService);
//# sourceMappingURL=confessions.service.js.map