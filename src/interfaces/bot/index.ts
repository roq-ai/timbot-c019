import { TradeHistoryInterface } from 'interfaces/trade-history';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface BotInterface {
  id?: string;
  settings: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  trade_history?: TradeHistoryInterface[];
  organization?: OrganizationInterface;
  _count?: {
    trade_history?: number;
  };
}

export interface BotGetQueryInterface extends GetQueryInterface {
  id?: string;
  settings?: string;
  organization_id?: string;
}
