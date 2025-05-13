'use client'

import { useState } from "react"

import ModalCreateOrder from "./modal";

import { CreateOrderFormsType } from "../../types";




export default function CreateOrderComponent({ symbol, interval, market, environment }: CreateOrderFormsType) {


    const [isModalOpen, setIsModalOpen] = useState(false);



    return (
        <div className="">
            <button
                className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition duration-200 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
            >
                Abrir Modal
            </button>

            <ModalCreateOrder 
            
                symbol={symbol}
                interval={interval}
                market={market}
                environment={environment}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            
            />

        </div>
    );
}
