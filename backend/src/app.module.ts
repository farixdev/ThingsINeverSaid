import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ConfessionsModule } from "./confessions/confessions.module";
import { FirebaseModule } from "./firebase/firebase.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    FirebaseModule,
    ConfessionsModule,
  ],
})
export class AppModule {}
