require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Agency } from "./entities/Agency";
import { Category } from "./entities/Category";
import { Complaint } from "./entities/Complaint";
import { Notification } from "./entities/Notification";
import { NotificationPreferences } from "./entities/NotificationPreferences";

export const AppDataSource = new DataSource({
  type: "postgres",
  ...(process.env.NODE_ENV === "production"
      ? {
          url: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false
          },
          extra: {
            ssl: {
                rejectUnauthorized: false
            }
        }
      }
      : {
          host: process.env.DB_HOST || "localhost",
          port: parseInt(process.env.DB_PORT) || 5432,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
      }),
  synchronize: false,
  logging: true,
  entities: [User, Agency, Category, Complaint, Notification, NotificationPreferences],
  migrations: [],
  migrationsRun: false,
  subscribers: []
});