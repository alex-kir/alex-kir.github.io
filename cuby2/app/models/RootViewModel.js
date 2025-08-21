
import HouseViewModel from './HouseViewModel.js'
import HouseModel from './HouseModel.js'

export default class RootViewModel {

    #houseViewModel = new HouseViewModel();
    get houseViewModel() { return this.#houseViewModel; }

    houseModel = new HouseModel();

    constructor() {

    }
}
