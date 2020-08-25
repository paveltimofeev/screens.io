import { IReportReader, ILogger } from '../../domain/models';
import { ReportReader } from './report-reader';


export class EngineFactory {

    static createReportReader(logger: ILogger) : IReportReader {

        return new ReportReader(logger);
    }
}
