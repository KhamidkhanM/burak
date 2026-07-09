import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";

class ViewService {
    private readonly viewModel;

    constructor() {
        this.viewModel = ViewModel;
    }

    public async checkViewExistence(input: ViewInput): Promise<View> {
        return await this.viewModel
            .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
            .exec();
    }

    public async insertMemberView(input: ViewInput): Promise<View> {
        return await this.viewModel.create(input);
    }
}

export default ViewService;