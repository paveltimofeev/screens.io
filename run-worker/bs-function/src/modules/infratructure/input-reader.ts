import { IInputReader, Task } from "../../domain/task-processor";


export class InputReader implements IInputReader {
    
    getTask(): Task {
        
        throw new Error("Method not implemented.");
    }
}
