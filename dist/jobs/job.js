"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schedule = __importStar(require("node-schedule"));
const pool_1 = require("../lib/pool");
const multicall_1 = require("../lib/multicall");
const drip_1 = require("../lib/drip");
const driptransit_1 = require("../lib/driptransit");
let padZero = (v, n = 2) => `${v}`.padStart(n, "0");
let toTime = (v) => `elapsed (hh:mm:ss:ms) ${padZero(Math.floor(v / (60 * 60000)))}:${padZero(Math.floor(v / 60000))}:${padZero(Math.floor(v / 1000))}:${padZero(Math.floor(v % 1000), 3)}`;
class job {
    constructor() {
    }
    PoolEvents() {
        schedule.scheduleJob('05 * * * *', async function () {
            let start = performance.now();
            console.log("Run PoolEvents");
            const pooleventsfetcher = new pool_1.PoolEventsFetcher("morphine-indexer-1", "goerli-2.starknet.stream.apibara.com:443");
            await pooleventsfetcher.run();
            console.log(`--- end | ${toTime(performance.now() - start)}`);
        });
    }
    PoolValues() {
        schedule.scheduleJob('23 * * * *', async function () {
            let start = performance.now();
            console.log("Run PoolValues");
            const poolvaluesfetcher = new pool_1.PoolValuesFetcher();
            await poolvaluesfetcher.PoolIterations();
            console.log(`--- end | ${toTime(performance.now() - start)}`);
        });
    }
    PoolInterestRateModel() {
        schedule.scheduleJob('20 * * * *', async function () {
            let start = performance.now();
            console.log("Run PoolInterestRateModel");
            const poolinterestratemodelfetcher = new pool_1.PoolInterestRateModelFetcher();
            await poolinterestratemodelfetcher.PoolIterations();
            console.log(`--- end | ${toTime(performance.now() - start)}`);
        });
    }
    MulticallEvents() {
        schedule.scheduleJob('30 * * * *', async function () {
            let start = performance.now();
            console.log("Run MulticallEvents");
            const driptransitsfetcher = new driptransit_1.DripTransitsFetcher("morphine-indexer-1", "goerli-2.starknet.stream.apibara.com:443");
            const driptransits = await driptransitsfetcher.get();
            for (let driptransit of driptransits) {
                const multicalleventsfetcher = new multicall_1.DripEventsFetcher("morphine-indexer-1", "goerli-2.starknet.stream.apibara.com:443");
                console.log(`-- fetching for drip ${driptransit.dtaddress}`);
                await multicalleventsfetcher.run(driptransit);
            }
            console.log(`--- end | ${toTime(performance.now() - start)}`);
        });
    }
    ActiveDrips() {
        schedule.scheduleJob('30 * * * *', async function () {
            let start = performance.now();
            console.log("Run ActiveDripsFetcher");
            const driptransitsfetcher = new driptransit_1.DripTransitsFetcher("morphine-indexer-1", "goerli-2.starknet.stream.apibara.com:443");
            const driptransits = await driptransitsfetcher.get();
            for (let driptransit of driptransits) {
                console.log(`-- fetching for pool: ${driptransit.pool}`);
                const activedripsfetcher = new drip_1.ActiveDripsFetcher("morphine-indexer-1", "goerli-2.starknet.stream.apibara.com:443");
                await activedripsfetcher.run(driptransit);
            }
            console.log(`--- end | ${toTime(performance.now() - start)}`);
        });
    }
    DripsValues() {
        schedule.scheduleJob('40 * * * *', async function () {
            let start = performance.now();
            console.log("Run DripsValues");
            const dripsvaluesfetcher = new drip_1.DripValuesFetcher();
            await dripsvaluesfetcher.DripIterations();
            console.log(`--- end | ${toTime(performance.now() - start)}`);
        });
    }
}
exports.default = new job();
//# sourceMappingURL=job.js.map