import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

@Injectable()
export class FirebaseService {
  private firestore: Firestore;

  constructor(private config: ConfigService) {
    const projectId = this.config.get<string>("FIREBASE_PROJECT_ID");
    const clientEmail = this.config.get<string>("FIREBASE_CLIENT_EMAIL");
    let privateKey = this.config.get<string>("FIREBASE_PRIVATE_KEY");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Missing Firebase environment variables. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
      );
    }

    privateKey = privateKey.replace(/\\n/g, "\n");

    const app = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });

    this.firestore = getFirestore(app);
  }

  get db() {
    return this.firestore;
  }
}
