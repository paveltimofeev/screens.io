import { ConfigurationService } from './configuration-service';

const appConfig = ConfigurationService.getAppConfig();
const path = require('path');


export class FilePathsService {

    vrtDataFullPath () {
        return appConfig.vrtDataFullPath;
    }

    relativeToVrtDataPath (fullPath: string): string {
        if (!fullPath) {
            return fullPath;
        }
        return path.relative(this.vrtDataFullPath(), fullPath )
    }

    pairItemFullPath (pairItemPath: string): string {
        return path.join(this.vrtDataFullPath(), 'html_report', pairItemPath)
    }

    reportItemFullPath (tenant: string, userid: string, runId: string, reportItemPath: string): string {

        return path.join(this.vrtDataFullPath(), tenant, userid, 'json_report', runId, reportItemPath)
    }

    pairItemRelativePath (pairItemPath: string): string {
        return path.relative(this.vrtDataFullPath(), this.pairItemFullPath(pairItemPath) )
    }
}
