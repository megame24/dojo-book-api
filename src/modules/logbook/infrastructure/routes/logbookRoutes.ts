import express from "express";
import multer from "multer";
import { Operation } from "../../../shared/accessControl";
import {
  accessControlMiddleware,
  endpointPermissionsMiddleware,
} from "../../../shared/adapters/middleware";
import { logbookAccessControl } from "../../accessControl";
import {
  createGoalController,
  createLogbookController,
  getLogbookController,
  updateGoalController,
} from "../../adapters/controllers";
import { createLogController } from "../../adapters/controllers";
import { getLiteLogbookImpl } from "../../useCases";
import endpointPolicy from "./endpointPolicy.json";

const logbookRouter = express.Router();

logbookRouter.post(
  "",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "logbook",
  }),
  createLogbookController.execute
);

logbookRouter.get(
  "/:logbookId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.GET,
    resourceType: "logbook",
    getResourceOrParent: getLiteLogbookImpl,
  }),
  getLogbookController.execute
);

logbookRouter.post(
  "/:logbookId/log",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "log",
    getResourceOrParent: getLiteLogbookImpl,
  }),
  multer().any(),
  createLogController.execute
);

logbookRouter.post(
  "/:logbookId/goal",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.CREATE,
    resourceType: "goal",
    getResourceOrParent: getLiteLogbookImpl,
  }),
  multer().any(),
  createGoalController.execute
);

logbookRouter.put(
  "/:logbookId/goal/:goalId",
  endpointPermissionsMiddleware.executeWrapper(endpointPolicy),
  accessControlMiddleware.executeWrapper({
    accessControl: logbookAccessControl,
    operation: Operation.UPDATE,
    resourceType: "goal",
    getResourceOrParent: getLiteLogbookImpl, /// update to getGoal
  }),
  multer().any(),
  updateGoalController.execute
);

export default logbookRouter;
