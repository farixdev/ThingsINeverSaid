"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const confessions_service_1 = require("./confessions/confessions.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const confessionsService = app.get(confessions_service_1.ConfessionsService);
    await confessionsService.seed();
    await app.listen(3333);
    console.log(`\n✦ Things I Never Said — Backend running on http://localhost:3333\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map