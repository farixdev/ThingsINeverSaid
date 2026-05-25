import { Module } from "@nestjs/common";
import { ConfessionsController } from "./confessions.controller";
import { ConfessionsService } from "./confessions.service";
import { FirebaseModule } from "../firebase/firebase.module";

@Module({
  imports: [FirebaseModule],
  controllers: [ConfessionsController],
  providers: [ConfessionsService],
})
export class ConfessionsModule {}
