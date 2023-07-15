import { BotInterface } from 'interfaces/bot';
import { GetQueryInterface } from 'interfaces';

export interface TradeHistoryInterface {
  id?: string;
  trade_data: string;
  bot_id?: string;
  created_at?: any;
  updated_at?: any;

  bot?: BotInterface;
  _count?: {};
}

export interface TradeHistoryGetQueryInterface extends GetQueryInterface {
  id?: string;
  trade_data?: string;
  bot_id?: string;
}
