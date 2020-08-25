import { IReportReader } from '../../domain/task-processor';
import { ReportReader } from './report-reader';
import { ILogger } from '../../domain/models';

export class EngineFactory {

    static createReportReader(logger: ILogger) : IReportReader {

        return new ReportReader(logger);
    }
}
