'use client'

import axios from "axios";
import { useEffect, useState } from "react";


interface RequestSymbolBalanceType {
    symbol: string;
    market: string;
    environment: string;
    baseAsset: AssestBalanceType | null;
    quoteAsset: AssestBalanceType | null;
    setBaseAsset: (valor: AssestBalanceType) => void;
    setQuoteAsset: (valor: AssestBalanceType) => void;
}


interface AssestBalanceType {
    asset: string;
    balance: number;
}


export default function AssetBalance({ symbol, market, environment, setBaseAsset, setQuoteAsset, baseAsset, quoteAsset }: RequestSymbolBalanceType) {

    // const [baseAsset, setBaseAsset] = useState<AssestBalanceType | null>(null);
    // const [quoteAsset, setQuoteAsset] = useState<AssestBalanceType | null>(null);

    // const [loading, setLoading] = useState(false);


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
            setBaseAsset(data.balance.base_asset);
            setQuoteAsset(data.balance.quote_asset);

        } catch(error) {
            console.error(error);
        } finally {
            // setLoading(false);
        }
    }


     useEffect(() => {

        getBalance();

     }, [symbol, market, environment]);



    return (
        <div className="text-black">
            <span>You Have:</span>
            <div>
                <input 
                    type="text" 
                    disabled
                    value={baseAsset ? `${baseAsset.asset}: ${baseAsset.balance.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                    })}` : 'Carregando'}
                />

                <input 
                    type="text" 
                    disabled
                    value={quoteAsset ? `${quoteAsset.asset}: ${quoteAsset.balance.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}` : 'Carregando'}
                />
            </div>

        </div>
    );
}
