import { BaseAdapter } from "../../../shared/core/types";
import { ForgotPassword } from "../../useCases/forgotPassword";

export default class ForgotPasswordController extends BaseAdapter {
  constructor(private forgotPassword: ForgotPassword) {
    super();
  }

  async execute(req: any, res: any, next: any) {
    const forgotPasswordDTO = {
      email: req.body.email,
    };

    try {
      await this.forgotPassword.execute(forgotPasswordDTO);
      res.status(200).json({ message: "Reset password mail sent" });
    } catch (error) {
      next(error);
    }
  }
}
