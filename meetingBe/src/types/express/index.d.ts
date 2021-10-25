import { Application } from "express";
import { Server } from "socket.io";

export interface MyApplication extends Application {
  io?: any
}

declare module "express" {
  export interface Request {
    userData?: Record<string, any>
    app: MyApplication
  }

}