import axios from 'axios';
import queryString from 'query-string';
import { TradeHistoryInterface, TradeHistoryGetQueryInterface } from 'interfaces/trade-history';
import { GetQueryInterface } from '../../interfaces';

export const getTradeHistories = async (query?: TradeHistoryGetQueryInterface) => {
  const response = await axios.get(`/api/trade-histories${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTradeHistory = async (tradeHistory: TradeHistoryInterface) => {
  const response = await axios.post('/api/trade-histories', tradeHistory);
  return response.data;
};

export const updateTradeHistoryById = async (id: string, tradeHistory: TradeHistoryInterface) => {
  const response = await axios.put(`/api/trade-histories/${id}`, tradeHistory);
  return response.data;
};

export const getTradeHistoryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/trade-histories/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTradeHistoryById = async (id: string) => {
  const response = await axios.delete(`/api/trade-histories/${id}`);
  return response.data;
};
