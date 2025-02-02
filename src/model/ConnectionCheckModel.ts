import { inject, injectable } from 'inversify';
import mirakurun from 'mirakurun';
import Util from '../util/Util';
import IDBOperator from './db/IDBOperator';
import IConnectionCheckModel from './IConnectionCheckModel';
import ILogger from './ILogger';
import ILoggerModel from './ILoggerModel';
import IMirakurunClientModel from './IMirakurunClientModel';

@injectable()
export default class ConnectionCheckModel implements IConnectionCheckModel {
    private log: ILogger;
    private mirakurunClient: mirakurun;
    private dbOperator: IDBOperator;

    constructor(
        @inject('ILoggerModel') logger: ILoggerModel,
        @inject('IMirakurunClientModel') mirakurunClientModel: IMirakurunClientModel,
        @inject('IDBOperator') dbOperator: IDBOperator,
    ) {
        this.log = logger.getLogger();
        this.mirakurunClient = mirakurunClientModel.getClient();
        this.dbOperator = dbOperator;
    }

    /**
     * mirakurun との接続を待つ
     * @return Promise<void>
     */
    public async checkMirakurun(): Promise<void> {
        this.log.system.info('check mirakurun');
        await this.mirakurunClient.getStatus();
    }

    /**
     * DB との接続を待つ
     */
    public async checkDB(): Promise<void> {
        while (true) {
            this.log.system.info('check db');
            await this.dbOperator.checkConnection();
            break;
        }
    }
}
