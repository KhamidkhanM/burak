import ViewModel from "../schema/View.model"; // the Mongoose model/collection
class ViewService {
    private readonly viewModel;

    constructor() {
        this.viewModel = ViewModel;
    }
}