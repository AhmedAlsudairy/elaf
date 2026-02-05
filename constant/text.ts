import { SectorEnum } from "@prisma/client";

export { SectorEnum };

export enum TenderStatus {
    Open = 'open',
    Closed = 'closed',
    Awarded = 'awarded',
    Done= "done"
  }
  