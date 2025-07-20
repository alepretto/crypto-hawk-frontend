'use client'

import axios from "axios";
import { useEffect } from "react";


import { AssestBalanceType } from '../../types'


interface RequestSymbolBalanceType {
    symbol: string;
    market: string;
    environment: string;
    setBaseAsset: (valor: AssestBalanceType) => void;
    setQuoteAsset: (valor: AssestBalanceType) => void;
}



export default function AssetBalance({ symbol, market, environment, setBaseAsset, setQuoteAsset }: RequestSymbolBalanceType) {

    const getBalance = async () => {

        try {
            // setLoading(true);
            const { data } = await axios.get(`/api/binance/balance/symbol`, {
                params: {
                    environment,
                    market,
                    symbol
                }
            });
            // console.log(data.balance)
            setBaseAsset(data.balance?.base_asset);
            setQuoteAsset(data.balance?.quote_asset);

        } catch(error) {
            console.error(error);
        }
    }


     useEffect(() => {

        getBalance();

     }, [symbol, market, environment]);



    return null;

}
