import { ConfigurationService } from './configuration-service';

const path = require('path');
const config = ConfigurationService.getConfig();


export class FilePathsService {

    vrtDataFullPath () {
        return config.vrtDataFullPath;
    }

    relativeToVrtDataPath (fullPath: string) {
        if (!fullPath) {
            return fullPath;
        }
        return path.relative(this.vrtDataFullPath(), fullPath )
    }

    pairItemFullPath (pairItemPath: string) {
        return path.join(this.vrtDataFullPath(), 'html_report', pairItemPath)
    }

    reportItemFullPath (tenant: string, userid: string, runId: string, reportItemPath: string) {

        return path.join(this.vrtDataFullPath(), tenant, userid, 'json_report', runId, reportItemPath)
    }

    pairItemRelativePath (pairItemPath: string) {
        return path.relative(this.vrtDataFullPath(), this.pairItemFullPath(pairItemPath) )
    }
}
