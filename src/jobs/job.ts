import * as schedule from "node-schedule";
import { PoolEventsFetcher, PoolValuesFetcher } from "../lib/pool";

let padZero = (v: number, n = 2) => `${v}`.padStart(n, "0");
let toTime = (v: number) =>
  `elapsed (hh:mm:ss:ms) ${padZero(Math.floor(v / (60 * 60000)))}:${padZero(Math.floor(v / 60000))}:${padZero(Math.floor(v / 1000))}:${padZero(Math.floor(v % 1000), 3)}`;

class job {
  constructor() {

  }
  public PoolEvents() {
    schedule.scheduleJob('40 * * * *', async function () {
      let start = performance.now();
      console.log("Run PoolEvents")
      const pooleventsfetcher = new PoolEventsFetcher(
        "morphine-indexer-1",
        "goerli-2.starknet.stream.apibara.com:443"
      );
      await pooleventsfetcher.run()
      console.log(`--- end | ${toTime(performance.now() - start)}`)
    });
  }

  public PoolValues() {
    schedule.scheduleJob('35 * * * *', async function () {
      let start = performance.now();
      console.log("Run PoolValues")
      const poolvaluesfetcher = new PoolValuesFetcher();
      await poolvaluesfetcher.PoolIterations();
      console.log(`--- end | ${toTime(performance.now() - start)}`)
    });
  }
}

export default new job();