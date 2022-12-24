import Adapter from "../../../shared/adapters/adapter";
import { CreateLog } from "../../useCases/createLog";

export default class CreateLogController extends Adapter {
  constructor(private createLog: CreateLog) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const createLogDTO = {
      userId: req.logbook.userId, // use the userId from the logbook, incase of logbook sharing
      logbook: req.logbook,
      message: req.body.message,
      durationOfWork: req.body.durationOfWork,
      user: req.user,
      ...(req.files && { file: req.files[0] }),
    };

    try {
      const log = await this.createLog.execute(createLogDTO);
      res.status(201).json({ logId: log.id });
    } catch (error) {
      next(error);
    }
  }
}
