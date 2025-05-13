'use client'

import React, { useEffect, useMemo, useState } from "react";


import { CreateOrderFormsType } from "../../types";

import OrderBookPrice from "./orderBookPrices";
import AssetBalance from "./assetBalance";

import { SelectInput } from "../selectInput";


interface ModalProps extends CreateOrderFormsType {
    isOpen: boolean;
    onClose: () => void;
}


interface AssestBalanceType {
    asset: string;
    balance: number;
}

export default function ModalCreateOrder({ isOpen, onClose, symbol, market, environment, interval }: ModalProps) {

    if (!isOpen) return null;

    const [orderSide, setOrderSide] = useState('BUY');
    const [orderType, setOrderType] = useState('LIMIT');

    const [quantity, setQuantity] = useState<number>(0);

    const [baseAsset, setBaseAsset] = useState<AssestBalanceType | null>(null);
    const [quoteAsset, setQuoteAsset] = useState<AssestBalanceType | null>(null);

    const [bestBidPrice, setBestBidPrice] = useState<number>(0);
    const [bestAskPrice, setBestAskPrice] = useState<number>(0);


    const amount = useMemo(() => {
        if (!quantity) return 0;
      
        return orderSide === 'BUY'
          ? bestBidPrice * quantity
          : bestAskPrice * quantity;

    }, [orderSide, quantity, bestBidPrice, bestAskPrice])



    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-gray-200 rounded-xl p-6 shadow-xl relative w-full max-w-md">
                {/* Botão de Fechar */}
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200 text-2xl cursor-pointer"
                    onClick={onClose}
                >
                    &times;
                </button>

                {/* Conteúdo do Modal */}
                <form className="space-y-4">

                    <div className="flex gap-4">

                        <div className="w-1/2">
                            <label htmlFor="symbol-form-order" className="block text-sm font-medium text-gray-700" >
                                Symbol
                            </label>
                            <input 
                                id="symbol-form-order"
                                type="text"
                                readOnly
                                value={symbol}
                                className="w-full bg-white text-black font-bold border border-gray-300 rounded px-3 py-2 cursor-not-allowed opacity-100 focus:outline-none"
                            />
                        </div>

                        <div className="w-1/2">
                            <OrderBookPrice 
                                symbol={symbol}
                                market={market}
                                environment={environment}
                                setBestAskPrice={setBestAskPrice}
                                setBestBidPrice={setBestBidPrice}
                                bestAskPrice={bestAskPrice}
                                bestBidPrice={bestBidPrice}
                            />
                        </div>
                    </div>

                    <div>
                        <AssetBalance 
                        
                            symbol={symbol}
                            environment={environment}
                            market={market}
                            baseAsset={baseAsset}
                            setBaseAsset={setBaseAsset}
                            quoteAsset={quoteAsset}
                            setQuoteAsset={setQuoteAsset}
                        />
                    </div>

                    <div className="flex">
                        <div className="w-1/2">
                            <SelectInput 
                                id="order-side"
                                className="text-gray-900 text-xs"
                                onChange={setOrderSide}
                                options={['BUY', 'SELL']}
                                value={orderSide}
                            />
                        </div>

                        <div className="w-1/2">
                            <SelectInput 
                                id="order-type"
                                className="text-gray-900 text-xs"
                                onChange={setOrderType}
                                options={market === 'futures'? ['LIMIT', 'MARKET', 'STOP_MARKET', 'TAKE_PROFIT_MARKET', 'STOP_LIMIT', 'TAKE_PROFIT_LIMIT'] : ['MARKET', 'LIMIT', 'STOP_LOSS', 'TAKE_PROFIT', 'STOP_LOSS_LIMIT', 'TAKE_PROFIT_LIMIT']}
                                value={orderType} 
                            />
                        </div>

                    </div>


                    <div className="flex text-gray-900">

                        <div className="flex flex-col">
                            <label htmlFor="qty-order">Quantity</label>
                            <input
                                id="qty-order"
                                type="number"
                                step={0.0001}
                                onChange={e => setQuantity(Number(e.target.value))}
                                value={quantity}
                            
                            />
                        </div>
                        
                        <div className="flex flex-col">
                            <label htmlFor="amount-order">Amount</label>
                            <input
                                id="amount-order"
                                type="text"
                                disabled
                                // onChange={e => setQuantity(Number(e.target.value))}
                                value={`U$ ${amount.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 6,
                                })}`}
                            
                            />
                        </div>

                    </div>
                    
                    <div className="flex text-gray-900">

                        <div className="flex flex-col">
                            <label htmlFor="qty-order">Stop Loss</label>
                            <input
                                id="qty-order"
                                type="number"
                                step={0.0001}
                                onChange={e => setQuantity(Number(e.target.value))}
                                value={quantity}
                            
                            />
                        </div>
                        
                        <div className="flex flex-col">
                            <label htmlFor="amount-order">Take Profit</label>
                            <input
                                id="amount-order"
                                type="text"
                                disabled
                                // onChange={e => setQuantity(Number(e.target.value))}
                                value={`U$ ${amount.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 6,
                                })}`}
                            
                            />
                        </div>

                    </div>

                    <div>
                        <button className="bg-black cursor-pointer">Create Order</button>
                    </div>


                </form>


            </div>
        </div>
    );
}
