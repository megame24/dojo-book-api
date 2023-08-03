import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import objectSupport from "dayjs/plugin/objectSupport";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DateServiceImpl } from "./dateService";
import { EmailServiceImpl } from "./emailService";
import { FileServiceImpl } from "./fileService";
import { UUIDServiceImpl } from "./uuidService";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(dayOfYear);
dayjs.extend(objectSupport);

export const emailServiceImpl = new EmailServiceImpl(
  SESClient,
  SendEmailCommand
);
export const uuidServiceImpl = new UUIDServiceImpl(uuidv4);
export const fileServiceImpl = new FileServiceImpl();
export const dateServiceImpl = new DateServiceImpl(dayjs);
