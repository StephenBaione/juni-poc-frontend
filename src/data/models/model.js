import { generateUUID } from '../../utils/uuid';

class Model {
    constructor(modelData) {
        this.id = modelData.id ? modelData.id : generateUUID();
        this.name = modelData.name;
        this.external = modelData.external;
        this.owner = owner;
        this.created_at = modelData.created_at;
        this.updated_at = modelData.updated_at;
        this.completionType = modelData.completionType;
    }
    // class Model(pydantic.BaseModel):
    // name: str
    // id: str
    // external: bool
    // owner: str
    // created_at: str
    // updated_at: str

    // def __init__(__pydantic_self__, **data: Any) -> None:
    //     super().__init__(**data)
}
