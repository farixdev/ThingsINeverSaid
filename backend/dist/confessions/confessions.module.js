"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfessionsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const confession_entity_1 = require("./confession.entity");
const confessions_service_1 = require("./confessions.service");
const confessions_controller_1 = require("./confessions.controller");
let ConfessionsModule = class ConfessionsModule {
};
exports.ConfessionsModule = ConfessionsModule;
exports.ConfessionsModule = ConfessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([confession_entity_1.Confession])],
        controllers: [confessions_controller_1.ConfessionsController],
        providers: [confessions_service_1.ConfessionsService],
        exports: [confessions_service_1.ConfessionsService],
    })
], ConfessionsModule);
//# sourceMappingURL=confessions.module.js.map